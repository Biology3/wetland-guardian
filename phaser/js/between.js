/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const EP_TITLE=['물속의 파란 줄무늬','울음소리를 삼킨 것','무너지는 둑','습지를 덮는 덩굴','해 질 녘의 습격'];
const PREVIEW=[
{sil:['블루길/보통'],hint:'물가에서 무언가 첨벙거려요…'},
{sil:['황소개구리/보통'],hint:'양식장이 버린 개구리들…?'},
{sil:['뉴트리아/보통'],hint:'둑 아래 굴을 좋아하는 녀석…?'},
{sil:['가시박/작은_꼿꼿'],hint:'네 번째 아이는 씨앗…?'},
{sil:['블루길/보통','황소개구리/보통','뉴트리아/보통'],big:'뉴트리아/보통',hint:'해 질 무렵, 한꺼번에…?'},
];
const silUrl=n=>'../images/생물/'+n+'.png';
function waveCatch(){const t0=G.tally0||{},o={};for(const k in G.tally)o[k]=Math.max(0,(G.tally[k]||0)-(t0[k]||0));return o}
function waveKinds(i){const w=WAVES[i];if(!w)return[];const m={kblue:'blue',boss:'frog',nboss:'nutria'},s=new Set(Object.keys(w.sp));if(w.boss)s.add('frog');if(w.kblue)s.add('blue');if(w.rush)rushList(w.rush).forEach(g=>s.add(m[g.kind]||g.kind));if(w.rush&&w.rush.harass)s.add('blue');return ['blue','frog','nutria','vine'].filter(k=>s.has(k))}
const BOSS_OF={blue:'kblue',frog:'boss',nutria:'nboss'};
function waveBosses(i){const w=WAVES[i];if(!w)return[];const s=[];if(w.kblue)s.push('kblue');if(w.boss)s.push('boss');if(w.nboss)s.push('nboss');if(w.rush)rushList(w.rush).forEach(g=>{if(RUSH_BOSS[g.kind]&&!s.includes(g.kind))s.push(g.kind)});return s}
const CATCH_LIST=[['blue','블루길','마리'],['frog','황소개구리','마리'],['nutria','뉴트리아','마리'],['vine','가시박','포기']];
function sfxStamp(){
beep(120,.22,'sawtooth',.09,55);setTimeout(()=>beep(70,.28,'square',.06,40),30);setTimeout(()=>beep(900,.06,'triangle',.03,500),120)}
function showStamp(n,pts,done){
const met=waveKinds(n-1),c=waveCatch();
showOnly(null);epMusic('camp',n-1);
const box=$('#stampNote');box.hidden=false;box.className='';
const g=Math.round(G.gauge),[st,col]=stateOf(G.gauge);
box.innerHTML='<div class="snPaper"><div class="snRing"><i></i><i></i><i></i><i></i><i></i><i></i></div>'
+'<div class="snHead">조사 노트 · '+n+'차 조사<small>「'+EP_TITLE[n-1]+'」</small></div>'
+'<div class="snRow snCatch"><span class="snK">잡은 생물</span><div class="snList"></div></div>'
+'<div class="snRow"><span class="snK">남은 평형</span><div class="snGauge"><div class="snTrack"><div class="snFill" style="width:'+g+'%;background:'+col+'"></div></div><b>'+g+' · '+st+'</b></div></div>'
+'<div class="snRow"><span class="snK">스킬 포인트</span><b class="snPts">+'+pts+'</b></div>'
+'<div class="snStamp"><span>'+n+'차 조사<br>완료!</span></div>'
+'<button class="big snGo">'+(n>=EP_TITLE.length?'학교로 돌아가기 ▶':'스킬 고르러 가기 ▶')+'</button></div>';
const list=box.querySelector('.snList');
met.forEach(k=>{const it=CATCH_LIST.find(x=>x[0]===k),d=document.createElement('div');d.className='snChip';d.appendChild(card(k,120));const bk=BOSS_OF[k];d.insertAdjacentHTML('beforeend','<span>'+it[1]+'<b>'+Math.max(0,(c[k]||0)-(c[bk]||0))+it[2]+'</b></span>');list.appendChild(d)});
waveBosses(n-1).forEach(bk=>{const k=Object.keys(BOSS_OF).find(x=>BOSS_OF[x]===bk),d=document.createElement('div');d.className='snChip boss';d.appendChild(card(k,120));d.insertAdjacentHTML('beforeend','<em>대장</em><span>'+RUSH_BOSS[bk]+'<b>'+(c[bk]||0)+'마리</b></span>');list.appendChild(d)});
let ok=false;const go=()=>{if(!ok)return;ok=false;removeEventListener('keydown',key,true);box.classList.add('out');beep(660,.05,'sine',.04);setTimeout(()=>{box.hidden=true;box.innerHTML='';done()},260)};
const key=e=>{if(['Space','Enter','NumpadEnter'].includes(e.code)){e.preventDefault();e.stopPropagation();go()}};
box.querySelector('.snGo').onclick=go;addEventListener('keydown',key,true);
beep(520,.1,'sine',.04,700);
setTimeout(()=>{box.classList.add('stamped');sfxStamp()},750);
setTimeout(()=>{ok=true;box.classList.add('ready')},1250);
}
function previewCard(box,i){
const p=PREVIEW[i];if(!p)return false;
const sil=document.createElement('div');sil.className='silBox'+(p.big?' group':'');
if(p.big)sil.insertAdjacentHTML('beforeend','<img class="sil big" src="'+silUrl(p.big)+'" alt="">');
p.sil.forEach((s,k)=>sil.insertAdjacentHTML('beforeend','<img class="sil" style="--k:'+k+'" src="'+silUrl(s)+'" alt="">'));
box.classList.add('preview');
box.insertAdjacentHTML('beforeend','<p class="teaseNo">다음 조사</p><h3 class="pvTitle"><span>'+(i+1)+'차 조사</span> · '+EP_TITLE[i]+'</h3>');
box.appendChild(sil);
box.insertAdjacentHTML('beforeend','<p class="pvName">???</p><p class="tip">'+p.hint+'</p>');
return true;
}
const MAP_PTS=[[11,74],[30,46],[50,66],[70,38],[89,58]];
function showMapWalk(i,done){
const box=$('#tripMap');box.hidden=false;box.className='';
const path='M'+MAP_PTS.map(([x,y])=>x*10+' '+y*5).join(' L');
let svg='<svg class="tmArt" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">'
+'<defs><radialGradient id="tmW" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7fc6c9"/><stop offset="1" stop-color="#4f9ea8"/></radialGradient></defs>'
+'<rect width="1000" height="500" fill="#bfdc9a"/>'
+'<path d="M-20 140 C180 60 300 230 470 150 S760 40 1020 120 L1020 -20 L-20 -20Z" fill="#a8cf86"/>'
+'<ellipse cx="400" cy="210" rx="120" ry="52" fill="url(#tmW)" stroke="#1f2a24" stroke-width="6"/>'
+'<ellipse cx="770" cy="420" rx="150" ry="58" fill="url(#tmW)" stroke="#1f2a24" stroke-width="6"/>'
+'<ellipse cx="180" cy="440" rx="90" ry="34" fill="url(#tmW)" stroke="#1f2a24" stroke-width="6"/>'
+[[90,180],[250,300],[600,140],[560,460],[930,300],[860,140],[330,420]].map(([x,y])=>'<g stroke="#4c7a3a" stroke-width="5" stroke-linecap="round"><path d="M'+x+' '+y+'v-34M'+(x+10)+' '+y+'v-26M'+(x-10)+' '+y+'v-22"/></g>').join('')
+'<path d="'+path+'" fill="none" stroke="#1f2a24" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>'
+'<path d="'+path+'" fill="none" stroke="#e8d3a2" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>'
+'<path d="'+path+'" fill="none" stroke="#cdb47c" stroke-width="4" stroke-dasharray="4 18" stroke-linecap="round"/></svg>';
const pts=MAP_PTS.map(([x,y],k)=>'<div class="tmPt'+(k<i?' done':k===i?' next':'')+'" style="left:'+x+'%;top:'+y+'%"><b>'+(k<i?'✔':k+1)+'</b><span>'+(k+1)+'차</span></div>').join('');
box.innerHTML='<div class="tmBox"><h2 class="tmHead">'+(i+1)+'차 조사 · '+EP_TITLE[i]+'</h2><div class="tmMap">'+svg+pts+'<div class="tmHero"><img src="../images/주인공/표정_기본.png" alt=""></div></div><p class="tmTap">화면을 톡 하면 바로 출발</p></div>';
const hero=box.querySelector('.tmHero'),from=MAP_PTS[Math.max(0,i-1)],to=MAP_PTS[i];
const place=([x,y])=>{hero.style.left=x+'%';hero.style.top=y+'%'};place(from);
const WALK=1500;let t0=0,raf=0,fin=false,steps=0;
const finish=()=>{if(fin)return;fin=true;cancelAnimationFrame(raf);place(to);box.querySelector('.tmPt.next')?.classList.add('arrive');
beep(880,.1,'triangle',.06,1320);setTimeout(()=>{box.classList.add('out');setTimeout(()=>{box.hidden=true;box.innerHTML='';box.onpointerdown=null;done()},380)},650)};
const tick=now=>{if(!t0)t0=now;const k=Math.min(1,(now-t0)/WALK),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
hero.style.left=(from[0]+(to[0]-from[0])*e)+'%';hero.style.top=(from[1]+(to[1]-from[1])*e)+'%';
hero.style.setProperty('--hop',Math.abs(Math.sin(k*Math.PI*6)));
const s=Math.floor(k*6);if(s>steps&&k<1){steps=s;beep(s%2?520:600,.04,'sine',.035)}
if(k<1)raf=requestAnimationFrame(tick);else finish()};
setTimeout(()=>{if(!fin)raf=requestAnimationFrame(tick)},i===0?150:450);
box.onpointerdown=e=>{e.preventDefault();finish()};
}
function afterWave(i,pt,heal){showStamp(i,pt,()=>openTree({title:i+'차 조사 완료 · 스킬 포인트 +'+pt+(heal||''),next:{wave:i},respec:true,start:()=>nextEpisode(i,()=>showMapWalk(i,()=>startWaveStory(i)))}))}
function joinOtter(){if(G.ecoOpen)return;G.ecoOpen=true;G.ecoNew=true;G.friend='otter';G.lv.gear=Math.max(1,G.lv.gear||0);G.lv.buddy=Math.max(1,G.lv.buddy||0);applyStats()}
{const _bw=beginWave;beginWave=function(i){G.tally0=Object.assign({},G.tally);G.score0=G.score;if(i>=4||(i===3&&G.practice))joinOtter();return _bw(i)}}
{const _bb=beginBoss;beginBoss=function(i){G.score0=G.score;clearSkillFx();return _bb(i)}}
const RETRY_KEEP=.9;
function retryScore(){if(G.score0!=null){G.score=Math.round(G.score0*RETRY_KEEP);hudCache={}}}
const HELP={need:2,gaugeLoss:.5,dmg:2,hearts:3,score:.5};
const HELP_MSG={field:[{at:.6,face:'마스크_친절',t:'쌤이 도와줄게!\n힘내, 배희야!'}],boss:[{at:.6,face:'마스크_친절',t:'쌤이 도와줄게!\n힘내, 배희야!'}]};
const HELP_BG=['04','05','06','07'];
let FAIL={key:null,n:0,ok:false};
const stageKey=()=>G.stage==='boss'?'b'+G.bossIdx:'w'+G.wave;
function noteFail(){const k=stageKey();FAIL=FAIL.key===k?{key:k,n:FAIL.n+1,ok:FAIL.ok}:{key:k,n:1,ok:false};return FAIL.n>=HELP.need&&!FAIL.ok}
function helpOn(k){return FAIL.key===k&&FAIL.ok}
function offerHelp(kind,bg,retry){
setTimeout(()=>{if(!G||G.mode!=='over')return;showOnly(null);
helpScene(kind+'_ask',bg,close=>{
const what=kind==='boss'?'그물 힘 2배 · 하트 +3':'그물 힘 2배 · 평형 가득 · 줄어드는 양 절반',pick=f=>()=>{document.body.classList.remove('storyAsk');f()};
document.body.classList.add('storyAsk');
askConfirm('<b>진삼쌤의 도움</b>을 받을까?<br><small>'+what+' · 대신 이번 판 점수는 절반</small>','📻 쌤의 도움 받기','혼자 다시 도전',
pick(()=>{FAIL.ok=true;helpScene(kind,bg,retry)}),pick(()=>helpScene(kind+'_solo',bg,retry)))},true)},650);
}
function helpScene(kind,bg,then,hold){
const k='help_'+kind,src=STORY[k];if(!src){then(()=>{});return}
STORY._help=src.map((L,j)=>j===0?Object.assign({},L,{bg}):L);playStory('_help',then,hold);
}
{const _eg=endGame;endGame=function(w){const ask=!w&&G&&G.mode==='play'&&noteFail();const i=G.wave;const r=_eg(w);if(ask&&!G.practice)offerHelp('field','03',()=>retryWave(i));return r}}
{const _bf=bossFail;bossFail=function(){const ask=G&&G.mode==='play'&&noteFail();const i=G.bossIdx;const r=_bf();if(ask&&!G.practice)offerHelp('boss',HELP_BG[i]||'04',()=>retryBoss(i));return r}}
{const _bw=beginWave;beginWave=function(i){G.help=helpOn('w'+i);applyStats();const r=_bw(i);if(G.help){G.gauge=100;G.helpMsg=HELP_MSG.field;helpStart()}else G.helpMsg=null;return r}}
{const _bb=beginBoss;beginBoss=function(i){G.help=helpOn('b'+i);const r=_bb(i);if(G.help){G.helpMsg=HELP_MSG.boss;helpStart()}else G.helpMsg=null;return r}}
function helpStart(){updateHud(true);for(let k=0;k<3;k++)setTimeout(()=>beep(660+k*220,.12,'triangle',.06),k*120)}
{const _as=applyStats;applyStats=function(){_as();if(!G||!G.help)return;const p=G.player;p.dmg*=HELP.dmg;if(G.stage==='boss')p.maxHp+=HELP.hearts}}
function helpEnd(){
FAIL={key:null,n:0,ok:false};if(!G.help)return;
const gain=G.score-(G.score0||0);if(gain>0){const cut=Math.round(gain*(1-HELP.score));G.score-=cut;G.floats.push({x:W/2,y:H*.66-50,txt:'쌤의 도움 · 점수 절반 (-'+cut+')',col:'#cfe9ff',big:true,t:-.3})}
G.help=false;G.helpMsg=null;applyStats();hudCache={};
}
{const _ew=endWave;endWave=function(){const r=_ew();helpEnd();return r}}
{const _bw2=bossWin;bossWin=function(){const m=G&&G.mode;const r=_bw2();if(m==='play')helpEnd();return r}}
{const _ng=newGame;newGame=function(){FAIL={key:null,n:0,ok:false};return _ng()}}
