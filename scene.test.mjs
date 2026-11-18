import test from 'node:test';
import assert from 'node:assert/strict';
import {getBiome,getPendingEvent,getSceneState,sceneDescription,BIOMES,drawScene} from './scene.mjs';
import {EVENTS,MILESTONE_EVENTS,SCENE_HINTS} from './story.mjs';
import {newGame} from './engine.mjs';

test('all seven biomes have distinct regions and boundary transitions',()=>{
  assert.equal(BIOMES.length,7);
  for(const [mile,index] of [[0,0],[159,0],[160,1],[334,1],[335,2],[525,3],[720,4],[905,5],[1080,6],[1250,6]])assert.equal(getBiome(mile),index);
});
test('scene time, weather, region and rare moments are deterministic without touching game RNG',()=>{
  const game=newGame({seed:984});game.distance=722;game.day=14;
  const snapshot=structuredClone(game);
  assert.deepEqual(getSceneState(game),getSceneState(game));
  assert.deepEqual(game,snapshot);
  assert.equal(getSceneState(game).biome,4);
});
test('every authored encounter and landmark has a visual staging hint',()=>{
  for(const event of [...EVENTS,...MILESTONE_EVENTS]){
    assert.ok(SCENE_HINTS[event.id],`Missing scene hint for ${event.id}`);
    assert.ok(SCENE_HINTS[event.id].backdrop);
  }
});
test('pending milestone and encounter resolve to correct scene instead of the travel frame',()=>{
  const game=newGame({seed:12});game.pending=0;
  assert.equal(getPendingEvent(game).id,EVENTS[0].id);
  assert.equal(getSceneState(game).phase,'encounter');
  assert.equal(getSceneState(game).sceneHint.backdrop,'relay');
  game.pending='milestone:160';
  assert.equal(getPendingEvent(game).id,MILESTONE_EVENTS[0].id);
  assert.match(sceneDescription(game),/Encounter:/);
});
test('end and action scene states remain distinct and do not override encounters',()=>{
  const s=newGame({seed:12});assert.equal(getSceneState(s,'camp').phase,'camp');
  s.pending=0;assert.equal(getSceneState(s,'camp').phase,'encounter');
  s.pending=null;s.end='won';assert.equal(getSceneState(s,'travel').phase,'haven');
});
test('drawing handles all biome, encounter, weather and state combinations without errors',()=>{
  const c=new Proxy({canvas:{width:960,height:540},createLinearGradient:()=>({addColorStop(){}})}, {
    get(target,key){return key in target?target[key]:()=>{};},set(target,key,value){target[key]=value;return true;}
  });
  const canvas={width:960,height:540,getContext:()=>c};
  for(let b=0;b<7;b++){
    const s=newGame({seed:108+b});s.distance=[0,160,335,525,720,905,1080][b];s.day=b+1;
    drawScene(canvas,s,3021);
    s.pending=b%EVENTS.length;drawScene(canvas,s,11344);
    s.pending=null;drawScene(canvas,s,0,'camp');
  }
});
