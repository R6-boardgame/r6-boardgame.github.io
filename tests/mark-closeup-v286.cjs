// v286: Jackal / Dokkaebi marking an operator closes the camera in on that operator, then flies back to the old view.
// Run: python3 -m http.server 8016 & node tests/mark-closeup-v286.cjs   (R6_CHROME / R6_PLAYWRIGHT / R6_TEST_URL optional)
const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch(process.env.R6_CHROME?{executablePath:process.env.R6_CHROME}:{});const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
if(process.env.R6_THREE_DIR)await page.route(/cdn\.jsdelivr\.net\/npm\/three@0\.147\.0\//,r=>r.fulfill({path:process.env.R6_THREE_DIR+'/'+r.request().url().split('three@0.147.0/')[1],contentType:'application/javascript'}));// offline copy of three@0.147.0 (npm pack)
const snap=async n=>{const d=await page.evaluate(()=>{R3.renderer.render(R3.scene,R3.camera);return R3.renderer.domElement.toDataURL('image/png');});require('fs').writeFileSync((process.env.R6_SHOT_DIR||'/tmp')+'/mark-closeup-v286-'+n+'.png',Buffer.from(d.split(',')[1],'base64'));};
try{await page.goto(process.env.R6_TEST_URL||'http://127.0.0.1:8016/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof markCine286==='function'&&!!R3);
for(const op of ['jackal','dokkaebi']){
  const r=await page.evaluate(async op=>{CINE.on=true;document.querySelectorAll('#boot,#loading,#login,.mapintro,#lgate,#tuOverlay').forEach(e=>e.remove());document.body.dataset.scr='game';mkBoard('bank','bomb','A');G.phase='play';G.round=2;G.player='A';
    G.units=[mkUnit(op,'A',0),mkUnit('mute','D',0)];const fl=allCells().filter(([x,y])=>setupIndoor(x,y)&&!cell(x,y).obst);const a=G.units[0],d=G.units[1];a.x=fl[0][0];a.y=fl[0][1];const far=fl.reduce((b,c)=>Math.hypot(c[0]-a.x,c[1]-a.y)>Math.hypot(b[0]-a.x,b[1]-a.y)?c:b);d.x=far[0];d.y=far[1];d.spotted=0;d.hidden=true;a.hidden=false;
    G.sel=a;SCREEN='game';render();followCam(a);flyTo(R3.camGoal?R3.camGoal.p:R3.camera.position.clone(),R3.camGoal?R3.camGoal.t:R3.controls.target.clone(),true);
    const before=R3.camera.position.clone(),dW=new THREE.Vector3(cwx(d.x,d.y),.6,cwz(d.x,d.y));
    const run=UG[op](a,a.x,a.y,'');await sleep(1200);const mid=R3.camera.position.distanceTo(dW),cine=!!R3.cine;
    await run;await sleep(1800);const back=R3.camera.position.distanceTo(before);return {spotted:d.spotted,before:before.distanceTo(dW),mid,cine,back,after:!!R3.cine||!!R3.cineSave};},op);
  console.log(op,JSON.stringify(r));
  assert.equal(r.spotted,1);assert(r.cine,'close-up running');assert(r.mid<4.2,'camera close to marked operator');assert(r.before>r.mid*2);assert(!r.after,'close-up ended');assert(r.back<1,'camera back at old view');
  if(op==='jackal'){await snap('before');await page.evaluate(async()=>{const d=G.units[1];d.hidden=false;const open=allCells().filter(([x,y])=>setupIndoor(x,y)&&!cell(x,y).obst&&adj8(x,y).filter(([a,b])=>setupIndoor(a,b)&&!cell(a,b).obst&&!isWallC(cell(a,b))).length>=8);[d.x,d.y]=open[open.length>>1];d.fd=[0,1];locU(d);render();markCine286({uid:d.id,side:'A'});});await page.waitForTimeout(1100);await snap('closeup');await page.waitForTimeout(1500);}
}
assert.deepEqual(errors,[]);console.log('PASS: Jackal and Dokkaebi mark -> close-up on the marked operator -> back to the old view; no page errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
