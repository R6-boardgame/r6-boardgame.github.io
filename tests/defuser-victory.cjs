const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const ctx=vm.createContext({assert});
vm.runInContext(`
let G,wins=0,starts=0,awards=0;
const OPS={test:{name:'Test'}},nm=()=> 'Test',SFX={round(){}},bigNote=()=>{},log=()=>{},render=()=>{};
const setTimeout=fn=>fn(),achGive=()=>awards++,alive=s=>G.units.filter(u=>u.alive&&u.side===s);
const finish=(w,why)=>{wins++;G.over=true;G.win=w;G.why=why;G.active=null;};
const owqStart=()=>false,curSide=()=> 'D',endAct=()=>{},overwatch=()=>{},pub=()=>false;
const closeMovementPhase=()=>{},startPhase=()=>starts++;
const evacPhaseEnd=()=>{};
`+cut('function dfU(){','function dfTxt(){')+cut('function dfDone(u){','// v113:')+cut('function endPhase(){','function startPhase(){')+`
for(const player of ['A','D'])for(const attackersAlive of [true,false]){
 const d={id:'d',op:'test',side:'D',alive:true,defusing:true,x:1,y:1};
 G={player,units:[d,{side:'A',alive:attackersAlive}],defuser:{by:'d',dleft:1,timer:1},gadgets:[],phaseIdx:1,round:1,active:null};
 const before=wins;endPhase();assert.equal(G.over,true);assert.equal(G.win,'D');assert.equal(wins,before+1);
 assert.equal(G.defuser,null);assert.equal(d.defusing,false);assert.equal(G.phaseIdx,1);assert.equal(starts,0);
 assert.equal(!!G._df,player==='D');dfDone(d);endPhase();assert.equal(wins,before+1);
}
assert.equal(awards,2);
const d={id:'d',op:'test',side:'D',alive:true,defusing:true,x:1,y:1};
G={player:'A',units:[d],defuser:{by:'d',dleft:2,timer:3},gadgets:[],phaseIdx:1,round:1};
endPhase();assert(!G.over);assert.equal(G.defuser.dleft,1);assert.equal(starts,1);
`,ctx);
console.log('PASS: defender victory with living/dead attackers, both player sides, phase stops immediately, awards preserved, duplicate completion guarded, unfinished defuse continues');
