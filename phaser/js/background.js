/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function makePond(W,H){return{cx:W/2,cy:H*.56,a:W*.39,b:H*.33}}
function inPondOf(pond,x,y,k=1){const dx=(x-pond.cx)/(pond.a*k),dy=(y-pond.cy)/(pond.b*k);return dx*dx*dx*dx+dy*dy*dy*dy<1}
function pondEdgeOf(pond,t,k=1){const c=Math.cos(t),s=Math.sin(t);return{x:pond.cx+pond.a*k*Math.sign(c)*Math.sqrt(Math.abs(c)),y:pond.cy+pond.b*k*Math.sign(s)*Math.sqrt(Math.abs(s))}}
function loadWetSky(done){done()}
const WET_TOD={
afternoon:{
ground:['#7cc04e','#68ad42','#4f8f35'],patch:['#73b74a','#86c85a','#5c9f3e','#9bd468','#4a8833'],
blade:['#4f8a33','#68a744','#86c45a','#a9dc78'],tree:['#2f6a2e','#3f8236','#58a043','#7fc05a'],
reed:['#4a8a33','#66a843','#86c25a'],plume:['#f7f3e6','#efe8d2','#fffaf0','#e4dcc4'],
water:['#2f5f3a','#2f73c8','#3f8ce0','#68aef0','#a6d4f8'],rock:['#d6ccc4','#efe8e2','#a3988f'],
streak:'#ffffff',haze:'#eaf6ff',glow:'rgba(255,250,225,.18)',vig:.3},
late:{
ground:['#86a44a','#6f8f3c','#55752f'],patch:['#7d9c45','#93ad52','#62823a','#a8bf5e','#4f6e2f'],
blade:['#55742e','#6f8f3a','#93ac4c','#c4cf72'],tree:['#2f5a2a','#43702f','#62893b','#93a852'],
reed:['#4f7a2f','#6f9440','#94ae55'],plume:['#f8eccc','#f0dfb4','#fff6dc','#e2cfa2'],
water:['#304f36','#3d6aa6','#5482c0','#86a8d8','#e8dcb0'],rock:['#d8c8b0','#f0e4cc','#a49480'],
streak:'#fff0c4',haze:'#fff6dc',glow:'rgba(255,215,130,.3)',vig:.36},
dusk:{
ground:['#6c9a44','#5a8838','#456f2f'],patch:['#5f8f3c','#6fa047','#4f7d33','#83b257','#3f6a2c'],
blade:['#46732d','#5d8c39','#78a74c','#9cc768'],tree:['#2b4f29','#3a6532','#4f7e3c','#6e9c52'],
reed:['#3f6b2b','#5a8a3a','#78a84f'],plume:['#f4e6df','#ead2d2','#fbf1ea','#dcc3c6'],
water:['#2c4a3c','#3f6386','#58739f','#8c8ec6','#c9a6c4'],rock:['#c9b8b0','#e6dad3','#97868a'],
streak:'#f6c4bc',haze:'#e8e0ff',glow:'rgba(255,175,110,.32)',vig:.42},
};
Object.assign(WET_TOD,{
storm:{
ground:['#3f6a46','#345c3c','#284a31'],patch:['#3a6442','#47744c','#2f5636','#55835a','#264630'],
blade:['#2f5236','#3f6a45','#5a8a5c','#86ad84'],tree:['#1c3424','#264630','#355d3c','#4d7a52'],
reed:['#33583a','#46704a','#64905f'],plume:['#d9dbe6','#c6c9d8','#eceef6','#b4b8cc'],
water:['#1c2c40','#253f62','#30507a','#4c6c98','#8fa6c8'],rock:['#a9adb6','#c8ccd6','#7b808c'],
streak:'#dfe8ff',haze:'#c8d4f0',glow:'rgba(170,190,255,.16)',vig:.55,rain:true},
valley:{
ground:['#3d5e44','#334f3a','#27402f'],patch:['#3a5a40','#4a6e4c','#2e4a34','#5c8458','#25402c'],
blade:['#335638','#447048','#5f8f58','#88b878'],tree:['#16301f','#21422a','#2f5a36','#47774a'],
reed:['#335a38','#477449','#69965e'],plume:['#e6ecf2','#d4dde8','#f4f8fc','#c2ccd8'],
water:['#1d3346','#2c5578','#3d6e98','#6e9cc4','#cfe6f6'],rock:['#a8adb2','#cfd3d8','#7c8288'],
streak:'#ffffff',haze:'#dceaf8',glow:'rgba(190,200,255,.18)',vig:.5,floor:'slab',grass:.45,
slab:['#8d949b','#a4aab0','#767e86','#b6bcc2']},
ridge:{
ground:['#4a5a3e','#3e4d35','#30402b'],patch:['#475a3c','#56694a','#3a4b32','#66784f','#2f3f29'],
blade:['#3a5034','#4c6640','#6a8452','#93a874'],tree:['#18301f','#233f29','#325435','#4a7148'],
reed:['#3a5636','#4e6e46','#6e8e5c'],plume:['#e2e2ea','#d0d0dc','#f2f2f8','#bcbccc'],
water:['#262c3c','#38466a','#4a5c86','#7484ac','#b8c2e0'],rock:['#a6a6ae','#c8c8d0','#7a7a84'],
streak:'#e8ecff',haze:'#d4dcf4',glow:'rgba(180,170,255,.18)',vig:.52,floor:'flag',grass:.35,wall:true,
slab:['#7f8088','#94959c','#6c6d76','#a7a8ae'],mud:'#5e4a36'},
vine:{
ground:['#2e3c34','#25322c','#1b2622'],patch:['#2c3a32','#38483c','#222e28','#435446','#1a241f'],
blade:['#2f4a2c','#3f6236','#5c8a44','#86b85c'],tree:['#1d3a1a','#2b5224','#3f7030','#5e9a40'],
reed:['#2f5428','#447436','#64984a'],plume:['#d8d0ea','#c4bce0','#ece6f6','#b0a6d0'],
water:['#1a1c30','#2a2e56','#3c3f78','#62619c','#a89cd8'],rock:['#8e9098','#b2b4bc','#62646e'],
streak:'#e0d4ff',haze:'#cfc4f0',glow:'rgba(170,140,255,.2)',vig:.58,floor:'vine',grass:.3,rain:true,
slab:['#3e4248','#4c5058','#33363c','#5a5e66']},
});
const BOSS_TOD=['storm','valley','ridge','vine'];
const WET_COL=WET_TOD.dusk;
function drawWetland(W,H,u,tod='afternoon'){
const pond=makePond(W,H),pondEdge=(t,k)=>pondEdgeOf(pond,t,k),inPond=(x,y,k)=>inPondOf(pond,x,y,k),C=WET_TOD[tod]||WET_TOD.afternoon;
const bg=mk(Math.round(W*u),Math.round(H*u));const x=bg.getContext('2d');x.scale(u,u);
const r=mulberry(11),INKC='#1f2a24',pick=a=>a[Math.floor(r()*a.length)];
const path=k=>{x.beginPath();for(let i=0;i<=140;i++){const p=pondEdge(i/140*TAU,k);i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y)}x.closePath()};
x.lineCap='round';x.lineJoin='round';
let g=x.createLinearGradient(W,0,0,H);g.addColorStop(0,C.ground[0]);g.addColorStop(.5,C.ground[1]);g.addColorStop(1,C.ground[2]);x.fillStyle=g;x.fillRect(0,0,W,H);
for(let i=0;i<W*H/2400;i++){x.globalAlpha=.25+r()*.3;E(x,r()*W,r()*H,16+r()*42,6+r()*14,pick(C.patch),r()*.6-.3)}x.globalAlpha=1;
if(C.floor){
const slab=(cx,cy,w,h)=>{const n=7,pts=[];for(let k=0;k<n;k++){const a=k/n*TAU+r()*.4,rr=.75+r()*.3;pts.push([cx+Math.cos(a)*w*rr,cy+Math.sin(a)*h*rr])}
const tr=()=>{x.beginPath();pts.forEach(([a,b],k)=>{const [c,d]=pts[(k+1)%n],mx=(a+c)/2,my=(b+d)/2;k?x.quadraticCurveTo(a,b,mx,my):x.moveTo(mx,my)});const [a0,b0]=pts[0],[a1,b1]=pts[1];x.quadraticCurveTo(a0,b0,(a0+a1)/2,(b0+b1)/2);x.closePath()};
x.fillStyle='rgba(10,15,20,.35)';x.save();x.translate(3,5);tr();x.fill();x.restore();
tr();x.fillStyle=pick(C.slab);x.fill();x.strokeStyle=INKC;x.lineWidth=2;x.stroke();
x.save();tr();x.clip();x.globalAlpha=.35;E(x,cx-w*.25,cy-h*.3,w*.6,h*.35,'#ffffff');x.globalAlpha=.25;x.strokeStyle='#ffffff';x.lineWidth=2;x.beginPath();x.moveTo(cx-w*.5,cy-h*.1);x.quadraticCurveTo(cx,cy-h*.35,cx+w*.4,cy-h*.2);x.stroke();x.restore();x.globalAlpha=1};
if(C.floor==='slab'||C.floor==='vine'){for(let i=0;i<W*H/5200;i++){const a=r()*W,b=110+r()*(H-110);if(inPond(a,b,1.12))continue;slab(a,b,28+r()*46,16+r()*24)}}
if(C.floor==='flag'){
x.fillStyle=C.mud;x.globalAlpha=.55;x.fillRect(0,100,W,H-100);x.globalAlpha=1;
for(let y=104;y<H+20;y+=26)for(let xx=-20+(y/26%2)*22;xx<W+20;xx+=44){const a=xx+r()*6,b=y+r()*4;if(inPond(a,b,1.1))continue;
x.fillStyle=pick(C.slab);x.strokeStyle=INKC;x.lineWidth=1.6;x.beginPath();if(x.roundRect)x.roundRect(a,b,38+r()*6,20+r()*4,6);else x.rect(a,b,40,22);x.fill();x.stroke();x.globalAlpha=.22;E(x,a+12,b+6,10,4,'#fff');x.globalAlpha=1}
for(let i=0;i<18;i++){const a=r()*W,b=120+r()*(H-140);if(inPond(a,b,1.15))continue;x.globalAlpha=.75;E(x,a,b,18+r()*30,6+r()*9,C.water[3]);x.globalAlpha=.5;E(x,a-4,b-2,8+r()*10,2,'#ffffff');x.globalAlpha=1}}
}
for(let i=0;i<W*H/170*(C.grass??1);i++){const a=r()*W,b=r()*H;if(inPond(a,b,1.05))continue;
const lit=Math.min(1,Math.max(0,(a/W)*.55+(1-b/H)*.45+(r()-.5)*.5)),c=C.blade[Math.min(3,Math.floor(lit*4))],h=5+r()*9,lean=(r()-.5)*7;
x.strokeStyle=c;x.globalAlpha=.55+r()*.35;x.lineWidth=1.2+r()*.9;x.beginPath();x.moveTo(a,b);x.quadraticCurveTo(a+lean*.4,b-h*.6,a+lean,b-h);x.stroke()}
x.globalAlpha=1;
path(1.1);x.fillStyle='rgba(30,55,25,.45)';x.fill();
path(1.045);x.fillStyle='#4a4a33';x.fill();
g=x.createLinearGradient(0,pond.cy-pond.b,0,pond.cy+pond.b);
g.addColorStop(0,C.water[0]);g.addColorStop(.16,C.water[1]);g.addColorStop(.5,C.water[2]);g.addColorStop(.82,C.water[3]);g.addColorStop(1,C.water[4]);
path(1);x.fillStyle=g;x.fill();
x.save();path(1);x.clip();
for(let i=0;i<60;i++){const p=pondEdge(r()*TAU,.9+r()*.12);x.globalAlpha=.22+r()*.18;E(x,p.x,p.y,26+r()*40,12+r()*16,pick(C.tree))}
for(let i=0;i<16;i++){const yy=pond.cy-pond.b*.1+r()*pond.b*1.05,xx=pond.cx+(r()-.5)*pond.a*1.6;x.globalAlpha=.1+r()*.16;E(x,xx,yy,50+r()*120,3+r()*5,C.streak)}
for(let i=0;i<10;i++){const xx=pond.cx+(r()-.5)*pond.a*1.5,yy=pond.cy+(r()-.6)*pond.b;x.globalAlpha=.08+r()*.08;E(x,xx,yy,40+r()*60,18+r()*20,C.haze)}
x.globalAlpha=1;x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=2;
for(let i=0;i<20;i++){const p=pondEdge(r()*TAU,.15+r()*.7),w=12+r()*22;x.beginPath();x.moveTo(p.x-w,p.y);x.quadraticCurveTo(p.x,p.y-4,p.x+w,p.y);x.stroke()}
path(1);x.lineWidth=12;x.strokeStyle='rgba(20,40,30,.35)';x.stroke();
x.restore();
path(1);x.strokeStyle=INKC;x.lineWidth=2.5;x.stroke();
for(let i=0;i<9;i++){const t=r()*TAU,p=pondEdge(t,.45+r()*.42),s2=20+r()*16,rot=r()*TAU;
x.save();x.translate(p.x,p.y);x.rotate(rot);
x.fillStyle='rgba(15,30,40,.3)';x.beginPath();x.arc(3,5,s2,.25,TAU-.25);x.lineTo(3,5);x.fill();
x.fillStyle='#4f9152';x.beginPath();x.arc(0,0,s2,.25,TAU-.25);x.lineTo(0,0);x.closePath();x.fill();x.strokeStyle=INKC;x.lineWidth=2;x.stroke();
x.fillStyle='#6eae68';x.beginPath();x.arc(-s2*.15,-s2*.15,s2*.6,.6,TAU-.4);x.lineTo(-s2*.15,-s2*.15);x.fill();
x.strokeStyle='rgba(30,80,45,.55)';x.lineWidth=1.4;x.beginPath();for(let k=0;k<6;k++){const a=.5+k*(TAU-1)/6;x.moveTo(0,0);x.lineTo(Math.cos(a)*s2*.85,Math.sin(a)*s2*.85)}x.stroke();
x.restore();
if(i%3===0){x.save();x.translate(p.x,p.y);x.lineWidth=1.6;x.strokeStyle=INKC;for(let j=0;j<6;j++){x.rotate(TAU/6);x.beginPath();x.ellipse(0,-9,5.5,10,0,0,TAU);x.fillStyle='#f5aac4';x.fill();x.stroke()}for(let j=0;j<6;j++){x.rotate(TAU/6+.5);E(x,0,-6,3.5,7,'#ffe0ec')}E(x,0,0,4,4,'#ffd84a');x.restore()}}
const rock=(bx,by,w)=>{const h=w*(.55+r()*.2),rot=(r()-.5)*.6;
x.fillStyle='rgba(20,30,20,.35)';x.beginPath();x.ellipse(bx+3,by+h*.5,w*1.05,h*.45,rot,0,TAU);x.fill();
x.fillStyle=INKC;x.beginPath();x.ellipse(bx,by,w+2.4,h+2.4,rot,0,TAU);x.fill();
x.fillStyle=C.rock[0];x.beginPath();x.ellipse(bx,by,w,h,rot,0,TAU);x.fill();
x.fillStyle=C.rock[1];x.beginPath();x.ellipse(bx-w*.22,by-h*.3,w*.62,h*.45,rot,0,TAU);x.fill();
x.strokeStyle=C.rock[2];x.lineWidth=1.6;x.beginPath();x.moveTo(bx-w*.1,by-h*.6);x.lineTo(bx+w*.05,by-h*.1);x.lineTo(bx-w*.15,by+h*.4);x.stroke();
if(r()<.5){x.fillStyle='rgba(90,140,60,.7)';x.beginPath();x.ellipse(bx+w*.3,by-h*.5,w*.35,h*.2,0,0,TAU);x.fill()}};
for(const t of [-2.55,-1.75,-.62,.35,2.3,2.95]){for(let k=0;k<2+Math.floor(r()*2);k++){const p=pondEdge(t+(r()-.5)*.14,1.07+r()*.05);rock(p.x+(r()-.5)*18,p.y+(r()-.5)*8,9+r()*10)}}
const reeds=(bx,by,h,n,plume)=>{for(let k=0;k<n;k++){const dx=(k-(n-1)/2)*3.4,lean=(r()-.3)*14,tx=bx+dx+lean,ty=by-h*(.75+r()*.3);
x.strokeStyle='#22381c';x.lineWidth=3.2;x.beginPath();x.moveTo(bx+dx,by);x.quadraticCurveTo(bx+dx+lean*.25,by-h*.55,tx,ty);x.stroke();
x.strokeStyle=pick(C.reed);x.lineWidth=1.8;x.stroke();
if(plume&&r()<.75){x.strokeStyle=pick(C.plume);x.lineWidth=1.6;for(let j=0;j<6;j++){const a=-1.9+lean*.03+(r()-.5)*.9,l=5+r()*7;x.beginPath();x.moveTo(tx,ty+j*1.2);x.lineTo(tx+Math.cos(a)*l,ty+j*1.2+Math.sin(a)*l);x.stroke()}}}};
for(let i=0;i<180;i++){const t=r()*TAU,p=pondEdge(t,1.05+r()*.12);if(p.y<104)continue;reeds(p.x,p.y,18+r()*22,3+Math.floor(r()*4),r()<.7)}
for(let i=0;i<14;i++){const p=pondEdge(r()*TAU,1.06+r()*.06);if(p.y<104)continue;const h=26+r()*14;x.strokeStyle=INKC;x.lineWidth=3;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+2,p.y-h);x.stroke();x.strokeStyle='#5a8a3a';x.lineWidth=1.6;x.stroke();E(x,p.x+2,p.y-h+4,3.6,8,INKC);E(x,p.x+2,p.y-h+4,2.4,6.8,'#7a4f2a')}
const tree=(bx,by,s)=>{const cs=[];for(let k=0;k<5;k++)cs.push([bx+(k-2)*s*.42+(r()-.5)*s*.2,by-Math.sin(k/4*Math.PI)*s*.32+(r()-.5)*s*.15,s*(.34+r()*.14)]);
x.fillStyle='rgba(15,35,15,.4)';x.beginPath();x.ellipse(bx,by+s*.3,s*1.3,s*.3,0,0,TAU);x.fill();
for(const [a,b,q] of cs){x.fillStyle=INKC;x.beginPath();x.arc(a,b,q+2.2,0,TAU);x.fill()}
for(const [a,b,q] of cs){x.fillStyle=C.tree[1];x.beginPath();x.arc(a,b,q,0,TAU);x.fill()}
for(const [a,b,q] of cs){x.fillStyle=C.tree[2];x.beginPath();x.arc(a+q*.15,b-q*.22,q*.72,0,TAU);x.fill();x.fillStyle=C.tree[3];x.beginPath();x.arc(a+q*.3,b-q*.42,q*.32,0,TAU);x.fill()}};
for(let row=0;row<3;row++)for(let i=-1;i<W/(120-row*14)+1;i++){const s=34+r()*16-row*4;tree(i*(120-row*14)+r()*50+row*40,8+row*30+r()*12,s)}
for(let i=0;i<5;i++)rock(80+r()*(W-160),50+r()*40,8+r()*8);
for(let i=0;i<W/12;i++)reeds(i*12+r()*8,106+r()*10,14+r()*14,2+Math.floor(r()*3),r()<.6);
for(const sd of [0,1]){const bx=sd?W-16:16;for(let k=0;k<4;k++)tree(bx+(sd?1:-1)*r()*10,H*.3+k*H*.19,26+r()*10)}
for(let i=0;i<W/10;i++)reeds(i*10+r()*8,H+6,30+r()*26,3+Math.floor(r()*3),true);
if(C.wall){const top=62;x.fillStyle='rgba(10,15,20,.4)';x.fillRect(0,top+8,W,10);
for(let xx=-10;xx<W+40;xx+=34){x.fillStyle=pick(C.slab);x.strokeStyle=INKC;x.lineWidth=2;x.beginPath();x.rect(xx,top-26,34,34);x.fill();x.stroke();
if((xx/34|0)%2===0){x.beginPath();x.rect(xx+4,top-46,26,22);x.fill();x.stroke();x.fillStyle='#2a2c34';x.fillRect(xx+13,top-40,8,10)}
x.strokeStyle='rgba(31,42,36,.5)';x.lineWidth=1;x.beginPath();x.moveTo(xx,top-9);x.lineTo(xx+34,top-9);x.moveTo(xx+17,top-26);x.lineTo(xx+17,top-9);x.stroke()}}
if(C.floor==='vine'){const leaf=(lx,ly,s,rot)=>{x.save();x.translate(lx,ly);x.rotate(rot);x.beginPath();x.moveTo(0,s*.9);x.bezierCurveTo(-s*1.2,s*.1,-s*.7,-s*.9,0,-s*.35);x.bezierCurveTo(s*.7,-s*.9,s*1.2,s*.1,0,s*.9);x.closePath();
x.fillStyle=pick(C.tree.slice(1));x.fill();x.strokeStyle=INKC;x.lineWidth=1.5;x.stroke();x.strokeStyle='rgba(200,240,160,.45)';x.lineWidth=1;x.beginPath();x.moveTo(0,s*.8);x.lineTo(0,-s*.2);x.stroke();x.restore()};
for(let i=0;i<46;i++){let px=r()*W,py=104+r()*(H-104),a=r()*TAU;if(inPond(px,py,.95))continue;
x.strokeStyle=INKC;x.lineWidth=4.2;x.beginPath();x.moveTo(px,py);const pts=[];for(let k=0;k<7;k++){a+=(r()-.5)*1.4;px+=Math.cos(a)*16;py+=Math.sin(a)*12;pts.push([px,py]);x.lineTo(px,py)}x.stroke();
x.strokeStyle='#5f9a3e';x.lineWidth=2.2;x.stroke();
pts.forEach(([a2,b2],k)=>{if(k%2)leaf(a2,b2,7+r()*6,r()*TAU);else if(r()<.25){x.fillStyle='#9cc45a';x.strokeStyle=INKC;x.lineWidth=1.4;x.beginPath();x.arc(a2,b2,4,0,TAU);x.fill();x.stroke();x.strokeStyle='#d8f0a0';x.lineWidth=1;for(let j=0;j<6;j++){const q=j/6*TAU;x.beginPath();x.moveTo(a2+Math.cos(q)*4,b2+Math.sin(q)*4);x.lineTo(a2+Math.cos(q)*7,b2+Math.sin(q)*7);x.stroke()}}})}}
if(C.rain){x.strokeStyle='rgba(220,230,255,.16)';x.lineWidth=1.2;for(let i=0;i<W*H/2600;i++){const a=r()*W,b=r()*H,l=10+r()*16;x.beginPath();x.moveTo(a,b);x.lineTo(a-l*.3,b+l);x.stroke()}}
x.save();x.globalCompositeOperation='screen';g=x.createRadialGradient(W*.92,-H*.05,0,W*.92,-H*.05,Math.hypot(W,H)*.6);g.addColorStop(0,C.glow);g.addColorStop(1,'rgba(255,200,150,0)');x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();
const M=Math.hypot(W,H)/2,vg=x.createRadialGradient(W/2,H*.56,M*.5,W/2,H*.56,M*1.05);
vg.addColorStop(0,'rgba(20,30,40,0)');vg.addColorStop(.8,'rgba(20,30,40,'+(C.vig*.43).toFixed(2)+')');vg.addColorStop(1,'rgba(15,20,35,'+C.vig+')');x.fillStyle=vg;x.fillRect(0,0,W,H);
return bg;
}
