const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert(i>=0&&j>i);return html.slice(i,j)};
const c=vm.createContext({assert,console});
c.twUser=()=>false;
vm.runInContext(`
let G={W:5,H:1,player:'A',units:[],gadgets:[],map:{spawns:[]}},DMGBY=null;
let terrain=Array.from({length:5},()=>({t:'floor'})),waits=[],poses=[];
const cell=(x,y)=>y===0&&x>=0&&x<5?terrain[x]:{t:'hard'},blocks=c=>c.t==='hard',winOpen=c=>c.kind==='window'&&c.t==='floor';
const gadgetAt=(x,y,t)=>G.gadgets.find(g=>g.alive&&g.type===t&&g.x===x&&g.y===y),bansheeCost=()=>0,unitAt=()=>null,sees=()=>new Set(),prismaAt=()=>null,projSeen=()=>false;
const adj8=(x,y)=>[[x-1,y],[x+1,y]].filter(([x])=>x>=0&&x<5),adj4=adj8;
const inGas=()=>false,inFire=()=>false,cedAt=()=>null,traxNear=()=>false,clayZone=()=>false;
const spotTrack=()=>{},camDiscover=()=>{},pub=()=>true,pubNow=()=>true,SFX={step:()=>{}},sleep=async n=>waits.push(n),render=()=>poses.push(vaultAt(G.units[0].x,0)),clayCheck=async()=>true,stepHooks=async()=>true,camCheck=()=>{},revealCheck=()=>{},riposte=async()=>true;
`+cut('let ECU=null;const enterCost=','\n',)+cut('const shieldAt=','\nconst ',)+cut('const vaultAt=','\nconst stepNeed=')+cut('const stepNeed=','\n',)+cut('function reach(u){','function pathFrom(')+cut('function pathCost(u,x,y){','function findPath(')+cut('function findPath(u,goal){','function reach(u){')+cut('async function step(u,x,y){','// Overwatch reacts')+`
const u={x:0,y:0,side:'A',alive:true,mp:4};G.units=[u];
`,c);
(async()=>{for(const volcan of [false,true]){
 vm.runInContext(`G.gadgets=[{type:'shield',x:1,y:0,alive:true,volcan:${volcan}}];u.x=0;u.mp=3;waits=[];poses=[];
 assert.equal(enterCost(1,0),2);assert.equal(stepNeed(1,0),3);
 var r=reach(u);assert(r.get(1).pass);assert(!r.get(2).pass);assert.equal(r.get(2).d,3);
 assert(Number.isFinite(pathCost(u,1,0)));assert(findPath(u,(x)=>x===2));assert.equal(findPath(u,(x)=>x===1),null);
 u.mp=2;`,c);
 assert.equal(await vm.runInContext('step(u,1,0)',c),false);
 vm.runInContext('assert.equal(u.x,0);u.mp=3;',c);
 await vm.runInContext('step(u,1,0)',c);
 vm.runInContext('assert.equal(u.mp,1);assert(waits.includes(260));assert(poses.includes(true));assert(G.gadgets[0].alive);',c);
 await vm.runInContext('step(u,2,0)',c);
 vm.runInContext('assert.equal(u.x,2);assert.equal(u.mp,0);assert.equal(poses.at(-1),false);',c);
 }
 assert(html.includes('f.vault=u.alive&&vaultAt(u.x,u.y)'));
 assert(!cut('async function stepHooks(','var GT=').includes('g.volcan&&cheb'));
 console.log('PASS: both shields traverse, reserve landing movement, cannot be endpoints, AI routes, vault pose timing, no proximity ignition');
})().catch(e=>{console.error(e);process.exitCode=1});
