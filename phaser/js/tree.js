/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
let TCTX=null,selNode='power';
const branchPts=b=>b.nodes.reduce((a,n)=>a+L(n.id),0);
const boonOf=b=>b.nodes.find(n=>n.boon&&L(n.id));
function unlocked(n){if(n.b.key==='eco'){if(!G.ecoOpen)return false;if(FRIENDS.includes(n.id))return true}if(n.boon){const o=boonOf(n.b);if(o&&o!==n)return false}if(n.t===1)return true;const b=n.b,root=b.nodes[0];if(n.t===2)return L(root.id)>=1;return branchPts(b)>=CAP_NEED&&b.nodes.some(x=>x.t===2&&L(x.id)>=1)}
function canBuy(n){if(isSwitch(n))return true;return G.points>0&&L(n.id)<n.max&&unlocked(n)}
const canSpend=n=>!isSwitch(n)&&canBuy(n);
function buildName(){const tot=TREE.reduce((a,b)=>a+branchPts(b),0);if(!tot)return '';const top=[...TREE].sort((a,b)=>branchPts(b)-branchPts(a))[0];if(TREE.every(b=>branchPts(b)>=2)||branchPts(top)<tot*.5)return '균형 빌드';return top.name+' 빌드'}
function conn(n,flip){const xs=n===3?[20,60,100]:[30,90],a=flip?16:0,b=8,c=flip?0:16;return '<svg class="conn" viewBox="0 0 120 16" preserveAspectRatio="none"><path d="M60 '+a+'V'+b+'M'+xs[0]+' '+b+'H'+xs[xs.length-1]+xs.map(x=>'M'+x+' '+b+'V'+c).join('')+'" stroke="#cfdcc0" stroke-width="3" fill="none" vector-effect="non-scaling-stroke"/></svg>'}
const ecoHidden=n=>n.b.key==='eco'&&!G.ecoOpen;
const hideEco=s=>G.ecoOpen?s:String(s).replace(/수달|남생이|삵/g,'???');
function nodeHtml(n){if(ecoHidden(n))return '<button class="node locked hidden" data-id="'+n.id+'" aria-label="아직 몰라요"><span class="dot"><svg viewBox="0 0 48 48"></svg></span><span class="pips">'+'○'.repeat(n.max)+'</span><span class="nn">???</span></button>';
const l=L(n.id),cls=['node'];if(n.boon)cls.push('boon');if(!unlocked(n))cls.push('locked');if(l>=n.max)cls.push('max');if(selNode===n.id)cls.push('sel');if(FRIENDS.includes(n.id)&&G.ecoOpen)cls.push(G.friend===n.id?'buddy':'other');
return '<button class="'+cls.join(' ')+'" data-id="'+n.id+'" aria-label="'+n.n+' 단계 '+l+' / '+n.max+'"><span class="dot"><svg viewBox="0 0 48 48">'+n.i+'</svg></span><span class="pips">'+'●'.repeat(l)+'○'.repeat(n.max-l)+'</span><span class="nn">'+n.n+'</span></button>'}
let selSyn=null,synSeen={};
function renderTree(){
$('#tree').innerHTML=TREE.map(b=>{const t1=b.nodes[0],mid=b.nodes.filter(n=>n.t===2),t3=b.nodes.find(n=>n.t===3);const seal=b.key==='eco'&&!G.ecoOpen;if(seal)return secretBranch(b);return '<div class="branch'+(b.key==='eco'&&G.ecoNew?' isNew':'')+'" style="--c:'+b.col+'"><div class="bname">'+b.name+' '+branchPts(b)+(b.key==='eco'&&G.ecoNew?'<em class="newB">NEW</em>':'')+'</div><div class="tier">'+nodeHtml(t1)+'</div>'+conn(mid.length)+'<div class="tier">'+mid.map(nodeHtml).join('')+'</div>'+conn(mid.length,true)+'<div class="tier">'+nodeHtml(t3)+'</div>'+(seal?'<div class="sealTip">습지의 누군가를<br>만나면 열려요</div>':'')+'<button class="bReset" data-reset="'+b.key+'"'+(branchPts(b)>(b.key==='eco'&&G.ecoOpen?2:0)?'':' disabled')+'>리셋</button></div>'}).join('');
const sb=(q,inner)=>'<button class="syn'+(q.need()?' on':'')+(selSyn===q.id?' sel':'')+'" data-syn="'+q.id+'">'+inner+'</button>';
const ROWS=[['wideburst','tide','trap','cannon','mist','knot','ebb','shadow','bolt'],['neighbor','sprout','double','sanct','stalk','foodweb','sabang','guardian'],['master','proxy','fort','avengers','gusa']];
$('#synRow').innerHTML='<div class="synPanel"><div class="sbadge">융합 스킬</div>'+ROWS.map(row=>'<div class="sgrid2">'+row.map(id=>{const q=SYN.find(x=>x.id===id),l=q.need(),pop=l>(synSeen[id]||0);synSeen[id]=l;return '<button class="syn2'+(l?' on':'')+(l>1?' lv2':'')+(pop?' pop':'')+(selSyn===id?' sel':'')+'" data-syn="'+id+'">'+q.n+(l>1?'<sup>Ⅱ</sup>':'')+'</button>'}).join('')+'</div>').join('')+'</div>';
$('#pointsPill').textContent='스킬 포인트 '+G.points;
if(typeof TCTX!=='undefined'&&TCTX&&TCTX.title&&$('#brkTitle'))$('#brkTitle').textContent=TCTX.title.replace(/스킬 포인트 \+\d+/,'남은 스킬 포인트 '+G.points);
const bn=buildName();$('#buildName').textContent=bn?'현재: '+bn:'';
const info=$('#nodeInfo');
if(selSyn){const q=SYN.find(x=>x.id===selSyn),l=q.need();
const twoLv=()=>(l>=2?'<p class="cond">1단계: '+hideEco(q.lv[0])+'</p><p class="lvl cur">지금 (둘 다 Lv3): '+hideEco(q.lv[1])+'</p>'
:'<p'+(l===1?' class="lvl cur">지금: ':'>')+hideEco(q.lv[0])+'</p><p class="cond">둘 다 Lv3이면: '+hideEco(q.lv[1])+'</p>');
if(q.g){info.innerHTML='<h3>'+q.n+(l?' <small>발동 중'+(l>1?' Ⅱ':'')+'</small>':'')+'</h3><p class="cond">'+hideEco(NODE[q.a].n+' + '+NODE[q.b].n)+' Lv2</p>'+twoLv();return}
if(q.eco){info.innerHTML='<h3>'+q.n+(l?' <small>발동 중'+(l>1?' Ⅱ':'')+'</small>':'')+'</h3><p class="cond">'+hideEco(q.c)+'</p>'+twoLv();return}
info.innerHTML='<h3>'+q.n+(l?' <small>발동 중</small>':'')+'</h3><p class="cond">'+hideEco(q.c)+'</p><p>'+hideEco(q.d)+'</p>';return}
const n=NODE[selNode],l=L(n.id);
if(ecoHidden(n)){info.innerHTML='<h3>???</h3><p>아직 만나지 못했어요.</p><p class="lock">습지의 누군가를 만나면 열려요</p>';return}let cur=l?n.d(l):'아직 배우지 않았어요',nxt=l<n.max?n.d(l+1):'최고 단계예요';
if(FRIENDS.includes(n.id)&&G.ecoOpen){const bl=G.lv.buddy||1,me=G.friend===n.id;
info.innerHTML='<h3>'+n.n+' <small>'+(me?'함께하는 중 · Lv '+bl+'/'+n.max:'쉬는 중')+'</small></h3>'+(me?'<p>지금: '+n.d(bl)+'</p>'+(bl<n.max?'<p>다음: '+n.d(bl+1)+'</p>':''):'<p>함께하면: '+n.d(bl)+'</p>')+'<p class="cond">친구 단계는 다른 친구로 바꿔도 그대로예요</p>'
+'<button id="btnBuy"'+(canBuy(n)?'':' disabled')+'>'+(!me?'이 친구와 함께하기':bl>=n.max?'완료':G.points<=0?'포인트 없음':'친구 키우기')+'</button>';
$('#btnBuy').onclick=()=>{if(buyNode(n))renderTree()};return}
let why='';if(n.b.key==='eco'&&!G.ecoOpen)why='보호종 친구를 만나면 열려요';else if(!unlocked(n)){const o=n.boon&&boonOf(n.b);why=o&&o!==n?(n.b.key==='eco'?'친구는 한 명만 데려갈 수 있어요. 지금은 '+o.n+((o.n.charCodeAt(o.n.length-1)-44032)%28?'이에요':'예요'):'거품 은혜는 하나만 고를 수 있어요. 지금은 '+o.n+'이에요'):n.t===2?'위의 '+n.b.nodes[0].n+'을 먼저 배워야 해요':'이 가지에 '+CAP_NEED+'점을 쓰고 2단계를 배워야 열려요'}
info.innerHTML='<h3>'+n.n+' <small>Lv '+l+'/'+n.max+'</small></h3><p>지금: '+cur+'</p>'+(l<n.max?'<p>다음: '+nxt+'</p>':'')+(why?'<p class="lock">'+why+'</p>':'')+'<button id="btnBuy"'+(canBuy(n)?'':' disabled')+'>'+(l>=n.max?'완료':G.points<=0?'포인트 없음':'배우기')+'</button>'+(canBuy(n)?'<p class="holdTip">스킬을 꾹 눌러도 배워요</p>':'');
$('#btnBuy').onclick=()=>{if(buyNode(n))renderTree()};
}
$('#synRow').addEventListener('click',e=>{const b=e.target.closest('[data-syn]');if(!b)return;selSyn=selSyn===b.dataset.syn?null:b.dataset.syn;renderTree()});
$('#tree').addEventListener('pointerdown',e=>{const b=e.target.closest('.node');if(!b)return;e.preventDefault();const id=b.dataset.id;
hold={id,pid:e.pointerId,t0:performance.now(),x:e.clientX,y:e.clientY,done:false,nobuy:!canBuy(NODE[id])};requestAnimationFrame(holdTick)});
addEventListener('pointerup',endHold);addEventListener('pointercancel',e=>{if(hold&&e.pointerId===hold.pid){hold.cancel=true;endHold(e)}});
addEventListener('pointermove',e=>{if(hold&&e.pointerId===hold.pid&&Math.hypot(e.clientX-hold.x,e.clientY-hold.y)>40){hold.cancel=!hold.done;endHold(e)}});
$('#tree').addEventListener('contextmenu',e=>e.preventDefault());
$('#tree').addEventListener('click',e=>{const r=e.target.closest('[data-reset]');if(!r)return;const b=TREE.find(x=>x.key===r.dataset.reset);let back=0;
b.nodes.forEach(n=>{back+=L(n.id);delete G.lv[n.id]});if(b.key==='eco'){delete G.lv.buddy;if(G.ecoOpen){G.lv.gear=1;G.lv.buddy=1;back-=2}}if(back<=0)return;G.points+=back;applyStats();if(b.nodes.some(n=>n.id===selNode))selNode=b.nodes[0].id;selSyn=null;renderTree();beep(330,.12,'sine',.06)});
function tryGo(start,boss){
if(!(G.points>0&&TREE.flatMap(b=>b.nodes).some(canSpend))){start();return}
askConfirm('스킬 포인트가 <b>'+G.points+'개</b> 남았어요.<br>그래도 '+(boss?'도전할까요?':'출발할까요?'),boss?'그냥 도전':'그냥 출발','스킬 더 찍기',start);
}
function buyNode(n){
if(!canBuy(n))return false;
if(isSwitch(n)){G.friend=n.id;if(G.comp)G.comp.act=null;applyStats();audioOn();beep(700,.12,'triangle',.08,1050);return 'sw'}
if(FRIENDS.includes(n.id)){const before=synSum();G.lv.buddy=(G.lv.buddy||0)+1;G.points--;applyStats();audioOn();beep(780+G.lv.buddy*120,.12,'triangle',.08,1100);if(synSum()>before)setTimeout(()=>beep(1320,.2,'triangle',.09,1760),120);return true}const l=L(n.id),before=synSum();G.lv[n.id]=l+1;G.points--;applyStats();audioOn();beep(660+l*120,.12,'triangle',.08,990+l*120);
if(synSum()>before)setTimeout(()=>beep(1320,.2,'triangle',.09,1760),120);return true;
}
const HOLD_MS=550;let hold=null;
function holdTick(){
if(!hold)return;const el=document.querySelector('.node[data-id="'+hold.id+'"]');if(!el){hold=null;return}
if(hold.nobuy){requestAnimationFrame(holdTick);return}
const k=Math.max(0,Math.min(1,(performance.now()-hold.t0)/HOLD_MS));el.classList.add('holding');el.style.setProperty('--p',(k*100)+'%');
if(k>=1){const n=NODE[hold.id];selNode=hold.id;selSyn=null;
const r=buyNode(n);if(r){hold.done=true;renderTree();const ne=document.querySelector('.node[data-id="'+hold.id+'"]');if(ne){ne.classList.add('learned');ne.classList.add('holding');ne.style.setProperty('--p','0%')}hold.t0=performance.now()+280;if(r==='sw'||!canBuy(n))hold.nobuy=true}
else hold.nobuy=true}
requestAnimationFrame(holdTick);
}
function endHold(e){
if(!hold||(e&&e.pointerId!==hold.pid))return;const h=hold;hold=null;
document.querySelectorAll('.node.holding').forEach(x=>{x.classList.remove('holding');x.style.removeProperty('--p')});
if(!h.done&&!h.cancel){selNode=h.id;selSyn=null;renderTree()}
}
function openTree(o){
if(!G.ecoOpen&&(o.next.boss!==undefined||o.next.wave>=4))joinOtter();
TCTX=o;showOnly('#brk');$('#treeWrap').classList.remove('solo');$('#brkTitle').textContent=o.title;renderNext(o.next);
$('#btnRespec').hidden=!o.respec;const boss=o.next.boss!==undefined;$('#btnGo').textContent=boss?'도전!':'▶ '+(o.next.wave+1)+'차 조사 출발';$('#btnGo').classList.toggle('goTrip',!boss);
$('#btnGo').onclick=()=>tryGo(()=>{G.ecoNew=false;o.start()},boss);
const first=TREE.flatMap(b=>b.nodes).find(canSpend);if(first)selNode=first.id;selSyn=null;synSeen={};SYN.forEach(q=>synSeen[q.id]=q.need());renderTree();
}
const SECRET_ART=[
'<text x="50" y="66" text-anchor="middle" font-size="52" fill="#ffe7a3" font-family="Jua">?</text>',
'<ellipse cx="50" cy="60" rx="38" ry="14" fill="none" stroke="#9fe3f0" stroke-width="4"/><ellipse cx="50" cy="60" rx="24" ry="9" fill="none" stroke="#c8f1f8" stroke-width="4"/><ellipse cx="50" cy="60" rx="10" ry="4" fill="#e6fbff"/><circle cx="50" cy="38" r="4" fill="#c8f1f8"/>',
'<g fill="#c9a77a">'+[[30,74,-20],[46,56,-10],[60,40,-25],[72,22,-12]].map(([x,y,r])=>'<g transform="translate('+x+' '+y+') rotate('+r+')"><ellipse rx="6" ry="7.5"/><circle cx="-6" cy="-9" r="2.6"/><circle cx="-2" cy="-11.5" r="2.6"/><circle cx="2.5" cy="-11.5" r="2.6"/><circle cx="6.5" cy="-9" r="2.6"/></g>').join('')+'</g>',
'<ellipse cx="50" cy="74" rx="36" ry="10" fill="#4f9ea8"/><ellipse cx="50" cy="74" rx="22" ry="6" fill="none" stroke="#c8f1f8" stroke-width="3"/><path d="M38 74 C40 50 56 34 74 26 C64 40 56 56 54 74Z" fill="#8a5a33" stroke="#1f2a24" stroke-width="3.5" stroke-linejoin="round"/><g fill="#c8f1f8"><circle cx="30" cy="62" r="3"/><circle cx="70" cy="64" r="2.5"/><circle cx="24" cy="70" r="2"/></g>'];
function secretBranch(b){const n=Math.max(0,Math.min(3,(TCTX&&TCTX.next&&TCTX.next.wave)||0));
return '<div class="branch sealed secret" style="--c:'+b.col+'"><div class="bname">??? 🔒</div><div class="secretSlot" role="img" aria-label="잠긴 칸: 누군가 지켜보고 있어요"><svg class="secretArt h'+n+'" viewBox="0 0 100 100" aria-hidden="true">'+SECRET_ART[n]+'</svg><b>???</b><span>누군가<br>지켜보고 있어요</span></div></div>'}
function updateSkillStrip(){
const strip=$('#skillStrip'),items=TREE.flatMap(b=>b.nodes).filter(n=>L(n.id));strip.hidden=!items.length;
strip.innerHTML=items.map(n=>'<span title="'+n.n+'"><svg viewBox="0 0 48 48">'+n.i+'</svg>'+L(n.id)+'</span>').join('');
}
function wireTree(){
$('#btnRespec').onclick=()=>{G.lv=G.ecoOpen?{gear:1,buddy:1}:{};G.points=G.earned;applyStats();selNode='power';selSyn=null;renderTree();beep(330,.12,'sine',.06)};
}
