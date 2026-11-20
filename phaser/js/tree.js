/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
let TCTX=null,selNode='wide';
const own=n=>L(n.id)>0;
const buddyLv=()=>G.lv.buddy||0;
const upperNodes=b=>b.nodes.filter(n=>n.kind!=='trunk');
const upperPts=b=>upperNodes(b).reduce((a,n)=>a+(own(n)?n.c:0),0);
function resetLabel(b){if(b.key==='eco')return '리셋';const u=upperPts(b);return u>0?'갈래 리셋 +'+u:branchPts(b)>0?'기본 리셋 +'+branchPts(b):'리셋'}
function branchPts(b){if(b.key!=='eco')return b.nodes.reduce((a,n)=>a+(own(n)?n.c:0),0);
const p=b.paths[0].nodes;return (buddyLv()>=2?p[1].c:0)+(buddyLv()>=3?p[2].c:0)+b.ults.reduce((a,n)=>a+(own(n)?n.c:0),0)}
const pathOf=b=>b.key==='eco'?b.paths.find(p=>p.key===G.friend):b.paths.find(p=>p.nodes.some(own));
function unlocked(n){const b=n.b;
if(b.key==='eco'){if(!G.ecoOpen)return false;if(n.kind!=='ult')return true;return buddyLv()>=3&&!b.ults.some(u=>u!==n&&own(u))}
if(n.kind==='trunk')return true;
const cur=pathOf(b);
if(n.kind==='path')return (!cur||cur===n.path)&&(n.k===0?b.trunk.every(own):own(n.path.nodes[n.k-1]));
return !!cur&&own(cur.nodes[cur.nodes.length-1])&&!b.ults.some(u=>u!==n&&own(u))}
function canBuy(n){if(isSwitch(n))return true;if(own(n)||!unlocked(n)||G.points<n.c)return false;if(n.fr)return n.fr[1]===buddyLv()+1;return true}
const canSpend=n=>!isSwitch(n)&&canBuy(n);
function buildName(){const tot=TREE.reduce((a,b)=>a+branchPts(b),0);if(!tot)return '';const top=[...TREE].sort((a,b)=>branchPts(b)-branchPts(a))[0];
const pa=pathOf(top),u=top.ults.find(own);if(branchPts(top)<tot*.4)return '균형 빌드';return (u?u.n:pa&&top.key!=='eco'?pa.name+' '+top.name:top.name)+' 빌드'}
function conn(n,flip){const xs=n===3?[20,60,100]:n===2?[36,84]:[60],a=flip?16:0,b=8,c=flip?0:16;return '<svg class="conn" viewBox="0 0 120 16" preserveAspectRatio="none"><path d="M60 '+a+'V'+b+'M'+xs[0]+' '+b+'H'+xs[xs.length-1]+xs.map(x=>'M'+x+' '+b+'V'+c).join('')+'" stroke="#cfdcc0" stroke-width="3" fill="none" vector-effect="non-scaling-stroke"/></svg>'}
const ecoHidden=n=>n.b.key==='eco'&&!G.ecoOpen;
function nodeHtml(n){
const l=own(n),cls=['node',n.kind,'k'+n.k];if(n.b.key==='eco')cls.push('eco2');if(!l&&!unlocked(n))cls.push('locked');if(l)cls.push('max');else if(canSpend(n))cls.push('can');if(selNode===n.id)cls.push('sel');
if(n.fr&&G.ecoOpen&&G.friend!==n.fr[0]){cls.push('other');if(n.fr[1]<=buddyLv())cls.push('rest')}
return '<button class="'+cls.join(' ')+'" data-id="'+n.id+'" aria-label="'+n.n+(l?' 배움':' · 필요한 포인트 '+n.c)+'"><span class="dot"><svg viewBox="0 0 48 48">'+n.i+'</svg>'+(!l&&n.c>=2?'<i class="cost">'+n.c+'</i>':'')+'</span><span class="nn">'+(n.b.key==='eco'?n.n.replace(' ','<br>'):n.n)+'</span></button>'}
function renderTree(){
$('#tree').innerHTML=TREE.map(b=>{if(b.key==='eco'&&!G.ecoOpen)return secretBranch(b);
const cur=pathOf(b),eco=b.key==='eco',isNew=eco&&G.ecoNew,tn=b.trunk.filter(own).length,tDone=tn===b.trunk.length,uOpen=b.ults.some(u=>own(u)||unlocked(u));
return '<div class="branch'+(isNew?' isNew':'')+'" style="--c:'+b.col+'"><div class="bname">'+b.name+' <b>'+branchPts(b)+'</b>'+(isNew?'<em class="newB">NEW</em>':'')+'</div>'
+(eco?'<div class="tier trunk one">'+b.trunk.map(nodeHtml).join('')+'</div><div class="fork'+(tDone?' on':'')+'">'+conn(3)+'</div>'
:'<div class="tgroup'+(tDone?' done':'')+'"><div class="tcap">기본 '+(tDone?'✔':tn+'/'+b.trunk.length)+'</div><div class="tier trunk">'+b.trunk.map(nodeHtml).join('')+'</div></div>'
+(tDone?'<div class="fork on tfork">'+conn(3)+'</div>':'<div class="gate">🔒 <span>기본 3개를 배우면 열려요</span></div>'))
+'<div class="paths'+(tDone||eco?'':' wait')+'">'+b.paths.map(p=>'<div class="pcol'+(cur===p?' on':cur&&!eco?' off':'')+'" style="--f:'+(eco?(cur===p?(buddyLv()-1)*50:0):Math.max(0,(p.nodes.filter(own).length-1)*50))+'%"><div class="pname">'+p.name+'</div>'+p.nodes.map(nodeHtml).join('')+'</div>').join('')+'</div>'
+'<div class="fork'+(uOpen?' on':'')+(tDone||eco?'':' wait')+'">'+conn(3,true)+'</div><div class="tier ults'+(tDone||eco?'':' wait')+'">'+b.ults.map(nodeHtml).join('')+'</div>'
+'<button class="bReset'+(b.key!=='eco'&&upperPts(b)===0&&branchPts(b)>0?' bReset2':'')+'" data-reset="'+b.key+'"'+(branchPts(b)>0?'':' disabled')+'>'+resetLabel(b)+'</button></div>'}).join('');
$('#pointsPill').textContent='스킬 포인트 '+G.points;
if(typeof TCTX!=='undefined'&&TCTX&&TCTX.title&&$('#brkTitle'))$('#brkTitle').textContent=TCTX.title.replace(/스킬 포인트 \+\d+/,'남은 스킬 포인트 '+G.points);
const bn=buildName();$('#buildName').textContent=bn?'현재: '+bn:'';
renderInfo();sizeInfo();
}
function sizeInfo(){
const info=$('#nodeInfo');if(!info||!info.offsetParent)return;
const key=innerWidth+'x'+innerHeight;if(info._key!==key){info._key=key;info._mx=0}
const keep=selNode;info.style.minHeight='';let mx=info._mx||0;
for(const id in NODE){selNode=id;renderInfo();mx=Math.max(mx,info.offsetHeight)}
selNode=keep;renderInfo();info._mx=mx;info.style.minHeight=mx+'px';
}
const nowOnly=d=>d.replace(/[+\-]?\d[\d.]*\s*(초|%|배)?\s*→\s*/g,'');
const descHtml=d0=>{const d=nowOnly(d0);let o='',dep=0;for(let i=0;i<d.length;i++){const c=d[i];if(c===' '&&d[i+1]==='('&&dep===0){o+='<br>';continue}if(c==='(')dep++;else if(c===')')dep=Math.max(0,dep-1);if(c===','&&d[i+1]===' '&&dep===0){o+='<br>';i++;continue}if(c===' '&&d[i+1]==='·'&&d[i+2]===' '&&dep===0){o+='<br>';i+=2;continue} o+=c}return o};
function renderInfo(){
const info=$('#nodeInfo'),n=NODE[selNode]||TREE[0].trunk[0],l=own(n),b=n.b;
if(ecoHidden(n)){info.innerHTML='<h3>???</h3><p>아직 만나지 못했어요.</p><p class="lock">습지의 누군가를 만나면 열려요</p>';return}
const kind=n.kind==='ult'?'최종기':n.kind==='trunk'?'기본':(b.key==='eco'?n.path.name+' '+n.fr[1]+'단계':n.path.name+' 갈래');
const head='<h3>'+n.n+'</h3>';
if(n.id==='gear'&&G.trainTree&&G.ecoOpen){const on=!!G.friend;info.innerHTML=head+'<p class="desc">'+descHtml(n.d)+'</p><p class="cond">전투 트레이닝에서만 친구를 뺄 수 있어요 · 지금: '+(on?'함께해요':'혼자 연습')+'</p><button id="btnBuy">'+(on?'친구 빼고 혼자 연습':'다시 함께하기')+'</button>';
$('#btnBuy').onclick=()=>{if(G.friend){G.friendOff=G.friend;G.friend=null;G.comp=null}else G.friend=G.friendOff||'otter';applyStats();renderTree();beep(520,.1,'triangle',.06)};return}
if(n.fr){const me=G.friend===n.fr[0],has=n.fr[1]<=buddyLv();
info.innerHTML=head+'<p class="desc">'+descHtml(n.d)+'</p><p class="cond">'+(me?(l?'함께하는 중이에요':'필요한 포인트 '+n.c):(has?'지금은 쉬는 중 · 함께하면 바로 써요':'친구 '+n.fr[1]+'단계에서 열려요'))+' · 친구 단계는 친구를 바꿔도 그대로예요</p>'
+(me&&!l&&n.fr[1]>buddyLv()+1?'<p class="lock">앞 단계를 먼저 키워야 해요</p>':me&&!l&&G.points<n.c?'<p class="lock">포인트가 '+n.c+'점 필요해요</p>':'')
+'<button id="btnBuy"'+(canBuy(n)?'':' disabled')+'>'+(!me?n.path.name+'와 함께하기':l?'배웠어요':'친구 키우기 ('+n.c+'점)')+'</button>';
$('#btnBuy').onclick=()=>{if(buyNode(n))renderTree()};return}
let why='';
if(!l&&!unlocked(n)){const cur=pathOf(b),ou=b.ults.find(u=>u!==n&&own(u));
if(n.kind==='path')why=cur&&cur!==n.path?'갈래는 하나만 고를 수 있어요. 지금은 '+cur.name+' 갈래예요 (바꾸려면 리셋)':n.k===0?'기본 스킬 3개를 모두 배우면 열려요 (순서는 자유)':'앞의 '+n.path.nodes[n.k-1].n+'부터 배워야 해요';
else why=ou?'최종기는 하나만 고를 수 있어요. 지금은 '+ou.n+'예요':b.key==='eco'?'친구를 3단계까지 키우면 열려요':'갈래를 끝까지 배우면 열려요'}
else if(!l&&G.points<n.c)why='포인트가 '+n.c+'점 필요해요 (지금 '+G.points+'점)';
info.innerHTML=head+'<p class="desc">'+descHtml(n.d)+'</p>'+(l?'<p class="lvl cur">배운 스킬이에요</p>':n.c?'<p class="cond">필요한 포인트 '+n.c+'</p>':'')+(why?'<p class="lock">'+why+'</p>':'')
+'<button id="btnBuy"'+(canBuy(n)?'':' disabled')+'>'+(l?'배웠어요':'배우기'+(n.c>1?' ('+n.c+'점)':''))+'</button>'+(canBuy(n)?'<p class="holdTip">스킬을 꾹 눌러도 배워요</p>':'');
$('#btnBuy').onclick=()=>{if(buyNode(n))renderTree()};
}
$('#tree').addEventListener('pointerdown',e=>{const b=e.target.closest('.node');if(!b)return;e.preventDefault();const id=b.dataset.id;
hold={id,pid:e.pointerId,t0:performance.now(),x:e.clientX,y:e.clientY,done:false,nobuy:!canBuy(NODE[id])};requestAnimationFrame(holdTick)});
addEventListener('pointerup',endHold);addEventListener('pointercancel',e=>{if(hold&&e.pointerId===hold.pid){hold.cancel=true;endHold(e)}});
addEventListener('pointermove',e=>{if(hold&&e.pointerId===hold.pid&&Math.hypot(e.clientX-hold.x,e.clientY-hold.y)>40){hold.cancel=!hold.done;endHold(e)}});
$('#tree').addEventListener('contextmenu',e=>e.preventDefault());
function resetLv(){return G.ecoOpen?{gear:1,buddy:1}:{}}
$('#tree').addEventListener('click',e=>{const r=e.target.closest('[data-reset]');if(!r)return;const b=TREE.find(x=>x.key===r.dataset.reset);
const up=b.key!=='eco'&&upperPts(b)>0,back=up?upperPts(b):branchPts(b);if(back<=0)return;
if(b.key==='eco'){b.ults.forEach(n=>delete G.lv[n.id]);G.lv.buddy=1}else (up?upperNodes(b):b.nodes).forEach(n=>delete G.lv[n.id]);
G.points+=back;applyStats();if(b.nodes.some(n=>n.id===selNode))selNode=b.trunk[0].id;renderTree();beep(330,.12,'sine',.06)});
function tryGo(start,boss){
if(!(G.points>0&&TREE.flatMap(b=>b.nodes).some(canSpend))){start();return}
askConfirm('스킬 포인트가 <b>'+G.points+'개</b> 남았어요.<br>그래도 '+(boss?'도전할까요?':'출발할까요?'),boss?'그냥 도전':'그냥 출발','스킬 더 찍기',start);
}
function buyNode(n){
if(!canBuy(n))return false;
if(isSwitch(n)){G.friend=n.fr[0];if(G.comp)G.comp.act=null;applyStats();audioOn();beep(700,.12,'triangle',.08,1050);return 'sw'}
if(n.fr)G.lv.buddy=n.fr[1];else G.lv[n.id]=1;
G.points-=n.c;applyStats();audioOn();const up=n.kind==='ult'?3:n.kind==='path'?n.k+1:0;beep(660+up*120,.12,'triangle',.08,990+up*120);
if(n.kind==='ult'){setTimeout(()=>beep(1320,.2,'triangle',.09,1760),120);setTimeout(()=>beep(1760,.3,'triangle',.08,2640),260)}
return true;
}
const HOLD_MS=550;let hold=null;
function holdTick(){
if(!hold)return;const el=document.querySelector('.node[data-id="'+hold.id+'"]');if(!el){hold=null;return}
if(hold.nobuy){requestAnimationFrame(holdTick);return}
const k=Math.max(0,Math.min(1,(performance.now()-hold.t0)/HOLD_MS));el.classList.add('holding');el.style.setProperty('--p',(k*100)+'%');
if(k>=1){const n=NODE[hold.id];selNode=hold.id;
const r=buyNode(n);if(r){hold.done=true;renderTree();const ne=document.querySelector('.node[data-id="'+hold.id+'"]');if(ne){ne.classList.add('learned');ne.classList.add('holding');ne.style.setProperty('--p','0%')}hold.t0=performance.now()+280;if(r==='sw'||!canBuy(n))hold.nobuy=true}
else hold.nobuy=true}
requestAnimationFrame(holdTick);
}
function endHold(e){
if(!hold||(e&&e.pointerId!==hold.pid))return;const h=hold;hold=null;
document.querySelectorAll('.node.holding').forEach(x=>{x.classList.remove('holding');x.style.removeProperty('--p')});
if(!h.done&&!h.cancel){selNode=h.id;renderTree()}
}
function openTree(o){
if(!G.ecoOpen&&(o.next.boss!==undefined||o.next.wave>=4))joinOtter();
TCTX=o;showOnly('#brk');$('#treeWrap').classList.remove('solo');$('#nodeInfo')._mx=0; $('#brkTitle').textContent=o.title;renderNext(o.next);
$('#btnRespec').hidden=!o.respec;const boss=o.next.boss!==undefined;$('#btnGo').textContent=boss?'도전!':'▶ '+(o.next.wave+1)+'차 조사 출발';$('#btnGo').classList.toggle('goTrip',!boss);
$('#btnGo').onclick=()=>tryGo(()=>{G.ecoNew=false;o.start()},boss);
const first=TREE.flatMap(b=>b.nodes).find(canSpend);if(first)selNode=first.id;renderTree();
}
const SECRET_ART=[
'<text x="50" y="66" text-anchor="middle" font-size="52" fill="#ffe7a3" font-family="Jua">?</text>',
'<ellipse cx="50" cy="60" rx="38" ry="14" fill="none" stroke="#9fe3f0" stroke-width="4"/><ellipse cx="50" cy="60" rx="24" ry="9" fill="none" stroke="#c8f1f8" stroke-width="4"/><ellipse cx="50" cy="60" rx="10" ry="4" fill="#e6fbff"/><circle cx="50" cy="38" r="4" fill="#c8f1f8"/>',
'<g fill="#c9a77a">'+[[30,74,-20],[46,56,-10],[60,40,-25],[72,22,-12]].map(([x,y,r])=>'<g transform="translate('+x+' '+y+') rotate('+r+')"><ellipse rx="6" ry="7.5"/><circle cx="-6" cy="-9" r="2.6"/><circle cx="-2" cy="-11.5" r="2.6"/><circle cx="2.5" cy="-11.5" r="2.6"/><circle cx="6.5" cy="-9" r="2.6"/></g>').join('')+'</g>',
'<ellipse cx="50" cy="74" rx="36" ry="10" fill="#4f9ea8"/><ellipse cx="50" cy="74" rx="22" ry="6" fill="none" stroke="#c8f1f8" stroke-width="3"/><path d="M38 74 C40 50 56 34 74 26 C64 40 56 56 54 74Z" fill="#8a5a33" stroke="#1f2a24" stroke-width="3.5" stroke-linejoin="round"/><g fill="#c8f1f8"><circle cx="30" cy="62" r="3"/><circle cx="70" cy="64" r="2.5"/><circle cx="24" cy="70" r="2"/></g>'];
function secretBranch(b){const n=Math.max(0,Math.min(3,(TCTX&&TCTX.next&&TCTX.next.wave)||0));
return '<div class="branch sealed secret" style="--c:'+b.col+'"><div class="bname">??? 🔒</div><div class="secretSlot" role="img" aria-label="잠긴 칸: 누군가 지켜보고 있어요"><svg class="secretArt h'+n+'" viewBox="0 0 100 100" aria-hidden="true">'+SECRET_ART[n]+'</svg><b>???</b><span>누군가<br>지켜보고 있어요</span></div></div>'}
function updateSkillStrip(){
const strip=$('#skillStrip'),items=TREE.map(b=>{const o=b.nodes.filter(own);return o.length&&(b.key!=='eco'||G.ecoOpen)?[o[o.length-1],branchPts(b)]:null}).filter(Boolean);strip.hidden=!items.length;
strip.innerHTML=items.map(([n,v])=>'<span title="'+n.n+'"><svg viewBox="0 0 48 48">'+n.i+'</svg>'+(v||'')+'</span>').join('');
}
function wireTree(){
$('#btnRespec').onclick=()=>{G.lv=resetLv();G.points=G.earned;applyStats();selNode='wide';renderTree();beep(330,.12,'sine',.06)};
}
