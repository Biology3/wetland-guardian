/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const SC_INK='#1f2a24';
const STORY_SCENE_LOW=['흔적1','흔적2','흔적3','물결3','알','알점프','물고기떼','둑무너짐','둑구멍','둑구멍_쑥','노을물','몰려옴','그림자','물보라'];
function scLeaf(x,y,s,rot,d,col){let pts=[];for(let k=0;k<=90;k++){const a=-Math.PI+k*Math.PI*2/90,u=a+Math.PI/2,r=(.5+.5*Math.pow(1-Math.abs(Math.sin(2.5*u)),2.4))*(Math.abs(Math.sin(u/2))<.2?.35:1);pts.push((Math.cos(a)*60*r).toFixed(1)+' '+(-30+Math.sin(a)*54*r).toFixed(1))}
const veins=[-90,-18,-162,54,-234].map(g=>{const r=Math.PI/180*g;return `M0 -24L${(Math.cos(r)*52).toFixed(1)} ${(-30+Math.sin(r)*48).toFixed(1)}`}).join('');
const c=col||['#7fb547','#6aa53c','#8fc154'][Math.round(x+y)%3];
return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><g class="scGrow" style="animation-delay:${d.toFixed(2)}s"><path d="M${pts.join('L')}Z" fill="${c}" stroke="${SC_INK}" stroke-width="${(4.5/s).toFixed(1)}" stroke-linejoin="round"/><path d="${veins}" stroke="#4f8a33" stroke-width="${(3/s).toFixed(1)}" fill="none" stroke-linecap="round"/></g></g>`}
function scCurl(x,y,s,d){return `<g transform="translate(${x} ${y}) scale(${s})"><path class="scGrow" style="animation-delay:${d.toFixed(2)}s" d="M0 0C20 -30 50 -40 60 -20C68 -4 52 6 44 -4C38 -12 48 -20 54 -14" fill="none" stroke="#3f7a2e" stroke-width="5" stroke-linecap="round"/></g>`}
const scSunset=(o=.42)=>`<defs><linearGradient id="scSun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a5a" stop-opacity="${o}"/><stop offset=".55" stop-color="#ff7a7a" stop-opacity="${(o*.7).toFixed(2)}"/><stop offset="1" stop-color="#7a3d6a" stop-opacity="${(o*.6).toFixed(2)}"/></linearGradient></defs><rect x="-40" y="-40" width="1680" height="980" fill="url(#scSun)" class="scFadeIn"/>`;
function scRipples(cx,cy,d=0,loop=true,n=3){let s='';for(let i=0;i<n;i++)s+=`<ellipse class="scRip${loop?'':' once'}" cx="${cx}" cy="${cy}" rx="110" ry="26" style="animation-delay:${(d+i*.55).toFixed(2)}s"/>`;return s}
function scStone(x,y,s=1){const vein=[-150,-120,-30,0,30,60,90,120,150,180,210].map(a=>{const r=Math.PI/180*a;return `M0 0L${(150*Math.cos(r)).toFixed(1)} ${(44*Math.sin(r)).toFixed(1)}`}).join('');
return `<g transform="translate(${x} ${y}) scale(${s})"><g class="scBob">
<ellipse cx="0" cy="22" rx="200" ry="40" fill="none" stroke="#e8f6ff" stroke-width="4" opacity=".55"/>
<path d="M0 10L41.4 -36.4A160 48 0 1 0 102.8 -26.8Z" fill="#3f7a2e" stroke="${SC_INK}" stroke-width="7" stroke-linejoin="round"/>
<path d="M0 0L41.4 -46.4A160 48 0 1 0 102.8 -36.8Z" fill="#78b84e" stroke="${SC_INK}" stroke-width="7" stroke-linejoin="round"/>
<path d="${vein}" stroke="#5c9a3e" stroke-width="4" stroke-linecap="round" fill="none"/>
<ellipse cx="-60" cy="-14" rx="54" ry="10" fill="#b5e08a" opacity=".55"/>
<g transform="rotate(-7) translate(-10 -8)"><path d="M-66 -40L60 -47L68 20L-60 27Z" fill="#eee4c7" stroke="${SC_INK}" stroke-width="5" stroke-linejoin="round"/>
<path d="M-60 -6C-40 2 -30 -14 -8 -4S30 16 62 4L66 20L-60 27Z" fill="#cdbd96" opacity=".75"/>
<path d="M-46 -28h82M-48 -14h90" stroke="#6d5d45" stroke-width="3.5" stroke-linecap="round" opacity=".4"/></g>
<g fill="#e6fbff" stroke="${SC_INK}" stroke-width="2.5"><circle cx="72" cy="-6" r="7"/><circle cx="-104" cy="2" r="5"/></g>
<g fill="#cfeeff" class="scDrip"><circle cx="64" cy="22" r="5"/><circle cx="-52" cy="28" r="4"/></g></g></g>`}
function scPrint(x,y,r,o){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.45)" opacity="${o}"><ellipse cx="0" cy="6" rx="15" ry="12" fill="#3a2c1f"/>${[-17,-9,0,9,17].map((dx,i)=>`<circle cx="${dx}" cy="${-12+Math.abs(i-2)*4}" r="5.2" fill="#3a2c1f"/>`).join('')}<ellipse cx="-3" cy="3" rx="6" ry="3.5" fill="#a9d4e6" opacity=".7"/></g>`}
function scBank(notch){return `<path d="M-40 330L470 352C560 356 610 392 640 470C660 540 700 640 730 900H-40Z" fill="#7d5b3b" stroke="${SC_INK}" stroke-width="7" stroke-linejoin="round"/>
<path d="M-40 330L470 352C540 355 585 378 612 420" fill="none" stroke="#5f9a3c" stroke-width="22" stroke-linecap="round"/>
<g stroke="#4f8a33" stroke-width="7" stroke-linecap="round">${[40,120,210,300,390,450].map(x=>`<path d="M${x} 340l-8 -26M${x+10} 341l4 -30M${x+20} 342l12 -22"/>`).join('')}</g>
<g stroke="#5e4329" stroke-width="5" stroke-linecap="round" opacity=".6"><path d="M90 470q60 10 120 0M260 540q70 14 150 -4M120 640q90 12 190 -6M470 470q40 12 80 6"/></g>
${notch?`<path d="M455 352C480 400 520 430 572 418C600 410 612 392 616 380" fill="#4a3320" stroke="${SC_INK}" stroke-width="6" stroke-linejoin="round"/>`:''}`}
const STORY_SCENES={
알:()=>{let s='';for(const [cx,cy] of [[520,580],[760,650],[980,560],[660,500]]){s+=`<g class="scBob" style="animation-delay:${(-cx/300).toFixed(2)}s"><g transform="translate(${cx} ${cy}) scale(1.8)"><ellipse cx="0" cy="4" rx="46" ry="14" fill="#dff2f6" opacity=".35"/>`;for(let i=0;i<11;i++){const a=i*2.4,r=i?10+i*2.6:0,x=(Math.cos(a)*r).toFixed(1),y=(Math.sin(a)*r*.42).toFixed(1);s+=`<circle cx="${x}" cy="${y}" r="7.5" fill="#fbfbe9" fill-opacity=".85" stroke="#4f6349" stroke-width="2"/><circle cx="${x}" cy="${y}" r="2.4" fill="#33402e"/>`}s+='</g></g>'}return s},
알점프:()=>STORY_SCENES.알()+scRipples(700,640,0,false,2)+scRipples(1060,640,.95,false,3)+
`<g class="scFish"><g transform="scale(1.6)"><path d="M-52 0C-30 -26 30 -28 50 0C30 26 -30 26 -52 0Z" fill="#5b7f99" stroke="${SC_INK}" stroke-width="6"/><path d="M-48 0L-80 -22L-76 22Z" fill="#4a6a82" stroke="${SC_INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-10 -20v38M10 -22v42" stroke="#3e5b70" stroke-width="5"/><circle cx="34" cy="-6" r="5" fill="${SC_INK}"/><circle cx="22" cy="2" r="6" fill="#1b2a35"/></g></g>`+
`<g class="scSpray"><circle cx="700" cy="610" r="9"/><circle cx="680" cy="590" r="6"/><circle cx="724" cy="586" r="7"/><circle cx="1060" cy="610" r="9"/><circle cx="1040" cy="586" r="6"/><circle cx="1084" cy="592" r="7"/></g>`,
물고기떼:()=>`<g class="scShoal">${[[520,560],[580,600],[640,548],[700,620],[460,620],[760,580],[620,660]].map(([x,y],i)=>`<g class="scSwim" style="animation-delay:${(-i*.8).toFixed(1)}s"><path transform="translate(${x} ${y})" d="M-20 0C-10 -9 12 -9 20 0C12 9 -10 9 -20 0ZM-18 0L-32 -9L-30 9Z" fill="#1f3a40" opacity=".38"/></g>`).join('')}</g>`,
흔적1:()=>scStone(470,600)+scRipples(800,566,.05),
흔적2:()=>{
const SH='M-40 380C160 372 380 392 540 450C660 494 730 560 770 640C800 700 812 800 800 900H-40Z';
return `<path d="${SH}" fill="#8a6542" stroke="${SC_INK}" stroke-width="7" stroke-linejoin="round"/>
<path d="M540 450C660 494 730 560 770 640C800 700 812 800 800 900" fill="none" stroke="#5a3f27" stroke-width="70" opacity=".55"/>
<path d="M548 456C666 500 736 566 776 646C806 706 818 800 806 900" fill="none" stroke="#e8f6ff" stroke-width="6" stroke-dasharray="26 14" stroke-linecap="round" opacity=".8"/>
<path d="M-40 380C160 372 380 392 540 450" fill="none" stroke="#5f9a3c" stroke-width="26" stroke-linecap="round"/>
<g stroke="#4f8a33" stroke-width="7" stroke-linecap="round">${[20,100,190,280,370,450].map(x=>`<path d="M${x} ${384+x*.05}l-8 -28M${x+10} ${385+x*.05}l4 -32M${x+20} ${386+x*.05}l12 -24"/>`).join('')}</g>
<g stroke="#6e5034" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"><path d="M80 500q90 -8 170 10M140 760q110 4 200 -10M420 520q60 6 110 22"/></g>
<g fill="#a08a6e" stroke="${SC_INK}" stroke-width="4">${[[120,580,16],[210,700,12],[470,780,18],[60,820,13]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.6}"/>`).join('')}</g>`+
[[260,700,62,.9],[340,668,48,.9],[410,676,66,.85],[490,636,52,.8],[560,640,70,.7],[630,604,58,.55],[700,612,74,.35]].map(p=>scPrint(...p)).join('')+scStone(915,590,.7)+scRipples(915,606,.1)},
흔적3:()=>scStone(440,600)+`<svg x="520" y="80" width="600" height="500" viewBox="-300 -500 600 500" overflow="hidden"><g><g class="scTail"><path d="M-52 40C-56 -20 -40 -84 4 -136C20 -156 42 -160 46 -146C48 -134 34 -118 26 -96C12 -60 18 -10 36 40Z" fill="#7a5233" stroke="${SC_INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-20 30C-22 -20 -10 -70 18 -112" stroke="#a7774e" stroke-width="9" fill="none" stroke-linecap="round" opacity=".8"/><path d="M14 -40C8 -20 10 10 20 36" stroke="#5c3b22" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><g stroke="#5c3b22" stroke-width="3" stroke-linecap="round"><path d="M-40 0l-10 -6M-36 -40l-10 -4M-20 -80l-10 -2"/></g></g></g></svg><ellipse cx="820" cy="584" rx="80" ry="16" fill="none" stroke="#eaf8ff" stroke-width="5" opacity=".7"/>`+scRipples(820,582,.55),
물결3:()=>scStone(440,600)+scRipples(820,582,0),
갈대:()=>{
const reed=(x,h,i)=>{const dir=x<800?1:-1,b=dir*(30+(i%3)*14),tx=x+b,ty=940-h,c=i%2?'#41662c':'#55803a',d=(-i*.37).toFixed(2);
const leaf=(t,len)=>{const sx=x+b*t*t,sy=940-h*t,e=dir*len;return `<path d="M${sx} ${sy}C${sx+e*.3} ${sy-50} ${sx+e*.75} ${sy-62} ${sx+e} ${sy-40}C${sx+e*.6} ${sy-46} ${sx+e*.3} ${sy-26} ${sx} ${sy-8}Z" fill="${c}" stroke="${SC_INK}" stroke-width="3" stroke-linejoin="round"/>`};
return `<g class="scReed" style="animation-delay:${d}s"><path d="M${x} 940Q${x+b*.25} ${940-h*.5} ${tx} ${ty}" stroke="${SC_INK}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M${x} 940Q${x+b*.25} ${940-h*.5} ${tx} ${ty}" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>${leaf(.35,120+i*6)}${leaf(.6,100)}${i%3!==1?head(tx,ty,b,h):''}</g>`};
const head=(tx,ty,b,h)=>{const a=Math.atan2(.75*b,h/2),ry=42,k=ry-6,cx=tx+Math.sin(a)*k,cy=ty-Math.cos(a)*k,deg=(a*180/Math.PI).toFixed(1);
return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="13" ry="${ry}" transform="rotate(${deg} ${cx.toFixed(1)} ${cy.toFixed(1)})" style="transform-box:view-box;transform-origin:0 0" fill="#dccfa8" stroke="${SC_INK}" stroke-width="4"/>`};
let s='';[[40,600],[110,700],[170,540],[240,660],[310,560],[380,480],[1220,500],[1290,620],[1360,560],[1430,690],[1500,600],[1570,650]].forEach(([x,h],i)=>{s+=reed(x,h,i)});return s},
둑무너짐:()=>scBank(true)+`<g class="scClods">${[[480,380,26],[520,400,34],[560,392,22],[600,410,30],[540,430,18],[500,420,20],[590,380,16],[620,430,24]].map(([x,y,r],i)=>`<g class="scClod" style="animation-delay:${(.08+i*.11).toFixed(2)}s;--dx:${(i%2?1:-1)*(10+i*6)}px;--rot:${(i%2?1:-1)*(120+i*30)}deg"><g transform="translate(${x} ${y})"><path style="animation-delay:${(.08+i*.11).toFixed(2)}s" d="M${-r} ${-r*.4}L${-r*.3} ${-r}L${r*.8} ${-r*.6}L${r} ${r*.5}L${-r*.2} ${r}Z" fill="#6a4a2e" stroke="${SC_INK}" stroke-width="4" stroke-linejoin="round"/></g></g>`).join('')}</g>
<g class="scDust">${[[520,380],[580,400],[480,410]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="34" style="animation-delay:${(.1+i*.2).toFixed(1)}s"/>`).join('')}</g>`+scRipples(700,700,.7,false,2)+scRipples(760,690,1,false,2),
둑구멍:()=>scBank(false)+[[150,650,40,26],[340,560,52,34],[540,470,34,22]].map(([x,y,rx,ry])=>`<path d="M${x-rx} ${y}C${x-rx} ${y-ry*1.2} ${x+rx} ${y-ry*1.3} ${x+rx} ${y+2}C${x+rx*.6} ${y+ry*.7} ${x-rx*.7} ${y+ry*.6} ${x-rx} ${y}Z" fill="#21150c" stroke="${SC_INK}" stroke-width="6" stroke-linejoin="round"/><path class="scLeak" d="M${x+rx*.2} ${y+ry*.5}C${x+12} ${y+ry+40} ${x+34} ${y+ry+80} ${x+64} ${Math.min(840,y+ry+150)}" stroke="#bfe6ff" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')+
[[880,600,1],[1080,660,-1],[780,700,-1],[1200,560,1]].map(([x,y,f],i)=>`<g class="scBob" style="animation-delay:${-i*.7}s"><g transform="translate(${x} ${y}) scale(${f} 1)"><g stroke="#8a6a46" stroke-width="4" stroke-linecap="round" fill="none"><path d="M-30 4q-6 16 -16 22M-6 6q2 14 -6 24M20 4q8 12 4 22"/></g><path d="M-80 2C-60 -10 -30 -4 -10 -12C14 -18 46 -6 80 -2C54 6 20 12 -10 10C-40 12 -64 10 -80 2Z" fill="#7cb94f" stroke="${SC_INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-60 0C-30 -6 0 -4 30 -6M-40 6C-10 4 20 6 50 2" stroke="#4f8a33" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M10 -10C30 -30 50 -32 66 -26C52 -22 34 -14 18 -6Z" fill="#9fd36e" stroke="${SC_INK}" stroke-width="3" stroke-linejoin="round"/></g></g>`).join(''),
둑구멍_쑥:()=>STORY_SCENES.둑구멍()+`<g transform="translate(340 556) scale(1.6)"><g class="scSnout">
<circle cx="-17" cy="-20" r="4.5" fill="#fff6c8" opacity=".9"/><circle cx="17" cy="-20" r="4.5" fill="#fff6c8" opacity=".9"/>
<path d="M-30 18C-34 -4 -20 -16 0 -16C20 -16 34 -4 30 18C18 24 -18 24 -30 18Z" fill="#8a6440" stroke="${SC_INK}" stroke-width="5" stroke-linejoin="round"/>
<path d="M-14 -6C-8 -12 8 -12 14 -6C12 2 -12 2 -14 -6Z" fill="#3a2a1e" stroke="${SC_INK}" stroke-width="3"/>
<circle cx="-5" cy="-6" r="2" fill="#120c08"/><circle cx="5" cy="-6" r="2" fill="#120c08"/>
<path d="M0 0V8M0 8C-6 13 -12 12 -15 8M0 8C6 13 12 12 15 8" stroke="${SC_INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M-8 14H8V32C8 35 -8 35 -8 32Z" fill="#f08a24" stroke="${SC_INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M0 14V34" stroke="${SC_INK}" stroke-width="3"/>
<g stroke="#efe3c4" stroke-width="2.5" stroke-linecap="round" fill="none"><path d="M-22 4C-40 0 -54 -2 -66 -8M-22 9C-42 10 -56 12 -68 16M-20 13C-36 18 -48 24 -58 32"/><path d="M22 4C40 0 54 -2 66 -8M22 9C42 10 56 12 68 16M20 13C36 18 48 24 58 32"/></g>
</g></g>`,
덩굴:()=>{let s='<g class="scVines">';const L=[];
for(let row=0;row<5;row++)for(let i=0;i<11;i++){const x=-40+i*160+(row%2)*80+((i*37+row*53)%40-20),y=600+row*70+((i*29)%30-15);L.push([x,y,.95+row*.32,((i*47+row*31)%50)-25])}
L.forEach(([x,y,k,r])=>{s+=scLeaf(x,y,k,r,.1+x/1600*1.6+(4-(y-600)/70)*.08)});[[300,620],[700,600],[1080,640],[1420,610],[500,700]].forEach(([x,y])=>{s+=scCurl(x,y,1.3,.5+x/1600*1.6)});return s+'</g>'},
노을물:()=>scSunset(.38)+`<g class="scGlint">${[[700,600,180],[820,650,240],[640,700,140],[900,560,120],[760,740,200]].map(([x,y,w],i)=>`<path d="M${x-w/2} ${y}h${w}" stroke="#ffd9a0" stroke-width="7" stroke-linecap="round" style="animation-delay:${(-i*.45).toFixed(2)}s"/>`).join('')}</g>`+scRipples(820,640,.3),
몰려옴:()=>{const one=(x,y,body,d)=>`<g class="scCharge" style="animation-delay:${d}s"><path class="scWake" d="M${x-150} ${y-190}L${x} ${y-30}L${x+150} ${y-190}" fill="none" stroke="#fff1e0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/><path class="scWake" style="animation-delay:.5s" d="M${x-90} ${y-200}L${x} ${y-90}L${x+90} ${y-200}" fill="none" stroke="#ffe2c4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/><g transform="translate(${x} ${y})" filter="url(#scBlur2)" fill="#1e1216" opacity=".85">${body}</g></g>`;
return `<defs><filter id="scBlur2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7"/></filter></defs>`+scSunset(.5)+
one(500,560,`<ellipse rx="34" ry="62"/><path d="M0 50L-26 96L26 96Z"/>`,0)+
one(800,610,`<ellipse rx="70" ry="54"/><path d="M-50 20L-110 70L-96 84L-40 44ZM50 20L110 70L96 84L40 44Z"/>`,.25)+
one(1100,570,`<ellipse rx="44" ry="80"/><ellipse cy="-74" rx="30" ry="28"/><path d="M-6 70C-14 120 10 150 -4 200" stroke="#24161a" stroke-width="16" fill="none" stroke-linecap="round"/>`,.5)+
scRipples(500,560,.6)+scRipples(800,610,.9)+scRipples(1100,570,1.2)},
덩굴휘감기:()=>{const vine=(d,w,dl)=>`<path class="scDraw" style="animation-delay:${dl}s" d="${d}" fill="none" stroke="${SC_INK}" stroke-width="${w+8}" stroke-linecap="round"/><path class="scDraw" style="animation-delay:${dl}s" d="${d}" fill="none" stroke="#4f8a33" stroke-width="${w}" stroke-linecap="round"/>`;
return STORY_SCENES.덩굴()+`<g class="scSquirm">`+
vine('M-40 880C200 780 300 900 480 800S760 700 860 780S1000 880 1100 820',22,0)+
vine('M-40 700C160 640 260 760 420 700S640 600 760 690C840 750 900 720 960 680',16,.25)+
vine('M1640 860C1460 800 1380 880 1240 820S1040 760 980 800',20,.4)+
`<g fill="#9fd36e" stroke="${SC_INK}" stroke-width="4">${[[300,858],[640,742],[900,776],[560,700],[1300,836]].map(([x,y],i)=>`<path class="scGrow" style="animation-delay:${(.4+i*.12).toFixed(2)}s" d="M${x} ${y}l-10 -26l16 14z"/>`).join('')}</g></g>`+
scCurl(1050,800,1.6,.8)+scCurl(950,670,1.4,.9)},
그늘눈:()=>`<defs><radialGradient id="scDark" cx=".42" cy=".6" r=".75"><stop offset="0" stop-color="#0b120d" stop-opacity=".55"/><stop offset=".6" stop-color="#050806" stop-opacity=".85"/><stop offset="1" stop-color="#000" stop-opacity=".95"/></radialGradient></defs>`+
`<rect x="-40" y="-40" width="1680" height="980" fill="url(#scDark)" class="scFadeIn"/>`+
`<g opacity=".55">${STORY_SCENES.덩굴()}</g>`+
`<g transform="translate(640 560)"><g class="scLurk">
<g class="scBlink"><ellipse cx="-86" cy="0" rx="34" ry="20" fill="#ff3b2e"/><ellipse cx="86" cy="0" rx="34" ry="20" fill="#ff3b2e"/><ellipse cx="-80" cy="-2" rx="9" ry="16" fill="#1a0705"/><ellipse cx="92" cy="-2" rx="9" ry="16" fill="#1a0705"/><circle cx="-96" cy="-8" r="6" fill="#fff"/><circle cx="76" cy="-8" r="6" fill="#fff"/></g>
<g fill="none" stroke="#ff7a5a" stroke-width="6" stroke-linecap="round" opacity=".7"><path d="M-130 -34l50 16M130 -34l-50 16"/></g>
<path d="M-26 92H26V160C26 170 -26 170 -26 160Z" fill="#f08a24" stroke="${SC_INK}" stroke-width="7" stroke-linejoin="round"/><path d="M0 92V166" stroke="${SC_INK}" stroke-width="6"/>
<g stroke="#e9dcc0" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"><path d="M-50 90C-120 80 -170 76 -220 60M-50 104C-120 108 -170 116 -220 130M50 90C120 80 170 76 220 60M50 104C120 108 170 116 220 130"/></g></g></g>`,
덩굴그늘:()=>`<rect x="-40" y="-40" width="1680" height="980" fill="url(#scDark2)"/><defs><radialGradient id="scDark2" cx=".5" cy=".55" r=".8"><stop offset="0" stop-color="#2a0c08" stop-opacity=".55"/><stop offset=".7" stop-color="#060806" stop-opacity=".85"/><stop offset="1" stop-color="#000" stop-opacity=".95"/></radialGradient></defs><g opacity=".5">${STORY_SCENES.덩굴()}</g>`,
물보라:()=>`<g class="scBurst"><path d="M600 640C580 520 620 420 660 330C680 420 700 380 720 280C740 380 770 330 800 230C820 340 850 390 880 300C900 400 930 430 960 360C980 460 1000 540 1000 640Z" fill="#e8f7ff" fill-opacity=".72" stroke="#ffffff" stroke-width="9" stroke-linejoin="round"/><path d="M660 640C650 560 680 480 710 420M760 640C760 540 780 460 800 380M860 640C870 560 880 500 900 450" stroke="#9fd8ef" stroke-width="8" fill="none" stroke-linecap="round"/></g>`+
`<g class="scSpray">${[[560,420],[620,300],[700,220],[800,170],[900,230],[980,300],[1040,420],[640,360],[960,360]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${12+(x%3)*5}"/>`).join('')}</g>`+scRipples(800,650,0,false,3)+scRipples(800,650,.5),
쾅:()=>{let rays='';for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r1=230+(i%2)*60,x1=800+Math.cos(a)*r1,y1=450+Math.sin(a)*r1*.8,x2=800+Math.cos(a)*1100,y2=450+Math.sin(a)*900;rays+=`M${x1.toFixed(0)} ${y1.toFixed(0)}L${x2.toFixed(0)} ${y2.toFixed(0)}`}
let star='';for(let i=0;i<20;i++){const a=i/20*Math.PI*2-Math.PI/2,r=i%2?110:230;star+=(i?'L':'M')+(800+Math.cos(a)*r).toFixed(0)+' '+(450+Math.sin(a)*r*.85).toFixed(0)}
return `<rect x="-40" y="-40" width="1680" height="980" fill="#fff6d8" opacity=".35"/><path d="${rays}" stroke="#fff" stroke-width="10" opacity=".85"/>`+
`<g class="scPow"><path d="${star}Z" fill="#ffd95b" stroke="${SC_INK}" stroke-width="9" stroke-linejoin="round"/><text x="800" y="490" text-anchor="middle" font-family="Jua,sans-serif" font-size="150" fill="#ff5a3d" stroke="${SC_INK}" stroke-width="10" paint-order="stroke">쾅!</text></g>`+
`<g class="scFling"><g fill="#3a2a1e" opacity=".8"><ellipse cx="0" cy="0" rx="70" ry="50"/><circle cx="56" cy="-30" r="30"/><path d="M-60 10C-110 20 -150 0 -180 -30" stroke="#3a2a1e" stroke-width="14" fill="none" stroke-linecap="round"/></g></g>`},
그림자:()=>`<defs><filter id="scBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter></defs>`+scSunset(.3)+
`<g class="scShadow"><g filter="url(#scBlur)" fill="#080d0c" opacity=".82"><ellipse cx="0" cy="0" rx="300" ry="120"/><ellipse cx="-180" cy="-70" rx="70" ry="54"/><ellipse cx="-180" cy="70" rx="70" ry="54"/><path d="M200 -60C320 -140 380 -60 300 0C380 60 320 140 200 60Z"/></g></g>`+scRipples(560,520,1)+scRipples(1000,500,1.5),
};
function scSign({leaf=false,frog=false,night=false}={}){
const wood=night?'#7a6448':'#b68a58',dark=night?'#4f3f2c':'#8a643c';
return `<g transform="translate(800 470)">
<ellipse cx="0" cy="300" rx="260" ry="34" fill="#2a3a22" opacity=".35"/>
<rect x="-26" y="40" width="52" height="270" rx="8" fill="${dark}" stroke="${SC_INK}" stroke-width="8"/>
<g class="scGrow" style="animation-delay:.1s"><rect x="-370" y="-150" width="740" height="230" rx="22" fill="${wood}" stroke="${SC_INK}" stroke-width="9"/>
<path d="M-340 -100H340M-340 -30H340M-340 40H340" stroke="${dark}" stroke-width="4" opacity=".5"/>
<circle cx="-345" cy="-125" r="9" fill="${SC_INK}"/><circle cx="345" cy="-125" r="9" fill="${SC_INK}"/>
<text x="0" y="-52" text-anchor="middle" font-family="Jua,sans-serif" font-size="58" fill="#3a2614">파랑이 · 개굴이 · 앞니 · 덩굴이</text>
<text x="0" y="28" text-anchor="middle" font-family="Jua,sans-serif" font-size="34" fill="#4a3420">사람이 데려와서, 사람 때문에 떠난 아이들</text></g>
${leaf?`<g class="scGrow" style="animation-delay:${night?0:.9}s">${scLeaf(250,300,1.15,-24,0,'#b89a5a')}</g>`:''}
${frog?`<g class="scHop"><g transform="translate(250 -186)"><ellipse cx="0" cy="0" rx="56" ry="40" fill="#8a9a4a" stroke="${SC_INK}" stroke-width="7"/><path d="M-50 18C-80 30 -84 44 -62 44M50 18C80 30 84 44 62 44" fill="none" stroke="${SC_INK}" stroke-width="7" stroke-linecap="round"/><circle cx="-24" cy="-30" r="15" fill="#fff" stroke="${SC_INK}" stroke-width="5"/><circle cx="24" cy="-30" r="15" fill="#fff" stroke="${SC_INK}" stroke-width="5"/><circle cx="-22" cy="-30" r="6" fill="${SC_INK}"/><circle cx="26" cy="-30" r="6" fill="${SC_INK}"/><path d="M-16 4Q0 14 16 4" fill="none" stroke="${SC_INK}" stroke-width="5" stroke-linecap="round"/><g class="scCroak"><ellipse cx="0" cy="22" rx="26" ry="16" fill="#f3e6a8" stroke="${SC_INK}" stroke-width="5"/></g></g>
<text class="scSay" x="320" y="-270" font-family="Jua,sans-serif" font-size="56" fill="#fff8d0" stroke="${SC_INK}" stroke-width="8" paint-order="stroke">맹꽁…</text></g>`:''}</g>`;
}
Object.assign(STORY_SCENES,{
잎흩날림:()=>{let s='';for(let i=0;i<26;i++){const x=80+((i*263)%1440),y=-60-((i*97)%300),r=(i*53)%360;s+=`<g class="scFall" style="animation-delay:${(i%9*.22).toFixed(2)}s;--dx:${((i%5)-2)*60}px">${scLeaf(x,y,.55+(i%4)*.12,r,0,['#9fb85a','#b8a858','#7fa64a','#c49a52'][i%4])}</g>`}return s},
철문빛:()=>`<defs><radialGradient id="scDoorG"><stop offset="0" stop-color="#bfefff" stop-opacity=".95"/><stop offset=".4" stop-color="#5fc8ff" stop-opacity=".55"/><stop offset="1" stop-color="#2a8cff" stop-opacity="0"/></radialGradient></defs><g class="scDoor"><ellipse cx="467" cy="700" rx="150" ry="60" fill="url(#scDoorG)" opacity=".55"/><path d="M420 590V705M514 590V705M424 706H512" stroke="#cff4ff" stroke-width="4" stroke-linecap="round"/><path d="M420 590V705M514 590V705" stroke="#5fc8ff" stroke-width="12" stroke-linecap="round" opacity=".35"/></g>`,
덩굴손:()=>`<g class="scDraw" style="animation-delay:.3s"><path d="M760 700C820 640 900 650 930 600C960 550 1010 560 1030 590C1046 616 1020 640 1000 626C984 614 994 596 1010 600" fill="none" stroke="${SC_INK}" stroke-width="12" stroke-linecap="round"/><path d="M760 700C820 640 900 650 930 600C960 550 1010 560 1030 590C1046 616 1020 640 1000 626C984 614 994 596 1010 600" fill="none" stroke="#6faa45" stroke-width="6" stroke-linecap="round"/></g>`,
손바닥잎:()=>{const sk='#f2c9a8',fin=(x,h,r)=>`<rect x="${x-34}" y="${-60-h}" width="68" height="${h+90}" rx="34" fill="${sk}" stroke="${SC_INK}" stroke-width="9" transform="rotate(${r} ${x} 0)"/>`;
return `<g transform="translate(800 560)">${fin(-120,170,-10)}${fin(-40,215,-3)}${fin(40,205,3)}${fin(115,160,10)}
<rect x="-210" y="-30" width="76" height="190" rx="38" fill="${sk}" stroke="${SC_INK}" stroke-width="9" transform="translate(50 40) rotate(-38 -172 150)"/>
<path d="M-170 -40C-180 60 -160 170 -60 220C40 250 140 220 180 140C200 90 190 10 170 -40Z" fill="${sk}" stroke="${SC_INK}" stroke-width="9" stroke-linejoin="round"/>
<path d="M-120 60C-80 110 0 130 80 110M-110 150C-60 180 20 190 90 170" fill="none" stroke="#d9a07c" stroke-width="6" stroke-linecap="round"/></g>`+`<g class="scLand">${scLeaf(800,650,1.9,-14,0,'#7fb547')}</g>`},
팻말:()=>scSign(),
팻말잎:()=>scSign({leaf:true}),
팻말밤:()=>`<circle cx="1320" cy="150" r="70" fill="#fff6d0" opacity=".9"/><circle cx="1320" cy="150" r="140" fill="#fff6d0" opacity=".15"/>`+scSign({leaf:true,night:true}),
팻말맹꽁:()=>`<circle cx="1320" cy="150" r="70" fill="#fff6d0" opacity=".9"/><circle cx="1320" cy="150" r="140" fill="#fff6d0" opacity=".15"/>`+scSign({leaf:true,night:true,frog:true}),
});
function storySceneSvg(name){const f=STORY_SCENES[name];if(!f)return '';return `<svg class="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><g class="scInk">${f()}</g></svg>`}
