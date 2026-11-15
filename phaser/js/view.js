/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
let BG_KEY=null,BG_N=0;
const TOD_PLAN=[
['afternoon','late',0,0,0],
['afternoon','late',0,.15,.7],
['afternoon','late',.15,1,0],
['late','dusk',0,.22,.65],
['late','dusk',.22,1,0],
];
const TOD_IMG={afternoon:'03_습지_맑은오후',late:'03_습지_늦은오후',dusk:'03_습지_황혼'};
function todAt(wave,q){const w=TOD_PLAN[Math.max(0,Math.min(TOD_PLAN.length-1,wave))],k=q<=w[4]?0:(q-w[4])/(1-w[4]);return{base:w[0],top:w[1],a:w[2]+(w[3]-w[2])*Math.min(1,k)}}
function wetTod(){if(!G)return todAt(0,0);if(G.stage==='boss'){const t=BOSS_TOD[G.bossIdx]||'dusk';return{base:t,top:t,a:0}}return todAt(G.wave,Math.min(1,(G.t||0)/WAVE_LEN))}
let WET_GEN=0;const WET_TEX={};
function wetKey(game,tod){if(!WET_TEX[tod]){const key='wet_'+tod+'_'+WET_GEN;game.textures.addCanvas(key,drawWetland(W,H,S*DPR,tod));WET_TEX[tod]=key}return WET_TEX[tod]}
function wetKeep(game,keep){for(const t of Object.keys(WET_TEX))if(!keep.includes(t)){game.textures.remove(WET_TEX[t]);delete WET_TEX[t]}}
function refreshWetland(game){
const olds=Object.values(WET_TEX);for(const t of Object.keys(WET_TEX))delete WET_TEX[t];WET_GEN++;
const t=wetTod();BG_KEY=wetKey(game,t.base);if(t.a>0)wetKey(game,t.top);return olds;
}
function fitCamera(scene){
const cam=scene.cameras.main;
cam.setSize(scene.scale.width,scene.scale.height);
cam.setZoom(S*DPR);cam.centerOn(W/2,H/2);
}
function addWetland(scene){
if(!BG_KEY)refreshWetland(scene.game);
const base=scene.add.image(0,0,BG_KEY).setOrigin(0,0).setScale(1/(S*DPR)).setDepth(-1000);
base.top=scene.add.image(0,0,BG_KEY).setOrigin(0,0).setScale(1/(S*DPR)).setDepth(-999).setVisible(false);
base.tod={};applyTod(scene,base,true);return base;
}
function syncWetland(scene,img){fitCamera(scene);applyTod(scene,img,true)}
function applyTod(scene,img,force){
const t=wetTod(),g=scene.game,two=t.a>.002&&t.base!==t.top;
if(force||t.base!==img.tod.base||(two&&t.top!==img.tod.top)){img.setTexture(wetKey(g,t.base)).setScale(1/(S*DPR));if(two)img.top.setTexture(wetKey(g,t.top)).setScale(1/(S*DPR))}
else if(two&&img.top.texture.key!==WET_TEX[t.top])img.top.setTexture(wetKey(g,t.top));
img.top.setVisible(two).setAlpha(two?t.a:0);img.tod=t;
}
function prepareTod(scene,nextWave){
const n=todAt(nextWave,0),e=todAt(nextWave,1),c=wetTod(),g=scene.game,need=[c.base,c.top,n.base,n.top,e.top].filter((v,i,a)=>a.indexOf(v)===i);
for(const t of need)wetKey(g,t);wetKeep(g,need);
}
const FONT='Jua, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
const INK='#1f2a24';
