/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
function movePlayer(dt){
joyHold();const p=G.player;
p.cd=Math.max(0,p.cd-dt);p.inv=Math.max(0,p.inv-dt);p.skillWin=Math.max(0,p.skillWin-dt);
if(p.skillN<p.skillMax&&!(L('fog')&&G.fogT>0)){p.skillLeft-=dt; if(p.skillLeft<=0){p.skillN++;p.skillLeft=p.skillN<p.skillMax?p.skillCd:0}}
if(L('regrow')&&p.shell<p.shellMax&&!NOHEAL()){ p.shellT+=dt;if(p.shellT>=shellRe()){p.shell++;p.shellT=0;float(p.x,p.y-60,'보호막 준비','#bfe3fb')}}
if(p.queued&&p.cd<=0){const q=p.queued;p.queued=null;throwNet(q.x,q.y)}
let mx=joy.dx,my=joy.dy;
if(keys.KeyA||keys.ArrowLeft)mx-=1;if(keys.KeyD||keys.ArrowRight)mx+=1;if(keys.KeyW||keys.ArrowUp)my-=1;if(keys.KeyS||keys.ArrowDown)my+=1;
const mm=hyp(mx,my);if(mm>1){mx/=mm;my/=mm}
const onVine=G.cells.has(gridKey(Math.round(p.x/CELL),Math.round(p.y/CELL)));
p.lagT=Math.max(0,(p.lagT||0)-dt);p.moving=mm>.05&&!(p.stun>0)&&!(p.lagT>0);
if(p.stun>0){p.stun-=dt;p.x+=(p.kx||0)*dt;p.y+=(p.ky||0)*dt;p.kx*=.88;p.ky*=.88}
else if(mm>.05&&!(p.lagT>0)){const v=p.speed*(onVine?.58:1)*(G.zap&&G.zap.t<SK.zap.spdDur[G.zap.lv]?1+SK.zap.spd[G.zap.lv]:1) *(p.spdT>0?1.15:1);p.x+=mx*v*dt;p.y+=my*v*dt;p.walk+=dt*12;if(Math.abs(mx)>.1)p.flip=mx<0?-1:1;p.faceA=Math.atan2(my,mx)}
if(keys.KeyJ&&p.cd<=0&&!(p.stun>0))kbThrow(p);
p.x=clamp(p.x,40,W-40);p.y=clamp(p.y,112,H-44);
}
function updateNets(dt){
for(const n of G.nets){n.t+=dt;if(n.t>=n.dur&&!n.land){n.land=.0001;resolveNet(n);if(G.mode!=='play')return}else if(n.land)n.land+=dt}
G.nets=G.nets.filter(n=>n.land<.3+(n.linger||0));
}
function stepHeron(dt){
const c=SK.kheron;
if(L('kheron')){G.heronT-=dt;if(G.heronT<=0){let t=null;
if(G.stage==='boss'&&G.boss){const b=G.boss,r=b.roots.find(r=>r.alive);t=r||((!b.air&&!b.shield&&!b.deadT)?b:null)}
if(!t){let hp=-1,best=1e9;for(const e of G.ents){if(e.prot||e.dead||e.born<.25)continue;const d=near(e,G.player);if(e.hp>hp||(e.hp===hp&&d<best)){hp=e.hp;best=d;t=e}}}
if(t){G.heronT=c.every;G.swoops.push({x:t.x,y:t.y,t:0,target:t,flip:Math.random()<.5,proxy:1});beep(660,.07,'square',.04);setTimeout(()=>beep(660,.07,'square',.04),110)}else G.heronT=.4}}
for(const q of G.swoops){q.t+=dt;if(q.t>=.42&&!q.done){q.done=true;const t=q.target;
if(t.isRoot){if(t.alive)cutRoot(t)}
else if(t===G.boss)hitBoss(c.dmg);
else if(!t.dead){t.hp-=c.dmg*WK();t.hit=.3;if(t.hp<=0)kill(t)}
burst(q.x,q.y,['#fff','#c9d6e6','#ffd95b'],12,220);sparks(q.x,q.y,10,'#ffe2a0');punch(.04,.1);beep(880,.08,'triangle',.06)}}
G.swoops=G.swoops.filter(q=>q.t<.7);
}
function step(dt){
if(G&&G.training&&G.mode==='play'){stepTraining(dt);return}
if(typeof radioTick==='function')radioTick();
if(G&&G.mode==='clear'){G.clearT-=dt;if(G.clearT<=0)finishWave();return}
if(!G||G.mode!=='play')return;
if(G.stage==='boss'){stepBoss(dt);return}
const tw=G.worldOn&&G.fogT>0?(G.twK??WORLD_TW):1;
G.t+=dt*tw;G.clock+=dt;const w=WAVES[G.wave];const g0=G.gauge;
const spawning=G.t<WAVE_LEN;
if(spawning)for(const k in w.sp){if(w.rush&&w.rush.calm&&k===w.rush.kind&&G.t>=w.rush.at-w.rush.calm)continue;if(k==='vine'&&w.vineHidden&&G.t>=w.rush.at-1)continue;
G.timers[k]-=dt*tw;if(G.timers[k]<=0){G.timers[k]=w.sp[k][1];({blue:spawnFish,nutria:spawnNutria,frog:spawnFrog,vine:()=>spawnVine(null,!!w.vineHidden)})[k]()}}
if(spawning&&w.boss&&!G.bossDone&&G.t>=w.boss){G.bossDone=true;epMusic('rush',G.wave);spawnFrog('boss');float(W/2,H*.3,'대장 황소개구리 등장!','#fff3c9',true);beep(150,.35,'square',.09,90)}
if(spawning&&w.kblue&&!G.bossDone&&G.t>=w.kblue){G.bossDone=true;epMusic('rush',G.wave);spawnKBlue();float(W/2,H*.3,'대장 블루길 등장!','#fff3c9',true);beep(150,.35,'square',.09,90)}
stepRush();
if(spawning&&w.nboss&&!G.bossDone&&G.t>=w.nboss){G.bossDone=true;epMusic('rush',G.wave);spawnNutria('nboss');float(W/2,H*.3,'대장 뉴트리아 등장!','#fff3c9',true);beep(150,.35,'square',.09,90)}
movePlayer(dt);stepSkill(dt);stepComp(dt);stepGuest(dt);
for(const n of G.natives){n.t-=dt;if(n.t<0){n.t=rnd(1,3);n.a+=rnd(-1.2,1.2)}n.x+=Math.cos(n.a)*46*dt;n.y+=Math.sin(n.a)*46*dt;if(!inPond(n.x,n.y,.88)){n.a=Math.atan2(pond.cy-n.y,pond.cx-n.x);n.x+=Math.cos(n.a)*4;n.y+=Math.sin(n.a)*4}}
let pressure=0;for(const c of G.cells.values())pressure+=c.hid||(c.pl&&c.pl.hidden)?VINE_HIDDEN.leafPr:.03;
const fk=fogK();
for(const e of G.ents){if(e.dead)continue;const s=SPEC[e.type];e.born+=dt;e.hit=Math.max(0,(e.hit||0)-dt);
if(!s.prot)pressure+=s.pr*(e.prK??1);
const de=dt*fk;applyKb(e,dt);if(e.frz>0){e.frz-=dt;continue}
if(e.type==='blue'||e.type==='kblue')updateFish(e,de);
else if(e.type==='nutria'||e.type==='nboss')updateNutria(e,de);
else if(e.type==='frog'||e.type==='boss')updateFrog(e,de);
else if(s.prot)updateProt(e,de);
}
for(const pl of G.plants){if(!pl.alive)continue;pl.t-=dt*tw;if(pl.t<=0){pl.t=.5;growVine(pl)}}
for(const c of G.cells.values())c.g=Math.min(1,c.g+dt*4);
G.dying=G.dying.filter(d=>(d.t+=dt)<.28);
touchCheck();if(G.mode!=='play')return;
keepEntsOut();updateNets(dt);stepHeron(dt);stepPreds(dt);
G.ents=G.ents.filter(e=>!e.dead&&!e.gone);
G.plants=G.plants.filter(pl=>pl.alive);
const shade=G.plants.some(pl=>pl.alive)?.75:1;
G.gauge=clamp(G.gauge+(G.recov*(w.rec||1)*shade-pressure)*dt*tw,0,100);
G.sum+=G.gauge*dt;G.sumT+=dt;
G.comboT-=dt;if(G.comboT<=0)G.combo=0;
if(G.natives.length<12&&G.gauge>50&&Math.random()<dt*.7)addNative();
if(G.help){const loss=g0-G.gauge-(G.helpDone||0);if(loss>0)G.gauge+=loss*(1-HELP.gaugeLoss)}G.helpDone=0;
if(G.gauge<=0&&!lastStand()){endGame(false);return}
if(G.t>=WAVE_LEN){if(!G.mopMsg){G.mopMsg=1;float(W/2,H*.3,'남은 교란 생물을 모두 잡아요!','#fff3c9',true);beep(520,.2,'triangle',.08,780)}if(!G.ents.some(e=>!e.prot&&!e.dead))endWave()}
}
function updateFish(e,dt){
if(e.aggr&&fishCharge(e,dt))return;
let t=null,best=1e9;
if(G.stage==='boss'){t=G.player;best=near(e,t)}else for(const n of G.natives){const d=near(e,n);if(d<best){best=d;t=n}}
e.t-=dt;let tx,ty;
if(e.aggr&&!(e.cool>0)){t=null;tx=G.player.x;ty=G.player.y}
else if(t&&best<420){tx=t.x;ty=t.y}else{if(e.t<=0||e.wx===undefined){e.t=rnd(1.2,2.4);const q=pondEdge(rnd(0,TAU),rnd(.2,.85));e.wx=q.x;e.wy=q.y}tx=e.wx;ty=e.wy}
for(const o of G.ents){if(o===e||o.type!=='blue'||o.dead)continue;const ox=e.x-o.x,oy=e.y-o.y,od=hyp(ox,oy);if(od>0&&od<52){const f=(52-od)/52*160*dt;e.x+=ox/od*f;e.y+=oy/od*f}}
const dx=tx-e.x,dy=ty-e.y,d=hyp(dx,dy)||1,sp=e.aggr&&!(e.cool>0)?AGGR_SP:G.stage==='boss'?78:104;
e.vx+=(dx/d*sp-e.vx)*Math.min(1,dt*3);e.vy+=(dy/d*sp-e.vy)*Math.min(1,dt*3);
e.x+=e.vx*dt;e.y+=e.vy*dt;if(Math.abs(e.vx)>4)e.flip=e.vx<0?-1:1;
if(!inPond(e.x,e.y,.97)){const a=Math.atan2(pond.cy-e.y,pond.cx-e.x);e.x+=Math.cos(a)*5;e.y+=Math.sin(a)*5}
if(G.stage==='boss'){if(best<SPEC.blue.r+8)hurtPlayer(e);return}
if(t&&best<30){G.natives.splice(G.natives.indexOf(t),1);G.gauge=Math.max(0,G.gauge-1.5);burst(t.x,t.y,['#bdeee3','#fff'],6,120);if(G.clock-(G.eatMsg||-9)>5){G.eatMsg=G.clock;float(t.x,t.y-14,'토착 물고기가 먹혔어요','#ffe3e8')}}
}
function updateNutria(e,dt){
const p=G.player;e.t-=dt;e.wig+=dt*9;e.cool=Math.max(0,e.cool-dt);
if(e.st==='crouch'){if(e.t<=0){e.st='lunge';e.t=e.type==='nutria'?.26*NUTRIA_REACH*NUTRIA_DASH:e.type==='nboss'?.26*NUTRIA_REACH*NUTRIA_DASH*NBOSS_REACH:.26}return}
if(e.st==='lunge'){e.x=clamp(e.x+Math.cos(e.la)*960*dt,40,W-40);e.y=clamp(e.y+Math.sin(e.la)*960*dt,112,H-44);if(near(e,p)<SPEC[e.type].r+18)hurtPlayer(e);if(e.t<=0){e.st='go';e.cool=rnd(2.2,3.2)}return}
if(e.cool<=0&&e.born>.5&&near(e,p)<(e.type==='nutria'?300*NUTRIA_REACH:e.type==='nboss'?300*NUTRIA_REACH*NBOSS_REACH:300)){ e.st='crouch';e.t=e.type==='nboss'?.75:.55;e.la=Math.atan2(p.y-e.y,p.x-e.x);return}
if(e.st==='go'&&e.aggr){e.tx=p.x;e.ty=p.y}
if(e.st==='go'){const dx=e.tx-e.x,dy=e.ty-e.y,d=hyp(dx,dy);if(d>10){const v=e.aggr?AGGR_NUT_SP:e.type==='nboss'?105:130;e.x+=dx/d*v*dt;e.y+=dy/d*v*dt}else if(!e.aggr){e.st='chew';e.t=rnd(3,4)}}
else if(e.st==='chew'){
const sp=0; G.gauge=Math.max(0,G.gauge-.85*(e.type==='nboss'?NBOSS_CHEW:1)*dt*(sp?.5:1));
if(Math.random()<dt*7)burst(e.x+rnd(-14,14),e.y+20,['#7cb94f','#cfeeb0'],1,70);
if(G.clock-(G.chewMsg||-9)>6){G.chewMsg=G.clock;float(e.x,e.y-50,sp?'새싹 지킴이가 막아요!':'습지 식물을 갉아먹어요!',sp?'#e9f7d6':'#ffe3e8')}
if(e.t<=0){const q=chewSpot();e.tx=q.x;e.ty=q.y;e.st='go'}
}
}
function updateFrog(e,dt){
const s=SPEC[e.type],p=G.player;e.t-=dt;
if(e.st==='wait'){e.z=0;if(e.t<=0){e.st='air';const dx=p.x-e.x,dy=p.y-e.y,d=hyp(dx,dy)||1,hop=Math.min(d,e.type==='boss'?300:250);e.sx=e.x;e.sy=e.y;e.tx=clamp(e.x+dx/d*hop+rnd(-30,30),50,W-50);e.ty=clamp(e.y+dy/d*hop+rnd(-30,30),122,H-44);e.dur=e.type==='boss'?.8:.62;e.t=e.dur}}
else{const k=1-Math.max(0,e.t)/e.dur;e.x=e.sx+(e.tx-e.sx)*k;e.y=e.sy+(e.ty-e.sy)*k;e.z=Math.sin(k*Math.PI)*(e.type==='boss'?120:90);
if(e.t<=0){e.z=0;e.st='wait';e.t=e.type==='boss'?.75:rnd(.75,1.15);burst(e.x,e.y+s.r*.4,['#fff','#bfe28a'],5,120);
if(near(e,p)<s.r+24)hurtPlayer(e);
for(let i=G.natives.length-1;i>=0;i--){if(near(e,G.natives[i])<s.r){G.natives.splice(i,1);G.gauge=Math.max(0,G.gauge-1.5)}}}}
}
function updateProt(e,dt){
e.t+=dt;
const v=e.startled?Math.sign(e.vx||1)*Math.max(Math.abs(e.vx)*3,430):e.vx;e.x+=v*dt;
if(e.type==='gfrog')e.z=Math.abs(Math.sin(e.t*5.5))*28;
if(e.x<-110||e.x>W+110){e.gone=true;if(!e.startled){G.safe++;
if(G.stage==='boss'){const cl=L('cheer'),need=cl>=2?2:3;if(cl)G.cheer++;float(clamp(e.x,90,W-90),e.y-46,cl?'무사 통과! 응원 '+G.cheer+'/'+need:'무사 통과!','#fff3c9');if(cl)G.nextMult=cl>=2?2:1.5;if(cl&&G.cheer>=need){G.cheer=0;const p=G.player;if(p.hp<p.maxHp&&!NOHEAL()){p.hp++;float(p.x,p.y-60,'보호종의 응원! 하트 +1','#fff3c9',true)}}}
else{const up=1+L('cheer');G.gauge=Math.min(100,G.gauge+up);if(L('cheer'))G.nextMult=L('cheer')>=2?2:1.5;float(clamp(e.x,90,W-90),e.y-46,SPEC[e.type].name+' 무사 통과 +'+up,'#fff3c9')}
beep(780,.1,'sine',.06,1040)}}
}
function growVine(pl){
if(pl.keys.size>=(pl.hidden?VINE_HIDDEN.leafMax:34))return;
const arr=[...pl.keys];for(let n=0;n<8;n++){const c=G.cells.get(pick(arr));if(!c)continue;const[di,dj]=pick([[1,0],[-1,0],[0,1],[0,-1]]);const i=c.i+di,j=c.j+dj;if(isLand(i*CELL,j*CELL)&&addCell(pl,i,j))return}
}
const CLEAR_T=1.7;
function endWave(){
for(const e of G.ents)if(!e.prot&&e.type!=='vine')burst(e.x,e.y,['#fff','#bfe28a'],4,120);
G.ents=G.ents.filter(e=>e.type==='vine');G.nets=[];G.floats=[];G.swoops=[];G.preds=[];
const last=G.wave>=WAVES.length-1;G.clearPts=last?3:G.wave===0?FIRST_WAVE_PTS:G.wave<=1?1:2;
clearBonus();G.mode='clear';G.clearT=CLEAR_T;$('#edge').style.boxShadow='none';epMusic('after',G.wave);
for(let i=0;i<6;i++)setTimeout(()=>{if(G&&G.mode==='clear')burst(rnd(W*.2,W*.8),rnd(H*.25,H*.7),['#ffd95b','#ff8fa8','#9fe3da','#fff','#83a8f2'],16,320)},i*160);
beep(660,.12,'triangle',.08);setTimeout(()=>beep(880,.14,'triangle',.08),120);setTimeout(()=>beep(1320,.22,'triangle',.08),260);
}
function finishWave(){clearSkillFx();
if(G.mode!=='clear')return;G.mode='break';$('#hud').hidden=true;$('#skillStrip').hidden=true;const pt=G.clearPts;
if(G.wave>=WAVES.length-1){award(pt);const n=G.wave+1;storyThen('day'+n+'_post',()=>showStamp(n,pt,()=>storyThen('part1_end',()=>{if(typeof saveProgress==='function')saveProgress('boss',0); storyThen('part2_start',()=>openTree({title:'인왕산 등반 준비 · 스킬 포인트 +'+pt,next:{boss:0},respec:true,start:()=>startBossStory(0)}))})));return}
const healAmt=BONUS.waveHeal[G.wave]||0;
let heal='';if(healAmt){const h=Math.round(Math.min(100,G.gauge+healAmt)-G.gauge);G.gauge+=h;if(h>0)heal=' · 습지 회복! 평형 +'+h}
award(pt);const i=G.wave+1;storyThen('day'+i+'_post',()=>afterWave(i,pt,heal));
}
function stateOf(g){return g>=60?['안정','#5fc77f']:g>=30?['불안정','#ffb545']:['위험','#ff6f7d']}
let hudCache={};
function updateHud(force){
if(!G)return;
if(G.training&&G.boss){const b=G.boss,put=(id,v)=>{if(force||hudCache[id]!==v){hudCache[id]=v;$(id).textContent=v}};put('#wave','전투 트레이닝');put('#time','누적 '+(Math.round(G.trainDmg*10)/10));put('#score','초당 '+trainDps().toFixed(1));put('#bossName',b.name);$('#bossFill').style.transform='scaleX('+clamp(b.hp/b.max,0,1)+')';$('#bossFill').style.background='#ffc93c';$('#edge').style.boxShadow='none';return}
if(G.stage==='boss'){
const b=G.boss,p=G.player;if(!b)return;
const put=(id,v)=>{if(force||hudCache[id]!==v){hudCache[id]=v;$(id).textContent=v}};
put('#wave','보스 '+(G.bossIdx+1)+'/4'+(G.help?' · 📻도움':''));put('#time','♥'.repeat(Math.max(0,p.hp))+'♡'.repeat(Math.max(0,p.maxHp-p.hp)));put('#score',G.score+'점');put('#bossName',b.name);
$('#bossFill').style.transform='scaleX('+clamp(b.hp/b.max,0,1)+')';$('#bossFill').style.background=(b.win>0||b.stun>0)?'#ffc93c':b.shield?'#7cb94f':'#ff6f7d';
$('#edge').style.boxShadow=G.flash>0?'inset 0 0 0 14px rgba(255,111,125,.75)':'none';
return}
const set=(id,v)=>{if(force||hudCache[id]!==v){hudCache[id]=v;$(id).textContent=v}};
set('#wave',(G.wave+1)+'차 조사'+(G.help?' · 📻도움':''));set('#time',G.t>=WAVE_LEN?'남은 '+G.ents.filter(e=>!e.prot&&!e.dead).length+'마리':Math.max(0,Math.ceil(WAVE_LEN-G.t))+'초');set('#score',G.score+'점');
$('#fill').style.transform='scaleX('+(G.gauge/100)+')';
const[st,c]=stateOf(G.gauge);if(force||hudCache.st!==st){hudCache.st=st;$('#state').textContent=st;$('#fill').style.background=c}
$('#edge').style.boxShadow=G.flash>0?'inset 0 0 0 14px rgba(255,111,125,.75)':G.gauge<30?'inset 0 0 0 6px rgba(255,111,125,.5)':'none';
}
