// v294: the player card's recruit avatar is the recruit art (no emblem icon); classes a custom operator has transferred into add class avatars.
// Run: python3 -m http.server 8016 & node tests/card-recruit-avatar-v294.cjs
const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
const URL=process.env.R6_TEST_URL||'http://127.0.0.1:8016/';
(async()=>{const b=await chromium.launch(process.env.R6_CHROME?{executablePath:process.env.R6_CHROME}:{});
try{const p=await b.newPage({viewport:{width:390,height:844}}),errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{try{localStorage.setItem('r6bg.profile',JSON.stringify({mode:'guest',guest:'訪客1',avatar:'recruit_d_rifle'}));}catch(e){}});
  await p.goto(URL,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>typeof renderSettings==='function'&&typeof OPBASE!=='undefined');
  const r=await p.evaluate(()=>{document.querySelectorAll('#boot,#loading,#login,#lgate').forEach(e=>e.remove());const old=ME.avatar;
    ECO.wu=['0:sn','1:hs'];ME.avatar='cop:0';openSettings();const avs=[...document.querySelectorAll('.hs289.avs .avb')].map(x=>[x.dataset.av,x.querySelector('img').getAttribute('src')]);
    const c=document.querySelector('.pc289');return {old,avs,pcAv:c.querySelector('.pcAv img').getAttribute('src'),art:c.querySelector('.pcArt').getAttribute('src'),
      friendOld:avSrc289('recruit_a_rifle'),friendArt:artSrc289('recruit_d_rifle'),hs:copAv('cop:1:hs').av};});
  assert.equal(r.old,'cop:1','old recruit emblem avatar becomes the male recruit');
  assert(!r.avs.some(([k,s])=>/^recruit_/.test(k)||/^data:/.test(s)&&/recruit/.test(k)),'no recruit emblem icons');
  assert.deepEqual(r.avs.slice(0,4).map(a=>a[0]),['cop:0','cop:0:sn','cop:1','cop:1:hs']);
  assert.equal(r.pcAv,'img/av/cop_f.webp');assert.equal(r.art,'img/cop/f.webp');
  assert.equal(r.friendOld,'img/av/cop_f.webp');assert.equal(r.friendArt,'img/cop/m.webp');assert.equal(r.hs,'img/av/cop_m_hs.webp');
  assert.deepEqual(errs,[]);console.log('PASS: recruit art avatar, class avatars after transfer');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
