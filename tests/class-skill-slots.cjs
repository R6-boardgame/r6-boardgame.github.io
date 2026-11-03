const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>{assert(html.includes(a),a);return html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));};
const ctx=vm.createContext({assert,console});
vm.runInContext(`
const I18X={},I18T=[];let ECO={sk:['zofia'],cop:[]},G={round:1,player:'A'},DMGBY=null;
const OPC={zofia:{side:'A',name:'Zofia',zh:{g:'Zofia'}}},OPS={zofia:{g:'Zofia',ch:2}},ensureOp=()=>{};
const PROF={test:{d:['YOR','YOR','YOR']}},INV={A:{},D:{}},edist=()=>2,band=()=>0,SHOTP=0,protection=()=>0,thruWall=()=>false;
const render=()=>{},afterAct=async()=>{},log=()=>{},note=()=>{},nm=()=> 'Test';
const useAct=(u,k)=>{u.ap--;u.used.add(k);};
const dmgMod=(u,n)=>n,ST=u=>u.st||(u.st={taken:0}),finkaSave=()=>false,checkWin=()=>{};
`+cut('const COP_BASE=','const copW=')+cut('const SKSKIP=','// game hooks:')+cut('const COPDEF=','// the other side')+cut('function lockRushDie(','function askWall(')+cut('const canDo=','function useAct(')+cut('async function useCsk(','async function machineSweep(')+cut('async function damage(','function checkWin(')+`
for(const w of WORD){
 const c=wApply(copNew(),w);assert(classEquipped(c));ECO.cop=[c,copNew()];const u={side:'A'};copUnit(u,0);assert(hasClassSkill(u));assert.equal(u.sk,undefined);
 c.sk='zofia';const v={side:'A'};copUnit(v,0);assert(!hasClassSkill(v));assert.equal(v.sk,'zofia');
 c.sk=null;assert(!classEquipped(c));
}
ECO.cop=[{...copNew(),w:'smg',sk:null,classSlotV1:undefined},{...copNew(),w:'hs',sk:'zofia',classSlotV1:undefined}];
copAll();assert.equal(ECO.cop[0].sk,'cls:smg');assert.equal(ECO.cop[1].sk,'zofia');ECO.cop[0].sk=null;copAll();assert.equal(ECO.cop[0].sk,null);
assert.equal(copNew({sk:'cls:smg'}).sk,null);assert.equal(copNew({sk:'zofia'}).sk,'zofia');
assert.equal(lockRushDie('YoR').locked,'R');assert.equal(lockRushDie('YOY').locked,'O');assert.equal(lockRushDie('YYY').locked,'Y');assert.equal(lockRushDie('r').pool,'');assert.equal(lockRushDie('').pool,'');
const sh={op:'test'},target={op:'test',w:'smg'};
assert.equal(shotPool(sh,target,true).pool,'YO');assert.equal(shotPool(sh,target,false).pool,'YOR');assert.equal(shotPool(sh,{...target,w:'rf'},true).pool,'YOR');
assert(!canDo({ap:2,w:'smg',used:new Set(['shoot'])},'shoot'));
`,ctx);
vm.runInContext(`const CP={i:0,skTab:'all',skSel:'cls:sh'},RNI='',fmtN=String,esc=String,opIcon=()=> 'icon.png',setupGadget=()=>false;SKL=['zofia'];`
+cut('function cpSkillPage(){','function skBuy(')+cut('function copCard(c){','// ---------- custom operator page')+`
ECO.cop=[{...copNew(),w:'sh',sk:'zofia'},copNew()];
for(const tab of ['all','own','class']){CP.skTab=tab;const page=cpSkillPage();assert(page.includes('data-sk="cls:sh"'));assert(page.includes('鎮壓暴徒'));assert(page.includes('id="cpSkEq"'));assert(page.includes('職業主動技與幹員技能共用一格'));}
ECO.cop[0].sk='cls:sh';assert(cpSkillPage().includes('裝備中'));const card=copCard({id:'recruit_a_rifle',side:'A',zh:{},g:{}});assert.equal(card.zh.g,'鎮壓暴徒');
OPC.recruit_a_rifle={};OPS.recruit_a_rifle={};PROF.recruit_a_rifle={};copPrep(true);assert.equal(OPS.recruit_a_rifle.g,'鎮壓暴徒');
ECO.cop[0].sk='zofia';copPrep(true);assert.equal(OPS.recruit_a_rifle.g,'Zofia');
`,ctx);
(async()=>{await vm.runInContext(`(async()=>{
 for(const [w,hp] of [['sh',9],['hs',10],['smg',8]]){const u={w,alive:true,hp:10,side:'A'};await damage(u,2);assert.equal(u.hp,hp);}
 const u={w:'smg',clsSkill:'smg',ap:2,mp:1,run:5,side:'A',used:new Set(['run'])};await useCsk(u);assert.equal(u.mp,6);assert.equal(u.ap,1);assert(!u.noShoot);await useCsk(u);assert.equal(u.mp,6);
 const unequipped={...u,csk:0,clsSkill:null};await useCsk(unequipped);assert.equal(unequipped.mp,6);
})()`,ctx);
console.log('PASS: 7 exclusive skill slots, default migration preserves operator skills, unequip persists, death reset, red/orange/yellow lock order including last die, movement-only passive, shield 1/2 damage reduction, no second shot, extra sprint once without shoot restriction');})().catch(e=>{console.error(e);process.exit(1)});
