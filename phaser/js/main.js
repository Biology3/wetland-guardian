/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
function startGame(){
measureWorld();
const game=new Phaser.Game({
type:Phaser.WEBGL,canvas:cv,backgroundColor:'#8cc463',
width:Math.round(CSSW*DPR),height:Math.round(CSSH*DPR),
scale:{mode:Phaser.Scale.NONE,zoom:1/DPR},
audio:{noAudio:true},
input:{activePointers:4},disableContextMenu:true,
scene:[TitleScene,PlayScene]
});
let tm=null;
const onResize=()=>{clearTimeout(tm);tm=setTimeout(()=>{
measureWorld();
game.scale.resize(Math.round(CSSW*DPR),Math.round(CSSH*DPR));game.scale.setZoom(1/DPR);
const old=refreshWetland(game);game.events.emit('view-changed');
for(const k of [].concat(old||[]))if(game.textures.exists(k))game.textures.remove(k);
},120)};
window.addEventListener('resize',onResize);window.addEventListener('orientationchange',onResize);
window.__game=game;
startPrebake(game);
wireButtons();
}
const HERO_IMG_EL=new Image();
const OTTER_IMG_EL=new Image();if(typeof OTTER_SRC==='string')OTTER_IMG_EL.src=OTTER_SRC;
const TURTLE_IMG_EL=new Image();if(typeof TURTLE_SRC==='string')TURTLE_IMG_EL.src=TURTLE_SRC;
const CAT_IMG_EL=new Image();if(typeof CAT_SRC==='string')CAT_IMG_EL.src=CAT_SRC;
const NUTRIA_IMG_EL=new Image();if(typeof NUTRIA_SRC==='string')NUTRIA_IMG_EL.src=NUTRIA_SRC;
const FROG_IMG_EL=new Image();if(typeof FROG_SRC==='string')FROG_IMG_EL.src=FROG_SRC;
const BLUE_IMG_EL=new Image();if(typeof BLUE_SRC==='string')BLUE_IMG_EL.src=BLUE_SRC;
const VINE_IMG_EL=new Image();if(typeof VINE_SRC==='string')VINE_IMG_EL.src=VINE_SRC;
const HERON_IMG_EL=new Image();if(typeof HERON_SRC==='string')HERON_IMG_EL.src=HERON_SRC;
(function(){
let font=false,img=false,sky=false,done=false;const go=()=>{if(!done&&font&&img&&sky){done=true;startGame()}};
loadWetSky(()=>{sky=true;go()});
const fontOk=()=>{font=true;go()};
if(document.fonts&&document.fonts.load)document.fonts.load('40px Jua').then(fontOk,fontOk);else fontOk();
setTimeout(fontOk,2000);
HERO_IMG_EL.onload=()=>{img=true;go()};HERO_IMG_EL.src=HERO_SRC;
})();
