/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const $=s=>document.querySelector(s), TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), rnd=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
const hyp=Math.hypot;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
