import {act,newGame,getEvent,getLandmark,getScore,getPrice,getChoiceForecast,validateSave,LANDMARKS,GOODS,DESTINATION,MAX_DAYS} from './engine.mjs';
import {ROLES} from './story.mjs';
import {drawScene} from './scene.mjs';

const $=id=>document.getElementById(id);
const html=s=>String(s).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const KEY='westward2048.save.v1',BEST_KEY='westward2048.best.v1',SOUND_KEY='westward2048.sound';
let state=null,lastFrame=0,lastModal='',soundEnabled=false,audioContext=null;
try{soundEnabled=localStorage.getItem(SOUND_KEY)==='true';}catch{}
const save=()=>{try{if(state)localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
const loaded=()=>{try{const s=JSON.parse(localStorage.getItem(KEY));return validateSave(s)?s:null;}catch{return null;}};
const clear=()=>{try{localStorage.removeItem(KEY);}catch{}};
function cue(kind='move'){
  if(!soundEnabled)return;
  try{
    audioContext ||=new (window.AudioContext||window.webkitAudioContext)();
    if(audioContext.state==='suspended')audioContext.resume();
    const now=audioContext.currentTime;
    const notes=kind==='danger'?[220,155]:kind==='reward'?[330,440,554]:[230,280];
    for(let i=0;i<notes.length;i++){
      const osc=audioContext.createOscillator(),gain=audioContext.createGain();
      osc.type='square';osc.frequency.setValueAtTime(notes[i],now+i*.09);
      gain.gain.setValueAtTime(0.0001,now+i*.09);
      gain.gain.exponentialRampToValueAtTime(.04,now+i*.09+.015);
      gain.gain.exponentialRampToValueAtTime(.0001,now+i*.09+.08);
      osc.connect(gain);gain.connect(audioContext.destination);
      osc.start(now+i*.09);osc.stop(now+i*.09+.09);
    }
  }catch{} // No sound device should never break gameplay.
}
function persistBest(){if(!state?.end)return;try{localStorage.setItem(BEST_KEY,String(Math.max(Number(localStorage.getItem(BEST_KEY))||0,getScore(state))));}catch{}}
function play(s){state=s;$('welcome').hidden=true;$('game').hidden=false;document.body.classList.add('is-playing');render();window.scrollTo({top:0,behavior:'instant'});}
function start(){const name=$('callsign').value||'The Last Convoy';play(newGame({callsign:name,difficulty:$('difficulty').value}));save();cue('reward');}
function update(action,payload={}){
  if(!state)return;
  const before=state,after=act(before,action,payload);
  if(after===before)return;
  state=after;save();persistBest();render();
  if(before.pending===null && after.pending!==null && window.matchMedia('(max-width: 840px)').matches){requestAnimationFrame(()=>$('decision').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));}
  if(after.end==='lost'||after.crew.some((c,i)=>before.crew[i].health>0&&c.health===0))cue('danger');
  else if(after.end==='won'||action==='scavenge'||action==='buy')cue('reward');
  else if(action!=='pace'&&action!=='ration')cue();
  if($('tool-dialog').open&&lastModal)renderDialog(lastModal);
}
function vitals(s){
  const values=[['RATIONS',s.food,65],['WATER',s.water,55],['FUEL',s.fuel,40],['PARTS',s.parts,1],['TRUCK',`${s.condition}%`,30,s.condition],['MORALE',`${s.morale}%`,30,s.morale]];
  return values.map(([label,value,low,number=value])=>`<div class="vital" data-status="${number<=low/2?'critical':number<=low?'low':'ok'}"><span class="vital-label">${label}</span><strong>${html(value)}</strong></div>`).join('');
}
const effects={distance:'MILES',food:'RATIONS',water:'WATER',fuel:'FUEL',parts:'PARTS',medicine:'MEDS',credits:'CREDITS',condition:'TRUCK',morale:'MORALE',health:'CREW HP',day:'DAYS'};
function forecast(effect){return Object.entries(effect).map(([k,v])=>`${v>0?'+':''}${v} ${effects[k]||k.toUpperCase()}`).join(' · ');}
function option({index,label,sub='',type='act',action='',risky=false}){
  return `<button type="button" class="decision-option ${risky?'danger':''}" data-${type}="${html(type==='choice'?index:action)}" aria-keyshortcuts="${index+1}"><span class="option-main"><span class="number">${index+1}</span><span class="label">${html(label)}</span></span>${sub?`<span class="forecast">${html(sub)}</span>`:''}</button>`;
}
function renderDecision(s){
  const event=getEvent(s),ending=!!s.end;
  $('decision-count').textContent=`DAY ${String(s.day).padStart(2,'0')} / ${MAX_DAYS}`;
  $('travel-settings').hidden=!!event||ending;
  $('decision').classList.toggle('open-road',!event&&!ending);
  const opts=$('decision-options');
  if(event){
    $('decision-kind').textContent=event.kind==='checkpoint'?'THE ROAD / CHECKPOINT':'THE ROAD / '+event.kind.toUpperCase();
    $('decision-kicker').textContent=event.kind==='checkpoint'?'A PLACE YOU CANNOT AVOID':'YOUR NEXT BAD DECISION';
    $('decision-title').textContent=event.title;
    $('decision-copy').textContent=event.text;
    opts.className='decision-options choices-mode';
    opts.innerHTML=event.choices.map((choice,index)=>{
      const p=getChoiceForecast(s,choice);
      const prefix=!p.affordable?`NOT ENOUGH: ${p.missing.join(', ')}. PLAN FAILS · `:'';
      return option({index,label:choice.label,sub:prefix+forecast(choice.effect),type:'choice',risky:!p.affordable});
    }).join('');
  }else if(ending){
    $('decision-kind').textContent=s.end==='won'?'THE END / SOMEHOW ALIVE':'THE END / NO REFUNDS';
    $('decision-kicker').textContent=s.end==='won'?'WELL, SHIT. YOU MADE IT.':'THE ROAD ALWAYS WINS EVENTUALLY';
    $('decision-title').textContent=s.end==='won'?'HAVEN. AT LAST.':'THE LAST MILE.';
    $('decision-copy').textContent=s.endReason+` Score: ${getScore(s).toLocaleString('en-CA')}.`;
    opts.className='decision-options choices-mode';
    opts.innerHTML='<button type="button" class="decision-option" data-reset="true"><span class="option-main"><span class="number">↺</span><span class="label">TRY ANOTHER RUN</span></span><span class="forecast">NO GUARANTEES</span></button>';
  }else{
    const {current,next}=getLandmark(s.distance);
    $('decision-kind').textContent='THE ROAD / OPEN';
    $('decision-kicker').textContent='YOUR MOVE, COMMANDER';
    $('decision-title').textContent=s.distance>850?'DON’T DIE NOW.':s.distance>450?'KEEP THE ENGINE ALIVE.':'GO WEST. STAY BREATHING.';
    $('decision-copy').textContent=next?`${current.description} ${Math.ceil(next.mile-s.distance)} miles until ${next.name}. Every day costs supplies; every detour costs something worse.`:'Haven is on the horizon.';
    opts.className='decision-options actions-mode';
    const actions=[['DRIVE WEST','2 days · fuel and wear','travel'],['SCAVENGE','1 day · risk of injury','scavenge'],['MAKE CAMP','2 days · recover health','rest'],['REPAIR THE TRUCK','1 part · 1 day','repair'],['USE MEDICINE','1 kit · crew health','heal']];
    opts.innerHTML=actions.map(([label,sub,action],index)=>option({index,label,sub,type:'act',action})).join('');
  }
  $('latest-report').textContent=s.lastReport||s.log?.[0]?.message||'The road says nothing.';
}
function render(){if(!state)return;const s=state,{current,next}=getLandmark(s.distance);
  $('convoy-name').textContent=s.callsign;$('chapter').textContent=current.name.toUpperCase();
  $('day').textContent=`${String(s.day).padStart(2,'0')} / ${MAX_DAYS}`;
  $('distance').textContent=`${Math.floor(s.distance).toLocaleString('en-CA')} / ${DESTINATION.toLocaleString('en-CA')}`;
  $('survivors').textContent=`${s.crew.filter(c=>c.health>0).length} / ${s.crew.length}`;
  $('progress-bar').style.width=`${s.distance/DESTINATION*100}%`;
  $('road-progress').setAttribute('aria-valuenow',String(Math.floor(s.distance)));
  $('landmark').textContent=current.name.toUpperCase();
  $('weather').textContent=next?`${next.name.toUpperCase()} · ${Math.ceil(next.mile-s.distance)} MI`:'THE LIGHTS OF HAVEN';
  $('resources').innerHTML=vitals(s);$('broadcast').textContent=s.broadcast||'The receiver hisses. Nobody is listening.';
  $('pace').value=s.pace;$('ration').value=s.ration;
  renderDecision(s);drawScene($('scene'),s,0);
}
function reset(){if(!window.confirm('Leave this run behind? The current save will be lost.'))return;clear();state=null;document.body.classList.remove('is-playing');$('game').hidden=true;$('welcome').hidden=false;$('continue').hidden=true;window.scrollTo({top:0,behavior:'instant'});}
function openPanel(panel){if(!state)return;lastModal=panel;renderDialog(panel);$('tool-dialog').showModal();}
function renderDialog(panel){if(!state)return;const s=state;
  const titles={crew:'THE CREW',map:'ROAD ATLAS',trade:'ROADSIDE TRADER',journal:'THE JOURNAL',radio:'SHORTWAVE RADIO'};
  $('dialog-title').textContent=titles[panel]||panel;
  let body='';
  if(panel==='crew'){
    body='<p class="dialog-intro">Five survivors. Five specialities. Every death costs more than a number.</p><div class="crew-list">'+s.crew.map((c,i)=>`<div class="crew-person"><div><strong>${html(c.name)}</strong><small>${html(c.role||ROLES[i].role)} · ${html(ROLES[i].perk)}</small></div><div class="health ${c.health<=0?'dead':''}">${c.health>0?`${c.health}% HP`:'DEAD'}</div></div>`).join('')+'</div>';
  }else if(panel==='map'){
    const {next}=getLandmark(s.distance);
    body=`<p class="dialog-intro">${Math.floor(s.distance)} of ${DESTINATION} miles. Maps lie. Distances don't.</p><div class="track-list">`+LANDMARKS.map(l=>`<div class="track-stop ${s.distance>=l.mile?'visited':next===l?'next':''}"><span><strong>${html(l.name)}</strong><br><small>${html(l.description)}</small></span><small>${l.mile} MI</small></div>`).join('')+'</div>';
  }else if(panel==='trade'){
    body=`<p class="dialog-intro">A trader, a dust-covered ledger and prices set by people with absolutely no shame. ${s.pending!==null?'Finish the current encounter before doing business.':''}</p><div class="credit-balance">YOUR CREDITS: ${s.credits}</div><div class="goods-list">`+
      Object.entries(GOODS).map(([key,g])=>{const price=getPrice(s,key);return `<div class="good"><div><h3>${html(g.label)}</h3><p>+${g.amount} units</p></div><button type="button" data-buy="${key}" ${s.pending!==null||!!s.end||s.credits<price?'disabled':''}>BUY / ${price} CR</button></div>`;}).join('')+'</div>';
  }else if(panel==='journal'){
    body='<p class="dialog-intro">A collection of questionable choices, injuries and minor miracles. Future historians are going to hate you.</p><ol class="journal-list">'+s.log.map(x=>`<li><time>DAY ${String(x.day).padStart(2,'0')}</time><p>${html(x.message)}</p></li>`).join('')+'</ol>';
  }else if(panel==='radio'){
    body=`<p class="dialog-intro">One radio, a thousand frequencies, approximately zero competent authorities. You can scan once each day.</p><div class="radio-report">${html(s.broadcast||'Radio silence.')}</div><p class="radio-hint">${s.lastRadioDay===s.day?'Frequency scanned today. Try another day.':'Tuning may reveal a new transmission. No guarantee of useful advice.'}</p><button type="button" class="radio-button" data-tune="true" ${s.lastRadioDay===s.day||s.pending!==null||!!s.end?'disabled':''}>SCAN THE SHORTWAVE</button><div class="radio-hint" style="margin-top:18px"><label><input type="checkbox" id="sound-toggle" ${soundEnabled?'checked':''}> Enable tiny original sound effects</label></div>`;
  }
  $('dialog-content').innerHTML=body;
}
function animate(t){if(!document.hidden&&t-lastFrame>110){lastFrame=t;const s=state||{distance:30,day:1};const c=state?$('scene'):$('intro-canvas');drawScene(c,s,t);}requestAnimationFrame(animate);}
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');if(!reduce.matches)requestAnimationFrame(animate);
$('start').addEventListener('click',start);
$('continue').addEventListener('click',()=>{const s=loaded();if(s)play(s);});
$('new-run').addEventListener('click',reset);
$('home-link').addEventListener('click',e=>{e.preventDefault();if(state)reset();else window.scrollTo({top:0,behavior:'smooth'});});
$('game').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.panel)openPanel(b.dataset.panel);
  if(b.dataset.act)update(b.dataset.act);
  if(b.dataset.choice!==undefined)update('choose',{index:Number(b.dataset.choice)});
  if(b.dataset.reset)reset();
});
$('tool-dialog').addEventListener('click',e=>{
  const b=e.target.closest('button');
  if(b?.dataset.buy){const key=b.dataset.buy;update('buy',{item:key});}
  if(b?.dataset.tune){update('tune');}
  if(e.target.id==='sound-toggle'){soundEnabled=e.target.checked;try{localStorage.setItem(SOUND_KEY,String(soundEnabled));}catch{}if(soundEnabled)cue('reward');}
});
$('close-dialog').addEventListener('click',()=>$('tool-dialog').close());
$('tool-dialog').addEventListener('click',e=>{if(e.target===$('tool-dialog'))$('tool-dialog').close();});
$('pace').addEventListener('change',e=>update('pace',{value:e.target.value}));
$('ration').addEventListener('change',e=>update('ration',{value:e.target.value}));
document.addEventListener('keydown',e=>{
  if(!state || $('tool-dialog').open)return;
  if(e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(document.activeElement?.tagName||''))return;
  if(/^[1-5]$/.test(e.key)){
    const button=$('decision-options').querySelectorAll('button')[Number(e.key)-1];
    if(button){button.click();e.preventDefault();}
  }
});
$('continue').hidden=!loaded();drawScene($('intro-canvas'),{distance:30,day:1},0);
