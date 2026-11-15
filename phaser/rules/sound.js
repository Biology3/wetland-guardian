/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
let AC=null,muted=false,bgmOff=false,musG=null;
function beep(f,d=.1,type='triangle',v=.08,to){if(muted||!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d)}
function audioOn(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.resume)AC.resume();if(!musG){musG=AC.createGain();musG.gain.value=bgmOff?0:.7;musG.connect(AC.destination);setInterval(tickMusic,70)}}catch(e){}}
const N=null;
const TRK={
field:{bpm:112,key:60,lead:'triangle',vol:.085,len:.32,kick:0,roots:[0,5,-3,-5,0,5,-5,0],
mel:[12,N,16,N,19,N,16,12, 14,N,17,N,21,N,17,14, 16,N,19,N,24,N,19,16, 14,16,14,12,7,N,N,N, 12,N,16,19,21,N,19,16, 17,N,16,14,12,N,9,N, 7,9,12,14,16,N,14,12, 14,N,7,N,12,N,N,N]},
calm:{bpm:84,key:60,lead:'sine',vol:.075,len:.55,kick:0,roots:[0,5,-3,-5],
mel:[12,N,N,16,N,N,19,N, 17,N,N,14,N,N,12,N, 9,N,N,12,N,N,16,N, 14,N,N,11,N,7,N,N]},
school:{bpm:92,key:60,lead:'triangle',vol:.075,len:.42,kick:0,roots:[0,5,7,5],
mel:[16,N,16,19,N,21,19,N, 17,N,17,21,N,24,21,N, 19,N,16,N,19,21,23,24, 21,N,19,N,16,N,N,N]},
story:{bpm:120,key:60,lead:'sine',vol:.085,len:.2,kick:0,roots:[0,5,7,5],
mel:[16,N,16,19,N,21,19,N, 17,N,17,21,N,24,21,N, 19,N,16,N,19,21,23,24, 21,N,19,N,16,N,N,N]},
rush:{bpm:144,key:60,lead:'square',vol:.045,len:.15,kick:1,roots:[0,-2,5,-5],
mel:[12,12,N,16,N,12,19,N, 10,10,N,14,N,10,17,N, 17,17,N,21,N,17,24,N, 19,N,17,N,14,N,11,N]},
after:{bpm:100,key:60,lead:'triangle',vol:.075,len:.35,kick:0,roots:[0,5,-3,7],
mel:[16,N,19,N,24,N,19,N, 21,N,17,N,21,N,24,N, 19,N,16,N,12,N,14,N, 16,19,17,14,12,N,N,N]},
camp:{bpm:100,key:60,lead:'triangle',vol:.065,len:.18,kick:0,roots:[0,5,7,5],
mel:[12,16,19,16,12,N,7,N, 17,21,24,21,17,N,12,N, 19,N,16,N,14,N,12,N, 14,16,14,11,12,N,N,N]},
boss:{bpm:138,key:57,lead:'square',vol:.05,len:.2,kick:1,roots:[0,-4,3,-2],
mel:[12,N,15,N,19,17,15,N, 14,N,17,N,20,19,17,N, 15,N,19,N,22,20,19,N, 17,19,17,15,14,N,10,N]},
};
TRK.lab={bpm:66,key:57,lead:'sine',vol:.07,len:.9,kick:0,roots:[0,-4,-2,-5],
mel:[12,N,N,N,15,N,N,N, 14,N,N,N,11,N,N,N, 12,N,N,15,N,N,19,N, 18,N,N,N,N,N,N,N]};
const BGM={name:null,key:0,step:0,next:0,tempo:1};
function setMusic(n,key=0,tempo=1){if(BGM.name===n&&BGM.key===key&&BGM.tempo===tempo)return;BGM.name=n;BGM.key=key;BGM.tempo=tempo;BGM.step=0;BGM.next=0}
const EP_KEY=[0,2,3,5,7],EP_TEMPO=[1,1.03,1.06,1.09,1.12];
function epMusic(n,w){w=Math.max(0,Math.min(4,w||0));setMusic(n,EP_KEY[w],EP_TEMPO[w])}
function note(m,t,d,type,v){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=440*Math.pow(2,(m-69)/12);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(musG);o.start(t);o.stop(t+d+.02)}
function tickMusic(){
if(!AC||!BGM.name||document.hidden||bgmOff)return;
const tr=TRK[BGM.name],now=AC.currentTime;if(BGM.next<now)BGM.next=now+.05;
while(BGM.next<now+.22){
const st=BGM.step,t=BGM.next,b8=st%8,key=tr.key+BGM.key,bar=Math.floor(st/8)%tr.roots.length,root=tr.roots[bar];
const m=tr.mel[st%tr.mel.length];if(m!==N)note(key+m,t,tr.len,tr.lead,tr.vol);
if(b8===0||b8===4)note(key+root-24,t,.3,'triangle',.13);
if(b8===3||b8===6)note(key+root-17,t,.2,'triangle',.08);
if(b8===0)note(key+root+7,t,1.1,'sine',.028);
if(tr.kick){
if(b8%2===0){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(48,t+.1);g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.001,t+.13);o.connect(g).connect(musG);o.start(t);o.stop(t+.15)}
else note(96,t,.03,'square',.012);
}else if(b8%2===1)note(100,t,.025,'square',.006);
BGM.step++;BGM.next+=60/(tr.bpm*BGM.tempo)/2;
}
}
