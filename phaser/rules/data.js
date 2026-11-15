/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const SPEC={
blue:{name:'블루길',art:'blue',sz:.46,r:24,pr:.2,pts:10,hp:1},
nutria:{name:'뉴트리아',art:'nutria',sz:.56,r:30,pr:.3,pts:20,hp:2},
frog:{name:'황소개구리',art:'frog',sz:.66,r:35,pr:.42,pts:30,hp:3},
boss:{name:'대장 황소개구리',art:'frog',sz:1.09,r:56,pr:1,pts:120,hp:6},
nboss:{name:'대장 뉴트리아',art:'nutria',sz:.9,r:48,pr:1,pts:120,hp:6},
kblue:{name:'대장 블루길',art:'blue',sz:.8,r:40,pr:1,pts:100,hp:5},
vine:{name:'가시박',art:'vine',sz:.56,r:29,pr:.2,pts:40,hp:1},
otter:{name:'수달',art:'otter',sz:.62,r:33,prot:1,dur:5.5},
turtle:{name:'남생이',art:'turtle',sz:.58,r:33,prot:1,dur:8.5},
gfrog:{name:'금개구리',art:'gfrog',sz:.5,r:26,prot:1,dur:6.5},
};
const FACT={
blue:{f:'파랑볼우럭이라고도 해요. 식용으로 들여왔다가 강과 호수로 퍼졌어요.',t:'떼로 몰려와 토착 물고기를 노려요. 그물을 가운데에 던져요!'},
nutria:{f:'식용으로 들여왔다가 야생으로 퍼졌어요. 습지 식물을 마구 먹어 치워요.',t:'물가에서 식물을 갉아먹으면 평형이 뚝뚝 떨어져요. 두 번 맞혀 잡아요!'},
frog:{f:'식용으로 들여왔다가 자연으로 퍼졌어요. 몸집이 크고 먹성이 좋아요.',t:'분홍 동그라미에 착지해요. 두 번 맞혀야 잡혀요! 뒤로 갈수록 더 튼튼해져요'},
vine:{f:'수박 접붙이기용으로 들어왔어요. 풀과 나무를 뒤덮어 햇빛을 막아요.',t:'처음엔 잎만 몰래 퍼져요. 마지막 공격 때 얼굴이 나오면 빨리 돌면서 잡아요! 얼굴을 잡으면 잎도 사라져요'},
};
const WAVES=[
{intro:'blue',sp:{blue:[1,3.5]},pro:5.5,rec:.55,rush:{at:26.5,kind:'blue',n:3}},
{intro:'frog',sp:{blue:[2,5.1],frog:[.5,4.7]},pro:5,rec:.62,kblue:12,rush:{at:25.5,kind:'frog',n:1,calm:4}},
{intro:'nutria',sp:{blue:[3,6.8],frog:[3,6.8],nutria:[.5,3.9]},pro:4.5,boss:12,
rush:{at:25.5,list:[{side:'left',kind:'nutria',red:1},{side:'right',kind:'nutria',red:1}]}},
{intro:'vine',sp:{blue:[1,6.3],frog:[3,6.3],nutria:[2,5],vine:[.5,7.5]},pro:4,vineHidden:true,
rush:{at:27.5,list:[
{kind:'vine',spot:[.3,.17]},{kind:'vine',spot:[.7,.17]},{kind:'vine',spot:[.3,.9]},{kind:'vine',spot:[.7,.9]},
{kind:'vine',spot:[.05,.38]},{kind:'vine',spot:[.05,.66]},{kind:'vine',spot:[.95,.38]},{kind:'vine',spot:[.95,.66]},
{kind:'nboss',spot:[.95,.52],delay:.8}]}},
{intro:'all3',sp:{blue:[2,7],frog:[2,7],nutria:[1,4.5]},pro:4.5,
rush:{at:23.5,list:[{side:'top',kind:'kblue'},{side:'left',kind:'boss',delay:2.5},{side:'right',kind:'nboss',delay:5}]}},
];
const WAVE_LEN=30;
const I={
net:'<circle cx="24" cy="18" r="13" fill="#d9f2ec" stroke="#4fb9a8" stroke-width="3"/><path d="M15 9l18 18M33 9L15 27M24 5v26" stroke="#4fb9a8" stroke-width="1.6"/><path d="M15 28L6 42" stroke="#a87a4b" stroke-width="4" stroke-linecap="round"/>',
bolt:'<path d="M28 3L9 27h12l-3 18 20-26H26z" fill="#ffc93c"/>',
boot:'<path d="M15 5h15v22c0 3 12 3 12 11v4H10V24z" fill="#ff8fa8"/><path d="M10 37h32v5H10z" fill="#e56a87"/>',
far:'<circle cx="24" cy="24" r="19" fill="none" stroke="#4fb9a8" stroke-width="3" stroke-dasharray="5 5"/><circle cx="24" cy="24" r="8" fill="#ff8fa8"/>',
sprout:'<path d="M24 44V22" stroke="#5a9436" stroke-width="4" stroke-linecap="round"/><path d="M24 24C10 24 6 14 6 8c12 0 18 5 18 16zM24 20c0-10 8-15 18-15 0 10-6 15-18 15z" fill="#83c256"/>',
shield:'<path d="M24 4l17 6v13c0 11-8 18-17 21C15 41 7 34 7 23V10z" fill="#ffc93c"/><path d="M24 33c-10-7-5-15 0-10 5-5 10 3 0 10z" fill="#ff5f7e"/>',
};
const IC={
power:'<circle cx="24" cy="24" r="16" fill="#ff8fa8"/><path d="M24 12v24M12 24h24" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
king:'<path d="M8 38L5 13l11 9 8-14 8 14 11-9-3 25z" fill="#ffc93c"/><path d="M8 38h32v4H8z" fill="#e5a51a"/>',
roll:'<path d="M37 16A17 17 0 1 0 41 29" fill="none" stroke="#4fb9a8" stroke-width="5" stroke-linecap="round"/><path d="M30 14l8 2 2-9" fill="none" stroke="#4fb9a8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
counter:'<circle cx="24" cy="24" r="19" fill="#d9f2ec"/><path d="M26 6L12 26h10l-3 16 17-22H26z" fill="#4fb9a8"/>',
body:'<path d="M24 42C2 26 12 8 24 18 36 8 46 26 24 42z" fill="#ff5f7e"/>',
heron:'<path d="M14 32c0-13 10-18 18-14 2-7 8-8 11-5l-9 3c2 3 2 14-6 20-7 3-14 2-14-4z" fill="#b8c9dc"/><path d="M20 37v8M27 37v8" stroke="#f0b34a" stroke-width="3" stroke-linecap="round"/>',
};
const IC3={
otter:'<circle cx="12" cy="14" r="5.5" fill="#a8744a"/><circle cx="36" cy="14" r="5.5" fill="#a8744a"/><circle cx="24" cy="26" r="16" fill="#b9845a"/><ellipse cx="24" cy="31" rx="10" ry="7.5" fill="#f3dcbc"/><circle cx="18" cy="23" r="2.8" fill="#2b2f3a"/><circle cx="30" cy="23" r="2.8" fill="#2b2f3a"/><ellipse cx="24" cy="28.5" rx="3.2" ry="2.2" fill="#4a3b3b"/>',
turtle:'<ellipse cx="22" cy="28" rx="17" ry="12" fill="#7d9a45"/><path d="M12 28h20M22 17v22M15 21l14 14M29 21L15 35" stroke="#5a7330" stroke-width="2"/><circle cx="40" cy="25" r="6" fill="#b5c477"/><circle cx="42" cy="23.5" r="1.7" fill="#2b2f3a"/>',
cat:'<path d="M10 8l9 9h10l9-9v18c0 10-6 16-14 16S10 36 10 26z" fill="#dca664"/><path d="M14 12l4 5M34 12l-4 5" stroke="#ffb3c0" stroke-width="3" stroke-linecap="round"/><path d="M21 13v6M27 13v6" stroke="#fff6e0" stroke-width="2.4" stroke-linecap="round"/><circle cx="18" cy="27" r="2.8" fill="#2b2f3a"/><circle cx="30" cy="27" r="2.8" fill="#2b2f3a"/><ellipse cx="24" cy="32" rx="2.6" ry="1.8" fill="#ff8fa8"/><circle cx="13" cy="31" r="1.6" fill="#7a5230"/><circle cx="35" cy="31" r="1.6" fill="#7a5230"/>',
gfrog:'<ellipse cx="24" cy="30" rx="17" ry="12" fill="#f4c93a"/><circle cx="15" cy="17" r="6.5" fill="#f4c93a"/><circle cx="33" cy="17" r="6.5" fill="#f4c93a"/><circle cx="15" cy="17" r="3.2" fill="#2b2f3a"/><circle cx="33" cy="17" r="3.2" fill="#2b2f3a"/><path d="M17 32q7 6 14 0" stroke="#4a3b3b" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
};
const IC2={
bubble:'<circle cx="24" cy="25" r="17" fill="#d6efff" stroke="#5aa9e6" stroke-width="3.5"/><circle cx="18" cy="19" r="4" fill="#fff"/>',
burst:'<path d="M24 3l5 12 13-4-7 11 10 8-13 2 1 13-9-9-9 9 1-13-13-2 10-8-7-11 13 4z" fill="#8fc7f5"/><circle cx="24" cy="24" r="6" fill="#fff"/>',
fog:'<path d="M7 18h22M15 26h26M8 34h20" stroke="#8fb7cf" stroke-width="5" stroke-linecap="round"/>',
trail:'<circle cx="11" cy="33" r="7" fill="#8fc7f5"/><circle cx="24" cy="24" r="9" fill="#bfe3fb"/><circle cx="38" cy="13" r="7" fill="#8fc7f5"/>',
chain:'<path d="M9 13l13 11L9 35M26 13l13 11-13 11" fill="none" stroke="#4fb9a8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
shell:'<path d="M24 5l16 6v12c0 11-7 17-16 20C15 40 8 34 8 23V11z" fill="#bfe3fb" stroke="#5f83d6" stroke-width="3"/>',
thorns:'<path d="M24 3l5 13 14-3-9 11 9 11-14-3-5 13-5-13-14 3 9-11-9-11 14 3z" fill="#e5a51a"/>',
gear:'<path d="M12 42V18L24 7l12 11v24z" fill="#d9f2ec" stroke="#5a9436" stroke-width="3"/><circle cx="24" cy="25" r="6" fill="#ffc93c"/>',
cheer:'<path d="M24 41C5 27 13 11 24 19 35 11 43 27 24 41z" fill="#ffc93c"/><circle cx="37" cy="10" r="3.5" fill="#ff8fa8"/><circle cx="10" cy="11" r="2.5" fill="#83a8f2"/>',
};
const TREE=[
{key:'net',name:'공격',col:'#ff8fa8',nodes:[
{id:'power',t:1,max:3,n:'강한 그물',i:IC.power,d:l=>'그물 피해 +'+(l*30)+'%'},
{id:'wide',t:2,max:3,n:'넓은 그물',i:I.net,d:l=>'그물 범위 +'+Math.round(NET_R[l]/NET_R[0]*100-100)+'%'},
{id:'far',t:2,max:3,n:'멀리 던지기',i:I.far,d:l=>'던지는 거리 +'+(l*22)+'%'},
{id:'fast',t:2,max:3,n:'날쌘 걸음',i:I.bolt,d:l=>'이동 속도 +'+(l*10)+'%'},
{id:'king',t:3,max:1,n:'왕 그물',i:IC.king,d:()=>'3번째 그물마다 1.5배 크기, 피해 2배'},
]},
{key:'dash',name:'거품',col:'#5aa9e6',nodes:[
{id:'train',t:1,max:3,n:'거품 훈련',i:IC2.bubble,d:l=>'거품 방울 대기 시간 -'+(l*12)+'%'},
{id:'burst',t:2,max:3,boon:1,n:'거품 폭발',i:IC2.burst,d:l=>'방울을 쓰면 주변이 터져 피해 '+l+' (날아오는 물방울도 없애요)'},
{id:'fog',t:2,max:3,boon:1,n:'습지 안개',i:IC2.fog,d:l=>fogDur(l).toFixed(1)+'초 동안 적이 느려져요 (6.5초에 한 번)'},
{id:'trail',t:2,max:3,boon:1,n:'거품 달리기',i:IC2.trail,d:l=>'방울을 쓰면 가까운 적에게 돌진해요 (피해 '+BOLT.trailDmg[l]+')'},
{id:'chain',t:3,max:1,n:'연속 방울',i:IC2.chain,d:()=>'거품 방울을 2번 연속 쓸 수 있어요'},
]},
{key:'guard',name:'방어',col:'#5f83d6',nodes:[
{id:'body',t:1,max:3,n:'튼튼한 몸',i:IC.body,d:l=>'평형 회복 +'+BODY_R[l].toFixed(1)+' · 최대 하트 +'+l},
{id:'shell',t:2,max:3,n:'연잎 보호막',i:IC2.shell,d:l=>l>=2?'공격 1번을 막고, '+SHELL_RE[l]+'초 뒤 다시 생겨요':'전투마다 공격 1번을 막아요'},
{id:'heal',t:2,max:3,n:'자기 조절',i:I.sprout,d:l=>'평형 회복 +'+HEAL_R[l].toFixed(1)+' · '+HEAL_T[l]+'초마다 하트 +1'},
{id:'thorns',t:3,max:1,n:'가시 갑옷',i:IC2.thorns,d:()=>'맞거나 보호막이 깨지면 주변에 피해 2'},
]},
{key:'eco',name:'보호종',col:'#e5a51a',nodes:[
{id:'gear',t:1,max:3,n:'함께 탐사',i:IC2.gear,d:l=>l<=1?'보호종 친구와 함께 다녀요':(l===2?'그물·이동·방울·친구가 조금 강해져요':'그물·이동·방울·친구가 더 강해져요')},
{id:'otter',t:2,max:3,boon:1,n:'수달',i:IC3.otter,d:l=>'연못을 가르며 돌진! ('+COMP.otter.cd[l]+'초마다)'},
{id:'turtle',t:2,max:3,boon:1,n:'남생이',i:IC3.turtle,d:l=>'적들의 움직임을 멈춰요 ('+COMP.turtle.cd[l]+'초마다)'},
{id:'cat',t:2,max:3,boon:1,n:'삵',i:IC3.cat,d:l=>'가장 튼튼한 적을 덮쳐요 ('+COMP.cat.cd[l]+'초마다)'},
{id:'heron',t:3,max:1,n:'왜가리',i:IC.heron,d:()=>'왜가리가 6초마다 교란 생물을 공격해요'},
]},
];
const fullBranch=k=>{const b=TREE.find(b=>b.key===k),bo=b.nodes.find(n=>n.boon&&L(n.id));return b.nodes.every(n=>n.boon?(n!==bo||L(n.id)>=n.max):L(n.id)>=n.max)&&(!b.nodes.some(n=>n.boon)||!!bo)};
const pairLv=(a,b)=>L(a)>=3&&L(b)>=3?2:L(a)>=2&&L(b)>=2?1:0;
const GRID_ROWS=['wide','far','fast'],GRID_COLS=['burst','fog','trail'],ECO_ROWS=['safe','cheer'],ECO_COLS=['shell','heal'];
const guardNeed=()=>L('power')>=2&&L('train')>=2&&L('gear')>=2&&L('body')>=2;
const SYN=[
{id:'wideburst',g:[0,0],n:'물보라',lv:['거품 폭발이 더 넓고 세져요','폭발이 훨씬 넓고 세져요']},
{id:'tide',g:[0,1],n:'소용돌이',lv:['안개를 쓰면 주변 생물을 모아 큰 그물로 덮쳐요','더 넓게 모으고, 큰 그물이 잠깐 남아 계속 피해를 줘요']},
{id:'trap',g:[0,2],n:'통발',lv:['거품 돌진이 지나간 길에 통발이 놓여, 잠깐 동안 들어오는 생물을 잡아요','통발이 더 많이 놓이고, 더 오래 더 세게 잡아요']},
{id:'cannon',g:[1,0],n:'물대포',lv:['방울을 쓰면 물줄기가 뻗어 피해 1','더 긴 물줄기, 피해 2']},
{id:'mist',g:[1,1],n:'더 월드',lv:['안개 속 적이 절반 속도로 더 느려져요','시간이 완전히 멈춰요 (안개 시간의 절반 동안)']},
{id:'knot',g:[1,2],n:'꽁꽁 매듭',lv:['그물에 맞은 생물이 0.7초 멈춰요 (같은 생물은 2초 쉬었다가 다시)','1초 멈춰요']},
{id:'ebb',g:[2,0],n:'거센 파도',lv:['방울이 터지면 파도가 2번 밀려가며 적을 밀어내요','파도가 3번, 더 넓고 세게 밀려가요']},
{id:'shadow',g:[2,1],n:'그림자 분신',lv:['안개 동안 분신 1명이 함께 던져요','분신 2명이 함께 던져요']},
{id:'bolt',g:[2,2],n:'전광석화',lv:['거품 돌진이 번개처럼 빨라지고 세져요','돌진한 자리에 낙뢰가 3번 떨어져요']},
{id:'neighbor',n:'든든한 이웃',c:'수달 Lv2 + 연잎 보호막 Lv2',eco:['otter','shell'],lv:['보호막이 깨지면 수달이 바로 돌진해요','수달 돌진이 더 세고, 더 많은 적을 쳐요']},
{id:'sprout',n:'새싹 지킴이',c:'수달 Lv2 + 자기 조절 Lv2',eco:['otter','heal'],lv:['수달이 칠 때마다 평형이 회복되고, 보스를 여러 번 치면 하트 +1','평형이 더 회복되고, 하트를 더 자주 얻어요']},
{id:'double',n:'철벽 수비',c:'남생이 Lv2 + 연잎 보호막 Lv2',eco:['turtle','shell'],lv:['보호막이 깨지면 남생이가 주변 적을 2초 붙잡아요','더 넓은 곳의 적을 2.5초 붙잡아요']},
{id:'sanct',n:'보호구역',c:'남생이 Lv2 + 자기 조절 Lv2',eco:['turtle','heal'],lv:['보호막이 깨지면 2초 동안 무적','2.5초 동안 무적']},
{id:'stalk',n:'빠른 사냥',c:'삵 Lv2 + 연잎 보호막 Lv2',eco:['cat','shell'],lv:['보호막이 있는 동안 삵이 2배 자주 덮쳐요','2.5배 자주 덮쳐요']},
{id:'foodweb',n:'먹이사슬',c:'삵 Lv2 + 자기 조절 Lv2',eco:['cat','heal'],lv:['삵이 잡을 때마다 평형이 회복되고, 보스를 3번 덮치면 하트 +1','평형이 더 회복되고, 보스를 더 세게 덮쳐요']},
{id:'sabang',star:1,n:'사방미인',c:'강한 그물·거품 훈련·함께 탐사·튼튼한 몸 Lv1',d:'그물 피해 +8%, 방울 대기 -5%',need:()=>L('power')>=1&&L('train')>=1&&L('gear')>=1&&L('body')>=1&&!guardNeed()},
{id:'proxy',star:2,n:'보호종 어셈블',c:'보호종 스킬 전부 최대',d:'10초마다 다른 두 친구가 나타나 함께 싸워요',need:()=>fullBranch('eco')},
{id:'fort',star:2,n:'람사르 협약',c:'방어 스킬 전부 최대',d:'보호막이 깨지면 5초간 그물 피해 +50%',need:()=>fullBranch('guard')},
{id:'guardian',star:2,n:'팔방미인',c:'강한 그물·거품 훈련·함께 탐사·튼튼한 몸 Lv2',d:'그물 피해 +15%, 방울 대기 -10%, 하트 +1',need:guardNeed},
{id:'master',star:3,n:'그물의 달인',c:'공격 스킬 전부 최대',d:'사거리가 화면을 덮고, 왕 그물이 2번째마다 나가요',need:()=>fullBranch('net')},
{id:'gusa',star:3,n:'구사일생',c:'연속 방울 + 가시 갑옷',d:'하트가 1개 남으면 9초 동안 가시 방울이 지켜 줘요 (전투마다 1번)',need:()=>L('chain')>=1&&L('thorns')>=1},
{id:'avengers',star:3,n:'왜가리 킹',c:'왕 그물 + 왜가리',d:'왕관 쓴 왜가리가 4초마다 2배로 공격해요',need:()=>L('king')>=1&&L('heron')>=1},
];
SYN.forEach(q=>{if(q.g){q.a=GRID_ROWS[q.g[0]];q.b=GRID_COLS[q.g[1]];q.need=()=>pairLv(q.a,q.b)}
if(q.eco){q.d=q.lv[0];q.need=()=>pairLv(q.eco[0],q.eco[1])}});
const ECO_SYN={
neighborDmg:[0,2,3], neighborHits:[0,0,1],
sproutGauge:[0,.5,.7], sproutBoss:[0,8,6],
doubleT:[0,2,2.5], doubleR:[0,230,270],
sanctT:[0,2,2.5],
stalkK:[0,2,2.5],
foodGauge:[0,1.5,2], foodBossDmg:[0,0,1],
};
const FOG_DUR=[0,1.7,2.3,3];
function fogDur(l){return FOG_DUR[Math.max(0,Math.min(3,l|0))]}
const syn=id=>{const q=SYN.find(x=>x.id===id);return q?+q.need():0};
const synSum=()=>SYN.reduce((a,q)=>a+q.need(),0);
const NODE={};TREE.forEach(b=>b.nodes.forEach(n=>{n.b=b;NODE[n.id]=n}));
const FIRST_WAVE_PTS=1;
const CAP_NEED=4;
const NET_R=[38,51.04,58.08,65.12];
const BOSS_SZ=1.45;
const BOSS=[
{k:'blue',art:'bblue',name:'왕 블루길',hp:42,r:70,tip:'돌진이 끝나고 지쳤을 때가 기회예요. 분홍 줄 밖으로 피해요!'},
{k:'frog',art:'bfrog',name:'왕 황소개구리',hp:46,r:76,tip:'충격파는 거품 방울로 막아요. 착지 직후가 기회예요!'},
{k:'nutria',art:'bnutria',name:'왕 뉴트리아',hp:68,r:67,tip:'땅속으로 숨으면 솟아오르는 자리를 피하고, 공격이 끝난 뒤의 틈을 노려요!'},
{k:'vine',art:'bvine',name:'왕 가시박',hp:93,r:73,tip:'몸통은 단단해요. 주변의 뿌리를 모두 잘라야 틈이 생겨요!'},
];
