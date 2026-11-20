/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
function fx(dt){
if(!G)return;
for(const q of G.parts){q.t+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=420*dt}G.parts=G.parts.filter(q=>q.t<q.life);
for(const f of G.floats)f.t+=dt;G.floats=G.floats.filter(f=>f.t<FLOAT_LIFE(f));
for(const b of G.bubbles)b.t+=dt;G.bubbles=G.bubbles.filter(b=>b.t<.8);
for(const q of G.bolts)q.t+=dt;G.bolts=G.bolts.filter(q=>q.t<.2);for(const q of G.shocks)q.t+=dt;G.shocks=G.shocks.filter(q=>q.t<.32);
for(const q of G.ripples)q.t+=dt;G.ripples=G.ripples.filter(q=>q.t<(q.boom?.75:.55));for(const q of G.spikes)q.t+=dt;G.spikes=G.spikes.filter(q=>q.t<.45);for(const q of G.waves)q.t+=dt;G.waves=G.waves.filter(q=>q.t<.55);for(const q of G.jets)q.t+=dt;G.jets=G.jets.filter(q=>q.t<.4);for(const q of G.swirls)q.t+=dt;G.swirls=G.swirls.filter(q=>q.t<.5);for(const q of G.flames)q.t+=dt;G.flames=G.flames.filter(q=>q.t<.8);
if(G.warns){for(const q of G.warns)q.t+=dt;G.warns=G.warns.filter(q=>q.t<q.life)}if(G.glows){for(const q of G.glows)q.t+=dt;G.glows=G.glows.filter(q=>q.t<q.life)}
G.worldFlash=Math.max(0,(G.worldFlash||0)-dt);G.gusaFx=Math.max(0,(G.gusaFx||0)-dt);G.worldClock=Math.max(0,(G.worldClock||0)-dt);G.shake=Math.max(0,G.shake-dt);G.flash=Math.max(0,G.flash-dt);if(G.boss&&G.boss.deadT>0)G.boss.deadT=Math.max(.001,G.boss.deadT-dt);
}
