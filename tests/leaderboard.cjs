const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
for(const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){if(/\bsrc=|text\/plain|opdata/.test(m[1]))continue;new vm.Script(m[2]);}
const source=html.slice(html.indexOf('const LB='),html.indexOf('function trainHTML'));
const writes=new Map(),c={console,Map,Date,Object,Promise,JSON,SCREEN:'test',window:{claude:true},WPN:{sn:{},hs:{}},ECO:{alum:[{i:1,ts:123,w:'hs',nm:'老兵',k:0,sv:0,by:'敵人'}]},copAll:()=>[{nm:'新人',k:1,sv:2,w:'sn'},{nm:'新進人員',k:0,sv:0}],lobNm:(c,i)=>c.nm,meName:()=> '擁有者',profPush:()=>{},renderTitle:()=>{},copArt:(c,i)=>`img/cop/${i?'m':'f'}${c.w?'_'+c.w:''}.webp`,esc:s=>String(s).replace(/</g,'&lt;'),claude:{use:async k=>k==='user'?{id:async()=> 'uid'}:{doc:id=>({set:async d=>writes.set(id,d),delete:async()=>writes.delete(id)})}}};
vm.createContext(c);vm.runInContext(source,c);
(async()=>{
 assert.equal(vm.runInContext('lbRows().length',c),1);
 assert.equal(vm.runInContext("lbRows('fallen')[0].by",c),'擁有者');
 await vm.runInContext('lbPush()',c);
 assert.equal(writes.get('board/uid_0').w,'sn');assert.equal(writes.get('board/uid_fallen_123_1').dead,true);
 vm.runInContext("LB.list=Array.from({length:60},(_,i)=>({id:'other_'+i,nm:'測試',by:'玩家',k:100-i,sv:2,i:i%2,w:'sn'}));LB.t=Date.now()",c);
 const page=vm.runInContext('boardHTML()',c);
 assert.equal((page.match(/data-rank=/g)||[]).length,51); // 50 list + own (rank 61)
 assert(page.includes('data-rank="61"'));assert(!page.includes('data-rank="51"'));
 assert.equal(vm.runInContext("lbRows('fallen').length",c),1);
 vm.runInContext("LB.tab='fallen'",c);assert(vm.runInContext('boardHTML()',c).includes('老兵'));
 assert.equal(vm.runInContext("lbArt({i:1,w:'../../evil'})",c),'img/cop/m.webp');
 console.log('PASS: script syntax, split boards, legacy data, owner attribution, artwork, 50-entry cap, own rank beyond 50, fallen publication');
})().catch(e=>{console.error(e);process.exitCode=1});
