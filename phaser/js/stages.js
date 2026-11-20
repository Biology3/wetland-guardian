/* © 2026 임진삼. All rights reserved. 무단 복제·수정·배포 금지 */
'use strict';
const DEV_CODE='3333',BOSS_PTS=[2,2,3],DEV_PTS={wave:[0,1,2,4,6],boss:[9,11,13,16]};
function startPlayScene(){if(window.__game){__game.scene.stop('title');__game.scene.start('play')}}
function finalResult(){
const avg=G.sumT?G.sum/G.sumT:0;let stars=1;if(avg>=50&&G.hits<=4)stars=2;if(avg>=68&&G.hits<=1&&G.bossFails.reduce((a,b)=>a+b,0)<=3)stars=3;
G.mode='over';setMusic(null);
G.final={stars,avg};showResult({shot:true,title:'습지의 평형을 되찾았어요!',stars,tally:true,line:(buildName()||'무스킬')+' · 점수 '+G.score+'점 · 평균 평형 '+Math.round(avg)+' · 보스 도전 '+G.bossTry+'번',lesson:'이 생물들은 사람을 통해 습지에 들어왔어요. 잡는 것만큼 처음부터 들어오지 않게 막는 일이 중요해요.'});$('#resCode').hidden=false;
beep(880,.3,'triangle',.09,1320);
}
function heroCard(px){const c=mk(px,px),x=c.getContext('2d'),k=px/150;
x.setTransform(k,0,0,k,0,0);x.fillStyle='rgba(25,55,30,.3)';x.beginPath();x.ellipse(75,133,24,7,0,0,TAU);x.fill();
const s=.375;x.drawImage(HERO_IMG_EL,7*240,0,240,440,75-120*s,132-425*s,240*s,440*s);return c}
function makeRecord(){
const w=1200,h=760,c=mk(w,h),x=c.getContext('2d'),font=(n)=>n+'px Jua,"Apple SD Gothic Neo","Noto Sans KR",sans-serif',ink='#3d5a4c';
x.drawImage(drawWetland(W,H,1),0,0,w,h);
const rr=(a,b,cw,ch,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+cw,b,a+cw,b+ch,r);x.arcTo(a+cw,b+ch,a,b+ch,r);x.arcTo(a,b+ch,a,b,r);x.arcTo(a,b,a+cw,b,r);x.closePath()};
x.fillStyle='rgba(61,90,76,.2)';rr(46,56,1108,664,44);x.fill();x.fillStyle='#fffdf6';rr(46,46,1108,664,44);x.fill();x.strokeStyle='#fff';x.lineWidth=8;x.stroke();
x.textBaseline='middle';x.textAlign='left';
x.drawImage(heroCard(340),58,120,340,340);
x.fillStyle='#e56a87';x.font=font(30);x.fillText('습지 지킴이 클리어 기록',400,104);
x.fillStyle=ink;x.font=font(50);x.fillText('습지의 평형을 되찾았어요!',400,166);
const star=(cx,cy,r,on)=>{x.fillStyle=on?'#ffc93c':'#e4e9d9';x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i/10*TAU,q=i%2?r*.45:r;x[i?'lineTo':'moveTo'](cx+Math.cos(a)*q,cy+Math.sin(a)*q)}x.closePath();x.fill()};
for(let i=0;i<3;i++)star(432+i*72,236,32,i<G.final.stars);
x.fillStyle=ink;x.font=font(32);x.fillText(buildName()||'무스킬',660,236);
x.font=font(28);x.fillText('점수 '+G.score+'점   평균 평형 '+Math.round(G.final.avg)+'   보스 도전 '+G.bossTry+'번',400,300);
if(compType())x.fillText('함께한 친구: '+COMP[compType()].n,400,344);
const items=[['blue',G.tally.blue+'마리'],['frog',G.tally.frog+'마리'],['nutria',G.tally.nutria+'마리'],['vine',G.tally.vine+'포기']];
x.font=font(30);items.forEach((it,i)=>{const px=400+i*180;x.drawImage(card(it[0],150),px-6,376,86,86);x.fillStyle=ink;x.fillText(it[1],px+78,419)});
x.font=font(24);x.fillStyle='#6f8a7a';x.fillText('배운 스킬',84,510);
const list=TREE.flatMap(b=>b.nodes).filter(n=>L(n.id)).map(n=>n.n+' '+L(n.id)),syns=SYN.filter(q=>q.need()).map(q=>q.n+(q.g||q.eco?' Lv'+q.need():''));
x.fillStyle=ink;x.font=font(25);
let lx=84,ly=550;const put=(t,col)=>{const tw=x.measureText(t).width+34;if(lx+tw>1116){lx=84;ly+=50}x.fillStyle=col;rr(lx,ly-20,tw,40,20);x.fill();x.fillStyle=ink;x.fillText(t,lx+17,ly+1);lx+=tw+10};
list.forEach(t=>put(t,'#eef8f5'));syns.forEach(t=>put('★ '+t,'#fff3c9'));
const d=new Date(),p2=n=>String(n).padStart(2,'0');x.textAlign='right';x.font=font(22);x.fillStyle='#8b9d90';x.fillText(d.getFullYear()+'.'+p2(d.getMonth()+1)+'.'+p2(d.getDate()),1116,104);
return c.toDataURL('image/png');
}
let shotURL='';
function openDev(){showOnly('#dev');$('#devLock').hidden=false;$('#devInfo').hidden=false;$('#devStages').hidden=true;$('#devMsg').textContent='';$('#devCode').value='';setTimeout(()=>$('#devCode').focus(),50)}
function wireStages(){
$('#btnShot').onclick=()=>{try{shotURL=makeRecord();$('#shotImg').src=shotURL;$('#btnShotSave').hidden=window.top!==window;$('#shotView').hidden=false}catch(e){$('#resLine').textContent='기록 사진을 만들지 못했어요. 다시 눌러 주세요.'}};
$('#btnShotClose').onclick=()=>{$('#shotView').hidden=true};
$('#btnShotSave').onclick=()=>{const a=document.createElement('a');a.href=shotURL;a.download='습지지킴이-클리어기록.png';document.body.appendChild(a);a.click();a.remove()};
$('#btnDevBack').onclick=()=>showOnly('#title');
$('#btnDevOk').onclick=()=>{if($('#devCode').value.trim()!==DEV_CODE){$('#devMsg').textContent='비밀번호가 달라요';beep(200,.15,'square',.05);return}
$('#devLock').hidden=true;$('#devInfo').hidden=true;$('#devMsg').textContent='';$('#devStages').hidden=false;
const list=[...WAVES.map((w,i)=>({t:(i+1)+'차 조사',pts:DEV_PTS.wave[i],go:()=>beginWave(i),next:{wave:i}})),...BOSS.map((b,i)=>({t:'보스 '+(i+1)+' · '+b.name,pts:DEV_PTS.boss[i],go:()=>beginBoss(i),next:{boss:i}})),
{t:'전투 트레이닝',pts:30,go:()=>beginTraining(),next:{boss:3},train:true}];
const g=$('#devGrid');g.textContent='';list.forEach(o=>{const btn=document.createElement('button');btn.className='devStage'+(o.train?' devTrain':'');btn.innerHTML=o.t+'<small> · '+o.pts+'점</small>';
btn.onclick=()=>{enterFs();audioOn();setMusic('calm');newGame();G.practice=true;award(o.pts);startPlayScene();if(o.train){openTrainTree('스테이지 선택 · '+o.t);return}openTree({title:'스테이지 선택 · '+o.t,next:Object.assign({known:true},o.next),respec:true,start:o.go})};g.appendChild(btn)})};
$('#devCode').addEventListener('keydown',e=>{if(e.key==='Enter')$('#btnDevOk').click()});
$('#btnTrainSkill').onclick=()=>{if(!G||!G.training)return;G.mode='break';openTrainTree('전투 트레이닝 · 스킬 설정')};
}
function openTrainTree(title){G.trainTree=true;
openTree({title,next:{boss:3,known:true},respec:true,start:()=>beginTraining()});
$('#btnGo').textContent='▶ 트레이닝 시작';const box=$('#nextCard');box.textContent='';box.appendChild(card('bvine',300));
box.insertAdjacentHTML('beforeend','<h3>허수아비 · 왕 가시박</h3><p class="tip">체력 '+BOSS[3].hp+' · 공격하지 않고, 뿌리를 자르지 않아도 늘 제대로 맞아요. 쓰러지면 바로 다시 일어나요. 위쪽 칸에 누적 피해와 초당 피해가 나와요.</p>');
}
