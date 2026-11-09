const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.R6_TEST_URL||'http://127.0.0.1:8016/',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>typeof copScale252==='function'&&!!R3);
 await p.addStyleTag({content:'#boot,#login,#lgate,#tuOverlay{display:none!important}'});await p.evaluate(()=>{G=null;SCREEN='title';render();renderPlayer();openCop();ecoSave=()=>{};});
 for(const [width,height] of [[1600,1000],[1400,900],[1000,640]]){
  await p.setViewportSize({width,height});await p.evaluate(()=>{renderCop();menuSync250();});await p.waitForTimeout(350);
  const g=await p.evaluate(()=>{const box=s=>document.querySelector(s).getBoundingClientRect(),name=box('.cpName254'),job=box('.cpId>.cpTag'),kd=box('.cpKd'),radar=box('.cpPenta');return {nameGap:job.top-name.bottom,statGap:kd.top-job.bottom,radarGap:radar.top-kd.bottom,center:[...document.querySelectorAll('.cpAlB,.cpSw button')].map(e=>{const r=e.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(e);const t=range.getBoundingClientRect();return Math.abs((t.left+t.right-r.left-r.right)/2);})};});
  assert(g.nameGap>=6&&g.statGap>=12&&g.radarGap>=9,JSON.stringify(g));assert(g.center.every(x=>x<1),JSON.stringify(g));
 }
 await p.setViewportSize({width:1600,height:1000});await p.evaluate(()=>renderCop());await p.locator('.cpNm').click();assert(await p.locator('#cpNm').isVisible());await p.locator('#cpNm').press('Escape');assert.equal(await p.locator('#cpNm').count(),0);
 await p.evaluate(()=>{const c=copAll()[0];c.w='sn';c.nm='我的自訂姓名';CP.i=0;copDraft();renderCop();});
 assert.equal(await p.locator('.cpNm').textContent(),'我的自訂姓名');assert.equal(await p.locator('.cpId>.cpTag').textContent(),'狙擊兵');
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>renderCop());await p.waitForTimeout(350);assert.equal(await p.locator('.cpName254').evaluate(e=>getComputedStyle(e).display),'contents');assert.deepEqual(errors,[]);
 console.log('PASS v254 independent name/class plates, separated stats, centered header labels, click-to-rename and live class label; phone wrapper is layout-neutral');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
