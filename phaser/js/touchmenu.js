/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
let FS_WANT=false;
{const _x=exitFs;exitFs=function(){FS_WANT=false;return _x.apply(this,arguments)}}
function pressEsc(){dispatchEvent(new KeyboardEvent('keydown',{code:'Escape',key:'Escape',bubbles:true,cancelable:true}))}
function wireFabs(){
const box=document.createElement('div');box.id='fabs';
box.innerHTML='<button id="fabFs" type="button" aria-label="전체화면 다시 켜기" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>전체화면</span></button>'+
'<button id="fabMenu" type="button" aria-label="메뉴 열기" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg><span>메뉴</span></button>';
document.body.appendChild(box);
const fs=$('#fabFs'),menu=$('#fabMenu');
[fs,menu].forEach(b=>{b.addEventListener('pointerdown',e=>e.stopPropagation());b.addEventListener('touchstart',e=>e.stopPropagation(),{passive:true})});
fs.onclick=e=>{e.stopPropagation();enterFs()};
menu.onclick=e=>{e.stopPropagation();audioOn();pressEsc();sync()};
const shown=s=>{const n=$(s);return !!n&&!n.hidden};
function sync(){
if(fsEl())FS_WANT=true;
const title=shown('#title'),pause=shown('#pause'),ask=shown('#goAsk'),play=shown('#hud');
const cur=SCR.find(s=>shown(s));
const menuOk=!title&&!pause&&!ask&&!play&&!shown('#tripMap')&&!shown('#story')&&
(shown('#stampNote')||cur==='#brk'||cur==='#result'||(cur==='#howto'&&HOW_FROM!=='menu'));
menu.hidden=!menuOk;
fs.hidden=!(fsOK&&FS_WANT&&!fsEl()&&!title);
box.classList.toggle('inPlay',play);
}
const mo=new MutationObserver(sync);
['#title','#pause','#goAsk','#hud','#story','#stampNote','#tripMap',...SCR].forEach(s=>{const n=$(s);if(n)mo.observe(n,{attributes:true,attributeFilter:['hidden']})});
document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);
sync();
}
