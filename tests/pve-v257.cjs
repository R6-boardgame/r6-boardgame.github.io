const {chromium,devices}=require(process.env.R6_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.R6_TEST_URL||'http://127.0.0.1:8016/';
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.R6_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1600,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.stack||e.message));
  await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof pvRender257==='function'&&!!R3);
  await page.addStyleTag({content:'#boot,#login,#lgate,#tuOverlay{display:none!important}'});
  await page.evaluate(()=>{G=null;SCREEN='title';WZ.coop=false;TU=null;render();renderTitle();});
  const pv=page.locator('#wiz.pv257'),next=()=>pv.locator('#wzNext').click(),key=()=>page.keyboard.press('Escape');
  const step=async i=>{await pv.waitFor();assert.equal(await pv.getAttribute('data-pv-step'),String(i));};
  const snap=async i=>{if(process.env.R6_SHOTS){fs.mkdirSync(process.env.R6_SHOTS,{recursive:true});await page.screenshot({path:process.env.R6_SHOTS+'/0'+(i+1)+'.jpg',type:'jpeg',quality:91});}};
  const layout=async()=>pv.evaluate(el=>{
   const r=s=>el.querySelector(s).getBoundingClientRect(),a=r('.pvBack'),b=r('.pvHeader h2'),h=r('.pvHeader'),p=r('.pvMain'),f=r('.pvFooter');
   return {clear:a.right<b.left,inside:a.top>=h.top&&a.bottom<=h.bottom,main:p.top>=h.bottom&&p.bottom<=f.top,foot:f.bottom<=innerHeight+1,hit:el.querySelector('.pvBack').contains(document.elementFromPoint(a.x+a.width/2,a.y+a.height/2)),scroll:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight};
  });
  const check=async(i)=>{await step(i);const l=await layout();assert(l.clear&&l.inside&&l.main&&l.foot&&l.hit&&!l.scroll,JSON.stringify(l));assert.equal(await pv.locator('.pvSteps button').count(),7);await snap(i);};
  await page.locator('#t-pve').click();await step(0);
  await pv.locator('[data-wz-side=A]').click();await check(0);
  await pv.locator('#wzRules').click();await page.locator('#rbook').waitFor();
  await key();assert(!(await page.locator('#rbook').isVisible()));await step(0);
  await next();await pv.locator('[data-wz-mis=bomb]').click();await check(1);
  await next();await pv.locator('[data-wz-map=bank]').click();await pv.locator('.pvMap3.ready').waitFor();await check(2);
  await next();await step(3);await pv.locator('#mfRnd').click();assert.equal(await pv.locator('[data-pvslot]').count(),5);
  await pv.locator('[data-k=ash]').click();await check(3);
  await pv.locator('[data-pvslot]').first().click();assert(await pv.locator('#wzNext').isDisabled());
  await pv.locator('#mfRnd').click();await next();await check(4);
  await pv.locator('#mfRnd').click();assert.equal(await page.evaluate(()=>invUsed('A')),6);
  assert.equal(await pv.locator('[data-iv][data-d="1"]:enabled').count(),0);
  await key();await step(3);await next();await next();await step(5);
  assert.deepEqual(await pv.locator('[data-tm]').evaluateAll(es=>es.map(e=>+e.dataset.tm)),[0,120,90,60,45]);
  await pv.locator('[data-tm="0"]').click();await check(5);await next();await check(6);
  await pv.locator('[data-wz-edit="4"]').click();await step(4);await key();await step(6);
  await pv.locator('[data-wz-edit="5"]').click();await step(5);await pv.locator('[data-tm="45"]').click();await next();await step(6);
  assert.equal(await page.evaluate(()=>cfg.timer),45);
  await page.setViewportSize({width:1000,height:620});for(let i=6;i>=0;i--){await step(i);const l=await layout();assert(l.clear&&l.hit&&l.foot&&!l.scroll,JSON.stringify(l));await key();}
  assert.equal(await page.evaluate(()=>SCREEN),'title');assert(!(await pv.isVisible()));
  await page.evaluate(()=>openCop());await page.locator('#cop').waitFor();await page.locator('#cpSk').click();await page.locator('.cpFull').waitFor();
  await key();assert(!(await page.locator('.cpFull').isVisible()));assert(await page.locator('#cop').isVisible());
  await key();await page.locator('#cop').waitFor({state:'hidden'});
  await page.evaluate(()=>openShop());await page.locator('#shop').waitFor();await key();await page.locator('#shop').waitFor({state:'hidden'});
  await page.locator('#t-pve').click();await step(0);
  await page.evaluate(()=>{WZ.step=6;WZ.seen=6;renderWiz();});await step(6);await next();
  assert.equal(await page.evaluate(()=>G.phase),'setup');assert(!(await pv.isVisible()));
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>{G=null;SCREEN='setup';WZ.step=3;render();});await page.locator('#wiz .pvMode').waitFor();
  assert.equal(await pv.count(),0);assert.equal(await page.locator('#wiz .pvSteps').count(),0);
  assert.deepEqual(errors,[]);
  console.log('PASS v257 seven desktop steps, unobstructed back, one-layer Escape, rules, roster, gear cap, edit review, deployment and unchanged mobile');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
