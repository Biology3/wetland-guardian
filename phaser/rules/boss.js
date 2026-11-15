/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const clampBX=(b,x)=>clamp(x,b.r*.7+24,W-b.r*.7-24),clampBY=(b,y)=>clamp(y,150+b.r*.35,H-b.r*.55);
function hz(o){o.t=0;o.fired=false;o.done=false;G.hz.push(o);return o}
const zCircle=(x,y,r,warn,life=.18,fire)=>hz({k:'c',x,y,r,warn,life,fire});
const zBeam=(x,y,a,len,w,warn,life=.3,fire)=>hz({k:'b',x,y,a,len,w,warn,life,fire});
const zRing=(x,y,speed,max,thick,warn=.7)=>hz({k:'r',x,y,speed,max,thick,warn,life:max/speed});
const zShot=(x,y,vx,vy,r)=>hz({k:'s',x,y,vx,vy,r,warn:0,life:7});
function walkTo(b,x,y,d,h=0){b.tw={sx:b.x,sy:b.y,tx:clampBX(b,x),ty:clampBY(b,y),t:0,d,h}}
function* openW(b,s){b.win=s;while(b.win>0)yield .05;b.win=0}
function* cycle(b,fs){let last=null;for(;;){const o=fs.filter(f=>f!==last);last=pick(o);yield* last(b);yield .55}}
function angTo(b){const p=G.player;return Math.atan2(p.y-b.y,p.x-b.x)}
function* pCharge(b){const n=b.phase>1?2:1;for(let i=0;i<n;i++){const a=angTo(b),tx=clampBX(b,b.x+Math.cos(a)*660),ty=clampBY(b,b.y+Math.sin(a)*660),len=hyp(tx-b.x,ty-b.y);if(Math.cos(a)<0)b.flip=-1;else b.flip=1;
zBeam(b.x,b.y,a,len+b.r*.45,104,1,.3);yield 1;walkTo(b,tx,ty,.3);beep(170,.25,'sawtooth',.07,90);yield .4}
yield* openW(b,1.6)}
function* pFan(b){b.puff=.65;yield .4;const n=b.phase>1?7:5,a=angTo(b);(G.warns||(G.warns=[])).push({b,a,n,sp:.3,t:0,life:.32});beep(880,.06,'square',.04,1100);yield .32;for(let i=0;i<n;i++){const t=a+(i-(n-1)/2)*.3;zShot(b.x+Math.cos(t)*b.r*.7,b.y+Math.sin(t)*b.r*.7,Math.cos(t)*265,Math.sin(t)*265,20)}beep(600,.15,'sine',.07,300);yield .35;yield* openW(b,b.phase>1?.45:.55)}
function* pSummon(b){const n=!summonTurn(b)?0:Math.min(SUMMON_N[b.phase>1?1:0],SUMMON_MAX.blue-G.ents.filter(e=>e.type==='blue'&&!e.dead).length);if(n>0){const p=pondEdge(rnd(0,TAU),.75);for(let i=0;i<n;i++)G.ents.push({type:'blue',x:p.x+rnd(-24,24),y:p.y+rnd(-24,24),vx:0,vy:0,hp:1,t:rnd(0,3),born:0,flip:1,aggr:true,cool:1.2})}yield .3}
function* pSlam(b){const n=b.phase>1?3:2;for(let i=0;i<n;i++){const p=G.player;zCircle(p.x,p.y,104,1.05,.18,()=>beep(120,.2,'square',.07,70));yield .7}yield .35;yield* openW(b,1.3)}
function* pBurrow(b){
const n=b.phase>1?4:3;b.under=true;b.air=true;b.burrowT=G.t;b.burrowN=(b.burrowN||0)+1;
for(let i=0;i<n;i++){const p=G.player,x=clampBX(b,p.x),y=clampBY(b,p.y);walkTo(b,x,y,.7);
zCircle(x,y,104,.9,.2,()=>{beep(100,.25,'square',.08,55);burst(x,y,['#a07850','#d9b98a','#fff'],16,260);if(!reduced)G.shake=Math.max(G.shake,.15)});yield 1}
b.under=false;b.air=false;burst(b.x,b.y,['#a07850','#d9b98a','#fff'],22,300);
if(b.phase>1){zRing(b.x,b.y,300,440,36,.25);yield .45}
yield* openW(b,1.3);
}
function* pRush(b){const n=b.phase>1?4:3;for(let i=0;i<n;i++){const a=angTo(b),tx=clampBX(b,b.x+Math.cos(a)*400),ty=clampBY(b,b.y+Math.sin(a)*400),len=hyp(tx-b.x,ty-b.y);zBeam(b.x,b.y,a,len+b.r*.4,108,.78,.26);yield .78;walkTo(b,tx,ty,.26);beep(170,.2,'sawtooth',.07,90);yield .3}yield* openW(b,1.5)}
function* pSpin(b){zCircle(b.x,b.y,235,1,.24,()=>beep(240,.3,'sawtooth',.07,120));b.puff=1;yield 1.2;if(b.phase>1){zRing(b.x,b.y,300,460,40,.25);yield .5}yield* openW(b,1.3)}
function* pStep(b){const p=G.player;walkTo(b,p.x+rnd(-120,120),p.y+rnd(-120,120),.7);yield .75}
function spawnRoots(b){const n=3,a0=rnd(0,TAU);b.roots=[];for(let i=0;i<n;i++){let x,y,t=0;do{const a=a0+i/n*TAU+t*.2,k=.82+.04*t;x=clamp(pond.cx+Math.cos(a)*pond.a*k,70,W-70);y=clamp(pond.cy+Math.sin(a)*pond.b*k,160,H-70)}while(inUI(x,y)&&++t<14);b.roots.push({x,y,alive:true,isRoot:true})}b.shield=true}
function cutRoot(r){const b=G.boss;if(!b||!r.alive)return;r.alive=false;burst(r.x,r.y,['#7cb94f','#cfeeb0','#fff'],14,220);G.score+=30;beep(740,.1,'triangle',.08,980);float(r.x,r.y-40,'뿌리 제거!','#fff');
if(b.roots.every(q=>!q.alive)){b.shield=false;b.stun=3.4;b.afterStun=()=>spawnRoots(b);float(b.x,b.y-b.r-30,'틈이 생겼어요! 지금 공격!','#fff3c9',true);beep(980,.2,'triangle',.09,1320)}}
function* pWhip(b){const n=b.phase>1?7:5,a=angTo(b);b.pose='whip';for(let i=0;i<n;i++){zBeam(b.x,b.y,a+i/n*TAU,680,88,.72,.28,()=>beep(300,.12,'square',.05,160));yield .2}yield .85;b.pose=null}
function* pNova(b){
for(let i=0;i<2;i++){b.puff=.8;zRing(b.x,b.y,300,640,40,.8);beep(240,.3,'sawtooth',.06,120);
if(i===0){yield 1.6;const p=G.player;for(let k=0;k<2;k++)zCircle(clamp(p.x+rnd(-160,160),40,W-40),clamp(p.y+rnd(-120,120),120,H-40),80,1.1);yield 2.4}else yield 1.05}
yield .4;
}
function* pBomb(b){const n=b.phase>1?9:7,p=G.player;zCircle(p.x,p.y,96,.76,.18,()=>beep(160,.2,'square',.07,80));for(let i=0;i<n;i++){zCircle(clamp(p.x+rnd(-240,240),40,W-40),clamp(p.y+rnd(-180,180),120,H-40),96,.76+i*.04)}yield 1.15}
function* pLeap(b){const n=b.phase>1?2:1;for(let i=0;i<n;i++){const p=G.player;zCircle(clampBX(b,p.x),clampBY(b,p.y),132,1.05,.2,()=>beep(110,.3,'square',.08,60));b.air=true;walkTo(b,p.x,p.y,1.05,260);yield 1.05;b.air=false;burst(b.x,b.y+b.r*.4,['#fff','#bfe28a'],16,280);if(!reduced)G.shake=.3;if(i<n-1)yield .35}
if(b.phase>1){zRing(b.x,b.y,320,520,40,.1);yield .2}yield* openW(b,1.8)}
const TONGUE_SPEED=2;
function* pTongue(b){const n=b.phase>1?2:1,k=TONGUE_SPEED;b.pose='tongue';for(let i=0;i<n;i++){const a=angTo(b);b.poseA=a;zBeam(b.x,b.y-30,a,780,64,1.05/k,.34/k,()=>beep(420,.2,'sawtooth',.06,180));yield 1.4/k}b.pose=null;yield* openW(b,1.4)}
function* pRoar(b){const n=b.phase>1?2:1;for(let i=0;i<n;i++){b.puff=.8;zRing(b.x,b.y,270,540,34,1);yield 1;beep(180,.35,'sawtooth',.08,90);yield i<n-1?2:1.1}yield* openW(b,1.1)}
function* pCalls(b){const n=!summonTurn(b)?0:Math.min(SUMMON_N[b.phase>1?1:0],SUMMON_MAX.frog-G.ents.filter(e=>e.type==='frog'&&!e.dead).length);{for(let i=0;i<n;i++){spawnFrog('frog');const e=G.ents[G.ents.length-1];e.hp=2}}yield .3}
const AI={
blue:b=>cycle(b,[pCharge,pFan,pFan,pFan,pFan,pSummon]),
nutria:b=>(function*(){yield* pRush(b);yield .55;yield* cycle(b,[function*(b){yield* pStep(b);yield* pSlam(b)},pRush,function*(b){yield* pStep(b);yield* pSpin(b)},pBurrow])})(),
vine:b=>cycle(b,[pWhip,pBomb,pNova]),
frog:b=>(function*(){yield* pLeap(b);yield .4;yield* pCalls(b);yield .55;yield* cycle(b,[pLeap,pTongue,pRoar,pCalls,pCalls])})(),
};
function beginBoss(i){
const B=BOSS[i],p=G.player;G.hurtW=0;G.stage='boss';G.bossIdx=i;G.mode='play';G.ents=[];G.nets=[];G.hz=[];G.swoops=[];G.floats=[];G.cells.clear();G.plants=[];G.dying=[];G.holes=[];G.cheer=0;G.shield=L('safe');G.nextMult=1;G.protT=8;G.heronT=6;G.bossTry++;G.t=0;
applyStats();p.hp=p.maxHp;p.x=W*.26;p.y=H*.56;p.inv=p.skillLeft=p.stun=p.bubbleT=0;p.skillN=p.skillMax;p.spdT=p.dmgT=p.turtleT=p.rageT=0;p.gusaT=0;p.gusaUsed=false;G.preds=[];G.avT=0;G.comp=null;G.fogT=0;G.stopT=0;G.fogCd=0;p.shell=L('shell')?1:0;p.shellT=0;G.trails=[];G.shocks=[];p.regen=0;p.queued=null;
const b={k:B.k,art:B.art,name:B.name,x:B.k==='vine'?pond.cx:W*.68,y:pond.cy,r:B.r,hp:B.hp,max:B.hp,phase:1,win:0,stun:0,wait:B.k==='frog'?.6:B.k==='nutria'?.5:1.5,roots:[],flip:-1,z:0,flash:0,puff:0};
G.boss=b;G.warns=[];b.ai=AI[B.k](b);if(B.k==='vine')spawnRoots(b);
showOnly(null);hudMode(true);audioOn();setMusic('boss',[0,-2,3,5][i]);float(W/2,H*.3,B.name+' 등장!','#fff3c9',true);beep(150,.4,'square',.09,90);updateHud(true);
}
function hitBoss(d,force){
const b=G.boss;if(!b||b.deadT>0)return;
if(b.shield){if(G.clock-G.msgT>1.2){G.msgT=G.clock;float(b.x,b.y-b.r-30,'단단해요! 뿌리를 잘라요','#fff3c9',true)}beep(210,.06,'square',.04);return}
const open=force||b.win>0||b.stun>0,v=(open?d:d*.28);b.hp-=v;b.flash=.12;G.score+=Math.round(v*10);
if(open){float(b.x+rnd(-50,50),b.y-b.r*.5,'-'+(Math.round(v*10)/10),'#ffe08a',v>=1.5);beep(150,.1,'sine',.1,70);beep(620,.07,'triangle',.08,840);burst(b.x+rnd(-40,40),b.y+rnd(-40,40),['#fff','#ffd95b','#ff8fa8'],10,260);punch(v>=1.5?.08:.05,v>=1.5?.18:.1)}else{beep(95,.07,'square',.05,70);burst(b.x+rnd(-40,40),b.y+rnd(-40,40),['#cfd6c4'],3,120)}
if(b.phase===1&&b.hp<=b.max*.5){b.phase=2;b.p2=G.t;float(b.x,b.y-b.r-30,'화가 났어요! 더 빨라져요','#ffd1d8',true);beep(130,.4,'sawtooth',.09,70);if(!reduced)G.shake=.3}
if(b.hp<=0)bossWin();
}
function bossWin(){
const b=G.boss,i=G.bossIdx,g=G;if(G.mode!=='play')return;G.mode='win';b.deadT=1.15;G.score+=300;clearBonus();G.hz=[];G.nets=[];G.swoops=[];G.preds=[];G.ents=G.ents.filter(e=>e.prot);if(!reduced)G.shake=.4;burst(b.x,b.y,['#fff','#ffd95b','#ff8fa8','#9fe3da'],40,420);beep(880,.35,'triangle',.09,1320);setMusic(null);
setTimeout(()=>{if(G!==g)return;G.boss=null;G.ents=[];$('#hud').hidden=true;$('#skillStrip').hidden=true;$('#edge').style.boxShadow='none';setMusic('calm');
const bp=BOSS_PTS[i];if(typeof afterBoss==='function'){afterBoss(i,bp);return}
if(i>=BOSS.length-1){finalResult();return}
award(bp);openTree({title:b.name+' 격파! 스킬 포인트 +'+bp,next:{boss:i+1},respec:true,start:()=>beginBoss(i+1)})},1200);
}
function bossFail(){
if(G.mode!=='play')return;const i=G.bossIdx,B=BOSS[i];G.mode='over';G.bossFails[i]++;G.hz=[];G.nets=[];G.boss=null;
$('#hud').hidden=true;$('#skillStrip').hidden=true;$('#edge').style.boxShadow='none';setMusic('calm');
showResult({title:B.name+'에게 졌어요',line:'스킬을 다시 찍고 공략법을 바꿔 보세요.',lesson:B.tip,retryLabel:'스킬 고르고 다시 도전',
retry:()=>retryBoss(i)});
}
function retryBoss(i){retryScore();openTree({title:BOSS[i].name+' 다시 도전',next:{boss:i,known:true},respec:true,start:()=>beginBoss(i)})}
function stepBoss(dt){
const b=G.boss,p=G.player;if(!b)return;G.clock+=dt;G.t+=dt;const de=dt*fogK();
movePlayer(dt);stepSkill(dt);stepComp(dt);stepGuest(dt);updateNets(dt);if(G.mode!=='play'||!G.boss)return;
for(const n of G.natives){n.t-=dt;if(n.t<0){n.t=rnd(1,3);n.a+=rnd(-1.2,1.2)}n.x+=Math.cos(n.a)*46*dt;n.y+=Math.sin(n.a)*46*dt;if(!inPond(n.x,n.y,.88)){n.a=Math.atan2(pond.cy-n.y,pond.cx-n.x)}}
for(const e of G.ents){if(e.dead)continue;e.born+=de;e.hit=Math.max(0,(e.hit||0)-de);applyKb(e,dt);if(e.frz>0&&!SPEC[e.type].prot){e.frz-=dt;continue}
if(e.type==='blue'){updateFish(e,de);if(e.born>7){e.gone=true;burst(e.x,e.y,['#fff','#83a8f2'],5,120)}}else if(e.type==='frog')updateFrog(e,de);else if(SPEC[e.type].prot)updateProt(e,de);
if(G.mode!=='play')return}
G.ents=G.ents.filter(e=>!e.dead&&!e.gone);
keepEntsOut();stepHeron(dt);stepPreds(dt);if(G.mode!=='play'||!G.boss)return;
if(L('heal')&&p.hp<p.maxHp){p.regen+=dt;if(p.regen>=HEAL_T[L('heal')]){p.regen=0;p.hp++;float(p.x,p.y-60,'하트 +1','#ffe3e8',true)}}
for(const h of G.hz){h.t+=de;
if(h.k==='s'){h.x+=h.vx*de;h.y+=h.vy*de;if(!h.done&&hyp(h.x-p.x,h.y-p.y)<h.r+22){h.done=true;hzHurt(h)}if(h.x<-40||h.x>W+40||h.y<-40||h.y>H+40)h.t=99}
else if(h.t>=h.warn){if(!h.fired){h.fired=true;if(h.fire)h.fire()}
if(!h.done&&h.t<h.warn+h.life){let hit=false;
if(h.k==='c')hit=hyp(p.x-h.x,p.y-h.y)<h.r+14;
else if(h.k==='b'){const dx=p.x-h.x,dy=p.y-h.y,al=dx*Math.cos(h.a)+dy*Math.sin(h.a),pe=-dx*Math.sin(h.a)+dy*Math.cos(h.a);hit=al>-20&&al<h.len&&Math.abs(pe)<h.w/2+14}
else if(h.k==='r'){const r=(h.t-h.warn)*h.speed;hit=Math.abs(hyp(p.x-h.x,p.y-h.y)-r)<h.thick/2+14}
if(hit){h.done=true;hzHurt(h);if(G.mode!=='play')return}}}
}
G.hz=G.hz.filter(h=>h.t<h.warn+h.life+.22);
bossTouch(b);if(G.mode!=='play'||!G.boss)return;
b.flash=Math.max(0,b.flash-de);b.puff=Math.max(0,b.puff-de);
if(b.tw){const w=b.tw;w.t+=de;const k=clamp(w.t/w.d,0,1);b.x=w.sx+(w.tx-w.sx)*k;b.y=w.sy+(w.ty-w.sy)*k;b.z=Math.sin(k*Math.PI)*w.h;if(k>=1)b.tw=null}
if(!b.air&&!b.deadT)keepOutUI(b,b.r*.5);
if(b.stun>0){b.stun-=de;if(b.stun<=0&&b.afterStun){const f=b.afterStun;b.afterStun=null;f()}return}
if(b.win>0)b.win=Math.max(0,b.win-de);
b.wait-=de;let guard=0;while(b.wait<=0&&guard++<8){const r=b.ai.next();b.wait+=r.done?.3:r.value}
}
