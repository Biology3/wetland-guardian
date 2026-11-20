/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const HIT={
blue: {touch:2, attack:4},
frog: {touch:2, attack:5},
nutria:{touch:3, attack:6},
vine: {touch:2, attack:2},
nboss: {touch:5, attack:10},
kblue: {touch:4, attack:8},
leaf: {touch:2, attack:2},
boss: {touch:5, attack:10},
};
function hitGauge(by,touch){const h=by&&HIT[by.type];return h?(touch?h.touch:h.attack):5}
function touchCheck(){
const p=G.player;if(p.inv>0||p.stun>0)return;
for(const e of G.ents){
if(e.dead||e.prot||e.born<.4||!HIT[e.type])continue;
if(e.st==='air'||e.st==='lunge'||(e.z||0)>4)continue;
if(hyp(e.x-p.x,e.y-p.y)<SPEC[e.type].r*.6+16){hurtPlayer(e,false,true);return}
}
if(G.stage==='field')for(const c of G.cells.values()){
if(c.g<.6||hyp(c.x-p.x,c.y-p.y)>=LEAF_R)continue;
if(G.clock-(G.leafMsg||-9)>2.5){G.leafMsg=G.clock;float(p.x,p.y-96,'가시에 찔렸어요!','#ffd1d8',true)}
hurtPlayer({type:'leaf',x:c.x,y:c.y},false,true);return}
}
const LEAF_R=28;
const BOSS_BODY=1.11,HERO_BODY=10;
function bossTouch(b){
const p=G.player;if(!b||b.air||b.under||b.deadT||p.inv>0||p.stun>0)return;
if(hyp(p.x-b.x,p.y-b.y)<b.r*BOSS_BODY+HERO_BODY)hurtPlayer(b);
}
function sproutHit(t,isBoss){
if(L('otter')<3)return;const p=G.player,need=SK.otter.boss,gain=SK.otter.gauge;
if(isBoss){t.sprout=(t.sprout||0)+1;const k=t.sprout%need;
if(k===0&&p.hp<p.maxHp&&!NOHEAL()){p.hp++; float(p.x,p.y-70,'달이의 응원! 하트 +1','#e9f7d6',true);burst(p.x,p.y,['#9fe08a','#e9f7d6','#fff'],12,200);beep(880,.12,'triangle',.07,1320)}
else float(t.x,t.y-t.r-24,'달이의 응원 '+(k||need)+'/'+need,'#e9f7d6')}
else if(G.stage==='field'){G.gauge=Math.min(100,G.gauge+gain);float(t.x,t.y-74,'달이의 응원! 평형 +'+gain,'#e9f7d6')}
}
