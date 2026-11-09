const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const p=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto(process.env.R6_TEST_URL||'http://127.0.0.1:8016/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>typeof copScale252==='function'&&!!R3);
  await p.addStyleTag({content:'#boot,#login,#lgate,#tuOverlay{display:none!important}'});
  await p.evaluate(()=>{G=null;SCREEN='title';render();renderPlayer();openCop();});
  await p.waitForTimeout(400);
  const inspect=()=>p.evaluate(()=>{
   const selectors=['.cpTt h2','.cpTt small','.cpNm','.cpLb','.cpVal','.cpLg','.cpSw button','.cpSlot','.cpPbar','.cpFoot .cpBtn'];
   return selectors.map(s=>{const e=document.querySelector('#cop '+s),c=getComputedStyle(e),r=e.getBoundingClientRect();return {s,font:c.fontSize,weight:c.fontWeight,style:c.fontStyle,transform:c.transform,clip:c.clipPath,radius:c.borderRadius,corner:c.getPropertyValue('corner-shape'),bg:c.backgroundImage,rect:[r.x,r.y,r.width,r.height]};});
  });
  const current=await inspect();
  assert.equal(current.find(x=>x.s==='.cpLb').weight,'500');
  assert.equal(current.find(x=>x.s==='.cpVal').font,'20px');
  assert.equal(current.find(x=>x.s==='.cpLg').font,'18px');
  assert.equal(current.find(x=>x.s==='.cpSw button').transform,'none');
  assert.equal(current.find(x=>x.s==='.cpPbar').transform,'none');
  assert(['bevel','superellipse(0)'].includes(current.find(x=>x.s==='.cpSlot').corner));
  assert.equal(current.find(x=>x.s==='.cpSlot').radius,'12px 0px');
  await p.evaluate(()=>document.querySelector('#cultivation253').sheet.disabled=true);
  const previous=await inspect();
  // No displacement or replacement of the v252 materials.
  for(const s of ['.cpSlot','.cpPbar','.cpFoot .cpBtn']){
   assert.equal(current.find(x=>x.s===s).bg,previous.find(x=>x.s===s).bg);
   const a=current.find(x=>x.s===s).rect,b=previous.find(x=>x.s===s).rect;
   // v252 skew affected bounding boxes, but never change layout sizing.
   if(s!=='.cpPbar')assert.deepEqual(a.slice(2),b.slice(2));
  }
  await p.evaluate(()=>document.querySelector('#cultivation253').sheet.disabled=false);
  await p.screenshot({path:'/private/tmp/r6-v253-desktop.png'});
  for(const width of [1400,1000]){
   await p.setViewportSize({width,height:900});await p.evaluate(()=>{renderCop();menuSync250();});await p.waitForTimeout(300);
   assert(await p.locator('.cpLb').evaluateAll(es=>es.every(e=>e.scrollHeight<=e.clientHeight+1)));
  }
  await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{renderCop();menuSync250();});await p.waitForTimeout(350);
  const mobile=await inspect();
  await p.evaluate(()=>document.querySelector('#cultivation253').sheet.disabled=true);
  assert.deepEqual(await inspect(),mobile,'mobile styles must be identical with v253 disabled');
  assert.deepEqual(errors,[]);
  console.log('PASS v253 text hierarchy, bevel borders, upright controls, unchanged materials/layout and identical mobile styles');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
