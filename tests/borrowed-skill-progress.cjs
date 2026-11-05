const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const ctx=vm.createContext({assert,console});
vm.runInContext(`
let G,ECO,saved;const COP_BASE=10,COP_CAP=34,CDIEC={Y:1,O:2,R:3},CP={dr:null},NET=null;
const ST=u=>u.st,ecoRoll=()=>{},dayKey=()=> 'test',tkClaimable=()=>0,mxLv=()=>0,renderPlayer=()=>{};
const ecoAdd=n=>ECO.rn+=n,ecoSave=()=>{saved=JSON.parse(JSON.stringify(ECO));};
const OPC={recruit_a_rifle:{base:'recruit',name:'Recruit'},recruit_a_shotgun:{base:'recruit',name:'Recruit'},recruit:{name:'Recruit'},zofia:{base:'zofia',name:'Zofia'}};
const copScore=()=>({rk:'N'});
const myCopU=()=>G.units.find(u=>u.side===G.player&&unitCopSlot(u)!=null),copUnlock=()=>{delete ECO.copOut;};
const classOf=k=>typeof k==='string'&&k.startsWith('cls:')?k.slice(4):null;
`+cut('const copNew=','const copSpent=')+cut('const copSlot=','const copW=')+cut('function copEnd(lines){','// 學長姐:')+cut('function ecoGame(w){','function ecoBanner(){')+`
let fail=false;
let gTargets=u=>{assert.equal(u.op,'zofia');assert.match(unitOp(u),/^recruit_/);return [];};
let useGadget=async u=>{assert.equal(u.op,'zofia');gTargets(u);assert.match(unitOp(u),/^recruit_/);if(fail)throw Error('test');u.st.k=2;ecoGame('A');};
`+cut('{const _gt=gTargets;','{const _oa=opArt;'),ctx);
(async()=>{await vm.runInContext(`(async()=>{
for(const slot of [0,1])for(const living of [true,false]){
 ECO={cop:[copNew(),copNew()],rn:0,dp:{},wp:{},wops:[],mx:{},sk:[]};
 const u={side:'A',op:slot?'recruit_a_shotgun':'recruit_a_rifle',cop:slot,sk:'zofia',alive:living,st:{k:0,gad:1}};
 G={player:'A',units:[u]};await useGadget(u);
 assert.match(u.op,/^recruit_/);assert.equal(u._op,undefined);assert.equal(saved.mx.zofia,undefined);assert.equal(saved.mx.recruit,220);
 if(living){assert.equal(saved.cop[slot].e,2);assert.equal(saved.cop[slot].k,2);assert.equal(saved.cop[slot].sv,1);}
 else{assert.equal(saved.cop[slot].e,0);assert.equal(saved.alum[0].k,2);}
 const snapshot=JSON.stringify(saved);ecoGame('A');assert.equal(JSON.stringify(saved),snapshot);
}
assert.equal(unitCopSlot({op:'zofia'}),null);
assert.equal(unitCopSlot({op:'zofia',_op:'recruit_a_shotgun'}),1);
fail=true;const u={op:'recruit_a_rifle',sk:'zofia'};await assert.rejects(()=>useGadget(u));assert.equal(u.op,'recruit_a_rifle');assert.equal(u._op,undefined);
})()`,ctx);console.log('PASS: Zofia final skill kill awards 2 points / 1 survival, both slots, death reset, saved progression, original mastery identity, duplicate settlement, nested skill lookup and exception cleanup');})().catch(e=>{console.error(e);process.exit(1)});
