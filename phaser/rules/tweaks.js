/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const SHADOW={dmg:[0,.3,.25]};
function shadowSpots(p,f){const n=syn('shadow');if(!n)return[];
return n===1?[{x:p.x-f*56,y:p.y+6}]:[{x:p.x-f*52,y:p.y-26},{x:p.x-f*52,y:p.y+38}]}
const FOODWEB={gauge:1.5,bossHits:3};
const ASSEMBLE={every:10,stay:3,hits:2,cd:1.2,dmg:1,r:40,range:320,first:4};
function stepGuest(dt){
const p=G.player;
if(!syn('proxy')||!G.friend||G.mode!=='play'){G.guests=null;G.guestT=ASSEMBLE.first;return}
G.guestT=(G.guestT??ASSEMBLE.first)-dt;
if(!G.guests&&G.guestT<=0){G.guestT=ASSEMBLE.every;
G.guests=FRIENDS.filter(k=>k!==G.friend).map((k,i)=>{const s=i?-1:1;return{k,side:s,x:p.x+s*70,y:p.y+(i?-20:22),t:0,hop:0,act:null,cd:.35+i*.3,left:ASSEMBLE.hits,alpha:0}});
for(const g of G.guests)burst(g.x,g.y,['#ffd95b','#fff','#e9f7d6'],14,220);
float(p.x,p.y-90,'보호종 어셈블! '+G.guests.map(g=>COMP[g.k].n).join('·'),'#fff3c9',true);beep(880,.1,'triangle',.07,1320);beep(1100,.12,'triangle',.06,1650)}
if(!G.guests)return;
const taken=new Set();
for(const g of G.guests){
g.t+=dt;g.hop+=dt;g.alpha=Math.min(1,g.t/.2)*(g.t>ASSEMBLE.stay?Math.max(0,1-(g.t-ASSEMBLE.stay)/.3):1);
const a=g.act;
if(a){a.t+=dt;const T=.24,q=Math.min(1,a.t/T);
if(a.t<T){g.x=a.sx+(a.tx-a.sx)*q;g.y=a.sy+(a.ty-a.sy)*q}else if(!a.done){a.done=true;guestSlam(g)}
if(a.t>=.42)g.act=null;continue}
const tx=p.x+g.side*70,ty=p.y+(g.side>0?22:-20);g.x+=(tx-g.x)*Math.min(1,dt*6);g.y+=(ty-g.y)*Math.min(1,dt*6);
g.cd-=dt;if(g.cd>0||g.left<=0||g.t>ASSEMBLE.stay)continue;
const t=guestTarget(taken);if(!t){g.cd=.25;continue}taken.add(t);
g.left--;g.cd=ASSEMBLE.cd;g.act={kind:'bump',t:0,sx:g.x,sy:g.y,tx:t.x,ty:t.y-(t.z||0)};beep(520,.06,'triangle',.05,900)}
if(G.guests.every(g=>g.t>ASSEMBLE.stay+.3&&!g.act)){for(const g of G.guests)burst(g.x,g.y,['#ffd95b','#fff'],10,180);G.guests=null}
}
function guestTarget(taken){
const p=G.player,b=G.boss;let best=null,bd=ASSEMBLE.range;
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;const d=hyp(e.x-p.x,e.y-p.y)+(taken.has(e)?120:0);if(d<bd){bd=d;best=e}}
if(!best&&b&&!b.air&&!b.under&&!b.deadT&&hyp(b.x-p.x,b.y-p.y)<ASSEMBLE.range+b.r)best=b;
return best}
function guestSlam(g){
const x=g.x,y=g.y,R=ASSEMBLE.r;
burst(x,y+8,['#ffd95b','#fff','#e9f7d6'],10,200);beep(300,.1,'sine',.07,160);if(!reduced)G.shake=Math.max(G.shake,.06);
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(hyp(e.x-x,e.y-(e.z||0)-y)<R+SPEC[e.type].r*.5){e.hp-=ASSEMBLE.dmg;e.hit=.25;if(e.hp<=0)kill(e)}}
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-x,r.y-y)<R)cutRoot(r);if(G.boss===b&&!b.air&&!b.under&&!b.deadT&&hyp(b.x-x,b.y-y)<b.r*.8+R)hitBoss(ASSEMBLE.dmg,true)}
}
const BOLT={range:260,len:240,dur:.22,boltDur:.16,trailDmg:[0,1,2,3],boltBonus:[0,1,1.3],cd:3,strikes:3,strikeDmg:1,strikeR:62};
function startBoltDash(p,lv){
if(G.clock-(G.boltDashAt??-99)<BOLT.cd)return; G.boltDashAt=G.clock;
const dmg=BOLT.trailDmg[L('trail')]+BOLT.boltBonus[lv||0];
let t=null,best=BOLT.range;const b=G.boss;
if(b&&!b.air&&!b.under&&!b.deadT&&hyp(b.x-p.x,b.y-p.y)<BOLT.range+b.r)t=b;
if(!t)for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;const d=hyp(e.x-p.x,e.y-(e.z||0)-p.y);if(d<best){best=d;t=e}}
const a=t?Math.atan2(t.y-(t.z||0)-p.y,t.x-p.x):(p.faceA!=null?p.faceA:(p.flip<0?Math.PI:0));
const len=t?Math.min(BOLT.len,hyp(t.x-p.x,t.y-p.y)+(t===b?0:50)):BOLT.len*.6;
G.bdash={t:0,dur:lv?BOLT.boltDur:BOLT.dur,dmg,a,len,target:t,hit:new Set(),hitPts:[],lv:lv||0,path:[{x:p.x,y:p.y}],gone:0,queue:null};
p.thrA=Math.atan2(Math.sin(a)/HK,Math.cos(a));if(lv){beep(1500,.06,'square',.05,300);beep(300,.18,'sawtooth',.04,900)}else{beep(420,.14,'sine',.06,900)}
}
const KNOT={frz:[0,.7,1],rest:2};
const TRAP={n:[0,2,3],linger:[0,.8,1.2],dmg:[0,.8,1],r:.85};
function dropTraps(d){
const tr=syn('trap'),p=G.player,path=d.path,n=TRAP.n[tr];if(!tr||!path||path.length<2)return;
const share={caught:new Set(),boss:false};
for(let i=0;i<n;i++){const q=path[Math.min(path.length-1,Math.round((i+.5)/n*(path.length-1)))],x=q.x,y=q.y+10;
G.nets.push({x0:x,y0:y,x1:x,y1:y,t:.06,dur:.06,r:p.netR*TRAP.r,rp:NET_R[0]*TRAP.r,dmg:p.dmg*TRAP.dmg[tr],land:.0001,linger:TRAP.linger[tr],trap:true,auto:true,caught:share.caught,share})}
beep(560,.08,'triangle',.05,760);
}
function boltAt(x,y,d){
const pts=[];let y0=Math.max(70,y-300),x0=x+rnd(-34,34);pts.push([x0,y0]);for(let i=1;i<6;i++){const k=i/6;pts.push([x+rnd(-26,26)*(1-k),y0+(y-y0)*k])}pts.push([x,y]);
G.bolts.push({x,y,t:0,pts});punch(.03,.1);burst(x,y,['#fff','#ffe98a','#bfe3fb'],8,190);beep(1400,.05,'square',.05,240);
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(hyp(e.x-x,e.y-(e.z||0)-y)<BOLT.strikeR+SPEC[e.type].r*.4){e.hp-=BOLT.strikeDmg;e.hit=.25;if(e.hp<=0)kill(e)}}
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-x,r.y-y)<BOLT.strikeR)cutRoot(r);if(G.boss===b&&!b.air&&!b.under&&!b.deadT&&!(d&&d.bossStruck)&&hyp(b.x-x,b.y-y)<b.r*.8+BOLT.strikeR*.5){if(d)d.bossStruck=true;hitBoss(BOLT.strikeDmg,true)}}
}
function stepBoltDash(dt){
const d=G.bdash;if(!d)return;const p=G.player;
if(d.t<d.dur){d.t+=dt;
const t=d.target;if(t&&!t.dead&&!(t===G.boss&&(t.air||t.under))){const want=Math.atan2(t.y-(t.z||0)-p.y,t.x-p.x),da=((want-d.a)%TAU+TAU*1.5)%TAU-Math.PI;d.a+=da*Math.min(1,dt*14)}
const v=d.len/d.dur;p.x=clamp(p.x+Math.cos(d.a)*v*dt,40,W-40);p.y=clamp(p.y+Math.sin(d.a)*v*dt,112,H-44);p.inv=Math.max(p.inv,.15);p.thrT=Math.max(p.thrT||0,.12);
d.path.push({x:p.x,y:p.y});
for(const e of G.ents){if(e.dead||e.prot||e.born<.25||d.hit.has(e))continue;if(hyp(e.x-p.x,e.y-(e.z||0)-p.y)<44+SPEC[e.type].r*.5){d.hit.add(e);d.hitPts.push({x:e.x,y:e.y-(e.z||0)});e.hp-=d.dmg;e.hit=.25;if(d.lv){sparks(e.x,e.y-(e.z||0),8,'#ffe98a');beep(900,.04,'square',.04,1600)}else{burst(e.x,e.y-(e.z||0),['#fff','#bfe3fb','#8fc7f5'],7,160);beep(620,.05,'sine',.05,900)}if(e.hp<=0)kill(e)}}
const b=G.boss;if(b){if(!d.hit.has(b)&&!b.air&&!b.under&&!b.deadT&&hyp(b.x-p.x,b.y-p.y)<b.r*.8+30){d.hit.add(b);d.hitPts.push({x:b.x,y:b.y});hitBoss(d.dmg,true)}for(const r of b.roots)if(r.alive&&hyp(r.x-p.x,r.y-p.y)<50)cutRoot(r)}
if(d.t>=d.dur&&syn('trap')&&!d.trapped){d.trapped=true;dropTraps(d)}
if(d.t>=d.dur&&d.lv>=2){const n=BOLT.strikes,spots=d.hitPts.slice(0,n);for(let i=spots.length;i<n;i++){const q=d.path[Math.floor((i+.5)/n*(d.path.length-1))];spots.push(q)}d.queue=spots.map((q,i)=>({at:.06+.1*i,x:q.x,y:q.y}))}
}else{d.gone+=dt;if(d.queue)while(d.queue.length&&d.queue[0].at<=d.gone){const q=d.queue.shift();boltAt(q.x,q.y,d)}
if(d.gone>.5&&!(d.queue&&d.queue.length))G.bdash=null}
}
const TIDE={linger:1.5,tick:.08,dmg:.35};
function tideTick(n,dt){
n.dotT=(n.dotT??TIDE.tick)-dt;if(n.dotT>0)return;n.dotT=TIDE.tick;n.tk=(n.tk||0)+1;beep(1400+(n.tk%3)*160,.02,'square',.014);
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(hyp(e.x-n.x1,e.y-(e.z||0)-n.y1)<n.r+SPEC[e.type].r*.55){e.hp-=TIDE.dmg;e.hit=.15;if(n.tk%2)burst(e.x,e.y,['#e6f7ff','#8fc7f5'],2,110);if(e.hp<=0)kill(e)}}
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-n.x1,r.y-n.y1)<n.r+26)cutRoot(r);if(G.boss===b&&!b.air&&!b.under&&!b.shield&&hyp(b.x-n.x1,b.y-n.y1)<n.r+b.r*.72)hitBoss(TIDE.dmg)}
}
const NBOSS_CHEW=2;
const NUTRIA_REACH=1.3;
const NUTRIA_DASH=0.9;
const SUMMON_N=[2,3];
const SUMMON_MAX={blue:8,frog:6};
const SUMMON_RATE=2/3;
function summonTurn(b){b.sumAcc=(b.sumAcc===undefined?1-SUMMON_RATE:b.sumAcc)+SUMMON_RATE;if(b.sumAcc>=1-1e-9){b.sumAcc-=1;return true}return false}
const SURGE={dmg:[[0],[1.5,1],[2,1,1]],push:[0,150,200],latePush:40,gap:.3,grow:[1,1.3,1.55]};
function surgeStart(p,R,lv,k){
G.surgeQ=G.surgeQ||[];
for(let i=1;i<SURGE.dmg[lv].length;i++){G.surgeQ.push({x:p.x,y:p.y,r:R*SURGE.grow[i],at:G.clock+SURGE.gap*i,dmg:SURGE.dmg[lv][i]*k});G.swirls.push({x:p.x,y:p.y,t:-SURGE.gap*i,r:R*SURGE.grow[i],out:1})}
}
function stepSurge(){
if(!G.surgeQ||!G.surgeQ.length)return;
for(const q of G.surgeQ){if(q.done||G.clock<q.at)continue;q.done=true;beep(240,.14,'sine',.06,140);
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(hyp(e.x-q.x,e.y-(e.z||0)-q.y)<q.r+SPEC[e.type].r*.5){e.hp-=q.dmg;e.hit=.25;burst(e.x,e.y,['#fff','#8fc7f5'],5,170);if(e.hp<=0)kill(e);else if(e.type!=='vine')shove(e,q.x,q.y,SURGE.latePush)}}
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-q.x,r.y-q.y)<q.r)cutRoot(r);if(G.boss===b&&!b.air&&!b.shield&&hyp(b.x-q.x,b.y-q.y)<q.r+b.r*.7)hitBoss(.6*q.dmg,true)}}
G.surgeQ=G.surgeQ.filter(q=>!q.done);
}
