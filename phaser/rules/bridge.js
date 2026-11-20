/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
let W=1000,H=700,S=1,DPR=1,CSSW=1000,CSSH=700,pond={cx:500,cy:380,a:400,b:240};
let QUAL=1,FDT=1/60;
const WORLD_CLOCK=1.8,WORLD_TW=.9;
function WK(){if(!G)return 1;const fog=G.fogT>0?(L('world')?SK.world.dmg:L('thick')?SK.thick.dmg:SK.fog.dmg):1;return fog*BOOST()}
function NOHEAL(){const p=G&&G.player;return !!(p&&(p.gusaT>0||p.reviveT>0))}
function BOOST(){const p=G&&G.player;if(!p)return 1;return p.gusaT>0?SK.gusa.k:p.rageT>0?SK.ramsar.k:1}
function fogK(){if(!(G.fogT>0))return 1;if(G.stopT>0)return 0;return L('thick')?SK.thick.slow:SK.fog.slow}
const safe={l:0,r:0,b:0};
const cv=document.getElementById('game');
function inPond(x,y,k=1){return inPondOf(pond,x,y,k)}
function pondEdge(t,k=1){return pondEdgeOf(pond,t,k)}
function readSafe(){const d=document.createElement('div');d.style.cssText='position:fixed;left:env(safe-area-inset-left,0px);right:env(safe-area-inset-right,0px);bottom:env(safe-area-inset-bottom,0px);height:0';document.body.appendChild(d);const r=d.getBoundingClientRect();safe.l=r.left;safe.r=innerWidth-r.right;safe.b=innerHeight-r.bottom;d.remove()}
const WORLD_AREA=(1920/1.4)*(1080/1.4);
function measureWorld(){
CSSW=innerWidth;CSSH=innerHeight;DPR=Math.min(devicePixelRatio||1,QUAL?2:1.25);
S=clamp(Math.min(Math.sqrt(CSSW*CSSH/WORLD_AREA),Math.min(CSSW,CSSH)/700),.72,1.4);W=CSSW/S;H=CSSH/S;
pond=makePond(W,H);readSafe();
if(G){G.ents.forEach(e=>{e.x=clamp(e.x,-80,W+80);e.y=clamp(e.y,90,H-30)});const p=G.player;p.x=clamp(p.x,40,W-40);p.y=clamp(p.y,110,H-40);
for(const [k,c] of G.cells)if(c.x>W||c.y>H)G.cells.delete(k)}
}
