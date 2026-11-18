import test from 'node:test';
import assert from 'node:assert/strict';
import {act,newGame,validateSave,DESTINATION,getLandmark,getScore,getEvent,GOODS} from './engine.mjs';
test('initial game is valid and has five survivors',()=>{const s=newGame({seed:42});assert.ok(validateSave(s));assert.equal(s.crew.length,5);assert.equal(s.distance,0);});
test('same seed gives deterministic travel and events',()=>{const s=newGame({seed:42});assert.deepEqual(act(s,'travel'),act(s,'travel'));assert.equal(s.distance,0);});
test('travelling spends fuel and advances time',()=>{const s=newGame({seed:17});const t=act(s,'travel');assert.ok(t.distance>0);assert.ok(t.fuel<s.fuel);assert.ok(t.day>s.day);});
test('trade does not produce negative credits',()=>{const s=newGame({seed:1});s.credits=0;const t=act(s,'buy',{item:'fuel'});assert.equal(t.credits,0);assert.equal(t.fuel,s.fuel);});
test('cannot act while an encounter is pending',()=>{const s=newGame({seed:1});s.pending=0;assert.deepEqual(act(s,'travel'),s);assert.equal(act(s,'choose',{index:1}).pending,null);});
test('repairs and medicine require inventory',()=>{const s=newGame({seed:1});s.parts=0;s.medicine=0;assert.equal(act(s,'repair').condition,s.condition);assert.equal(act(s,'heal').medicine,0);});
test('journey can end in victory',()=>{const s=newGame({seed:20});s.distance=DESTINATION-2;s.fuel=50;const t=act(s,'travel');assert.equal(t.end,'won');assert.equal(t.distance,DESTINATION);assert.ok(getScore(t)>0);});
test('health and supplies cannot drop below zero',()=>{let s=newGame({seed:2});s.food=1;s.water=1;for(let i=0;i<9;i++){s=act(s,'rest');if(s.end)break;}assert.ok(s.food>=0&&s.water>=0);assert.ok(s.crew.every(c=>c.health>=0));});
test('landmarks track progress',()=>{assert.equal(getLandmark(340).current.name,'The Dry Basin');assert.equal(getLandmark(340).next.name,'Blackglass Ridge');});
test('save validation rejects malformed values',()=>{assert.equal(validateSave({}),false);const s=newGame({seed:1});s.crew=[];assert.equal(validateSave(s),false);});
test('survival can be achieved without exploit mechanics',()=>{let wins=0;for(let seed=1;seed<=100;seed++){let s=newGame({seed});for(let step=0;step<180&&!s.end;step++){if(s.pending!==null)s=act(s,'choose',{index:1});else if(s.condition<60&&s.parts)s=act(s,'repair');else if(s.food<45&&s.credits>=GOODS.food.price)s=act(s,'buy',{item:'food'});else if(s.water<45&&s.credits>=GOODS.water.price)s=act(s,'buy',{item:'water'});else if(s.fuel<12&&s.credits>=GOODS.fuel.price)s=act(s,'buy',{item:'fuel'});else if(s.fuel<5||s.food<10||s.water<10)s=act(s,'scavenge');else s=act(s,'travel');}if(s.end==='won')wins++;}assert.ok(wins>=40,'expected at least 40 wins in 100 seeded runs, got '+wins);});

test('radio scanning produces a bulletin at most once per day',()=>{
  const first=act(newGame({seed:77}),'tune');
  assert.match(first.broadcast, /./);
  assert.equal(first.lastRadioDay,first.day);
  const second=act(first,'tune');
  assert.equal(second.broadcast,first.broadcast);
  assert.match(second.log[0].message,/Only static/);
});

test('crossing a new landmark triggers a dedicated story scene',()=>{
  const s=newGame({seed:36});s.distance=150;
  const travelled=act(s,'travel');
  assert.equal(getEvent(travelled).id,'ashwood');
  assert.deepEqual(travelled.checkpointSeen,[160]);
  const decided=act(travelled,'choose',{index:0});
  assert.equal(decided.pending,null);
  assert.ok(decided.seen.includes('ashwood'));
  assert.ok(decided.food>0);
});

test('unaffordable story choices fail without negative balances or deadlocks',()=>{
  const s=newGame({seed:78});s.parts=0;s.pending=3;
  const next=act(s,'choose',{index:0});
  assert.equal(next.pending,null);
  assert.equal(next.parts,0);
  assert.equal(next.day,2);
  assert.match(next.log[0].message,/lacked/);
});

test('role bonuses change repairs while keeping crew losses permanent',()=>{
  const s=newGame({seed:21});s.condition=50;
  const withMechanic=act(s,'repair');
  const without=structuredClone(s);without.crew[2].health=0;
  const withoutMechanic=act(without,'repair');
  assert.equal(withMechanic.condition-withoutMechanic.condition,8);
  assert.equal(withoutMechanic.crew[2].health,0);
});

test('old saves without narrative metadata migrate on first action',()=>{
  const old=newGame({seed:2});
  delete old.seen;delete old.checkpointSeen;delete old.broadcast;delete old.lastRadioDay;
  old.crew.forEach(c=>delete c.role);
  assert.equal(validateSave(old),true);
  const migrated=act(old,'scavenge');
  assert.ok(Array.isArray(migrated.seen));
  assert.ok(Array.isArray(migrated.checkpointSeen));
  assert.equal(typeof migrated.broadcast,'string');
  assert.equal(migrated.crew[2].role,'Mechanic');
});

test('event pool and milestone data preserve stable old save indices',()=>{
  const s=newGame({seed:1});s.pending=0;
  assert.equal(getEvent(s).id,'shortwave');
  s.pending=8;assert.equal(getEvent(s).id,'haven_signal');
  s.pending='milestone:905';assert.equal(getEvent(s).id,'pass');
  assert.equal(validateSave(s),true);
});
