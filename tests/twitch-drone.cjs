const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert(i>=0&&j>i,a);return html.slice(i,j)};
const c=vm.createContext({assert,console});
vm.runInContext(`
let G={W:20,H:20,grid:true,phase:'play',round:1,acts:0,player:'A',units:[],gadgets:[]},DMGBY=null,blocked=false,smoke=false,jam=false,rolls=[],events=[];
const u={id:'A0',op:'twitch',alive:true,x:2,y:2,side:'A',ch:2,speed:5,ap:2,used:new Set()};G.sel=u;G.units=[u];
const curSide=()=> 'A',coopRole=()=> 'h',coopMyTurn=()=>true;
const beginAct=u=>{G.active=u;u.activated=true;u.ap=2;u.used=new Set();G.acts++},commit=u=>{if(G.active!==u)beginAct(u);return true;};
const canDo=(u,k)=>u.ap>0&&(k==='destroy'||!u.used.has(k));
const ST=u=>u.stats||(u.stats={gad:0,shots:0,hits:0,dmg:0,taken:0,k:0});
const useAct=(u,k)=>{twChoose(u,u.twControl?'drone':'body');u.ap--;u.used.add(k)};
const adj8=(x,y)=>[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>a>=0&&b>=0&&a<20&&b<20),adj8all=adj8;
const unitAt=(x,y)=>G.units.find(u=>u.alive&&u.x===x&&u.y===y),droneOK=()=>true,droneNext=(u,x,y)=>adj8(x,y),droneCost=()=>1,droneHazard=()=>null;
const jammed=()=>jam,los=()=>!blocked&&!smoke,smokeAt=()=>smoke,VR=u=>u.vr||10;
const render=()=>{},note=()=>{},camDiscover=()=>{},revealCheck=()=>{},followCam=()=>{},log=()=>{},reveal=u=>u.hidden=false,sleep=async()=>{};
const SFX={step(){},shot(){},zap(){},kill(){}},fxEv=e=>events.push(e),rollDice3D=async(...a)=>rolls.push(a),diceHide=()=>{};
const GSTR={jammer:1,drone:1},gadgetVisibleTo=()=>true;
const dmgMod=()=>0,nm=u=>u.id,SRCOP={},cheb=(a,b,c,d)=>Math.max(Math.abs(a-c),Math.abs(b-d)),performance={now:()=>0},finkaSave=()=>false,onKill=()=>{},checkWin=()=>{};
`+cut('function inFan(','function fanCells(')+cut('function sharedCells(','// attackers with line of sight')+cut('function droneReach(','async function droneStep(')+cut('async function damage(','function checkWin(')+cut('function twUser(','// ---------- phases ----------'),c);
(async()=>{
 vm.runInContext(cut('function owqActor(', '// cameras start hidden'),c);
 vm.runInContext(`
 const alive=s=>G.units.filter(u=>u.alive&&u.side===s),bigNote=()=>{},OPS={twitch:{name:'Twitch'}},endAct=u=>{u.twControl=false;G.active=null},endPhase=()=>{G.ended=true},overwatch=(u,b,fd)=>{u.fd=fd;u.overwatch=true};
 `,c);
 await vm.runInContext(`(async()=>{
 assert.equal(twDeployTargets(u).length,4);assert(await twDeploy(u,3,2));const d=twDrone(u);
 assert.equal(u.ch,1);assert.equal(d.mp,5);assert.equal(twLock(u),'drone');assert.equal(twChoose(u,'body'),false);assert.equal(twDeployTargets(u).length,0);
 assert.equal(d.moving,undefined,'persistent drone must not enter disposable scout flow');
 await twMove(u,6,2);assert.equal(d.x,6);assert.equal(d.mp,2);await twMove(u,9,2);assert.equal(d.x,6,'cannot exceed remaining movement');
 const foe={id:'D0',op:'montagne',w:'hs',hp:4,alive:true,side:'D',x:10,y:2,fd:[-1,0]};G.units.push(foe);
 assert(twTargets(d).includes(foe));foe.x=13;assert(!twTargets(d).includes(foe));foe.x=3;assert(!twTargets(d).includes(foe));foe.x=10;
 blocked=true;assert.equal(twTargets(d).length,0);blocked=false;smoke=true;assert.equal(twTargets(d).length,0);smoke=false;jam=true;assert.equal(twTargets(d).length,0);jam=false;
 await twAttack(u,10,2);assert.equal(foe.hp,3,'direct 1 HP bypasses armour and heavy shield');assert.equal(events.at(-1).k,'twzap');assert.equal(ST(u).dmg,1);
 u.fd=[0,-1];assert(owqStart('A'));assert.equal(owqActor(u),d);assert.equal(u.twControl,false,'end activation clears control, not drone facing ownership');
 owqTap(2,3);assert.equal(G.mode,'owq','body-adjacent arrow cannot rotate drone');assert.deepEqual(u.fd,[0,-1]);
 owqTap(d.x,d.y+1);assert.deepEqual(d.fd,[0,1]);assert.deepEqual(u.fd,[0,-1],'drone facing must not rotate Twitch');assert(G.ended);assert.equal(d.overwatch,undefined,'drone does not gain overwatch');G.owqDone=false;
 d.alive=false;assert.equal(owqStart('A'),false,'destroyed drone must not request body direction');d.alive=true;
 G.round++;u.activated=false;G.active=null;u.twControl=false;assert.equal(twLock(u),null);assert(twChoose(u,'body'));assert(!twChoose(u,'drone'));assert.equal(twDeployTargets(u).length,0);
 assert.equal(owqActor(u),u,'body action keeps normal body facing');d.fd=[1,0];
 G.round++;u.twControl=true;twRefresh(u,d);assert.equal(d.mp,5);d.mp=2;twRefresh(u,d);assert.equal(d.mp,2,'cannot refresh by toggling');
 for(let i=0;i<6;i++){d.alive=true;Math.random=()=> (i+.1)/6;await twReceive(foe,d);assert.equal(d.alive,i<3);const r=rolls.at(-1);assert.equal(r[0],'Y');assert.deepEqual(r[1],[i]);assert.deepEqual(r[4],['miss','miss','miss','hit','hit','hit']);}
 d.alive=true;d.x=6;d.y=2;foe.x=10;foe.fd=[-1,0];foe.overwatch=true;foe.owd=[-1,0];foe.owShot=0;foe.owHit=new Set();Math.random=()=>0;
 u.alive=false;assert.equal(twCan(u),false);assert.equal(twDrone(u),d);assert(twSight(d,10,2),'dead owner leaves drone vision active');assert(sharedCells('A').has(2*20+10),'team retains orphan drone vision');assert(!sharedCells('A').has(2*20+3),'no sight behind the drone');const oldX=d.x;await twMove(u,7,2);assert.equal(d.x,oldX);const oldHP=foe.hp;await twAttack(u,10,2);assert.equal(foe.hp,oldHP);assert(twCanHit(foe,d),'orphan drone remains destructible');u.alive=true;
 const n=rolls.length;await twReact(d);assert.equal(rolls.length,n+1);await twReact(d);assert.equal(rolls.length,n+1,'one overwatch shot per drone');
 d.alive=false;G.active=null;u.activated=false;G.acts=0;G.round++;u.twControl=false;
 assert(await twDeploy(u,3,2));assert.equal(u.ch,0);assert.equal(G.gadgets.filter(g=>g.alive).length,1);twDrone(u).alive=false;G.round++;assert.equal(twDeployTargets(u).length,0);
 })()`,c);
 console.log('PASS: 2 persistent drones, single-live limit, operator/drone round lock, 5-step budget, 180-degree sight, 6-space attack, wall/smoke/jammer blocking, direct 1 HP, special die 3 MISS/3 hits, overwatch');
})().catch(e=>{console.error(e);process.exitCode=1});
