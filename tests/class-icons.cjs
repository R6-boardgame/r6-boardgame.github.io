const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const source=html.slice(html.indexOf('const WSVG='),html.indexOf('// class skills (職業技能)'));
const {WPN,CLASS_ART_BOX}=Function(source+';return {WPN,CLASS_ART_BOX}')();
assert.deepEqual(Object.keys(CLASS_ART_BOX),['hs','sh','mg','sg','rf','sn','smg']);
assert(fs.statSync(path.join(root,'img/ui/class-skills-v233.jpg')).size>0);
for(const [key,box] of Object.entries(CLASS_ART_BOX)){
 const [x,y,w,h]=box;
 assert(x>=0&&y>=0&&x+w<=853&&y+h<=1280);
 assert(WPN[key].ic.includes(`viewBox="${box.join(' ')}"`));
 assert(WPN[key].ic.includes('overflow="hidden"'));
 assert(WPN[key].ic.includes('href="img/ui/class-skills-v233.jpg"'));
 assert(!WPN[key].ic.includes('<text'));
}
console.log('PASS: seven class icons use approved artwork, bounded label-free viewports, one shared image');
