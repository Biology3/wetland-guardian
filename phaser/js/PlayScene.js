/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const HERO_FOOT=425/440;
const HERO_DIR=[[6,1],[7,1],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]];
const ART_U=2.4;
const SPRITES=[['blue','blue',.46,'white',4],['blueB','blue',.8,'white',4],['nutria','nutria',.56,'white',4],['nutriaB','nutria',.9,'white',4],['frog','frog',.66*1.65,'white',4],['vine','vine',.56,'white',4],
['leafcell','leafcell',.5,null,1],['minnow','minnow',.3,null,4],
['otter','otter',.62,'gold',4],['turtle','turtle',.58,'gold',4],['leopardG','leopard',.62,'gold',1],
['bblue','bblue',BOSS_SZ,'white',1],['bfrog','bfrog',BOSS_SZ,'white',1],['bnutria','bnutria',BOSS_SZ,'white',1],['bvine','bvine',BOSS_SZ,'white',1],
['heron','heron',.6,'white',1],['kheron','kheron',.6,'white',1],['egret','egret',.6,'white',1],['snakehead','snakehead',.5,'white',1],['leopard','leopard',.55,'white',1]];
const SPR={};
function bakeSprites(scene){
if(SPR.blue)return;
for(const [key,art,sz,kind,n] of SPRITES){
const px=Math.ceil(220*sz*ART_U),fr=[],red=[];
for(let i=0;i<n;i++){AP=i/n*TAU;const c=bakeCanvas(art,px,kind),k='spr_'+key+i;scene.textures.addCanvas(k,c);fr.push(k);
if(key==='blue'||key==='blueB'||key==='nutria'){const r=mk(c.width,c.height),x=r.getContext('2d');x.drawImage(c,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(255,70,80,.42)';x.fillRect(0,0,r.width,r.height);scene.textures.addCanvas(k+'r',r);red.push(k+'r')}}
AP=0;SPR[key]={fr,red,w:220*sz,px};
}
}
const DALI_PAD=24,DALI_CELL=240+DALI_PAD*2,DALI_SC=.34,DALI_FOOT=(234+DALI_PAD)/DALI_CELL;
const FSHEET={otter:{tex:'dali',img:()=>typeof OTTER_IMG_EL!=='undefined'&&OTTER_IMG_EL,sc:DALI_SC},
turtle:{tex:'fs_turtle',img:()=>typeof TURTLE_IMG_EL!=='undefined'&&TURTLE_IMG_EL,sc:.32},
cat:{tex:'fs_cat',img:()=>typeof CAT_IMG_EL!=='undefined'&&CAT_IMG_EL,sc:.36},
nutria:{tex:'es_nutria',img:()=>typeof NUTRIA_IMG_EL!=='undefined'&&NUTRIA_IMG_EL,sc:.42,enemy:true,red:true},
frog:{tex:'es_frog',img:()=>typeof FROG_IMG_EL!=='undefined'&&FROG_IMG_EL,sc:.52,enemy:true},
blue:{tex:'es_blue',img:()=>typeof BLUE_IMG_EL!=='undefined'&&BLUE_IMG_EL,sc:.33,enemy:true,red:true,rows:4},
vine:{tex:'es_vine',img:()=>typeof VINE_IMG_EL!=='undefined'&&VINE_IMG_EL,sc:.4,enemy:true,bare:[1],rows:2},
heron:{tex:'es_heron',img:()=>typeof HERON_IMG_EL!=='undefined'&&HERON_IMG_EL,sc:.56,enemy:true,rows:1},
bblue:{tex:'bs_blue',img:()=>window.BBLUE_IMG_EL,sc:1,cw:320,enemy:true,step:1},
bfrog:{tex:'bs_frog',img:()=>window.BFROG_IMG_EL,sc:1,cw:320,enemy:true,step:1},
bnutria:{tex:'bs_nutria',img:()=>window.BNUTRIA_IMG_EL,sc:1,cw:320,enemy:true,step:1},
bvine:{tex:'bs_vine',img:()=>window.BVINE_IMG_EL,sc:1,cw:320,enemy:true,rows:1,step:1}};
for(const F of Object.values(FSHEET)){const cw=F.cw||240;F.cell=cw+DALI_PAD*2;F.foot=(cw-cw/40+DALI_PAD)/F.cell}
function loadBossSheets(){
const list=[['bblue','BBLUE'],['bfrog','BFROG'],['bnutria','BNUTRIA'],['bvine','BVINE']];let i=0;
const next=()=>{if(i>=list.length)return;const [f,v]=list[i++],s=document.createElement('script');s.src='js/'+f+'-sheet.js';
s.onload=()=>{let src=null;try{src=(0,eval)(v+'_SRC')}catch(e){}if(src){const im=new Image();im.src=src;window[v+'_IMG_EL']=im}setTimeout(next,300)};
s.onerror=()=>setTimeout(next,300);document.head.appendChild(s)};
next();
}
const HERON_HEAD=[[66,4],[50,-58],[80,28],[60,80],[46,-82]],HERON_TIP=[80,112];
const LEAF_SC=.3;
const BOSS_VIEW={blue:{sc:1,mid:true},frog:{sc:.95,foot:.62},nutria:{sc:.95,foot:.62},vine:{sc:1.1,foot:.7}};
const BUBBLE_FR={nutria:[0,.55],frog:[0,.55],blue:[2,.5],vine:[4,.6]};
const bakeDali=scene=>bakeFriend(scene,'otter');
const sheetReady=(T,who)=>{const F=FSHEET[who];return !!F&&T.exists(F.tex)};
const sheetImgOk=who=>{const IMG=FSHEET[who].img();return !!(IMG&&IMG.complete&&IMG.naturalWidth)};
function bakeFriend(scene,who){
const F=FSHEET[who];if(!F)return false;
if(scene.textures.exists(F.tex))return true;
if(!sheetImgOk(who))return false;
while(!bakeFriendRow(scene.textures,who));
return true;
}
function bakeFriendRow(T,who){
const F=FSHEET[who];if(T.exists(F.tex))return true;
const IMG=F.img(),R=F.rows||5,cw=F.cw||240;
const N=F.cell,J=F._job||(F._job={all:mk(N*8,N*R),i:0}),all=J.all,ax=all.getContext('2d');
const k=1/F.sc,ink=(F.enemy?2.6:2.4)*k,g1=3.9*k,g2=5.4*k,g3=7.2*k;
for(let s=0;s<(F.step||8)&&J.i<R*8;s++){const r=Math.floor(J.i/8),c=J.i%8;J.i++;{
const cv=mk(N,N),x=cv.getContext('2d');x.drawImage(IMG,c*cw,r*cw,cw,cw,DALI_PAD,DALI_PAD,cw,cw);paint(cv);
const o=mk(N,N),ox=o.getContext('2d');
if(!F.enemy){const gs=sil(cv,'#ffc94a');ox.globalAlpha=.22;ox.drawImage(ring(gs,g3),0,0);ox.globalAlpha=.45;ox.drawImage(ring(gs,g2),0,0);ox.globalAlpha=1;ox.drawImage(ring(sil(cv,'#ffd970'),g1),0,0)}
if(!(F.bare&&F.bare.includes(r)))ox.drawImage(ring(sil(cv,'#1f2a24'),ink),0,0);
ox.drawImage(cv,0,0);ox.drawImage(rimLight(cv,1.1*k/2.9),0,0);
if(!F.enemy){const d=x.getImageData(0,0,N,N).data;let x1=0,y0=N;for(let yy=0;yy<N;yy++)for(let xx=0;xx<N;xx++)if(d[(yy*N+xx)*4+3]>40){if(xx>x1)x1=xx;if(yy<y0)y0=yy}
ox.save();ox.translate(Math.min(N-22,x1-4)-58*.9,Math.max(22,y0+14)+62*.9);ox.scale(.9,.9);heartBadge(ox);ox.restore()}
ax.drawImage(o,c*N,r*N)}}
if(J.i<R*8)return false;
F._job=null;
const add=(key,cv)=>{const tex=T.addCanvas(key,cv);for(let i=0;i<R*8;i++)tex.add(i,0,(i%8)*N,Math.floor(i/8)*N,N,N)};
add(F.tex,all);
if(F.red){const rc=mk(all.width,all.height),rx=rc.getContext('2d');rx.drawImage(all,0,0);rx.globalCompositeOperation='source-atop';rx.fillStyle='rgba(255,70,80,.42)';rx.fillRect(0,0,rc.width,rc.height);add(F.tex+'_r',rc)}
return true;
}
const PREBAKE=['blue','frog','nutria','vine','heron','otter','turtle','cat','bblue','bfrog','bnutria','bvine'];
function startPrebake(game){
const tick=()=>{
const T=game.textures,left=PREBAKE.filter(k=>!sheetReady(T,k));if(!left.length)return;
const busy=typeof G!=='undefined'&&G&&G.mode==='play';
const k=left.find(sheetImgOk);
if(!busy&&k)bakeFriendRow(T,k);
setTimeout(tick,busy?400:30);
};
setTimeout(tick,600);
setTimeout(loadBossSheets,2500);
}
const hex=c=>parseInt(c.slice(1),16);
function col(c){if(c[0]==='#')return[hex(c),1];const m=c.match(/[\d.]+/g);return[(+m[0]<<16)|(+m[1]<<8)|+m[2],m[3]!=null?+m[3]:1]}
class Pool{
constructor(scene,make){this.s=scene;this.make=make;this.list=[];this.i=0}
get(){let o=this.list[this.i];if(!o){o=this.make(this.s);this.list.push(o)}this.i++;return o.setVisible(true)}
end(){for(let k=this.i;k<this.list.length;k++)this.list[k].setVisible(false);this.i=0}
}
class PlayScene extends Phaser.Scene{
constructor(){super('play')}
create(){
fitCamera(this);bakeSprites(this);
this.bg=addWetland(this);
this.marks=this.add.graphics().setDepth(-300);
this.shadowG=this.add.graphics().setDepth(-250);
this.over=this.add.graphics().setDepth(5000);
this.glow=this.add.graphics().setDepth(5300).setBlendMode(Phaser.BlendModes.ADD);
this.top=this.add.graphics().setDepth(8000);
this.imgs=new Pool(this,s=>s.add.image(0,0,'spr_blue0'));
this.texts=new Pool(this,s=>s.add.text(0,0,'',{fontFamily:FONT,fontSize:'26px',color:'#fff'}).setOrigin(.5).setStroke(INK,7).setDepth(6000));
this.heroGhost=this.add.sprite(0,0,'hero',0).setOrigin(.5,HERO_FOOT);
this.heroClones=[0,1].map(()=>this.add.sprite(0,0,'hero',0).setOrigin(.5,HERO_FOOT).setVisible(false).setTint(0xb8a8ff));
this.cloneAt=[];
this.fogG=this.add.graphics().setDepth(-200);
this.hzG=this.add.graphics().setDepth(-150);
this.screenG=this.add.graphics().setDepth(5900);
this.worldTxt=this.add.text(0,0,'더 월드',{fontFamily:FONT,color:'#ffd24a'}).setOrigin(.5).setStroke('#3c3550',10).setDepth(5950).setVisible(false);
this.bangs=new Pool(this,s=>s.add.text(0,0,'!',{fontFamily:FONT,fontSize:'44px',color:'#ff5f87'}).setOrigin(.5).setStroke('#1f2a24',8).setDepth(5960));
this.hero=this.add.sprite(0,0,'hero',0).setOrigin(.5,HERO_FOOT);
this.clearT1=this.add.text(0,0,'',{fontFamily:FONT,color:'#e56a87'}).setOrigin(.5).setDepth(7001).setVisible(false);
this.clearT2=this.add.text(0,0,'',{fontFamily:FONT,color:'#e5a51a'}).setOrigin(.5).setDepth(7001).setVisible(false);
this.clearBg=this.add.rectangle(0,0,10,10,0xfffdf6,.35).setOrigin(0).setDepth(7000).setVisible(false);
this.waterG=this.add.graphics().setDepth(-350).setBlendMode(Phaser.BlendModes.ADD);
this.sunG=this.add.graphics().setDepth(5800).setBlendMode(Phaser.BlendModes.ADD);
this.impG=this.add.graphics().setDepth(5050);
this.fxr=[];this.punchZ=0;this.flashW=0;this.lastBossHp=null;this.lastInv=0;
this.emb=[];for(let i=0;i<34;i++)this.emb.push({x:Math.random()*W,y:Math.random()*H,vx:rnd(-8,8),vy:rnd(-24,-8),ph:rnd(0,TAU),c:Math.random()<.6?0xfff3b0:0xffffff,s:rnd(1,2.2)});
try{this.bloom=Phaser.Actions.AddEffectBloom(this.cameras.main,{threshold:.94,blurRadius:3,blurSteps:2,blendAmount:.45})}catch(e){this.bloom=null}
this.aq={n:0,s:0};
const onView=()=>syncWetland(this,this.bg);
this.game.events.on('view-changed',onView);
this.events.once('shutdown',()=>this.game.events.off('view-changed',onView));
}
update(time,delta){
const dt=Math.min(.05,delta/1000);FDT=dt;
if(G){if(G.hitStop>0)G.hitStop-=dt;else{step(dt);fx(dt)}if(G.mode==='play'||G.mode==='win')updateHud()}
if(G){applyTod(this,this.bg);if(G.mode==='break'&&this.prepW!==G.wave){this.prepW=G.wave;prepareTod(this,G.wave+1)}}
this.autoQ(delta/1000);
this.draw(performance.now()/1000);
}
autoQ(dt){
const q=this.aq;if(!G||G.mode!=='play'||q.n>=200||!QUAL||q.off)return;q.n++;q.s+=dt;
if(q.n===200&&q.s/200>1/36){QUAL=0;$('#btnQual').textContent='그래픽 효과 높이기';window.dispatchEvent(new Event('resize'))}
}
spr(key,x,y,sx=1,sy=1,rot=0,fi=0,depth=0,alpha=1,red=false){
const s=SPR[key];if(!s)return null;const fr=red?s.red:s.fr,n=fr.length,k=fr[((Math.floor(fi)%n)+n)%n],b=s.w/s.px;
return this.imgs.get().setTexture(k).setOrigin(.5).setPosition(x,y).setScale(sx*b,sy*b).setRotation(rot).setDepth(depth).setAlpha(alpha).setBlendMode(Phaser.BlendModes.NORMAL);
}
draw(now){
if(this._fxGen!==G.fxGen){this._fxGen=G.fxGen;this.fxr=[];this.flashW=0;this.punchZ=0}
const g=this.marks,sh=this.shadowG,o=this.over,gl=this.glow,HQ=QUAL>0;
g.clear();sh.clear();o.clear();gl.clear();this.top.clear();this.fogG.clear();this.hzG.clear();this.screenG.clear();this.worldTxt.setVisible(false);
this.waterG.clear();this.sunG.clear();this.impG.clear();
if(this.bloom)for(const b of this.bloom)if(b.parallelFilters)b.parallelFilters.active=HQ;
if(!G){this.imgs.end();this.texts.end();this.hero.setVisible(false);this.heroGhost.setVisible(false);return}
const cam=this.cameras.main,dt=FDT||.016;let ox=0,oy=0;if(G.shake>0){ox=rnd(-7,7)*G.shake*2;oy=rnd(-7,7)*G.shake*2}
this.punchZ=Math.max(0,this.punchZ-dt*.25);cam.setZoom(S*DPR*(1+(reduced?0:this.punchZ)));cam.centerOn(W/2-ox,H/2-oy);
this.detectHits();
if(HQ)this.drawAmbient(now,dt);
if(bakeFriend(this,'vine')){
const lf=(x,y)=>8+((Math.round(x/CELL)*7+Math.round(y/CELL)*13)%4+4)%4;
for(const c of G.cells.values())this.sheetPut('es_vine',LEAF_SC*c.g,lf(c.x,c.y),c.x,c.y,c.flip,1,c.rot,1,-500);
for(const d of G.dying){const k=1-d.t/.28;this.sheetPut('es_vine',LEAF_SC*k,lf(d.x,d.y),d.x,d.y,d.flip,1,d.rot+d.t*5,1,-500)}
}else{
for(const c of G.cells.values())this.spr('leafcell',c.x,c.y,c.flip*c.g,c.g,c.rot,0,-500);
for(const d of G.dying){const k=1-d.t/.28;this.spr('leafcell',d.x,d.y,d.flip*k,k,d.rot+d.t*5,0,-500)}}
if(HQ)for(const n of G.natives)this.glowAt(n.x,n.y,26,0xffffff,.14);
for(const n of G.natives){const l=Math.cos(n.a)<0;this.spr('minnow',n.x,n.y,l?-1:1,1,l?-Math.sin(n.a)*.3:Math.sin(n.a)*.3,now*8+SD(n),-400)}
const p=G.player;
if(G.mode==='play'){g.fillStyle(0xffffff,.75);const R=p.range,n0=Math.round(TAU*R/14);for(let i=0;i<n0;i++){const t=i/n0*TAU;g.fillCircle(p.x+Math.cos(t)*R,p.y+Math.sin(t)*R,1.6)}}
for(const e of G.ents)if((e.type==='frog'||e.type==='boss')&&e.st==='air'){const k=1-Math.max(0,e.t)/e.dur,r=SPEC[e.type].r*(1.3-.3*k);g.fillStyle(0xff8fa8,.28).fillEllipse(e.tx,e.ty,r*2,r*1.24);g.lineStyle(5,0xff6f91,.9).strokeEllipse(e.tx,e.ty,r*2,r*1.24)}
if(G.mode==='play'&&G.t>=WAVE_LEN)for(const e of G.ents){if(e.prot||e.dead)continue;const r=SPEC[e.type].r*1.35+Math.sin(now*6)*4,y=e.y-(e.z||0);g.lineStyle(4,0xff5f87,.95);for(let i=0;i<12;i++){const a=i/12*TAU+now;g.beginPath();g.arc(e.x,y,r,a,a+.3);g.strokePath()}}
this.drawSkillUnder(now);
if(G.boss||G.hz.length)this.drawBossArena(now);
if(HQ)this.glowAt(p.x,p.y,130,0xfff2c0,.1);
for(const e of G.ents)this.drawEnt(e,now);
this.drawPlayer(now);
this.drawComp(now);
this.drawFriends(now);
this.drawNets(now);
this.drawSkillOver(now);
this.drawLv2(now);
for(const b of G.bubbles){const k=b.t/.8,y=b.y-k*110,s=(1-k*.6)*b.k,a=1-k*k;const BF=BUBBLE_FR[b.art];if(BF&&bakeFriend(this,b.art))this.sheetPut(FSHEET[b.art].tex,FSHEET[b.art].sc,BF[0],b.x,y,s,s,0,a,5100,BF[1]);else this.spr(b.art,b.x,y,s,s,0,0,5100,a); o.fillStyle(0xffffff,.22*a).fillCircle(b.x,y,44*(1-k*.45));o.lineStyle(4,0xffffff,.9*a).strokeCircle(b.x,y,44*(1-k*.45))}
for(const s of G.shocks){const k=s.t/.32;o.lineStyle(10*(1-k)+2,s.blue?0x78bef5:0xe5a51a,1-k).strokeCircle(s.x,s.y,s.r*(.3+.7*k))}
for(const q of G.parts){const k=q.t/q.life,[c]=col(q.c);
if(q.spark){(HQ?gl:o).lineStyle(q.s*(1-k)+.5,c,1-k).lineBetween(q.x,q.y,q.x-q.vx*.045,q.y-q.vy*.045)}
else if(q.star){o.fillStyle(c,1-k);const pts=[];for(let i=0;i<10;i++){const a=i/10*TAU+q.t*6,r=i%2?q.s*.45:q.s;pts.push({x:q.x+Math.cos(a)*r,y:q.y+Math.sin(a)*r})}o.fillPoints(pts,true)}
else o.fillStyle(c,1-k).fillCircle(q.x,q.y,q.s*.7)}
if(G.glows)for(const q of G.glows){const k=q.t/q.life;this.glowAt(q.x,q.y,q.r*(.6+.5*k),col(q.col)[0],(1-k)*(HQ?.55:.35))}
this.drawImpacts(dt);
if(HQ)this.drawSunAndDust(now,dt);
if(this.flashW>0){this.flashW=Math.max(0,this.flashW-dt);this.screenG.fillStyle(0xffffff,this.flashW*2.2).fillRect(-50,-50,W+100,H+100)}
this.drawFloats();this.drawClear();this.drawPad(now);
this.imgs.end();this.texts.end();this.bangs.end();
}
detectHits(){
for(const b of G.bubbles)if(!b._fx){b._fx=1;this.fxr.push({k:'kill',x:b.x,y:b.y,t:0,life:.38});
if(inPond(b.x,b.y,1.02)){burst(b.x,b.y+10,['#e6f7ff','#9fd8ef','#ffffff'],10,260);this.fxr.push({k:'ripple',x:b.x,y:b.y+12,r:30,t:0,life:.55})}
G.hitStop=Math.max(G.hitStop||0,.06)}
for(const n of G.nets)if(n.land&&!n._fx){n._fx=1;const wet=inPond(n.x1,n.y1,1.02);this.fxr.push({k:wet?'ripple':'dust',x:n.x1,y:n.y1,r:n.r,t:0,life:wet?.6:.45,
d:wet?null:[0,1,2,3,4,5].map(i=>({a:i/6*TAU+rnd(-.3,.3),v:rnd(30,60)}))})}
const b=G.boss;if(b){if(this.lastBossHp!=null&&this.lastBossHp-b.hp>=1.5){this.flashW=Math.max(this.flashW,.12);this.punchZ=Math.max(this.punchZ,.012)}this.lastBossHp=b.hp}else this.lastBossHp=null;
const p=G.player;if(p.inv>this.lastInv+.5&&p.stun>0)this.fxr.push({k:'hurt',x:p.x,y:p.y,t:0,life:.4});this.lastInv=p.inv;
for(const f of this.fxr)f.t+=FDT||.016;this.fxr=this.fxr.filter(f=>f.t<f.life);
}
drawImpacts(){
const g=this.impG;
for(const f of this.fxr){const k=f.t/f.life,e=1-(1-k)*(1-k);
if(f.k==='kill'){const r=20+90*e;g.lineStyle(9*(1-k)+1,0x1f2a24,.55*(1-k)).strokeCircle(f.x,f.y,r);g.lineStyle(5*(1-k)+1,0xffffff,1-k).strokeCircle(f.x,f.y,r);
for(let i=0;i<8;i++){const a=i/8*TAU+.2,r0=r*.75,r1=r*1.08;g.lineStyle(3,0xffe08a,1-k).lineBetween(f.x+Math.cos(a)*r0,f.y+Math.sin(a)*r0,f.x+Math.cos(a)*r1,f.y+Math.sin(a)*r1)}}
else if(f.k==='ripple'){for(let j=0;j<2;j++){const kk=clamp(k*1.25-j*.25,0,1),r=f.r*(.8+1.1*kk);if(kk>0&&kk<1)g.lineStyle(3,0xe6f7ff,.7*(1-kk)).strokeEllipse(f.x,f.y+4,r*2,r*1.1)}}
else if(f.k==='dust'){for(const d of f.d){const r=f.r*.6+d.v*e;g.fillStyle(0xb89a6a,.45*(1-k)).fillCircle(f.x+Math.cos(d.a)*r,f.y+Math.sin(d.a)*r*.5,7*(1-k*.5))}}
else if(f.k==='step'){if(f.wet){g.lineStyle(2,0xe6f7ff,.7*(1-k)).strokeEllipse(f.x,f.y,10+26*e,4+9*e);for(const d of f.d)g.fillStyle(0xe6f7ff,.8*(1-k)).fillCircle(f.x+Math.cos(d.a)*d.v*e*.8,f.y-Math.sin(e*Math.PI)*8+Math.sin(d.a)*4,2)}
else for(const d of f.d)g.fillStyle(0xc9b28a,.5*(1-k)).fillCircle(f.x+Math.cos(d.a)*d.v*e*.6*(f.x>0?1:1),f.y-4*e+Math.sin(d.a)*2,4+3*e)}
else if(f.k==='hurt'){g.lineStyle(6*(1-k)+1,0xff5f6e,.8*(1-k)).strokeCircle(f.x,f.y,30+70*e)}}
}
drawAmbient(now){
const g=this.waterG;
for(let i=0;i<14;i++){const px=pond.cx+Math.sin(now*.21+i*1.9)*pond.a*.72,py=pond.cy+Math.cos(now*.17+i*2.7)*pond.b*.7,a=.11+.09*Math.sin(now*1.3+i);g.lineStyle(2,0xffffff,a).strokeEllipse(px,py,(26+i%4*8)*2,8)}
}
drawSunAndDust(now,dt){
const g=this.sunG;
for(let i=0;i<4;i++){const x0=W*(.18+i*.27)+Math.sin(now*.15+i)*30,a=.07+.035*Math.sin(now*.6+i*1.7),tl=x0-34-i*8,tr=x0+44+i*6,bl=x0-H*.35-60,br=x0-H*.35+100;
g.fillGradientStyle(0xfff6cd,0xfff6cd,0xfff6cd,0xfff6cd,a,a,0,0);g.fillTriangle(tl,0,tr,0,br,H);g.fillGradientStyle(0xfff6cd,0xfff6cd,0xfff6cd,0xfff6cd,a,0,0,0);g.fillTriangle(tl,0,br,H,bl,H)}
for(const e of this.emb){e.x+=(e.vx+Math.sin(now+e.ph)*10)*dt;e.y+=e.vy*dt;if(e.y<-10){e.y=H+10;e.x=Math.random()*W}if(e.x<-10)e.x=W+10;if(e.x>W+10)e.x=-10;
const tw=.5+.5*Math.sin(now*2.2+e.ph);for(let j=3;j>=1;j--)g.fillStyle(e.c,.28*tw*.3*(4-j)/3).fillCircle(e.x,e.y,e.s*6*j/3);g.fillStyle(0xfff8e0,.9*tw).fillCircle(e.x,e.y,e.s*.6)}
}
drawLv2(now){
const o=this.over,L2=id=>syn(id)>=2;
if(L2('wideburst'))for(const q of G.waves){const k=q.t/.55,e=1-(1-k)*(1-k),R=q.r*(.25+.75*e);this.glowAt(q.x,q.y,R*.7,0x8fd0ff,.4*(1-k));
for(let i=0;i<22;i++){const a=i/22*TAU+q.x*.01,rr=R*(1.04+.12*Math.sin(i*3.1)),h=Math.sin(k*Math.PI)*(18+i%3*8);o.fillStyle(0xe6f7ff,.95*(1-k)).fillCircle(q.x+Math.cos(a)*rr,q.y+Math.sin(a)*rr-h,4*(1-k*.5))}
o.lineStyle(3,0xffffff,.6*(1-k)).strokeCircle(q.x,q.y,R*1.15)}
if(L2('cannon'))for(const q of G.jets){const k=q.t/.4,L=q.len*Math.min(1,q.t/.12),c=Math.cos(q.a),s=Math.sin(q.a);
for(let i=1;i<=7;i++){const d=L*i/7;this.glowAt(q.x+c*d,q.y+s*d,30,0x8fd0ff,.38*(1-k))}
const ex=q.x+c*L,ey=q.y+s*L;o.lineStyle(4,0xffffff,.85*(1-k)).strokeCircle(ex,ey,18+46*k);
for(let i=0;i<10;i++){const a=i/10*TAU+k*3,d=14+56*k;o.fillStyle(0xbfe3fb,1-k).fillCircle(ex+Math.cos(a)*d,ey+Math.sin(a)*d-24*Math.sin(k*Math.PI),4.5)}}
for(const n of G.nets){if(!n.land||!n.linger||n.land>n.linger)continue;const cx=n.x1,cy=n.y1,r=n.r,k=n.land/n.linger,fade=1-Math.max(0,(k-.85)/.15);
if(n.dot){this.glowAt(cx,cy,r*1.1,0x3a8fd6,.18*fade);o.fillStyle(0x2f6fb0,.18*fade).fillEllipse(cx,cy,r*2.2,r*1.76);
for(const [w,c,al] of [[7,0x1f4f86,.55],[4,0x4fa8f0,.95],[1.5,0xffffff,.9]]){o.lineStyle(w,c,al*fade);
for(let j=0;j<4;j++){const pts=[];for(let i=0;i<=16;i++){const u=i/16,a=j/4*TAU+now*3.2+u*3,rr=r*(1-u*.85);pts.push({x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr*.8})}o.strokePoints(pts,false)}}
for(let i=0;i<7;i++){const ph=(now*.9+i/7)%1;o.lineStyle(2.5,0x2f7fc8,.9*(1-ph)*fade).strokeCircle(cx+Math.sin(i*2.3)*r*.55,cy+Math.cos(i*1.7)*r*.45-ph*34,3+ph*4)}}
else if(n.trap&&L2('trap'))this.glowAt(cx,cy,r*.85,0x4fb9a8,.22*fade)}
if(L2('knot'))for(const e of G.ents){if(!(e.frz>0)||e.dead)continue;const s=SPEC[e.type],y=e.y-(e.z||0),r=s.r+14,a=Math.min(1,e.frz*3);
this.glowAt(e.x,y,r*1.25,0xffd59a,.28*a);o.lineStyle(3,0xe5a24a,a).strokeEllipse(e.x,y,r*2.3,r*1.36);
for(let i=0;i<3;i++){const t=now*4+i*TAU/3;o.fillStyle(0xfff1c8,a).fillCircle(e.x+Math.cos(t)*r*1.15,y+Math.sin(t)*r*.68,3.2)}}
if(L2('ebb'))for(const q of G.swirls){if(!q.out||q.t<0)continue;const k=q.t/.5,rr=q.r*(.3+.8*(1-(1-k)*(1-k)));this.glowAt(q.x,q.y,rr,0x8fd0ff,.3*(1-k))}
if(L2('tide'))for(const q of G.swirls){if(q.out)continue;const k=q.t/.5;this.glowAt(q.x,q.y,q.r*(1-.6*k),0x5aa9e6,.4*(1-k))}
if(L2('mist')&&G.worldClock>0){const p=1-G.worldClock/WORLD_CLOCK,m=Math.min(W,H),g=this.screenG;g.fillStyle(0x6f5aa8,.14*Math.sin(p*Math.PI)).fillRect(-50,-50,W+100,H+100);
for(let i=0;i<3;i++){const ph=(p*2+i/3)%1;g.lineStyle(4,0xf6f3ff,.38*(1-ph)).strokeCircle(W/2,H/2,m*.2+ph*m*.5)}}
if(L2('shadow')&&G.fogT>0)for(const c of this.cloneAt)if(c)this.glowAt(c.x,c.y-40,62,0x9b7bff,.36+.1*Math.sin(now*6));
if(L2('bolt'))for(const q of G.bolts){const k=q.t/.2;this.glowAt(q.x,q.y,95*(1-k*.3),0xffe26e,.55*(1-k));o.lineStyle(5,0xffffff,.9*(1-k)).strokeEllipse(q.x,q.y,60+130*k,28+56*k);
for(let j=2;j<q.pts.length-1;j+=2){const [bx,by]=q.pts[j];o.lineStyle(2.5,0xffe98a,1-k).lineBetween(bx,by,bx+((j*37)%44-22),by+24)}}
}
drawBossArena(now){
const g=this.hzG,PINK=0xff5f87;
for(const h of G.hz){const k=clamp(h.t/h.warn,0,1),act=h.t>=h.warn;
if(h.k==='c'){g.fillStyle(act?0xffffff:0xff6f91,act?.75:.24).fillCircle(h.x,h.y,h.r);g.lineStyle(4,PINK,.95).strokeCircle(h.x,h.y,h.r);if(!act)g.fillStyle(PINK,.42).fillCircle(h.x,h.y,h.r*k)}
else if(h.k==='b'){const c=Math.cos(h.a),s=Math.sin(h.a),P=(u,v)=>({x:h.x+u*c-v*s,y:h.y+u*s+v*c}),rect=L2=>[P(0,-h.w/2),P(L2,-h.w/2),P(L2,h.w/2),P(0,h.w/2)];
g.fillStyle(act?0xffffff:0xff6f91,act?.8:.24).fillPoints(rect(h.len),true);g.lineStyle(4,PINK,.95).strokePoints(rect(h.len),true);if(!act)g.fillStyle(PINK,.42).fillPoints(rect(h.len*k),true)}
else if(h.k==='r'){if(!act)g.lineStyle(6,PINK,.9).strokeCircle(h.x,h.y,50+k*110);else{const r=(h.t-h.warn)*h.speed;g.lineStyle(h.thick+8,0xffffff,.8).strokeCircle(h.x,h.y,r);g.lineStyle(h.thick,0xff6f91,1).strokeCircle(h.x,h.y,r)}}
else{g.fillStyle(0xffffff,.95).fillCircle(h.x,h.y,h.r+4);g.fillStyle(0x8fc7f5,1).fillCircle(h.x,h.y,h.r);g.fillStyle(0xffffff,1).fillEllipse(h.x-h.r*.3,h.y-h.r*.35,h.r*.56,h.r*.44)}}
if(G.warns)for(const w of G.warns){const b=w.b,k=w.t/w.life,bl=.55+.45*Math.sin(w.t*40);
for(let i=0;i<w.n;i++){const t=w.a+(i-(w.n-1)/2)*w.sp,r0=b.r*.75,r1=r0+70+150*Math.min(1,k*2.5),ex=b.x+Math.cos(t)*r1,ey=b.y+Math.sin(t)*r1;
for(const [c,lw] of [[0x1f2a24,9],[PINK,5]]){g.lineStyle(lw,c,bl);for(let d=r0;d<r1;d+=20)g.lineBetween(b.x+Math.cos(t)*d,b.y+Math.sin(t)*d,b.x+Math.cos(t)*Math.min(r1,d+12),b.y+Math.sin(t)*Math.min(r1,d+12));
g.lineBetween(ex-Math.cos(t-.5)*14,ey-Math.sin(t-.5)*14,ex,ey);g.lineBetween(ex-Math.cos(t+.5)*14,ey-Math.sin(t+.5)*14,ex,ey)}}
this.bangs.get().setText('!').setFontSize(46).setColor('#ff5f87').setStroke('#1f2a24',8).setPosition(b.x,Math.max(120,b.y-b.r*1.3-30)).setAlpha(bl)}
const b=G.boss;if(!b)return;
for(const r of b.roots)if(r.alive){const p=1+Math.sin(now*5)*.07;g.lineStyle(4,0xffc93c,.9).strokeCircle(r.x,r.y,42*p);if(bakeFriend(this,'vine')){const sw=Math.sin(now*2.6+r.x);this.friendPut(FSHEET.vine,sw>.45?1:sw<-.45?2:0,r.x,r.y+26,0,1,1,0,1,r.y)}else this.spr('vine',r.x,r.y,1,1,Math.sin(now*2.6+r.x)*.04,now*3,r.y)}
this.drawBoss(now);
}
drawBoss(now){
const b=G.boss,dead=b.deadT>0?b.deadT/1.15:1,o0=this.over;
if(b.under&&b.k==='nutria'&&bakeFriend(this,'bnutria')){
const F=FSHEET.bnutria,p=G.player,a=Math.atan2((p.y-b.y)/HK,p.x-b.x),col=HERO_DIR[((Math.round(a/(Math.PI/4))%8)+8)%8][0],w=1+Math.sin(now*14)*.03;
this.shadowG.fillStyle(0x3d5a4c,.22).fillEllipse(b.x,b.y+b.r*.6,b.r*2,b.r*.6);
this.friendPut({tex:F.tex,sc:F.sc*BOSS_VIEW.nutria.sc,cell:F.cell,foot:F.foot},3*8+col,b.x,b.y+b.r*BOSS_VIEW.nutria.foot,0,w,2-w,0,1,b.y);return}
if(b.under){const y=b.y+b.r*.35,w=b.r*.9+Math.sin(now*14)*4;this.shadowG.fillStyle(0x3d5a4c,.22).fillEllipse(b.x,y+6,w*2.1,w*.64);this.marks.fillStyle(0xa07850,1).fillEllipse(b.x,y,w*2,w*.68);
for(let i=0;i<7;i++){const a=i/7*Math.PI+Math.sin(now*9+i)*.2;this.marks.fillStyle(i%2?0xd9b98a:0x8a6544,1).fillEllipse(b.x+Math.cos(a)*w*.75,y-Math.sin(a)*w*.28,18,12)}return}
const open=b.win>0||b.stun>0;
this.shadow(b.x,b.y+b.r*.62,b.r*(1-.3*Math.min(1,(b.z||0)/260)));
if(open&&!b.deadT){const p=1+Math.sin(now*12)*.05;this.marks.lineStyle(6,0xffc93c,.95);for(let i=0;i<16;i++){const a=i/16*TAU,pts=[];for(let j=0;j<=4;j++){const t=a+j/4*TAU/16*.57;pts.push({x:b.x+Math.cos(t)*b.r*1.25*p,y:b.y+b.r*.55+Math.sin(t)*b.r*.55*p})}this.marks.strokePoints(pts,false)}}
const sq=b.puff>0?1+Math.sin(now*26)*.05:1,o=b.flash>0?1.06:1,breath=1+Math.sin(now*3)*.02;
const an=animOf(b,b.k==='nutria');let bx=0,by=0,brot=0,ssx=1,ssy=1;
if(b.k==='blue'){brot=clamp(an.vy/(Math.abs(an.vx)+120),-1,1)*.1*Math.sign(an.fs)+Math.sin(now*(3.5+an.sp*.01))*.03}
else if(b.k==='nutria'){if(an.sp>25){const ph=an.ph*.9;by=-Math.abs(Math.sin(ph))*10;brot=Math.sin(ph)*.07;ssy=1-.05*(1-Math.abs(Math.sin(ph)));ssx=2-ssy}}
else if(b.k==='frog'){const z=b.z||0;if(z>2){ssy=1+Math.min(.16,z/500);ssx=2-ssy;an.wasAir=1}else if(an.wasAir){an.wasAir=0;an.land=.22}if(an.land>0){const k=an.land/.22;ssy=1-.2*k;ssx=1+.18*k;by=b.r*.18*k}}
else if(b.k==='vine'){brot=Math.sin(now*2.2)*.04}
const fl=b.k==='blue'||b.k==='nutria'?fsx(an):1,bsx=fl*o*breath*sq*dead*ssx,bsy=o*(2-breath)*dead*ssy,rot=b.deadT?(1-dead)*2:brot,x=b.x+bx,y=b.y-(b.z||0)+by;
if(bakeFriend(this,'b'+b.k)){this.drawBossSheet(b,an,now,open,dead,o,breath,sq,ssx,ssy,bx,by);return this.bossOverlay(b,open,now,o0)}
this.spr(b.art,x,y,bsx,bsy,rot,0,b.y);
if(b.flash>0&&!b.deadT)this.spr(b.art,x,y,bsx*1.04,bsy*.96,rot,0,b.y+.1,Math.min(.6,b.flash*5)).setBlendMode(Phaser.BlendModes.ADD);
this.bossOverlay(b,open,now,o0);
}
drawBossSheet(b,an,now,open,dead,o,breath,sq,ssx,ssy,bx,by){
const F=FSHEET['b'+b.k],p=G.player,K=BOSS_VIEW[b.k];let row=0,col=0,rot=0,sx=1,sy=1;
const moving=!!b.tw,dash=moving&&b.tw.d<=.4;
let ang=Math.atan2((p.y-b.y)/HK,p.x-b.x);if(moving)ang=Math.atan2((b.tw.ty-b.tw.sy)/HK,b.tw.tx-b.tw.sx);if(b.pose==='tongue'&&b.poseA!=null)ang=Math.atan2(Math.sin(b.poseA)/HK,Math.cos(b.poseA));
if(!(b.k==='frog'&&b.air))b._da=ang;
col=HERO_DIR[((Math.round((b._da!=null?b._da:Math.PI/2)/(Math.PI/4))%8)+8)%8][0];
if(b.k==='blue'){row=dash?2:b.puff>0?3:(Math.sin(now*(4+an.sp*.01))>=0?0:1);sx=sq;rot=Math.sin(now*3.5)*.03}
else if(b.k==='frog'){row=b.air?2:b.pose==='tongue'?3:b.puff>0?1:0;sx=ssx*(b.air?1:breath);sy=ssy*(b.air?1:2-breath)}
else if(b.k==='nutria'){row=dash?2:(moving||an.sp>25)?(Math.sin(an.ph*.9)>=0?0:1):0;if(b.puff>0){rot=now*14;row=0}sy=ssy;sx=ssx}
else if(b.k==='vine'){row=0;col=b.pose==='whip'?2:b.puff>0?3:(Math.sin(now*1.6)>=0?0:1);sx=sq*breath;sy=2-breath}
if(open&&!b.deadT){if(b.k==='vine')col=4;else row=4;rot=0}
if(b.deadT){rot=(1-dead)*2}
const T={tex:F.tex,sc:F.sc*K.sc*o*dead,cell:F.cell,foot:F.foot},fr=row*8+col,depth=b.y;
const fy=b.y+b.r*K.foot+by-(b.z||0);
const put=(al,mx,my)=>K.mid?this.sheetPut(T.tex,T.sc,fr,b.x+bx,b.y-(b.z||0)+by,sx*mx,sy*my,rot,al,depth+(al<1?.1:0)):this.friendPut(T,fr,b.x+bx,fy,0,sx*mx,sy*my,rot,al,depth+(al<1?.1:0));
put(1,1,1);
if(b.flash>0&&!b.deadT)put(Math.min(.6,b.flash*5),1.04,.96).setBlendMode(Phaser.BlendModes.ADD);
}
bossOverlay(b,open,now,o0){
if(b.shield){o0.fillStyle(0x7cb94f,.22).fillCircle(b.x,b.y,b.r*1.22);o0.lineStyle(5,0x7cb94f,.8).strokeCircle(b.x,b.y,b.r*1.22)}
if(open&&!b.deadT)this.bangs.get().setText('지금!').setFontSize(34).setColor('#e5a51a').setStroke('#ffffff',8).setPosition(b.x,Math.max(122,b.y-(b.z||0)-150)).setAlpha(1);
}
drawComp(now){
if(G.comp&&compType())this.drawCompOne(G.comp,compType(),now,1);
if(G.guests)for(const g of G.guests)if(g.alpha>0)this.drawCompOne(g,g.k,now,g.alpha);
}
drawCompOne(c,k,now,alpha){
const p=G.player,front=k!=='turtle',an=animOf(c,front),a=c.act,SC=.6;
if(an.sp<25&&!a){c.look=(c.look||0)-(FDT||0);if(c.look<-3.5-SD(c)){c.look=.7}const pf=(p.flip||1)*(front?-1:1);an.face=c.look>0?-pf:pf}
if(k==='otter'&&bakeDali(this)){this.drawDali(c,an,a,now,alpha);return}
if(k==='turtle'&&bakeFriend(this,'turtle')){this.drawTurtle(c,an,a,now,alpha);return}
if(k==='cat'&&bakeFriend(this,'cat')){this.drawCat(c,an,a,now,alpha);return}
let ox=0,oy=0,rot=0,sx=1,sy=1,z=0;
const walk=an.sp>25;
if(!a){if(walk){if(k==='otter'){const ph=an.ph*1.2;z=Math.abs(Math.sin(ph))*10;sy=1+.08*Math.sin(ph*2);rot=clamp(an.vx/700,-.14,.14)}
else if(k==='cat'){const ph=an.ph*1.5;z=Math.abs(Math.sin(ph))*5;rot=clamp(an.vx/900,-.1,.1)}
else{const ph=an.ph*.9;rot=Math.sin(ph)*.09;z=Math.abs(Math.sin(ph))*3}}
else{const br=Math.sin(now*3+SD(c));sy=1+.03*br;sx=1-.015*br}}
else if(a.kind==='dash'){const q=Math.min(1,a.t/.3);sx=1.28-.2*q;sy=.82+.12*q;rot=clamp(an.vy/1400,-.3,.3)*Math.sign(an.fs);oy=3}
else if(a.kind==='pounce'){const W0=.1;if(a.t<W0){const kq=a.t/W0;sy=1-.24*kq;sx=1+.18*kq;oy=5*kq;ox=Math.sin(now*80)*1.2}
else if(a.t<W0+.28){const q=(a.t-W0)/.28;sy=1.18-.3*q;sx=.88+.24*q;rot=-Math.sign(an.fs)*(.5-q)*.7}
else{const kq=Math.max(0,1-(a.t-W0-.28)/.2);sy=1-.22*kq;sx=1+.2*kq;oy=5*kq}}
else if(a.kind==='bump'){const T=.24;if(a.t<T){const q=a.t/T;z=Math.sin(q*Math.PI)*46;rot=Math.sign(an.fs||1)*q*TAU*.5;sy=1+.1*Math.sin(q*Math.PI)}
else{const kq=Math.max(0,1-(a.t-T)/.18);sy=1-.28*kq;sx=1+.24*kq;oy=6*kq}}
else if(a.kind==='grab'){const br=Math.sin(now*14);sy=1-.06*br;sx=1+.05*br;rot=.08*br}
else if(a.kind==='pose'){const q=1+.14*Math.sin(Math.min(1,a.t/.6)*Math.PI);sx=q;sy=q}
z-=thop(an);this.shadow(c.x,c.y+22,19*(1-Math.min(.35,z/120)));
this.spr(COMP_ART[k],c.x+ox,c.y-z+oy+(1-sy)*14,fsx(an)*sx*SC,sy*SC,rot,c.hop*8,c.y,alpha);
}
drawDali(c,an,a,now,alpha){
const dt=FDT||.016,walk=an.sp>25;
let ang=null;
if(a&&(a.kind==='dash'||a.kind==='bump'))ang=Math.atan2((a.ty-a.sy)/HK,a.tx-a.sx);else if(walk)ang=Math.atan2(an.vy/HK,an.vx);
if(ang!=null){c._da=ang;c._idle=0}else c._idle=(c._idle||0)+dt;
const oct=(ang!=null||(c._idle<.45&&c._da!=null))?((Math.round(c._da/(Math.PI/4))%8)+8)%8:(an.fs<0?1:3);
let col=HERO_DIR[oct][0],row=0,z=0,sx=1,sy=1;
if(a&&a.kind==='dash'){row=a.t<.3?4:2;z=Math.sin(Math.min(1,a.t/.3)*Math.PI)*8}
else if(a&&a.kind==='bump'){const T=.24;if(a.t<T){row=4;z=Math.sin(a.t/T*Math.PI)*46}else{row=2;const kq=Math.max(0,1-(a.t-T)/.18);sy=1-.15*kq;sx=1+.1*kq}}
else if(a&&a.kind==='pose'){col=0;const q=1+.14*Math.sin(Math.min(1,a.t/.6)*Math.PI);sx=q;sy=q}
else if(walk){const u=(an.ph*1.2)%Math.PI;row=u>Math.PI*.2&&u<Math.PI*.8?1:2;z=Math.abs(Math.sin(an.ph*1.2))*8}
else if(c._idle>4+SD(c))row=3;
else{const br=Math.sin(now*3+SD(c));sy=1+.025*br;sx=1-.012*br}
this.shadow(c.x,c.y+22,19*(1-Math.min(.35,z/120)));
this.imgs.get().setTexture('dali',row*8+col).setOrigin(.5,DALI_FOOT).setPosition(c.x,c.y+22-z).setScale(DALI_SC*sx,DALI_SC*sy).setRotation(0).setDepth(c.y).setAlpha(alpha).setBlendMode(Phaser.BlendModes.NORMAL);
}
friendCol(c,an,ang){
if(ang!=null){c._da=ang;c._idle=0}else c._idle=(c._idle||0)+(FDT||.016);
const oct=(ang!=null||(c._idle<.45&&c._da!=null))?((Math.round(c._da/(Math.PI/4))%8)+8)%8:(an.fs<0?1:3);
return HERO_DIR[oct][0];
}
friendPut(F,fr,x,footY,z,sx,sy,rot,alpha,depth){
const im=this.imgs.get().setTexture(F.tex,fr).setScale(F.sc*sx,F.sc*sy).setRotation(rot).setDepth(depth).setAlpha(alpha).setBlendMode(Phaser.BlendModes.NORMAL);
const FT=F.foot||DALI_FOOT,CL=F.cell||DALI_CELL;
if(rot){const up=(FT-.5)*CL*F.sc*sy;im.setOrigin(.5,.5).setPosition(x,footY-z-up)}else im.setOrigin(.5,FT).setPosition(x,footY-z);
return im;
}
sheetPut(tex,sc,fr,x,y,sx,sy,rot,alpha,depth,oy=.5){
return this.imgs.get().setTexture(tex,fr).setOrigin(.5,oy).setPosition(x,y).setScale(sc*sx,sc*sy).setRotation(rot).setDepth(depth).setAlpha(alpha).setBlendMode(Phaser.BlendModes.NORMAL);
}
drawTurtle(c,an,a,now,alpha){
const F=FSHEET.turtle,walk=an.sp>25,b=G.boss;
let ang=null;
if(a&&a.kind==='bump')ang=Math.atan2((a.ty-a.sy)/HK,a.tx-a.sx);
else if(a&&a.kind==='grab'&&b)ang=Math.atan2((b.y-c.y)/HK,b.x-c.x);
else if(walk)ang=Math.atan2(an.vy/HK,an.vx);
let col=this.friendCol(c,an,ang),row=0,z=0,sx=1,sy=1,rot=0;
if(a&&a.kind==='bump'){const T=.24;
if(a.t<T){const q=a.t/T;row=3;z=Math.sin(q*Math.PI)*46;rot=(Math.cos(ang)<0?-1:1)*q*TAU*.5}
else{const kq=Math.max(0,1-(a.t-T)/.18);row=a.t<T+.12?3:0;sy=1-.2*kq;sx=1+.16*kq}}
else if(a&&a.kind==='grab'){row=4;const br=Math.sin(now*14);rot=.05*br;sx=1+.04*br;sy=1-.05*br}
else if(a&&a.kind==='pose'){col=0;const q=1+.14*Math.sin(Math.min(1,a.t/.6)*Math.PI);sx=q;sy=q}
else if(walk){const ph=an.ph*.9;row=Math.sin(ph)>=0?1:2;z=Math.abs(Math.sin(ph))*2.5;sy=1+.02*Math.cos(ph*2)}
else if(c._idle>6+SD(c))row=3;
else{const br=Math.sin(now*2.4+SD(c));sy=1+.02*br;sx=1-.01*br}
this.shadow(c.x,c.y+22,22*(1-Math.min(.35,z/120)));
this.friendPut(F,row*8+col,c.x,c.y+22,z,sx,sy,rot,alpha,c.y);
}
drawCat(c,an,a,now,alpha){
const F=FSHEET.cat,walk=an.sp>25;
let ang=null;
if(a&&a.kind==='pounce')ang=Math.atan2((a.ty-a.sy)/HK,a.tx-a.sx);else if(walk)ang=Math.atan2(an.vy/HK,an.vx);
let col=this.friendCol(c,an,ang),row=0,z=0,sx=1,sy=1;
if(a&&a.kind==='pounce'){const W0=.1;
if(a.t<W0){const kq=a.t/W0;row=2;sy=1-.12*kq;sx=1+.08*kq}
else if(a.t<W0+.28)row=4;
else{const kq=Math.max(0,1-(a.t-W0-.28)/.2);row=kq>.4?2:0;sy=1-.12*kq;sx=1+.1*kq}}
else if(a&&a.kind==='pose'){col=0;const q=1+.14*Math.sin(Math.min(1,a.t/.6)*Math.PI);sx=q;sy=q}
else if(walk){const ph=an.ph*1.5,u=ph%Math.PI;row=u>Math.PI*.2&&u<Math.PI*.8?1:2;z=Math.abs(Math.sin(ph))*6}
else if(c._idle>4+SD(c))row=3;
else{const br=Math.sin(now*3+SD(c));sy=1+.025*br;sx=1-.012*br}
this.shadow(c.x,c.y+22,19*(1-Math.min(.35,z/120)));
this.friendPut(F,row*8+col,c.x,c.y+22,z,sx,sy,0,alpha,c.y);
}
drawHerons(now){
const F=FSHEET.heron,sc=F.sc,o=this.over;
for(const q of G.swoops){
const d=q.flip?-1:1,bx=q.x-d*HERON_TIP[0]*sc,by=q.y-HERON_TIP[1]*sc;
let x,y,fr,al=1;
if(q.t<.42){const k=q.t/.42;fr=k<.55?Math.floor(q.t/.07)%2:k<.82?2:3;x=bx-d*(1-k)*320;y=by-(1-k*k)*560}
else{const u=(q.t-.42)/.28;fr=u<.25?3:4;x=bx+d*u*240;y=by-u*u*300-u*60;al=1-u*u;
o.lineStyle(4,0xffffff,.85*(1-u));o.strokeEllipse(q.x,q.y+6,40+u*90,(40+u*90)*.45)}
this.sheetPut(F.tex,sc,fr,x,y,d,1,0,al,5050);
if(q.proxy){const h=HERON_HEAD[fr];this.heronCrown(x+d*h[0]*sc,y+(h[1]-30)*sc,al)}
}
}
heronCrown(x,y,a){const g=this.top,w=24,h=15,p=[[-w/2,h/2],[-w/2,-h/2],[-w/4,0],[0,-h*.75],[w/4,0],[w/2,-h/2],[w/2,h/2]];
g.fillStyle(0xffd23f,a);g.lineStyle(2.5,0x5a3b00,a);g.beginPath();g.moveTo(x+p[0][0],y+p[0][1]);for(const [px,py] of p.slice(1))g.lineTo(x+px,y+py);g.closePath();g.fillPath();g.strokePath()}
drawFriends(now){
const o=this.over,p=G.player;
if(bakeFriend(this,'heron'))this.drawHerons(now);
else for(const q of G.swoops){const k=clamp(q.t/.42,0,1),x=q.x+(q.flip?-1:1)*(1-k)*520,y=q.y-(1-k)*(1-k)*520,al=q.t>.42?1-(q.t-.42)/.28:1;
if(q.proxy&&q.t<.42){o.lineStyle(3,0xffffff,.8);for(let i=0;i<3;i++){const yy=y-30+i*14,d=q.flip?-1:1;o.lineBetween(x-d*(40+i*8),yy,x-d*(90+i*8),yy)}}
this.spr(q.proxy?'kheron':'heron',x,y-20,q.flip?1:-1,1,0,0,5050,al)}
for(const q of G.preds){const k=clamp(q.t/.42,0,1),air=q.art==='leopard'||q.art==='snakehead',dx=(q.flip?-1:1)*(1-k)*(air?300:520),hh=air?160:520,x=q.x+dx,y=q.y-(air?Math.sin(k*Math.PI)*hh*(1-k*.5):(1-k)*(1-k)*hh),al=q.t>.42?1-(q.t-.42)/.28:1;
this.spr(q.art,x,y-20,q.flip?1:-1,1,0,0,5050,al)}
for(const e of G.ents){if(!(e.mark>0)||e.dead)continue;const r=SPEC[e.type].r+14,y=e.y-(e.z||0),pl=1+Math.sin(now*8)*.06;
o.lineStyle(4,0xff9d3c,1);for(let i=0;i<10;i++){const a=i/10*TAU-now*.6;o.beginPath();o.arc(e.x,y,r*pl,a,a+.36);o.strokePath()}
const px=e.x,py=y-r-12;o.fillStyle(0xff9d3c,1).fillEllipse(px,py+3,12,10);for(const [dx,dy] of [[-6,-4],[-2,-7],[2,-7],[6,-4]])o.fillCircle(px+dx,py+dy,2.4)}
const cols=[0xff8fa8,0x5aa9e6,0xe5a51a,0x5f83d6];
if(syn('sabang')){const t0=now*1000/800;for(let i=0;i<4;i++){const a=t0+i*TAU/4;o.fillStyle(cols[i],1).fillCircle(p.x+Math.cos(a)*32,p.y-4+Math.sin(a)*17,3.2)}}
if(syn('guardian')){const t0=now*1000/500;for(let i=0;i<4;i++){const a=t0+i*TAU/4;o.fillStyle(cols[i],1).fillCircle(p.x+Math.cos(a)*40,p.y-4+Math.sin(a)*22,5)}}
}
drawSkillUnder(now){
const g=this.marks,el=syn('bolt');
G.trails.forEach((t,i)=>{const k=1-t.t/t.life,yy=t.y+Math.sin(now*4+t.x)*2,rr=t.r*(.7+.3*k);
g.fillStyle(el?0xffe26e:0x8fc7f5,(el?.42:.5)*k).fillCircle(t.x,yy,rr);g.lineStyle(3,el?0xffc828:0xffffff,(el?.9:.8)*k).strokeCircle(t.x,yy,rr);if(el&&i%2===0)this.zap(this.over,t.x,yy,rr,1,k)});
if(G.fogT>0){const f=this.fogG;f.fillStyle(0xeef6fb,Math.min(.55,G.fogT*.6)).fillRect(-50,-50,W+100,H+100);
f.fillStyle(0xffffff,Math.min(.5,G.fogT*.5));for(let i=0;i<7;i++){const x=((i*170+now*40)%(W+200))-100,y=120+i*(H-140)/7;f.fillEllipse(x,y,300,68)}}
}
drawSkillOver(now){
const o=this.over,p=G.player;
for(const e of G.ents){if(!(e.frz>0)||e.dead)continue;const s=SPEC[e.type],y=e.y-(e.z||0),r=s.r*(e.type==='boss'?1:e.type==='frog'?.75:1)+10,a=Math.min(1,e.frz*3);
o.lineStyle(5,0xb07a3c,a);for(let i=0;i<14;i++){const t0=i/14*TAU;o.beginPath();for(let j=0;j<=4;j++){const t=t0+j/4*TAU/14*.7;const x=e.x+Math.cos(t)*r*1.05,yy=y+Math.sin(t)*r*.6;j?o.lineTo(x,yy):o.moveTo(x,yy)}o.strokePath()}
o.fillStyle(0xb07a3c,a).fillEllipse(e.x-9,y-r*.6,16,10).fillEllipse(e.x+9,y-r*.6,16,10);o.fillStyle(0x8a5a28,a).fillCircle(e.x,y-r*.6,4)}
for(const q of G.waves){const k=q.t/.55,e=1-(1-k)*(1-k);for(const [c,w,off,sp,al] of [[0x4696e1,16,1,1,.75],[0xebf7ff,6,.93,-1,.92]]){const pts=[];for(let i=0;i<96;i++){const a=i/96*TAU,r=q.r*(.25+.75*e)*off*(1+.045*Math.sin(a*14+now*7*sp));pts.push({x:q.x+Math.cos(a)*r,y:q.y+Math.sin(a)*r})}o.lineStyle(w,c,al*(1-k)).strokePoints(pts,true)}}
for(const q of G.jets){const k=q.t/.4,ext=Math.min(1,q.t/.12),L2=q.len*ext,al=1-Math.max(0,(k-.4)/.6),c=Math.cos(q.a),s=Math.sin(q.a),P=(a,b)=>({x:q.x+a*c-b*s,y:q.y+a*s+b*c});
for(const [col,w,ca] of [[0x5aa9e6,30,.85],[0xdcf0ff,11,.95]]){const pts=[P(10,0)];for(let i=1;i<=12;i++)pts.push(P(L2*i/12,Math.sin(i*1.3+now*30)*3));o.lineStyle(w*(1-k*.4),col,ca*al).strokePoints(pts,false)}
for(let i=0;i<5;i++){const pt=P(L2+rnd(-6,14),rnd(-16,16));o.fillStyle(0xbfe3fb,al).fillCircle(pt.x,pt.y,5)}}
for(const q of G.swirls){if(q.t<0)continue;const k=q.t/.5;
if(q.out){this.drawSurge(o,q,k,now);continue}
o.lineStyle(5,0x78bef5,.9*(1-k));for(let i=0;i<8;i++){const a=i/8*TAU+k*2.2,r=q.r*(1-.75*k);o.beginPath();o.arc(q.x,q.y,r,a,a+.42);o.strokePath()}}
for(const f of G.flames){const k=f.t/.42;for(let i=0;i<14;i++){const a=i/14*TAU+f.t*2,r=f.r*(.72+.28*k),h=34*(1-k*.6)+Math.sin(now*30+i)*5,x=f.x+Math.cos(a)*r,y=f.y+Math.sin(a)*r;o.fillStyle(i%2?0xff9d3c:0xffcf4a,1-k*k).fillTriangle(x-10,y,x,y-h,x+10,y)}}
const bd=G.bdash;
if(bd&&bd.path.length>1&&!bd.lv){const p=G.player,al=bd.t<bd.dur?1:Math.max(0,1-bd.gone/.12),tail=bd.path.slice(-6).map(q=>({x:q.x,y:q.y-26}));
if(al>0){o.lineStyle(20,0x8fc7f5,.3*al).strokePoints(tail,false);o.lineStyle(7,0xffffff,.65*al).strokePoints(tail,false);
o.fillStyle(0xbfe3fb,.3*al).fillCircle(p.x,p.y-26,46);o.lineStyle(4,0x5aa9e6,.9*al).strokeCircle(p.x,p.y-26,46);o.fillStyle(0xffffff,.85*al).fillEllipse(p.x-16,p.y-46,14,9);
this.glowAt(p.x,p.y-30,56,0x8fd0ff,.5*al)}}
if(bd&&bd.path.length>1&&bd.lv){const al=bd.t<bd.dur?1:Math.max(0,1-bd.gone/.45),f=Math.floor(performance.now()/45);
const jit=(i,s)=>{const v=Math.sin(i*12.9+f*37.7+s*7.1)*43758.5;return (v-Math.floor(v)-.5)*2};
for(const [w,c,aa] of [[12,0xffe26e,.35],[5,0xffffff,.95],[2.5,0xffc928,1]]){const pts=bd.path.map((q,i)=>({x:q.x+jit(i,1)*(w>6?3:9),y:q.y-30+jit(i,2)*(w>6?3:9)}));o.lineStyle(w,c,aa*al).strokePoints(pts,false)}
for(let i=0;i<bd.path.length;i+=3){const q=bd.path[i];this.zap(o,q.x,q.y-30,22,1,al*.9)}
if(bd.t<bd.dur){const p=G.player;this.glowAt(p.x,p.y-30,60,0xffe26e,.6)}}
for(const q of G.bolts){const k=q.t/.2;o.fillStyle(0xffe98a,.55*(1-k)).fillEllipse(q.x,q.y,100,48);const pts=q.pts.map(v=>({x:v[0],y:v[1]}));o.lineStyle(9,0xffffff,1-k).strokePoints(pts,false);o.lineStyle(4,0xffd84a,1-k).strokePoints(pts,false)}
if(G.worldFlash>0)this.screenG.fillStyle(0x6a6a78,Math.min(.55,G.worldFlash*1.6)).fillRect(-50,-50,W+100,H+100);
if(G.stopT>0)this.screenG.fillStyle(0x5a5a6e,.2*Math.min(1,G.stopT/.25)).fillRect(-50,-50,W+100,H+100);
if(G.worldClock>0)this.drawWorldClock();
}
drawWorldClock(){
const g=this.screenG,p=1-G.worldClock/WORLD_CLOCK,cx=W/2,cy=H/2,R=Math.min(W,H)*.46*(.82+.18*(1-Math.pow(1-Math.min(1,p/.2),3))),fade=Math.min(1,p/.12)*Math.min(1,(1-p)/.3),a=.34*fade;
g.lineStyle(7,0xf6f3ff,a).strokeCircle(cx,cy,R);g.lineStyle(2.5,0xf6f3ff,a).strokeCircle(cx,cy,R*.95);
for(let i=0;i<60;i++){const t=i/60*TAU,big=i%5===0,r0=R*(big?.87:.905),r1=R*.94;g.lineStyle(big?5:2,0xf6f3ff,a).lineBetween(cx+Math.cos(t)*r0,cy+Math.sin(t)*r0,cx+Math.cos(t)*r1,cy+Math.sin(t)*r1)}
const hand=(t,len,w)=>g.lineStyle(w,0xf6f3ff,a).lineBetween(cx-Math.cos(t)*len*.12,cy-Math.sin(t)*len*.12,cx+Math.cos(t)*len,cy+Math.sin(t)*len);
const sweep=1-Math.pow(1-Math.min(1,p/.7),3);hand(TAU*(10.2/12)-TAU/4,R*.42,10);hand(TAU*(2/60*5)-TAU/4+TAU*.02,R*.62,7);hand(TAU*sweep*2-TAU/4,R*.72,3);
const tp=Math.min(1,p/.14);this.worldTxt.setVisible(true).setFontSize(Math.round(Math.min(W,H)*.1)).setPosition(cx,H*.27).setScale(1.25-.25*tp).setAlpha(Math.min(1,p/.08)*Math.min(1,(1-p)/.3));
}
zap(g,x,y,r,n,a){const f=Math.floor(performance.now()/70),rn=i=>{const v=Math.sin(x*12.9+y*78.2+f*37.7+i*11.3)*43758.5;return v-Math.floor(v)};
for(let j=0;j<n;j++){const a0=rn(j*7+1)*TAU,pts=[];for(let i=0;i<5;i++){const an=a0+i*.3,rr=r*(.72+.42*rn(j*7+i+2));pts.push({x:x+Math.cos(an)*rr,y:y+Math.sin(an)*rr})}g.lineStyle(4.5,0xffffff,.95*a).strokePoints(pts,false);g.lineStyle(2,0xffc928,a).strokePoints(pts,false)}}
glowAt(x,y,r,c,a){if(a<=0)return;const g=this.glow;for(let i=4;i>=1;i--)g.fillStyle(c,Math.min(1,a)*.22*(5-i)/4).fillCircle(x,y,r*i/4)}
shadow(x,y,rx){this.shadowG.fillStyle(0x19371e,.36).fillEllipse(x,y,rx*2,rx*.72)}
pips(x,y,n,hp,gap,r){const g=this.over;for(let i=0;i<n;i++){g.fillStyle(i<hp?0xff5f7e:0xffffff,i<hp?1:.75).fillCircle(x+i*gap,y,r);g.lineStyle(2.5,0xffffff,1).strokeCircle(x+i*gap,y,r)}}
drawEnt(e,now){
const s=SPEC[e.type],art=s.art,hk=e.hit>0?Math.min(1,e.hit/.25):0,o=e.hit>0?1.12:1,hx=1+.22*hk,hy=1-.18*hk;
let im=null,flash=null;
const put=(key,x,y,sx,sy,rot,fi,red)=>{im=this.spr(key,x,y,sx*hx,sy*hy,rot,fi,e.y,1,red);if(hk>.45){flash=this.spr(key,x,y,sx*hx,sy*hy,rot,fi,e.y+.1,.55*(hk-.45)/.55,red);flash.setBlendMode(Phaser.BlendModes.ADD)}};
if(e.type==='blue'||e.type==='kblue'){const big=e.type==='kblue',an=animOf(e),yy=e.y+Math.sin(now*2.6+e.t)*2,fast=e.aggr&&!(e.cool>0),f=fsx(an),pa=popIn(e.born);
an.pt=(an.pt||0)+(clamp(an.vy/(Math.abs(an.vx)+90),-1,1)*.14-(an.pt||0))*Math.min(1,(FDT||.016)*4);const pitch=an.pt*Math.sign(f),st=fast?1.05:1,wig=Math.sin(now*(4+an.sp*.012+(fast?2.5:0))+SD(e)*3)*.05;
if(bakeFriend(this,'blue')){
const F=FSHEET.blue,kk=s.r/SPEC.blue.r,p=G.player;
if(an.sp>12)e._da=Math.atan2(an.vy/HK,an.vx);
const col=HERO_DIR[((Math.round((e._da!=null?e._da:(e.flip<0?Math.PI:0))/(Math.PI/4))%8)+8)%8][0];
let row=Math.sin(now*(4+an.sp*.012+(fast?2.5:0))+SD(e)*3)>=0?0:1;
if(fast)row=hyp(p.x-e.x,p.y-e.y)<110?3:2;
const tex=F.tex+(e.aggr?'_r':''),S=F.sc*kk*pa*o,fr=row*8+col;
im=this.sheetPut(tex,S,fr,e.x,yy,st*hx,hy/st,wig*.6,1,e.y);
if(hk>.45){flash=this.sheetPut(tex,S,fr,e.x,yy,st*hx,hy/st,wig*.6,.55*(hk-.45)/.55,e.y+.1);flash.setBlendMode(Phaser.BlendModes.ADD)}
return}
put(big?'blueB':'blue',e.x,yy,f*o*st*pa,o/st*pa,pitch+wig,now*(e.aggr?12:9)+SD(e),!!e.aggr);
if(e.aggr){const fl=e.flip,k=big?1.75:1;this.over.lineStyle(3.5*k,0x3a2b3a,1).lineBetween(e.x+fl*8*k,yy-14*k,e.x+fl*22*k,yy-9*k)}return}
if(e.type==='nutria'||e.type==='nboss'){
const big=e.type==='nboss',kk=s.r/30;
if(e.st==='crouch'){const c=Math.cos(e.la),sn=Math.sin(e.la),hw=26*kk,P=(a,b)=>({x:e.x+a*c-b*sn,y:e.y+a*sn+b*c}),pts=[P(0,-hw),P(249,-hw),P(249,hw),P(0,hw)];this.marks.fillStyle(0xff6f91,.3).fillPoints(pts,true);this.marks.lineStyle(3,0xff5f87,.9).strokePoints(pts,true)}
const an=animOf(e,true),pa=popIn(e.born),f=fsx(an);let ox=0,oy=0,rot=0,sx=1,sy=1;
if(e.st==='go'){const ph=an.ph*1.3;oy=-Math.abs(Math.sin(ph))*5+thop(an);rot=Math.sin(ph)*.06;sy=1-.07*(1-Math.abs(Math.sin(ph)));sx=2-sy}
else if(e.st==='chew'){const n=Math.sin(e.wig*2.4);oy=2+n*2;rot=n*.06;sy=1-.05*(.5+.5*n);sx=1+.03*(.5+.5*n)}
else if(e.st==='crouch'){const k=Math.min(1,(.55-e.t)/.2);ox=Math.sin(now*70)*1.6*k;sy=1-.18*k;sx=1+.16*k;oy=4*k;an.face=Math.cos(e.la)<0?1:-1}
else if(e.st==='lunge'){sx=1.22;sy=.84;rot=Math.sign(Math.cos(e.la))*.22}
this.shadow(e.x,e.y+26*kk,30*kk*(1-.15*Math.min(1,-oy/10)));
if(bakeFriend(this,'nutria')){
let ang=null,row=0;
if(e.st==='crouch'||e.st==='lunge')ang=Math.atan2(Math.sin(e.la)/HK,Math.cos(e.la));else if(e.st==='go'&&an.sp>15)ang=Math.atan2(an.vy/HK,an.vx);
if(ang!=null)e._da=ang;
const col=HERO_DIR[((Math.round((e._da!=null?e._da:Math.PI/2)/(Math.PI/4))%8)+8)%8][0];
if(e.st==='go')row=Math.sin(an.ph*1.3)>=0?0:1;else if(e.st==='chew')row=2;else if(e.st==='crouch')row=3;else if(e.st==='lunge')row=4;
const F={tex:FSHEET.nutria.tex+(e.aggr&&!big?'_r':''),sc:FSHEET.nutria.sc*kk*pa*o},fr=row*8+col,fy=e.y+26*kk+oy;
im=this.friendPut(F,fr,e.x+ox,fy,0,sx*hx,sy*hy,rot*.6,1,e.y);
if(hk>.45){flash=this.friendPut(F,fr,e.x+ox,fy,0,sx*hx,sy*hy,rot*.6,.55*(hk-.45)/.55,e.y+.1);flash.setBlendMode(Phaser.BlendModes.ADD)}
}else put(big?'nutriaB':'nutria',e.x+ox,e.y+oy,f*o*sx*pa,o*sy*pa,rot,e.st==='crouch'?0:now*(e.st==='chew'?5:10)+SD(e),!!e.aggr&&!big);
const n=e.maxHp||s.hp,gap=big?16:14;this.pips(e.x-gap*(n-1)/2,e.y-s.r-12,n,Math.ceil(e.hp),gap,big?6:5);return}
if(e.type==='vine'&&bakeFriend(this,'vine')){
const F=FSHEET.vine,sw=Math.sin(now*2.6+e.wob),pa=popIn(e.born),w=1+Math.sin(now*3+e.wob)*.03;let fr=sw>.45?1:sw<-.45?2:0;if(e.born<.3)fr=3;
const T={tex:F.tex,sc:F.sc*o*(e.born<.3?1:pa)},fy=e.y+s.r*.8;
im=this.friendPut(T,fr,e.x,fy,0,w*hx,(2-w)*hy,0,1,e.y);
if(hk>.45){flash=this.friendPut(T,fr,e.x,fy,0,w*hx,(2-w)*hy,0,.55*(hk-.45)/.55,e.y+.1);flash.setBlendMode(Phaser.BlendModes.ADD)}
return}
if(e.type==='vine'){const w=1+Math.sin(now*3+e.wob)*.05,pa=popIn(e.born);put('vine',e.x,e.y,w*o*pa,(2-w)*o*pa,Math.sin(now*2.6+e.wob)*.04,now*3+SD(e));return}
const boss=e.type==='boss',an=animOf(e),pa=popIn(e.born),K=boss?1:1/1.65;if(an.lastSt==='air'&&e.st==='wait')an.land=.2;an.lastSt=e.st;
let sx=1,sy=1,rot=0;
if(e.st==='wait'){const br=Math.sin(now*6+SD(e));sy=1+.035*br;sx=1-.02*br;if(e.t<.24){const k=1-e.t/.24;sy*=1-.2*k;sx*=1+.15*k}if(an.land>0){const k=an.land/.2;sy*=1-.22*k;sx*=1+.2*k}}
else{const k=1-Math.max(0,e.t)/(e.dur||.6),dx=Math.sign((e.tx||e.x)-(e.sx||e.x))||1;sy=1+.24*(1-k)-.06*k;sx=1-.14*(1-k)+.04*k;rot=dx*.38*(.5-k)*2*-1}
this.shadow(e.x,e.y+s.r*.7,s.r*.92*(1-.4*(e.z||0)/130));
if(bakeFriend(this,'frog')){
const F=FSHEET.frog,kk=s.r/SPEC.frog.r,p=G.player;let row=0,fx=sx,fy2=sy;
if(e.st==='air'){row=3;fx=fy2=1;e._da=Math.atan2(((e.ty||e.y)-(e.sy||e.y))/HK,(e.tx||e.x)-(e.sx||e.x))}
else{if(an.land>0)row=4;else if(e.t<.24)row=2;else{e._da=Math.atan2((p.y-e.y)/HK,p.x-e.x);row=Math.sin(now*1.7+SD(e)*5)>.7?1:0}}
const col=HERO_DIR[((Math.round((e._da!=null?e._da:Math.PI/2)/(Math.PI/4))%8)+8)%8][0];
const T={tex:F.tex,sc:F.sc*kk*pa*o},fr=row*8+col,fy=e.y+s.r*.7-(e.z||0);
im=this.friendPut(T,fr,e.x,fy,0,fx*hx,fy2*hy,0,1,e.y);
if(hk>.45){flash=this.friendPut(T,fr,e.x,fy,0,fx*hx,fy2*hy,0,.55*(hk-.45)/.55,e.y+.1);flash.setBlendMode(Phaser.BlendModes.ADD)}
}else put('frog',e.x,e.y-(e.z||0)+(1-sy)*s.r*.5,K*sx*o*pa,K*sy*o*pa,rot,e.st==='air'?1:now*3+SD(e));
if(s.hp>1){const n=Math.min(e.maxHp||s.hp,8),gap=boss?16:14;this.pips(e.x-gap*(n-1)/2,e.y-(e.z||0)-s.r-22,n,e.hp,gap,6)}
}
drawPlayer(now){
const p=G.player;heroStep(p,FDT);
this.shadow(p.x,p.y+30,20);
const thr=p.thrT>0?1-p.thrT/.3:-1,throwing=thr>=0&&!(p.stun>0);
if(throwing&&thr<.2)p.face=p.thrA;
const a=throwing?p.thrA:(p.face??Math.PI/2),oct=((Math.round(a/(Math.PI/4))%8)+8)%8,[col,mir]=HERO_DIR[oct],mv=p.mv||0,ph=p.ph||0,t=p.at||0;
const WALK_CAD=.76,walk=mv>.25;
if(walk&&!p._wk)p.ph=.05/WALK_CAD;p._wk=walk;
const STEP_HOLD=.614,u0=(p.ph||0)*WALK_CAD,hh=u0%Math.PI,half=Math.floor(u0/Math.PI)%2,S=Math.PI*STEP_HOLD,
u=half*Math.PI+(hh<S?hh/S*Math.PI/2:Math.PI/2+(hh-S)/(Math.PI-S)*Math.PI/2),q=Math.floor(u/(Math.PI/2))%4;
let row=walk?[1,5,2,6][q]:0;if(throwing)row=thr<.14?3:thr<.30?7:thr<.62?4:row;
const lift=walk?(1-Math.sin(2*u))/2:0;
let bob=walk?-lift*3.2:0,sy=walk?1+.02*(lift-.5):1+.012*Math.sin(t*2.2),sx=walk?1-.014*(lift-.5):1,rot=0,ox=0;
const dirS=Math.cos(a)>=0?1:-1;
if(throwing){if(thr<.14){const k=thr/.14;rot=-dirS*.07*k;sy*=1+.025*k}
else{const u=(thr-.14)/.86,f=Math.sin(Math.min(1,u*3)*Math.PI*.5)*(1-u)*(1-u);rot=dirS*.12*f;ox=dirS*7*f;sx*=1+.05*f;sy*=1-.04*f}}
if(p.stun>0)rot=Math.sin(t*22)*.09;
if(walk&&!(p.stun>0)&&!throwing){const sw=Math.sin(u);rot+=sw*.025+Math.cos(p.faceA??a)*.06*Math.min(1,mv)}
const hv=p._hv||(p._hv={col,row,mir,pc:col,pr:row,pm:mir,f:0,turn:0,q,dur:.14,bob:0});
if(hv.col!==col||hv.row!==row||hv.mir!==mir){const turned=hv.col!==col||hv.mir!==mir;if(hv.col!==col)hv.turn=1;hv.dur=throwing?.03:turned?.14:.06;hv.pc=hv.col;hv.pr=hv.row;hv.pm=hv.mir;hv.col=col;hv.row=row;hv.mir=mir;hv.f=1}
hv.f=Math.max(0,hv.f-(FDT||.016)/hv.dur);
hv.bob=(hv.bob||0)+(bob-(hv.bob||0))*Math.min(1,(FDT||.016)*24);bob=hv.bob;
hv.turn=Math.max(0,hv.turn-(FDT||.016)/.16);if(hv.turn>0){sx*=1-.06*hv.turn;sy*=1+.03*hv.turn}
if(walk&&q!==hv.q&&(q===0||q===2)&&!throwing){const wet=inPond(p.x,p.y+28,1.0);this.fxr.push({k:'step',wet,x:p.x+(q===0?-7:7),y:p.y+28,t:0,life:wet?.5:.4,d:[0,1,2].map(i=>({a:Math.PI+.4+i*.55+rnd(-.2,.2),v:rnd(12,26)}))})}
hv.q=q;
const sc=.375*1.15,y=p.y+30+bob*1.15,blink=p.inv>0&&Math.floor(p.inv*10)%2===0?.5:1;
const set=(s,c,r,m,al)=>s.setFrame(r*8+c).setPosition(p.x+ox,y).setRotation(rot).setScale(sc*sx*m,sc*sy).setAlpha(al*blink).setDepth(p.y);
set(this.hero.setVisible(true),col,row,mir,1);
if(hv.f>0)set(this.heroGhost.setVisible(true),hv.pc,hv.pr,hv.pm,hv.f*.85);else this.heroGhost.setVisible(false);
const spots=(G.fogT>0)?shadowSpots(p,p.flip||1):[];
this.heroClones.forEach((cl,i)=>{const s=spots[i];if(!s){cl.setVisible(false);this.cloneAt[i]=null;return}
const c=this.cloneAt[i]||(this.cloneAt[i]={x:s.x,y:s.y});const kk=Math.min(1,(FDT||.016)*12);c.x+=(s.x-c.x)*kk;c.y+=(s.y-c.y)*kk;
this.shadowG.fillStyle(0x7864be,.35*.42).fillEllipse(c.x,c.y+30,40,14);
cl.setVisible(true).setFrame(row*8+col).setPosition(c.x+ox,c.y+30+bob*1.15).setRotation(rot).setScale(sc*sx*mir,sc*sy).setAlpha(.5).setDepth(c.y-1)});
const o=this.over;
if(G.kbAim&&G.mode==='play'){const a2=kbAimA(p),ax=p.x+Math.cos(a2)*52,ay=p.y-4+Math.sin(a2)*40,c=Math.cos(a2),s=Math.sin(a2),P=(u,v)=>({x:ax+u*c-v*s,y:ay+u*s+v*c}),pts=[P(10,0),P(-6,-8),P(-3,0),P(-6,8)];o.fillStyle(p.aimLock!=null?0xff8fa8:0xffffff,p.aimLock!=null?1:.85).fillPoints(pts,true);o.lineStyle(2,0x3d5a4c,.5).strokePoints(pts,true)}
if(p.shell>0){o.fillStyle(0xbfe3fb,.25).fillCircle(p.x,p.y,50);o.lineStyle(4,0x8fc7f5,.9).strokeCircle(p.x,p.y,50)}
for(const [t,c,r] of [[p.spdT,0x50b9a8,44],[p.dmgT,0xff8fa8,50],[p.turtleT,0x8a9b58,57],[p.rageT,0xff5f6e,63]])if(t>0)o.lineStyle(4,c,.9).strokeCircle(p.x,p.y,r+Math.sin(now*8.3)*2);
if(p.bubbleT>0){const k=clamp(p.bubbleT/p.bubbleDur,0,1),r=56+Math.sin(now*16.7)*2,el=syn('bolt');o.fillStyle(el?0xffe26e:0xbfe3fb,.28+.2*k).fillCircle(p.x,p.y-2,r);o.lineStyle(5,el?0xf5b914:0x5aa9e6,.95).strokeCircle(p.x,p.y-2,r);o.fillStyle(0xffffff,.9).fillEllipse(p.x-22,p.y-26,18,12);if(el)this.zap(o,p.x,p.y-2,r,3,1)}
if(p.gusaT>0){const r=64+Math.sin(now*11)*3,bl=p.gusaT<1&&Math.floor(p.gusaT*8)%2===0?.45:1;o.fillStyle(0xffe28c,.3*bl).fillCircle(p.x,p.y-2,r);o.lineStyle(5,0xe5a51a,bl).strokeCircle(p.x,p.y-2,r);
o.fillStyle(0xe5a51a,bl);for(let i=0;i<12;i++){const a=i/12*TAU+now*1.1;o.fillTriangle(p.x+Math.cos(a-.12)*r,p.y-2+Math.sin(a-.12)*r,p.x+Math.cos(a)*(r+13),p.y-2+Math.sin(a)*(r+13),p.x+Math.cos(a+.12)*r,p.y-2+Math.sin(a+.12)*r)}}
}
drawNets(now){
const o=this.over;
for(const n of G.nets){
if(n.t<0)continue;const ca=n.clone?.55:1;
if(n.trap){this.drawTrap(o,n,now);continue}
if(!n.land){const P=t=>[n.x0+(n.x1-n.x0)*t,n.y0+(n.y1-n.y0)*t-Math.sin(t*Math.PI)*55],k=Math.min(1,n.t/n.dur),[x,y]=P(k),gc=n.fire?0xff8a3c:n.tide?0x7cc0f0:n.clone?0xb9a8ee:0xffffff;
if(QUAL){for(let i=1;i<=5;i++){const [tx,ty]=P(Math.max(0,k-i*.06));this.glowAt(tx,ty,16-i*2,gc,(.5-i*.08)*ca)}this.glowAt(x,y,30,gc,.45*ca)}
this.drawPod(o,x,y,k,now,ca,n.fire?0xffb36a:n.king?0xffd76a:null)}
else{const k=Math.max(0,n.land-(n.linger||0))/.3,r=n.r*(.6+.4*Math.min(1,n.land/.3*2.2)),al=(1-k)*ca*(n.linger&&n.land<n.linger?.8+.2*Math.sin(now*10):1),cx=n.x1,cy=n.y1;
const [fc,fa,sc]=n.fire?[0xff7832,.35,0xff7a32]:n.tide?[0x78bef5,.35,0x5aa9e6]:n.linger?[0x4fb9a8,.32,0x3b9587]:n.clone?[0xb9a8ee,.3,0x9d8ae0]:n.king?[0xffc93c,.4,0xffc93c]:[0xffffff,.3,0xffffff];
if(n.land<.16&&!n.tide){const e=n.land/.16;for(let i=0;i<6;i++){const t=i/6*TAU+.3,d=r*(.3+.9*e);o.fillStyle(0x9fd06a,(1-e)*ca).fillEllipse(cx+Math.cos(t)*d,cy+Math.sin(t)*d*.8,9*(1-e*.4),6*(1-e*.4))}}
o.fillStyle(fc,fa*al).fillCircle(cx,cy,r);o.lineStyle(5,sc,al).strokeCircle(cx,cy,r);
if(n.land<.12)o.fillStyle(0xffffff,(.45-n.land*3)*al).fillCircle(cx,cy,r);
o.lineStyle(2.5,sc,al);const rot=n.land*1.4;
for(let i=0;i<12;i++){const t=i/12*TAU+rot,q=i%3?.86:.96;o.lineBetween(cx+Math.cos(t)*r*.76,cy+Math.sin(t)*r*.76,cx+Math.cos(t)*r*q,cy+Math.sin(t)*r*q)}
o.lineStyle(2,sc,al);for(let i=-2;i<=2;i++){const d=i*r/2.6,h=Math.sqrt(Math.max(0,r*r-d*d));o.lineBetween(cx+d,cy-h,cx+d,cy+h);o.lineBetween(cx-h,cy+d,cx+h,cy+d)}}
}
}
drawTrap(o,n,now){
const L=n.linger||1,t=n.land,cx=n.x1,cy=n.y1,w=n.r*.95,h=n.r*1.15;
const drop=Math.min(1,t/.14),sink=Math.max(0,(t-L)/.3),al=1-sink;if(al<=0)return;
const since=n.snapN?t-n.snapAt:9,pop=since<.28?Math.sin(since/.28*Math.PI):0,closed=!!n.snapN;
if(since<.02&&n._snapSeen!==n.snapN){n._snapSeen=n.snapN;this.fxr.push({k:'ripple',x:cx,y:cy+6,r:n.r*.7,t:0,life:.6})}
const land=drop<1?0:Math.max(0,1-(t-.14)/.18),bounce=land*Math.sin((t-.14)/.18*Math.PI)*6;
const by=cy-(1-drop)*(1-drop)*90-bounce-pop*16+sink*16,jig=closed?0:Math.sin(now*7+cx)*1.6,sx=1+.12*pop,sy=1-.08*pop+.06*land;
const X=u=>cx+jig+u*sx,Y=v=>by+v*sy,INK=0x2b2416,BODY=0xd9b26a,DARK=0x8a5f2a,LIGHT=0xf2dca0;
o.fillStyle(0x1f2a24,.22*al*drop).fillEllipse(cx,cy+4,w*1.5,w*.42);
const body=[{x:X(-w*.62),y:Y(0)},{x:X(-w*.5),y:Y(-h*.7)},{x:X(-w*.32),y:Y(-h)},{x:X(w*.32),y:Y(-h)},{x:X(w*.5),y:Y(-h*.7)},{x:X(w*.62),y:Y(0)}];
o.fillStyle(INK,al).fillPoints(body.map((p,i)=>({x:p.x+(i<3?-3:3),y:p.y+(i===2||i===3?-3:i===0||i===5?3:0)})),true);
o.fillStyle(BODY,al).fillPoints(body,true);
o.lineStyle(2.4,DARK,.85*al);for(let i=1;i<=4;i++){const v=-h*i/5,k=.62-(.3*i/5);o.lineBetween(X(-w*k),Y(v),X(w*k),Y(v))}
for(let i=-2;i<=2;i++){o.lineBetween(X(w*.15*i*2.1),Y(0),X(w*.15*i*1.05),Y(-h))}
o.lineStyle(2,LIGHT,.6*al).lineBetween(X(-w*.42),Y(-h*.15),X(-w*.28),Y(-h*.85));
o.fillStyle(INK,al).fillEllipse(X(0),Y(-h),w*.74+6,h*.26+6);
if(!closed){o.fillStyle(0x3b2a14,al).fillEllipse(X(0),Y(-h),w*.74,h*.26);o.lineStyle(2,DARK,al);for(let i=0;i<6;i++){const a=i/6*TAU+now*.6;o.lineBetween(X(0),Y(-h),X(Math.cos(a)*w*.3),Y(-h+Math.sin(a)*h*.1))}}
else{o.fillStyle(LIGHT,al).fillEllipse(X(0),Y(-h),w*.74,h*.26);o.lineStyle(2.4,DARK,al);o.lineBetween(X(-w*.3),Y(-h),X(w*.3),Y(-h));o.lineBetween(X(0),Y(-h-h*.1),X(0),Y(-h+h*.1))}
if(since<.4){const k=since/.4,f=1-k;
if(k<.15)this.glowAt(cx,by-h*.5,n.r*1.2,0xffffff,.5*(1-k/.15));
o.fillStyle(0xbfe3fb,.55*f).fillEllipse(cx,by-h-30*k,w*(.5+.6*k),h*(.9+1.6*k));
for(let i=0;i<10;i++){const a=-Math.PI/2+(i/9-.5)*1.5,d=20+90*k,yy=by-h+Math.sin(a)*d-40*k+60*k*k;o.fillStyle(i%3?0xe6f7ff:0xffffff,f).fillCircle(cx+Math.cos(a)*d*.8,yy,5*f+2)}
o.lineStyle(3,0xffffff,.8*f).strokeEllipse(cx,cy+4,w*(1+1.4*k),w*.4*(1+1.4*k))}
}
drawSurge(o,q,k,now){
const e=1-(1-k)*(1-k),rr=q.r*(.3+.8*e),f=1-k,x=q.x,y=q.y,sq=.82;
o.fillStyle(0x4fa8f0,.12*f).fillEllipse(x,y,rr*2,rr*2*sq);
o.lineStyle(16*f+4,0x1f5f9e,.45*f).strokeEllipse(x,y,rr*2,rr*2*sq);
o.lineStyle(9*f+2,0x5cb2ee,.8*f).strokeEllipse(x,y,rr*1.92,rr*1.92*sq);
for(let i=0;i<40;i++){const a=i/40*TAU,w=1.02+.05*Math.sin(a*7+q.x*.03),s=(3.5+2.2*Math.sin(a*11+q.y*.05))*f+1.4;
o.fillStyle(0xffffff,.95*f).fillCircle(x+Math.cos(a)*rr*w,y+Math.sin(a)*rr*sq*w-3,s)}
for(let i=0;i<16;i++){const a=i/16*TAU+.3,d=rr*(1.08+.18*((i*7)%5)/5),h=Math.sin(k*Math.PI)*(14+(i%4)*6);
o.fillStyle(0xe6f7ff,.9*f).fillCircle(x+Math.cos(a)*d,y+Math.sin(a)*d*sq-h,2.6*f+1)}
}
drawPod(o,x,y,k,now,al,tint){
const r=10+k*3,a=now*9,c=Math.cos(a),s=Math.sin(a),P=(px,py)=>({x:x+px*c-py*s,y:y+px*s+py*c});
const bud=(w,h,sh)=>{const pts=[];for(let i=0;i<24;i++){const t=i/24*TAU,up=Math.max(0,Math.cos(t)),f=1-.6*up*up;pts.push(P(Math.sin(t)*w*f,-Math.cos(t)*h+sh))}return pts};
o.fillStyle(0x1f2a24,.18*al).fillEllipse(x,y+r*1.1,r*1.8,r*.6);
o.fillStyle(0x1f2a24,al).fillPoints(bud(r*.85+2.2,r*1.25+2.2,0),true);
o.fillStyle(tint||0xffb3cb,al).fillPoints(bud(r*.85,r*1.25,0),true);
o.fillStyle(tint?0xffffff:0xff8fb0,tint?.35*al:al).fillPoints(bud(r*.38,r*1.2,0),true);
const b1=P(-r*.45,r*.95),b2=P(r*.45,r*.95);o.fillStyle(0x7cb94f,al).fillEllipse(b1.x,b1.y,r*.7,r*.45).fillEllipse(b2.x,b2.y,r*.7,r*.45);
const h=P(-r*.32,-r*.25);o.fillStyle(0xffffff,.55*al).fillCircle(h.x,h.y,r*.18);
}
drawFloats(){
for(const f of G.floats){const k=f.t/(f.big?1.5:.95),t=this.texts.get();
t.setText(f.txt).setFontSize(f.big?34:26).setColor(f.col).setPosition(clamp(f.x,120,W-120),Math.max(100,f.y-k*40)).setAlpha(k>.7?(1-k)/.3:1).setScale(1)}
}
drawClear(){
const on=G.mode==='clear';this.clearT1.setVisible(on);this.clearT2.setVisible(on);this.clearBg.setVisible(on);if(!on)return;
const k=1-G.clearT/CLEAR_T,pop=Math.min(1,k/.18),sc=.6+.4*(1-Math.pow(1-pop,3))+Math.sin(Math.min(1,k/.3)*Math.PI)*.08,last=G.wave>=WAVES.length-1,a=Math.min(1,k/.12)*(k>.85?(1-k)/.15:1),m=Math.min(W,H);
this.clearBg.setSize(W,H).setAlpha(a);
this.clearT1.setText(last?'마지막 조사 완료!':(G.wave+1)+'차 조사 완료!').setFontSize(Math.round(m*.11)).setStroke('#ffffff',14).setShadow(0,4,INK,0,true,false).setPosition(W/2,H*.42).setScale(sc).setAlpha(a);
const k2=Math.min(1,Math.max(0,(k-.25)/.15));
this.clearT2.setText('스킬 포인트 +'+G.clearPts).setFontSize(Math.round(m*.05)).setStroke(INK,9).setPosition(W/2,H*.42+m*.1*sc).setScale(sc).setAlpha(a*k2);
}
drawPad(now){
if(!(G.mode==='play'||G.mode==='pause'))return;
const g=this.top,b=joyBase(),bx=b.x/S,by=b.y/S,R=b.R/S;
g.fillStyle(0xfffaeb,.45*.9).fillCircle(bx,by,R);g.lineStyle(3,0x1f2a24,.9).strokeCircle(bx,by,R);g.lineStyle(1.5,0x1f2a24,.25).strokeCircle(bx,by,R*.8);
const kx=bx+joy.dx*R*.62,ky=by+joy.dy*R*.62;g.fillStyle(0xef6f92,.9).fillCircle(kx,ky,R*.46);g.fillStyle(0xffb8cb,.9).fillCircle(kx-R*.1,ky-R*.12,R*.28);g.lineStyle(3,0x1f2a24,.9).strokeCircle(kx,ky,R*.46);
const rb=skillBase(),rx=rb.x/S,ry=rb.y/S,rr=rb.R/S,p=G.player,ready=p.skillN>0,al=ready?.97:.75;
if(ready&&QUAL)this.glowAt(rx,ry,rr*2,0x6fd0ff,.3+.1*Math.sin(now*4));
g.fillStyle(ready?0x8fd0ff:0xe9eedf,al).fillCircle(rx,ry,rr);g.lineStyle(3,0x1f2a24,al).strokeCircle(rx,ry,rr);
g.fillStyle(0xffffff,.35*al).fillCircle(rx,ry,rr*.55);g.lineStyle(rr*.11,0xffffff,al).strokeCircle(rx,ry,rr*.55);g.fillStyle(0xffffff,al).fillEllipse(rx-rr*.18,ry-rr*.22,rr*.28,rr*.2);
if(p.skillN<p.skillMax){g.fillStyle(0x3d5a4c,.3);g.slice(rx,ry,rr,-Math.PI/2,-Math.PI/2+TAU*clamp(p.skillLeft/p.skillCd,0,1),false);g.fillPath()}
if(L('fog')&&G.fogCd>0){g.lineStyle(5,0x8fb7cf,1);g.beginPath();g.arc(rx,ry,rr+7,-Math.PI/2,-Math.PI/2+TAU*(1-G.fogCd/6));g.strokePath()}
if(p.skillMax>1)for(let i=0;i<p.skillMax;i++)g.fillStyle(0xffffff,i<p.skillN?1:.4).fillCircle(rx-8+i*16,ry+rr*.72,4.5);
}
}
function ellipsePts(cx,cy,rx,ry,rot,n=28){const c=Math.cos(rot),s=Math.sin(rot),pts=[];for(let i=0;i<n;i++){const t=i/n*TAU,x=Math.cos(t)*rx,y=Math.sin(t)*ry;pts.push({x:cx+x*c-y*s,y:cy+x*s+y*c})}return pts}
