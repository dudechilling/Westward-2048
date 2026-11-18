// Original, deterministic canvas world for Westward: 2048.
// Drawn entirely with primitives: no images, fonts, network requests or third-party art.
import {EVENTS, MILESTONE_EVENTS, SCENE_HINTS} from './story.mjs';

export const BIOMES = ['Dead suburbs','Ashwood Junction','Dry Basin','Blackglass Ridge','Relay Station Nine','Broken Pass','Green Line'];
const STOPS=[0,160,335,525,720,905,1080];
const BASE = [
  {sky:'#283c45',glow:'#d98b63',far:'#6b716b',mid:'#465c58',near:'#293d37',earth:'#625b4b',accent:'#ecb57c'},
  {sky:'#423b3b',glow:'#bd6e49',far:'#715e55',mid:'#554a43',near:'#333b35',earth:'#604d42',accent:'#f0ae6e'},
  {sky:'#6e6555',glow:'#f4b979',far:'#afa084',mid:'#807967',near:'#655a4d',earth:'#927559',accent:'#ffdc9c'},
  {sky:'#292a3b',glow:'#ca6657',far:'#544251',mid:'#383541',near:'#252a32',earth:'#453c42',accent:'#ff9873'},
  {sky:'#253542',glow:'#c68c6d',far:'#587078',mid:'#3d555a',near:'#283d40',earth:'#4b514d',accent:'#edd299'},
  {sky:'#263b4b',glow:'#a3a8a4',far:'#778c99',mid:'#526b78',near:'#334d57',earth:'#53606a',accent:'#e4d6b9'},
  {sky:'#283e46',glow:'#aaba9a',far:'#6d957b',mid:'#436e62',near:'#244b40',earth:'#54604b',accent:'#f4d4a0'}
];
const W=480,H=270;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rect=(c,x,y,w,h,col)=>{if(w<=0||h<=0)return;c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));};
function poly(c,points,col){c.fillStyle=col;c.beginPath();c.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)c.lineTo(points[i][0],points[i][1]);c.closePath();c.fill();}
function stroke(c,points,col,width=2){c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.stroke();}
function text(c,str,x,y,size=8,col='#f4ddb3',align='left'){c.fillStyle=col;c.font=`bold ${size}px monospace`;c.textBaseline='top';c.textAlign=align;c.fillText(str,x,y);c.textAlign='left';}
const hash=n=>{let a=(Math.imul(n|0,0x45d9f3b))|0;a=Math.imul(a^(a>>>16),0x45d9f3b);return ((a^(a>>>16))>>>0)/4294967296;};
const mix=(a,b,t)=>{const x=n=>parseInt(n,16);return '#'+[1,3,5].map(i=>Math.round(x(a.slice(i,i+2))*(1-t)+x(b.slice(i,i+2))*t).toString(16).padStart(2,'0')).join('');};
const scroll=(index,spacing,offset,shift=0)=>((index*spacing-offset+shift)% (W+spacing)+(W+spacing))%(W+spacing)-spacing;

export function getBiome(distance=0){for(let i=STOPS.length-1;i>=0;i--)if(distance>=STOPS[i])return i;return 0;}
export function getPendingEvent(s){
  if(s?.pending==null)return null;
  if(Number.isInteger(s.pending))return EVENTS[s.pending]||null;
  if(typeof s.pending==='string'&&s.pending.startsWith('milestone:'))return MILESTONE_EVENTS.find(e=>e.mile===Number(s.pending.slice(10)))||null;
  return null;
}
export function getSceneState(s={},phaseOverride=''){
  const distance=clamp(Number(s.distance)||0,0,1250),day=Math.max(1,Number(s.day)||1),biome=getBiome(distance);
  const seed=(Number.isInteger(s.seed)?s.seed:2701)>>>0;
  const choice=getPendingEvent(s), hint=choice?(SCENE_HINTS[choice.id]||SCENE_HINTS[`kind:${choice.kind}`]||{}):{};
  const time=['dawn','day','dusk','night'][(day-1)%4];
  const raw=Math.floor(hash(seed+day*37+biome*709)*7);
  const weather=biome===5?(raw<3?'snow':raw===3?'storm':'clear'):
    biome===3?(raw<3?'ash':raw===3?'storm':'smoke'):
    biome===2?(raw<4?'dust':raw===4?'heat':'clear'):
    biome===1?(raw<4?'ash':raw===4?'smoke':'clear'):
    biome===6?(raw<3?'rain':raw===3?'fog':'clear'):
    raw===0?'rain':raw===1?'fog':raw===2?'dust':'clear';
  const scenePhase=s.end==='won'?'haven':s.end==='lost'?'stranded':choice?'encounter':phaseOverride||'cruise';
  return {distance,day,seed,biome,region:BIOMES[biome],time,weather,phase:scenePhase,event:choice,sceneHint:hint,condition:clamp(Number.isFinite(Number(s.condition))&&s.condition!==undefined?Number(s.condition):95,0,100),fuel:Math.max(0,Number(s.fuel)||0),pace:s.pace||'steady',rare:hash(seed+day*821+biome*73)};
}
export function sceneDescription(s){const d=getSceneState(s);const subject=d.sceneHint.subject||d.sceneHint.backdrop;return `${d.region}, ${d.time}, ${d.weather}${d.event?`. Encounter: ${d.event.title}${subject?` near ${subject}`:''}`:''}. ${d.condition<35?'The truck is badly damaged.':'The convoy is on the road.'}`;}

