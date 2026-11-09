// Isolated guest UI and timed ranking tests. Fixtures stay in memory only.
const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.R6_TEST_URL||'http://127.0.0.1:8016/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof lobbyFlip249==='function'&&!!R3);await page.addStyleTag({content:'#boot,#login,#lgate,#tuOverlay{display:none!important}'});await page.evaluate(()=>{G=null;SCREEN='title';render();});await page.waitForTimeout(500);
for(const [width,height] of [[1600,1000],[2546,1287],[1400,900],[1000,640],[800,600],[390,844]]){
 await page.setViewportSize({width,height});await page.evaluate(()=>lobRender());await page.waitForTimeout(200);
 assert.equal(await page.locator('.cinema248').count(),width>760?1:0);
 if(width>760){
  const layout=await page.evaluate(()=>{const r=s=>document.querySelector(s).getBoundingClientRect(),links=r('.lcLinks248'),board=r('.lcBoard248'),stats=r('.lcStats248'),menu=r('.lcMenu248');return {linksRight:links.right,boardLeft:board.left,boardTop:board.top,statsBottom:stats.bottom,menuWidth:menu.width/innerWidth,clip:getComputedStyle(document.querySelector('.lcShade249')).clipPath,scroll:document.documentElement.scrollHeight>innerHeight||document.documentElement.scrollWidth>innerWidth};});
  assert(!layout.scroll,JSON.stringify(layout));assert(layout.linksRight<layout.boardLeft,JSON.stringify(layout));assert(layout.statsBottom<layout.boardTop,JSON.stringify(layout));assert(Math.abs(layout.menuWidth-.33)<.005,JSON.stringify(layout));assert(layout.clip.includes('38%'),JSON.stringify(layout));
  for(const id of ['t-rank','t-pve','t-train','t-cop','t-shop','t-lib','t-board','t-love','t-fb'])assert(await page.locator('#'+id).isVisible(),id);
  for(const id of ['t-love','t-fb'])assert.equal(await page.locator('#'+id).evaluate(e=>getComputedStyle(e,'::after').content),'none');
  assert.deepEqual(await page.locator('.lcStats248 strong').allTextContents(),await page.evaluate(()=>{const c=copAll()[LOBI%2];return [String(c.k|0),String(c.sv|0)];}));
  assert(await page.locator('#lobHero').evaluate(e=>e.complete&&e.naturalWidth>0));assert((await page.locator('#t-pve').evaluate(e=>getComputedStyle(e,'::before').backgroundImage)).includes('bank_bg'));
 }
 await page.screenshot({path:`/private/tmp/r6-v249-lobby-${width}.png`});
}
await page.setViewportSize({width:1600,height:1000});await page.evaluate(()=>{
 LB.busy=false;LB.t=Date.now();LB.list=[{id:'fixture_active1',nm:'測試步槍',by:'展示玩家 A',k:24,sv:8,w:'rf',i:0},{id:'fixture_active2',nm:'測試重盾',by:'展示玩家 B',k:20,sv:7,w:'hs',i:1},{id:'fixture_active3',nm:'測試狙擊',by:'展示玩家 C',k:18,sv:9,w:'sn',i:0},{id:'fixture_fallen1',nm:'英勇先鋒',by:'展示玩家 D',k:38,sv:12,w:'smg',i:1,dead:true}];LOBBY249.tab='alive';LOBBY249.visible=false;LOBBY249.busy=false;lobRender();lobbyFlip249();
});await page.waitForTimeout(300);
assert.equal(await page.locator('.lcBoardFace249').getAttribute('data-board-category'),'alive');assert((await page.locator('.lcBoard248').innerText()).includes('展示玩家 A'));await page.screenshot({path:'/private/tmp/r6-v249-ranking-active-fixture.png'});
// Boundary check: no change before ten seconds; both faces stay clipped during upward flip.
await page.evaluate(()=>lobbyFlip249(LOBBY249.next-1));assert.equal(await page.locator('.lcBoardFace249').getAttribute('data-board-category'),'alive');
await page.evaluate(()=>{window.flipTest249=lobbyFlip249(LOBBY249.next);});await page.waitForTimeout(180);assert.equal(await page.locator('.lcBoardFace249').count(),2);const frames=await page.locator('.lcBoardFace249').evaluateAll(es=>es.map(e=>getComputedStyle(e).transform));assert(frames.some(t=>t!=='none'));await page.screenshot({path:'/private/tmp/r6-v249-ranking-flip-fixture.png'});await page.evaluate(()=>window.flipTest249);
assert.equal(await page.locator('.lcBoardFace249').count(),1);assert.equal(await page.locator('.lcBoardFace249').getAttribute('data-board-category'),'fallen');assert((await page.locator('.lcBoard248').innerText()).includes('英勇先鋒'));assert(!(await page.locator('.lcBoard248').innerText()).includes('測試步槍'));await page.screenshot({path:'/private/tmp/r6-v249-ranking-fallen-fixture.png'});
await page.locator('#t-board').click();assert.equal(await page.evaluate(()=>LB.tab),'fallen');assert.equal(await page.evaluate(()=>SCREEN),'board');await page.evaluate(()=>{LOBBY249.next=0;lobbyFlip249();});assert.equal(await page.evaluate(()=>LOBBY249.visible),false);
await page.evaluate(()=>{SCREEN='title';renderTitle();lobbyFlip249();});assert.equal(await page.locator('.lcBoardFace249').getAttribute('data-board-category'),'fallen');
await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>lobbyFlip249(LOBBY249.next));assert.equal(await page.locator('.lcBoardFace249').count(),1);assert.equal(await page.locator('.lcBoardFace249').getAttribute('data-board-category'),'alive');
// Verify the actual 10-second scheduler, not just a direct function call.
await page.evaluate(()=>{LOBBY249.visible=false;lobbyFlip249();});await page.waitForTimeout(10300);assert.equal(await page.locator('.lcBoardFace249').getAttribute('data-board-category'),'fallen');
await page.locator('#t-fb').click();assert(await page.locator('#feedback').isVisible());await page.locator('#feedback .tsX').click();await page.locator('#t-love').click();assert(await page.locator('#sponsor').isVisible());await page.locator('#sponsor .tsX').click();
const before=await page.evaluate(()=>LOBI);await page.locator('[data-lob="1"]').click();assert.equal(await page.evaluate(()=>LOBI),(before+1)%2);
await page.locator('#t-train').click();assert.equal(await page.evaluate(()=>SCREEN),'train');await page.evaluate(()=>{SCREEN='title';renderTitle();});await page.locator('#t-pve').click();assert.equal(await page.evaluate(()=>SCREEN),'setup');assert.deepEqual(errors,[]);
console.log('PASS v249: proportional C composition at 2546/1600/1400/1000/800, phone unchanged, assets, live stats, 10-second alive/fallen upward flip, clipping, matching category navigation, pause and reduced motion, original controls; no page errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
