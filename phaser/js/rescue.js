/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const RESCUE={
after:1.2,
inv:1.5,
nbCool:2.2,
heal:50,
};
const rescueDue=()=>G&&G.mode==='play'&&G.stage==='field'&&G.wave===3&&!G.practice&&!G.ecoOpen;
function rescueStep(){
if(!rescueDue()||G.rescued)return;
const r=WAVES[3].rush;
if(G.rushQ&&G.rushQ.some(g=>g.kind==='nboss')){G.rushHeld=G.rushQ.filter(g=>g.kind==='nboss');G.rushQ=G.rushQ.filter(g=>g.kind!=='nboss')}
if(G.rushDone&&G.t>=r.at+RESCUE.after)rescueCut();
}
function rescueCut(){
G.rescued=true;G.mode='cut';G.talkMsg=null;
const p=G.player;p.queued=null;p.stun=0;p.kx=p.ky=0;
const rp=$('#radioPop');if(rp)rp.classList.remove('on');
playStory('day4_rescue',rescueBack);
}
function rescueBack(){
if(!G||G.mode!=='cut')return;
G.mode='play';joinOtter();
const p=G.player,side=p.x<W/2?1:-1;
p.inv=Math.max(p.inv||0,RESCUE.inv);
G.comp={x:p.x-side*60,y:p.y+14,t:1.2,act:null,hop:0};
burst(G.comp.x,G.comp.y,['#e4f6ff','#fff','#9fd8ef'],20,260);
const vf=vineForestSpot(),s=vf||{x:side>0?W-90:90,y:clamp(p.y,H*.3,H*.75)};if(!vf)for(let t=0;t<14&&inPond(s.x,s.y,1.05);t++)s.x+=side>0?24:-24;
if(vf)burst(s.x,s.y,['#7cb94f','#cfeeb0','#3f7a2a','#fff'],22,260);
const nb=spawnNutriaAt(clamp(s.x,50,W-50),s.y,'nboss');nb.cool=RESCUE.nbCool;nb.born=0;G.rushHeld=null;
float(nb.x,nb.y-80,'대장 뉴트리아','#ffd1d8',true);
float(W/2,H*.3,'🦦 수달 달이가 함께해요!','#fff3c9',true);
const h=Math.round(Math.min(100,G.gauge+RESCUE.heal)-G.gauge);if(h>0){G.gauge+=h;float(W/2,H*.3+56,'달이의 응원! 평형 +'+h,'#bdeee3',true)}
epMusic('rush',G.wave);for(let i=0;i<3;i++)setTimeout(()=>beep(660+i*220,.12,'triangle',.06),i*120);
updateHud(true);
}
{const _st=step;step=function(dt){if(G&&G.mode==='play'&&G.stage==='field')rescueStep();return _st(dt)}}
{const _bw=beginWave;beginWave=function(i){if(G){G.rescued=false;G.rushHeld=null;G.talkMsg=null}return _bw(i)}}
