import {newGame,act,getEvent,getLandmark,getScore,validateSave,LANDMARKS,DESTINATION,GOODS} from './engine.mjs';
const $=id=>document.getElementById(id);
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const SAVE='westward2048.save.v1',BEST='westward2048.best.v1';
let state=null;
function load(){try{const value=JSON.parse(localStorage.getItem(SAVE));return validateSave(value)?value:null;}catch{return null;}}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(state));}catch{}}
function clearSave(){try{localStorage.removeItem(SAVE);}catch{}}
function persistBest(){if(!state.end)return;try{const best=Number(localStorage.getItem(BEST))||0;if(getScore(state)>best)localStorage.setItem(BEST,String(getScore(state)));}catch{}}
function play(s){state=s;$('welcome').hidden=true;$('game').hidden=false;render();window.scrollTo({top:0,behavior:'smooth'});}
function update(action,payload){state=act(state,action,payload);save();persistBest();render();}
function start(){play(newGame({callsign:$('callsign').value,difficulty:$('difficulty').value}));save();}
function render(){
if(!state)return;
const s=state;const living=s.crew.filter(x=>x.health>0).length;
$('convoy-name').textContent=s.callsign;
$('day').textContent=`DAY ${String(s.day).padStart(2,'0')} / 68`;
$('survivors').textContent=`${String(living).padStart(2,'0')} SURVIVORS`;
$('distance').textContent=`${Math.floor(s.distance).toLocaleString()} / ${DESTINATION.toLocaleString()} MI`;
$('progress-bar').style.width=`${100*s.distance/DESTINATION}%`;
const {current,next}=getLandmark(s.distance);
$('location').textContent=next?`NEXT: ${next.name.toUpperCase()} · ${Math.ceil(next.mile-s.distance)} MI`:'HAVEN REACHED';
$('landmark').textContent=current.name.toUpperCase();
$('weather').textContent=s.distance>900?'THE MOUNTAIN PASS':s.distance>500?'ASH AND SILENCE':'THE LONG ROAD WEST';
$('pace').value=s.pace;$('ration').value=s.ration;
$('resources').innerHTML=[['food','RATIONS',100],['water','WATER',100],['fuel','FUEL',115],['parts','SPARE PARTS',8],['medicine','MED KITS',5],['condition','VEHICLE',100],['morale','MORALE',100]].map(([key,label,max])=>`<div class="resource ${s[key]<max*.2?'critical':s[key]<max*.4?'low':''} ${key==='condition'?'resource-wide':''}"><span>${label}</span><strong>${s[key]}${['condition','morale'].includes(key)?'%':''}</strong>${['condition','morale'].includes(key)?`<div class="meter"><div style="width:${s[key]}%"></div></div>`:''}</div>`).join('');
$('crew').innerHTML=s.crew.map(person=>`<div class="crew-row"><strong>${esc(person.name)}</strong><span class="${person.health===0?'dead':person.health<50?'hurt':''}">${person.health===0?'LOST':person.health+'% HEALTH'}</span></div>`).join('');
$('credits').textContent=s.credits;
$('shop').innerHTML=Object.entries(GOODS).map(([key,g])=>`<div class="shop-row"><span>${esc(g.label)}<small>+${g.amount} UNITS</small></span><button data-buy="${key}" ${s.credits<g.price||s.end||s.pending!==null?'disabled':''}>${g.price} CR · BUY</button></div>`).join('');
$('route').innerHTML=LANDMARKS.map(place=>`<div class="route-row ${s.distance>=place.mile?'visited':next===place?'next':''}"><span>${s.distance>=place.mile?'◆':next===place?'◇':'·'} ${esc(place.name)}</span><span>${place.mile} MI</span></div>`).join('');
$('log').innerHTML=s.log.slice(0,15).map(item=>`<li><time>DAY ${String(item.day).padStart(2,'0')}</time><span class="${item.type}">${esc(item.message)}</span></li>`).join('');
const e=getEvent(s);$('encounter').hidden=!e;$('actions').hidden=!!e||!!s.end;$('ending').hidden=!s.end;
if(e){$('event-title').textContent=e.title;$('event-text').textContent=e.text;$('event-choices').innerHTML=e.choices.map((ch,i)=>`<button data-choice="${i}">${esc(ch.label)} →</button>`).join('');}
if(s.end){$('ending-title').textContent=s.end==='won'?'YOU REACHED HAVEN.':'THE ROAD ENDS HERE.';$('ending-message').textContent=s.endReason;$('ending-score').textContent=`FINAL SCORE: ${getScore(s).toLocaleString()} · ${living} SURVIVORS · ${Math.floor(s.distance)} MILES`;}
drawScene($('scene'),s.distance,s.day,s.end==='won');
}
function drawScene(canvas,miles=0,day=1,won=false){
const ctx=canvas.getContext('2d');if(!ctx)return;ctx.imageSmoothingEnabled=false;const w=canvas.width,h=canvas.height;
const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,won?'#23483b':'#253b34');sky.addColorStop(1,won?'#a3aa68':'#9b775a');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
const px=(x,y,ww,hh,col)=>{ctx.fillStyle=col;ctx.fillRect(Math.round(x),Math.round(y),Math.round(ww),Math.round(hh));};
px(520,58,48,48,won?'#f2d68f':'#df9e6a');
for(let i=0;i<13;i++){const x=i*75-55;const ht=40+((i*31+Math.floor(miles/23))%60);px(x,172-ht,55,ht,'#456358');px(x+12,166-ht,8,9,'#263d38');}
ctx.fillStyle='#364d43';ctx.beginPath();ctx.moveTo(0,182);for(let i=0;i<11;i++)ctx.lineTo(i*80,125+(i*29%72));ctx.lineTo(w,240);ctx.lineTo(0,240);ctx.fill();
for(let i=0;i<8;i++){const x=i*107-10-(miles%28);const ht=20+(i*13%48);px(x,191-ht,7,ht,'#263b36');px(x-10,191-ht,28,5,'#263b36');px(x+3,176-ht,5,13,'#263b36');}
px(0,212,w,88,'#3c3c30');px(0,247,w,53,'#494539');
for(let i=0;i<9;i++)px(i*105+(miles*3%65)-50,267,53,4,'#b6a17b');
const x=265,y=187+Math.round(Math.sin(day*.5)*2);
px(x+25,y-28,117,47,'#333f34');px(x+41,y-46,72,23,'#536557');px(x+47,y-40,33,14,'#a6af8a');px(x+85,y-40,21,14,'#a6af8a');
px(x+19,y+9,131,17,'#202923');px(x+31,y+22,24,24,'#151c1b');px(x+112,y+22,24,24,'#151c1b');px(x+37,y+27,12,12,'#899078');px(x+118,y+27,12,12,'#899078');px(x+137,y-15,12,13,'#d3a26e');px(x+7,y+2,14,11,'#c68561');px(x+55,y-51,3,6,'#141e1c');
for(let i=0;i<5;i++)px(x-15-i*22,y+22+(i%2)*9,10,3,'#8f7d61');
if(won){px(580,120,8,80,'#d2e1a7');px(550,113,70,9,'#d2e1a7');}
ctx.fillStyle='#f2f0d5';ctx.font='700 13px monospace';ctx.fillText(`WESTWARD // ${Math.floor(miles)} MI`,20,25);ctx.fillStyle='#d5c8a8';ctx.font='11px monospace';ctx.fillText(`TRANSMISSION ${String(day).padStart(2,'0')}`,20,44);
}
$('start').addEventListener('click',start);
$('continue').addEventListener('click',()=>{const s=load();if(s)play(s);});
$('again').addEventListener('click',()=>{clearSave();$('game').hidden=true;$('welcome').hidden=false;$('continue').hidden=true;state=null;window.scrollTo(0,0);});
$('new-run').addEventListener('click',()=>{if(window.confirm('Abandon this journey and begin a new run?')){$('again').click();}});
$('game').addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.dataset.act)update(button.dataset.act);if(button.dataset.buy)update('buy',{item:button.dataset.buy});if(button.dataset.choice!==undefined)update('choose',{index:Number(button.dataset.choice)});});
$('pace').addEventListener('change',e=>update('pace',{value:e.target.value}));
$('ration').addEventListener('change',e=>update('ration',{value:e.target.value}));
$('continue').hidden=!load();drawScene($('intro-canvas'),30,1,false);
