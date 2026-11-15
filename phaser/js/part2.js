/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const BOSS_EP=[
{place:'산 아래 습지',title:'거꾸로 쏟아지는 물길',sil:'블루길/거대_도약_물결없음'},
{place:'계곡',title:'계곡을 울리는 목소리',sil:'황소개구리/거대_분노'},
{place:'능선',title:'성곽 아래 땅굴',sil:'뉴트리아/거대_분노'},
{place:'치마바위',title:'바위를 삼킨 덩굴',sil:'가시박/거대_분노'},
];
function bossPreviewCard(box,i){
const e=BOSS_EP[i],t=NEXT_TEASE.boss[i];if(!e)return false;
box.classList.add('preview');
box.insertAdjacentHTML('beforeend','<p class="teaseNo">다음 · 인왕산</p><h3 class="pvTitle"><span>보스 '+(i+1)+' · '+e.place+'</span> · '+e.title+'</h3>'
+'<div class="silBox bossSil"><img class="sil" src="'+silUrl(e.sil)+'" alt=""></div><p class="pvName">???</p><p class="tip">'+(t?t[1]:'')+'</p>');
return true;
}
function bossKnownCard(box,i){
const e=BOSS_EP[i],B=BOSS[i];if(!e||!B)return false;
box.classList.add('preview');
box.insertAdjacentHTML('beforeend','<p class="teaseNo">보스 '+(i+1)+' · '+e.place+'</p><h3 class="pvTitle">'+e.title+'</h3>'
+'<div class="silBox bossSil known"><img class="bossPic" src="'+silUrl(e.sil)+'" alt="'+B.name+'"></div><p class="pvName">'+B.name+'</p><p class="tip">'+B.tip+'</p>');
return true;
}
{const _rn=renderNext;renderNext=function(o){if(o&&o.boss!==undefined){const box=$('#nextCard');box.textContent='';box.classList.remove('preview');
if(o.known||(G&&G.practice)?bossKnownCard(box,o.boss):bossPreviewCard(box,o.boss))return}return _rn(o)}}
const MTN_PTS=[[14,80],[36,62],[60,46],[80,28]],MTN_FOOT=[4,93],MTN_TOP=[93,12];
function showMountainWalk(i,done){
const box=$('#tripMap');box.hidden=false;box.className='mtn';
const all=[MTN_FOOT,...MTN_PTS,MTN_TOP],path='M'+all.map(([x,y])=>x*10+' '+y*5).join(' L');
const svg='<svg class="tmArt" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">'
+'<defs><linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#55607a"/><stop offset="1" stop-color="#8f9bb0"/></linearGradient></defs>'
+'<rect width="1000" height="500" fill="url(#mSky)"/>'
+'<g fill="#3f4656" opacity=".55"><ellipse cx="200" cy="60" rx="180" ry="34"/><ellipse cx="620" cy="40" rx="220" ry="30"/></g>'
+'<path d="M-20 520 L-20 430 C120 400 260 330 380 280 C500 220 640 160 760 110 C840 70 900 50 960 40 L1020 60 L1020 520Z" fill="#5f7d55" stroke="#1f2a24" stroke-width="6"/>'
+'<path d="M-20 520 L-20 470 C160 450 320 380 470 330 C620 270 760 220 1020 200 L1020 520Z" fill="#4c6b45"/>'
+'<ellipse cx="150" cy="430" rx="110" ry="26" fill="#6fa9b0" stroke="#1f2a24" stroke-width="5"/>'
+'<path d="M300 330 C330 350 350 300 390 320" fill="none" stroke="#9fd3dc" stroke-width="10" stroke-linecap="round"/>'
+'<path d="M520 250 h120 v-14 h-20 v-10 h-20 v10 h-20 v-10 h-20 v10 h-20 v-10 h-20z" fill="#cfc4ae" stroke="#1f2a24" stroke-width="4"/>'
+'<path d="M760 150 C790 90 860 80 880 140 Z" fill="#b8b3a6" stroke="#1f2a24" stroke-width="5"/>'
+'<path d="M770 140 C800 120 830 150 860 120" fill="none" stroke="#5f9a3e" stroke-width="6"/>'
+'<path d="'+path+'" fill="none" stroke="#1f2a24" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>'
+'<path d="'+path+'" fill="none" stroke="#e8d3a2" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>'
+'<path d="'+path+'" fill="none" stroke="#cdb47c" stroke-width="4" stroke-dasharray="4 16" stroke-linecap="round"/></svg>';
const pts=MTN_PTS.map(([x,y],k)=>'<div class="tmPt'+(k<i?' done':k===i?' next':'')+'" style="left:'+x+'%;top:'+y+'%"><b>'+(k<i?'✔':k+1)+'</b><span>'+BOSS_EP[k].place+'</span></div>').join('')
+'<div class="tmPt top" style="left:'+MTN_TOP[0]+'%;top:'+MTN_TOP[1]+'%"><b>?</b><span>정상</span></div>';
box.innerHTML='<div class="tmBox"><h2 class="tmHead">보스 '+(i+1)+' · '+BOSS_EP[i].place+'</h2><div class="tmMap">'+svg+pts+'<div class="tmHero"><img src="../images/주인공/표정_결심.png" alt=""></div></div><p class="tmTap">화면을 톡 하면 바로 출발</p></div>';
const hero=box.querySelector('.tmHero'),from=i===0?MTN_FOOT:MTN_PTS[i-1],to=MTN_PTS[i];
const place=([x,y])=>{hero.style.left=x+'%';hero.style.top=y+'%'};place(from);
epMusic('camp',4);
const WALK=1600;let t0=0,raf=0,fin=false,steps=0;
const finish=()=>{if(fin)return;fin=true;cancelAnimationFrame(raf);place(to);box.querySelector('.tmPt.next')?.classList.add('arrive');
beep(880,.1,'triangle',.06,1320);setTimeout(()=>{box.classList.add('out');setTimeout(()=>{box.hidden=true;box.innerHTML='';box.className='';box.onpointerdown=null;done()},380)},650)};
const tick=now=>{if(!t0)t0=now;const k=Math.min(1,(now-t0)/WALK),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
hero.style.left=(from[0]+(to[0]-from[0])*e)+'%';hero.style.top=(from[1]+(to[1]-from[1])*e)+'%';
hero.style.setProperty('--hop',Math.abs(Math.sin(k*Math.PI*6)));
const s=Math.floor(k*6);if(s>steps&&k<1){steps=s;beep(s%2?520:600,.04,'sine',.035)}
if(k<1)raf=requestAnimationFrame(tick);else finish()};
setTimeout(()=>{if(!fin)raf=requestAnimationFrame(tick)},450);
box.onpointerdown=e=>{e.preventDefault();finish()};
}
function startBossStory(i){
if(G&&G.practice){beginBoss(i);return}
showMountainWalk(i,()=>storyThen('boss'+(i+1)+'_pre',()=>beginBoss(i)));
}
function playFinale(done,from){const keys=['lab','farewell','ending','finale'];const go=k=>k>=keys.length?done():storyThen(keys[k],()=>go(k+1));go(Math.max(0,keys.indexOf(from)))}
function afterBoss(i,bp){
storyThen('boss'+(i+1)+'_post',()=>{
if(i>=BOSS.length-1){playFinale(finalResult);return}
award(bp);openTree({title:BOSS[i].name+' 격파! 스킬 포인트 +'+bp,next:{boss:i+1},respec:true,start:()=>startBossStory(i+1)});
});
}
