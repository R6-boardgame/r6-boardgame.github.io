const {chromium,devices}=require(process.env.R6_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.R6_TEST_URL||'http://127.0.0.1:8016/';

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.R6_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({...devices['iPhone 13'],deviceScaleFactor:1}), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const cdp=await page.context().newCDPSession(page);
  async function rotate(width,height,type,angle){
   await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,screenWidth:width,screenHeight:height,deviceScaleFactor:1,mobile:true,screenOrientation:{type,angle}});
  }
  const inner=async()=>{const el=await page.waitForSelector('#r6PortraitFrame');const f=await el.contentFrame();await f.waitForFunction(()=>typeof lobMob==='function'&&!!R3);return f;};
  await rotate(390,844,'portraitPrimary',0);
  await page.goto(new URL('?portraitTest=1#keep',base).href,{waitUntil:'domcontentloaded'});
  const game=await inner();
  await game.evaluate(()=>{const s=document.createElement('style');s.textContent='#boot,#login,#lgate,#tuOverlay{display:none!important}';document.head.append(s);G=null;SCREEN='title';render();window.rotationTest={marker:256};});
  assert.match(page.url(),/portrait\.html\?portraitTest=1#keep$/);
  assert.match(game.url(),/index\.html\?portraitTest=1#keep$/);
  assert.equal(await game.evaluate(()=>innerWidth),390);
  let navigations=0;
  page.on('framenavigated',f=>{if(f===game)navigations++;});
  const state=async turn=>{
   await page.waitForFunction(t=>document.querySelector('#r6PortraitStage').dataset.turn===String(t),turn);
   await game.waitForFunction(()=>innerHeight>innerWidth&&lobMob());
   assert.deepEqual(await game.evaluate(()=>[innerWidth,innerHeight,rotationTest.marker]),[390,844,256]);
   assert(await page.evaluate(()=>{const f=document.querySelector('#r6PortraitFrame').getBoundingClientRect(),s=document.querySelector('#r6PortraitStage').getBoundingClientRect();return Math.abs(f.width-s.width)<1&&Math.abs(f.height-s.height)<1&&document.documentElement.scrollWidth<=innerWidth;}));
  };
  const tapAt=async([x,y])=>{
   const p=await page.evaluate(([x,y])=>{
    const f=document.querySelector('#r6PortraitFrame'),r=f.getBoundingClientRect(),m=new DOMMatrix(getComputedStyle(f).transform);
    const dx=x-f.clientWidth/2,dy=y-f.clientHeight/2;
    return [r.left+r.width/2+m.a*dx+m.c*dy,r.top+r.height/2+m.b*dx+m.d*dy];
   },[x,y]);
   await page.touchscreen.tap(...p);
  };
  const tap=async selector=>tapAt(await game.locator(selector).evaluate(e=>{const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];}));
  await rotate(844,390,'landscapePrimary',90);await state(-90);
  await tap('#t-pve');await game.waitForSelector('#wiz:not([hidden])');
  await game.evaluate(()=>{
   document.querySelector('#wiz').hidden=true;
   mkBoard('bank','bomb','A');G.phase='play';SCREEN='game';render();
   rotationTest.match=G;rotationTest.picks=[];onCell=(x,y)=>rotationTest.picks.push([x,y]);
  });
  const boardTap=async()=>{
   const sample=await game.evaluate(()=>{
    const [x,y]=allCells().find(([x,y])=>x>2&&y>2&&cell(x,y).t==='floor'&&!cell(x,y).obst);
    const {camera,controls,renderer}=R3;R3.camGoal=R3.intro=null;controls.autoRotate=false;
    controls.target.set(x+.5,0,y+.5);camera.position.set(x+.5,9,y+.51);controls.update();camera.updateMatrixWorld();
    R3.hl=new Set([x+','+y]);const v=new THREE.Vector3(x+.5,0,y+.5).project(camera),r=renderer.domElement.getBoundingClientRect();
    return {cell:[x,y],point:[r.left+(1+v.x)*r.width/2,r.top+(1-v.y)*r.height/2]};
   });
   const count=await game.evaluate(()=>rotationTest.picks.length);
   await tapAt(sample.point);
   await game.waitForFunction(n=>rotationTest.picks.length>n,count);
   assert.deepEqual(await game.evaluate(()=>rotationTest.picks.at(-1)),sample.cell);
  };
  await boardTap();
  await rotate(844,390,'landscapeSecondary',270);await state(90);await boardTap();
  await rotate(390,844,'portraitPrimary',0);await state(0);await boardTap();
  assert.equal(navigations,0);assert(await game.evaluate(()=>rotationTest.match===G));
  assert.deepEqual(errors,[]);
  // Open already sideways on a narrower phone with only the legacy iOS angle.
  // Stub the auth SDK to exercise the popup-blocked top-level redirect without accounts.
  const cold=await browser.newPage({...devices['iPhone 13'],deviceScaleFactor:1,viewport:{width:720,height:300}});
  await cold.addInitScript(()=>{
   Object.defineProperty(screen,'orientation',{value:undefined,configurable:true});
   Object.defineProperty(window,'orientation',{value:-90,configurable:true});
  });
  const stub=`(()=>{
   const auth=()=>({
    signInWithPopup:async()=>{throw {code:'auth/popup-blocked'};},
    signInWithRedirect:()=>{if(window!==top)throw Error('redirect ran inside iframe');sessionStorage.setItem('test.redirect','1');location.reload();return new Promise(()=>{});},
    getRedirectResult:async()=>{if(new URL(location.href).searchParams.get('r6Auth256')==='return')sessionStorage.setItem('test.return','1');},
    onAuthStateChanged:f=>f(null)
   });
   auth.GoogleAuthProvider=class{setCustomParameters(){}};
   window.firebase={apps:[],auth,initializeApp(){this.apps.push({});}};
  })();`;
  await cold.route('**/fb/*.js',r=>r.fulfill({contentType:'application/javascript',body:r.request().url().endsWith('/app.js')?stub:''}));
  await cold.goto(new URL('?portraitTest=2#again',base).href,{waitUntil:'domcontentloaded'});
  await cold.waitForFunction(()=>document.querySelector('#r6PortraitStage')?.dataset.turn==='90');
  const coldGame=await (await cold.waitForSelector('#r6PortraitFrame')).contentFrame();
  await coldGame.waitForFunction(()=>typeof lobMob==='function'&&R6FB.settled());
  assert.equal(await coldGame.evaluate(()=>innerWidth),320);
  assert(await coldGame.evaluate(()=>lobMob()&&innerHeight>innerWidth));
  const returned=cold.waitForEvent('framenavigated',{predicate:f=>f===cold.mainFrame()&&f.url().includes('portrait.html')});
  await coldGame.evaluate(()=>{R6FB.signIn().catch(()=>{});}).catch(()=>{});
  await returned;
  assert.match(cold.url(),/portrait\.html\?portraitTest=2#again$/);
  assert.deepEqual(await cold.evaluate(()=>['test.redirect','test.return','r6.auth256'].map(k=>sessionStorage.getItem(k))),['1','1',null]);
  await cold.close();
  const desktop=await browser.newPage({viewport:{width:1400,height:900}});
  await desktop.goto(base,{waitUntil:'domcontentloaded'});await desktop.waitForFunction(()=>typeof lobMob==='function');
  assert.equal(await desktop.locator('#r6PortraitFrame').count(),0);assert(!(await desktop.evaluate(()=>lobMob())));await desktop.close();
  console.log('PASS v256 both landscape directions, same game without navigation, touch UI and 3D board picking, legacy narrow cold start, auth redirect routing, desktop unaffected');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
