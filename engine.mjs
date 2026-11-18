export const DESTINATION=1250,MAX_DAYS=68;
export const LANDMARKS=[
{mile:0,name:'The Departure',description:'Leave the last functioning district behind.'},
{mile:160,name:'Ashwood Junction',description:'Highways choke beneath abandoned traffic.'},
{mile:335,name:'The Dry Basin',description:'The reservoirs are empty. The old maps are wrong.'},
{mile:525,name:'Blackglass Ridge',description:'A wildfire turned the valley into glass and charcoal.'},
{mile:720,name:'Relay Station Nine',description:'A radio tower still broadcasts a faint signal.'},
{mile:905,name:'The Broken Pass',description:'An exposed mountain crossing. No safe detour.'},
{mile:1080,name:'The Green Line',description:'The first living forests in hundreds of miles.'},
{mile:1250,name:'Haven',description:'The lights ahead are real.'}];
export const GOODS={food:{label:'Rations',price:5,amount:16},water:{label:'Water',price:5,amount:16},fuel:{label:'Fuel',price:9,amount:15},parts:{label:'Spare parts',price:12,amount:1},medicine:{label:'Medicine',price:14,amount:1}};
export const CREW_NAMES=['Alex','Morgan','Jules','Sam','Riley'];
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
function random(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
function roll(s,lo,hi){return lo+Math.floor(random(s)*(hi-lo+1));}
function add(s,message,type='info'){s.log.unshift({day:s.day,message,type});s.log=s.log.slice(0,35);}
function healthy(s){return s.crew.filter(x=>x.health>0);}
function morale(s,n){s.morale=clamp(s.morale+n,0,100);}
function hurt(s,n){const alive=healthy(s);if(!alive.length)return;const person=alive[roll(s,0,alive.length-1)];person.health=clamp(person.health-n,0,100);add(s,person.health?`${person.name} was injured (-${n} health).`:`${person.name} did not survive.`,person.health?'warning':'danger');}
function healAll(s,n){for(const member of healthy(s))member.health=clamp(member.health+n,0,100);}
function spendDay(s,days=1){
for(let i=0;i<days;i++){
s.day++;
const people=healthy(s).length;
s.food=Math.max(0,s.food-Math.ceil(people*(s.ration==='full'?1.2:s.ration==='lean'?.55:.32)));
s.water=Math.max(0,s.water-Math.ceil(people*.6));
if(s.food===0){healAll(s,-7);morale(s,-4);add(s,'No rations left. Hunger is taking its toll.','danger');}
if(s.water===0){healAll(s,-13);morale(s,-7);add(s,'The water cans are empty. Dehydration is setting in.','danger');}
if(s.ration==='scarce'&&s.food>0){morale(s,-3);healAll(s,-1);}
if(s.ration==='full'&&s.food>0)morale(s,1);
if(s.day>MAX_DAYS){s.end='lost';s.endReason='Winter sealed the mountain passes before your crew reached Haven.';return;}
if(!healthy(s).length){s.end='lost';s.endReason='No one survived the crossing.';return;}
}}
const EVENTS=[
{title:'A voice on the shortwave',text:'A stranger claims the northern road is clear. Your old map disagrees.',choices:[{label:'Trust the broadcast',effect:{distance:42,fuel:-5},message:'The shortcut works, but the engine burns through fuel.'},{label:'Stick to the map',effect:{day:2,morale:-3},message:'The safe route adds two difficult days.'}]},
{title:'Smoke on the horizon',text:'A wall of smoke is rolling through the valley. You can shelter or push onward.',choices:[{label:'Shelter and seal the vents',effect:{day:2,food:-3},message:'The smoke passes after two days.'},{label:'Drive through',effect:{health:-19,distance:35,morale:-5},message:'You clear the smoke, coughing and exhausted.'}]},
{title:'Abandoned supply depot',text:'A dark warehouse stands beside the road. Something is moving inside.',choices:[{label:'Search the warehouse',effect:{food:14,parts:1,health:-12},message:'You find sealed rations and a spare alternator. Someone gets hurt.'},{label:'Leave it alone',effect:{morale:2},message:'The depot disappears in the rearview mirror.'}]},
{title:'The bridge is gone',text:'Only bent pylons remain above a flooded gorge.',choices:[{label:'Build a crossing',effect:{parts:-2,day:2,distance:20},message:'A makeshift crossing holds.'},{label:'Take the long detour',effect:{fuel:-12,day:3},message:'You loop around the gorge over three long days.'}]},
{title:'Strangers at dusk',text:'Another convoy flags you down. They offer useful directions in exchange for water.',choices:[{label:'Share eight water',effect:{water:-8,morale:12,distance:24},message:'The convoy points you toward a workable backroad.'},{label:'Keep moving',effect:{morale:-4},message:'You drive past without stopping.'}]},
{title:'Engine trouble',text:'The transmission begins to knock. The vehicle may not survive another climb.',choices:[{label:'Use spare parts',effect:{parts:-1,condition:32},message:'You replace the failing assembly.'},{label:'Patch it with scrap',effect:{day:1,condition:12,health:-8},message:'The repair is rough but holds for now.'}]},
{title:'The old clinic',text:'A field clinic still has a few sealed medical kits in its cabinets.',choices:[{label:'Salvage the supplies',effect:{medicine:2,day:1},message:'You recover two medical kits.'},{label:'Move on quickly',effect:{distance:18},message:'You leave the clinic behind.'}]},
{title:'A contested checkpoint',text:'Armed guards demand payment to let the vehicle through.',choices:[{label:'Pay the toll (20 credits)',effect:{credits:-20},message:'The guards wave you through.'},{label:'Take a hidden track',effect:{fuel:-9,condition:-11},message:'The detour is hard on the vehicle.'}]},
{title:'Cold night, weak signal',text:'Your radio catches a message from Haven: “The western gate remains open.”',choices:[{label:'Give the crew hope',effect:{morale:13},message:'For the first time in days, everyone sleeps easier.'},{label:'Keep expectations low',effect:{morale:2},message:'You note the coordinates without making promises.'}]}
];
function apply(s,e){for(const [k,n] of Object.entries(e)){
if(k==='day')spendDay(s,n);
else if(k==='health')n<0?hurt(s,-n):healAll(s,n);
else if(k==='morale')morale(s,n);
else if(k==='distance')s.distance=clamp(s.distance+n,0,DESTINATION);
else if(k==='condition')s.condition=clamp(s.condition+n,0,100);
else if(k in s&&typeof s[k]==='number')s[k]=Math.max(0,s[k]+n);
}}
function status(s){if(s.end)return s;
if(!healthy(s).length){s.end='lost';s.endReason='No one survived the crossing.';}
else if(s.condition<=0){s.end='lost';s.endReason='Your vehicle broke down beyond repair.';}
else if(s.distance>=DESTINATION){s.distance=DESTINATION;s.end='won';s.endReason=`${healthy(s).length} survivors reached Haven on day ${s.day}.`;add(s,'Through the dust, the lights of Haven appear. You made it.','success');}
else if(s.day>MAX_DAYS){s.end='lost';s.endReason='Winter sealed the mountain passes.';}
return s;}
export function newGame({seed=Date.now()>>>0,callsign='The Last Convoy',difficulty='normal'}={}){
const s={version:1,seed:seed>>>0,day:1,distance:0,food:180,water:190,fuel:185,parts:4,medicine:3,credits:70,condition:95,morale:78,ration:'lean',pace:'steady',difficulty,callsign:String(callsign).trim().slice(0,28)||'The Last Convoy',crew:CREW_NAMES.map(name=>({name,health:100})),log:[],pending:null,end:null,endReason:''};
if(difficulty==='hard'){s.food=145;s.water=155;s.fuel=160;s.credits=40;s.parts=3;}
add(s,'2048. The eastern settlements have gone quiet. Haven is 1,250 miles west.','info');
add(s,'Your convoy leaves at first light. No rescue is coming.','info');
return s;}
export function act(state,action,payload={}){
const s=structuredClone(state);if(s.end)return s;
if(s.pending!==null&&action!=='choose')return s;
switch(action){
case 'travel':{
if(s.fuel<5){add(s,'Not enough fuel to travel. Scavenge or trade first.','warning');break;}
const miles=roll(s,35,58)*(s.pace==='rush'?1.45:s.pace==='cautious'?.72:1);
const days=s.pace==='cautious'?3:s.pace==='rush'?1:2;
const fuelCost=Math.ceil(miles/7*(s.pace==='rush'?1.3:1));
const actual=Math.min(miles,Math.floor(s.fuel/fuelCost*miles),DESTINATION-s.distance);
const used=Math.max(1,Math.ceil(fuelCost*actual/miles));
s.fuel=Math.max(0,s.fuel-used);
s.distance=clamp(s.distance+Math.floor(actual),0,DESTINATION);
s.condition=clamp(s.condition-roll(s,2,s.pace==='rush'?11:6),0,100);
spendDay(s,days);
add(s,`Travelled ${Math.floor(actual)} miles over ${days} ${days===1?'day':'days'}. Used ${used} fuel.`,'info');
if(!s.end&&s.distance<DESTINATION&&random(s)<(s.pace==='rush'?.58:.43))s.pending=roll(s,0,EVENTS.length-1);
break;}
case 'scavenge':{
spendDay(s,1);const kind=roll(s,0,4),amount=roll(s,16,31);
const types=['food','water','fuel','credits','parts'];const item=types[kind];const gained=item==='parts'?1:amount;
s[item]+=gained;
if(random(s)<.22)hurt(s,roll(s,4,13));
add(s,`Scavenged ${gained} ${item==='parts'?'spare part':item}.`,'success');break;}
case 'rest':{spendDay(s,2);healAll(s,12);morale(s,9);add(s,'Made camp for two days. The crew rested and recovered.','success');break;}
case 'repair':{if(s.parts<1){add(s,'No spare parts left.','warning');break;}s.parts--;spendDay(s,1);s.condition=clamp(s.condition+roll(s,21,31),0,100);add(s,'Repaired the vehicle with one spare part.','success');break;}
case 'heal':{if(s.medicine<1){add(s,'No medicine left.','warning');break;}s.medicine--;healAll(s,23);add(s,'Used one medical kit to treat the crew.','success');break;}
case 'buy':{const key=payload.item;const good=GOODS[key];if(!good||s.credits<good.price){add(s,'Not enough credits for the trade.','warning');break;}s.credits-=good.price;s[key]+=good.amount;add(s,`Bought ${good.amount} ${good.label.toLowerCase()} for ${good.price} credits.`,'success');break;}
case 'ration':{if(['full','lean','scarce'].includes(payload.value))s.ration=payload.value;break;}
case 'pace':{if(['cautious','steady','rush'].includes(payload.value))s.pace=payload.value;break;}
case 'choose':{
if(s.pending===null)break;const event=EVENTS[s.pending];const choice=event.choices[payload.index];if(!choice)break;
s.pending=null;
const effect={...choice.effect};const shortfalls=Object.keys(effect).filter(k=>effect[k]<0&&['parts','water','credits','fuel','food'].includes(k)&&s[k]<-effect[k]);
if(shortfalls.length){add(s,`You lacked ${shortfalls.join(', ')}. The plan fell apart.`,'warning');spendDay(s,1);morale(s,-6);break;}
apply(s,effect);add(s,choice.message,'info');break;}
default:return s;
}
return status(s);}
export function getEvent(state){return state.pending===null?null:EVENTS[state.pending]||null;}
export function getLandmark(distance){let current=LANDMARKS[0],next=null;for(const l of LANDMARKS){if(l.mile<=distance)current=l;else{next=l;break;}}return {current,next};}
export function getScore(s){return Math.max(0,Math.round(s.distance/5+healthy(s).length*100+s.morale*2+s.condition*2+(MAX_DAYS-s.day)*5+(s.end==='won'?500:0)));}
export function validateSave(s){return !!(s&&s.version===1&&Number.isInteger(s.seed)&&Number.isFinite(s.distance)&&s.distance>=0&&s.distance<=DESTINATION&&Array.isArray(s.crew)&&s.crew.length===5&&s.crew.every(c=>typeof c.name==='string'&&Number.isFinite(c.health))&&Number.isInteger(s.day)&&s.day>=1&&Array.isArray(s.log)&&(s.pending===null||Number.isInteger(s.pending)&&s.pending>=0&&s.pending<EVENTS.length));}
