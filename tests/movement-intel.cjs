const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const ctx=vm.createContext({assert,console});
vm.runInContext(`let G={phase:'play',round:1,phaseIdx:0,units:[],active:null};`+cut('const movementPhase=','const pubNow=')+`
const a={id:'A0',side:'A',alive:true,x:0,y:0},d={id:'D0',side:'D',alive:true,x:3,y:3,hidden:true},still={id:'D1',side:'D',alive:true,x:5,y:5,hidden:true};G.units=[a,d,still];
trackMovement();G.active=d;d._actMoved=false;d.fd=[1,0];trackMovement();assert(!d._actMoved);
d.x=4;trackMovement();assert(d._actMoved);d.x=3;trackMovement();closeMovementPhase();assert.deepEqual(G.previousMovers,['D0']);
G.phaseIdx=1;trackMovement();G.active=a;a._actMoved=false;const hit=lionScan(a);assert.equal(hit.length,1);assert.equal(hit[0],d);assert(d.hidden);assert.equal(d.spotted,undefined);assert.equal(G.lionMarks[0].x,3);
closeMovementPhase();G.phaseIdx=2;trackMovement();assert.equal(lionScan(a).length,0);assert.equal(G.lionMarks.length,0);
G.phaseIdx=3;trackMovement();G.active=d;d.x=4;trackMovement();closeMovementPhase();G.round=2;G.phaseIdx=0;trackMovement();assert.equal(lionScan(a).length,1);
G.active=d;d._actMoved=false;trackMovement();assert(!d._actMoved);d.x=5;trackMovement();assert(d._actMoved);
`,ctx);
vm.runInContext(cut('async function riposte(u,','// ---- v88:'),ctx);
(async()=>{await vm.runInContext(`(async()=>{
let shots=0;globalThis.shootUnit=async()=>shots++;globalThis.losAs=(e,fn)=>fn();globalThis.inSight=()=>true;globalThis.los=()=>true;globalThis.rayBlk=()=>false;
Object.assign(a,{overwatch:true,owd:[1,1],owHit:new Set(),owShot:0});d._actMoved=false;G.active=d;
assert.equal(await riposte(d),true);assert.equal(shots,0);
d.y++;await riposte(d);assert.equal(shots,1);await riposte(d);assert.equal(shots,1);
d._actMoved=false;a.owHit=new Set();a.owShot=0;await riposte(d);assert.equal(shots,1);
})()`,ctx);console.log('PASS: no overwatch before movement, fire after movement, once per watcher, activation reset, previous-phase Lion, round boundary and hidden markers');})().catch(e=>{console.error(e);process.exit(1)});
