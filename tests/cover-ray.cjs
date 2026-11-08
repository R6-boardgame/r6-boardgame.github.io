const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const ctx=vm.createContext({assert,console});
vm.runInContext(`
const G={round:1},PROF={};let cells={},shields={};
const cell=(x,y)=>cells[x+','+y]||{t:'floor'},shieldAt=(x,y)=>shields[x+','+y],winOpen=c=>c.kind==='window'&&c.t==='floor'&&!c.breach;
const cheb=(a,b,c,d)=>Math.max(Math.abs(a-c),Math.abs(b-d)),shFaces=(g,sh)=>(sh.x-g.x)*g.dir[0]+(sh.y-g.y)*g.dir[1]>0;
`+cut('function lineCells(','const hardC=')+cut('function protection(sh,t){','const OBSTK=')+`
const sh={x:0,y:0,op:'shooter'},t={x:4,y:2,op:'target'};
cells['3,1']={t:'hard'};assert.equal(protection(sh,t),0,'nearby wall not crossed must give no cover');
cells={};sh.y=2;cells['4,2']={t:'floor',obst:true,stand:.5};assert.equal(protection(sh,t),0,'standing tile excluded');
cells['3,2']={t:'floor',obst:true,stand:.5};assert.equal(protection(sh,t),0,'standing above furniture gives no furniture protection');
delete cells['4,2'];assert.equal(protection(sh,t),1,'crossed adjacent furniture');
cells['2,2']={t:'soft'};assert.equal(protection(sh,t),3,'wall and furniture stack');
cells['2,2'].hole=true;assert.equal(protection(sh,t),2,'holed wall gives one');
cells={'2,2':{t:'bar',kind:'door'}};assert.equal(protection(sh,t),2);
cells={'2,2':{t:'bar',kind:'window'}};assert.equal(protection(sh,t),1);
cells={'2,2':{t:'floor',kind:'window'}};assert.equal(protection(sh,t),1);
cells={'2,2':{t:'floor',shotOut:true}};assert.equal(protection(sh,t),0);
cells={};shields['3,2']={x:3,y:2,dir:[-1,0]};assert.equal(protection(sh,t),2);
shields['3,2'].dir=[1,0];assert.equal(protection(sh,t),0,'shield rear');
shields={};sh.y=0;t.y=4;cells={'3,2':{t:'soft'}};assert.equal(protection(sh,t),0,'corner-only contact gives no cover');
PROF.target={shield:true};assert.equal(protection(sh,t),2,'personal shield unaffected');
`,ctx);
console.log('PASS: no adjacent-wall bonus, no standing furniture cover, exact ray/corner cases, walls/windows/shields and stacking');
