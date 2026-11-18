// Original procedural pixel-art scene. No third-party image assets.
const THEMES=[
  {sky:'#414f4c',horizon:'#a47859',far:'#63716a',mid:'#384e46',near:'#2a4139',ground:'#655949',sun:'#eeb17a',structure:'#35463f'},
  {sky:'#55463d',horizon:'#c18c61',far:'#8e6a55',mid:'#655449',near:'#544239',ground:'#88704e',sun:'#f2bd7b',structure:'#4e433a'},
  {sky:'#635342',horizon:'#dd9b6a',far:'#b88b5e',mid:'#957152',near:'#735941',ground:'#927257',sun:'#f1c888',structure:'#746448'},
  {sky:'#3b2b34',horizon:'#b95b50',far:'#643d46',mid:'#473039',near:'#272e30',ground:'#4d3d3d',sun:'#e5835b',structure:'#2e272b'},
  {sky:'#26383b',horizon:'#8c7362',far:'#476260',mid:'#34494c',near:'#293c3b',ground:'#55524d',sun:'#ecba78',structure:'#253738'},
  {sky:'#364955',horizon:'#9a9e93',far:'#657985',mid:'#435e63',near:'#324c4f',ground:'#60675e',sun:'#d6b997',structure:'#344a54'},
  {sky:'#344e4a',horizon:'#b4a27b',far:'#688575',mid:'#406456',near:'#294e3e',ground:'#58725d',sun:'#f5ca92',structure:'#324a3a'}
];
const rect=(c,x,y,w,h,colour)=>{c.fillStyle=colour;c.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h));};
const polygon=(c,points,colour)=>{c.fillStyle=colour;c.beginPath();c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.closePath();c.fill();};
function pseudo(seed){let n=(Math.imul(seed,1664525)+1013904223)>>>0;return n/4294967296;}
function hills(c,theme,miles){
  polygon(c,[[0,161],[30,128],[72,163],[116,108],[153,157],[192,124],[238,158],[290,112],[339,157],[397,111],[447,145],[480,120],[480,204],[0,204]],theme.far);
  polygon(c,[[0,183],[38,155],[83,189],[132,152],[181,174],[216,144],[265,179],[327,147],[372,173],[424,140],[480,168],[480,215],[0,215]],theme.mid);
  polygon(c,[[0,207],[44,180],[90,194],[139,176],[187,190],[235,170],[289,187],[341,165],[407,187],[480,169],[480,224],[0,224]],theme.near);
  for(let i=0;i<19;i++){
    const x=(i*67+Math.floor(miles/11)*3)%515-22;
    const h=9+Math.floor(pseudo(i*913+17)*27);
    const y=189-h+Math.floor(pseudo(i*131+4)*13);
    rect(c,x,y,3,h,theme.structure);
    rect(c,x-4,y+6,11,2,theme.structure);
    rect(c,x-3,y+13,9,2,theme.structure);
  }
}
function skyline(c,theme,miles){
  for(let i=0;i<16;i++){
    const x=(i*49+21-Math.floor(miles/7)%22);
    const y=141-Math.round(pseudo(i*417+15)*36);
    rect(c,x,y,25+Math.floor(pseudo(i*283+9)*23),191-y,theme.structure);
    rect(c,x+6,y-6,4,8,theme.structure);
    for(let row=0;row<3;row++)for(let col=0;col<2;col++)if(pseudo(i*7+row*13+col*20)>.39)rect(c,x+7+col*13,y+13+row*12,4,6,'#8b866c');
  }
}
function roadside(c,theme,miles,region){
  if(region<4)skyline(c,theme,miles);
  if(region===4){
    rect(c,392,58,5,140,'#213333');rect(c,372,79,45,5,'#213333');rect(c,383,62,23,4,'#213333');
    for(let i=0;i<5;i++)rect(c,391-i*5,60+i*17,6,3,'#b8a884');
  }
  if(region===5){for(let i=0;i<7;i++){rect(c,40+i*66,146-i%3*10,32,30,'#b2c1bf');rect(c,48+i*66,142-i%3*10,16,5,'#d8d2c2');}}
  if(region>=6){for(let i=0;i<15;i++){const x=i*38-5, y=176+Math.floor(pseudo(i*381+20)*22);rect(c,x,y-30,5,30,'#273e31');polygon(c,[[x-12,y-11],[x+3,y-49],[x+19,y-11]],'#345d46');}}
  if(region>=6&&miles>=1250){for(let i=0;i<10;i++){const x=50+i*41;rect(c,x,145,29,35,'#a6aa89');rect(c,x+9,152,7,6,'#ffe7a6');}}
}
function road(c,theme,miles,clock){
  polygon(c,[[0,208],[480,196],[480,270],[0,270]],'#3a3b36');
  polygon(c,[[0,217],[480,204],[480,228],[0,241]],'#555045');
  polygon(c,[[0,248],[480,227],[480,246],[0,268]],'#413b37');
  for(let i=0;i<8;i++){
    const x=(i*80-((Math.floor(miles*2)+Math.floor(clock/14))%80));
    rect(c,x,239-(x/480)*8,35,3,'#c8b28a');
  }
  for(let i=0;i<25;i++){
    const x=i*23+Math.floor(pseudo(i*53+7)*9),y=217+Math.floor(pseudo(i*78+1)*49);
    rect(c,x,y,1+Math.floor(pseudo(i*91+2)*3),1,'#6b6757');
  }
}
function truck(c,clock){
  const bounce=Math.floor(Math.sin(clock/550)*1.5),x=200,y=164+bounce;
  rect(c,x+26,y+18,140,39,'#26372c');
  rect(c,x+44,y,91,36,'#495b48');
  rect(c,x+52,y+7,36,21,'#b8b899');
  rect(c,x+94,y+7,28,21,'#a7b293');
  rect(c,x+39,y+3,5,30,'#28372e');
  rect(c,x+141,y+4,8,32,'#1c2d27');
  rect(c,x+17,y+46,157,16,'#19231e');
  rect(c,x+12,y+37,15,13,'#df8365');rect(c,x+160,y+37,14,14,'#d4a36b');
  rect(c,x+28,y+56,33,34,'#151c19');rect(c,x+132,y+56,33,34,'#151c19');
  rect(c,x+36,y+64,17,18,'#7f8171');rect(c,x+140,y+64,17,18,'#7f8171');
  rect(c,x+42,y+68,5,10,'#424943');rect(c,x+146,y+68,5,10,'#424943');
  rect(c,x+22,y+18,14,23,'#37483b');rect(c,x+36,y+12,14,6,'#60755b');
  rect(c,x+71,y-8,63,6,'#27392e');rect(c,x+91,y-16,20,9,'#7a7052');
  rect(c,x+113,y-13,15,7,'#a58e6b');rect(c,x+133,y-6,3,10,'#272d27');
  // Short plume of exhaust, pixel clusters drifting left.
  for(let i=0;i<4;i++)rect(c,x+7-i*15, y+38-i*5-Math.floor(clock/180+i)%3,8+i*2,3+i,'#64665a');
}
function wreck(c){rect(c,25,192,56,17,'#272f2b');rect(c,37,186,29,9,'#353e34');rect(c,27,208,12,11,'#141b1a');rect(c,67,208,12,11,'#141b1a');rect(c,18,188,7,4,'#a98669');}
function sign(c,region){rect(c,409,172,3,49,'#4b5244');rect(c,380,176,56,24,'#aa9a7a');rect(c,385,181,46,14,'#403e34');c.fillStyle='#ede1bb';c.font='9px monospace';const labels=['WEST','ASHWOOD','DRY BASIN','NO SIGNAL','RELAY 9','PASS','HAVEN','HAVEN'];c.fillText(labels[region]||'WEST',388,191);}
function dither(c,theme){for(let x=0;x<480;x+=5)for(let y=9;y<147;y+=7){const v=pseudo(x*13+y*31);if(v>.97)rect(c,x,y,2,1,theme.sun);}}
export function drawScene(canvas,{distance=0,day=1,end=null}={},clock=0){
  if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
  ctx.save();ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;
  const region=distance>=1080?6:distance>=905?5:distance>=720?4:distance>=525?3:distance>=335?2:distance>=160?1:0;
  const t=THEMES[region];
  rect(ctx,0,0,480,270,t.sky);rect(ctx,0,80,480,100,t.horizon);
  rect(ctx,347,37,61,61,t.sun);rect(ctx,341,62,73,15,t.sun);
  dither(ctx,t);hills(ctx,t,distance);roadside(ctx,t,distance,region);
  rect(ctx,0,195,480,44,t.ground);road(ctx,t,distance,clock);
  wreck(ctx);if(region!==5)sign(ctx,region);truck(ctx,clock);
  for(let i=0;i<9;i++){
    const x=(i*67+Math.floor(clock/19)+Math.floor(distance*3))%520-30;
    rect(ctx,x,220+(i*13%32),9,2,'#a08f73');
  }
  if(region===3){for(let i=0;i<5;i++){const x=34+i*95+Math.sin(clock/1500+i)*5;rect(ctx,x,62+i*11,42,5,'#5c474b');rect(ctx,x+9,56+i*11,25,5,'#5c474b');}}
  if(end==='won'){
    rect(ctx,450,148,16,28,'#c8bb8f');rect(ctx,452,151,12,9,'#f3d6a0');
    ctx.fillStyle='#fbe6bd';ctx.font='900 14px monospace';ctx.fillText('HAVEN',393,143);
  }
  ctx.restore();
}
