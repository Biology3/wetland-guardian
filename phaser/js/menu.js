/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
let HOW_FROM='story';
let STORY_SPEED=1;
const SPEEDS=[['느리게',1.6],['보통',1],['빠르게',.55]];
const SET={bgm:1,sfx:1,qual:1,speed:1};
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
function applySettings(){
muted=!SET.sfx;bgmOff=!SET.bgm;if(musG)musG.gain.value=bgmOff?0:.7;
if(QUAL!==SET.qual){QUAL=SET.qual;window.dispatchEvent(new Event('resize'))}
STORY_SPEED=(SPEEDS[SET.speed]||SPEEDS[1])[1];
const on=(id,v,a,b)=>{const e=$(id);if(e)e.textContent=v?a:b};
on('#setBgm',SET.bgm,'켜짐','꺼짐');on('#setSfx',SET.sfx,'켜짐','꺼짐');on('#setQual',SET.qual,'높게','줄이기');
$('#setSpeed').textContent=(SPEEDS[SET.speed]||SPEEDS[1])[0];
on('#btnBgm',!SET.bgm,'배경음 켜기','배경음 끄기');on('#btnMute',!SET.sfx,'효과음 켜기','효과음 끄기');on('#btnQual',SET.qual,'그래픽 효과 줄이기','그래픽 효과 높이기');
store.set('wg_settings',SET);
}
function saveProgress(k,i){if(G&&(G.practice||G.test))return;const old=store.get('wg_progress');const rank=x=>x?(x.k==='boss'?10:0)+x.i:-1;if(rank({k,i})>=rank(old))store.set('wg_progress',{k,i})}
const _beginWave=beginWave,_beginBoss=beginBoss;
beginWave=function(i){saveProgress('wave',i);return _beginWave(i)};
beginBoss=function(i){saveProgress('boss',i);return _beginBoss(i)};
function progressName(p){return p.k==='boss'?'보스 '+(p.i+1)+' · '+BOSS[p.i].name:(p.i+1)+'차 조사'}
function continueGame(){
const p=store.get('wg_progress');if(!p)return;const boss=p.k==='boss';
enterFs();audioOn();setMusic('calm');newGame();award(boss?DEV_PTS.boss[p.i]:DEV_PTS.wave[p.i]);startPlayScene();
const tree=()=>openTree({title:'이어하기 · '+progressName(p),next:boss?{boss:p.i}:{wave:p.i},respec:true,start:()=>boss?startBossStory(p.i):startWaveStory(p.i)});
if(boss&&p.i===0){epMusic('story',4);storyThen('part2_start',tree)}else tree();
}
const _finalResult=finalResult;
finalResult=function(){if(!(G&&(G.practice||G.test))){store.set('wg_cleared',1);store.set('wg_gallery',1)}return _finalResult()};
function galleryOpen(){return !!store.get('wg_gallery')}
if(store.get('wg_cleared')&&!galleryOpen())store.set('wg_gallery',1);
function titleFace(){return {1:'기본',2:'결심',3:'웃음'}[titleAct()]}
function titleAct(){const p=store.get('wg_progress'),inP2=p&&p.k==='boss';if(inP2&&p.i<BOSS.length-1)return 2;return store.get('wg_cleared')?3:inP2?2:1}
const TITLE_BG={1:'01_타이틀_본관_초여름',2:'04_습지_폭풍',3:'09_엔딩_본관_아침'};
const TITLE_SUB={1:'사라진 울음소리',2:'2부 · 인왕산을 오르다',3:'사라진 울음소리'};
function refreshTitle(){
const p=store.get('wg_progress'),b=$('#btnCont');if(!b)return;
b.disabled=!p;$('#contInfo').textContent=p?progressName(p):'기록 없음';$('#btnDelRec').hidden=!(p||store.get('wg_cleared'));
const h=$('#title .tHero'),src='../images/주인공/표정_'+titleFace()+'.png';if(h&&h.getAttribute('src')!==src)h.setAttribute('src',src);
const act=titleAct();document.documentElement.style.setProperty('--titleBg','url("'+new URL('../images/배경/'+TITLE_BG[act]+'.jpg',location.href).href+'")');
$('#title').classList.toggle('act2',act===2);const sub=$('#title .tSub');if(sub)sub.textContent=TITLE_SUB[act];
}
function howTab(t){document.querySelectorAll('.howTab').forEach(b=>b.classList.toggle('on',b.dataset.t===t));$('#howStory').hidden=t!=='story';$('#howGame').hidden=t!=='game'}
function friendMet(){const p=store.get('wg_progress');return !!((G&&G.ecoOpen)||store.get('wg_cleared')||(p&&(p.k==='boss'||p.i>=4)))}
function showHowto(from){
HOW_FROM=from;const menu=from==='menu';
$('#btnHow').textContent=menu?'돌아가기':'시작!';$('#howTitle').textContent=menu?'조작법':'습지를 지키는 법';
$('#howTabs').hidden=!menu;$('#howto').classList.toggle('menuBg',menu);howTab(menu?'story':'game');
showOnly('#howto');
}
const TEST_KEYS={
Digit1:[['pre',0],['post',0]],Digit2:[['pre',1],['post',1]],Digit3:[['pre',2],['post',2]],Digit4:[['pre',3],['post',3]],Digit5:[['pre',4],['post',4]],
Digit6:[['end',4],['bpost',0]],Digit7:[['bpre',1],['bpost',1]],Digit8:[['bpre',2],['bpost',2]],Digit9:[['bpre',3],['fin','boss4_post']],
Digit0:[['fin','lab'],['fin','farewell']],Minus:[['fin','ending'],['fin','finale']]};
function testJump(kind,w){
if(kind==='fin'){testFinale(w);return}
audioOn();setMusic('calm');showOnly(null);newGame();G.test=true;startPlayScene();
if(kind==='end'){award(DEV_PTS.wave[w]+3);G.wave=w;G.t=WAVE_LEN;G.mode='break';joinOtter();playStory('part1_end',()=>playStory('part2_start',()=>openTree({title:'인왕산 등반 준비 · 스킬 포인트 +3',next:{boss:0},respec:true,start:()=>startBossStory(0)})));return}
if(kind==='bpre'||kind==='bpost'){
award(DEV_PTS.boss[w]);G.wave=4;G.t=WAVE_LEN;G.stage='boss';G.bossIdx=w;G.mode='break';joinOtter();
if(kind==='bpre')openTree({title:w?BOSS[w-1].name+' 격파! 스킬 포인트 +'+BOSS_PTS[w-1]:'인왕산 등반 준비 · 스킬 포인트 +3',next:{boss:w},respec:true,start:()=>startBossStory(w)});
else afterBoss(w,BOSS_PTS[w]);
return}
if(kind!=='pre'){G.tally0={};G.tally={blue:12+w*2,frog:w>=1?6:0,nutria:w>=2?4:0,vine:w>=3?8:0,kblue:w>=1?1:0,boss:w>=2?1:0,nboss:w>=3?1:0};G.gauge=78-w*8}
if(kind==='post'&&w>=3)joinOtter();
if(kind==='post'){
award(DEV_PTS.wave[w]);G.wave=w;G.t=WAVE_LEN;G.clearPts=w===0?FIRST_WAVE_PTS:w<=1?1:2;G.mode='clear';finishWave();return}
if(w===0){playStory('day1_pre',()=>showHowto('story'));return}
if(w>=4)joinOtter();
award(DEV_PTS.wave[w]);G.wave=w-1;G.t=WAVE_LEN;G.mode='break';
startWaveStory(w);
}
function testFinale(from){audioOn();showOnly(null);newGame();G.test=true;startPlayScene();award(DEV_PTS.boss[3]);G.stage='boss';G.bossIdx=3;G.mode='break';joinOtter();
if(from==='boss4_post')playStory('boss4_post',()=>playFinale(finalResult));else playFinale(finalResult,from)}
addEventListener('keydown',e=>{
if($('#title').hidden||e.repeat||e.ctrlKey||e.altKey||e.metaKey||/INPUT|TEXTAREA/.test(document.activeElement&&document.activeElement.tagName))return;
const code=e.code.replace(/^Numpad(\d)$/,'Digit$1').replace('NumpadSubtract','Minus'),k=TEST_KEYS[code];if(!k)return;
e.preventDefault();const j=k[e.shiftKey?1:0];testJump(j[0],j[1]);
});
function wireMenu(){
document.querySelectorAll('.howTab').forEach(b=>b.onclick=()=>{howTab(b.dataset.t);beep(620,.05,'sine',.04)});
Object.assign(SET,store.get('wg_settings')||{});applySettings();
const startNew=()=>{const t=window.__game&&__game.scene.getScene('title');if(t&&t.go)t.go()};
$('#btnStart').onclick=()=>{const p=store.get('wg_progress');if(p&&(p.k==='boss'||p.i>0))askConfirm('<b>처음부터</b> 시작할까요?<br><small>이어하기 기록('+progressName(p)+')은 그대로 남아요</small>','처음부터','취소',startNew);else startNew()};
$('#btnCont').onclick=()=>{beep(520,.08,'sine',.05,780);continueGame()};
$('#btnHowMenu').onclick=()=>showHowto('menu');
$('#btnOpts').onclick=()=>{applySettings();showOnly('#opts')};
$('#btnCredits').onclick=()=>showOnly('#credits');
$('#btnOptsBack').onclick=$('#btnCredBack').onclick=()=>{showOnly('#title');refreshTitle()};
const flip=k=>()=>{audioOn();SET[k]=SET[k]?0:1;applySettings();beep(660,.06,'sine',.05)};
$('#setBgm').onclick=$('#btnBgm').onclick=flip('bgm');
$('#setSfx').onclick=$('#btnMute').onclick=flip('sfx');
$('#setQual').onclick=$('#btnQual').onclick=flip('qual');
$('#setSpeed').onclick=()=>{SET.speed=(SET.speed+1)%SPEEDS.length;applySettings();beep(660,.06,'sine',.05)};
$('#setFs').onclick=()=>fsEl()?exitFs():enterFs();
$('#btnDelRec').onclick=()=>{const p=store.get('wg_progress');askConfirm('<b>이어하기 기록</b>'+(p?'('+progressName(p)+')':'')+'을 지울까요?<br><small>지우면 처음부터 다시 시작해요</small>','지우기','취소',()=>{store.del('wg_progress');store.del('wg_story_seen');store.del('wg_cleared');refreshTitle();beep(330,.12,'sine',.06)})};
refreshTitle();
}
['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>{if(!$('#title').hidden&&!BGM.name){audioOn();setMusic('school')}},true));
let MENU_OPEN=false,MENU_BACK=null;
function openMenuPause(){MENU_BACK=SCR.find(s=>s!=='#pause'&&!$(s).hidden)||null;MENU_OPEN=true;document.body.classList.add('menuPause');$('#btnStorySkip').hidden=true;$('#pause h2').textContent='메뉴';$('#pause').hidden=false;beep(520,.06,'sine',.04)}
function closeMenuPause(){MENU_OPEN=false;document.body.classList.remove('menuPause');MENU_BACK=null;$('#pause').hidden=true;$('#pause h2').textContent='잠깐 쉬어요';beep(520,.06,'sine',.04)}
{const _gt=goTitle;goTitle=function(){MENU_OPEN=false;MENU_BACK=null;document.body.classList.remove('menuPause');$('#pause h2').textContent='잠깐 쉬어요';return _gt.apply(this,arguments)}}
addEventListener('keydown',e=>{
if(e.code!=='Escape'||e.repeat||STORY_NOW)return;
const stop=()=>{e.preventDefault();e.stopImmediatePropagation()};
if(!$('#goAsk').hidden){stop();$('#btnAskNo').click();return}
if(MENU_OPEN){stop();closeMenuPause();return}
if(G&&G.mode==='pause'&&!$('#pause').hidden){stop();$('#btnResume').click();return}
if(G&&G.mode==='play')return;
if(!$('#tripMap').hidden)return;
const cur=SCR.find(s=>!$(s).hidden);
if(cur==='#opts'){stop();$('#btnOptsBack').click();return}
if(cur==='#credits'){stop();$('#btnCredBack').click();return}
if(cur==='#dev'){stop();$('#btnDevBack').click();return}
if(cur==='#howto'&&HOW_FROM==='menu'){stop();$('#btnHow').click();return}
if(cur==='#title'||!G)return;
if(cur||!$('#stampNote').hidden){stop();openMenuPause()}
},true);
