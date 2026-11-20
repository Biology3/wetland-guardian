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
power:'<g transform="translate(24 31) scale(.62) translate(-24 -27)"><path d="M24 4C27 13 37 18 37 30a13 13 0 0 1-26 0c0-7 4-10 6-14 1 4 3 6 5 6-2-7 0-13 2-18z" fill="#ff8a3c" stroke="#c2491c" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 22c2 5 7 7 7 12a7 7 0 0 1-14 0c0-4 3-6 4-9 1 2 2 3 3 3z" fill="#ffd04a"/></g><circle cx="12" cy="14" r="2.2" fill="#ffb347"/><circle cx="36" cy="11" r="1.8" fill="#ffd04a"/><circle cx="33" cy="20" r="1.4" fill="#ff8a3c"/>',
king:'<path d="M24 4C27 13 37 18 37 30a13 13 0 0 1-26 0c0-7 4-10 6-14 1 4 3 6 5 6-2-7 0-13 2-18z" fill="#ff7a2e" stroke="#c2491c" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 22c2 5 7 7 7 12a7 7 0 0 1-14 0c0-4 3-6 4-9 1 2 2 3 3 3z" fill="#ffd04a"/><path d="M24 30c1 2 3 3 3 5a3 3 0 0 1-6 0c0-2 2-3 3-5z" fill="#fff3c4"/>',
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
const IC4={
swift:'<path d="M28 3L9 27h12l-3 18 20-26H26z" fill="#ffc93c"/><path d="M4 14h9M2 24h8M5 34h8" stroke="#ff8fa8" stroke-width="3.5" stroke-linecap="round"/>',
ripple:'<ellipse cx="24" cy="29" rx="19" ry="9" fill="none" stroke="#5aa9e6" stroke-width="3.5"/><ellipse cx="24" cy="29" rx="9" ry="4" fill="#bfe3fb" stroke="#5aa9e6" stroke-width="2.5"/><path d="M24 6v12" stroke="#ff8fa8" stroke-width="5" stroke-linecap="round"/>',
ripple2:'<ellipse cx="24" cy="29" rx="21" ry="11" fill="none" stroke="#3f8fd6" stroke-width="4"/><ellipse cx="24" cy="29" rx="13" ry="6.5" fill="none" stroke="#5aa9e6" stroke-width="3.5"/><ellipse cx="24" cy="29" rx="5" ry="2.5" fill="#bfe3fb"/><circle cx="9" cy="12" r="3.5" fill="#8fc7f5"/><circle cx="24" cy="7" r="4.5" fill="#8fc7f5"/><circle cx="39" cy="12" r="3.5" fill="#8fc7f5"/>',
master:'<g transform="translate(-6 14) scale(.6)"><path d="M24 4C27 13 37 18 37 30a13 13 0 0 1-26 0c0-7 4-10 6-14 1 4 3 6 5 6-2-7 0-13 2-18z" fill="#e5482a" stroke="#9e2a14" stroke-width="3" stroke-linejoin="round"/></g><g transform="translate(25 14) scale(.6)"><path d="M24 4C27 13 37 18 37 30a13 13 0 0 1-26 0c0-7 4-10 6-14 1 4 3 6 5 6-2-7 0-13 2-18z" fill="#e5482a" stroke="#9e2a14" stroke-width="3" stroke-linejoin="round"/></g><path d="M24 4C27 13 37 18 37 30a13 13 0 0 1-26 0c0-7 4-10 6-14 1 4 3 6 5 6-2-7 0-13 2-18z" fill="#ff7a2e" stroke="#b8321a" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 22c2 5 7 7 7 12a7 7 0 0 1-14 0c0-4 3-6 4-9 1 2 2 3 3 3z" fill="#ffd04a"/><path d="M24 30c1 2 3 3 3 5a3 3 0 0 1-6 0c0-2 2-3 3-5z" fill="#fff3c4"/>',
aim:'<circle cx="24" cy="24" r="15" fill="#fff" stroke="#4fb9a8" stroke-width="3.5"/><path d="M24 4v12M24 32v12M4 24h12M32 24h12" stroke="#4fb9a8" stroke-width="3.5" stroke-linecap="round"/><circle cx="24" cy="24" r="4" fill="#ff8fa8"/>',
sniper:'<circle cx="24" cy="24" r="17" fill="#fff" stroke="#3b9587" stroke-width="3.5"/><circle cx="24" cy="24" r="9" fill="none" stroke="#3b9587" stroke-width="2.5"/><path d="M24 2v14M24 32v14M2 24h14M32 24h14" stroke="#3b9587" stroke-width="3.5" stroke-linecap="round"/><path d="M24 18l2 4 4 .6-3 3 .8 4.4-3.8-2-3.8 2 .8-4.4-3-3 4-.6z" fill="#ff5f7e"/>',
eagle:'<path d="M3 24C10 11 38 11 45 24 38 37 10 37 3 24z" fill="#fff" stroke="#3b9587" stroke-width="3.5"/><circle cx="24" cy="24" r="8.5" fill="#4fb9a8"/><circle cx="24" cy="24" r="4" fill="#1f2a24"/><circle cx="27" cy="21" r="2" fill="#fff"/><path d="M24 3v5M9 8l3 4M39 8l-3 4" stroke="#ffc93c" stroke-width="3.5" stroke-linecap="round"/>',
lotus:'<path d="M24 5c7 8 7 20 0 30-7-10-7-22 0-30z" fill="#ff8fb8"/><path d="M8 14c10 2 16 10 16 21-9-2-16-10-16-21z" fill="#ffb3cf"/><path d="M40 14c-10 2-16 10-16 21 9-2 16-10 16-21z" fill="#ffb3cf"/><path d="M3 27c9-1 17 3 21 9-9 2-17-1-21-9zM45 27c-9-1-17 3-21 9 9 2 17-1 21-9z" fill="#ff8fb8"/><ellipse cx="24" cy="40" rx="17" ry="4" fill="#83c256"/><circle cx="24" cy="30" r="3.5" fill="#ffc93c"/>',
bigb:'<circle cx="21" cy="26" r="18" fill="#d6efff" stroke="#5aa9e6" stroke-width="3.5"/><circle cx="14" cy="19" r="4.5" fill="#fff"/><circle cx="39" cy="10" r="6" fill="#d6efff" stroke="#5aa9e6" stroke-width="3"/>',
keep:'<circle cx="24" cy="25" r="18" fill="#d6efff" stroke="#5aa9e6" stroke-width="3.5"/><path d="M24 14v12l8 5" fill="none" stroke="#3f6fb0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
wave:'<path d="M3 30c5-10 10-10 15 0s10 10 15 0 8-9 12-3" fill="none" stroke="#5aa9e6" stroke-width="5" stroke-linecap="round"/><path d="M8 40h32" stroke="#bfe3fb" stroke-width="4" stroke-linecap="round"/>',
wave2:'<path d="M3 20c5-9 10-9 15 0s10 9 15 0 8-8 12-3" fill="none" stroke="#8fc7f5" stroke-width="4" stroke-linecap="round"/><path d="M4 42V30c9 0 9-16 22-16-5 5-3 11 3 11 7 0 9-6 15-6v23z" fill="#5aa9e6"/><path d="M10 31c5-2 7-8 12-11" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
thick:'<path d="M5 12h24M13 20h30M5 28h28M11 36h30" stroke="#6f97b3" stroke-width="5.5" stroke-linecap="round"/>',
world:'<circle cx="24" cy="24" r="19" fill="#eef0ff" stroke="#6f5aa8" stroke-width="3.5"/><path d="M24 11v13l9 6" fill="none" stroke="#6f5aa8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 5v3M24 40v3M5 24h3M40 24h3" stroke="#6f5aa8" stroke-width="3" stroke-linecap="round"/>',
flash:'<circle cx="24" cy="24" r="19" fill="#fff6c9" stroke="#f5b914" stroke-width="3"/><path d="M28 7L13 26h9l-3 15 16-21h-9z" fill="#ffc93c" stroke="#e5a51a" stroke-width="1.5" stroke-linejoin="round"/>',
thunder:'<path d="M20 2L5 24h10l-4 20 19-26H20z" fill="#ffc93c" stroke="#e5a51a" stroke-width="1.5" stroke-linejoin="round"/><path d="M38 6L28 21h7l-3 14 13-18h-7z" fill="#ffe98a" stroke="#e5a51a" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 44h42" stroke="#5aa9e6" stroke-width="4" stroke-linecap="round"/>',
balance:'<path d="M24 28l9 15H15z" fill="#5f83d6"/><path d="M5 30L43 20" stroke="#3d5a4c" stroke-width="5" stroke-linecap="round"/><circle cx="10" cy="22" r="6" fill="#83c256"/><circle cx="38" cy="13" r="6" fill="#8fc7f5"/>',
storm:'<path d="M24 1l4 13 13-6-6 13 13 4-13 4 6 13-13-6-4 13-4-13-13 6 6-13L0 25l13-4L7 8l13 6z" fill="#e5a51a"/><circle cx="24" cy="25" r="7" fill="#fff3c9"/>',
grit:'<path d="M24 4l17 6v13c0 11-8 18-17 21C15 41 7 34 7 23V10z" fill="#bfe3fb" stroke="#5f83d6" stroke-width="3"/><path d="M24 13v11l7 5" fill="none" stroke="#3d5a9c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
heart:'<path d="M22 42C1 27 10 9 22 19 34 9 43 27 22 42z" fill="#ff5f7e"/><path d="M37 4v12M31 10h12" stroke="#5f83d6" stroke-width="4.5" stroke-linecap="round"/>',
fortress:'<path d="M8 44V16h6v5h6v-5h8v5h6v-5h6v28z" fill="#9fb3e6" stroke="#5f83d6" stroke-width="3" stroke-linejoin="round"/><path d="M20 44V33a4 4 0 0 1 8 0v11z" fill="#3d5a9c"/><path d="M24 2c-7 5-4 10 0 8 4 2 7-3 0-8z" fill="#ff5f7e"/>',
regrow:'<path d="M24 9l12 4.5v9c0 8-5 13-12 15-7-2-12-7-12-15v-9z" fill="#bfe3fb" stroke="#5f83d6" stroke-width="2.5"/><path d="M41 15A19 19 0 1 0 44 30" fill="none" stroke="#5a9436" stroke-width="4" stroke-linecap="round"/><path d="M35 14l7 2 2-8" fill="none" stroke="#5a9436" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
cycle:'<path d="M38 15A17 17 0 0 0 9 18M10 33a17 17 0 0 0 29-3" fill="none" stroke="#5a9436" stroke-width="4.5" stroke-linecap="round"/><path d="M4 12l5 7 7-4M44 36l-5-7-7 4" fill="none" stroke="#5a9436" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 34C12 22 17 14 24 20c7-6 12 2 0 14z" fill="#ff5f7e"/>',
gusa:'<path d="M24 2l4 9 9-5-2 10 10 2-8 6 8 6-10 2 2 10-9-5-4 9-4-9-9 5 2-10-10-2 8-6-8-6 10-2-2-10 9 5z" fill="#ffc93c"/><path d="M24 35C11 25 16 15 24 21c8-6 13 4 0 14z" fill="#ff5f7e"/>',
assemble:'<circle cx="24" cy="14" r="10" fill="#b9845a"/><circle cx="11" cy="32" r="10" fill="#7d9a45"/><circle cx="37" cy="32" r="10" fill="#dca664"/><path d="M24 22l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L15 29l6-1z" fill="#ffc93c" stroke="#fff" stroke-width="1.5"/>',
kheron:'<path d="M12 36c0-13 10-18 18-14 2-7 8-8 11-5l-9 3c2 3 2 14-6 20-7 3-14 2-14-4z" fill="#b8c9dc"/><path d="M18 41v6M25 41v6" stroke="#f0b34a" stroke-width="3" stroke-linecap="round"/><path d="M27 14l-2-11 5 4 4-6 4 6 5-4-2 11z" fill="#ffc93c" stroke="#e5a51a" stroke-width="1.5" stroke-linejoin="round"/>',
};
const SK={
wide:1.15,fast:.1,far:.1,
pow:{r:[1.25,1.35,1.45], dmg:[1.2,1.5,1.8]},
swift:[.15,.2,.3], compBoss:1.2,
after:{gap:.27,hold:.5,delay:.15,cd:0,dmg:[.2,.2,.2], splashR:70,splashDmg:.3,r:.8},
aim:{range:.2,speed:1.35,bonus:.15,crit:.05},sniper:{range:.3,bonus:.3,crit:.2},eagle:{range:.4,bonus:.55,crit:.25},critZone:.9,
lotus:{need:8,r:165,dmg:3,warn:.3,rain:4,rainR:95,rainDmg:1},
train:.15,bigb:{r:150,push:90},keep:{inv:1},
burst:{r:190,dmg:1,boss:.5 ,inv:[.15,.25,.35]},wave:{dmg:1,grow:1.3,push:150},wave2:{dmg:2,grow:1.75,push:230},
pose:{stop:.1,show:.45,waveStop:.1 ,zapStop:.12,slow:.3,slowT:.28,lock:.2},
fog:{dur:.8,slow:.65,dmg:1.1},thick:{dur:1,slow:.35,dmg:1.2},world:{stop:1,dmg:1.4,egg:8,eggBonus:.5},
zap:{dur:[1,2.5,3],spd:[.25,.35,.45],spdDur:[1,1.2,1.5],shock:{r:190,dmg:1,boss:.5},strikes:[0,2,2],strikeGap:.35,strikeDmg:[.5,.5,.5],charges:[0,0,4],netDmg:.5,range:330,first:.3},
chain:{cd:.65},
balance:{rec:.5,inv:.3},body:{loss:.75},
thorns:{dmg:2,r:210,stun:.8,frz:1},storm:{dmg:5,r:270},ramsar:{t:2,k:1.5},
grit:.7,
regrow:20 ,heal:{t:22},cycle:{k:.65},
gusa:{t:4.9,gauge:30,k:1.94,rev:1.25},
otter:{cd:[0,2.2,1.5,1.5],dmg:1,hits:2,gauge:.2,boss:8 },
turtle:{cd:[0,3.5,3.5,3.5],dmg:1,frz:1.5,grab:.8,gauge:.5 ,shellN:5 ,shellT:12},
cat:{cd:[0,4,2.8,2.8],dmg:[0,2,2,3.5] },
assemble:{every:7,stay:1.4,hits:1,cd:.8,dmg:3.5,r:40,range:320,first:3},
kheron:{every:4,dmg:3},
};
const pct=v=>Math.round(v*100);
const nd=(id,n,i,c,d)=>({id,n,i,c,d});
const farAt=s=>pct(s.bonus);
const RK1=SK.aim.range,RK2=SK.sniper.range,RK3=SK.eagle.range;
const TREE=[
{key:'net',name:'공격',col:'#ff8fa8',
trunk:[nd('wide','넓은 그물',I.net,1,'그물 범위 +'+pct(SK.wide-1)+'%'),nd('fast','빠른 걸음',I.boot,1,'이동 속도 +'+pct(SK.fast)+'%'),nd('far','멀리 던지기',I.far,1,'던지는 거리 +'+pct(SK.far)+'%')],
paths:[
{key:'pow',name:'불꽃',nodes:[nd('power','불씨 그물',IC.power,1,'그물에 불씨가 붙어요 · 그물 범위 +'+pct(SK.pow.r[0]-1)+'%, 피해 '+SK.pow.dmg[0]+'배'),nd('king','불꽃 그물',IC.king,1,'불꽃이 활활 · 그물 범위 +'+pct(SK.pow.r[1]-1)+'%, 피해 '+SK.pow.dmg[1]+'배'),nd('master','화염 그물',IC4.master,2,'불기둥이 치솟아요 · 그물 범위 +'+pct(SK.pow.r[2]-1)+'%, 피해 '+SK.pow.dmg[2]+'배')]},
{key:'spd',name:'잔상',nodes:[nd('swift','날쌘 걸음',IC4.swift,1,'이동 속도 +'+pct(SK.swift[0])+'%, 걸으면 잔상 1개가 따라와 내가 던질 때마다 그물을 따라 던져요 · 분신 피해 '+pct(SK.after.dmg[0])+'%'),nd('ripple','잔상 걸음',IC4.ripple,1,'이동 속도 +'+pct(SK.swift[1])+'%, 잔상 2개 · 분신 피해 '+pct(SK.after.dmg[1])+'%'),nd('ripple2','분신술',IC4.ripple2,2,'이동 속도 +'+pct(SK.swift[2])+'%, 잔상 3개 · 분신 피해 '+pct(SK.after.dmg[2])+'% · 마지막 잔상 그물이 물보라를 일으켜요')]},
{key:'rng',name:'사거리',nodes:[nd('aim','명사수',IC4.aim,1,'던지는 거리 +'+pct(SK.aim.range)+'% · 멀리 맞힐수록 피해 최대 +'+farAt(SK.aim)+'%, 끝 점선 가까이 맞히면 크리티컬 +'+pct(SK.aim.crit)+'%'),nd('sniper','저격수',IC4.sniper,1,'던지는 거리 +'+pct(SK.sniper.range)+'% · 멀리 맞힐수록 피해 최대 +'+farAt(SK.sniper)+'%, 끝 점선 가까이 맞히면 크리티컬 +'+pct(SK.sniper.crit)+'%'),nd('eagle','천리안',IC4.eagle,2,'던지는 거리 +'+pct(SK.eagle.range)+'% · 멀리 맞힐수록 피해 최대 +'+farAt(SK.eagle)+'%, 끝 점선 가까이 맞히면 크리티컬 +'+pct(SK.eagle.crit)+'%')]},
],
ults:[nd('lotus','위성 연꽃',IC4.lotus,3,'그물을 '+SK.lotus.need+'번 맞히면 다음 그물 자리에 연꽃 빔이 쏟아져요')]},
{key:'dash',name:'거품',col:'#5aa9e6',
trunk:[nd('bigb','큰 거품',IC4.bigb,1,'거품이 커져 주변 적을 밀어내요'),nd('train','거품 훈련',IC2.bubble,1,'거품 대기 시간 -'+pct(SK.train)+'%'),nd('keep','거품 지속',IC4.keep,1,'거품 무적 시간 0.7초 → '+SK.keep.inv+'초')],
paths:[
{key:'pop',name:'폭발',nodes:[nd('burst','폭발 거품',IC2.burst,1,'거품이 펑 터져 주변 적에게 피해 '+SK.burst.dmg+' · 거품 무적 +'+SK.burst.inv[0]+'초'),nd('wave','파도 거품',IC4.wave,1,'터진 뒤 물결이 한 번 더 · 피해 '+SK.burst.dmg+' → '+(SK.burst.dmg+SK.wave.dmg)+' · 거품 무적 +'+SK.burst.inv[1]+'초'),nd('wave2','해일 거품',IC4.wave2,2,'큰 해일이 한 번 더 · 피해 '+(SK.burst.dmg+SK.wave.dmg)+' → '+(SK.burst.dmg+SK.wave.dmg+SK.wave2.dmg)+' · 거품 무적 +'+SK.burst.inv[2]+'초')]},
{key:'run',name:'전기',nodes:[nd('trail','찌릿 거품',IC2.trail,1,'거품에서 전기가 퍼져 주변 적에게 피해 '+SK.zap.shock.dmg+' · '+SK.zap.spdDur[0]+'초 동안 이동 속도 +'+pct(SK.zap.spd[0])+'%'),nd('flash','번개 거품',IC4.flash,1,'주변에 번개가 '+SK.zap.strikes[1]+'번 떨어져요 · 피해 '+SK.zap.shock.dmg+' → '+(SK.zap.shock.dmg+SK.zap.strikes[1]*SK.zap.strikeDmg[1])+' · '+SK.zap.spdDur[1]+'초 동안 이동 속도 +'+pct(SK.zap.spd[1])+'%'),nd('thunder','천둥 거품',IC4.thunder,2,'다음 그물 '+SK.zap.charges[2]+'발에 번개가 실려요 · 피해 '+(SK.zap.shock.dmg+SK.zap.strikes[2]*SK.zap.strikeDmg[2])+' → '+(SK.zap.shock.dmg+SK.zap.strikes[2]*SK.zap.strikeDmg[2]+SK.zap.charges[2]*SK.zap.netDmg)+' · '+SK.zap.spdDur[2]+'초 동안 이동 속도 +'+pct(SK.zap.spd[2])+'%')]},
{key:'fog',name:'안개',nodes:[nd('fog','안개 거품',IC2.fog,1,'거품이 안개로 퍼져 '+SK.fog.dur+'초 동안 적이 느려지고 피해 '+SK.fog.dmg+'배 (안개 동안은 거품이 차오르지 않아요)'),nd('thick','짙은 안개',IC4.thick,1,SK.thick.dur+'초 동안 적이 더 느려지고 피해 '+SK.thick.dmg+'배'),nd('world','시간 정지',IC4.world,2,SK.world.stop+'초 동안 적이 완전히 멈추고 피해 '+SK.world.dmg+'배')]},
],
ults:[nd('chain','연속 거품',IC2.chain,3,'거품 대기 시간 -'+pct(1-SK.chain.cd)+'%')]},
{key:'guard',name:'방어',col:'#5f83d6',
trunk:[nd('body','건강한 몸',IC.body,1,'최대 하트 +1 · 맞을 때 평형 손실 -'+pct(1-SK.body.loss)+'%'),nd('shell','연잎 보호막',IC2.shell,1,'전투마다 공격을 1번 막아요'),nd('balance','균형 감각',IC4.balance,1,'평형 회복 +'+SK.balance.rec+' · 맞은 뒤 무적 시간 +'+SK.balance.inv+'초')],
paths:[
{key:'mend',name:'회복',nodes:[nd('regrow','연잎 재생',IC4.regrow,1,'깨진 보호막이 '+SK.regrow+'초 뒤 다시 생겨요'),nd('heal','새싹 치유',I.sprout,1,'보스전에서 '+SK.heal.t+'초마다 하트 +1'),nd('cycle','자연 치유',IC4.cycle,2,'보호막과 하트 회복이 '+pct(1-SK.cycle.k)+'% 빨라져요')]},
{key:'wall',name:'철벽',nodes:[nd('grit','단단함',IC4.grit,1,'최대 하트 +1 · 맞아도 밀리지 않아요'),nd('heart','오뚝이',IC4.heart,1,'최대 하트 +1 · 맞은 뒤 무적 시간 +'+SK.grit+'초'),nd('fortress','철벽 요새',IC4.fortress,2,'최대 하트 +1 · 보호막 +1겹')]},
{key:'ctr',name:'반격',nodes:[nd('thorns','가시 갑옷',IC2.thorns,1,'보호막이 깨질 때 주변에 피해 '+SK.thorns.dmg+', 맞은 보스는 '+SK.thorns.stun+'초 움찔(지금!)'),nd('storm','가시 폭풍',IC4.storm,1,'맞을 때 주변에 피해 '+SK.storm.dmg+' (가시 갑옷보다 넓게)'),nd('ramsar','분노',I.shield,2,'맞으면 '+SK.ramsar.t+'초 동안 모든 피해 +'+pct(SK.ramsar.k-1)+'%')]},
],
ults:[nd('gusa','구사일생',IC4.gusa,3,'쓰러질 공격을 1번 버티고 '+SK.gusa.t+'초 동안 무적 + 분노(피해 +'+pct(SK.gusa.k-1)+'%) (전투마다 1번)')]},
{key:'eco',name:'보호종',col:'#e5a51a',
trunk:[nd('gear','함께 탐사',IC2.gear,0,'보호종 친구와 함께 다녀요')],
paths:[
{key:'otter',name:'수달',nodes:[nd('otter1','달이 돌진',IC3.otter,0,SK.otter.cd[1]+'초마다 직선으로 돌진해 피해 '+SK.otter.dmg),nd('otter2','날렵한 달이',IC3.otter,1,'돌진 간격 '+SK.otter.cd[1]+'초 → '+SK.otter.cd[2]+'초'),nd('otter3','달이의 응원',IC3.otter,2,'칠 때마다 평형 +'+SK.otter.gauge+' · 보스를 '+SK.otter.boss+'번 치면 하트 +1')]},
{key:'turtle',name:'남생이',nodes:[nd('turtle1','단단이 박치기',IC3.turtle,0,SK.turtle.cd[1]+'초마다 주변을 쿵! 피해 '+SK.turtle.dmg),nd('turtle2','단단이 붙잡기',IC3.turtle,1,'맞은 적이 '+SK.turtle.frz+'초 멈춰요 · 보스 빈틈 +'+SK.turtle.grab+'초'),nd('turtle3','등껍질 선물',IC3.turtle,2,'칠 때마다 평형 +'+SK.turtle.gauge+' · '+SK.turtle.shellN+'번 치면 등껍질 보호막')]},
{key:'cat',name:'삵',nodes:[nd('cat1','점박이 덮치기',IC3.cat,0,SK.cat.cd[1]+'초마다 가장 튼튼한 적을 덮쳐 피해 '+SK.cat.dmg[1]),nd('cat2','재빠른 점박이',IC3.cat,1,'덮치기 간격 '+SK.cat.cd[1]+'초 → '+SK.cat.cd[2]+'초'),nd('cat3','날카로운 발톱',IC3.cat,2,'덮치기 피해 '+SK.cat.dmg[2]+' → '+SK.cat.dmg[3])]},
],
ults:[nd('assemble','보호종 어셈블',IC4.assemble,3,SK.assemble.every+'초마다 남은 두 친구가 와서 가까운 적을 한 번씩 공격 · 피해 '+SK.assemble.dmg+' × 2 = '+SK.assemble.dmg*2)]},
];
const NODE={},FNODE={};
TREE.forEach(b=>{b.nodes=[];
b.trunk.forEach((n,k)=>{n.kind='trunk';n.k=k;b.nodes.push(n)});
b.paths.forEach(p=>p.nodes.forEach((n,k)=>{n.kind='path';n.k=k;n.path=p;if(b.key==='eco'){n.fr=[p.key,k+1];FNODE[n.id]=n.fr}b.nodes.push(n)}));
b.ults.forEach((n,k)=>{n.kind='ult';n.k=k;b.nodes.push(n)});
b.nodes.forEach(n=>{n.b=b;NODE[n.id]=n})});
const SYN_MAP={master:()=>L('master'),bolt:()=>L('thunder')?2:L('flash')?1:0,mist:()=>L('world')?2:0,ebb:()=>L('wave2')?2:L('wave')?1:0,gusa:()=>L('gusa'),proxy:()=>L('assemble'),avengers:()=>L('kheron')};
const syn=id=>SYN_MAP[id]?SYN_MAP[id]():0;
const FIRST_WAVE_PTS=1;
const NET_R=[38,51.04,58.08,65.12];
const BOSS_SZ=1.45;
const BOSS=[
{k:'blue',art:'bblue',name:'왕 블루길',hp:42,r:70,tip:'돌진이 끝나고 지쳤을 때가 기회예요. 분홍 줄 밖으로 피해요!'},
{k:'frog',art:'bfrog',name:'왕 황소개구리',hp:46,r:76,tip:'충격파는 거품 방울로 막아요. 착지 직후가 기회예요!'},
{k:'nutria',art:'bnutria',name:'왕 뉴트리아',hp:68,r:67,hitK:.85,tip:'땅속으로 숨으면 솟아오르는 자리를 피하고, 공격이 끝난 뒤의 틈을 노려요!'},
{k:'vine',art:'bvine',name:'왕 가시박',hp:93,r:86,tip:'몸통은 단단해요. 주변의 뿌리를 모두 잘라야 틈이 생겨요!'},
];
