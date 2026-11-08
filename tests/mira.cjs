const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const ctx=vm.createContext({assert,console,setTimeout:()=>{}});
vm.runInContext(`let cells={},G={gadgets:[],phase:'setup'},R3={sig:'old'},cost=0,visible=true;
const cell=(x,y)=>cells[x+','+y]||(cells[x+','+y]={t:'floor'}),VR=()=>14,inFan=()=>true,los=()=>visible;
const canDo=()=>true,useAct=()=>cost++,fxEv=()=>{},note=()=>{},log=()=>{},render=()=>{},sleep=async()=>{},afterAct=async()=>{},nm=()=>'',wallBlast3D=()=>{},curSide=()=>'',gadgetAt=()=>null,SFX={fx:()=>false,boom:()=>{}};
`+cut('const mirSide=','// attackers passing')+cut('const mirCanOpen=','function mirDirs')+cut('async function mirOpen(','function mirSize')+cut('function mirrorDropPose(','function mirror3D')+cut('function destroyCell(','function shootables('),ctx);
(async()=>{await vm.runInContext(`(async()=>{
const u={alive:true,x:3,y:5,side:'D'},g={alive:true,x:3,y:2,type:'mirror',mi:[0,1]};G.gadgets=[g];cell(3,2).mirror=true;
assert(mirCanOpen(u,g),'remote interior permitted');u.y=0;assert(!mirCanOpen(u,g),'outside denied');u.y=5;visible=false;assert(!mirCanOpen(u,g),'blocked sight denied');visible=true;
u.y=20;assert(!mirCanOpen(u,g),'range enforced');u.y=5;
await mirOpen(u,g);assert.equal(cost,1);assert(g.open&&cell(3,2).mOpen);await mirOpen(u,g);assert.equal(cost,1);
for(const type of ['soft','reinf']){g.alive=true;cell(3,2).t=type;cell(3,2).mirror=true;destroyCell(3,2);assert(!g.alive&&!cell(3,2).mirror&&!cell(3,2).mOpen);}
const o={userData:{mirDrop:{at:1000,y:1,z:0,endY:.04,endZ:.6,rx:-1.5,rz:.1}},position:{},rotation:{}};mirrorDropPose(o,1000);assert.equal(o.position.y,1);mirrorDropPose(o,2000);assert(Math.abs(o.position.y-.04)<1e-8);
})()`,ctx);
assert(!/mira:\(u,x,y\)=>\{[^\n]*c.t=/.test(html),'mount must not change host material');
console.log('PASS: Mira interior/range/LOS opening, single action, host destruction, gravity animation and host material preservation');
})().catch(e=>{console.error(e);process.exitCode=1});
