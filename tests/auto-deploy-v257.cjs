// v257 auto deploy. Isolated guest browser; no account or production save is used.
// Optional: R6_THREE_DIR=<unpacked three@0.147.0 package> serves the CDN scripts locally.
const {chromium,devices}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
const base=process.env.R6_TEST_URL||'http://127.0.0.1:8016/';
(async()=>{const browser=await chromium.launch({...(process.env.R6_CHROME?{executablePath:process.env.R6_CHROME}:{}),headless:true});
try{
 const mk=async(opts)=>{const ctx=await browser.newContext(opts);
  if(process.env.R6_THREE_DIR)await ctx.route('https://cdn.jsdelivr.net/npm/three@0.147.0/**',r=>r.fulfill({path:process.env.R6_THREE_DIR+new URL(r.request().url()).pathname.replace('/npm/three@0.147.0',''),contentType:'application/javascript'}));
  await ctx.route(/fonts\.(googleapis|gstatic)\.com|emqx|hivemq|firebase|googleapis/,r=>r.abort());
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(new URL('index.html',base).href,{waitUntil:'domcontentloaded'});
  // phones are moved into the portrait container; drive the game document inside it
  let game=page;await page.waitForTimeout(500);if(/portrait\.html/.test(page.url()))game=await (await page.waitForSelector('#r6PortraitFrame')).contentFrame();
  await game.waitForFunction(()=>typeof autoDeploy257==='function'&&!!R3,null,{timeout:60000});
  await game.addStyleTag({content:'#boot{display:none!important}'});
  return {ctx,page,game,errors};};
 const start=(page,side,extra)=>page.evaluate(([side,extra])=>{CINE.on=false;document.querySelectorAll('#login,.mapintro,#lgate,#tuOverlay,#tuO').forEach(e=>e.remove());
  mkBoard('bank','bomb',side,extra);addTeams(['ash','twitch','sledge','thermite','iq'],['mute','kapkan','bandit','smoke','valkyrie'],INV_DEF.A,INV_DEF.D,side==='A',side==='D');
  G.sel=G.units.find(u=>u.side===side);SCREEN='game';if(R3)R3.hq=false;render();},[side,extra||null]);
 const VIEWS=[{...devices['iPhone 13']},{viewport:{width:1100,height:700}}].filter((v,i)=>!process.env.R6_VIEW||process.env.R6_VIEW===(i?'desktop':'phone'));
 for(const view of VIEWS){
  const {ctx,page:shot,game:page,errors}=await mk(view);
  // real pointer input at the button's on-screen centre (the portrait frame sits at the stage origin)
  const press=async()=>{const off=await shot.evaluate(()=>{const f=document.querySelector('#r6PortraitFrame');return f?[f.getBoundingClientRect().left,f.getBoundingClientRect().top]:[0,0];});const r=await page.evaluate(()=>{const r=$('#autoDep257').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];});
   if(view.hasTouch)await shot.touchscreen.tap(off[0]+r[0],off[1]+r[1]);else await shot.mouse.click(off[0]+r[0],off[1]+r[1]);await page.waitForTimeout(300);};
  // defender: everything placed around the objective, start button unlocks, match starts
  await start(page,'D');assert.equal(await page.evaluate(()=>unplaced().length),5);
  const btn=page.locator('#autoDep257');await btn.waitFor();const box=await btn.boundingBox();assert(box.height>=44,JSON.stringify(box));
  assert(await page.evaluate(()=>{const r=$('#autoDep257').getBoundingClientRect(),h=$('.depHd').getBoundingClientRect();return r.right<=h.right+1&&r.left>=h.left-1;}));
  await press();
  const d=await page.evaluate(()=>{const sites=allCells().filter(([x,y])=>cell(x,y).site);const rooms=new Set([...new Set(sites.map(([x,y])=>cell(x,y).site))].flatMap(s=>roomOf(...sites.find(([x,y])=>cell(x,y).site===s))).map(([x,y])=>x+','+y));
   return {left:unplaced().length,inRoom:alive('D').filter(u=>rooms.has(u.x+','+u.y)).length,gad:G.gadgets.filter(g=>g.side==='D'&&!g.fixed).length,wire:G.wire,rearr:G.rearr,ch:alive('D').map(u=>u.ch),anchor:alive('D').some(u=>'anchor' in u||'roam' in u),go:$('#go').disabled,cells:new Set(alive('D').map(u=>u.x+','+u.y)).size};});
  assert.equal(d.left,0);assert(d.inRoom>=4,JSON.stringify(d));assert(d.gad>=8,JSON.stringify(d));assert.equal(d.rearr,0);assert.equal(d.anchor,false);assert.equal(d.go,false);assert.equal(d.cells,5);
  // pressing again only re-seats the squad; spent charges are not refunded or overspent
  await press();const d2=await page.evaluate(()=>({gad:G.gadgets.filter(g=>g.side==='D'&&!g.fixed).length,ch:alive('D').map(u=>u.ch),left:unplaced().length}));
  assert.equal(d2.gad,d.gad);assert.deepEqual(d2.ch,d.ch);assert.equal(d2.left,0);
  await shot.screenshot({path:(process.env.R6_SHOT_DIR||'/tmp')+`/r6-v257-def-${view.viewport.width}.png`});
  await page.evaluate(()=>startPlay());await page.waitForFunction(()=>G.phase==='play');
  // rearrangement budget already used by hand is respected
  await start(page,'D');await page.evaluate(()=>{G.rearr=2;});
  const before=await page.evaluate(()=>allCells().filter(([x,y])=>cell(x,y).t==='reinf').length);
  await press();
  const after=await page.evaluate(()=>allCells().filter(([x,y])=>cell(x,y).t==='reinf').length);assert(after-before<=2,`${before}->${after}`);
  // attacker: one random spawn, every attacker on that spawn's cells
  await start(page,'A');assert.equal(await page.evaluate(()=>unplaced().length),5);
  await press();
  const a=await page.evaluate(()=>{const z=G.map.spawns[G.spawn];return {left:unplaced().length,on:alive('A').every(u=>z.cells.some(([x,y])=>x===u.x&&y===u.y)),zone:$('#zones .on')?.textContent===z.name,go:$('#go').disabled};});
  assert.deepEqual(a,{left:0,on:true,zone:true,go:false});
  await shot.screenshot({path:(process.env.R6_SHOT_DIR||'/tmp')+`/r6-v257-atk-${view.viewport.width}.png`});
  await page.evaluate(()=>startPlay());await page.waitForFunction(()=>G.phase==='play');
  // co-op splits the squad between two players: no button
  await start(page,'D',{coop:{h:'A',g:'B'},net:false});assert.equal(await page.locator('#autoDep257').count(),0);
  assert.deepEqual(errors,[]);await ctx.close();
 }
 console.log('PASS: auto deploy defender (objective rooms, gadgets, rearr budget, idempotent charges, start), attacker random spawn, co-op hidden, phone + desktop');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
