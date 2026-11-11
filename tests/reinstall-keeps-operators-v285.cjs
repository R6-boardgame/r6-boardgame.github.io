// v285: deleting the home-screen icon (fresh storage) and signing in again must bring back trained operators and fallen seniors
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const ctx=vm.createContext({assert,console});
vm.runInContext(`
const store={};let reloads=0,cloud={},saved=[],now=1e12;
const Date={now:()=>now};
const localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
const location={reload:()=>reloads++};
const setTimeout=fn=>{fn();return 1;},clearTimeout=()=>{};
const renderPlayer=()=>{},renderSettings=()=>{},lgState=()=>{},renderTitle=()=>{},acctLoad=()=>Promise.resolve(true);let SCREEN='';
const PKEY='r6bg.profile',EKEY='r6bg.eco',AKEY='r6bg.ach',FKEY='r6bg.social';
const ME={mode:'guest',guest:'訪客1234',nick:'',avatar:'a',usePhoto:false,lang:'zh'};const saveMe=()=>{};const meName=()=>'吾主';const $=()=>null;
let ECO={rn:0,own:[],mx:{},sk:[],ts:0},AS={got:{},n:{}},FR={list:[]};
const ecoSave=()=>{ECO.ts=Date.now();};
const R6FB={load:async()=>cloud[GA.u.uid]?JSON.parse(JSON.stringify(cloud[GA.u.uid])):null,save:async d=>{saved.push([GA.u.uid,d]);cloud[GA.u.uid]=d;}};
let BOARD=[];const window={claude:{use:async n=>n==='user'?{id:async()=>'g'+GA.u.uid}:n==='db'?{collection:()=>({get:async()=>({docs:BOARD.map(([id,d])=>({id,data:()=>d}))})})}:null}};const claude=window.claude;window.R6FB=R6FB;
`+cut('var GA={u:null','function gaHTML(')+`
globalThis.T={store,cloud,GA,gaOn,gaAlumRescue285,setNow:v=>{now=v},setBoard:b=>{BOARD=b},get ECO(){return ECO},setECO:e=>{ECO=e;}};
`,ctx);
const {T}=ctx;
const trained=(gen,k,nm)=>({nm,e:k,k,sv:3,d:[['R'],['O'],['Y']],arm:2,run:0,vis:0,w:'ar',gen});
const blank=gen=>({nm:'新進人員',e:0,k:0,sv:0,d:[['Y'],['Y'],['Y']],arm:1,run:0,vis:0,w:null,gen});
const cloudEco=e=>JSON.parse(T.cloud.A.ecoJ);
(async()=>{
  // the account's cloud save: two trained operators and one fallen senior
  T.cloud.A={ecoJ:JSON.stringify({rn:500,own:['ash'],mx:{},sk:[],cop:[trained(1,7,'阿虎'),trained(2,4,'小咪')],alum:[{i:1,nm:'老兵',k:9,sv:5,ts:5e11}],ts:9e11})};
  // fresh install: the boot already saved blank daily-task state, so the local ECO is NEWER than the cloud
  T.setNow(1e12);T.setECO({rn:0,own:[],mx:{},sk:[],cop:null,day:'2026-11-11',ts:1e12});
  await T.gaOn({uid:'A',email:'x@y.com'});
  assert.equal(T.ECO.cop[0].nm,'阿虎');assert.equal(T.ECO.cop[0].k,7);assert.equal(T.ECO.cop[1].nm,'小咪');
  assert.equal(T.ECO.alum.length,1);assert.equal(T.ECO.rn,500);
  assert.equal(cloudEco().cop[0].nm,'阿虎','the push after sign-in must not erase the cloud operators');
  // a device that still has the old local copy can no longer be overwritten by a blank cloud slot of the same generation
  T.GA.u=null;T.cloud.A={ecoJ:JSON.stringify({rn:600,own:[],mx:{},sk:[],cop:[blank(1),blank(1)],alum:[],ts:2e12})};T.store['r6bg.glink']='A';
  T.setECO({rn:500,own:[],mx:{},sk:[],cop:[trained(1,7,'阿虎'),trained(2,4,'小咪')],alum:[{i:1,nm:'老兵',k:9,sv:5,ts:5e11}],ts:9e11});
  await T.gaOn({uid:'A',email:'x@y.com'});
  assert.equal(T.ECO.cop[0].nm,'阿虎');assert.equal(T.ECO.cop[1].k,4);assert.equal(T.ECO.alum.length,1);assert.equal(T.ECO.rn,600);
assert.equal(cloudEco().cop[1].nm,'小咪');
  // an operator that really died elsewhere (next generation) still replaces the stale one
  T.GA.u=null;T.cloud.A={ecoJ:JSON.stringify({rn:600,own:[],mx:{},sk:[],cop:[blank(2),trained(2,4,'小咪')],alum:[{i:1,nm:'老兵',k:9,sv:5,ts:5e11},{i:0,nm:'阿虎',k:7,sv:3,ts:1.5e12}],ts:3e12})};
  T.setECO({rn:600,own:[],mx:{},sk:[],cop:[trained(1,7,'阿虎'),trained(2,4,'小咪')],alum:[{i:1,nm:'老兵',k:9,sv:5,ts:5e11}],ts:2e12});
  await T.gaOn({uid:'A',email:'x@y.com'});
  assert.equal(T.ECO.cop[0].gen,2);assert.equal(T.ECO.cop[0].k,0);assert.equal(T.ECO.alum.length,2);
  // seniors lost from the save come back from the leaderboard's fallen rows
  T.setECO(Object.assign(T.ECO,{alum:[]}));
  T.setBoard([['gA_fallen_400000000000_0',{nm:'學姐',k:3,sv:2,by:'吾主',i:0,w:'sg',dead:true,ts:4e11}],['gB_fallen_1_0',{nm:'別人',k:1,sv:1,i:0,dead:true,ts:1}],['gA_0',{nm:'現役',k:1,sv:1,i:0}]]);
  await T.gaAlumRescue285();
  assert.equal(JSON.stringify(T.ECO.alum.map(a=>a.nm)),'["學姐"]');
  console.log('PASS: reinstall + sign-in keeps trained operators and seniors; real deaths still win; seniors restored from leaderboard');
})().catch(e=>{console.error(e);process.exit(1);});
