const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const ctx=vm.createContext({assert,console});
vm.runInContext(`
let G={W:10,H:10,round:1,gadgets:[],units:[]};
const cells={};const floor=()=>({t:'floor',indoor:true});
const cell=(x,y)=>cells[x+','+y]||(cells[x+','+y]=floor());
const blocks=c=>['hard','soft','reinf','bar'].includes(c.t),shieldAt=()=>null,adj8=()=>[],cheb=(a,b,c,d)=>Math.max(Math.abs(a-c),Math.abs(b-d)),PROF={};
`+cut('function lineCells(','function segCells(')+cut('function protection(sh,t){','const OBSTK=')+`
const a={op:'x',x:0,y:2},e={op:'y',x:6,y:2};
cells['3,2']={t:'bar',kind:'window'};assert.equal(protection(a,e),1);
cells['3,2']={t:'bar',kind:'door'};assert.equal(protection(a,e),2);
cells['3,2']={t:'floor',kind:'window',wasBar:true};assert.equal(protection(a,e),0);
`,ctx);
console.log('PASS: window barricade cover 1, door barricade 2, shot-out window 0');
