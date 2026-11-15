/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
let G=null;
function fresh(){
return{mode:'menu',wave:0,t:0,gauge:80,score:0,recov:1.6,shield:0,combo:0,comboT:0,shake:0,flash:0,
ents:[],natives:[],cells:new Map(),plants:[],dying:[],nets:[],parts:[],floats:[],holes:[],bubbles:[],
player:{x:W*.3,y:H*.68,speed:265,netR:54,range:400,cdMax:.34,cd:0,queued:null,stun:0,inv:0,flip:1,walk:0,dmg:1,bubbleT:0,bubbleDur:.7,skillCd:4,skillN:1,skillMax:1,skillLeft:0,skillWin:0,shell:0,shellT:0,trailD:0,hp:5,maxHp:5,regen:0,ctr:0},
trails:[],shocks:[],bolts:[],boltT:0,flames:[],waves:[],jets:[],swirls:[],preds:[],avT:0,trailTick:0,hitStop:0,lv:{},points:0,earned:0,ecoOpen:false,friend:null,stage:'field',hz:[],boss:null,netCount:0,nextMult:1,heronT:6,swoops:[],bossTry:0,bossFails:[0,0,0,0],cheer:0,msgT:0,protT:9,
tally:{blue:0,nutria:0,frog:0,vine:0},safe:0,hits:0,sum:0,sumT:0,timers:{},proT:2,bossDone:false,taken:{},clock:0};
}
function seedNatives(){G.natives=[];for(let i=0;i<12;i++)addNative()}
function addNative(){const p=pondEdge(rnd(0,TAU),rnd(.2,.8));G.natives.push({x:p.x,y:p.y,a:rnd(0,TAU),t:rnd(0,3)})}
const FRIENDS=['otter','turtle','cat'];
const L=id=>FRIENDS.includes(id)?(G.friend===id?(G.lv.buddy||0):0):(G.lv[id]||0);
const isSwitch=n=>FRIENDS.includes(n.id)&&G.ecoOpen&&G.friend!==n.id;
function applyStats(){
const p=G.player,g1=syn('guardian'),s1=syn('sabang'),gr=L('gear');
p.netR=NET_R[L('wide')];p.range=syn('master')?900:255*(1+.22*L('far'));p.cdMax=.36;p.speed=205*(1+.1*L('fast'))*(1+GEAR_B.spd[gr]);p.dmg=(1+.3*L('power'))*(g1?1.15:s1?1.08:1)*(1+GEAR_B.dmg[gr]);
p.skillCd=4*(1-.12*L('train'))*(g1?.9:s1?.95:1)*(1-GEAR_B.cd[gr]);p.skillMax=1+L('chain');p.skillN=Math.min(p.skillN==null?p.skillMax:p.skillN,p.skillMax);
G.recov=1.6+HEAL_R[L('heal')]+BODY_R[L('body')];p.maxHp=3+L('body')+(g1?1:0);p.hp=Math.min(p.hp,p.maxHp);
}
function hudMode(boss){$('#hud').hidden=false;$('#gaugeBox').hidden=boss;$('#bossBox').hidden=!boss;$('#time').className=boss?'pill hearts':'pill';updateSkillStrip()}
function beginWave(i){
G.hurtW=0;G.stage='field';G.wave=i;G.t=0;G.mode='play';G.timers={};const w=WAVES[i];for(const k in w.sp)G.timers[k]=w.sp[k][0];G.proT=i===0?2.5:1.5;G.bossDone=false;G.rushDone=false;G.rushWarned=false;G.rushQ=null;G.harNext=0;G.harN=0;G.mopMsg=0;G.shield=L('safe');G.nextMult=1;G.player.shell=L('shell')?1:0;G.player.skillN=G.player.skillMax;G.player.skillLeft=0;G.player.bubbleT=0;G.player.spdT=G.player.dmgT=G.player.turtleT=G.player.rageT=0;G.player.gusaT=0;G.fogT=0;G.fogCd=0;G.preds=[];G.avT=0;G.comp=null;
showOnly(null);hudMode(false);audioOn();epMusic('field',i);updateHud(true);
}
function fishCharge(e,dt){
const p=G.player;e.cool=Math.max(0,(e.cool||0)-dt);
if(e.cool>0)return false;
if(e.born>.6&&near(e,p)<SPEC[e.type].r+20){hurtPlayer(e);e.cool=AGGR_COOL;const a=Math.atan2(e.y-p.y,e.x-p.x);e.vx=Math.cos(a)*220;e.vy=Math.sin(a)*220}
return false;
}
const AGGR_SP=124,AGGR_COOL=2.6,AGGR_NUT_SP=127.5;
function spawnFish(){
let p,tries=0;do{p=pondEdge(rnd(0,TAU),.95)}while(hyp(p.x-G.player.x,p.y-G.player.y)<230&&++tries<20);
const n=3+(Math.random()<.3?1:0);
const ag=G.stage==='field'&&!G.ents.some(e=>e.aggr&&!e.dead)&&Math.random()<(G.wave===0?.25:.35)?Math.floor(rnd(0,n)):-1;
for(let i=0;i<n;i++){const a=rnd(0,TAU),v=rnd(150,230);G.ents.push({type:'blue',x:p.x+rnd(-30,30),y:p.y+rnd(-30,30),vx:Math.cos(a)*v,vy:Math.sin(a)*v,hp:1,t:rnd(0,.6),born:0,flip:1,aggr:i===ag,cool:1.2})}
}
function edgePoint(){
let x,y,tries=0;do{const s=Math.floor(rnd(0,4));
if(s===0){x=rnd(60,W-60);y=rnd(112,150)}else if(s===1){x=rnd(60,W-60);y=H-rnd(44,70)}else if(s===2){x=rnd(40,90);y=rnd(120,H-60)}else{x=W-rnd(40,90);y=rnd(120,H-60)}
}while((hyp(x-G.player.x,y-G.player.y)<240||inUI(x,y))&&++tries<24);return{x,y};
}
function spawnKBlue(){let p,tries=0;do{p=pondEdge(rnd(0,TAU),.9)}while(hyp(p.x-G.player.x,p.y-G.player.y)<260&&++tries<20);G.ents.push({type:'kblue',x:p.x,y:p.y,vx:0,vy:0,hp:SPEC.kblue.hp,maxHp:SPEC.kblue.hp,t:0,born:0,flip:1,aggr:true,cool:1.5})}
function chewSpot(){let q,n=0;do{q=pondEdge(rnd(0,TAU),1.04)}while(inUI(q.x,q.y)&&++n<20);return q}
function spawnNutria(type='nutria'){const p=edgePoint();const q=chewSpot();G.ents.push({type,x:p.x,y:p.y,hp:SPEC[type].hp,maxHp:SPEC[type].hp,st:'go',t:0,born:0,tx:q.x,ty:q.y,wig:rnd(0,6),cool:1.5})}
function spawnFrog(type='frog'){const p=edgePoint(),hp=type==='frog'&&G.stage==='field'&&G.wave<=2?2:SPEC[type].hp;G.ents.push({type,x:p.x,y:p.y,hp,maxHp:hp,st:'wait',t:.7,born:0,sx:p.x,sy:p.y,tx:p.x,ty:p.y,z:0,hit:0})}
function gridKey(i,j){return i+','+j}
const CELL=50;
function inUI(x,y){for(const b of [joyBase(),skillBase()]){if(hyp(x-b.x/S,y-b.y/S)<(b.R*1.9+CELL*S*.5)/S)return true}return false}
function isLand(x,y){return !inPond(x,y,1.02)&&x>20&&x<W-20&&y>104&&y<H-20&&!inUI(x,y)}
function spawnVine(at,hidden=false){
let p,tries=0;do{p=at?{x:at.x+rnd(-1,1)*Math.min(1,tries/4)*(60+tries*6),y:at.y+rnd(-1,1)*Math.min(1,tries/4)*(50+tries*6)}:edgePoint()}while(!isLand(p.x,p.y)&&++tries<40);
if(!isLand(p.x,p.y))return;
let i=Math.round(p.x/CELL),j=Math.round(p.y/CELL);
if(!isLand(i*CELL,j*CELL)){const c=[[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]].map(([a,b])=>[i+a,j+b]).find(([a,b])=>isLand(a*CELL,b*CELL));if(!c)return;[i,j]=c}
const x=i*CELL,y=j*CELL;
if(!isLand(x,y))return;
const plant={id:Math.random(),i,j,x,y,keys:new Set(),t:.5,alive:true,hidden};G.plants.push(plant);
addCell(plant,i,j);
if(hidden)return null;G.ents.push({type:'vine',x,y,hp:1,plant,born:0,wob:rnd(0,6)});return G.ents[G.ents.length-1];
}
function addCell(pl,i,j){const k=gridKey(i,j);if(G.cells.has(k))return false;G.cells.set(k,{i,j,x:i*CELL,y:j*CELL,pl,g:0,rot:rnd(-.5,.5),flip:Math.random()<.5?-1:1});pl.keys.add(k);return true}
function spawnProt(){
const type=pick(['otter','turtle','gfrog']),side=Math.random()<.5,s=SPEC[type];
const y=clamp(pond.cy+rnd(-pond.b*.95,pond.b*.95),128,H-72);
const sx=side?-70:W+70,tx=side?W+70:-70;
G.ents.push({type,prot:true,x:sx,y,vx:(tx-sx)/s.dur,hp:1,t:rnd(0,3),born:0,startled:false,hop:0,flip:side?1:-1});
}
function near(a,b){return hyp(a.x-b.x,a.y-b.y)}
function float(x,y,txt,col='#fff',big=false){if(G.floats.length>12)G.floats.shift();G.floats.push({x,y,txt,col,big,t:0})}
function burst(x,y,cols,n=10,sp=220){for(let i=0;i<n&&G.parts.length<160;i++){const a=rnd(0,TAU),v=rnd(.3,1)*sp;G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:0,life:rnd(.35,.7),c:pick(cols),s:rnd(4,9),star:Math.random()<.5})}}
function sparks(x,y,n,col,sp=420){for(let i=0;i<n&&G.parts.length<220;i++){const a=rnd(0,TAU),v=rnd(.4,1)*sp;G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-60,t:0,life:rnd(.18,.38),c:col,s:rnd(2.5,4.5),spark:1})}}
function flashAt(x,y,r,col,life=.3){(G.glows||(G.glows=[])).push({x,y,r,col,t:0,life})}
function punch(stop,shake){if(!G)return;G.hitStop=Math.max(G.hitStop||0,stop);if(!reduced&&shake)G.shake=Math.max(G.shake,shake)}
function addScore(pts,x,y){G.combo++;G.comboT=2.6;const m=1+Math.min(G.combo-1,5)*.1,v=Math.round(pts*m);G.score+=v;float(x,y-30,'+'+v+(G.combo>2?' 연속'+G.combo:''),'#fff');beep(520+G.combo*40,.09,'triangle',.08,900+G.combo*50)}
function throwNet(wx,wy){
const p=G.player;if(G.mode!=='play')return;
if(p.stun>0)return;
if(p.cd>0){if(p.cd<.16)p.queued={x:wx,y:wy};return}
const dx=wx-p.x,dy=wy-p.y,d=hyp(dx,dy)||1,k=Math.min(1,p.range/d),tx=p.x+dx*k,ty=p.y+dy*k,dd=d*k;
G.netCount++;const king=L('king')&&G.netCount%(syn('master')?2:3)===0;let mult=G.nextMult;G.nextMult=1;if(p.rageT>0)mult*=1.5;if(p.dmgT>0)mult*=1.15;
const hl=syn('healthy')&&(G.stage==='boss'?p.hp>=p.maxHp:G.gauge>=80)?1.1:1,tr=syn('trap');
G.nets.push({x0:p.x,y0:p.y-50,x1:tx,y1:ty,t:0,dur:Math.max(.06,dd/1500),r:p.netR*(king?1.5:1),rp:NET_R[0]*(king?1.5:1),dmg:p.dmg*(king?2:1)*mult*hl,king:king||mult>1,royal:!!king,fire:!!king&&syn('master'),linger:0,land:0});
const sh=syn('shadow');if(sh&&G.fogT>0){for(const s of shadowSpots(p,dx<0?-1:1)){const ex=tx+rnd(-16,16),ey=ty+rnd(-16,16);G.nets.push({x0:s.x,y0:s.y-20,x1:ex,y1:ey,t:-.08,dur:Math.max(.06,hyp(ex-s.x,ey-s.y)/1500),r:p.netR*.9,rp:NET_R[0]*.9,dmg:p.dmg*SHADOW.dmg[sh]*mult*hl,auto:true,clone:true,land:0})}}
p.cd=p.cdMax;p.flip=dx<0?-1:1;p.thrT=.3;p.thrA=Math.atan2(dy/.5,dx);beep(320,.08,'sine',.05,520);
}
function protPenalty(e){
e.startled=true;G.hits++;G.taken[e.type]=(G.taken[e.type]||0)+1;G.combo=0;G.flash=.45;if(!reduced)G.shake=.35;
burst(e.x,e.y,['#ff6f7d','#ffd1d8'],10,180);sparks(e.x,e.y,10,'#ff6f8a');flashAt(e.x,e.y,150,'#ff4d6d',.4);beep(190,.28,'sawtooth',.09,110);
if(G.stage==='boss'){const p=G.player;p.hp--;float(e.x,e.y-70,'보호종이에요! 하트 -1','#ffd1d8',true);if(p.hp<=0)bossFail()}
else{G.gauge=Math.max(0,G.gauge-20);G.score=Math.max(0,G.score-50);float(e.x,e.y-70,'보호종이에요! 평형 -20','#ffd1d8',true)}
}
function resolveNet(n){
if(!n.clone)flashAt(n.x1,n.y1,n.r*1.6,n.fire?'#ff8a3c':n.royal?'#ffd25a':'#ffffff',.25);
if(n.royal)punch(.05,.14);
if(n.fire){G.flames.push({x:n.x1,y:n.y1,t:0,r:n.r});burst(n.x1,n.y1,['#ff9d3c','#ffd84a','#ff6b3d'],12,230);beep(240,.14,'sawtooth',.05,110)}
const hits=[];let protHit=[];
for(const e of G.ents){
if(e.dead||e.born<.25)continue;if(e.prot&&e.startled)continue;
const s=SPEC[e.type],lim=(e.prot?(n.rp||n.r):n.r)+s.r*.55;const d=Math.min(hyp(e.x-n.x1,e.y-n.y1),hyp(e.x-n.x1,e.y-(e.z||0)-n.y1));
if(d<=lim){if(e.prot)protHit.push(e);else hits.push(e)}
}
if(protHit.length&&!n.auto){
if(G.shield>0){G.shield--;float(protHit[0].x,protHit[0].y-60,'조심조심 그물이 막았어요!','#fff3c9',true);beep(700,.14,'sine',.08)}
else{protHit.forEach(protPenalty);if(G.mode!=='play')return}
}
if(n.linger)n.caught=new Set(hits);const kn=n.clone?0:syn('knot');
for(const e of hits){
if(e.mark>0&&!n.clone){e.hp=0;markHit(e,false);e.mark=0}else e.hp-=n.dmg;
if(e.hp<=0)kill(e);
else{if(kn&&e.st!=='air'&&!(G.clock<(e.knotUntil||0))){e.frz=KNOT.frz[kn];e.knotUntil=G.clock+e.frz+KNOT.rest;G.knots=1}e.hit=.25;if(e.type!=='vine')shove(e,n.x1,n.y1,34);burst(e.x,e.y-(e.z||0),['#fff','#ffd95b'],9,200);sparks(e.x,e.y-(e.z||0),8,'#fff1c8');float(e.x,e.y-50,Math.ceil(e.hp/Math.max(1,G.player.dmg))+'번 더!','#fff');beep(170,.08,'sine',.09,90);beep(620,.05,'square',.04,900);punch(.025,0)}
}
if(G.stage==='boss'&&G.boss){
const b=G.boss;
for(const r of b.roots)if(r.alive&&hyp(r.x-n.x1,r.y-n.y1)<n.r+26)cutRoot(r);
if(G.boss===b&&!b.air&&hyp(b.x-n.x1,b.y-n.y1)<n.r+b.r*.72){const mk=b.mark>0&&!b.shield&&!n.clone;hitBoss(n.dmg,mk||undefined);if(mk)markHit(b,true);n.bossHit=true}
return;
}
let cut=0;
for(const [k,c] of G.cells){if(hyp(c.x-n.x1,c.y-n.y1)<n.r+10){if(hits.some(h=>h.plant===c.pl))continue;removeCell(k,c);cut++}}
if(cut){G.score+=cut*2;burst(n.x1,n.y1,['#7cb94f','#cfeeb0'],Math.min(10,cut*2),170)}
}
function trapTick(n){
const c=n.caught||(n.caught=new Set());
for(const e of G.ents){if(e.dead||e.prot||e.born<.25||c.has(e))continue;if(hyp(e.x-n.x1,e.y-(e.z||0)-n.y1)<n.r+SPEC[e.type].r*.55){c.add(e);e.hp-=n.dmg;e.hit=.25;if(n.trap)trapSnap(n,e.x,e.y-(e.z||0));else burst(e.x,e.y,['#fff','#9fe3da'],6,150);if(e.hp<=0)kill(e)}}
const b=G.boss,sh=n.share;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-n.x1,r.y-n.y1)<n.r+26)cutRoot(r);if(!n.bossHit&&!(sh&&sh.boss)&&G.boss===b&&!b.air&&!b.shield&&hyp(b.x-n.x1,b.y-n.y1)<n.r+b.r*.72){n.bossHit=true;if(sh)sh.boss=true;hitBoss(n.dmg);if(n.trap)trapSnap(n,n.x1,n.y1)}}
}
function trapSnap(n,x,y){
n.snapAt=n.land;n.snapN=(n.snapN||0)+1;
float(x,y-64,'철컹!','#ffe2a0',true);
burst(n.x1,n.y1-20,['#e6f7ff','#9fd8ef','#ffffff','#bfe3fb'],16,320);
burst(n.x1,n.y1-24,['#d9b26a','#a77a3c','#f0dca6'],7,210);
punch(.07,.12);
beep(1320,.05,'square',.06,560);beep(880,.06,'square',.05,420);beep(150,.14,'sine',.08,80);
}
function shove(e,fx,fy,dist){const d=hyp(e.x-fx,e.y-fy)||1,T=.28;e.kbx=(e.x-fx)/d*dist/T;e.kby=(e.y-fy)/d*dist/T;e.kbT=T}
function applyKb(e,dt){if(!(e.kbT>0))return;const t=Math.min(dt,e.kbT);e.kbT-=dt;if(e.st==='air'||e.type==='vine')return;e.x=clamp(e.x+e.kbx*t,30,W-30);e.y=clamp(e.y+e.kby*t,110,H-30)}
function waterCannon(p,lv){
const len=[0,380,520][lv],dmg=[0,1,2][lv],w=56,b=G.boss;let a=p.flip<0?Math.PI:0,best=1e9;
if(b&&!b.air&&!b.shield&&hyp(b.x-p.x,b.y-p.y)<len+b.r){a=Math.atan2(b.y-p.y,b.x-p.x);best=0}
if(best&&b)for(const r of b.roots){if(!r.alive)continue;const d=hyp(r.x-p.x,r.y-p.y);if(d<len&&d<best){best=d;a=Math.atan2(r.y-p.y,r.x-p.x)}}
if(best)for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;const d=hyp(e.x-p.x,e.y-p.y);if(d<len&&d<best){best=d;a=Math.atan2(e.y-p.y,e.x-p.x)}}
const ox=p.x,oy=p.y-10,inBeam=(x,y,r)=>{const dx=x-ox,dy=y-oy,al=dx*Math.cos(a)+dy*Math.sin(a),pe=-dx*Math.sin(a)+dy*Math.cos(a);return al>-10&&al<len+r&&Math.abs(pe)<w/2+r};
G.jets.push({x:ox,y:oy,a,len,t:0});punch(.02,.1);beep(260,.22,'sawtooth',.05,520);
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(inBeam(e.x,e.y-(e.z||0),SPEC[e.type].r*.6)){e.hp-=dmg;e.hit=.25;burst(e.x,e.y,['#fff','#8fc7f5'],5,150);if(e.hp<=0)kill(e)}}
if(b){for(const r of b.roots)if(r.alive&&inBeam(r.x,r.y,26))cutRoot(r);if(G.boss===b&&!b.air&&!b.shield&&inBeam(b.x,b.y,b.r*.7))hitBoss(dmg)}
}
const PRED={blue:'snakehead',kblue:'snakehead',frog:'egret',boss:'egret',nutria:'leopard',nboss:'leopard',vine:'heron',bblue:'snakehead',bfrog:'egret',bnutria:'leopard',bvine:'heron'};
const PRED_N={snakehead:'가물치',egret:'백로',leopard:'삵',heron:'왜가리'};
function callPredator(n){
let t=null,art=null;const b=G.boss;
if(b&&!b.air&&hyp(b.x-n.x1,b.y-n.y1)<n.r+b.r*.72+40){art=PRED[b.art];t=b.shield?(b.roots.find(r=>r.alive)||null):b}
if(!t){let best=n.r+80;for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;const d=hyp(e.x-n.x1,e.y-n.y1);if(d<best){best=d;t=e}}if(t)art=PRED[t.type]}
if(!t)return;G.avT=3;
G.preds.push({x:t.x,y:t.y,t:0,target:t,art,flip:Math.random()<.5});float(t.x,t.y-90,PRED_N[art]+' 출동!','#e9f7d6',true);beep(990,.08,'triangle',.06,1480);
}
function stepPreds(dt){
for(const q of G.preds){q.t+=dt;if(q.t>=.42&&!q.done){q.done=true;let t=q.target;const b=G.boss;
if(t.isRoot){if(t.alive)cutRoot(t)}
else if(t===b){if(G.boss===b&&!b.air)hitBoss(2)}
else{if(t.dead||t.gone){t=null;let best=220;for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;const d=hyp(e.x-q.x,e.y-q.y);if(d<best){best=d;t=e}}if(t){q.x=t.x;q.y=t.y}}
if(t){t.hp-=2;t.hit=.25;if(t.hp<=0)kill(t)}}
burst(q.x,q.y,['#fff','#cfeeb0','#ffd95b'],10,200);beep(700,.08,'square',.05,420)}}
G.preds=G.preds.filter(q=>q.t<.7);
}
function keepOutUI(o,r){
for(const z of [joyBase(),skillBase()]){const cx=z.x/S,cy=z.y/S,R=z.R*1.35/S+r,dx=o.x-cx,dy=o.y-cy,d=hyp(dx,dy);
if(d<R){const k=d>1?R/d:0;if(k){o.x=cx+dx*k;o.y=cy+dy*k}else{o.x=cx+R*.7;o.y=cy-R*.7}}}
}
function keepEntsOut(){for(const e of G.ents)if(!e.dead&&!e.prot&&e.type!=='vine'&&e.st!=='air')keepOutUI(e,SPEC[e.type].r*.6)}
function kbAimA(p){return p.aimLock!=null?p.aimLock:(p.faceA!=null?p.faceA:(p.flip<0?Math.PI:0))}
function kbThrow(p){
const a=kbAimA(p),R=p.range,cand=[],b=G.boss;let best=null,bd=1e9;
for(const e of G.ents)if(!e.dead&&!e.prot&&e.born>.25)cand.push({x:e.x,y:e.y-(e.z||0),r:0});
if(b&&!b.air){if(b.shield)b.roots.forEach(r=>{if(r.alive)cand.push({x:r.x,y:r.y,r:0})});else cand.push({x:b.x,y:b.y,r:b.r*.6})}
for(const c of cand){const dx=c.x-p.x,dy=c.y-p.y,d=hyp(dx,dy);if(d>R+c.r)continue;let da=Math.abs(Math.atan2(dy,dx)-a);if(da>Math.PI)da=TAU-da;if(da<Math.PI/6&&d<bd){bd=d;best=c}}
if(best)throwNet(best.x,best.y);else throwNet(p.x+Math.cos(a)*R,p.y+Math.sin(a)*R);
}
function hzHurt(h){hurtPlayer({x:h.x,y:h.y},!0)}
function shieldBroke(p){
if(L('thorns'))shockwave(p);
if(syn('fort')){p.rageT=5;float(p.x,p.y-40,'람사르 협약! 5초간 피해 +50%','#ffd1d8',true)}
if(syn('sanct')){p.inv=Math.max(p.inv,ECO_SYN.sanctT[syn('sanct')]);float(p.x,p.y-100,'보호구역!','#d9f7c9')}
if(syn('double')&&G.comp){const lv=syn('double');let n=0;for(const e of G.ents){if(e.dead||e.prot||e.type==='vine'||e.st==='air')continue;if(hyp(e.x-p.x,e.y-p.y)<ECO_SYN.doubleR[lv]){e.frz=ECO_SYN.doubleT[lv];n++}}if(n){float(G.comp.x,G.comp.y-50,'꽉 붙잡아!','#e8efc9',true);burst(p.x,p.y,['#8a9b58','#e8efc9','#fff'],14,240)}}
if(syn('neighbor')&&G.comp&&otterStrike(ECO_SYN.neighborDmg[syn('neighbor')])){G.comp.act.extra=ECO_SYN.neighborHits[syn('neighbor')];float(G.comp.x,G.comp.y-50,'반격!','#ffe3c9')}
}
const GEAR_B={dmg:[0,0,.06,.09],spd:[0,0,.04,.07],cd:[0,0,.05,.08]};
const BODY_R=[0,.2,.4,.6],SHELL_RE=[0,0,32,24],HEAL_R=[0,.2,.4,.6],HEAL_T=[0,30,24,18];
const GRAB=[0,.5,.8,1.1];
const COMP={otter:{cd:[0,2.2,1.9,1.7],n:'수달'},turtle:{cd:[0,5,4,3],n:'남생이'},cat:{cd:[0,5.3,4.4,4],n:'삵'}};
const compType=()=>['otter','turtle','cat'].find(k=>L(k))||null;
const COMP_ART={otter:'otter',turtle:'turtle',cat:'leopardG'};
const compCd=k=>COMP[k].cd[L(k)]*(1-.1*Math.max(0,L('gear')-1));
function stepComp(dt){
const k=compType(),p=G.player;if(!k){G.comp=null;return}
if(!G.comp)G.comp={x:p.x-60,y:p.y+12,t:1.5,act:null,hop:0};
const c=G.comp;c.hop+=dt;
if(k==='turtle'){const b=G.boss;if(b&&b.grabbed&&!(b.win>0)&&!(b.stun>0))b.grabbed=false;
if(b&&(b.win>0||b.stun>0)&&!b.grabbed&&!b.deadT&&!(c.act&&c.act.kind==='bump')){b.grabbed=true;const ex=GRAB[L('turtle')];if(b.win>0)b.win+=ex;else b.stun+=ex;c.act={kind:'grab',t:0};float(b.x,b.y-b.r-40,'남생이가 붙잡았어요!','#e8efc9',true);beep(330,.2,'triangle',.07,520)}}
if(c.act){const a=c.act;a.t+=dt;
if(a.kind==='pounce'){const W0=.1,q=clamp((a.t-W0)/.28,0,1);if(a.t<W0+.28){c.x=a.sx+(a.tx-a.sx)*q;c.y=a.sy+(a.ty-a.sy)*q-Math.sin(q*Math.PI)*70}else if(!a.done){a.done=true;compHit(a)}if(a.t>=.6)c.act=null}
else if(a.kind==='dash'){const q=Math.min(1,a.t/.3);c.x=a.sx+(a.tx-a.sx)*q;c.y=a.sy+(a.ty-a.sy)*q;otterSweep(a);if(Math.random()<.7)burst(c.x,c.y+8,['#e4f6ff','#fff','#9fd8ef'],2,90);if(a.t>=.42)c.act=null}
else if(a.kind==='bite'||a.kind==='bump'){const T=a.kind==='bump'?.24:.18,q=Math.min(1,a.t/T);if(a.t<T){c.x=a.sx+(a.tx-a.sx)*q;c.y=a.sy+(a.ty-a.sy)*q}else if(!a.done){a.done=true;compHit(a)}if(a.t>=.42)c.act=null}
else if(a.kind==='grab'){const b=G.boss;if(!b||!(b.win>0||b.stun>0))c.act=null;else{const tx=b.x-b.r*.75,ty=b.y+b.r*.35;c.x+=(tx-c.x)*Math.min(1,dt*10);c.y+=(ty-c.y)*Math.min(1,dt*10)}}
else if(a.t>=.6)c.act=null}
if(!c.act||c.act.kind==='pose'){const tx=p.x-p.flip*60,ty=p.y+14;c.x+=(tx-c.x)*Math.min(1,dt*6);c.y+=(ty-c.y)*Math.min(1,dt*6)}
for(const e of G.ents)if(e.mark>0)e.mark-=dt;if(G.boss&&G.boss.mark>0)G.boss.mark-=dt;
if(c.act)return;
c.t-=dt*(k==='cat'&&syn('stalk')&&(p.shell>0||p.turtleT>0)?ECO_SYN.stalkK[syn('stalk')]:1);if(c.t>0)return;
if(k==='otter'){c.t=otterStrike(1)?compCd(k):.3}
else if(k==='turtle'){c.t=turtleBump()?compCd(k):.3}
else{c.t=catPounce()?compCd(k):.3}
}
function otterStrike(dmg){
const c=G.comp,p=G.player,b=G.boss,R=280;if(!c)return false;let t=null,best=R;
if(!t)for(const e of G.ents){if(e.dead||e.prot||e.born<.25||e.type==='vine')continue;const d=hyp(e.x-p.x,e.y-(e.z||0)-p.y);if(d<best){best=d;t=e}}
if(!t&&b){const r=b.roots.find(r=>r.alive&&hyp(r.x-p.x,r.y-p.y)<R);if(r)t=r;else if(!b.air&&!b.shield&&hyp(b.x-p.x,b.y-p.y)<R+b.r)t=b}
if(!t)return false;
const tx=t.x,ty=t.y-(t.z||0),dx=tx-c.x,dy=ty-c.y,d=Math.max(1,hyp(dx,dy)),over=Math.min(110,(t===b?b.r*.6:0)+90),ex=clamp(tx+dx/d*over,30,W-30),ey=clamp(ty+dy/d*over,60,H-30);
c.act={kind:'dash',t:0,sx:c.x,sy:c.y,tx:ex,ty:ey,dmg,hitS:new Set(),boss:false};beep(700,.06,'square',.04,900);beep(420,.18,'sine',.03,260);return true;
}
function otterSweep(a){
const c=G.comp,b=G.boss,R=40;
for(const e of G.ents){if(a.nHit>=(L('otter')>=3?3:2)+(a.extra||0))break; if(e.dead||e.prot||e.born<.25||e.type==='vine'||a.hitS.has(e))continue;if(hyp(e.x-c.x,e.y-(e.z||0)-c.y)<R+(SPEC[e.type].r||20)*.6){a.hitS.add(e);a.nHit=(a.nHit||0)+1;sproutHit(e);e.hp-=a.dmg;e.hit=.25;burst(e.x,e.y-(e.z||0),['#fff','#c9a27a','#ffd95b'],8,180);beep(420,.08,'square',.05,260);if(e.hp<=0)kill(e);else float(e.x,e.y-50,'앙!','#fff')}}
if(b&&!b.deadT){for(const r of b.roots)if(r.alive&&!a.hitS.has(r)&&hyp(r.x-c.x,r.y-c.y)<R+20){a.hitS.add(r);cutRoot(r)}
if(!a.boss&&!b.air&&!b.shield&&hyp(b.x-c.x,b.y-c.y)<b.r*.8+R){a.boss=true;burst(c.x,c.y,['#fff','#c9a27a','#ffd95b'],10,200);hitBoss(a.dmg,true);sproutHit(b,true)}}
for(const h of G.hz)if(h.k==='s'&&h.t<90&&hyp(h.x-c.x,h.y-c.y)<h.r+R){h.t=99;burst(h.x,h.y,['#d9f2ff','#fff'],6,150)}
}
function turtleBump(){
const c=G.comp,p=G.player;let t=null,best=260;
const cand=G.ents.filter(e=>!(e.dead||e.prot||e.born<.25||e.type==='vine'||e.st==='air'||e.frz>0)&&hyp(e.x-p.x,e.y-p.y)<best);let sc=-1;
for(const e of cand){const k=cand.filter(o=>hyp(o.x-e.x,o.y-e.y)<110).length-hyp(e.x-p.x,e.y-p.y)/1000;if(k>sc){sc=k;t=e}}
const b=G.boss;if(!t&&b&&!b.deadT&&!b.air&&!b.shield&&hyp(b.x-p.x,b.y-p.y)<300+b.r){const dx=p.x-b.x,dy=p.y-b.y,d=hyp(dx,dy)||1;c.act={kind:'bump',t:0,sx:c.x,sy:c.y,tx:b.x+dx/d*b.r*.7,ty:b.y+dy/d*b.r*.7,target:b};beep(240,.08,'square',.05,180);return true}
if(!t)return false;c.act={kind:'bump',t:0,sx:c.x,sy:c.y,tx:t.x,ty:t.y,target:t};beep(240,.08,'square',.05,180);return true;
}
function catPounce(){
const c=G.comp,p=G.player,b=G.boss;let t=null,best=330;
if(b&&!b.deadT&&!b.air&&!b.shield&&hyp(b.x-p.x,b.y-p.y)<420+b.r)t=b;
else{let hp=-1;for(const e of G.ents){if(e.dead||e.prot||e.born<.25||e.type==='vine')continue;const d=hyp(e.x-p.x,e.y-(e.z||0)-p.y);if(d>420)continue;if(e.hp>hp||(e.hp===hp&&d<best)){hp=e.hp;best=d;t=e}}}
if(!t)return false;c.act={kind:'pounce',t:0,sx:c.x,sy:c.y,tx:t.x,ty:t.y-(t.z||0),target:t};beep(880,.06,'triangle',.05,1200);return true;
}
function markHit(t,isBoss){
if(isBoss){float(t.x,t.y-t.r-40,'덥석! -'+(3+ECO_SYN.foodBossDmg[syn('foodweb')]),'#ffd9a8',true);if(syn('foodweb')){G.markN=(G.markN||0)+1;const p=G.player,k=G.markN%FOODWEB.bossHits;if(k===0&&p.hp<p.maxHp){p.hp++;float(p.x,p.y-70,'먹이사슬! 하트 +1','#ffe3e8',true)}else float(t.x,t.y-t.r-70,'먹이사슬 '+(k||FOODWEB.bossHits)+'/'+FOODWEB.bossHits,'#ffd9a8')}}
else{if(G.stage==='field'&&syn('foodweb')){const g=ECO_SYN.foodGauge[syn('foodweb')];G.gauge=Math.min(100,G.gauge+g);float(t.x,t.y-70,'먹이사슬! 평형 +'+g,'#ffd9a8',true)}else float(t.x,t.y-70,'사냥 성공!','#ffd9a8',true)}
burst(t.x,t.y-(t.z||0),['#ffb35a','#fff','#ffd9a8'],14,260);beep(990,.08,'triangle',.07,1500);
}
function compHit(a){
if(a.kind==='pounce'){const t=a.target;burst(a.tx,a.ty,['#ffb35a','#fff','#ffd9a8'],14,240);beep(600,.08,'square',.06,900);
if(t===G.boss){if(!t.deadT&&!t.air&&!t.shield){hitBoss(3+ECO_SYN.foodBossDmg[syn('foodweb')],true);markHit(t,true)}}
else if(!t.dead){t.hp-=3;t.hit=.3;if(t.hp<=0){kill(t);markHit(t,false)}else float(t.x,t.y-50,'덥석!','#ffd9a8')}return}
if(a.kind==='bump'){const t=a.target,RR=110,b=G.boss;G.shocks.push({x:a.tx,y:a.ty,t:0,r:RR});if(!reduced)G.shake=Math.max(G.shake,.12);
let n=0;for(const e of G.ents){if(e.dead||e.prot||e.born<.25||e.st==='air'||e.type==='vine')continue;if(hyp(e.x-a.tx,e.y-a.ty)<RR+(SPEC[e.type].r||20)*.5){e.frz=1;e.hit=.2;e.hp-=1;n++;if(e.hp<=0)kill(e)}}
if(b&&!b.deadT&&!b.air&&!b.shield&&(t===b||hyp(b.x-a.tx,b.y-a.ty)<RR+b.r*.6)){hitBoss(1,true);n++}
float(a.tx,a.ty-60,'쿵!','#e8efc9',n>1);burst(a.tx,a.ty,['#8a9b58','#e8efc9','#fff'],8,170);beep(200,.1,'triangle',.06,120);return}
const t=a.target,b=G.boss;burst(a.tx,a.ty,['#fff','#c9a27a','#ffd95b'],8,180);beep(420,.08,'square',.05,260);
if(t.isRoot){if(t.alive)cutRoot(t)}else if(t===b){if(G.boss===b&&!b.air)hitBoss(a.dmg,true)}else if(!t.dead){t.hp-=a.dmg;t.hit=.25;if(t.hp<=0)kill(t);else float(t.x,t.y-50,'앙!','#fff')}
}
function removeCell(k,c){c.pl.keys.delete(k);G.cells.delete(k);G.dying.push({x:c.x,y:c.y,rot:c.rot,flip:c.flip,t:0})}
function kill(e){
e.dead=true;const s=SPEC[e.type];punch(.045,.1);beep(110,.1,'triangle',.08,55);
const key=e.type==='boss'?'frog':e.type==='nboss'?'nutria':e.type==='kblue'?'blue':e.type;G.tally[key]=(G.tally[key]||0)+1;
if(key!==e.type)G.tally[e.type]=(G.tally[e.type]||0)+1;
addScore(s.pts,e.x,e.y-(e.z||0));
burst(e.x,e.y-(e.z||0),['#fff','#ffd95b','#ff8fa8','#9fe3da'],14,240);
sparks(e.x,e.y-(e.z||0),14,'#ffe2a0');sparks(e.x,e.y-(e.z||0),6,'#ffffff',300);flashAt(e.x,e.y-(e.z||0),130,'#ffd27a',.35);
G.bubbles.push({art:s.art,x:e.x,y:e.y-(e.z||0),t:0,k:e.type==='boss'?1.65/1.65:e.type==='nboss'?.9/.56:e.type==='kblue'?.8/.46:(e.type==='frog'?1/1.65:1)});
if(e.plant){e.plant.alive=false;for(const k of [...e.plant.keys]){const c=G.cells.get(k);if(c)removeCell(k,c)}}
if(e.links)for(const pl of e.links){pl.alive=false;for(const k of [...pl.keys]){const c=G.cells.get(k);if(c)removeCell(k,c)}}
if(e.type==='boss')float(e.x,e.y-110,'대장 황소개구리를 잡았어요!','#fff3c9',true);
if(e.type==='nboss')float(e.x,e.y-110,'대장 뉴트리아를 잡았어요!','#fff3c9',true);
if(e.type==='kblue')float(e.x,e.y-100,'대장 블루길을 잡았어요!','#fff3c9',true);
}
function shockwave(p){G.shocks.push({x:p.x,y:p.y,t:0,r:210});beep(180,.2,'sawtooth',.07,420);
for(const e of G.ents){if(e.dead||e.prot)continue;if(hyp(e.x-p.x,e.y-p.y)<210){e.hp-=2;e.hit=.25;if(e.hp<=0)kill(e)}}
if(G.boss&&!G.boss.air&&hyp(G.boss.x-p.x,G.boss.y-p.y)<230+G.boss.r)hitBoss(2,true)}
function hurtPlayer(by,isHazard,touch){
const p=G.player;
if(p.bubbleT>0||p.gusaT>0){if(G.clock-G.msgT>.4){G.msgT=G.clock;float(p.x,p.y-60,'막았어요!','#d6efff');beep(760,.1,'sine',.07,1100)}return}
if(p.inv>0)return;
if(p.turtleT>0){p.turtleT=0;p.inv=.9;float(p.x,p.y-70,'등딱지가 막았어요!','#e8efc9',true);beep(520,.18,'sine',.08,260);burst(p.x,p.y,['#8a9b58','#fff'],12,200);shieldBroke(p);return}
if(p.shell>0){p.shell=0;p.shellT=0;p.inv=.9;float(p.x,p.y-70,'보호막!','#bfe3fb',true);beep(620,.18,'sine',.08,300);burst(p.x,p.y,['#bfe3fb','#fff'],12,200);shieldBroke(p);return}
G.hurtW=(G.hurtW||0)+1;
const boss=G.stage==='boss';p.stun=boss?.3:.55;p.inv=boss?1.5:1.2;const d=near(p,by)||1;p.kx=(p.x-by.x)/d*520;p.ky=(p.y-by.y)/d*520;G.combo=0;
const dmg=boss?0:hitGauge(by,touch);
float(p.x,p.y-70,boss?'하트 -1':'앗! 평형 -'+dmg,'#ffd1d8',true);beep(230,.16,'square',.07,150);if(!reduced)G.shake=Math.max(G.shake,boss?.3:.18);
if(L('thorns'))shockwave(p);
if(!boss){const hd=dmg*(G.help?HELP.gaugeLoss:1);if(G.help)G.helpDone=(G.helpDone||0)+hd;G.gauge=Math.max(0,G.gauge-hd);G.flash=Math.max(G.flash,.2);if(G.gauge<=0){endGame(false);return}}
if(boss){p.hp--;G.flash=.3;if(p.hp<=0)bossFail();else if(p.hp===1&&syn('gusa')&&!p.gusaUsed){p.gusaUsed=true;p.gusaT=9;float(p.x,p.y-90,'구사일생!','#fff3c9',true);burst(p.x,p.y,['#ffc93c','#fff','#e5a51a'],18,260);beep(520,.25,'triangle',.09,1040)}}
}
function useSkill(){
const p=G&&G.player;if(!p||G.mode!=='play'||p.skillN<=0||p.bubbleT>0)return;
p.skillId=(p.skillId||0)+1;p.skillN--;if(p.skillLeft<=0)p.skillLeft=p.skillCd;p.bubbleT=p.bubbleDur;p.skillWin=p.bubbleDur+1;p.stun=0;
burst(p.x,p.y,['#fff','#bfe3fb','#8fc7f5'],10,200);beep(520,.16,'sine',.07,880);
const l=L('burst');if(l)skillBurst(p,l);
const cn=syn('cannon');if(cn)waterCannon(p,cn);
if(L('trail'))startBoltDash(p,syn('bolt'));
if(L('fog')&&!(G.fogCd>0)){G.fogT=fogDur(L('fog'));G.stopT=syn('mist')>=2?G.fogT*WORLD_STOP:0;G.fogCd=FOG_CD;G.tickT=0;const td=syn('tide');if(syn('mist')){G.worldOn=true;G.worldFlash=.35;G.worldClock=WORLD_CLOCK;beep(140,.5,'sawtooth',.08,60)}else float(p.x,p.y-70,td?'소용돌이!':'습지 안개!','#eef6fb',true)
if(td){const TR=[0,300,400][td];let g=null,best=TR,gx,gy;for(const e of G.ents){if(e.dead||e.prot||e.type==='vine'||e.born<.25)continue;const d=hyp(e.x-p.x,e.y-p.y);if(d<best){best=d;g=e}}
const bb=G.boss;if(g){gx=g.x;gy=g.y-(g.z||0)}else if(bb&&!bb.air&&hyp(bb.x-p.x,bb.y-p.y)<TR+bb.r){gx=bb.x;gy=bb.y}
if(gx!==undefined){G.swirls.push({x:gx,y:gy,t:0,r:TR*.7,out:0});for(const e of G.ents){if(e.dead||e.prot||e.type==='vine'||e.born<.25||e===g)continue;const d=hyp(e.x-gx,e.y-gy);if(d<TR&&d>30)shove(e,gx,gy,-(d-25))}
G.nets.push({x0:p.x,y0:p.y-20,x1:gx,y1:gy,t:0,dur:.32,r:p.netR*[0,1.3,1.6][td],rp:NET_R[0],dmg:p.dmg*[0,1,1.5][td],auto:true,tide:true,land:0,linger:td>=2?TIDE.linger:0,dot:td>=2})}}}
}
function skillBurst(p,l){
const wb=syn('wideburst'),eb=syn('ebb'),k=[1,1.15,1.3][wb],R=(170+25*l)*[1,1.2,1.35][wb];G.shocks.push({x:p.x,y:p.y,t:0,r:R,blue:1});if(eb)G.swirls.push({x:p.x,y:p.y,t:0,r:R,out:1});if(wb){G.waves.push({x:p.x,y:p.y,t:0,r:R});burst(p.x,p.y,['#fff','#bfe3fb','#5aa9e6'],16,300)}float(p.x,p.y-70,wb?'물보라!':eb?'거센 파도!':'펑!','#fff3c9',true);if(eb)surgeStart(p,R,eb,k);beep(150,.18,'square',.08,300);
for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(hyp(e.x-p.x,e.y-(e.z||0)-p.y)<R+SPEC[e.type].r*.5){e.hp-=(l+(eb?SURGE.dmg[eb][0]:0))*k;e.hit=.25;burst(e.x,e.y,['#fff','#8fc7f5'],6,180);if(e.hp<=0)kill(e);else if(eb&&e.type!=='vine')shove(e,p.x,p.y,SURGE.push[eb])}}
for(const h of G.hz)if(h.k==='s'&&hyp(h.x-p.x,h.y-p.y)<R)h.t=99;
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&hyp(r.x-p.x,r.y-p.y)<R)cutRoot(r);if(G.boss===b&&!b.air&&!b.shield&&hyp(b.x-p.x,b.y-p.y)<R+b.r*.7)hitBoss((.2+.6*(l+(eb?SURGE.dmg[eb][0]:0)))*k,true)}
}
function boltStrike(lv){
const near2=(x,y,r)=>G.trails.some(t=>hyp(t.x-x,t.y-y)<t.r+r);
const dmg=2,b=G.boss,q0=G.player,used=q0.boltBoss===q0.skillId?(q0.boltN||0):0;
let tx=null,ty=null,done=null;
if(b&&!b.air&&!b.shield&&used<2&&near2(b.x,b.y,b.r+40)){tx=b.x;ty=b.y;q0.boltBoss=q0.skillId;q0.boltN=used+1;done=()=>hitBoss(dmg,true)}
if(tx===null&&b)for(const r of b.roots)if(r.alive&&near2(r.x,r.y,70)){tx=r.x;ty=r.y;done=()=>cutRoot(r);break}
if(tx===null){let best=1e9,pick2=null;for(const e of G.ents){if(e.dead||e.prot||e.born<.25||!near2(e.x,e.y,70))continue;const d=hyp(e.x-G.player.x,e.y-G.player.y);if(d<best){best=d;pick2=e}}
if(pick2){tx=pick2.x;ty=pick2.y-(pick2.z||0);done=()=>{for(const e of G.ents){if(e.dead||e.prot||e.born<.25)continue;if(hyp(e.x-tx,e.y-(e.z||0)-ty)<62){e.hp-=dmg*1.4;e.hit=.25;if(e.hp<=0)kill(e)}}}}}
if(tx===null)return false;
const pts=[];let y=Math.max(70,ty-300),x=tx+rnd(-34,34);pts.push([x,y]);const n=6;for(let i=1;i<n;i++){const k=i/n;pts.push([tx+rnd(-26,26)*(1-k),y+(ty-y)*k])}pts.push([tx,ty]);
G.bolts.push({x:tx,y:ty,t:0,pts});punch(.03,.1);burst(tx,ty,['#fff','#ffe98a','#bfe3fb'],8,190);beep(1400,.05,'square',.05,240);setTimeout(()=>beep(170,.14,'triangle',.06,90),40);
done();return true;
}
function stepSkill(dt){
const p=G.player;p.bubbleT=Math.max(0,p.bubbleT-dt);for(const k of ['spdT','dmgT','turtleT','rageT'])p[k]=Math.max(0,(p[k]||0)-dt);
G.fogT=Math.max(0,(G.fogT||0)-dt);G.stopT=Math.max(0,(G.stopT||0)-dt);if(G.fogCd>0){G.fogCd-=dt;if(G.fogCd<=0)float(p.x,p.y-60,'안개 준비','#eef6fb')}
if(G.worldOn){const live=syn('mist')>=2?G.stopT>0:G.fogT>0;
G.tickT=(G.tickT||0)-dt;if(G.tickT<=0&&live){G.tickT=.5;beep(1300,.03,'square',.03)}if(!live){G.worldOn=false;float(W/2,H*.3,'그리고 시간은 다시 흐른다','#eef0ff',true)}}
if(false){p.trailD+=dt; if(p.trailD>=.06){p.trailD=0;G.trails.push({x:p.x,y:p.y,t:0,life:1.0+.25*L('trail'),r:36+4*L('trail')})}}
stepBoltDash(dt);
stepSurge();
if(p.gusaT>0){p.gusaT-=dt;if(p.gusaT<=0){p.gusaT=0;p.inv=Math.max(p.inv,.6);shockwave(p);burst(p.x,p.y,['#ffc93c','#e5a51a','#fff'],20,320);float(p.x,p.y-80,'가시 방울 펑!','#fff3c9',true)}}
if(G.avT>0)G.avT-=dt;
for(const t of G.trails)t.t+=dt;G.trails=G.trails.filter(t=>t.t<t.life);
G.trailTick-=dt;
if(G.trails.length&&G.trailTick<=0){G.trailTick=.34;const dmg=.5+.25*L('trail');
const onT=(x,y,r)=>G.trails.some(t=>hyp(t.x-x,t.y-y)<t.r+r);
for(const e of G.ents){if(e.dead||e.prot)continue;if(onT(e.x,e.y,SPEC[e.type].r*.6)){e.hp-=dmg;e.hit=.2;if(e.hp<=0)kill(e)}}
const b=G.boss;if(b){for(const r of b.roots)if(r.alive&&onT(r.x,r.y,26))cutRoot(r);if(G.boss===b&&!b.air&&onT(b.x,b.y,b.r*.8)&&G.clock-(G.trailBossT||-9)>=.5){G.trailBossT=G.clock;hitBoss(dmg,true)}}
for(const [k,c] of [...G.cells])if(onT(c.x,c.y,10))removeCell(k,c);
}
}
const RUSH_A={top:-Math.PI/2,bottom:Math.PI/2,left:Math.PI,right:0},RUSH_WARN=1.8;
function rushSpot(side){return{top:{x:W/2,y:rnd(122,150)},bottom:{x:W/2,y:H-rnd(54,70)},left:{x:rnd(60,90),y:H*.45},right:{x:W-rnd(60,90),y:H*.45}}[side]}
function rushList(r){return r.list||['top','bottom','left','right'].map(side=>({side,kind:r.kind,n:r.n}))}
function spawnFishAt(a,n,red=0){const p=pondEdge(a,.95);for(let i=0;i<n;i++){const b=rnd(0,TAU),v=rnd(150,230);G.ents.push({type:'blue',x:p.x+rnd(-30,30),y:p.y+rnd(-30,30),vx:Math.cos(b)*v,vy:Math.sin(b)*v,hp:1,t:rnd(0,.6),born:0,flip:1,aggr:i<red,cool:1.2})}}
function spawnFrogAt(x,y,type='frog'){const hp=type==='frog'&&G.stage==='field'&&G.wave<=2?2:SPEC[type].hp;G.ents.push({type,x,y,hp,maxHp:hp,st:'wait',t:.9,born:0,sx:x,sy:y,tx:x,ty:y,z:0,hit:0});return G.ents[G.ents.length-1]}
function spawnNutriaAt(x,y,type='nutria',red=false){const q=chewSpot();G.ents.push({type,x,y,hp:SPEC[type].hp,maxHp:SPEC[type].hp,st:'go',t:0,born:0,tx:q.x,ty:q.y,wig:rnd(0,6),cool:1.5,aggr:red});return G.ents[G.ents.length-1]}
const RUSH_BOSS={kblue:'대장 블루길',boss:'대장 황소개구리',nboss:'대장 뉴트리아'};
function rushSpawn(g){
const n=g.n||1,made=[];
if(g.kind==='blue')spawnFishAt(RUSH_A[g.side],n,g.red||0);
else if(g.kind==='vine')for(let k=0;k<n;k++){const v=spawnVine(g.spot?{x:W*g.spot[0],y:H*g.spot[1]}:rushSpot(g.side))||spawnVine(null); if(v){v.prK=VINE_HIDDEN.facePr;v.rushFace=true;burst(v.x,v.y,['#7cb94f','#cfeeb0','#fff'],12,220)}}
else if(g.kind==='kblue'){const p=pondEdge(RUSH_A[g.side],.9);G.ents.push({type:'kblue',x:p.x,y:p.y,vx:0,vy:0,hp:SPEC.kblue.hp,maxHp:SPEC.kblue.hp,t:0,born:0,flip:1,aggr:true,cool:1});made.push(G.ents[G.ents.length-1])}
else for(let k=0;k<n;k++){const s=g.spot?{x:W*g.spot[0],y:H*g.spot[1]}:rushSpot(g.side);for(let t=0;t<14&&inPond(s.x,s.y,1.05);t++)s.x+=s.x>W/2?24:-24;
const x=s.x+(k?rnd(-50,50):0),y=s.y+(k?rnd(-30,30):0);
made.push(g.kind==='frog'||g.kind==='boss'?spawnFrogAt(x,y,g.kind):spawnNutriaAt(x,y,g.kind,k<(g.red||0)))}
if(g.hp)made.forEach(e=>{e.hp=e.maxHp=g.hp});
if(RUSH_BOSS[g.kind]){float(W/2,H*.3,RUSH_BOSS[g.kind]+' 등장!','#fff3c9',true);beep(150,.35,'square',.09,90)}
}
function rushWarn(){
const el=$('#warn');if(el){el.hidden=false;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>{el.hidden=true;el.classList.remove('on')},2600)}
for(let k=0;k<4;k++)setTimeout(()=>{if(G&&G.mode==='play'){beep(880,.22,'square',.06,620);setTimeout(()=>beep(620,.22,'square',.06,880),230)}},k*460);
}
function finalRush(r){epMusic('rush',G.wave);G.rushQ=rushList(r).map(g=>Object.assign({at:r.at+(g.delay||0)},g))}
function stepRush(){
const w=WAVES[G.wave],r=w&&w.rush;if(!r||G.stage!=='field')return;
if(!G.rushWarned&&G.t>=r.at-RUSH_WARN){G.rushWarned=true;rushWarn()}
if(!G.rushDone&&G.t>=r.at){G.rushDone=true;finalRush(r)}
if(G.rushQ&&G.rushQ.length){let vine=false;G.rushQ=G.rushQ.filter(g=>{if(G.t>=g.at){rushSpawn(g);if(g.kind==='vine')vine=true;return false}return true});if(vine)linkHiddenVines()}
if(r.harass&&G.rushDone)harassTick(r.harass);
}
function clearSkillFx(){
if(!G)return;
G.nets=[];G.trails=[];G.shocks=[];G.bolts=[];G.boltT=0;G.flames=[];G.waves=[];G.jets=[];G.swirls=[];G.swoops=[];G.preds=[];G.surgeQ=[];
G.ents=G.ents.filter(e=>e.type!=='vine');G.plants=[];G.cells.clear();
G.bubbles=[];G.parts=[];G.floats=[];G.hz=[];G.guests=null;G.comp=null;G.fogT=0;G.stopT=0;G.fogCd=0;G.tickT=0;G.avT=0;G.hitStop=0;G.shake=0;G.flash=0;G.nextMult=1;
const p=G.player;if(p){p.queued=null;p.cd=0;p.stun=0;p.kx=p.ky=0;p.bubbleT=0;p.skillWin=0;p.spdT=p.dmgT=p.turtleT=p.rageT=0;p.gusaT=0}
G.fxGen=(G.fxGen||0)+1;
}
{const _bw=beginWave;beginWave=function(i){clearSkillFx();return _bw(i)}}
const VINE_HIDDEN={leafMax:18,leafPr:.012,facePr:.4};
function linkHiddenVines(){
const faces=G.ents.filter(e=>e.type==='vine'&&e.rushFace&&!e.dead&&e.plant);if(!faces.length)return;
for(const pl of G.plants){if(!pl.alive||!pl.hidden)continue;
for(const k of [...pl.keys]){const c=G.cells.get(k);if(!c)continue;let best=faces[0],bd=1e9;for(const f of faces){const d=hyp(f.x-c.x,f.y-c.y);if(d<bd){bd=d;best=f}}
pl.keys.delete(k);c.pl=best.plant;c.hid=true;best.plant.keys.add(k)}
pl.alive=false}
float(W/2,H*.38,'가시박 뿌리가 얼굴을 내밀었어요! 빨리 돌면서 잡아요!','#e9f7d6',true);
}
function harassTick(h){
if(!G.ents.some(e=>e.type==='vine'&&e.rushFace&&!e.dead))return;
if(G.t<(G.harNext||0)||(h.total&&(G.harN||0)>=h.total))return;G.harNext=G.t+h.every;
const alive=G.ents.filter(e=>e.type==='blue'&&e.aggr&&!e.dead).length,n=Math.min(h.n,h.max-alive);
if(n>0){spawnFishAt(rnd(0,TAU),n,n);G.harN=(G.harN||0)+n;beep(300,.12,'square',.05,520)}
}
