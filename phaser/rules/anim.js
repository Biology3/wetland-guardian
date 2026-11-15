/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const SD=e=>e.sd??(e.sd=Math.random()*4);
function animOf(o,tail){const dt=FDT||1/60,a=o._an||(o._an={px:o.x,py:o.y,vx:0,vy:0,face:1,fs:1,ph:Math.random()*6,land:0,lastSt:o.st});
const vx=(o.x-a.px)/dt,vy=(o.y-a.py)/dt,j=hyp(o.x-a.px,o.y-a.py)<60;if(j){a.vx+=(vx-a.vx)*Math.min(1,dt*10);a.vy+=(vy-a.vy)*Math.min(1,dt*10);a.ph+=hyp(o.x-a.px,o.y-a.py)*.055}
a.px=o.x;a.py=o.y;a.sp=hyp(a.vx,a.vy);if(Math.abs(a.vx)>40&&Math.abs(a.vx)>Math.abs(a.vy)*.3)a.face=(a.vx<0?-1:1)*(tail?-1:1);
if(a.face!==a.fs){a.fs=a.face;a.turn=.2}a.turn=Math.max(0,(a.turn||0)-dt);a.land=Math.max(0,a.land-dt);return a}
const fsx=a=>{const k=(a.turn||0)/.2;return (a.fs||1)*(1-.16*Math.sin(k*Math.PI))};
const thop=a=>-Math.sin(((a.turn||0)/.2)*Math.PI)*5;
const popIn=b=>{const k=Math.min(1,b/.35);return k>=1?1:k<.7?k/.7*1.16:1.16-.16*(k-.7)/.3};
const HK=.5;
function heroStep(p,dt){
if(dt<=0)return;
const vx=(p.x-(p.lx??p.x))/dt,vy=(p.y-(p.ly??p.y))/dt;p.lx=p.x;p.ly=p.y;
const sp=Math.hypot(vx,vy),moving=sp>30&&!(p.stun>0);
p.mv=(p.mv||0)+((moving?1:0)-(p.mv||0))*Math.min(1,dt*10);
if(p.face==null)p.face=Math.PI/2;
let tgt=p.face;
if(p.thrT>0){p.thrT-=dt;tgt=p.thrA}else if(moving)tgt=Math.atan2(vy/HK,vx);
const d=((tgt-p.face)%TAU+TAU*1.5)%TAU-Math.PI;p.face+=d*Math.min(1,dt*16);
p.ph=(p.ph||0)+dt*Math.min(sp,420)*.075;p.at=(p.at||0)+dt;
}
