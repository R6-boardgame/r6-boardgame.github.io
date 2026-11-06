const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>{assert(html.includes(a),a);return html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));};
const ctx=vm.createContext({assert});
vm.runInContext(`const I18X={},I18T=[];let ECO={sk:[],cop:[]};`+cut('const COP_BASE=','const copW=')+`
const g=wApply(copNew(),'mg');g.d=[['R','O','Y'],['O','Y','Y'],['O','Y','Y']];
assert.deepEqual(copDice(g).map(L=>L.join('')),['ROYY','OYYY','OYYY']);
assert.deepEqual(g.d.map(L=>L.length),[3,3,3]);
const r=wApply(copNew(),'rf');assert.deepEqual(copDice(r),r.d);
const n=copNew();assert.deepEqual(copDice(n),[['Y'],['Y'],['Y']]);
`,ctx);
console.log('gunner free die ok');
