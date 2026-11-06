const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const ctx=vm.createContext({assert,console});
vm.runInContext(`
const store={};let reloads=0,cloud={},saved=[];
const localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
const location={reload:()=>reloads++};
const setTimeout=fn=>{fn();return 1;},clearTimeout=()=>{};
const renderPlayer=()=>{},renderSettings=()=>{},lgState=()=>{},renderTitle=()=>{},acctLoad=()=>Promise.resolve(true);let SCREEN='';
const PKEY='r6bg.profile',EKEY='r6bg.eco',AKEY='r6bg.ach',FKEY='r6bg.social';
const ME={mode:'guest',guest:'訪客1234',nick:'',avatar:'a',usePhoto:false,lang:'zh'};const saveMe=()=>{};
let ECO={rn:0,own:[],mx:{},sk:[],ts:0},AS={got:{},n:{}},FR={list:[]};
const ecoSave=()=>{ECO.ts=Date.now();};
const R6FB={load:async()=>cloud[GA.u.uid]||null,save:async d=>{saved.push([GA.u.uid,d]);cloud[GA.u.uid]=d;}};
`+cut('var GA={u:null','function gaHTML(')+`
globalThis.T={store,get reloads(){return reloads},cloud,saved,GA,gaOn,get ECO(){return ECO},setECO:e=>{ECO=e;}};
`,ctx);
const {T}=ctx;
(async()=>{
  // owner signs in on a fresh device: gets the owner gift and the link
  await T.gaOn({uid:'A',email:'aesopfilmedit@gmail.com'});
  assert.equal(T.store['r6bg.glink'],'A');assert(T.ECO.rn>=999999);assert.equal(T.reloads,0);
  // sign out: local progress is wiped and the page reloads
  T.store['r6bg.eco']=JSON.stringify(T.ECO);await T.gaOn(null);
  assert.equal(T.reloads,1);assert.equal(T.store['r6bg.eco'],undefined);assert.equal(T.store['r6bg.glink'],undefined);
  assert.equal(JSON.parse(T.store['r6bg.profile']).mode,'guest');
  // a different account signing in while A's data is still local (old version never wiped): wipe + reload, no save
  T.GA.u=null;T.store['r6bg.glink']='A';T.store['r6bg.eco']='{"rn":5}';const n=T.saved.length;
  await T.gaOn({uid:'B',email:'b@x.com'});
  assert.equal(T.reloads,2);assert.equal(T.store['r6bg.eco'],undefined);assert.equal(T.saved.length,n);
  // after the reload B starts fresh: no owner gift
  T.GA.u=null;T.setECO({rn:0,own:[],mx:{},sk:[],ts:0});await T.gaOn({uid:'B',email:'b@x.com'});
  assert.equal(T.ECO.rn,0);assert(!T.ECO.g58);assert.equal(T.store['r6bg.glink'],'B');
  // B's cloud doc polluted before the fix (carries the owner gift): discarded
  T.GA.u=null;T.cloud.C={ecoJ:JSON.stringify({rn:1000050,g58:1,own:['ash'],ts:9e15})};T.store['r6bg.glink']='C';
  T.setECO({rn:0,own:[],mx:{},sk:[],ts:0});await T.gaOn({uid:'C',email:'c@x.com'});
  assert.equal(T.ECO.rn,0);assert.equal(T.ECO.own.length,0);
  // polluted local data for the same account: wipe + reload
  T.GA.u=null;T.cloud.D={ecoJ:JSON.stringify({rn:1000050,g58:1})};T.store['r6bg.glink']='D';T.setECO({rn:1000050,g58:1,own:[],mx:{},sk:[]});const r=T.reloads;
  await T.gaOn({uid:'D',email:'d@x.com'});assert.equal(T.reloads,r+1);
  // the owner's own cloud doc keeps its gift; same account re-login merges normally
  T.GA.u=null;T.cloud.A={ecoJ:JSON.stringify({rn:1000050,g58:1,own:['ash'],ts:9e15})};T.store['r6bg.glink']='A';T.setECO({rn:0,own:[],mx:{},sk:[],ts:0});
  await T.gaOn({uid:'A',email:'aesopfilmedit@gmail.com'});assert.equal(T.ECO.rn,1000050);assert.equal(JSON.stringify(T.ECO.own),'["ash"]');
  // a guest who never linked keeps their progress when signing in the first time
  T.GA.u=null;delete T.store['r6bg.glink'];T.setECO({rn:700,own:['sledge'],mx:{},sk:[],ts:1});const r2=T.reloads;
  await T.gaOn({uid:'E',email:'e@x.com'});assert.equal(T.reloads,r2);assert.equal(T.ECO.rn,700);
  console.log('PASS: sign-out wipes local progress, switching Google accounts starts fresh, leaked owner progress is discarded, guest first link kept');
})().catch(e=>{console.error(e);process.exit(1);});
