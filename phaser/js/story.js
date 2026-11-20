/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const STORY_IMG='../images/',STORY_VIDEO='../video/';
const STORY_BG={'01':'01_타이틀_본관_초여름','02':'02_프롤로그_정문_맑은오후','03':'03_습지_황혼','04':'04_습지_폭풍','05':'05_계곡_비온뒤',
'06':'06_능선_성곽길','07':'07_치마바위_가시박','08':'08_치마바위_연구소입구','09':'09_엔딩_본관_아침','10':'10_학교_노을','11':'11_영상_첫장면','12':'12_영상_끝장면','13':'13_본관앞_마을내려다보기',
'03노을':'03_습지_황혼',
'07b':'07b_치마바위_덩굴반쯤걷힘.webp','07c':'07c_치마바위_덩굴다걷힘_문','08b':'08b_치마바위_연구소입구_덩굴다걷힘','14':'14_연구소_내부',
'15':'15_가시박잎_손바닥','17':'17_엔딩영상_첫장면','18':'18_엔딩영상_끝장면',
'03아침':'03_습지_맑은오후','03밤':'03_습지_황혼'};
const STORY_FOCUS={'벽':[87,40,2.4],'모니터':[49,33,2.4],'책상':[45,52,2.6],'수조':[16,45,1.8]};
const STORY_PEOPLE={'배희':['주인공','기본'],'진삼쌤':['진삼쌤','마스크_친절'],'달이':['달이','기본'],'남생이':['남생이','기본'],'삵':['삵','기본']};
const STORY_CRITTER={'블루길':'보통','황소개구리':'보통','뉴트리아':'보통','가시박':'작은_꼿꼿'};
const STORY_AT={'왼쪽':'l','가운데':'c','오른쪽':'r'};
const STORY_MENACE_EYES={'뉴트리아/보통':[[59.6,37.6,1],[79.2,37.6,-1]]};
const STORY_TEARS={'블루길/거대_분노':[[19.5,70]]};
const STORY_SMALL=/^(작은_|거대_귀여움$)/;
const STORY_ANIM={'뉴트리아굴':{src:'생물/뉴트리아/거대_굴_등장퇴장_시트.webp',cols:6,rows:6,w:540,h:352,hold:[16,19],out:[20,35],
ms:i=>i===0?520:i<=6?105:i<=15?50:i<=19?230:50,ev:{0:'crumble',7:'growl+shake',22:'crumble'}}};
const STORY_FRIENDS=[['남생이','웃음',30],['달이','웃음',50],['삵','웃음',70]];
const STORY_MOOD={'15':['warm','fire'],'07b':['cool','dust'],'07c':['cool',''],'08b':['cool',''],'14':['cool',''],'03아침':['day','dust'],'03밤':['cool','fire'],'01':['day','dust'],'02':['warm','dust'],'03':['warm','fire'],'04':['cool',''],'05':['day','dust'],'06':['day','dust'],'07':['warm','dust'],'08':['cool','dust'],'09':['day','dust'],'10':['warm','dust']};
const STORY_RADIO_SVG='data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 320">
<g stroke="#1b1d1a" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
<rect x="128" y="8" width="16" height="96" rx="7" fill="#2b2f2c"/>
<rect x="40" y="86" width="124" height="216" rx="22" fill="#34403a"/>
<rect x="58" y="108" width="88" height="60" rx="10" fill="#a9d7b8"/>
<rect x="58" y="186" width="88" height="80" rx="12" fill="#232a26"/>
<rect x="24" y="140" width="18" height="56" rx="6" fill="#e0a43a"/>
<circle cx="70" cy="96" r="8" fill="#ff5a5a"/></g>
<g stroke="#4e5c54" stroke-width="5" stroke-linecap="round"><path d="M72 204h60M72 222h60M72 240h60"/></g>
<path d="M68 128h22M68 146h50" stroke="#2f6b46" stroke-width="5" stroke-linecap="round"/>
<g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"><path d="M168 40q18 22 0 44"/><path d="M182 26q30 36 0 72"/></g></svg>`);
const STORY_POD_BODY=`<g stroke="#1f2a24" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
<path d="M100 214c-4 22 4 40 18 52" fill="none" stroke-width="9"/><path d="M100 214c-4 22 4 40 18 52" fill="none" stroke="#6f9a3e" stroke-width="4"/>
<path d="M100 36C146 78 162 140 142 184C128 210 72 210 58 184C38 140 54 78 100 36Z" fill="#ffb3cb"/>
<path d="M100 36C122 92 122 158 100 206C78 158 78 92 100 36Z" fill="#ff8fb0" stroke-width="5"/>
<path d="M66 108C70 146 82 180 96 204M134 108C130 146 118 180 104 204" fill="none" stroke="#e8749a" stroke-width="4"/>
<path d="M58 188C70 166 88 168 100 194C112 168 130 166 142 188C124 220 76 220 58 188Z" fill="#7cb94f"/></g>
<ellipse cx="80" cy="96" rx="9" ry="26" fill="#fff" opacity=".55" transform="rotate(14 80 96)"/>`;
const STORY_POD_SVG='data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280">${STORY_POD_BODY}
<g fill="#fff8d0"><path d="M168 40l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><path d="M26 54l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></g></svg>`);
const STORY_LOTUS_OPEN=`<g stroke="#1f2a24" stroke-width="5" stroke-linejoin="round">${[-150,-115,-65,-30].map(a=>`<path d="M0 0C-16 -26 -12 -58 0 -74C12 -58 16 -26 0 0Z" fill="#ffb3cb" transform="rotate(${a+90})"/>`).join('')}
${[-120,-90,-60].map(a=>`<path d="M0 0C-18 -30 -14 -66 0 -84C14 -66 18 -30 0 0Z" fill="#ff8fb0" transform="rotate(${a+90})"/>`).join('')}
<ellipse cx="0" cy="-8" rx="20" ry="9" fill="#ffd95b"/></g>`;
const STORY_POD_OPEN_SVG='data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 300">
<g transform="translate(160 132)"><circle r="118" fill="#e9f7ff" fill-opacity=".35" stroke="#1f2a24" stroke-width="7"/><circle r="118" fill="none" stroke="#fff" stroke-width="3"/>
<g stroke="#1f2a24" stroke-width="4" opacity=".85">${[-90,-60,-30,0,30,60,90,120,150,180,210,240].map(a=>{const r=Math.PI/180;return `<path d="M0 0L${(118*Math.cos(a*r)).toFixed(1)} ${(118*Math.sin(a*r)).toFixed(1)}"/>`}).join('')}</g>
<g fill="none" stroke="#1f2a24" stroke-width="4" opacity=".85"><circle r="40"/><circle r="80"/></g>
<g fill="#ffb3cb" stroke="#1f2a24" stroke-width="3">${[0,60,120,180,240,300].map(a=>`<ellipse rx="11" ry="20" transform="rotate(${a}) translate(0 -132)"/>`).join('')}</g></g>
<g transform="translate(160 250) scale(.7)">${STORY_LOTUS_OPEN}</g>
<g fill="#cfeeff">${[[40,60],[280,70],[30,210],[290,220],[160,8]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7"/>`).join('')}</g></svg>`);
const STORY_FACE_FB={'지침':'걱정'};
const STORY_CRIT_FB={'작은_오열':'작은_눈물','작은_잠듦':'작은_눈물','작은_마지막잠':'작은_잠듦','작은_불안':'거대_귀여움'};
const STORY_TCHR_FB={'분노':'흑막','장화':'친절','작업후회':'장화','작업친절':'장화'};
function storyFaceMissing(e){const im=e.target,src=decodeURI(im.src),m=src.match(/주인공\/표정_(.+)\.png$/);if(m&&STORY_FACE_FB[m[1]]){im.src=STORY_IMG+'주인공/표정_'+STORY_FACE_FB[m[1]]+'.png';return}
const t=src.match(/진삼쌤\/표정_([^_/]+)(_허리)?\.png$/);if(t&&STORY_TCHR_FB[t[1]]){im.src=STORY_IMG+'진삼쌤/표정_'+STORY_TCHR_FB[t[1]]+(t[2]||'')+'.png';return}
const c=src.match(/생물\/([^/]+)\/([^/]+)\.png$/);if(c){const f=STORY_CRIT_FB[c[1]+'/'+c[2]]||STORY_CRIT_FB[c[2]];if(f)im.src=STORY_IMG+'생물/'+c[1]+'/'+f+'.png'}}
function storyFace(who,face){
if(STORY_PEOPLE[who]){const [dir,def]=STORY_PEOPLE[who];return STORY_IMG+dir+'/표정_'+(face||def)+(who==='진삼쌤'?'_허리':'')+'.png'}
if(STORY_CRITTER[who])return STORY_IMG+'생물/'+who+'/'+(face||STORY_CRITTER[who])+'.png';
return null;
}
const storyRadioFace=L=>STORY_IMG+'진삼쌤/표정_'+(L&&L.face||'마스크_무전')+'.png';
const STORY_MEM={'m1':'01_블루길_1969','m2':'02_황소개구리_1970년대','m3':'03_뉴트리아_1980년대','m4':'04_가시박_씨앗'};
const storyBgUrl=(n,layer)=>{if(STORY_MEM[n])return STORY_IMG+'회상/'+STORY_MEM[n]+'.jpg';if(n==='03'&&typeof wetTod==='function'){const t=wetTod();return STORY_IMG+'배경/'+(TOD_IMG[layer==='top'?t.top:t.base]||TOD_IMG.dusk)+'.jpg'}const f=STORY_BG[n]||n;return STORY_IMG+'배경/'+f+(/\.\w+$/.test(f)?'':'.jpg')};
const storyTopA=n=>{if(n!=='03'||typeof wetTod!=='function')return 0;const t=wetTod();return t.base===t.top?0:t.a};
function storySeen(){try{return JSON.parse(localStorage.getItem('wg_story_seen')||'[]')}catch(e){return[]}}
function storyMarkSeen(k){try{const s=storySeen();if(!s.includes(k)){s.push(k);localStorage.setItem('wg_story_seen',JSON.stringify(s))}}catch(e){}}
function storyUrls(lines){
const u=new Set();let bg=null;
for(const L of lines){if(L.bg){u.add(storyBgUrl(L.bg));if(storyTopA(L.bg)>0)u.add(storyBgUrl(L.bg,'top'))}
[].concat(L.who||[]).forEach((w,k)=>{const f=storyFace(w,Array.isArray(L.face)?L.face[k]:L.face);if(f)u.add(f)});
if(L.over){const [w,f]=L.over.split(':');const p=storyFace(w,f);if(p)u.add(p)}
if(L.insert&&STORY_CRITTER[L.insert])u.add(storyFace(L.insert));
if(L.anim&&STORY_ANIM[L.anim])u.add(STORY_IMG+STORY_ANIM[L.anim].src);
if(L.shrink)L.shrink.forEach(f=>u.add(storyFace(L.who,f)))}
lines.forEach(L=>{if(L.radio)u.add(storyRadioFace(L))});
if(lines.some(L=>L.fb==='friends'))STORY_FRIENDS.forEach(([w,f])=>u.add(storyFace(w,f)));
return [...u];
}
function storyPreload(urls){
return Promise.race([Promise.all(urls.map(src=>new Promise(r=>{const i=new Image();i.onload=i.onerror=()=>r();i.src=src}))),new Promise(r=>setTimeout(r,6000))]);
}
const STORY_LINKED=['day1_post','day2_pre','day2_post','day3_pre','day3_post','day4_pre','day4_post','day5_pre','day5_post','part1_end','part2_start','day1_radio','day2_radio','day3_radio','day4_radio','day5_radio',
'boss1_pre','boss1_post','boss2_pre','boss2_post','boss3_pre','boss3_post','boss4_pre','boss4_post','boss1_radio','boss2_radio','boss3_radio','boss4_radio',
'lab','farewell','ending','finale'];
const RADIO_SHOW=3,RADIO_GAP=.7;
function radioTick(){
const el=document.getElementById('radioPop');if(!el)return;let m=null;
const on=r=>G.t>=r.at&&G.t<r.at+(r.dur||RADIO_SHOW);
if(G&&G.mode==='play'&&G.talkMsg)m=G.talkMsg.find(on)||null;
if(m);else if(G&&G.mode==='play'&&G.helpMsg&&G.t<11){for(const r of G.helpMsg){if(on(r)){m=r;break}}}
else if(G&&G.mode==='play'&&G.stage==='field'&&!G.practice){const key='day'+(G.wave+1)+'_radio',L=STORY_LINKED.includes(key)&&STORY[key];
if(L)for(const r of L){if(r.friend&&r.friend!==G.friend)continue;const rw=WAVES[G.wave]&&WAVES[G.wave].rush,s=r.warn&&rw?rw.at-RUSH_WARN-RADIO_GAP-(r.dur||RADIO_SHOW):r.at!=null?r.at:WAVE_LEN-r.end;if(G.t>=s&&G.t<s+(r.dur||RADIO_SHOW)){m=r;break}}}
else if(G&&G.mode==='play'&&G.stage==='boss'&&!G.practice&&G.boss){const key='boss'+(G.bossIdx+1)+'_radio',L=STORY_LINKED.includes(key)&&STORY[key];
if(L){const B=G.boss,bl=L.filter(r=>r.burrow&&(!r.friend||r.friend===G.friend));
if(bl.length&&B.burrowT!=null&&G.t>=B.burrowT+.1&&G.t<B.burrowT+.1+(bl[0].dur||RADIO_SHOW))m=bl[(B.burrowN-1)%bl.length];
else for(const r of L){if(r.burrow||(r.friend&&r.friend!==G.friend))continue;const s=r.phase2?(B.p2!=null?B.p2+.5:Infinity):r.at;if(G.t>=s&&G.t<s+(r.dur||RADIO_SHOW)){m=r;break}}}}
if(m===el._m)return;el._m=m;
if(m){el.querySelector('p').textContent=m.t;
const img=el.querySelector('img');img.src=m.who?storyFace(m.who,m.face):storyRadioFace(m);el.classList.toggle('talk',!!m.who);
el.classList.remove('on');void el.offsetWidth;el.classList.add('on');
if(m.who)beep(m.who==='달이'?520:700,.06,'triangle',.05,m.who==='달이'?780:980);else for(let k=0;k<5;k++)setTimeout(()=>beep(180+Math.random()*900,.035,'square',.018),k*55)}
else el.classList.remove('on');
}
function storyThen(key,fn){if((G&&G.practice)||!STORY_LINKED.includes(key)||!STORY[key])fn();else playStory(key,fn)}
function startWaveStory(i){const k='day'+(i+1)+'_pre';ecPreload(i);
if(!(G&&G.practice)&&!(STORY_LINKED.includes(k)&&STORY[k])&&typeof EP_TITLE!=='undefined'&&EP_TITLE[i]){
const tk='_title'+i;STORY[tk]=[{bg:'03',title:[(i+1)+'차 조사',EP_TITLE[i]],wait:2.4}];playStory(tk,()=>eyeCatch(i,()=>beginWave(i)));return}
storyThen(k,()=>eyeCatch(i,()=>beginWave(i)))}
function storyLesson(box,kind){
const D=STORY.lesson||{},c=document.createElement('div');c.className='lessonCard '+kind;box.appendChild(c);
const pod=k=>'<svg viewBox="-100 -100 200 118" class="lPod" style="--k:'+k+'">'+STORY_LOTUS_OPEN+'</svg>';
if(kind==='rules'){
c.innerHTML='<p class="lHead">에필로그 · 우리의 약속</p><div class="lRules">'+(D.rules||[]).slice(0,3).map((t,k)=>'<div class="lRule" style="--k:'+k+'">'+pod(k)+'<b>'+t+'</b></div>').join('')+'</div>'
+((D.rules||[])[3]?'<div class="lRule last" style="--k:4">'+pod(4)+'<b>'+D.rules[3]+'</b></div>':'');
[0,1,2].forEach(k=>setTimeout(()=>beep(660+k*110,.25,'sine',.05,990+k*110),300+k*450));setTimeout(()=>beep(523,.6,'sine',.05,1046),2100);
}else c.innerHTML='<p class="lHead">함께 이야기해 봐요</p><ol class="lAsk">'+(D.ask||[]).map((t,k)=>'<li style="--k:'+k+'">'+t+'</li>').join('')+'</ol><p class="lSmall">'+(D.small||'')+'</p>';
}
let STORY_NOW=null;
const STORY_LOG_BTN=true;
function openStoryPause(canSkip){document.body.classList.add('storyPause');$('#btnStorySkip').hidden=!canSkip;showOnly('#pause');beep(520,.06,'sine',.04)}
function closeStoryPause(){document.body.classList.remove('storyPause');$('#btnStorySkip').hidden=true;$('#goAsk').hidden=true;showOnly(null)}
function playStory(key,done,hold){
if(STORY_NOW)STORY_NOW.abort();
{const m=key.match(/^day(\d)_(pre|post)$/),t=key.match(/^_title(\d)$/);
if(key==='prologue'||key==='part1_end'||key==='ending')setMusic('school');else if(key==='lab')setMusic('lab');else if(key==='farewell')setMusic(null);else if(key==='finale')setMusic('calm');else if(key==='part2_start'||/^boss\d_pre$/.test(key))epMusic('story',4);else if(/^boss\d_post$/.test(key))epMusic('after',4);else if(t)epMusic('story',+t[1]);else if(m)epMusic(m[2]==='pre'?'story':'after',+m[1]-1)}
const lines=STORY[key];if(!lines||!lines.length){done&&done();return}
const root=$('#story');root.textContent='';root.hidden=false;root.className='';
const el=(tag,cls,parent=root)=>{const e=document.createElement(tag);if(cls)e.className=cls;parent.appendChild(e);return e};
const stage=el('div','stage');stage.style.cssText='position:absolute;inset:0';
const lines_=el('div','lines'),flashW=el('div','flashW'),em=el('div','em');
const radio=el('div','radioWin');radio.innerHTML='<div class="ant"></div><div class="body"><div class="scr"><img alt=""><div class="noise"></div><div class="top"><span>CH 07</span><span class="sig"><i></i><i></i><i></i><i></i></span></div><div class="roll"></div><div class="rx"><b></b>수신 중</div><div class="freq">146.52 MHz</div></div><div class="spk"><div class="grille"></div><div class="meter"><i></i><i></i><i></i><i></i><i></i></div></div></div>';radio.querySelector('img').src=STORY_IMG+'진삼쌤/표정_마스크_무전.png';
const sub=el('div','sub'),subP=el('p','',sub),more=el('div','more');more.textContent='▼';
const ctlBar=el('div','ctlBar');
const logBtn=el('button','logBtn',ctlBar);logBtn.textContent='지난 대사';logBtn.hidden=!STORY_LOG_BTN;
const skip=el('button','skip',ctlBar);skip.innerHTML='건너뛰기<i>▶▶</i>';skip.hidden=!(storySeen().includes(key)||(typeof G!=='undefined'&&G&&G.test));
const menuBtn=el('button','menuBtn',ctlBar);menuBtn.innerHTML='메뉴<i>☰</i>';menuBtn.setAttribute('aria-label','메뉴 열기');
const S={i:-1,bg:null,cut:null,key:'',typing:null,full:'',target:null,autoT:null,lastAt:0,ended:false,log:[]};
S.pre={};lines.forEach(L=>{if(L.video&&!S.pre[L.video]){const v=document.createElement('video');v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('muted','');v.preload='auto';v.src=STORY_VIDEO+L.video+'.mp4';try{v.load()}catch(e){}S.pre[L.video]=v}});
function newCut(L,flash){
window.STORY_FX_UNTIL=performance.now()+1500;
[...stage.querySelectorAll(':scope>.cut')].forEach(c=>{if(c!==S.cut)c.remove()});
const wasMem=!!(S.cut&&S.cut.classList.contains('flash'));const memIn=flash&&!wasMem,memOut=!flash&&wasMem;
const cut=el('div','cut'+(flash?' flash':'')+(memIn?' memIn':'')+(memOut?' memOut':'')+(L.fx==='돌아봄'?' look':''),stage);const at=STORY_AT[L.at]||'r';
if(memIn)sfx('mem');
const pan=el('div','pan '+at+(STORY_SCENE_LOW.includes(L.scene)?' low':''),cut);
const soft=!!(L.insert||L.note);const newPlace=S.bg!==S.cutBg;S.cutBg=S.bg;
if(L.fade)cut.style.transitionDuration=L.fade+'s';
const fo=L.focus&&STORY_FOCUS[L.focus];
const bg=el('div','bg'+(fo?' focus':L.still==='hold'?'':L.still?' pull':L.flow?' flow':L.kb?' kb':soft?' soft':L.fade?'':newPlace?' settle':''),pan);if(S.bg)bg.style.backgroundImage='url("'+storyBgUrl(S.bg)+'")';
if(fo){
const W=root.clientWidth||1,H=root.clientHeight||1,ia=16/9,cH=W/H<ia?H:W/ia,cW=cH*ia,s=fo[2],fH=cH*s,fW=fH*ia,cl=(v,lo)=>Math.max(lo,Math.min(0,v));
const set=(n,v)=>bg.style.setProperty(n,v);
set('--bs0',cW+'px '+cH+'px');set('--bp0',(W-cW)/2+'px '+(H-cH)/2+'px');
set('--bs1',fW+'px '+fH+'px');set('--bp1',cl(W/2-fo[0]/100*fW,W-fW)+'px '+cl(H/2-fo[1]/100*fH,H-fH)+'px')}
if(L.bgVideo){const v=el('video','bgv',bg);v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('muted','');v.preload='auto';v.src=STORY_VIDEO+L.bgVideo+'.mp4';
v.onerror=()=>v.remove();const p=v.play();if(p&&p.catch)p.catch(()=>{})}
if(S.grade)el('div','grade '+S.grade,pan);
if(L.still){requestAnimationFrame(()=>requestAnimationFrame(()=>cut.classList.add('on')));const old=S.cut;S.cut=cut;if(old)old.querySelectorAll('.bubble').forEach(b=>b.remove()); if(old)setTimeout(()=>old.remove(),320);return}
const ta=storyTopA(S.bg);if(ta>0){const tb=el('div','bg'+(soft?' soft':newPlace?' settle':''),pan);tb.style.backgroundImage='url("'+storyBgUrl(S.bg,'top')+'")';tb.style.opacity=ta}
if(L.scene){pan.insertAdjacentHTML('beforeend',storySceneSvg(L.scene));
if(L.sceneKeep&&S.sceneName===L.scene){const dt=(performance.now()-S.sceneT)/1000;pan.querySelectorAll('svg.scene,svg.scene *').forEach(e=>{const cs=getComputedStyle(e);if(cs.animationName&&cs.animationName!=='none')e.style.animationDelay=((parseFloat(cs.animationDelay)||0)-dt).toFixed(2)+'s'})}
else{S.sceneName=L.scene;S.sceneT=performance.now()}}
else S.sceneName=null;
if(L.join){const j=el('div','joinBox',pan);L.join.forEach((w,k)=>{const s=el('span','',j);s.textContent=w;s.style.setProperty('--k',k)})}
let mood=STORY_MOOD[S.bg]||['warm',''];if(S.bg==='03'&&typeof wetTod==='function'){const t=wetTod(),now=t.a>=.5?t.top:t.base;mood={afternoon:['day','dust'],late:['warm','dust'],dusk:['warm','fire']}[now]||['cool','']}el('div','tone '+mood[0],pan);
if(mood[1]&&QUAL){const a=el('div','amb '+mood[1],pan),n=mood[1]==='fire'?14:12;
for(let k=0;k<n;k++){const d=el('i','',a),s=mood[1]==='fire'?4+Math.random()*5:3+Math.random()*4;
d.style.cssText='left:'+(Math.random()*100)+'%;top:'+(20+Math.random()*70)+'%;--s:'+s+'px;--d:'+(6+Math.random()*6)+'s;--dl:'+(-Math.random()*10)+'s;--dx:'+(Math.random()*60-30)+'px;--o:'+(.45+Math.random()*.5)}}
if(L.title){const c=el('div','epCard',pan);el('small','',c).textContent=L.title[0];el('b','',c).textContent=L.title[1]}
if(L.note){const n=el('div','note'+(L.note.split('\n').length>4?' long':''),pan);cut.noteEl=n}
else if(L.insert==='무전기'){const i=el('img','ins radio'+(L.drop?' drop':L.t?'':' calm'),pan);i.src=STORY_RADIO_SVG}
else if(L.insert==='모니터'){
const MON=[['03_습지_맑은오후','블루길','보통'],['03_습지_늦은오후','황소개구리','보통'],['03_습지_황혼','뉴트리아','보통'],['04_습지_폭풍','블루길','거대_분노',1],['05_계곡_비온뒤','황소개구리','거대_분노',1],['06_능선_성곽길','뉴트리아','거대_분노',1],['07_치마바위_가시박','가시박','거대_분노',1]];
const m=el('div','ins monitor',pan),scr=el('div','mScr',m);MON.forEach(([f,who,face,boss],k)=>{const d=el('div','mFrame'+(boss?' boss':''),scr);d.style.backgroundImage='url("'+STORY_IMG+'배경/'+f+'.jpg")';d.style.animationDelay=(k*.55)+'s';
const cr=el('img','mCrit',d);cr.src=storyFace(who,face);el('i','mNet',d);
const h=el('i','mHero',d);if(typeof HERO_SRC==='string'){const row=k%2?7:4,R=(typeof HERO_IMG_EL!=='undefined'&&HERO_IMG_EL.naturalHeight/440)||11; h.style.backgroundImage='url("'+HERO_SRC+'")';h.style.backgroundSize='800% '+(R*100)+'%';h.style.backgroundPosition=(6/7*100)+'% '+(row/(R-1)*100)+'%'}});
el('div','mScan',scr);el('b','mRec',scr).textContent='● REC';el('i','mKnob',m)}
else if(L.insert==='가시박잎'){el('div','insGlow',pan);el('div','ins palmLeaf',pan).innerHTML=storySceneSvg('손바닥잎')}
else if(L.insert==='연꽃캡슐'||L.insert==='연꽃그물'){el('div','insGlow',pan);const i=el('img','ins creature pod'+(L.insert==='연꽃그물'?' open':''),pan);i.src=L.insert==='연꽃그물'?STORY_POD_OPEN_SVG:STORY_POD_SVG}
else if(L.insert==='평형게이지'){const g=el('div','ins gaugeIns',pan);g.innerHTML='<div class="gTop"><span>생태계 평형</span><b class="gState"><i class="ok">안정</i><i class="bad">위험!</i></b></div><div class="gTrack"><div class="gFill"></div></div><div class="gNote">0이 되면 습지가 무너져요</div>'}
else if(L.insert&&STORY_CRITTER[L.insert]){el('div','insGlow',pan);const i=el('img','ins creature'+(L.reveal?' reveal':''),pan);i.src=storyFace(L.insert);
if(L.reveal)setTimeout(()=>{if(!S.ended)fx('번쩍')},700)}
else if(L.shrink&&L.who){
const box=el('div','shrinkBox'+(L.cry?' cry':''),pan);el('div','shGlow',box);
const bw=el('div','shBig',box),big=el('img','',bw);big.src=storyFace(L.who,L.shrink[0]);const small=el('img','shSmall',box);small.src=storyFace(L.who,L.shrink[1]);
if(L.cry)for(const [x,y] of (STORY_TEARS[L.who+'/'+L.shrink[0]]||[]))for(let k=0;k<3;k++){const t=el('i','tear',bw);t.style.cssText='left:'+x+'%;top:'+y+'%;--k:'+k}
const sp=el('div','shSpark',box);for(let k=0;k<14;k++){const d=el('i','',sp),a=k/14*Math.PI*2+Math.random()*.4,r=120+Math.random()*160;d.style.cssText='--x:'+(Math.cos(a)*r).toFixed(0)+'px;--y:'+(Math.sin(a)*r*.7-40).toFixed(0)+'px;--d:'+(Math.random()*.35).toFixed(2)+'s'}
if(L.cry){sfx('sob');setTimeout(()=>{if(!S.ended)sfx('shrink')},1100)}else sfx('shrink');cut.whoEl=small;
}
else if(L.anim&&STORY_ANIM[L.anim]){
const A=STORY_ANIM[L.anim],out=L.part==='out',box=el('div','who body sprAnim at-'+at+(out?'':' sprIn'),pan);
box.style.aspectRatio=A.w+'/'+A.h;box.style.backgroundImage='url("'+STORY_IMG+A.src+'")';box.style.backgroundSize=(A.cols*100)+'% '+(A.rows*100)+'%';
let i=out?A.hold[0]:0,dir=1;const set=n=>{box.style.backgroundPosition=((n%A.cols)/(A.cols-1)*100)+'% '+(Math.floor(n/A.cols)/(A.rows-1)*100)+'%';
const e=A.ev&&A.ev[n];if(e&&!S.ended){if(e.includes('crumble'))sfx('crumble');if(e.includes('growl'))sfx('growl');if(e.includes('shake'))shake()}};
set(i);cut.whoEl=box;
const tick=()=>{if(S.ended||!box.isConnected)return;if(S.paused){setTimeout(tick,150);return}
if(out){if(i<A.out[0])i=A.out[0];else if(i<A.out[1])i++;else return}
else if(i<A.hold[0])i++;else{i+=dir;if(i>=A.hold[1]){i=A.hold[1];dir=-1}else if(i<=A.hold[0]){i=A.hold[0];dir=1}}
set(i);setTimeout(tick,A.ms(i))};
setTimeout(tick,out?420:A.ms(0));
}
else if(L.who&&!L.radio){
const many=Array.isArray(L.who);
if(L.over){const [w,f]=L.over.split(':');const p=storyFace(w,f);if(p){const o=el('img','over side-'+(at==='l'?'r':'l')+(L.menace?' menace':'')+(!STORY_PEOPLE[w]&&STORY_SMALL.test(f||'')?' small':'')+(w==='진삼쌤'?' tchr':'')+(w==='배희'?' noflip':''),pan);o.onerror=storyFaceMissing;o.src=p}}
if(L.menace&&!L.over&&!many){
const box=el('div','who menaceBox at-'+at+(L.menace==='lite'?' lite':''),pan),im=el('img','',box);im.src=storyFace(L.who,L.face);
for(const [x,y,s] of (STORY_MENACE_EYES[L.who+'/'+(L.face||STORY_CRITTER[L.who])]||[])){const e=el('i','mEye',box);e.style.cssText='left:'+x+'%;top:'+y+'%;--s:'+s}
cut.whoEl=box;requestAnimationFrame(()=>requestAnimationFrame(()=>cut.classList.add('on')));const old=S.cut;S.cut=cut;if(old)old.querySelectorAll('.bubble').forEach(b=>b.remove()); if(old)setTimeout(()=>old.remove(),320);return}
(many?L.who:[L.who]).forEach((w,k,arr)=>{const p=storyFace(w,Array.isArray(L.face)?L.face[k]:L.face);if(!p)return;const body=!STORY_PEOPLE[w];
const im=el('img','who '+(arr.length>1?'many '+(arr.length>3?'many4 ':''):'at-'+at+' ')+(body?'body ':'')+(body&&arr.length===1&&STORY_SMALL.test(Array.isArray(L.face)?L.face[k]:L.face||'')?'small ':'')+(L.over?'withOver ':'')+(L.silhouette?'sil ':'')+(L.menace&&!L.over?'menace ':'')
+(L.shiver?'shiver ':'')+(L.breath?'breath ':'')+(L.faint?'faint ':'')+(L.hop?'hop ':'')+(L.sink?'sink ':'')+(w==='진삼쌤'?'tchr ':''),pan);im.onerror=storyFaceMissing;im.classList.toggle('tired',L.face==='지침');im.src=p;
if(arr.length>1){im.style.left=(arr.length>3?14+k*24:22+k*28)+'%';if(L.faint)im.style.animationDelay=(k*.35)+'s';if(L.breath)im.style.animationDelay=(-k*.23)+'s'}cut.whoEl=im;
if(L.hop){const dl=(arr.length-1-k)*.22;im.style.animationDelay=dl+'s';if(arr.length===1)im.style.left='40%';
if(w==='블루길'){im.classList.add('flop');im.src=storyFace(w,'작은_파닥');im.style.animationDelay=(dl+.5)+'s';const fxd=el('div','flopFx',pan);fxd.style.left=im.style.left||'50%';
[[0,2,.06],[6,-1,.26],[14,-4,.46],[22,-9,.66],[30,-15,.88]].forEach(([x,y,at])=>{const t=dl+.5+2.3*at;
for(let j=0;j<6;j++){const d=el('i','',fxd),a=-Math.PI*(.15+.7*Math.random()),r=2.5+Math.random()*3.5;d.style.cssText='left:'+x+'vw;bottom:'+(-y)+'vh;--x:'+(Math.cos(a)*r).toFixed(1)+'vw;--y:'+(Math.sin(a)*r*1.4).toFixed(1)+'vh;animation-delay:'+t.toFixed(2)+'s'}
setTimeout(()=>{if(!S.ended&&S.cut===cut)sfx('chalbak')},t*1000)})}}
if(L.sink&&arr.length===1){if(typeof L.sink==='string'){
const base=im.className.replace('sink ',''),src=storyFace(w,L.sink),hb=document.createElement('img'),hf=document.createElement('img');
hb.className=base+' holeBase';hf.className=base+' holeFront';hb.src=hf.src=src;
const fail=()=>{hb.remove();hf.remove();im.classList.remove('sinkHole')};
hb.onerror=fail;hf.onerror=fail;pan.insertBefore(hb,im);im.after(hf);im.classList.add('sinkHole')}const sp=el('div','enterFx front dig',pan);let h='';for(let j=0;j<16;j++){const a=-Math.PI*(.1+.8*Math.random()),r=10+Math.random()*16;h+='<i class="dirt" style="--x:'+(Math.cos(a)*r).toFixed(1)+'vw;--y:'+(Math.sin(a)*r*.7).toFixed(1)+'vh;--s:'+(.5+Math.random()*.7).toFixed(2)+';--d:'+(.5+Math.random()*.5).toFixed(2)+'s"></i>'}sp.innerHTML=h}
if(L.bye&&arr.length===1){im.classList.add('bye');const sp=el('div','byeSpark at-'+at+(L.bye==='left'?' toLeft':''),pan);for(let j=0;j<22;j++){const d=el('i','',sp);d.style.cssText='--x:'+(Math.random()*16-8).toFixed(1)+'vw;--y:'+(-20-Math.random()*40).toFixed(1)+'vh;--d:'+(.5+Math.random()*1.1).toFixed(2)+'s;--s:'+(4+Math.random()*7).toFixed(1)+'px'}}
if(L.enter&&arr.length===1)storyEnter(L.enter,im,pan)})
}
requestAnimationFrame(()=>requestAnimationFrame(()=>cut.classList.add('on')));
const old=S.cut;S.cut=cut;if(old)old.querySelectorAll('.bubble').forEach(b=>b.remove()); if(old)setTimeout(()=>old.remove(),L.fade?L.fade*1000+100:memIn||memOut?1700:320);
}
function fx(kind){
if(kind==='집중선'){lines_.classList.remove('on');void lines_.offsetWidth;lines_.classList.add('on');replay(S.cut&&S.cut.whoEl,'punch');beep(880,.08,'square',.04,1320)}
else if(kind==='흔들림'){shake();beep(140,.25,'sawtooth',.05,70)}
else if(kind==='번쩍'){flashW.classList.remove('on');void flashW.offsetWidth;flashW.classList.add('on');beep(1400,.12,'square',.05,300)}
}
function storyEnter(kind,im,pan){
im.classList.add('enter-'+kind);
const back=document.createElement('div');back.className='enterFx back '+kind;pan.insertBefore(back,im);
const front=el('div','enterFx front '+kind,pan);
const bits=(n,cls)=>{let h='';for(let k=0;k<n;k++){const a=-Math.PI*(.08+.84*Math.random()),r=18+Math.random()*30;h+='<i class="'+cls+'" style="--x:'+(Math.cos(a)*r).toFixed(1)+'vw;--y:'+(Math.sin(a)*r*.9).toFixed(1)+'vh;--s:'+(.6+Math.random()*.9).toFixed(2)+';--d:'+(Math.random()*.18).toFixed(2)+'s"></i>'}return h};
const T=(ms,f)=>setTimeout(()=>{if(!S.ended)f()},ms);
if(kind==='water'){
const L_='M50 100 L50 18 C47 8 43 4 41 10 C39 0 33 2 32 10 C28 4 22 8 24 18 C17 22 15 34 20 44 C14 60 16 82 12 100 Z',R_=L_.replace(/(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g,(m,a,b)=>(100-a)+' '+b);
const sheet=(d,c)=>'<g class="'+c+'"><path class="wo" d="'+d+'"/><path class="wf" d="'+d+'"/><path class="ws" d="'+(c==='wl'?'M44 96 C42 60 40 40 38 16 M34 98 C32 70 30 46 28 20':'M56 96 C58 60 60 40 62 16 M66 98 C68 70 70 46 72 20')+'"/></g>';
back.innerHTML='<svg class="wsvg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".3" stop-color="#bfe4fb" stop-opacity=".8"/><stop offset="1" stop-color="#5fa6dc" stop-opacity=".25"/></linearGradient></defs>'+sheet(L_,'wl')+sheet(R_,'wr')+'</svg>';front.innerHTML=bits(26,'drop')+'<div class="mist"></div>';sfx('splash');T(480,()=>{sfx('splash');shake()});T(800,()=>sfx('splash'))}
else if(kind==='drop'){back.innerHTML='<div class="shadow"></div>';front.innerHTML='<div class="ring"></div>'+bits(18,'dust');T(560,()=>{sfx('bump');shake()})}
else if(kind==='burst'){
const L_='M50 100 L50 12 L46 24 L42 4 L39 22 L34 9 L32 26 L26 15 L26 32 L19 27 L22 42 L14 46 L20 58 L13 66 L18 78 L10 100 Z',R_=L_.replace(/(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g,(m,a,b)=>(100-a)+' '+b);
const sheet=(d,c)=>'<g class="'+c+'"><path class="wf" d="'+d+'"/><path class="wi" transform="translate(50 100) scale(.62 .72) translate(-50 -100)" d="'+d+'"/></g>';
back.innerHTML='<svg class="crk" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M50 30 L40 24 L33 27 L22 20 M50 30 L58 22 L66 25 L78 17 M50 30 L47 36 L38 38 M50 30 L56 37 L68 39"/></svg>'
+'<svg class="wsvg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="dgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b08a5c"/><stop offset=".4" stop-color="#7d5c3a"/><stop offset=".8" stop-color="#5b4129" stop-opacity=".85"/><stop offset="1" stop-color="#5b4129" stop-opacity="0"/></linearGradient></defs>'+sheet(L_,'wl')+sheet(R_,'wr')+'</svg>';
front.innerHTML=bits(28,'dirt')+'<div class="mist"></div>';
sfx('crumble');T(450,()=>{sfx('crumble');shake()});T(1000,()=>{sfx('bump');sfx('growl');shake()})}
else if(kind==='dig'&&/거대_굴\.png/.test(decodeURI(im.src||''))){
im.classList.remove('enter-dig');const base=im.className,src=encodeURI(decodeURI(im.src).replace('거대_굴.png','거대_굴_빈.png')),hb=document.createElement('img'),hf=document.createElement('img');
hb.className=base+' holeBase holeIn';hf.className=base+' holeFront holeIn';hb.src=hf.src=src;const fail=()=>{hb.remove();hf.remove();im.classList.remove('riseHole');im.classList.add('enter-dig')};hb.onerror=fail;hf.onerror=fail;
pan.insertBefore(hb,im);im.after(hf);im.classList.add('riseHole');
back.innerHTML='<svg viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M50 30 L40 24 L33 27 L22 20 M50 30 L58 22 L66 25 L78 17 M50 30 L47 36 L38 38 M50 30 L56 37 L68 39"/></svg>';front.innerHTML=bits(22,'dirt');
sfx('crumble');T(420,()=>sfx('crumble'));T(900,()=>{sfx('growl');shake()})}
else if(kind==='dig'){back.innerHTML='<svg viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M50 30 L40 24 L33 27 L22 20 M50 30 L58 22 L66 25 L78 17 M50 30 L47 36 L38 38 M50 30 L56 37 L68 39"/></svg>';front.innerHTML=(/땅뚫기|거대_굴/.test(im.src&&decodeURI(im.src))?'':'<div class="mound"></div>')+bits(22,'dirt'); sfx('crumble');T(520,()=>{sfx('growl');shake()})}
else if(kind==='vines'){back.innerHTML='<svg viewBox="0 0 100 100" preserveAspectRatio="none">'+['M12 100 C10 70 30 60 22 34 C18 22 26 14 32 18','M30 100 C34 74 18 58 30 40 C38 28 34 16 42 12','M50 100 C46 80 58 62 48 44 C42 32 52 20 50 8','M70 100 C66 76 82 60 70 40 C62 28 66 16 58 12','M88 100 C90 72 70 60 78 34 C82 22 74 14 68 18'].map(d=>'<path class="vo" pathLength="100" d="'+d+'"/><path class="vi" pathLength="100" d="'+d+'"/>').join('')
+[[20,62,-30],[24,36,20],[31,18,40],[26,70,25],[32,44,-25],[41,14,30],[54,74,-20],[48,46,25],[50,12,0],[74,66,30],[68,42,-30],[59,14,-40],[84,58,-25],[78,36,15],[69,18,-35]].map(([x,y,r],k)=>'<g class="lf" style="--d:'+(.3+k%5*.08).toFixed(2)+'s" transform="translate('+x+' '+y+') rotate('+r+') scale(.9 .55)"><path d="M0 4 C-7 0 -6 -7 0 -4 C6 -7 7 0 0 4Z"/></g>').join('')
+[[16,48],[38,30],[46,60],[63,30],[80,48]].map(([x,y],k)=>'<g class="burr" style="--d:'+(.45+k*.06).toFixed(2)+'s" transform="translate('+x+' '+y+') scale(.6 .35)"><circle r="3"/><path d="M0 -6V-3M0 6V3M-6 0H-3M6 0H3M-4 -4L-2 -2M4 4L2 2M-4 4L-2 2M4 -4L2 -2"/></g>').join('')+'</svg>';sfx('crumble');T(650,()=>{sfx('crumble');shake()})}
}
function shake(){root.classList.remove('shake');void root.offsetWidth;root.classList.add('shake')}
function replay(e,c){if(!e)return;e.classList.remove('pop','punch');void e.offsetWidth;e.classList.add(c)}
const REAL_SFX_ON=true,REAL_SFX={tfrog:['청개구리_세번',.4,'ribbit'],frogs:['청개구리_합창',.5,'frogs0']};
function realSfx(n,k=1){
const r=REAL_SFX_ON&&REAL_SFX[n];if(!r)return false;
if(typeof muted!=='undefined'&&muted)return true;
let fell=false;const fb=()=>{if(fell)return;fell=true;sfx(r[2])};
try{const a=new Audio('audio/'+r[0]+'.mp3');a.volume=r[1]*k;a.onerror=fb;(S.real=S.real||[]).push(a);a.onended=()=>{S.real=(S.real||[]).filter(x=>x!==a)};const p=a.play();if(p&&p.catch)p.catch(fb)}catch(e){fb()}
return true;
}
function sfx(n,k){
if(realSfx(n,k))return;
if(n==='tfrog')n='ribbit';else if(n==='frogs0')n='frogs';
if(n==='radio')for(let k=0;k<7;k++)setTimeout(()=>beep(180+Math.random()*900,.035,'square',.022),k*55);
else if(n==='splash'){beep(900,.08,'sine',.05,300);setTimeout(()=>beep(500,.14,'triangle',.04,180),60)}
else if(n==='pop'){beep(300,.06,'triangle',.06,900);setTimeout(()=>beep(1200,.12,'sine',.05,600),70)}
else if(n==='wind')beep(220,1.2,'sine',.018,140);
else if(n==='tok'){beep(1500,.04,'sine',.05,700);setTimeout(()=>beep(900,.06,'sine',.025,500),90)}
else if(n==='chalbak'){beep(520,.07,'triangle',.05,220);setTimeout(()=>beep(820,.06,'sine',.035,360),80)}
else if(n==='ueong'){beep(92,.5,'sawtooth',.07,78);setTimeout(()=>beep(88,.55,'sawtooth',.07,72),700)}
else if(n==='ribbit'){beep(760,.05,'square',.025,520);setTimeout(()=>beep(820,.05,'square',.02,560),110)}
else if(n==='growl'){beep(70,.7,'sawtooth',.06,55);setTimeout(()=>beep(95,.4,'square',.03,60),250)}
else if(n==='bump'){beep(120,.25,'square',.09,50);setTimeout(()=>beep(900,.08,'triangle',.05,400),60);setTimeout(()=>beep(300,.3,'sawtooth',.04,120),120)}
else if(n==='sob')[0,380,760].forEach((d,k)=>setTimeout(()=>beep(520-k*40,.32,'sine',.03,380-k*40),d));
else if(n==='mem')[1320,1760,1980,2640].forEach((f,k)=>setTimeout(()=>beep(f,.5,'sine',.018,f*.995),k*140));
else if(n==='shrink'){beep(160,.5,'sawtooth',.04,120);setTimeout(()=>beep(900,1,'sine',.035,180),600);[1500,1900,2300,2800].forEach((f,k)=>setTimeout(()=>beep(f,.15,'triangle',.025,f*1.2),1100+k*90))}
else if(n==='crumble')for(let k=0;k<9;k++)setTimeout(()=>beep(90+Math.random()*90,.09,'square',.035,50),k*85);
else if(n==='thunder'){beep(60,1.2,'sawtooth',.07,40);setTimeout(()=>beep(90,.8,'square',.03,45),150)}
else if(n==='door'){beep(180,.9,'sawtooth',.035,260);setTimeout(()=>beep(260,.6,'sawtooth',.03,150),500);setTimeout(()=>beep(70,.3,'square',.06,50),1150)}
else if(n==='bubble')for(let k=0;k<6;k++)setTimeout(()=>beep(300+Math.random()*500,.06,'sine',.02,900),k*160+Math.random()*80);
else if(n==='tv'){beep(15000,.4,'sine',.01);for(let k=0;k<5;k++)setTimeout(()=>beep(200+Math.random()*1200,.03,'square',.015),k*40)}
else if(n==='tankOn')[0,260,520,780].forEach((d,k)=>setTimeout(()=>{beep(120+k*30,.25,'square',.03,240+k*40);beep(900,.05,'sine',.03)},d));
else if(n==='drop'){beep(260,.05,'square',.06,120);setTimeout(()=>beep(180,.08,'square',.04,90),130)}
else if(n==='bye')[1568,1976,2349,2637,3136].forEach((f,k)=>setTimeout(()=>beep(f,.6,'sine',.02,f*1.01),k*170));
else if(n==='frogs')for(let k=0;k<8;k++)setTimeout(()=>{const f=600+Math.random()*300;beep(f,.05,'square',.018,f*.7);setTimeout(()=>beep(f*1.06,.05,'square',.014,f*.72),90)},k*260+Math.random()*120);
else if(n==='maeng')setTimeout(()=>{if(S.ended)return;beep(330,.18,'triangle',.06,300);setTimeout(()=>beep(262,.22,'triangle',.06,240),330)},1650);
else if(n==='night')for(let k=0;k<4;k++)setTimeout(()=>beep(4200+Math.random()*600,.04,'sine',.012),k*380);
}
function show(){
clearTimeout(S.autoT);clearInterval(S.typing);S.typing=null;
const L=lines[S.i];S.lastAt=performance.now();
if(L.video){playVideo(L);return}
if(L.mute)setMusic(null);
S.hold=0;
if(L.narr||L.chapter||L.white||L.lesson||L.credits){
const old=S.cut,n=el('div','cut '+(L.white?'white':L.lesson?'dark lessonCut':'dark'),stage);
if(L.narr)el('div','narr',n).textContent=L.narr;
else if(L.chapter){const c=el('div','chapCard',n);el('small','',c).textContent=L.chapter[0];el('b','',c).textContent=L.chapter[1]}
else if(L.lesson)storyLesson(n,L.lesson);
else if(L.credits){const bgc=el('div','credBg',n);bgc.style.backgroundImage='url("'+storyBgUrl(L.bg||'03밤')+'")';const roll=L.roll||L.wait||14,r=el('div','credRoll',n);r.style.animationDuration=roll+'s';
L.credits.forEach(t=>{if(t===''){el('div','gap',r);return}
const p=el(t.startsWith('#')?'h3':'p','',r);p.textContent=t.replace(/^#\s*/,'')});
if(L.thanks){const th=el('div','credThanks',n);th.textContent=L.thanks;th.style.animationDelay=(roll+1.2)+'s'}}
requestAnimationFrame(()=>requestAnimationFrame(()=>n.classList.add('on')));if(old)setTimeout(()=>old.remove(),L.white?2000:1100);S.cut=n;S.key='narr'}
else{
if('grade' in L)S.grade=L.grade;else if(L.bg&&L.bg!==S.bg)S.grade='';
if(L.bg)S.bg=L.bg;
const visual=L.insert||L.note||L.bg||L.flashback||L.scene||L.title||L.join||L.anim||(L.who&&!L.radio);
const k=[S.bg,[].concat(L.who||'').join('+'),L.over,L.anim,L.part,L.insert,L.silhouette,L.flashback,L.scene,L.title,L.shrink,S.grade,L.focus,L.bye,L.faint,L.shiver,L.breath,L.join,L.hop,L.sink].join('|');
if(!S.cut||(visual&&(k!==S.key||L.note))){newCut(L,L.flashback);S.key=k}
else if(visual&&S.cut.whoEl&&L.who){const p=storyFace(L.who,L.face);if(p&&!S.cut.whoEl.src.endsWith(encodeURI(p.replace('../','')))){S.cut.whoEl.classList.toggle('tired',L.face==='지침');S.cut.whoEl.src=p;if(!L.fx)replay(S.cut.whoEl,'pop')}}
}
if(L.name&&S.cut){const tg=el('div','nameTag at-'+(STORY_AT[L.at]||'r'),S.cut);tg.textContent=L.name}
if(L.boss&&S.cut){const b=el('div','bossTitle'+(L.anim?' late later':L.enter?' late':''),S.cut);el('small','',b).textContent=L.boss[0];el('b','',b).textContent=L.boss[1];setTimeout(()=>{if(!S.ended)beep(110,.3,'sawtooth',.06,60)},L.anim?1650:L.enter?1050:250)}
const tuneIn=L.radio&&!lines[S.i-1]?.radio;radio.classList.toggle('on',!!L.radio);
radio.dataset.sig=L.signal??4;
if(tuneIn){radio.classList.remove('tune');void radio.offsetWidth;radio.classList.add('tune')}
if(L.radio){const ri=radio.querySelector('img'),p=storyRadioFace(L);if(ri.dataset.f!==p){ri.dataset.f=p;ri.src=p;if(!tuneIn)replay(ri,'pop')}}
sub.classList.toggle('radioLine',!!L.radio);
lines_.classList.remove('on');root.classList.remove('shake');
em.className='em';em.textContent='';
if(L.em){em.textContent=L.em;const at=STORY_AT[L.at]||'r';em.className='em pop'+(L.insert||L.note?'':L.radio?' side-l':(at==='r'?' side-l':at==='l'?' side-r':''))}
if(L.fx)fx(L.fx);if(L.sfx)sfx(L.sfx);if(L.radio&&!lines[S.i-1]?.radio)sfx('radio');
if(L.voice&&!(typeof muted!=='undefined'&&muted))setTimeout(()=>{if(S.ended||lines[S.i]!==L)return;try{const a=new Audio('audio/'+L.voice+'.mp3');a.volume=.95;S.voice=a;(S.real||[]).forEach(x=>{x.volume*=.3});a.play().catch(()=>{})}catch(e){}},(L.voiceAt??.35)*1000);
const critSay=L.t&&!L.radio&&!L.insert&&!L.note&&typeof L.who==='string'&&STORY_CRITTER[L.who]&&S.cut&&S.cut.whoEl;
if(S.cut)S.cut.querySelectorAll('.bubble').forEach(b=>b.remove());
let bubbleP=null;if(critSay){const at=STORY_AT[L.at]||'r',small=S.cut.whoEl.classList.contains('small');const bb=el('div','bubble at-'+at+(small?' overSmall':''),S.cut);bubbleP=el('p','',bb)}
const text=(L.note||L.t||'');S.target=bubbleP||(L.note&&S.cut.noteEl?S.cut.noteEl:subP);
subP.textContent='';sub.classList.toggle('empty',!L.t||!!L.note||!!bubbleP);more.classList.remove('on');
S.full=text;
if(L.lesson){S.full=' ';S.hold=performance.now()+2600;setTimeout(()=>{if(!S.ended&&lines[S.i]===L)more.classList.add('on')},2600);return}
if(!text&&L.caps)L.caps.forEach(c=>setTimeout(()=>{if(S.ended||lines[S.i]!==L)return;subP.textContent=c.t;sub.classList.remove('empty','radioLine')},c.at*1000));
if(!text){S.autoT=setTimeout(next,(L.wait||1.5)*1000);return}
let n=0;const chars=[...text];radio.classList.toggle('talk',!!L.radio);
S.typing=setInterval(()=>{n++;S.target.textContent=chars.slice(0,n).join('');if(n>=chars.length)finishType()},(L.note?55:32)*(typeof STORY_SPEED==='number'?STORY_SPEED:1));
}
function playVideo(L){
radio.classList.remove('on');em.className='em';em.textContent='';lines_.classList.remove('on');subP.textContent='';sub.classList.add('empty');more.classList.remove('on');S.full='';S.key='video';
const cut=el('div','cut vid',stage);let v=S.pre&&S.pre[L.video];if(v){delete S.pre[L.video];v.muted=false;v.removeAttribute('muted');cut.appendChild(v)}else{v=el('video','',cut);v.src=STORY_VIDEO+L.video+'.mp4';v.playsInline=true;v.setAttribute('playsinline','');v.preload='auto'}
const old=S.cut;S.cut=cut;
let shown=false;const show=()=>{if(shown)return;shown=true;cut.classList.add('on','now');if(old)setTimeout(()=>{if(old.parentNode)old.remove()},400)};
if(v.requestVideoFrameCallback)v.requestVideoFrameCallback(()=>requestAnimationFrame(show));else v.addEventListener('playing',()=>setTimeout(show,60),{once:true});
setTimeout(show,2500);
setMusic(null);S.vid=v;let done=false;
if(L.fb==='friends'){const amb=k=>{if(done||S.ended||S.vid!==v)return;sfx(k%2?'wind':'frogs',.5);setTimeout(()=>amb(k+1),k%2?1800:3200)};setTimeout(()=>amb(0),500)}
const subOff=()=>{subP.textContent='';sub.classList.add('empty')};let subOn=null;
if(L.subs)v.addEventListener('timeupdate',()=>{if(done||S.ended)return;const t=v.currentTime,s=L.subs.find(x=>t>=x.at&&t<x.at+(x.dur||3))||null;if(s===subOn)return;subOn=s;if(s){subP.textContent=s.t;sub.classList.remove('empty','radioLine')}else subOff()});
const fin=()=>{if(done||S.ended)return;done=true;S.vid=null;clearTimeout(S.autoT);S.autoT=null;if(L.subs)subOff();next()};
const fallback=()=>{if(done||S.ended||S.vfb)return;S.vfb=true;show();S.vid=null;v.remove();
if(L.fb==='friends'){
const pan=el('div','pan c friendsFb',cut),bg=el('div','bg',pan);bg.style.backgroundImage='url("'+storyBgUrl('03아침')+'")';el('div','tone day',pan);
STORY_FRIENDS.forEach(([w,f,x],k)=>{const im=el('img','fbFriend f'+k,pan);im.src=storyFace(w,f);im.style.left=x+'%'});
setMusic(null);sfx('frogs');setTimeout(()=>{if(!S.ended&&!done)sfx('frogs')},3000);
const wt=el('div','fbWhite',cut);clearTimeout(S.autoT);S.autoT=setTimeout(fin,7400);return}
const pan=el('div','pan c',cut),bg=el('div','bg',pan);bg.style.backgroundImage='url("'+storyBgUrl('10')+'")';
const im=el('img','vfFrog',pan);im.src=STORY_IMG+'생물/황소개구리/거대_내다보기.png';sfx('ueong');
setTimeout(()=>{if(!S.ended&&!done){fx('번쩍');shake()}},2300);clearTimeout(S.autoT);S.autoT=setTimeout(fin,3800)};
const outro=()=>{if(done||S.ended)return;S.vid=null;clearTimeout(S.autoT);if(L.hold!=null){S.autoT=setTimeout(fin,L.hold*1000);return}if(L.fb==='friends'){cut.classList.add('toWhite');S.autoT=setTimeout(fin,1400);return}sfx('ueong');shake();setTimeout(()=>{if(!S.ended){fx('번쩍');shake()}},700);S.autoT=setTimeout(fin,2000)};
v.onended=outro;v.onerror=fallback;
const p=v.play();if(p&&p.catch)p.catch(()=>{v.muted=true;v.play().catch(fallback)});
S.autoT=setTimeout(fin,40000);
}
function finishType(){clearInterval(S.typing);S.typing=null;S.target.textContent=S.full;
const st=lines[S.i]&&lines[S.i].strike;if(st&&S.full.includes(st)){const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));const [a,b]=S.full.split(st);S.target.innerHTML=esc(a)+'<s class="pen">'+esc(st)+'</s>'+esc(b);if(!S.ended)beep(240,.18,'sawtooth',.03,160)}
radio.classList.remove('talk');more.classList.add('on')}
function next(){if(S.ended)return;if(S.paused){S.pendNext=true;return}S.i++;if(S.i>=lines.length){end();return}logLine(lines[S.i]);show()}
function logLine(L){const t=L.note||L.t||L.narr;if(!t||!String(t).trim())return;
const NAME={'남생이':'단단이','삵':'점박이'},who=L.note?'📜 일지':L.narr?'나레이션':L.radio?'📻 진삼쌤':Array.isArray(L.who)?L.who.join(' · '):(NAME[L.who]||L.who||(L.flashback?'회상':L.insert?'('+L.insert+')':''));
S.log.push([who,String(t)])}
function openLog(){if(S.ended||S.logOpen)return;S.logOpen=true;
if(!S.paused){S.logPaused=true;S.paused=true;if(S.vid)S.vid.pause();if(S.typing)finishType();if(S.autoT&&!S.vid){clearTimeout(S.autoT);S.autoT=null;S.pendNext=true}}
const v=el('div','logView');v.innerHTML='<div class="logBox"><h3>지난 대사 <small>'+key+'</small></h3><div class="logList"></div><button class="logClose">닫기 ✕</button></div>';
const list=v.querySelector('.logList');S.log.forEach(([w,t])=>{const r=el('div','logRow',list);el('b','',r).textContent=w;el('p','',r).textContent=t});
if(!S.log.length)el('p','logNone',list).textContent='아직 지나온 대사가 없어요.';
v.querySelector('.logClose').onpointerdown=e=>{e.stopPropagation();e.preventDefault();closeLog()};
v.onpointerdown=e=>{e.stopPropagation();if(e.target===v)closeLog()};
S.logEl=v;requestAnimationFrame(()=>{list.scrollTop=list.scrollHeight})}
function closeLog(){if(!S.logOpen)return;S.logOpen=false;if(S.logEl){S.logEl.remove();S.logEl=null}
if(S.logPaused){S.logPaused=false;S.paused=false;if(S.vid)S.vid.play().catch(()=>{});S.lastAt=performance.now();if(S.pendNext){S.pendNext=false;S.autoT=setTimeout(next,700)}}}
function tap(){
if(S.ended||S.paused||S.i<0||performance.now()-S.lastAt<140)return;
if(S.typing){finishType();return}
if(S.hold&&performance.now()<S.hold)return;
if(!S.full&&S.autoT)return;
beep(660,.03,'sine',.03);next();
}
function end(quiet){if(S.ended)return;S.ended=true;if(S.pre){for(const k in S.pre){const pv=S.pre[k];pv.removeAttribute('src');try{pv.load()}catch(e){}}S.pre={}}clearTimeout(S.autoT);if(S.vid){S.vid.pause();S.vid=null}clearInterval(S.typing);if(!quiet)storyMarkSeen(key);if(STORY_NOW===ctl)STORY_NOW=null;
window.removeEventListener('keydown',onKey,true);root.onpointerdown=null;
if(hold&&!quiet){const bar=root.querySelector('.ctlBar');if(bar)bar.hidden=true;done&&done(()=>{root.hidden=true;root.textContent=''});return}
root.hidden=true;root.textContent='';if(!quiet)done&&done()}
function pause(){if(S.ended||S.paused)return;S.paused=true;if(S.vid)S.vid.pause();if(S.typing)finishType();if(S.autoT&&!S.vid){ clearTimeout(S.autoT);S.autoT=null;S.pendNext=true}openStoryPause(!skip.hidden)}
function resume(){if(!S.paused)return;S.paused=false;if(S.vid)S.vid.play().catch(()=>{});closeStoryPause();S.lastAt=performance.now();if(S.pendNext){S.pendNext=false;S.autoT=setTimeout(next,700)}}
const ctl={pause,resume,skip:()=>{closeStoryPause();S.paused=false;end()},abort:()=>{closeStoryPause();end(true)},get paused(){return !!S.paused},get busy(){return !!S.typing||!!S.vid||!!S.autoT}};STORY_NOW=ctl;
function onKey(e){
if(S.logOpen){e.preventDefault();e.stopPropagation();if(!e.repeat&&['Escape','Space','Enter','NumpadEnter','KeyL'].includes(e.code))closeLog();return}
if(e.code==='KeyL'&&STORY_LOG_BTN&&!S.paused){e.preventDefault();e.stopPropagation();if(!e.repeat)openLog();return}
if(e.code==='Escape'){e.preventDefault();e.stopPropagation();if(!e.repeat)(S.paused?resume:pause)();return}
if(S.paused)return;
if(['Space','Enter','NumpadEnter','KeyJ','ArrowRight'].includes(e.code)){e.preventDefault();e.stopPropagation();if(!e.repeat)tap()}}
root.onpointerdown=e=>{if(S.logOpen||(e.target.closest&&e.target.closest('.ctlBar,.logView')))return;e.preventDefault();tap()};
skip.onpointerdown=e=>{e.stopPropagation();e.preventDefault();end()};
logBtn.onpointerdown=e=>{e.stopPropagation();e.preventDefault();openLog()};
menuBtn.onpointerdown=e=>{e.stopPropagation();e.preventDefault();pause()};
window.addEventListener('keydown',onKey,true);
sub.classList.add('empty');
storyPreload(storyUrls(lines)).then(()=>{if(!S.ended)next()});
}
