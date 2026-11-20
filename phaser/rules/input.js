/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const joy={id:null,dx:0,dy:0,kx:0,ky:0};const keys={};
function joyBase(){const R=clamp(Math.min(CSSW,CSSH)*.17,52,80),m=R*1.5;return{x:safe.l+m,y:CSSH-safe.b-m,R}}
function skillBase(){const J=joyBase();return{x:J.x-J.R*.85,y:J.y-J.R*1.72,R:J.R*.56}}
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{
if(!G||G.mode!=='play')return;e.preventDefault();audioOn();
if(e.pointerType==='mouse'&&e.button===2){useSkill();return}
const b=joyBase(),rb=skillBase();
if(hyp(e.clientX-rb.x,e.clientY-rb.y)<rb.R*1.12){useSkill();return}
if(hyp(e.clientX-b.x,e.clientY-b.y)<b.R*1.25&&joy.id===null){joy.id=e.pointerId;joy.pend={t0:performance.now(),x:e.clientX,y:e.clientY};joy.last={clientX:e.clientX,clientY:e.clientY};try{cv.setPointerCapture(e.pointerId)}catch(_){ }}
else{const now=performance.now();if(e.pointerType==='touch'){for(const [id,t] of taps)if(now-t>600)taps.delete(id);const two=[...taps.values()].some(t=>now-t<300);taps.set(e.pointerId,now);if(two){taps.clear();useSkill();return}}throwNet(e.clientX/S,e.clientY/S)}
},{passive:false});
function moveJoy(e){const b=joyBase();let dx=(e.clientX-b.x)/b.R,dy=(e.clientY-b.y)/b.R;const m=hyp(dx,dy);if(m>1){dx/=m;dy/=m}joy.dx=dx;joy.dy=dy}
cv.addEventListener('pointermove',e=>{if(e.pointerId===joy.id){e.preventDefault();joy.last={clientX:e.clientX,clientY:e.clientY};if(joy.pend){if(hyp(e.clientX-joy.pend.x,e.clientY-joy.pend.y)>12)joy.pend=null;else return}moveJoy(e)}},{passive:false});
const taps=new Map(),JOY_TAP_MS=180;
function joyHold(){if(joy.pend&&performance.now()-joy.pend.t0>JOY_TAP_MS){joy.pend=null;if(joy.last)moveJoy(joy.last)}}
function endJoy(e){taps.delete(e.pointerId);if(e.pointerId===joy.id){const pd=joy.pend;joy.id=null;joy.pend=null;joy.dx=joy.dy=0;if(pd&&e.type==='pointerup'&&performance.now()-pd.t0<JOY_TAP_MS&&G&&G.mode==='play')throwNet(pd.x/S,pd.y/S)}}
cv.addEventListener('pointerup',endJoy);cv.addEventListener('pointercancel',endJoy);cv.addEventListener('lostpointercapture',endJoy);
document.addEventListener('touchmove',e=>{if(!e.target.closest||!e.target.closest('.screen'))e.preventDefault()},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('dblclick',e=>e.preventDefault());
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Space'){e.preventDefault();useSkill()}if((e.code==='KeyK'||e.code==='KeyF')&&!e.repeat)useSkill();if(e.code==='KeyJ'&&!e.repeat&&G&&G.player){const p=G.player;p.aimLock=p.faceA!=null?p.faceA:(p.flip<0?Math.PI:0);G.kbAim=true}if(e.code==='Escape'&&G&&G.mode==='play')pauseGame()});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='KeyJ'&&G&&G.player)G.player.aimLock=null});
function clearInput(){for(const k in keys)keys[k]=false;joy.id=null;joy.pend=null;joy.dx=joy.dy=0;taps.clear();if(G&&G.player)G.player.aimLock=null}
addEventListener('blur',clearInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G&&G.mode==='play')pauseGame()});
