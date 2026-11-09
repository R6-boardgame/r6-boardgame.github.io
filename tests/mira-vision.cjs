const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
vm.runInNewContext(`
const G={W:9,H:9,grid:true,gadgets:[{alive:true,type:'mirror',x:4,y:4,mi:[0,1],side:'D'}],units:[]};
let wall={t:'soft',mirror:true},smoke=false;
const remoteDrone=g=>g.type==='drone'&&['twitch','echo','mozzie'].includes(g.own);
const cell=(x,y)=>x===4&&y===4?wall:{t:'floor'},blocks=c=>['soft','reinf','hard'].includes(c.t),smokeAt=()=>smoke,jammed=()=>false;
`+cut('function lineCells(','// light protection:')+cut('function sharedCells(','// attackers with line of sight')+`
assert.equal(sharedCells('D').size,0,'unattended mirror provides no sight');
for(const type of ['soft','reinf']){wall.t=type;
 assert(los(4,6,4,2,false,false,false,true),'inside sees outside');
 assert(!los(4,2,4,6,false,false,false,true),'outside cannot see inside');
 assert(!los(4,6,4,2),'inside cannot shoot through closed mirror');
 assert(!los(4,2,4,6,true),'marked target still cannot be shot through closed mirror');
 smoke=true;assert(!los(4,6,4,2,false,false,false,true));smoke=false;
 wall.mOpen=true;assert(los(4,2,4,6));assert(los(4,6,4,2));wall.mOpen=false;
}
`,{assert});
console.log('PASS: no mirror-generated sight, one-way operator vision, soft/reinforced hosts, closed shooting blocked, smoke blocked, open bidirectional');
