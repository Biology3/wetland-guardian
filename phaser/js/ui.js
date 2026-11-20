/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const SCR=['#title','#howto','#brk','#pause','#result','#dev','#opts','#credits'];
function showOnly(id){SCR.forEach(s=>$(s).hidden=s!==id)}
function fill(el,name,px=240){el.appendChild(card(name,px))}
function award(n){G.points+=n;G.earned+=n}
function newGame(){G=fresh();applyStats();seedNatives();hudCache={}}
const NEXT_TEASE={wave:[['물속의 파란 줄무늬','물가에서 무언가 첨벙거려요…'],['울음소리를 삼킨 것','갈대밭 너머에서 낮고 굵은 소리가 들려요…'],['무너지는 둑','둑 아래에서 흙이 부스스 떨어지고 있어요…'],['습지를 덮는 덩굴','가시 돋친 무언가가 습지로 뻗어 오고 있어요…'],['해 질 녘의 습격','해가 기울면… 무언가가 한꺼번에 몰려와요.']],
boss:[['산 아래 습지','물길이 거꾸로 솟구쳐요…'],['비 온 뒤 계곡','계곡 바위 위에서 커다란 그림자가 기다려요…'],['능선 성곽길','성곽 옆 흙길이 울렁거려요…'],['치마바위','바위를 휘감은 무언가가 꿈틀거려요…']]};
function teaseCard(box,small,title,line){box.insertAdjacentHTML('beforeend','<div class="tease"><span>?</span></div><p class="teaseNo">'+small+'</p><h3>'+title+'</h3><p class="tip">'+line+'</p>')}
function renderNext(o){
const box=$('#nextCard');box.textContent='';box.classList.remove('preview');
if(!o.known){
if(o.boss!==undefined){const t=NEXT_TEASE.boss[o.boss]||['???','무언가가 기다리고 있어요…'];teaseCard(box,'다음 · 인왕산',t[0],t[1]);return}
if(previewCard(box,o.wave))return;
const t=NEXT_TEASE.wave[o.wave]||['???','…'];teaseCard(box,'다음 · '+(o.wave+1)+'차 조사',t[0],t[1]);return}
if(o.boss!==undefined){const B=BOSS[o.boss];box.appendChild(card(B.art,300));box.insertAdjacentHTML('beforeend','<h3>'+B.name+'</h3><p class="tip">'+B.tip+'</p>');return}
const w=WAVES[o.wave];
if(w.intro==='all3'){
const row=document.createElement('div');row.className='imgs';['blue','frog','nutria'].forEach(n=>{const c=card(n,180);c.style.cssText='width:64px;height:64px;margin:0 -6px';row.appendChild(c)});box.appendChild(row);
box.insertAdjacentHTML('beforeend','<h3>세 생물이 함께</h3><p>들어온 순서대로 쌓여 세 생물이 한꺼번에 몰려와요.</p><p class="tip">마지막 공격에 대장 셋이 연달아 나타나요!</p>');
}else{
box.appendChild(card(w.intro,280));const f=FACT[w.intro];
box.insertAdjacentHTML('beforeend','<h3>'+SPEC[w.intro].name+'</h3><p>'+f.f+'</p><p class="tip">'+f.t+'</p>'+(w.kblue?'<p class="tip">몸집이 큰 대장 블루길도 나타나요!</p>':w.boss?'<p class="tip">몸집이 큰 대장 황소개구리도 나타나요!</p>':w.intro==='vine'?'<p class="tip">마지막 공격에 사방에서 가시박 얼굴 8개! 덩굴 속에서 대장 뉴트리아도 나타나요</p>':''));
}
}
function waveCard(title,i){
showOnly('#brk');renderNext({wave:i});$('#treeWrap').classList.add('solo');$('#brkTitle').textContent=title;$('#btnRespec').hidden=true;$('#btnGo').textContent='출발!';$('#btnGo').onclick=()=>beginWave(i);
}
function firstWaveScreen(){waveCard('1차 조사',0)}
function pauseGame(){if(G.mode!=='play')return;$('#warn').hidden=true;G.mode='pause';joy.id=null;joy.dx=joy.dy=0;$('#btnTrainSkill').hidden=!G.training;showOnly('#pause')}
function askConfirm(html,yes,no,fn,noFn){
$('#goAskTxt').innerHTML=html;$('#btnAskYes').textContent=yes;$('#btnAskNo').textContent=no;$('#goAsk').hidden=false;beep(520,.1,'triangle',.06,660);
$('#btnAskYes').onclick=()=>{$('#goAsk').hidden=true;fn()};$('#btnAskNo').onclick=()=>{$('#goAsk').hidden=true;if(noFn)noFn()};
}
function showResult(o){
$('#resCode').hidden=true;$('#btnShot').hidden=!o.shot;
showOnly('#result');$('#resTitle').textContent=o.title;$('#resLine').textContent=o.line;$('#lesson').textContent=o.lesson||'';$('#lesson').hidden=!o.lesson;
const st=$('#stars');st.hidden=o.stars===undefined;if(o.stars!==undefined)st.innerHTML=[0,1,2].map(i=>i<o.stars?'<i>★</i>':'★').join('');
const t=$('#tally');t.textContent='';t.hidden=!o.tally;
if(o.tally){const chip=(n,v)=>{const d=document.createElement('div');d.className='chip';d.appendChild(card(n,120));d.insertAdjacentHTML('beforeend','<span>'+v+'</span>');t.appendChild(d)};
const ks=o.kinds||['blue','nutria','frog','vine'],U={blue:'마리',nutria:'마리',frog:'마리',vine:'포기'};ks.forEach(k=>chip(k,G.tally[k]+U[k])); if(compType())chip(COMP_ART[compType()],'함께한 친구')}
const r=$('#btnRetry');r.hidden=!o.retry;if(o.retry){r.textContent=o.retryLabel;r.onclick=()=>{const q={'스킬 고르고 다시 도전':['스킬을 고르고 <b>다시 도전</b>할까요?<br><small>점수는 이 보스전을 시작할 때의 90%로 돌아가요</small>','다시 도전'],'이번 조사 다시 하기':['<b>이번 조사</b>를 처음부터 다시 할까요?<br><small>점수는 이 조사를 시작할 때의 90%로 돌아가요</small>','다시 하기']}[o.retryLabel]||[o.retryLabel+'?','네'];askConfirm(q[0],q[1],'취소',o.retry)}}
}
function endGame(win){
G.mode='over';$('#hud').hidden=true;$('#edge').style.boxShadow='none';setMusic('calm');
const i=G.wave;
showResult({title:'생태계 평형이 무너졌어요',line:(i+1)+'차 조사에서 멈췄어요. 점수 '+G.score+'점',tally:true,kinds:waveKinds(i),lesson:'교란 생물이 많아지면 습지가 스스로 회복하는 속도를 넘어서요. 그때 평형이 무너져요.',retryLabel:'이번 조사 다시 하기',
retry:()=>retryWave(i)});
beep(220,.3,'triangle',.09,130);
}
function retryWave(i){retryScore();G.gauge=Math.max(G.gauge,70);G.ents=[];G.cells.clear();G.plants=[];G.dying=[];beginWave(i)}
const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
const fsOK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
function enterFs(){const d=document.documentElement,r=d.requestFullscreen||d.webkitRequestFullscreen;if(!r||fsEl())return;try{const q=r.call(d,{navigationUI:'hide'});if(q&&q.catch)q.catch(()=>{})}catch(e){}}
function exitFs(){const x=document.exitFullscreen||document.webkitExitFullscreen;if(x&&fsEl())try{const q=x.call(document);if(q&&q.catch)q.catch(()=>{})}catch(e){}}
function syncFs(){document.querySelectorAll('.fsBtn').forEach(b=>{b.hidden=!fsOK;(b.querySelector('.fsLbl')||b).textContent=fsEl()?'전체화면 끝내기':'전체화면으로 보기'})}
document.addEventListener('fullscreenchange',syncFs);document.addEventListener('webkitfullscreenchange',syncFs);
function goTitle(){if(STORY_NOW)STORY_NOW.abort();$('#stampNote').hidden=true;$('#tripMap').hidden=true;newGame();$('#hud').hidden=true;setMusic('school');showOnly(null);if(window.__game){__game.scene.stop('play');__game.scene.start('title')}}
function wireButtons(){
$('#btnStart').onclick=()=>{const t=window.__game&&__game.scene.getScene('title');if(t&&t.go)t.go()};
$('#btnFs1').onclick=()=>fsEl()?exitFs():enterFs();
$('#btnDev').onclick=()=>{audioOn();openDev()};
$('#btnHow').onclick=()=>{if(HOW_FROM==='menu')showOnly('#title');else{showOnly(null);eyeCatch(0,()=>beginWave(0))}};
$('#btnPause').onclick=()=>pauseGame();
$('#btnResume').onclick=()=>{if(STORY_NOW&&STORY_NOW.paused){STORY_NOW.resume();return}if(typeof MENU_OPEN!=='undefined'&&MENU_OPEN){closeMenuPause();return}G.mode='play';showOnly(null)};
$('#btnStorySkip').onclick=()=>{if(STORY_NOW)STORY_NOW.skip()};
$('#btnMute').onclick=()=>{muted=!muted;$('#btnMute').textContent=muted?'효과음 켜기':'효과음 끄기'};
$('#btnBgm').onclick=()=>{bgmOff=!bgmOff;$('#btnBgm').textContent=bgmOff?'배경음 켜기':'배경음 끄기';audioOn();if(musG)musG.gain.value=bgmOff?0:.7};
$('#btnQual').onclick=()=>{QUAL=QUAL?0:1;$('#btnQual').textContent=QUAL?'그래픽 효과 줄이기':'그래픽 효과 높이기';window.dispatchEvent(new Event('resize'))};
$('#btnHome').onclick=()=>askConfirm('<b>처음 화면</b>으로 갈까요?<br><small>지금 하던 게임은 사라져요</small>','처음으로','취소',goTitle);
$('#btnAgain').onclick=()=>askConfirm('<b>처음 화면</b>으로 갈까요?','처음으로','취소',goTitle);
$('#btnFs2').onclick=()=>fsEl()?exitFs():enterFs();
wireTree();wireStages();wireMenu();syncFs();wireFabs();
}
