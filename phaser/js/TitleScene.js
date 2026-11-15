/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
class TitleScene extends Phaser.Scene{
constructor(){super('title')}
create(){
if(!this.textures.exists('hero'))this.textures.addSpriteSheet('hero',HERO_IMG_EL,{frameWidth:240,frameHeight:440});
G=null;$('#hud').hidden=true;$('#skillStrip').hidden=true;showOnly('#title');refreshTitle();
fitCamera(this);
this.bg=addWetland(this);
this.shadowG=this.add.graphics();
this.hero=this.add.sprite(0,0,'hero',0).setOrigin(.5,425/440);
this.layout();
this.started=false;
this.go=()=>{if(this.started)return;this.started=true;enterFs();audioOn();setMusic('school');beep(520,.08,'sine',.05,780);newGame();showOnly(null);playStory('prologue',()=>playStory('day1_pre',()=>showHowto('story')));this.scene.start('play')};
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
