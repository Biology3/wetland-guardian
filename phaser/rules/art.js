/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
function E(x,cx,cy,rx,ry,col,rot=0){x.fillStyle=col;x.beginPath();x.ellipse(cx,cy,rx,ry,rot,0,TAU);x.fill()}
function eye(x,cx,cy,r){E(x,cx,cy,r,r*1.08,'#2b2f3a');E(x,cx-r*.3,cy-r*.38,r*.38,r*.38,'#fff');E(x,cx+r*.34,cy+r*.34,r*.18,r*.18,'#fff')}
function blush(x,cx,cy,r=9){x.globalAlpha=.55;E(x,cx,cy,r,r*.62,'#ff9db0');x.globalAlpha=1}
function line(x,col,w,fn){x.strokeStyle=col;x.lineWidth=w;x.lineCap='round';x.lineJoin='round';x.beginPath();fn();x.stroke()}
function smile(x,cx,cy,w,d=.5,col='#4a3b3b',lw=3.5){line(x,col,lw,()=>x.arc(cx,cy-w*d,w,.25*Math.PI,.75*Math.PI))}
let AP=0;
const ART={
blue(x){
x.save();x.translate(-46,0);x.rotate(Math.sin(AP)*.32);x.translate(46,0);x.fillStyle='#5f83d6';x.beginPath();x.moveTo(-46,0);x.quadraticCurveTo(-74,-34,-86,-30);x.quadraticCurveTo(-74,0,-86,30);x.quadraticCurveTo(-74,34,-46,0);x.fill();x.restore();
x.fillStyle='#5f83d6';x.beginPath();x.moveTo(-34,-30);x.quadraticCurveTo(-22,-60,0,-52);x.quadraticCurveTo(22,-60,30,-30);x.fill();
E(x,0,0,54,40,'#83a8f2');
x.save();x.beginPath();x.ellipse(0,0,54,40,0,0,TAU);x.clip();
E(x,4,34,52,24,'#ffd09a');
x.globalAlpha=.33;for(const dx of [-30,-14,2]){E(x,dx,-14,5,24,'#3f5fb0')}x.globalAlpha=1;x.restore();
E(x,14,2,10,12,'#2f3b70');
E(x,-6,14,13,8+Math.sin(AP+1)*2.5,'#ffb36b',.5+Math.sin(AP+1)*.4);
eye(x,34,-10,11);blush(x,30,12,8);
smile(x,47,7,6,.4);
},
nutria(x){
line(x,'#c98f7e',12,()=>{x.moveTo(26,54);x.quadraticCurveTo(70,74+Math.sin(AP)*8,88,36+Math.sin(AP)*14)});
E(x,-24,74-Math.max(0,Math.sin(AP))*7,16,9,'#6d5546',.1);E(x,24,74-Math.max(0,-Math.sin(AP))*7,16,9,'#6d5546',-.1);
E(x,0,38,46,42,'#8a6d5a');E(x,0,48,29,28,'#b89d86');
E(x,-38,-46,12,12,'#6d5546');E(x,38,-46,12,12,'#6d5546');E(x,-38,-46,6,6,'#c79f8c');E(x,38,-46,6,6,'#c79f8c');
E(x,0,-16,50,42,'#9a7d68');E(x,0,6,30,20,'#d6c1ad');
eye(x,-22,-24,10);eye(x,22,-24,10);
E(x,0,-6,9,6,'#4a3b3b');
x.fillStyle='#ff9d3c';x.fillRect(-11,8,22,20);E(x,0,28,11,6,'#ff9d3c');
line(x,'#fff',2.5,()=>{x.moveTo(0,10);x.lineTo(0,30)});
line(x,'#fff',2.5,()=>{for(const s of [-1,1]){x.moveTo(s*30,0);x.lineTo(s*52,-6);x.moveTo(s*30,6);x.lineTo(s*52,8)}});
blush(x,-38,-6,8);blush(x,38,-6,8);
E(x,-20,34+Math.sin(AP)*3,11,12,'#6d5546',.3);E(x,20,34-Math.sin(AP)*3,11,12,'#6d5546',-.3);
},
frog(x){frogArt(x,{body:'#7fae52',belly:'#f2e6a4',shade:'#5c8a3c',ring:true,brow:true})},
gfrog(x){frogArt(x,{body:'#d3dd5a',belly:'#fff5c0',shade:'#a9b63a',ring:false,brow:false,gold:true})},
vine(x){
leaf(x,-30,34,46,'#6fae46',-.5+Math.sin(AP)*.2);leaf(x,34,34,46,'#83c256',.5-Math.sin(AP)*.2);
x.fillStyle='#5a9436';
for(let i=0;i<16;i++){const a=i/16*TAU;x.save();x.rotate(a+Math.sin(AP)*.07);x.beginPath();x.moveTo(-7,-36);x.lineTo(0,-56);x.lineTo(7,-36);x.fill();x.restore()}
E(x,0,0,42,42,'#a4d765');
x.globalAlpha=.5;for(const [a,b] of [[-22,-22],[20,-26],[-28,10],[28,12],[0,-32]])E(x,a,b,3.5,3.5,'#6fae46');x.globalAlpha=1;
eye(x,-14,-5,10);eye(x,14,-5,10);
line(x,'#4a3b3b',3.5,()=>{x.moveTo(-25,-20);x.lineTo(-9,-16);x.moveTo(25,-20);x.lineTo(9,-16)});
blush(x,-25,12,8);blush(x,25,12,8);
smile(x,0,12,10,.4);
},
leafcell(x){leaf(x,0,0,64,'#7cb94f',.2);line(x,'#5a9436',4,()=>{x.moveTo(-20,28);x.quadraticCurveTo(-46,24,-44,4);x.quadraticCurveTo(-42,-8,-32,-2)})},
otter(x){
x.save();x.translate(30,40);x.rotate(Math.sin(AP)*.22);x.translate(-30,-40);x.fillStyle='#8f6243';x.beginPath();x.moveTo(30,50);x.quadraticCurveTo(84,62,84,20);x.quadraticCurveTo(70,44,30,30);x.fill();x.restore();E(x,-18,76-Math.max(0,Math.sin(AP))*6,13,8,'#7a5238');E(x,18,76-Math.max(0,-Math.sin(AP))*6,13,8,'#7a5238');
E(x,0,36,38,42,'#a8764f');E(x,0,44,25,30,'#ecd9b8');
E(x,-36,-46,12,12,'#8f6243');E(x,36,-46,12,12,'#8f6243');E(x,-36,-46,6,6,'#e2bda0');E(x,36,-46,6,6,'#e2bda0');
E(x,0,-22,50,42,'#a8764f');
E(x,0,-6,32,23,'#f4e7cd');
eye(x,-22,-28,10);eye(x,22,-28,10);
E(x,0,-14,9,6.5,'#3a2c2b');
line(x,'#4a3b3b',3.2,()=>{x.moveTo(0,-8);x.lineTo(0,-3)});smile(x,-6,-3,6,.1,'#4a3b3b',3.2);smile(x,6,-3,6,.1,'#4a3b3b',3.2);
line(x,'#fff',2.5,()=>{for(const s of [-1,1]){x.moveTo(s*24,-8);x.lineTo(s*48,-13);x.moveTo(s*24,-2);x.lineTo(s*48,0)}});
blush(x,-37,-9,8);blush(x,37,-9,8);
E(x,-16,30-Math.sin(AP)*4,10,14,'#8f6243',.3);E(x,16,30+Math.sin(AP)*4,10,14,'#8f6243',-.3);
},
turtle(x){
E(x,-42+Math.sin(AP)*7,38,15,10,'#8a9b58',.2+Math.sin(AP)*.2);E(x,34-Math.sin(AP)*7,38,15,10,'#8a9b58',-.2+Math.sin(AP)*.2);
x.fillStyle='#8a9b58';x.beginPath();x.moveTo(-58,22);x.lineTo(-82,30);x.lineTo(-58,34);x.fill();
x.save();x.translate(Math.cos(AP)*2,Math.sin(AP)*2.5);E(x,64,4,27,24,'#9aac62');
line(x,'#ffd95b',4,()=>{x.moveTo(46,-6);x.quadraticCurveTo(62,-12,72,-20);x.moveTo(46,12);x.quadraticCurveTo(66,16,84,8)});
eye(x,72,-3,9);blush(x,74,13,6.5);x.restore();
x.fillStyle='#5f6e3f';x.beginPath();x.moveTo(-66,28);x.quadraticCurveTo(-64,-50,0,-52);x.quadraticCurveTo(58,-50,60,28);x.quadraticCurveTo(0,42,-66,28);x.fill();
x.fillStyle='#7c8c50';
for(const [cx,cy,s] of [[-2,-20,19],[-36,-4,14],[33,-4,14],[-2,14,12]]){x.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;x[i?'lineTo':'moveTo'](cx+Math.cos(a)*s,cy+Math.sin(a)*s)}x.closePath();x.fill()}
line(x,'#ffd95b',3,()=>{x.moveTo(-60,26);x.quadraticCurveTo(0,38,56,26)});
},
minnow(x){
x.save();x.translate(-32,0);x.rotate(Math.sin(AP)*.4);x.translate(32,0);x.fillStyle='#7ccabb';x.beginPath();x.moveTo(-32,0);x.lineTo(-58,-16);x.lineTo(-58,16);x.fill();x.restore();
E(x,0,0,44,20,'#bdeee3');E(x,0,8,36,9,'#fff');eye(x,26,-3,5);
},
player(x){
const hair='#262833',navy='#1f2a55',navy2='#2c3a70',gold='#e8b93c';
E(x,0,-30,44,40,hair);x.fillStyle=hair;x.beginPath();x.moveTo(-44,-30);x.quadraticCurveTo(-53,-4,-41,12);x.quadraticCurveTo(-30,17,-22,12);x.lineTo(22,12);x.quadraticCurveTo(30,17,41,12);x.quadraticCurveTo(53,-4,44,-30);x.closePath();x.fill();
E(x,-14,62,8,14,'#fbd9b8');E(x,14,62,8,14,'#fbd9b8');E(x,-15,78,12,7,navy);E(x,15,78,12,7,navy);
x.fillStyle=navy;x.beginPath();x.moveTo(-25,26);x.lineTo(25,26);x.lineTo(38,56);x.quadraticCurveTo(0,64,-38,56);x.closePath();x.fill();
line(x,'#fff',3.6,()=>{x.moveTo(-35,50);x.quadraticCurveTo(0,58,35,50)});
line(x,navy2,2,()=>{for(const a of [-16,-5,6,17]){x.moveTo(a*.75,28);x.lineTo(a*1.2,54)}});
x.fillStyle=navy;x.beginPath();x.moveTo(-28,0);x.quadraticCurveTo(-34,18,-30,36);x.lineTo(30,36);x.quadraticCurveTo(34,18,28,0);x.quadraticCurveTo(0,-8,-28,0);x.fill();
x.fillStyle='#a9bdb6';x.beginPath();x.moveTo(-13,0);x.lineTo(13,0);x.lineTo(9,35);x.lineTo(-9,35);x.closePath();x.fill();
line(x,gold,2.6,()=>{x.moveTo(-14,-1);x.lineTo(-10,36);x.moveTo(14,-1);x.lineTo(10,36)});
line(x,'#fff',2.2,()=>{x.moveTo(-18,-1);x.lineTo(-13,36);x.moveTo(18,-1);x.lineTo(13,36)});
x.fillStyle='#fff';x.beginPath();x.moveTo(-13,-4);x.lineTo(0,10);x.lineTo(13,-4);x.lineTo(0,-8);x.closePath();x.fill();
x.fillStyle=navy;x.beginPath();x.moveTo(-4,1);x.lineTo(4,1);x.lineTo(6,20);x.lineTo(0,26);x.lineTo(-6,20);x.closePath();x.fill();
line(x,gold,2.2,()=>{x.moveTo(-4,7);x.lineTo(4,4);x.moveTo(-5,14);x.lineTo(5,11)});
line(x,navy,12,()=>{x.moveTo(-29,6);x.quadraticCurveTo(-40,20,-34,32)});E(x,-33,36,7,6,'#fbd9b8');
line(x,navy,12,()=>{x.moveTo(28,6);x.lineTo(44,14)});E(x,48,15,7,6,'#fbd9b8');
line(x,'#a87a4b',6,()=>{x.moveTo(44,20);x.lineTo(68,-34)});
x.strokeStyle='#4fb9a8';x.lineWidth=5;x.fillStyle='#d9f2ec';x.beginPath();x.ellipse(74,-58,23,26,.3,0,TAU);x.fill();x.stroke();
line(x,'#4fb9a8',2.4,()=>{x.moveTo(62,-74);x.lineTo(90,-44);x.moveTo(88,-76);x.lineTo(58,-44);x.moveTo(74,-84);x.lineTo(74,-32)});
E(x,0,-26,38,35,'#fde0c6');
blush(x,-25,-12,8);blush(x,25,-12,8);
eye(x,-15,-22,8.5);eye(x,15,-22,8.5);
smile(x,0,-9,6,.4,'#c9737f',3);
x.fillStyle=hair;x.beginPath();x.moveTo(-41,-14);x.quadraticCurveTo(-48,-68,3,-69);x.quadraticCurveTo(48,-68,41,-14);x.quadraticCurveTo(38,-26,33,-34);x.quadraticCurveTo(26,-45,15,-50);x.quadraticCurveTo(-8,-43,-33,-27);x.quadraticCurveTo(-38,-22,-41,-14);x.fill();
for(const m of [-1,1]){x.beginPath();x.moveTo(m*44,-30);x.quadraticCurveTo(m*52,-5,m*41,11);x.quadraticCurveTo(m*35,15,m*29,10);x.quadraticCurveTo(m*37,-6,m*36,-30);x.closePath();x.fill()}
line(x,'rgba(255,255,255,.28)',3.5,()=>{x.moveTo(-28,-54);x.quadraticCurveTo(-18,-63,-4,-65)});
},
};
ART.heron=function(x){
line(x,'#f0b34a',6,()=>{x.moveTo(-8,44);x.lineTo(-8,76);x.moveTo(12,44);x.lineTo(12,76)});
E(x,0,20,44,34,'#c9d6e6');x.fillStyle='#9fb2c9';x.beginPath();x.moveTo(-36,18);x.quadraticCurveTo(-76,30,-66,50);x.quadraticCurveTo(-30,52,0,34);x.fill();
line(x,'#e9f0f7',18,()=>{x.moveTo(26,10);x.quadraticCurveTo(44,-16,36,-40)});
E(x,38,-52,23,20,'#f4f8fc');x.fillStyle='#f0b34a';x.beginPath();x.moveTo(56,-58);x.lineTo(96,-48);x.lineTo(56,-44);x.fill();
line(x,'#3d4656',6,()=>{x.moveTo(18,-64);x.quadraticCurveTo(34,-74,50,-64)});
eye(x,44,-52,7);blush(x,38,-40,6);
};
ART.leopardG=x=>ART.leopard(x);
ART.egret=function(x){
line(x,'#3d4656',6,()=>{x.moveTo(-8,44);x.lineTo(-8,76);x.moveTo(12,44);x.lineTo(12,76)});
E(x,0,20,44,34,'#fbfcfe');x.fillStyle='#dfe7f0';x.beginPath();x.moveTo(-36,18);x.quadraticCurveTo(-76,30,-66,50);x.quadraticCurveTo(-30,52,0,34);x.fill();
line(x,'#eef3f8',18,()=>{x.moveTo(26,10);x.quadraticCurveTo(44,-16,36,-40)});
E(x,38,-52,23,20,'#ffffff');x.fillStyle='#f5c84a';x.beginPath();x.moveTo(56,-58);x.lineTo(98,-49);x.lineTo(56,-45);x.fill();
eye(x,44,-52,7);blush(x,38,-40,6);
};
ART.snakehead=function(x){
x.fillStyle='#5f6a3e';x.beginPath();x.moveTo(-70,0);x.quadraticCurveTo(-98,-30,-104,-24);x.quadraticCurveTo(-94,0,-104,24);x.quadraticCurveTo(-98,30,-70,0);x.fill();
x.fillStyle='#5f6a3e';x.beginPath();x.moveTo(-66,-20);x.quadraticCurveTo(-10,-50,46,-24);x.lineTo(46,-14);x.lineTo(-66,-10);x.fill();
E(x,-4,0,80,30,'#7d8a52');
x.save();x.beginPath();x.ellipse(-4,0,80,30,0,0,TAU);x.clip();E(x,4,22,70,14,'#e3d9a8');for(const [bx,by] of [[-50,-4],[-22,6],[8,-6],[34,4]])E(x,bx,by,11,8,'#4f5634');x.restore();
eye(x,52,-8,9);blush(x,50,10,7);smile(x,70,6,6,.4);
};
ART.leopard=function(x){
line(x,'#c98f4e',14,()=>{x.moveTo(36,52);x.quadraticCurveTo(84,46,74,4)});E(x,74,6,8,8,'#7a5230');
E(x,0,36,46,40,'#dca664');E(x,0,48,26,24,'#f6e7c8');
for(const [bx,by] of [[-28,22],[-20,50],[26,24],[22,52],[0,14]])E(x,bx,by,6,4.5,'#7a5230');
for(const s of [-1,1]){x.fillStyle='#dca664';x.beginPath();x.moveTo(s*14,-50);x.lineTo(s*40,-72);x.lineTo(s*44,-38);x.fill();x.fillStyle='#ffb3c0';x.beginPath();x.moveTo(s*24,-50);x.lineTo(s*38,-62);x.lineTo(s*39,-44);x.fill()}
E(x,0,-20,48,40,'#e2b06e');E(x,0,-6,26,16,'#f8ecd2');
line(x,'#fff6e0',4,()=>{x.moveTo(-7,-56);x.lineTo(-5,-34);x.moveTo(7,-56);x.lineTo(5,-34)});
for(const [bx,by] of [[-34,-22],[34,-22]])E(x,bx,by,4,3,'#7a5230');
eye(x,-17,-24,8);eye(x,17,-24,8);E(x,0,-10,5,3.5,'#ff8fa8');blush(x,-26,-6,7);blush(x,26,-6,7);smile(x,-5,-2,5,.4);smile(x,5,-2,5,.4);
};
function crown(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);x.fillStyle='#ffc93c';x.beginPath();x.moveTo(-30,14);x.lineTo(-36,-18);x.lineTo(-16,-4);x.lineTo(0,-26);x.lineTo(16,-4);x.lineTo(36,-18);x.lineTo(30,14);x.closePath();x.fill();E(x,-36,-20,6,6,'#ff8fa8');E(x,0,-28,6.5,6.5,'#83a8f2');E(x,36,-20,6,6,'#ff8fa8');x.fillStyle='#e5a51a';x.fillRect(-30,8,60,6);x.restore()}
for(const [k,base,cx,cy,sc] of [['bblue','blue',24,-46,.82],['bnutria','nutria',0,-54,.78],['bvine','vine',0,-58,.86],['bfrog','frog',0,-62,.95]])ART[k]=x=>{ART[base](x);crown(x,cx,cy,sc)};
ART.kheron=x=>{ART.heron(x);crown(x,36,-78,.55)};
function leaf(x,cx,cy,r,col,rot=0){
x.save();x.translate(cx,cy);x.rotate(rot);x.fillStyle=col;x.beginPath();
for(let i=0;i<=10;i++){const a=-Math.PI/2+i/10*TAU, q=i%2?r*.56:r;const px=Math.cos(a)*q,py=Math.sin(a)*q;
if(!i)x.moveTo(px,py);else{const pa=a-TAU/20,pq=r*.86;x.quadraticCurveTo(Math.cos(pa)*pq,Math.sin(pa)*pq,px,py)}}
x.closePath();x.fill();
x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=3;x.lineCap='round';x.beginPath();for(let i=0;i<5;i+=1){const a=-Math.PI/2+i/5*TAU;x.moveTo(0,0);x.lineTo(Math.cos(a)*r*.68,Math.sin(a)*r*.68)}x.stroke();
x.restore();
}
function frogArt(x,o){
for(const s of [-1,1]){const k=Math.sin(AP+(s>0?0:Math.PI));E(x,s*(56+k*4),52-k*3,24,13,o.shade,s*(.2+k*.1));E(x,s*30,62-Math.max(0,k)*3,17,10,o.shade)}
E(x,0,18,64,50,o.body);
if(o.gold){line(x,'#ffb81f',7,()=>{x.moveTo(-38,-12);x.quadraticCurveTo(-52,26,-40,56);x.moveTo(38,-12);x.quadraticCurveTo(52,26,40,56)})}
E(x,0,42+Math.sin(AP)*1.5,40,27+Math.sin(AP)*2,o.belly);
E(x,-30,-36,22,22,o.body);E(x,30,-36,22,22,o.body);
E(x,-30,-37,16,16,'#fff');E(x,30,-37,16,16,'#fff');
eye(x,-29,-35,11);eye(x,29,-35,11);
if(o.ring){E(x,-58,-6,14,14,o.shade);E(x,58,-6,14,14,o.shade);E(x,-58,-6,8,8,o.body);E(x,58,-6,8,8,o.body);
line(x,'#4a3b3b',4.5,()=>{x.moveTo(-46,-58);x.lineTo(-18,-50);x.moveTo(46,-58);x.lineTo(18,-50)})}
blush(x,-38,12,10);blush(x,38,12,10);
smile(x,0,6,24,.72);
}
function heartBadge(x){
x.save();x.translate(58,-62);
E(x,0,0,21,21,'#fff');E(x,0,0,17,17,'#ffc93c');
x.fillStyle='#ff5f7e';x.beginPath();x.moveTo(0,10);x.bezierCurveTo(-16,-2,-8,-13,0,-5);x.bezierCurveTo(8,-13,16,-2,0,10);x.fill();
x.restore();
}
function mk(w,h){const c=document.createElement('canvas');c.width=Math.max(1,w);c.height=Math.max(1,h);return c}
function sil(c,col){const t=mk(c.width,c.height),x=t.getContext('2d');x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,t.width,t.height);return t}
function ring(src,th,n=28){const o=mk(src.width,src.height),x=o.getContext('2d');for(let i=0;i<n;i++){const a=i/n*TAU;x.drawImage(src,Math.cos(a)*th,Math.sin(a)*th)}return o}
function paint(c){const p=c.width,x=c.getContext('2d');x.save();x.globalCompositeOperation='source-atop';const g=x.createLinearGradient(p*.25,p*.12,p*.72,p*.92);
g.addColorStop(0,'rgba(255,246,200,.3)');g.addColorStop(.42,'rgba(255,246,200,0)');g.addColorStop(.58,'rgba(20,50,60,0)');g.addColorStop(1,'rgba(20,50,60,.42)');x.fillStyle=g;x.fillRect(0,0,p,p);x.restore()}
function rimLight(c,u){const r=sil(c,'rgba(255,240,205,.6)'),x=r.getContext('2d');x.globalCompositeOperation='destination-out';x.drawImage(c,3*u,3.4*u);return r}
function bakeCanvas(name,px,kind){
const c=mk(px,px),x=c.getContext('2d'),u=px/220;
x.translate(px/2,px/2);x.scale(u,u);ART[name](x);
paint(c);
if(!kind)return c;
const gold=kind==='gold',th=6.5*u,o=mk(px,px),ox=o.getContext('2d');
if(gold){const gs=sil(c,'#ffc94a');ox.globalAlpha=.22;ox.drawImage(ring(gs,th+13*u),0,0);ox.globalAlpha=.45;ox.drawImage(ring(gs,th+8*u),0,0);ox.globalAlpha=1;ox.drawImage(ring(sil(c,'#ffd970'),th+4*u),0,0)}
ox.drawImage(ring(sil(c,'#1f2a24'),th),0,0);
ox.drawImage(c,0,0);ox.drawImage(rimLight(c,u),0,0);
if(gold){ox.save();ox.translate(px/2,px/2);ox.scale(u,u);heartBadge(ox);ox.restore()}
return o;
}
const STICK={blue:'w',nutria:'w',frog:'w',vine:'w',player:'w',heron:'w',egret:'w',snakehead:'w',leopard:'w',leopardG:'gold',bblue:'w',bnutria:'w',bvine:'w',bfrog:'w',otter:'gold',turtle:'gold',gfrog:'gold'};
const stickKind=n=>STICK[n]==='w'?'white':STICK[n]||null;
function card(name,px=240){return bakeCanvas(name,px,stickKind(name))}
