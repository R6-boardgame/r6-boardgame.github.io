const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const line=html.split('\n').find(l=>l.startsWith('const bombHid='));
const ctx=vm.createContext({assert});
vm.runInContext(`let G;${line}
for(const player of ['A','D'])for(const over of [false,true]){G={mission:'hostage',player,over};assert.equal(bombHid('A'),true);assert.equal(bombHid('B'),true);}
G={mission:'bomb',player:'A',bombC:{A:[1,1],B:[2,2]},bombSeen:{B:1}};assert.equal(bombHid('A'),true);assert.equal(bombHid('B'),false);
G={mission:'bomb',player:'D',bombC:{A:[1,1],B:[2,2]}};assert.equal(bombHid('A'),false);`,ctx);
console.log('PASS: hostage hides A/B sites for both sides; bomb unchanged');
