// v258: a phone held sideways gets the desktop design (scaled desktop-sized iframe); upright stays the phone design; no reload either way
const {chromium,devices}=require(process.env.R6_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.R6_TEST_URL||'http://127.0.0.1:8016/';
(async()=>{
 const browser=await chromium.launch(process.env.R6_CHROME?{executablePath:process.env.R6_CHROME,headless:true}:{});
 try{
  const page=await browser.newPage({...devices['iPhone 13'],deviceScaleFactor:1}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const cdp=await page.context().newCDPSession(page);
  const rotate=(width,height,type,angle)=>cdp.send('Emulation.setDeviceMetricsOverride',{width,height,screenWidth:width,screenHeight:height,deviceScaleFactor:1,mobile:true,screenOrientation:{type,angle}});
  await rotate(390,844,'portraitPrimary',0);
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const el=await page.waitForSelector('#r6PortraitFrame'),game=await el.contentFrame();
  await game.waitForFunction(()=>typeof lobMob==='function'&&typeof render==='function');
  await game.evaluate(()=>{const s=document.createElement('style');s.textContent='#boot,#login,#lgate,#tuOverlay{display:none!important}';document.head.append(s);G=null;SCREEN='title';render();window.marker=258;});
  assert.deepEqual(await game.evaluate(()=>[innerWidth,lobMob()]),[390,true]);
  let navigations=0;page.on('framenavigated',f=>{if(f===game)navigations++;});
  const tap=async sel=>{const c=await game.locator(sel).first().evaluate(e=>{const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];});
   const p=await page.evaluate(([x,y])=>{const f=document.querySelector('#r6PortraitFrame'),r=f.getBoundingClientRect();return [r.left+x*r.width/f.clientWidth,r.top+y*r.height/f.clientHeight];},c);await page.touchscreen.tap(...p);};
  for(const [type,angle] of [['landscapePrimary',90],['landscapeSecondary',270]]){
   await rotate(844,390,type,angle);
   await page.waitForFunction(()=>document.querySelector('#r6PortraitStage').dataset.view==='desktop');
   await game.waitForFunction(()=>innerHeight===640&&!lobMob());
   const [w,h,m]=await game.evaluate(()=>[innerWidth,innerHeight,window.marker]);
   assert(w>1300&&w<1400&&h===640&&m===258,'desktop-sized viewport, same document');
   assert(await page.evaluate(()=>{const f=document.querySelector('#r6PortraitFrame').getBoundingClientRect(),s=document.querySelector('#r6PortraitStage').getBoundingClientRect();return Math.abs(f.width-s.width)<2&&Math.abs(f.height-s.height)<2&&document.documentElement.scrollWidth<=innerWidth;}),'frame fills the screen');
   assert(await game.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight),'no scroll in desktop view');
   await rotate(390,844,'portraitPrimary',0);
   await game.waitForFunction(()=>innerWidth===390&&lobMob());
  }
  await rotate(844,390,'landscapePrimary',90);await game.waitForFunction(()=>!lobMob());
  await tap('#t-pve');await game.waitForFunction(()=>SCREEN==='setup'&&!!document.querySelector('#wiz')&&!document.querySelector('#wiz').hidden);
  await game.evaluate(()=>{cfg.side='A';cfg.map='bank';cfg.mission='bomb';fillPicks('A');document.querySelector('#wiz').hidden=true;newGame();placeAttackers(0);startPlay();});
  await rotate(390,844,'portraitPrimary',0);await game.waitForFunction(()=>innerWidth===390);
  assert.deepEqual(await game.evaluate(()=>[window.marker,!!G&&G.phase]),[258,'play']);
  assert.equal(navigations,0);assert.deepEqual(errors,[]);
  console.log('landscape-v258 ok');
 }finally{await browser.close();}
})();
