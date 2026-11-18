import {EVENTS, MILESTONE_EVENTS, RADIO_LINES, ROLES, OBITUARIES} from './story.mjs';

export const DESTINATION=1250;
export const MAX_DAYS=68;
export const LANDMARKS=[
  {mile:0,name:'The Departure',description:'The last light in the east fades.'},
  {mile:160,name:'Ashwood Junction',description:'A maze of dead freeways.'},
  {mile:335,name:'The Dry Basin',description:'Even the reservoir has given up.'},
  {mile:525,name:'Blackglass Ridge',description:'The hills burned until the earth turned to glass.'},
  {mile:720,name:'Relay Station Nine',description:'An old transmitter blinks in the dark.'},
  {mile:905,name:'The Broken Pass',description:'One narrow passage through the mountains.'},
  {mile:1080,name:'The Green Line',description:'Actual trees. Nobody knows what to say.'},
  {mile:1250,name:'Haven',description:'The lights ahead are real.'}
];
export const GOODS={food:{label:'Rations',price:5,amount:16},water:{label:'Water',price:5,amount:16},fuel:{label:'Fuel',price:9,amount:15},parts:{label:'Spare parts',price:12,amount:1},medicine:{label:'Medicine',price:14,amount:1}};
export const CREW_NAMES=ROLES.map(x=>x.name);
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
function random(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
function roll(s,lo,hi){return lo+Math.floor(random(s)*(hi-lo+1));}
function healthy(s){return s.crew.filter(x=>x.health>0);}
function hasRole(s,name){return s.crew.some(c=>c.name===name&&c.health>0);}
function add(s,message,type='info'){s.log.unshift({day:s.day,message,type});s.log=s.log.slice(0,45);s.lastReport=message;}
function morale(s,n){s.morale=clamp(s.morale+n,0,100);}
function healAll(s,n){for(const c of healthy(s))c.health=clamp(c.health+n,0,100);}
function hurt(s,n){const alive=healthy(s);if(!alive.length)return;const member=alive[roll(s,0,alive.length-1)];member.health=clamp(member.health-n,0,100);if(member.health>0)add(s,`${member.name} took a hit. ${n} health lost.`, 'warning');else {add(s,OBITUARIES[member.name]||`${member.name} did not make it.`, 'danger');morale(s,-15);}}
function broadcast(s){s.broadcast=RADIO_LINES[roll(s,0,RADIO_LINES.length-1)];s.lastRadioDay=s.day;return s.broadcast;}
function spendDay(s,days=1){for(let i=0;i<days;i++){
  s.day++;
  const people=healthy(s).length;
  s.food=Math.max(0,s.food-Math.ceil(people*(s.ration==='full'?1.2:s.ration==='lean'?.55:.32)));
  s.water=Math.max(0,s.water-Math.ceil(people*.6));
  if(!s.food){healAll(s,-7);morale(s,-4);add(s,'The rations are gone. Hunger is not a fucking metaphor.','danger');}
  if(!s.water){healAll(s,-13);morale(s,-7);add(s,'No water left. The road has stopped being funny.','danger');}
  if(s.ration==='scarce'&&s.food){healAll(s,-1);morale(s,-3);}
  if(s.ration==='full'&&s.food)morale(s,1);
  if(s.day>MAX_DAYS){s.end='lost';s.endReason='Winter closed the mountain road. Your convoy never reached Haven.';break;}
  if(!healthy(s).length){s.end='lost';s.endReason='Nobody survived. The truck was in surprisingly good shape.';break;}
}}
function apply(s,e){for(const [k,n] of Object.entries(e)){
  if(k==='day')spendDay(s,n);
  else if(k==='health')n<0?hurt(s,-n):healAll(s,n);
  else if(k==='morale')morale(s,n);
  else if(k==='distance')s.distance=clamp(s.distance+n,0,DESTINATION);
  else if(k==='condition')s.condition=clamp(s.condition+n,0,100);
  else if(Object.hasOwn(s,k)&&typeof s[k]==='number'&&k!=='seed'&&k!=='lastRadioDay')s[k]=Math.max(0,s[k]+n);
  if(s.end)break;
}}
function ending(s){if(s.end)return s;
  if(!healthy(s).length){s.end='lost';s.endReason='Five people left the east. Nobody finished the sentence.';}
  else if(s.condition<=0){s.end='lost';s.endReason='The truck died in the middle of nowhere. Warranty expired along with the country.';}
  else if(s.distance>=DESTINATION){s.distance=DESTINATION;s.end='won';const count=healthy(s).length;
    s.endReason=count===5?'All five make it to Haven. The gates open. The first thing you see is a sign about property taxes.':count===1?'One survivor reaches Haven. You made it, but there is nobody left to tell the story.':`${count} survivors reach Haven. A warm light, a bowl of soup, and too many empty seats.`;
    add(s,'The lights are real. Haven is real. There is still a fucking homeowners association.','success');
  }else if(s.day>MAX_DAYS){s.end='lost';s.endReason='The mountains closed for winter. Haven stays a rumour.';}
  return s;}
function hydrate(s){
  if(!Array.isArray(s.seen))s.seen=[];
  if(!Array.isArray(s.checkpointSeen))s.checkpointSeen=[];
  if(typeof s.broadcast!=='string')s.broadcast='Radio silence. Even the static sounds tired.';
  if(!Number.isInteger(s.lastRadioDay))s.lastRadioDay=0;
  if(typeof s.lastReport!=='string')s.lastReport=s.log?.[0]?.message||'';
  for(let i=0;i<s.crew.length;i++)if(!s.crew[i].role)s.crew[i].role=ROLES[i]?.role||'Survivor';
  return s;
}
export function newGame({seed=Date.now()>>>0,callsign='The Last Convoy',difficulty='normal'}={}){
  const s={version:1,seed:seed>>>0,day:1,distance:0,food:180,water:190,fuel:185,parts:4,medicine:3,credits:70,condition:95,morale:78,ration:'lean',pace:'steady',difficulty,callsign:String(callsign).trim().slice(0,28)||'The Last Convoy',crew:ROLES.map(x=>({name:x.name,role:x.role,health:100})),log:[],pending:null,end:null,endReason:'',seen:[],checkpointSeen:[],broadcast:'RADIO // THE EASTERN FREQUENCIES ARE DARK. WESTWARD IS THE ONLY DIRECTION LEFT.',lastRadioDay:0,lastReport:''};
  if(difficulty==='hard'){s.food=145;s.water=155;s.fuel=160;s.credits=40;s.parts=3;}
  add(s,'The five of you leave at first light. No rescue. No refunds.','info');
  return s;
}
export function getPrice(s,item){const good=GOODS[item];if(!good)return Infinity;return hasRole(s,'Riley')?Math.max(1,good.price-1):good.price;}
export function getEvent(s){if(s.pending===null||s.pending===undefined)return null;
  if(typeof s.pending==='number')return EVENTS[s.pending]||null;
  if(typeof s.pending==='string'&&s.pending.startsWith('milestone:'))return MILESTONE_EVENTS.find(e=>e.mile===Number(s.pending.slice(10)))||null;
  return null;
}
export function getChoiceForecast(s,choice){const missing=Object.entries(choice.effect).filter(([k,n])=>n<0&&['parts','water','credits','fuel','food','medicine'].includes(k)&&s[k]<-n).map(([k,n])=>`${-n} ${k}`);return {affordable:missing.length===0,missing};}
export function act(state,action,payload={}){
  if(!validateSave(state))return state;
  const s=hydrate(structuredClone(state));if(s.end)return s;
  if(s.pending!==null&&action!=='choose')return s;
  switch(action){
    case 'travel':{
      if(s.fuel<5){add(s,'Not enough fuel to move. Scavenge or trade first.','warning');break;}
      const previous=s.distance;
      const miles=roll(s,35,58)*(s.pace==='rush'?1.45:s.pace==='cautious'?.72:1);
      const days=s.pace==='cautious'?3:s.pace==='rush'?1:2;
      const base=Math.ceil(miles/7*(s.pace==='rush'?1.3:1));
      const cost=Math.max(1,base-(hasRole(s,'Sam')?Math.max(1,Math.floor(base*.1)):0));
      const actual=Math.min(miles,Math.floor(s.fuel/cost*miles),DESTINATION-s.distance);
      const used=Math.max(1,Math.ceil(cost*actual/miles));
      s.fuel=Math.max(0,s.fuel-used);
      s.distance=clamp(s.distance+Math.floor(actual),0,DESTINATION);
      s.condition=clamp(s.condition-roll(s,2,s.pace==='rush'?11:6),0,100);
      spendDay(s,days);
      add(s,`${Math.floor(actual)} miles west. ${days} ${days===1?'day':'days'} on the road, ${used} fuel burned.`, 'info');
      if(!s.end&&s.distance<DESTINATION){
        const checkpoint=MILESTONE_EVENTS.find(e=>e.mile>previous&&e.mile<=s.distance&&!s.checkpointSeen.includes(e.mile));
        if(checkpoint){s.pending=`milestone:${checkpoint.mile}`;s.checkpointSeen.push(checkpoint.mile);}
        else if(random(s)<(s.difficulty==='hard'?.62:s.pace==='rush'?.62:.5)){
          const candidates=EVENTS.map((e,i)=>({e,i})).filter(x=>!s.seen.includes(x.e.id));
          s.pending=(candidates.length?candidates:EVENTS.map((e,i)=>({e,i})))[roll(s,0,(candidates.length||EVENTS.length)-1)].i;
        }
        if(random(s)<.42)broadcast(s);
      }
      break;}
    case 'scavenge':{
      spendDay(s,1);if(s.end)break;
      const kind=roll(s,0,4),amount=roll(s,16,31);
      const types=['food','water','fuel','credits','parts'];const item=types[kind];const gained=item==='parts'?1:amount+(hasRole(s,'Alex')?5:0);
      s[item]+=gained;
      if(random(s)<.22)hurt(s,roll(s,4,13));
      add(s,`Scavenged ${gained} ${item==='parts'?'spare part':item}. The world gives with one hand and slaps with the other.`, 'success');
      break;}
    case 'rest':{spendDay(s,2);if(s.end)break;healAll(s,12);morale(s,9);add(s,'Two days of rest. For a brief moment, nobody had to be brave.','success');break;}
    case 'repair':{if(s.parts<1){add(s,'No spare parts left.','warning');break;}s.parts--;spendDay(s,1);if(s.end)break;s.condition=clamp(s.condition+roll(s,21,31)+(hasRole(s,'Jules')?8:0),0,100);add(s,'The truck is repaired. Jules wants to name the alternator.','success');break;}
    case 'heal':{if(s.medicine<1){add(s,'The medical kit is empty.','warning');break;}s.medicine--;healAll(s,23+(hasRole(s,'Morgan')?9:0));add(s,'Wounds cleaned. Medicine administered. Nobody enjoyed the experience.','success');break;}
    case 'buy':{const key=payload.item;const good=GOODS[key];if(!good||s.credits<getPrice(s,key)){add(s,'Not enough credits for the trade.','warning');break;}const price=getPrice(s,key);s.credits-=price;s[key]+=good.amount;add(s,`Bought ${good.amount} ${good.label.toLowerCase()} for ${price} credits.`, 'success');break;}
    case 'ration':{if(['full','lean','scarce'].includes(payload.value))s.ration=payload.value;break;}
    case 'pace':{if(['cautious','steady','rush'].includes(payload.value))s.pace=payload.value;break;}
    case 'tune':{if(s.lastRadioDay===s.day){add(s,'Only static. Try again after the next day.','info');break;}add(s,broadcast(s),'info');break;}
    case 'choose':{
      const event=getEvent(s);if(!event)return s;const choice=event.choices[payload.index];if(!choice)return s;
      s.pending=null;
      if(!s.seen.includes(event.id))s.seen.push(event.id);
      const forecast=getChoiceForecast(s,choice);
      if(!forecast.affordable){spendDay(s,1);morale(s,-6);add(s,`You lacked ${forecast.missing.join(', ')}. The plan fell apart.`, 'warning');break;}
      apply(s,choice.effect);add(s,choice.message,'info');break;
    }
    default:return s;
  }
  return ending(s);
}
export function getLandmark(distance){let current=LANDMARKS[0],next=null;for(const landmark of LANDMARKS){if(landmark.mile<=distance)current=landmark;else{next=landmark;break;}}return {current,next};}
export function getScore(s){return Math.max(0,Math.round(s.distance/5+healthy(s).length*100+s.morale*2+s.condition*2+(MAX_DAYS-s.day)*5+(s.end==='won'?500:0)));}
export function validateSave(s){
  const validPending=s?.pending===null || (Number.isInteger(s?.pending)&&s.pending>=0&&s.pending<EVENTS.length) ||
    (typeof s?.pending==='string'&&MILESTONE_EVENTS.some(e=>s.pending===`milestone:${e.mile}`));
  return !!(s&&s.version===1&&Number.isInteger(s.seed)&&Number.isFinite(s.distance)&&s.distance>=0&&s.distance<=DESTINATION&&Array.isArray(s.crew)&&s.crew.length===5&&s.crew.every(c=>typeof c.name==='string'&&Number.isFinite(c.health)&&c.health>=0&&c.health<=100)&&Number.isInteger(s.day)&&s.day>=1&&Array.isArray(s.log)&&validPending);
}
