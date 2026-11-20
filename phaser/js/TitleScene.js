/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
function addHeroSheet(scene){
const T=scene.textures;if(T.exists('hero'))return;
const im=HERO_IMG_EL,FW=240,FH=440,COLS=8,W=im.naturalWidth,R=Math.floor(im.naturalHeight/FH),PER=Math.floor(4096/FH);
if(R<=PER){T.addSpriteSheet('hero',im,{frameWidth:FW,frameHeight:FH});return}
const parts=[];for(let r0=0;r0<R;r0+=PER){const n=Math.min(PER,R-r0),c=document.createElement('canvas');c.width=W;c.height=n*FH;c.getContext('2d').drawImage(im,0,r0*FH,W,n*FH,0,0,W,n*FH);parts.push([c,r0,n])}
const tex=T.create('hero',parts.map(p=>p[0]));
tex.add('__BASE',0,0,0,W,parts[0][0].height);
parts.forEach(([c,r0,n],si)=>{for(let r=0;r<n;r++)for(let k=0;k<COLS;k++)tex.add((r0+r)*COLS+k,si,k*FW,r*FH,FW,FH)});
}
class TitleScene extends Phaser.Scene{
constructor(){super('title')}
create(){
addHeroSheet(this);
G=null;$('#hud').hidden=true;$('#skillStrip').hidden=true;showOnly('#title');refreshTitle();
fitCamera(this);
this.bg=addWetland(this);
this.shadowG=this.add.graphics();
this.hero=this.add.sprite(0,0,'hero',0).setOrigin(.5,425/440);
this.layout();
this.started=false;
this.go=()=>{if(this.started||window.BOOTING)return;this.started=true;enterFs();audioOn();setMusic('school');beep(520,.08,'sine',.05,780);newGame();showOnly(null);playStory('prologue',()=>playStory('day1_pre',()=>showHowto('story')));this.scene.start('play')};
this.input.keyboard.on('keydown-ENTER',()=>{if(!$('#title').hidden)this.go()});
const onView=()=>{syncWetland(this,this.bg);this.layout()};
this.game.events.on('view-changed',onView);
this.events.once('shutdown',()=>this.game.events.off('view-changed',onView));
}
layout(){
const x=W*.3,y=H*.68,sc=.375*1.15;
this.shadowG.clear().fillStyle(0x19371e,.36).fillEllipse(x,y+30,40,14.4);
this.hero.setFrame(0).setPosition(x,y+30).setScale(sc);
}
update(time){const t=time/1000;this.hero.setScale(.375*1.15,.375*1.15*(1+.012*Math.sin(t*2.2)))}
}