function sky(c,s){
  const theme=BASE[s.biome],night=s.time==='night',dawn=s.time==='dawn',dusk=s.time==='dusk';
  const top=night?mix(theme.sky,'#070e1c',.78):dawn?mix(theme.sky,'#36405c',.35):dusk?mix(theme.sky,'#292a42',.25):theme.sky;
  const glow=night?mix(theme.glow,'#283247',.78):dawn?mix(theme.glow,'#ec8b7d',.24):dusk?mix(theme.glow,'#e26b49',.2):theme.glow;
  for(let y=0;y<190;y+=5)rect(c,0,y,W,5,mix(top,glow,Math.pow(y/190,1.75)));
  // A disc and luminous broken cloud strata, rather than a flat square.
  const xx=s.biome===3?390:358,yy=night?43:dusk?113:dawn?99:55;
  for(let r=48;r>=18;r-=9){rect(c,xx-r/2,yy-r/2,r,r,mix(top,s.time==='night'?'#dfd9bf':theme.accent,.12+(48-r)/90));}
  rect(c,xx-17,yy-17,34,34,night?'#e5e0c6':theme.accent);
  if(night){for(let i=0;i<35;i++){const x=hash(s.seed+i*41)*W,y=hash(s.seed+i*77+31)*115;if(hash(i*69+s.seed)>.27)rect(c,x,y,1+(i%3===0?1:0),1,'#b2c9c8');}}
  for(let i=0;i<7;i++){
    const x=scroll(i,98,s.clock*.0019,45),y=23+i*17%100;
    rect(c,x,y,43+i%3*9,3,mix(top,glow,.17));rect(c,x+8,y-3,22+i%2*12,3,mix(top,glow,.16));
  }
}
function mountain(c,s,layer){
  const palette=BASE[s.biome];const col=layer===0?palette.far:layer===1?palette.mid:palette.near;
  const base=layer===0?170:layer===1?190:215;const step=layer===0?71:layer===1?55:43;
  const speed=layer===0?.002:layer===1?.007:.013;
  const offset=(s.clock*speed+(s.distance*.16)*(layer+1))%(step*2);
  const pts=[[0,base]];
  for(let i=-3;i<14;i++){
    const x=i*step-offset;
    const lift=layer===0?44:layer===1?32:24;
    const y=base-lift*(.6+.8*hash(i*171+s.biome*19+layer*37));
    pts.push([x,y],[x+step*.5,y+lift*(.32+hash(i*78+layer))],[x+step,base-7]);
    if(s.biome===5&&layer<2){poly(c,[[x-10,y+5],[x,y],[x+9,y+10],[x+2,y+9]],'#c8c8bd');}
  }
  pts.push([W,base+20],[W,H],[0,H]);poly(c,pts,col);
  if(layer===1&&s.biome===3)for(let i=0;i<13;i++){const x=scroll(i,41,s.clock*.008+s.distance*.5);const y=177+hash(i*84)*16;poly(c,[[x,y+17],[x+10,y-12],[x+16,y+14]],'#282a32');}
}
function ruinedBuilding(c,x,y,w,h,col,lit=false){
  rect(c,x,y,w,h,col);
  // Broken roofline and displaced concrete.
  rect(c,x+3,y-6,w*.26,7,col);rect(c,x+w*.7,y-3,w*.18,4,col);
  for(let row=0;row<Math.floor(h/15);row++)for(let colm=0;colm<Math.floor((w-8)/11);colm++){
    if(hash(x*39+y*17+row*87+colm*101)<.36)continue;
    rect(c,x+5+colm*11,y+7+row*15,5,7,lit?'#e1b87e':'#152d30');
  }
  if(w>30){rect(c,x+w*.52,y-14,3,14,col);stroke(c,[[x+w*.52,y-10],[x+w*.82,y-16]],'#202e30',1);}
}
function deadTree(c,x,y,scale=1,col='#263834'){
  rect(c,x-2*scale,y-29*scale,4*scale,32*scale,col);
  stroke(c,[[x,y-23*scale],[x-13*scale,y-37*scale]],col,2*scale);
  stroke(c,[[x,y-14*scale],[x+10*scale,y-32*scale]],col,2*scale);
  stroke(c,[[x-6*scale,y-29*scale],[x-7*scale,y-42*scale]],col,2*scale);
}
function pine(c,x,y,scale=1,col='#23493c'){
  const h=37*scale;rect(c,x-2*scale,y-7*scale,4*scale,10*scale,'#233f38');
  poly(c,[[x,y-h],[x-12*scale,y-8*scale],[x+12*scale,y-8*scale]],col);
  poly(c,[[x,y-h+14*scale],[x-15*scale,y-3*scale],[x+15*scale,y-3*scale]],col);
  rect(c,x-2*scale,y-h*.48,4*scale,2*scale,'#57796a');
}
function waterTower(c,x,y){rect(c,x-15,y-43,30,18,'#53574d');rect(c,x-17,y-46,34,5,'#6b7062');for(const i of [-12,11])rect(c,x+i,y-25,3,31,'#343d39');stroke(c,[[x-11,y],[x+11,y-23]],'#343d39',2);}
function ruinSuburbs(c,s){
  const off=s.clock*.013+s.distance*.34;
  for(let i=0;i<12;i++){
    const x=scroll(i,56,off,10),h=24+hash(i*43+11)*54;
    ruinedBuilding(c,x,187-h,25+hash(i*37)*17,h,'#344b49',s.time==='night'&&i%3===0);
  }
  // A giant broken overpass frames the skyline.
  poly(c,[[0,158],[95,154],[165,162],[212,171],[217,178],[0,168]],'#283833');
  rect(c,76,160,8,43,'#34413b');rect(c,158,167,7,37,'#34413b');
  for(let i=0;i<3;i++)deadTree(c,scroll(i,140,off*.7,20),199,1,'#223634');
}
function ashwood(c,s){
  const off=s.clock*.017+s.distance*.4;
  for(let i=0;i<15;i++)deadTree(c,scroll(i,38,off),198,0.75+hash(i*15)*.45,'#292e2c');
  rect(c,46,147,99,5,'#343c36');rect(c,52,153,4,46,'#343c36');rect(c,134,152,4,44,'#343c36');
  rect(c,65,151,17,27,'#524b42');rect(c,86,151,16,27,'#524b42');
  text(c,'LAST EXIT',60,139,8,'#d3ad80');
  for(let i=0;i<3;i++)smoke(c,80+i*36,139,1,s.clock+i*320);
}
function basin(c,s){
  const off=s.clock*.017+s.distance*.45;
  poly(c,[[0,189],[117,181],[175,192],[286,181],[382,201],[480,192],[480,224],[0,224]],'#8c7b60');
  for(let i=0;i<7;i++){
    const x=scroll(i,100,off),y=184+i%2*7;
    rect(c,x,y-19,5,22,'#5f665a');rect(c,x-12,y-17,28,3,'#657264');
    stroke(c,[[x+2,y-17],[x-5,y-26]],'#657264',2);
  }
  // Skeleton of an emptied aqueduct.
  rect(c,15,164,175,8,'#8d8775');
  for(let i=0;i<4;i++){
    const x=20+i*42;rect(c,x,169,8,37,'#7b796b');
    stroke(c,[[x+6,175],[x+30,175],[x+32,205]],'#665f55',2);
  }
}
function ridge(c,s){
  const off=s.clock*.012;
  for(let i=0;i<19;i++){
    const x=scroll(i,30,off),base=201+i%4*6,h=17+hash(i*87)*55;
    poly(c,[[x-13,base],[x+h*.14,base-h],[x+14,base]],i%4===0?'#746369':'#292b36');
    if(i%4===0)stroke(c,[[x,base],[x+h*.14,base-h]],'#b66c60',1);
  }
  for(let i=0;i<3;i++)smoke(c,80+i*135,164,1.3,s.clock+i*120);
}
function relay(c,s){
  for(let i=0;i<8;i++){const x=scroll(i,70,s.clock*.008,25);ruinedBuilding(c,x,148+hash(i*3)*19,34,55,'#364948',false);}
  const x=335,y=63;rect(c,x,y,5,143,'#212f34');stroke(c,[[x+2,y+5],[x-31,201]],'#243536',2);stroke(c,[[x+2,y+5],[x+36,201]],'#243536',2);
  for(let i=0;i<8;i++){const yy=y+12+i*15;stroke(c,[[x-27+(i*3),yy],[x+30-(i*3),yy]],'#324747',1);}
  rect(c,x-38,y+18,85,3,'#253a3b');rect(c,x-13,y-9,30,4,'#253a3b');
  if(Math.floor(s.clock/1600)%2===0)rect(c,x-1,y-9,8,5,'#fd765d');
  // Dish facing an impossible sky.
  poly(c,[[285,103],[299,100],[305,92],[294,88],[277,90]],'#8fa199');rect(c,290,101,2,33,'#293939');
}
function pass(c,s){
  for(let i=0;i<10;i++){
    const x=scroll(i,58,s.clock*.01,8),y=186+i%3*8;
    poly(c,[[x-20,211],[x+15,y-62],[x+42,211]],'#344754');
    poly(c,[[x-3,y-26],[x+15,y-62],[x+29,y-26],[x+16,y-31]],'#c9c9c3');
  }
  rect(c,48,160,86,49,'#253843');poly(c,[[43,162],[93,116],[137,162]],'#53636e');
  rect(c,74,173,37,29,'#172a2f');poly(c,[[74,173],[93,161],[111,173]],'#172a2f');
  for(let i=0;i<7;i++){const x=scroll(i,79,s.clock*.029),y=211+i%2*5;rect(c,x,y,30,3,'#a2aab0');}
}
function greenline(c,s){
  const off=s.clock*.015+s.distance*.35;
  for(let i=0;i<21;i++){const x=scroll(i,29,off);pine(c,x,202-hash(i*3)*10,0.8+hash(i*11)*.8,i%3===0?'#315d48':'#24483d');}
  for(let i=0;i<12;i++){const x=scroll(i,48,off*.5,4);rect(c,x,186,3,18,'#455d47');}
  rect(c,362,154,5,53,'#35493f');rect(c,403,154,5,53,'#35493f');rect(c,360,158,52,7,'#b6b895');
  text(c,'HAVEN',370,158,8,'#283c37');
  if(s.time==='night')for(let i=0;i<5;i++)rect(c,372+i*7,183,3,3,'#e8d89d');
}
function region(c,s){
  mountain(c,s,0);
  if(s.biome===0)ruinSuburbs(c,s);
  if(s.biome===1)ashwood(c,s);
  if(s.biome===2)basin(c,s);
  if(s.biome===3)ridge(c,s);
  if(s.biome===4)relay(c,s);
  if(s.biome===5)pass(c,s);
  if(s.biome===6)greenline(c,s);
  mountain(c,s,1);
  // Haze band separates the world from the road, with no flat fill over landmarks.
  rect(c,0,206,W,19,mix(BASE[s.biome].earth,'#101e1d',.48));
}
function smoke(c,x,y,scale,t){
  for(let i=0;i<6;i++){
    const rise=(t*.017+i*13)%60;
    const drift=Math.sin((t/1100)+i*.8)*9;
    rect(c,x+drift+i*scale*2,y-rise,12*scale+rise*.24,5*scale+rise*.07,i%2===0?'#454e48':'#59605a');
  }
}
function road(c,s){
  const base=BASE[s.biome],moving=s.phase==='travel'||s.phase==='cruise';
  const xoff=(s.clock*(moving?s.phase==='travel'?.1:.033:.003)+s.distance*.9)%105;
  poly(c,[[0,212],[W,204],[W,270],[0,270]],'#252d2b');
  poly(c,[[0,225],[W,216],[W,257],[0,265]],mix(base.earth,'#333332',.62));
  poly(c,[[0,261],[W,245],[W,270],[0,270]],'#242b29');
  for(let i=-2;i<9;i++){
    const x=i*96-xoff;
    rect(c,x,239-x/W*5,45,3,'#b8a77e');
  }
  for(let i=0;i<55;i++){
    const x=(hash(i*87+19)*W-xoff*(i%3+1)*.4+W*5)%W,y=226+hash(i*113+4)*39;
    rect(c,x,y,i%4===0?6:2,1,'#696354');
  }
  for(let i=0;i<9;i++){
    const x=scroll(i,81,xoff*1.6,7);rect(c,x,252+hash(i*109)*12,7,3,'#716c5b');
  }
}
function signboard(c,x,y,line1,line2='',s={}){
  const red=s.biome===3?'#b78378':'#dbbb88';
  rect(c,x+3,y+23,4,27,'#353b33');rect(c,x+84,y+23,3,27,'#353b33');
  rect(c,x-3,y-3,100,29,'#292f2b');rect(c,x,y,91,23,'#c9ba94');
  rect(c,x+4,y+3,83,17,'#344039');
  text(c,line1,x+8,y+4,line1.length>15?6:7,red);
  if(line2)text(c,line2,x+8,y+12,6,'#e5e0bf');
  for(let i=0;i<7;i++)rect(c,x+i*13,y+23,4,1,'#716b5b');
}
const SIGNS=[
  ['EVAC EXIT','ONLY 900 YRS'],['WE CARE','NO REFUNDS'],['WATER+','SUBSCRIBE'],['FUEL IS FINE','MARKETS STRONG'],
  ['STILL ONLINE','TERMS APPLY'],['ROAD OPEN','UNTIL FURTHER'],['SAFETY FIRST','PAY AT GATE'],['HAVE A NICE','APOCALYPSE']
];
function environmentalDetails(c,s){
  const primary=SIGNS[(s.biome+Math.floor(hash(s.seed+s.day*13)*4))%SIGNS.length];
  const moving=s.phase==='travel'||s.phase==='cruise';
  const offset=(s.clock*(moving?.018:.004)+s.distance*.1)%85;
  if(s.biome!==5&&s.phase!=='encounter')signboard(c,27-offset*.28,147,...primary,s);
  if(s.biome===3)for(let i=0;i<7;i++){const x=scroll(i,75,s.clock*.016),y=208+i%3*5;rect(c,x,y,17,3,'#e47760');}
  // Road debris and ruin silhouettes are picked by seed, stable within a day.
  for(let i=0;i<5;i++){
    const x=scroll(i,119,s.clock*(moving?.034:.007),3),y=213+i%2*5;
    rect(c,x,y,12,4,'#38433b');rect(c,x+2,y-4,8,4,'#4c5548');
  }
}
function tyre(c,x,y,spin,flat=false){
  rect(c,x,y,27,28,flat?'#1e211f':'#161c1b');rect(c,x+3,y+4,21,19,'#353a36');
  rect(c,x+8,y+8,11,10,'#88938a');
  const q=Math.floor(spin%4);rect(c,x+11+(q===1?3:q===3?-3:0),y+10+(q===2?3:q===0?-2:0),5,4,'#313c35');
  rect(c,x+2,y+22,22,4,'#0e1615');
}
function truck(c,s){
  const travel=s.phase==='travel'||s.phase==='cruise',t=s.clock,bounce=travel?Math.sin(t*.013)*1.8:Math.sin(t*.003)*.55;
  const x=213,y=172+bounce;
  // Layered dust cloud behind the vehicle; stronger when driving.
  if(travel)for(let i=0;i<6;i++){
    const shift=(t*.055+i*19)%100;
    rect(c,x-12-shift,y+44+(i%3)*8,19+i%2*8,3+i%3,'#93816a');
  }
  rect(c,x+13,y+21,134,37,s.condition<36?'#544c3d':'#344a3b');
  rect(c,x+33,y-3,94,32,'#516752');
  rect(c,x+42,y+3,75,21,'#263b38');
  rect(c,x+45,y+6,35,17,s.time==='night'?'#4d777c':'#a6b6a0');
  rect(c,x+85,y+6,24,17,s.time==='night'?'#537c7e':'#b6c1a3');
  rect(c,x+43,y+6,2,17,'#6f816c');
  rect(c,x+82,y+5,2,19,'#273d33');
  rect(c,x+13,y+37,144,13,'#27352b');
  rect(c,x+11,y+41,14,9,'#e17b5e');rect(c,x+144,y+40,11,10,'#e7c17b');
  rect(c,x+23,y+50,135,10,'#172522');
  tyre(c,x+28,y+52,t*.012,s.condition<25);tyre(c,x+123,y+52,t*.012,s.condition<25);
  rect(c,x+17,y+18,10,11,'#5c7159');rect(c,x+131,y+15,8,20,'#24392c');
  rect(c,x+44,y-9,70,7,'#1d302a');rect(c,x+57,y-16,21,8,'#8f8469');rect(c,x+81,y-13,24,7,'#b5a27d');
  rect(c,x+110,y-8,5,15,'#22362f');
  // Side-door decal and roof equipment.
  rect(c,x+81,y+29,30,2,'#7c8f71');rect(c,x+115,y+30,7,4,'#bca67e');
  if(s.condition<70){rect(c,x+21,y+27,18,2,'#a58d71');rect(c,x+28,y+21,3,11,'#a58d71');}
  if(s.condition<45){rect(c,x+62,y+27,23,7,'#86664d');rect(c,x+96,y+28,8,5,'#a36b50');}
  if(s.condition<25)smoke(c,x+121,y-17,.48,t);
  if(s.time==='night'){
    poly(c,[[x+148,y+42],[480,y-4],[480,y+53]],'rgba(237,220,154,0.10)');
    rect(c,x+147,y+40,9,4,'#ffe1a0');
  }
}
function foreground(c,s){
  const off=s.clock*.049+s.distance*.9;
  for(let i=0;i<8;i++){
    const x=scroll(i,73,off+11),y=255+(i%3)*4;
    rect(c,x,y,22,2,'#4f5041');rect(c,x+4,y-2,3,2,'#83816a');
  }
  if(s.biome===6)for(let i=0;i<6;i++){
    const x=scroll(i,90,s.clock*.056);poly(c,[[x,262],[x+8,251],[x+13,262]],'#1e3a31');
  }
}
// Scene-specific foreground actors, deliberately composed differently from the moving road.
function figure(c,x,y,coat='#5c544a'){rect(c,x+4,y,9,9,'#ba9d77');rect(c,x+2,y+8,14,21,coat);rect(c,x+3,y+27,5,13,'#282d2b');rect(c,x+11,y+27,5,13,'#282d2b');rect(c,x-2,y+12,5,15,coat);rect(c,x+15,y+12,5,13,coat);}
function bus(c){rect(c,46,152,185,55,'#73634b');rect(c,48,150,160,7,'#8b7658');for(let i=0;i<8;i++)rect(c,56+i*20,160,15,20,'#344b47');rect(c,105,185,30,22,'#473f34');tyre(c,65,199,0);tyre(c,185,199,0);rect(c,208,159,18,7,'#e6ab77');figure(c,259,169);}
function kiosk(c){rect(c,58,137,87,85,'#313b34');rect(c,65,144,73,66,'#b9a889');rect(c,73,155,57,45,'#303c39');text(c,'WATER+',80,150,9,'#e7c78a');text(c,'SUBSCRIBE',76,177,7,'#bad7c5');rect(c,102,192,24,4,'#98a58c');rect(c,144,192,21,19,'#585c4c');figure(c,221,174,'#5c4945');}
function checkpoint(c){rect(c,25,190,112,25,'#837b69');rect(c,132,179,20,34,'#3a413d');rect(c,152,168,90,6,'#c0a780');rect(c,160,174,8,36,'#585644');rect(c,216,174,9,36,'#585644');text(c,'PAY OR TURN',157,156,8,'#e8c9a1');for(let i=0;i<3;i++)figure(c,255+i*26,174,'#545044');}
function dish(c){rect(c,61,170,86,43,'#57615c');rect(c,73,161,69,12,'#687972');rect(c,112,125,6,42,'#48534d');poly(c,[[76,124],[117,116],[145,97],[130,138],[103,143]],'#a0aba0');figure(c,255,173,'#60574b');}
function clinic(c){rect(c,51,138,149,71,'#777869');rect(c,64,150,64,44,'#3d5550');rect(c,137,149,47,47,'#4a5a57');rect(c,103,121,39,23,'#ddd6b5');rect(c,119,125,7,17,'#b45b4d');rect(c,114,130,17,7,'#b45b4d');figure(c,233,176,'#86775d');}
function church(c){rect(c,42,152,113,61,'#494940');poly(c,[[34,157],[101,105],[171,157]],'#60604e');rect(c,96,83,7,39,'#4a4c40');rect(c,89,95,22,6,'#4a4c40');rect(c,83,174,32,39,'#252d2a');rect(c,179,172,24,44,'#4b443b');figure(c,220,175,'#625341');}
function trader(c){rect(c,36,178,174,17,'#95745a');poly(c,[[30,170],[107,139],[214,170]],'#b08667');rect(c,46,194,7,28,'#4f493c');rect(c,184,191,7,30,'#4f493c');for(let i=0;i<5;i++)rect(c,56+i*25,184,17,13,i%2?'#536354':'#c3ad7e');figure(c,239,174,'#56564b');}
function drone(c,t){const x=142+Math.sin(t*.001)*23,y=120+Math.cos(t*.0016)*5;rect(c,x,y,55,8,'#404e4a');rect(c,x+24,y+8,8,17,'#5c635f');rect(c,x-12,y-3,17,5,'#303c39');rect(c,x+50,y-3,17,5,'#303c39');rect(c,x+28,y+8,5,3,'#dc7359');figure(c,271,175);}
function gorge(c){poly(c,[[0,174],[180,176],[238,225],[278,270],[0,270]],'#373b37');poly(c,[[480,171],[338,173],[279,236],[270,270],[480,270]],'#3c403b');rect(c,15,165,163,10,'#7b7463');rect(c,319,166,161,10,'#777161');for(let i=0;i<3;i++)rect(c,34+i*49,174,5,43,'#4c5552');for(let i=0;i<3;i++)rect(c,333+i*49,174,5,43,'#4c5552');}
function camp(c,t){poly(c,[[30,210],[98,135],[172,210]],'#786c58');poly(c,[[98,135],[98,210],[172,210]],'#474c43');rect(c,101,169,5,41,'#363c35');poly(c,[[226,219],[242,181],[260,218]],'#e1a15f');for(let i=0;i<5;i++)rect(c,232+i*4,197-i%2*8,3,14,'#f2cf88');figure(c,297,175,'#635d4a');}
function roadsideScene(c,s){
  // Keep the illustrated object away from the decision typography below the canvas.
  const hint=s.sceneHint;const subject=hint.subject||'travel';const backdrop=hint.backdrop||'';
  if(backdrop==='gorge'||subject==='bridge')return gorge(c);
  if(['bus','wreck','convoy','warehouse','mall','depot'].includes(subject)||['bus','overpass','mall'].includes(backdrop))return bus(c);
  if(['kiosk','vending','water','subscription'].includes(subject)||backdrop==='vending')return kiosk(c);
  if(['checkpoint','guards','militia','gate'].includes(subject)||backdrop==='checkpoint')return checkpoint(c);
  if(['antenna','tower','broadcast','radio'].includes(subject)||backdrop==='relay')return dish(c);
  if(['clinic','doctor','hospital'].includes(subject)||backdrop==='clinic')return clinic(c);
  if(['cult','chapel','prophet'].includes(subject)||backdrop==='church')return church(c);
  if(['trader','market','shelter','mechanic'].includes(subject)||backdrop==='market')return trader(c);
  if(['drone','robots','car'].includes(subject)||backdrop==='drone')return drone(c,s.clock);
  if(['fire','camp','survivors','family'].includes(subject)||backdrop==='camp')return camp(c,s.clock);
  // Fallback vignette based on category, still different from travel.
  if(s.event?.kind==='hazard')return gorge(c);
  if(s.event?.kind==='signal')return dish(c);
  if(s.event?.kind==='salvage')return bus(c);
  return trader(c);
}
function weatherLayer(c,s){
  if(s.weather==='clear')return;
  const snow=s.weather==='snow',rain=s.weather==='rain'||s.weather==='storm',ash=s.weather==='ash',dust=s.weather==='dust'||s.weather==='heat';
  for(let i=0;i<(rain?48:ash||snow?37:22);i++){
    const x=(hash(s.seed+i*83+s.biome*41)*W + s.clock*(rain?.075:snow?.017:dust?.038:.027)+(i%3)*19)%(W+12)-6;
    const y=(hash(s.seed+i*151+s.day*19)*H+s.clock*(rain?.19:snow?.033:ash?.014:.005))%(H+12)-6;
    const col=rain?'#81979a':snow?'#d8d7cb':ash?'#a39b8d':'#ba9971';
    if(rain){stroke(c,[[x,y],[x-3,y+11]],col,1);}else rect(c,x,y,dust?4:ash?2:2,dust?1:2,col);
  }
  if(s.weather==='smoke'||s.weather==='fog')for(let i=0;i<5;i++){
    const x=scroll(i,115,s.clock*.012);rect(c,x,118+i%2*25,150,12,mix(BASE[s.biome].mid,'#9b9b94',.38));
  }
  if(s.weather==='storm'&&s.rare>.85&&((s.clock/10000|0)%3===0)&&(s.clock%10000<135)){
    poly(c,[[392,0],[357,72],[368,72],[327,139],[378,75],[366,75]],'#e3dbcd');
  }
}
function rareMoment(c,s){
  if(s.phase==='encounter'||s.phase==='camp'||s.phase==='repair')return;
  if(s.rare>.9){const x=scroll(0,520,s.clock*.036,-110),y=71+Math.sin(s.clock*.003)*3;
    for(let i=0;i<4;i++){const xx=x+i*22,yy=y+i%2*8;stroke(c,[[xx-6,yy+3],[xx,yy],[xx+6,yy+3]],'#1e2a2b',2);}
  }else if(s.rare<.07&&s.biome!==5){const x=scroll(0,550,s.clock*.04,-90);drone(c,s.clock+x*7);}
}
function overlay(c,s){
  // Layered letterboxed vignette framing; gameplay text is outside the canvas.
  const gradient=c.createLinearGradient(0,190,0,270);gradient.addColorStop(0,'rgba(11,16,16,0)');gradient.addColorStop(1,'rgba(10,14,14,.28)');c.fillStyle=gradient;c.fillRect(0,188,W,82);
  rect(c,0,0,W,4,'rgba(21,25,26,.47)');rect(c,0,267,W,3,'rgba(13,17,17,.5)');
  if(s.phase==='stranded'){rect(c,0,0,W,H,'rgba(19,20,22,.42)');text(c,'NO ROAD HOME',17,18,16,'#e4c5a9');}
  if(s.phase==='haven'){text(c,'THE LIGHTS ARE REAL',18,16,14,'#f0dbab');}
  if(s.phase==='encounter'){
    rect(c,12,45,5,30,'#db7757');
    text(c,'ROADSIDE ENCOUNTER',24,47,11,'#ecd6b5');
    text(c,s.event?.kind?.toUpperCase()||'UNKNOWN',24,61,8,'#e6ad7f');
  }
}
export function drawScene(canvas,game={},clock=0,phaseOverride=''){
  if(!canvas)return;const c=canvas.getContext('2d');if(!c)return;
  const s={...getSceneState(game,phaseOverride),clock:Math.max(0,clock)};
  c.save();c.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);c.imageSmoothingEnabled=false;
  sky(c,s);mountain(c,s,0);region(c,s);
  if(s.phase==='encounter'){
    // A held stage instead of the travelling truck: illustration changes with the actual decision.
    road(c,{...s,phase:'stopped'});roadsideScene(c,s);
  }else if(['camp','repair','scavenge'].includes(s.phase)){
    road(c,{...s,phase:'stopped'});if(s.phase==='camp')camp(c,s.clock);else if(s.phase==='scavenge')bus(c);else {truck(c,{...s,phase:'stopped'});rect(c,351,208,19,11,'#b38c65');}
  }else{
    road(c,s);environmentalDetails(c,s);truck(c,s);foreground(c,s);
  }
  rareMoment(c,s);weatherLayer(c,s);overlay(c,s);
  c.restore();
}
