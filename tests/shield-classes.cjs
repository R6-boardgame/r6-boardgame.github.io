const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))if(!/src=|text\/plain|application\/json/.test(m[1]))new vm.Script(m[2]);
const section=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const ctx=vm.createContext({assert,console,ECO:{},I18X:{},I18T:[]});
vm.runInContext(section('const COP_BASE=','const copSlot=')+section('function heavyShieldBlocks(','async function shootUnit(')+section('const canDo=','function useAct(')+`
const heavy={...copNew(),arm:3,d:[['Y','Y','Y'],['O','Y','Y','Y'],['Y']]};
assert(WPN.hs.trig(heavy));assert(!WPN.hs.trig({...heavy,arm:2}));
assert(!WPN.hs.trig({...heavy,d:[['Y','Y','Y'],['Y','Y','Y','Y'],['Y']]}));
const mobile={...copNew(),arm:2,run:3,d:[['O','Y','Y'],['O','Y','Y'],['Y']]};
assert(WPN.sh.trig(mobile));assert(!WPN.sh.trig({...mobile,run:2}));assert(!WPN.sh.trig({...mobile,arm:3}));
assert.equal(runCap({...mobile,w:'sh'}),3);assert.equal(runCap({...heavy,w:'hs'}),0);
assert.equal(wApply(mobile,'sh').run,3);
assert.equal(CSK.sh.n,'鎮壓暴徒');assert.equal(CSK.hs.ap,'免費');
for(const w of WORD)assert(!WPN[w].t.includes('手'));
for(const w of ['hs','sh'])for(const i of [0,1])assert(copArt({w},i).endsWith((i?'m':'f')+'_'+w+'.png'));
const target={w:'hs',heavyGuard:true,alive:true,x:0,y:0,fd:[0,1]};
for(const deg of [0,30,59.9,60]){const a=deg*Math.PI/180;assert(heavyShieldBlocks(target,{x:Math.sin(a),y:Math.cos(a)}));}
for(const deg of [60.1,90,180,270]){const a=deg*Math.PI/180;assert(!heavyShieldBlocks(target,{x:Math.sin(a),y:Math.cos(a)}));}
assert(!heavyShieldBlocks({...target,heavyGuard:false},{x:0,y:2}));
assert(!heavyShieldBlocks({...target,w:'sh'},{x:0,y:2}));
const actor={...target,ap:2,used:new Set()};assert(!canDo(actor,'shoot'));assert(canDo(actor,'run'));assert(canDo(actor,'cls'));
`,ctx);
for(const gender of ['f','m'])for(const w of ['hs','sh'])assert(fs.existsSync(require('node:path').join(__dirname,`../img/cop/${gender}_${w}.png`)));
assert(html.includes('if(sh.heavyGuard)return;'));
assert(!section('async function throwGadget(','//').includes('heavyShieldBlocks'));
console.log('PASS: syntax, both promotion conditions, movement caps, art paths, class names, 120-degree boundaries and attack gating');
