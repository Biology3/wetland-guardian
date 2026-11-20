/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const EC_WAVE=[
{art:['1차'] ,hero:'웃음',a:'#7cc98a',b:'#ff9fb6',bg:'#fff6e4'},
{art:['2차'],hero:'놀람',mob:'황소개구리/보통',a:'#7cc98a',b:'#ff9fb6',bg:'#fff6e4'},
{art:['3차_돌진'],artFb:'3차',hero:'결심' ,mob:'뉴트리아/보통',a:'#8ccf7e',b:'#ffb86b',bg:'#fff1d6'},
{art:['4차'],hero:'걱정',mob:'가시박/작은_꼿꼿',a:'#8ccf7e',b:'#ffb86b',bg:'#fff1d6'},
{art:['5차'], hero:'결심',pal:'달이/표정_단호',a:'#ff9d5c',b:'#b08be0',bg:'#ffe6cf'},
];
const EC_BOSS=[
{art:['보스1'],hero:'결심',pal:'달이/표정_경계',boss:'블루길/거대_돌진',a:'#3d5a9e',b:'#d8455f',bg:'#141a33',dark:true},
{art:['보스2'],hero:'놀람',pal:'남생이/표정_단호',boss:'황소개구리/거대_분노',a:'#3d7a6e',b:'#d8455f',bg:'#14262b',dark:true},
{art:['보스3_냄새'],artFb:'보스3',hero:'결심',pal:'삵/표정_경계',boss:'뉴트리아/거대_분노',a:'#8a6a4a',b:'#d8455f',bg:'#261c18',dark:true},
{art:['보스4'],hero:'결심',pal:'달이/표정_단호',boss:'가시박/거대_분노',a:'#4f8a3c',b:'#d8455f',bg:'#16261a',dark:true},
];
const ecArt=n=>'../images/아이캐치/'+n+'.png';
function ecPick(c){if(!c.art||!c.art.length)return null;if(!c._pick)c._pick=c.art[Math.floor(Math.random()*c.art.length)];return c._pick}
const NEXT_EP_ON=false;
const NEXT_EP={
1:[
{bg:'03_습지_맑은오후.jpg',face:'기본',t:'블루길은 잡았는데…\n습지가 왠지 너무 조용해.'},
{bg:'03_습지_늦은오후.jpg',sil:'황소개구리/보통',face:'놀람',t:'잠깐, 저 물가의 커다란 그림자는 뭐지?!'},
{bg:'03_습지_늦은오후.jpg',sil:'황소개구리/보통',zoom:true,face:'걱정',t:'사라진 개구리 울음소리…\n그 비밀을 밝혀낼 수 있을까?'},
{end:true,face:'결심',t:'습지 지킴이, 다음 조사도 출동!'},
],
};
const ecFace=f=>'../images/주인공/표정_'+f+'.png';
function ecInput(box,fn){
const key=e=>{if(['Space','Enter','NumpadEnter'].includes(e.code)){e.preventDefault();e.stopPropagation();fn()}};
const tap=e=>{e.preventDefault();fn()};
addEventListener('keydown',key,true);box.addEventListener('pointerdown',tap);
return ()=>{removeEventListener('keydown',key,true);box.removeEventListener('pointerdown',tap)};
}
function ecBox(id){let b=document.getElementById(id);if(!b){b=document.createElement('div');b.id=id;document.body.appendChild(b)}b.hidden=false;b.className='';return b}
function ecPreload(i,boss){const c=(boss?EC_BOSS:EC_WAVE)[i];if(!c||(G&&G.practice))return;c._pick=null;const art=ecPick(c);[art&&ecArt(art),c.artFb&&ecArt(c.artFb),ecFace(c.hero),c.pal&&'../images/'+c.pal+'.png',c.mob&&'../images/생물/'+c.mob+'.png',c.boss&&'../images/생물/'+c.boss+'.png'].forEach(u=>{if(u)new Image().src=u})}
function eyeCatch(i,done,boss){
const c=(boss?EC_BOSS:EC_WAVE)[i];
if(!c||(G&&G.practice)){done();return}
const box=ecBox('eyeCatch');if(c.dark)box.classList.add('dark');
box.style.setProperty('--a',c.a);box.style.setProperty('--b',c.b);box.style.setProperty('--bg',c.bg);
const no=c.label||(boss?'보스 '+(i+1)+(typeof BOSS_EP!=='undefined'&&BOSS_EP[i]?' · '+BOSS_EP[i].place:''):(i+1)+'차 조사');
const art=ecPick(c);c._pick=null;
const people=art?'<img class="ecArt" src="'+ecArt(art)+'" alt="">'
:'<img class="ecHero" src="'+ecFace(c.hero)+'" alt="">'+(c.pals||[]).map((p,k)=>'<img class="ecPal p'+(k+2)+'" src="../images/'+p+'.png" alt="">').reverse().join('')+(c.pal?'<img class="ecPal" src="../images/'+c.pal+'.png" alt="">':'')+(c.mob?'<img class="ecMob" src="../images/생물/'+c.mob+'.png" alt="">':'');
box.innerHTML='<div class="ecBand a"></div><div class="ecBand b"></div>'
+'<div class="ecBubbles">'+'<i></i>'.repeat(7)+'</div>'
+(c.boss?'<img class="ecBoss" src="../images/생물/'+c.boss+'.png" alt="">':'')
+people
+'<div class="ecLogo'+(c.mob||c.boss||c.pals||art?' up':'')+'"><small>'+(c.small||(boss?'2부 · 인왕산을 오르다':'배화여고 생태 미스터리'))+'</small><b>습지 지킴이</b><span class="ecNo">'+no+'</span></div>';
const artEl=box.querySelector('.ecArt');if(artEl)artEl.onerror=()=>{if(c.artFb&&!artEl.dataset.fb){artEl.dataset.fb=1;artEl.src=ecArt(c.artFb);return} artEl.remove();box.querySelector('.ecLogo').insertAdjacentHTML('beforebegin','<img class="ecHero" src="'+ecFace(c.hero)+'" alt="">'+(c.pal?'<img class="ecPal" src="../images/'+c.pal+'.png" alt="">':'')+(c.mob?'<img class="ecMob" src="../images/생물/'+c.mob+'.png" alt="">':''))};
if(c.dark){[196,233,294,392].forEach((f,k)=>setTimeout(()=>beep(f,.12,'sawtooth',.05,f*1.01),k*90));setTimeout(()=>beep(587,.3,'triangle',.06,554),400)}
else{[523,659,784,1047].forEach((f,k)=>setTimeout(()=>beep(f,.09,'triangle',.06,f*1.01),k*80));setTimeout(()=>beep(1568,.22,'sine',.05,1568),360)}
let fin=false,off=null;const end=()=>{if(fin)return;fin=true;off&&off();box.classList.add('out');setTimeout(()=>{box.hidden=true;box.innerHTML='';done()},300)};
setTimeout(()=>{if(!fin)off=ecInput(box,end)},400);
setTimeout(end,2100);
}
function nextEpisode(i,done){
const cuts=NEXT_EP_ON&&NEXT_EP[i];if(!cuts||(G&&G.practice)){done();return}
const box=ecBox('nextEp');
box.innerHTML='<div class="neStage"></div><div class="neTag">다음 회 예고</div>'
+'<div class="neSub"><i class="neFace"></i><p></p></div><button class="neSkip">건너뛰기 ▶</button>';
const stage=box.querySelector('.neStage'),sub=box.querySelector('.neSub'),face=box.querySelector('.neFace'),txt=sub.querySelector('p');
let k=-1,timer=0,fin=false,off=null;
const end=()=>{if(fin)return;fin=true;clearTimeout(timer);off&&off();box.classList.add('out');setTimeout(()=>{box.hidden=true;box.innerHTML='';done()},350)};
const show=()=>{
k++;clearTimeout(timer);if(k>=cuts.length){end();return}
const c=cuts[k];
const cut=document.createElement('div');cut.className='neCut'+(c.end?' end':'')+(c.zoom?' zoom':'');
if(c.end){const ep=(i+1)+'차 조사';cut.innerHTML='<div class="neEnd"><span>다음 화</span><em>'+ep+'</em><b>「'+EP_TITLE[i]+'」</b></div>'}
else{cut.style.backgroundImage='url("../images/배경/'+c.bg+'")';if(c.sil)cut.insertAdjacentHTML('beforeend','<img class="neSil" src="'+silUrl(c.sil)+'" alt="">')}
stage.querySelectorAll('.neCut').forEach(o=>{o.classList.add('gone');setTimeout(()=>o.remove(),400)});
stage.appendChild(cut);
face.style.backgroundImage='url("'+ecFace(c.face||'기본')+'")';txt.textContent=c.t;sub.classList.remove('on');void sub.offsetWidth;sub.classList.add('on');
beep(c.end?880:420,.08,'triangle',.05,c.end?1320:620);if(c.end)setTimeout(()=>beep(1320,.2,'sine',.05,1760),120);
timer=setTimeout(show,c.end?3200:2600);
};
box.querySelector('.neSkip').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();end()});
show();setTimeout(()=>{if(!fin)off=ecInput(box,show)},350);
}
