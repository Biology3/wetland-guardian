/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const BONUS={gaugeX:2,gaugeMax:200,mopMax:300,mopPerSec:15,slowMax:150,noHitDay:100,
bossPar:[100,110,130,160],bossPerSec:2,bossMax:200,heart:100,noHitBoss:200,
waveHeal:[20,25,30,35],
};
function clearBonus(){
const list=[],B=BONUS;
if(G.stage==='boss'){
const par=B.bossPar[G.bossIdx]||120;
list.push(['빠른 격파',Math.max(0,Math.min(B.bossMax,Math.round((par-G.t)*B.bossPerSec)))]);
list.push(['남은 하트',G.player.hp*B.heart]);
if(!G.hurtW)list.push(['무피격',B.noHitBoss]);
}else{
list.push(['평형 보너스',Math.min(B.gaugeMax,Math.round(G.gauge)*B.gaugeX)]);
const mop=Math.max(0,G.t-WAVE_LEN),ms=Math.max(-B.slowMax,Math.min(B.mopMax,Math.round(B.mopMax-mop*B.mopPerSec)));list.push([ms>=0?'빠른 정리':'느린 정리',ms]);
if(!G.hurtW)list.push(['무피격',B.noHitDay]);
}
let sum=0;
list.filter(x=>x[1]!==0).forEach(([n,v],i)=>{sum+=v;G.floats.push({x:W/2,y:H*.66+i*40,txt:n+' '+(v>0?'+':'')+v,col:v>0?'#fff3c9':'#ffb3bd',big:true,t:-i*.15})});
G.score+=sum;G.bonusSum=(G.bonusSum||0)+sum;return sum;
}
