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
  await next();
  for(const map of ['clubhouse','consulate','kafe','bank']){
   await pv.locator(`[data-wz-map=${map}]`).click();await pv.locator('.pvMap3.ready').waitFor();
   assert.equal(await pv.locator('.pvMapScene .pvPlan').count(),1);
   assert.equal(await pv.locator('.pvPlan text,.pvPlan rect,.pvPlan image,.pvMapScene figcaption').count(),0);
   assert.equal(await pv.locator('.pvPlan').getAttribute('fill'),'none');
   if(map==='consulate')assert.match(await pv.locator('.pvPlan path.hard').getAttribute('d'),/A/);
   if(map==='kafe'&&process.env.R6_SHOTS)await page.screenshot({path:process.env.R6_SHOTS+'/kafe.jpg',type:'jpeg',quality:91});
  }
  await check(2);
  await next();await step(3);
  await page.evaluate(()=>{cfg.picks.A=['sledge'];WZ.cur='sledge';renderWiz();});
  await pv.locator('[data-k=ash]').dblclick();assert.equal(await pv.locator('[data-pvslot]').count(),2);
  await pv.locator('[data-k=ash]').dblclick();assert.equal(await pv.locator('[data-pvslot]').count(),2);
  await pv.locator('.pvOpGrid .locked').first().dblclick();assert.equal(await pv.locator('[data-pvslot]').count(),2);
  await pv.locator('[data-k=ash]').click();
  assert(await pv.locator('.pvSkillTitle img').isVisible());assert((await pv.locator('.pvSkillDesc').textContent()).trim());
  assert.deepEqual(await pv.locator('.pvVitals strong').allTextContents(),await page.evaluate(()=>{const a=mkUnit('ash','A',0);return [a.max+' HP',a.speed+' 步'];}));
  const portraitClear=()=>pv.evaluate(el=>{
   const text=el.querySelector('.pvDossierContent').getBoundingClientRect(),art=el.querySelector('.pvHero').getBoundingClientRect();
   return text.right<=art.left && art.width>0 && art.height>0;
  });
  assert(await portraitClear());
  await pv.locator('#mfRnd').click();assert.equal(await pv.locator('[data-pvslot]').count(),5);
  await pv.locator('[data-k=ash]').click();await check(3);
  await pv.locator('[data-pvslot]').first().click();assert(await pv.locator('#wzNext').isDisabled());
  await pv.locator('#mfRnd').click();await next();await check(4);
  await page.evaluate(()=>{
   window.gearAudio=[];
   const play=SFX.play;
   SFX.play=(key,vol,jitter,delay)=>{
    const played=play(key,vol,jitter,delay);
    if(key.startsWith('gear-'))gearAudio.push([key,delay??0,played]);
    return played;
   };
  });
  const audioLog=()=>page.evaluate(()=>gearAudio.splice(0));
  assert.deepEqual(await pv.locator('[data-case-item]').evaluateAll(items=>items.map(el=>el.dataset.caseItem)),['clay','frag','flash','smk','charges']);
  await pv.locator('.pvCase').evaluate(box=>Promise.all([...box.querySelectorAll('img')].map(im=>im.decode())));
  if(process.env.R6_SHOTS){
   await page.evaluate(()=>{cfg.inv.A=invFor('A',{clay:1,frag:1,flash:1,smk:1,charges:1});renderWiz();});
   await pv.locator('.pvCase').evaluate(box=>Promise.all([...box.querySelectorAll('img')].map(im=>im.decode())));
   await snap(4);
  }
  const gear=async(side,k)=>{
   await page.evaluate(side=>{cfg.side=side;cfg.inv[side]=invFor(side,{});renderWiz();},side);
   const item=pv.locator(`[data-case-item=${k}]`),btn=d=>pv.locator(`[data-iv=${k}][data-d="${d}"]`);
   assert.equal(await pv.locator('[data-case-item][hidden]').count(),side==='A'?5:4);
   await pv.locator('.pvCasePhoto').evaluate(im=>im.decode());
   assert(!(await item.isVisible()));
   const captureAnimation=()=>btn(1).evaluate((b,k)=>b.addEventListener('click',()=>{
    const item=document.querySelector(`[data-case-item="${k}"]`);
    b.dataset.animated=[item.querySelector('span').getAnimations().length,item.closest('.pvCase').getAnimations().length].join(',');
   },{once:true}),k);
   await captureAnimation();
   await btn(1).click();
   assert(await item.isVisible());assert.equal(await item.locator('b').textContent(),'×1');
   assert.equal(await btn(1).getAttribute('data-animated'),'1,1');
   assert.deepEqual(await audioLog(),[['gear-foam',.028,true]]);
   await btn(-1).click();assert(!(await item.isVisible()));
   assert.deepEqual(await audioLog(),[]);
   await page.emulateMedia({reducedMotion:'reduce'});
   await captureAnimation();
   await btn(1).click();assert(await item.isVisible());
   assert.equal((await btn(1).getAttribute('data-animated')).split(',')[0],'0');
   assert.deepEqual(await audioLog(),[['gear-foam',0,true]]);
   await page.emulateMedia({reducedMotion:'no-preference'});
  };
  await gear('D','shield');await gear('A','clay');
  await pv.locator('#mfRnd').click();assert.equal(await page.evaluate(()=>invUsed('A')),6);
  assert.equal(await pv.locator('[data-iv][data-d="1"]:enabled').count(),0);
  await key();await step(3);await next();await next();await step(5);
  assert.deepEqual(await audioLog(),[['gear-case',0,true]]);
  assert.deepEqual(await pv.locator('[data-tm]').evaluateAll(es=>es.map(e=>+e.dataset.tm)),[0,120,90,60,45]);
  await pv.locator('[data-tm="0"]').click();await check(5);await next();await check(6);
  await pv.locator('[data-wz-edit="4"]').click();await step(4);await key();await step(6);
  assert.deepEqual(await audioLog(),[]);
  await pv.locator('[data-wz-edit="4"]').click();await step(4);await next();await step(6);
  assert.deepEqual(await audioLog(),[['gear-case',0,true]]);
  await pv.locator('[data-wz-edit="5"]').click();await step(5);await pv.locator('[data-tm="45"]').click();await next();await step(6);
  assert.equal(await page.evaluate(()=>cfg.timer),45);
  await page.setViewportSize({width:1000,height:620});for(let i=6;i>=0;i--){await step(i);const l=await layout();assert(l.clear&&l.hit&&l.foot&&!l.scroll,JSON.stringify(l));if(i===3)assert(await portraitClear());await key();}
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
  console.log('PASS desktop PvE steps, all four plans, squad double-click and details, live equipment case for both sides, gear cap, Escape, review, deployment and mobile');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
