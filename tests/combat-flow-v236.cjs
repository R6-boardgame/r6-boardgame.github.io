const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>{const i=html.indexOf(a);assert(i>=0,a);const j=html.indexOf(b,i);assert(j>i,b);return html.slice(i,j);};
const ctx=vm.createContext({assert,console});
vm.runInContext(`
let G={phase:'play',round:1,phaseIdx:1,player:'A',units:[]},smoke=false,terrain='out';
const cell=()=>({t:terrain}),smokeAt=()=>smoke,noFog=()=>false,inSight=()=>false,sharedCells=()=>new Set();
`+cut('const defenderOutside=','function sees(')+`
const d={id:'D0',side:'D',alive:true,x:5,y:5,hidden:true};G.units=[d];
assert(defenderOutside(d));assert(seenBy('A',d));terrain='floor';assert(!seenBy('A',d));terrain='out';smoke=true;assert(!seenBy('A',d));smoke=false;
G.phase='setup';assert(!defenderOutside(d));G.phase='play';
const vec=n=>({n,clone(){return vec(this.n)}});let follows=0,restored=null;
let R3={camera:{position:vec(9)},controls:{target:vec(8)},enemyView:{game:G,phase:'1:1',p:vec(1),t:vec(2)}};
const curSide=()=>G.phaseIdx===1?'D':'A',followCam=()=>{follows++},evCamOff=()=>{},flyTo=(p,t)=>{restored=[p.n,t.n]};
`+cut('function outsideCam(){','function turnCam(){')+`
G.active=d;assert(outsideCam());assert.equal(follows,1);outsideCam();assert.equal(follows,1);d.x++;outsideCam();assert.equal(follows,2);
G.phaseIdx=2;assert(outsideCam());assert.deepEqual(restored,[1,2]);assert.equal(R3.outsideSave,null);assert.equal(R3.turnPend,false);
`,ctx);
const ai=vm.createContext({assert,console});
vm.runInContext(`
let G={units:[],round:1,mission:'bomb',aiSite:'A'},calls=0,dangers=0,steps=[],breaches=0,reactions=0;
const u={id:'A0',side:'A',alive:true,x:0,y:0,ap:1,mp:2,run:2,hp:5,ch:0,op:'ash'};
const beginAct=()=>{},dangerMap=()=>{dangers++;return []},sees=()=>new Set(),aiTurn=()=>{},shootables=()=>[];
const canDo=(u,k)=>k==='run'&&u.ap>0,aiGoal=()=>()=>false,cell=(x)=>({t:x===2&&breaches===0?'soft':'floor'}),blocks=c=>c.t==='soft';
const findPath=()=>{calls++;return {p:[[0,0],[1,0],[2,0],[3,0],[4,0]],cost:4}},unitAt=()=>null,enterCost=()=>1,stepNeed=()=>1,winOpen=()=>false,BH=async()=>{};
const step=async(u,x,y)=>{steps.push(x);u.x=x;u.y=y;u.mp--;return u.mp>0},aiBreach=async()=>{breaches++;return true};
const sprint=u=>{u.ap--;u.mp+=u.run},afterAct=async()=>{reactions++},overwatch=()=>{},endAct=()=>{},plantOK=()=>false,escortOK=()=>false;
`+cut('async function aiAttacker(u){','function dangerMap(){'),ai);
(async()=>{await vm.runInContext(`aiAttacker(u)`,ai);vm.runInContext(`assert.deepEqual(steps,[1,2,3,4]);assert.equal(calls,1);assert.equal(dangers,1);assert.equal(breaches,1);assert.equal(reactions,1);assert.equal(u.ap,0);`,ai);
 assert(html.includes("&&!u.defusing;\n  const showD="));
 console.log('PASS: exterior visibility/smoke, close-up tracking and original-camera restore, stable assault route, breach, one-action sprint, stationary turning');
})().catch(e=>{console.error(e);process.exit(1)});
