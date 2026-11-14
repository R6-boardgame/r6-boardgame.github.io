// v301: achievement names are card titles; unlocked achievements show in the title row with a rarity-coloured frame.
// Run: python3 -m http.server 8016 & node tests/ach-titles-v301.cjs   (R6_PLAYWRIGHT / R6_TEST_URL / R6_SHOT_DIR optional)
const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
const URL=process.env.R6_TEST_URL||'http://127.0.0.1:8016/',DIR=process.env.R6_SHOT_DIR||'/tmp';
(async()=>{const browser=await chromium.launch();
try{for(const [w,h,tag] of [[390,844,'phone'],[1440,900,'desktop']]){
  const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:2}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(URL,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof renderSettings==='function'&&typeof achTier==='function');
  const r=await page.evaluate(()=>{document.querySelectorAll('#boot,#loading,#login,#lgate').forEach(e=>e.remove());
    const names=ACH.map(a=>a.n);
    ['ace','kZap','deadWin','first','vet','kills50','owl','opsAll','tourist'].forEach(id=>AS.got[id]=Date.now());
    ECO.title='ach:ace';ME.nick='一起打槍';openSettings();
    const box=document.querySelector('.ps289'),btn=[...box.querySelectorAll('[data-ttl^="ach:"]')];
    const tt=box.querySelector('.pc289 .pcTtl');
    const c=myCard289();
    ECO.title='ach:storm';const locked=ttl289();
    ECO.title='ach:kZap';renderSettings();
    return {n:names.length,uniq:new Set(names).size,maxLen:Math.max(...names.map(x=>x.length)),btn:btn.map(b=>[b.textContent,b.className]),tt:tt&&tt.textContent,ttCls:tt&&tt.className,card:[c.t,c.tk],locked,
      frame:getComputedStyle(document.querySelector('.ps289 .pc289 .pcTtl')).color,tier:[achTier(ACHM.ace),achTier(ACHM.kZap),achTier(ACHM.vet),achTier(ACHM.first)]};});
  console.log(tag,JSON.stringify(r));
  assert.equal(r.uniq,r.n,'achievement names are unique');assert(r.maxLen<=8,'short enough for a card title');
  assert.equal(r.btn.length,9);assert(r.btn[0][1].includes('at-l'),'legendary first');
  assert.equal(r.tt,'還有誰本人');assert(/at-l/.test(r.ttCls));assert.deepEqual(r.card,['還有誰本人','l']);assert.equal(r.locked,'','locked achievement gives no title');
  assert.deepEqual(r.tier,['l','x','g','c']);
  await page.waitForTimeout(300);await page.screenshot({path:`${DIR}/ach-titles-v301-settings-${tag}.png`});
  // the opponent sees the same frame
  await page.evaluate(()=>{ECO.title='ach:deadWin';const c=myCard289();closeSettings();profGet=async()=>({id:'u_x',n:'夜鷹',c:Object.assign({},c,{n:'夜鷹'})});openCard289('u_x','夜鷹');});
  await page.waitForFunction(()=>document.querySelector('#card289 .pcTtl.at-x'));await page.waitForTimeout(300);
  await page.screenshot({path:`${DIR}/ach-titles-v301-opponent-${tag}.png`});
  await page.evaluate(()=>{document.querySelector('#card289').hidden=true;openAch('ach');ACHV.sel='kZap';renderAch();});await page.waitForTimeout(300);
  await page.screenshot({path:`${DIR}/ach-titles-v301-ach-${tag}.png`});
  assert.deepEqual(errors,[]);await page.close();}
  console.log('PASS: achievement titles');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
