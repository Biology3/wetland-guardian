/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
function shadowSpots(){return[]}
const ASSEMBLE=SK.assemble;
function stepGuest(dt){
const p=G.player;
if(!L('assemble')||!G.friend||G.mode!=='play'){G.guests=null;G.guestT=ASSEMBLE.first;return}
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
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(hyp(e.x-x,e.y-(e.z||0)-y)<R+SPEC[e.type].r*.5){e.hp-=ASSEMBLE.dmg*WK();e.hit=.25;if(e.hp<=0)kill(e)}}
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-x,r.y-y)<R)cutRoot(r);if(G.boss===b&&!b.air&&!b.under&&!b.deadT&&hyp(b.x-x,b.y-y)<b.r*.8+R)hitBoss(ASSEMBLE.dmg) }
}
function zapShock(p,lv){
const S=SK.zap.shock,R=S.r,col=lv===1?'cyan':'gold';
const fy=p.y+20;
for(let i=0;i<10;i++){const a=i/10*TAU+rnd(-.2,.2),c=Math.cos(a),s=Math.sin(a),pts=[[p.x+c*R*.16,fy+s*R*.62*.16]];let x,y;for(let j=1;j<=5;j++){const k=.16+.84*j/5;x=p.x+c*R*k+rnd(-12,12);y=fy+s*R*.62*k+rnd(-9,9);pts.push([x,y])}G.bolts.push({x,y,t:-.02*(i%3),pts,ring:1,col,w:.6,back:s<0?1:0})}
G.shocks.push({x:p.x,y:fy,t:0,r:R,blue:lv===1?1:0,flat:1});flashAt(p.x,fy,R*.45,lv===1?'#dff6ff':'#fff1a8',.2);beep(900,.08,'square',.05,1800);beep(200,.18,'sawtooth',.05,90);
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(hyp(e.x-p.x,e.y-(e.z||0)-p.y)<R+SPEC[e.type].r*.5){e.hp-=S.dmg*WK();e.hit=.25;sparks(e.x,e.y-(e.z||0),6,'#ffe98a');if(e.hp<=0)kill(e)}}
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-p.x,r.y-p.y)<R)cutRoot(r);if(G.boss===b&&!b.air&&!b.shield&&hyp(b.x-p.x,b.y-p.y)<R+b.r*.7)hitBoss(S.dmg,S.boss)}
}
function startZap(p,lv){
const Z=SK.zap,n=Z.strikes[lv],dur=Z.dur[lv];
G.zap={t:0,dur,lv,left:n,next:Z.first,gap:Z.strikeGap,struck:new Set()}; if(Z.charges[lv])p.zapNets=Z.charges[lv];
const hd=typeof HERO_CALL!=='undefined'&&HERO_CALL?heroHand(p):{x:p.x,y:p.y-150},cx=hd.x,cy=hd.y,col=lv===1?'cyan':'gold';
if(lv>=1){
const sx=cx+rnd(-30,30),sy=Math.max(30,cy-380),pts=[[sx,sy]];for(let j=1;j<7;j++){const k=j/7;pts.push([sx+(cx-sx)*k+rnd(-28,28)*(1-k*.6),sy+(cy-sy)*k])}pts.push([cx,cy]);
G.bolts.push({x:cx,y:cy,t:0,pts,wrap:1,back:1,col,w:lv>=2?1.8:1.15});
flashAt(cx,cy-6,lv>=2?80:60,lv===1?'#dff6ff':'#fff1a0',.2);G.shocks.push({x:p.x,y:p.y+20,t:0,r:lv>=2?130:100,blue:lv===1?1:0,flat:1});punch(lv>=2?.09:.05,lv>=2?.2:.12);heroPose('zap');
beep(90,.4,'sawtooth',lv>=2?.09:.06,45);
const rounds=lv>=2?[[.22,135,6],[.46,195,6]]:[[.22,130,5]];
rounds.forEach(([at,R,n],ri)=>{const a0=rnd(0,TAU);for(let i=0;i<n;i++){const a=a0+i/n*TAU+rnd(-.15,.15),gx=p.x+Math.cos(a)*R,gy=p.y+18+Math.sin(a)*R*.55,top=Math.max(30,gy-360),bp=[[gx+rnd(-25,25),top]];
for(let j=1;j<6;j++){const k=j/6;bp.push([bp[0][0]+(gx-bp[0][0])*k+rnd(-18,18)*(1-k),top+(gy-top)*k])}bp.push([gx,gy]);G.bolts.push({x:gx,y:gy,t:-at-i*.015,pts:bp,ring:1,col,back:gy<p.y+18?1:0})}
setTimeout(()=>{if(!G||!G.zap)return;punch(.03+.015*ri,.08);beep(1300-ri*250,.06,'square',.05,240);beep(70,.25,'sawtooth',.05,40)},at*1000)});
}
zapShock(p,lv);
const spx=lv?cx:p.x,spy=lv?cy:p.y-60;
sparks(spx,spy,lv?18:10,lv===1?'#bfe8ff':'#ffe98a',lv?340:240);if(lv>=2)sparks(spx,spy,14,'#fff6b0',360);
float(p.x,p.y-200,lv>=2?'천둥 거품!':lv?'번개 거품!':'찌릿 거품!','#fff6b0',true);
beep(1500,.06,'square',.05,300);setTimeout(()=>beep(300,.2,'sawtooth',.04,1200),60);
}
const STRIKE_R=62;
function boltAt(x,y,dmg,bossK){
const pts=[];let y0=Math.max(70,y-300),x0=x+rnd(-34,34);pts.push([x0,y0]);for(let i=1;i<6;i++){const k=i/6;pts.push([x+rnd(-26,26)*(1-k),y0+(y-y0)*k])}pts.push([x,y]);
const cy=G.zap&&G.zap.lv===1;
G.bolts.push({x,y,t:0,pts,col:cy?'cyan':undefined});punch(.03,.1);burst(x,y,cy?['#fff','#bfe8ff','#7ff0ff']:['#fff','#ffe98a','#fff1a0'],8,190);beep(1400,.05,'square',.05,240);
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(hyp(e.x-x,e.y-(e.z||0)-y)<STRIKE_R+SPEC[e.type].r*.4){e.hp-=dmg*WK();e.hit=.25;if(e.hp<=0)kill(e)}}
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-x,r.y-y)<STRIKE_R)cutRoot(r);if(G.boss===b&&!b.air&&!b.under&&!b.deadT&&hyp(b.x-x,b.y-y)<b.r*.8+STRIKE_R*.5)hitBoss(dmg,bossK)}
}
function stepZap(dt){
const z=G.zap;if(!z)return;const p=G.player,Z=SK.zap,b=G.boss;z.t+=dt;
if(z.t>=z.dur){sparks(p.x,p.y-38,8,z.lv===1?'#bfe8ff':'#fff6b0',200);G.zap=null;return}
if(z.left>0&&z.t>=z.next){
let t=null,best=1e9,t2=null,best2=1e9;
const cand=(o,x,y)=>{const d=hyp(x-p.x,y-p.y);if(d>Z.range)return;if(!z.struck.has(o)&&d<best){best=d;t={o,x,y}}if(d<best2){best2=d;t2={o,x,y}}};
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;cand(e,e.x,e.y-(e.z||0))}
if(b&&!b.air&&!b.under&&!b.deadT)cand(b,b.x,b.y);
const q=t||t2;if(q){z.struck.add(q.o);boltAt(q.x,q.y,Z.strikeDmg[z.lv],Z.shock.boss);z.left--;z.next=z.t+z.gap}else z.next=z.t+.15;
}
}
const NBOSS_CHEW=2;
const NUTRIA_REACH=1.3;
const NUTRIA_DASH=0.9;
const SUMMON_N=[2,3];
const SUMMON_MAX={blue:8,frog:6};
const SUMMON_RATE=1/3;
const SUMMON_ONCE={blue:[3,6],frog:[2,3]};
function summonOnce(b,k){const ph=b.phase>1?1:0;b.sumDone=b.sumDone||[false,false];if(b.sumDone[ph])return 0;b.sumDone[ph]=true;return SUMMON_ONCE[k][ph]}
const NBOSS_REACH=1.5;
function vineForestSpot(){const p=G.player;let best=null,bd=-1;for(const e of G.ents)if(e.type==='vine'&&!e.dead){const d=hyp(e.x-p.x,e.y-p.y);if(d>bd){bd=d;best=e}}return best?{x:best.x,y:best.y}:null}
function summonTurn(b){b.sumAcc=(b.sumAcc===undefined?1-SUMMON_RATE:b.sumAcc)+SUMMON_RATE;if(b.sumAcc>=1-1e-9){b.sumAcc-=1;return true}return false}
const SURGE_GAP=.32;
function surgeStart(p,R,lv){
G.surgeQ=G.surgeQ||[];const list=lv>=2?[SK.wave,SK.wave2]:[SK.wave];
list.forEach((c,i)=>{const big=c===SK.wave2,at=SURGE_GAP*(i+1)+(big?.12:0);G.surgeQ.push({x:p.x,y:p.y,r:R*c.grow,at:G.clock+at,dmg:c.dmg,push:c.push,big});G.swirls.push({x:p.x,y:p.y+20,t:-at,r:R*c.grow,out:1,big})});
}
function stepSurge(){
if(!G.surgeQ||!G.surgeQ.length)return;
for(const q of G.surgeQ){if(q.done||G.clock<q.at)continue;
if(!q.started){q.started=true;q.hitE=new Set();q.bossHit=false;
G.shocks.push({x:q.x,y:q.y+20,t:0,r:q.r,blue:1,flat:1});
beep(q.big?120:240,q.big?.3:.14,q.big?'sawtooth':'sine',q.big?.09:.06,q.big?60:140);
if(q.big){G.waves.push({x:q.x,y:q.y+20,t:0,r:q.r});burst(q.x,q.y,['#fff','#bfe3fb','#5aa9e6'],24,420);flashAt(q.x,q.y,q.r*1.2,'#bfe3fb',.4);punch(.08,.22);float(q.x,q.y-110,'해일!','#d6efff',true)}}
const el=G.clock-q.at,k=Math.min(1,el/.5),ee=1-(1-k)*(1-k),rr=Math.min(q.r,q.r*(.3+.8*ee));
for(const e of G.ents){if(e.dead||e.prot||e.born<.25||q.hitE.has(e))continue;if(hyp(e.x-q.x,e.y-(e.z||0)-q.y)<rr+SPEC[e.type].r*.5){q.hitE.add(e);e.hp-=q.dmg*WK();e.hit=.25;burst(e.x,e.y,['#fff','#8fc7f5'],5,170);if(e.hp<=0)kill(e);else if(e.type!=='vine')shove(e,q.x,q.y,q.push*.4)}}
for(const h of G.hz)if(h.k==='s'&&hyp(h.x-q.x,h.y-q.y)<rr)h.t=99;
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-q.x,r.y-q.y)<rr)cutRoot(r);if(!q.bossHit&&G.boss===b&&!b.air&&!b.shield&&hyp(b.x-q.x,b.y-q.y)<rr+b.r*.7){q.bossHit=true;hitBoss(q.dmg,SK.burst.boss)}}
if(rr>=q.r||el>.6)q.done=true}
G.surgeQ=G.surgeQ.filter(q=>!q.done);
}
const TRAIN={win:10,idle:4};
function beginTraining(){G.trainClock=0;
beginBoss(3);const b=G.boss;G.training=true;b.roots=[];b.shield=false;b.ai={next:()=>({value:99})};b.name='허수아비 · 왕 가시박';
G.trainDmg=0;G.trainLog=[];G.trainT0=G.trainClock;G.trainLast=null;
float(W/2,H*.22,'전투 트레이닝 · 마음껏 때려 보세요!','#fff3c9',true);updateHud(true);
}
function trainDps(){const now=G.trainClock,w=Math.min(TRAIN.win,Math.max(1,now-G.trainT0));G.trainLog=G.trainLog.filter(q=>now-q.t<=TRAIN.win);return G.trainLog.reduce((s,q)=>s+q.d,0)/w}
function trainHit(v){if(G.trainLast==null)G.trainT0=G.trainClock; G.trainDmg+=v;G.trainLog.push({t:G.trainClock,d:v});G.trainLast=G.trainClock}
function trainReset(){const b=G.boss;if(b){b.hp=b.max;b.phase=1}G.trainDmg=0;G.trainLog=[];G.trainT0=G.trainClock;G.trainLast=null;if(b)float(b.x,b.y-b.r-40,'처음부터 다시 재요','#eef6fb');beep(520,.08,'sine',.04,780)}
function stepTraining(dt){
const b=G.boss,p=G.player;if(!b)return;G.clock+=dt;G.t+=dt;const de=dt*fogK();
G.trainClock=(G.trainClock||0)+(G.stopT>0?0:dt);
movePlayer(dt);stepSkill(dt);stepComp(dt);stepGuest(dt);updateNets(dt);if(G.mode!=='play'||!G.boss)return;
for(const e of G.ents){if(e.dead)continue;e.born+=de;e.hit=Math.max(0,(e.hit||0)-de);applyKb(e,dt);if(SPEC[e.type].prot)updateProt(e,de)}
G.ents=G.ents.filter(e=>!e.dead&&!e.gone);keepEntsOut();stepHeron(dt);stepPreds(dt);
p.hp=p.maxHp;b.flash=Math.max(0,b.flash-de);b.puff=Math.max(0,b.puff-de);b.stun=0;b.win=0;
if(G.trainLast!=null&&G.trainClock-G.trainLast>=TRAIN.idle)trainReset();
}
function reviveDummy(b){
b.hp=b.max;b.phase=1;b.flash=.2;
burst(b.x,b.y,['#fff','#bfe28a','#7cb94f'],22,300);flashAt(b.x,b.y,b.r*1.4,'#d6f5c8',.35);float(b.x,b.y-b.r-40,'다시 일어났어요!','#d6f5c8',true);beep(660,.12,'triangle',.06,990);
}
