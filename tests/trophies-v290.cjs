// v290: online matches use trophies (win +30, loss −20, floor 0) instead of ranked tiers.
// Run: python3 -m http.server 8016 & node tests/trophies-v290.cjs   (R6_CHROME / R6_PLAYWRIGHT / R6_TEST_URL / R6_SHOT_DIR optional)
const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch(process.env.R6_CHROME?{executablePath:process.env.R6_CHROME}:{});const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{await page.goto(process.env.R6_TEST_URL||'http://127.0.0.1:8016/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof trGame==='function'&&typeof ecoGame==='function');
  const r=await page.evaluate(()=>{const o={};ECO.tr=0;ECO.trMax=0;
    o.noTiers=typeof TIERS==='undefined'&&typeof rankBadge==='undefined'&&typeof rankResult==='undefined';
    const play=(win,ex)=>{mkBoard('bank','bomb','A');Object.assign(G,ex);G.player='A';ecoGame(win?'A':'D');return G._trd||null;};
    o.w1=play(true,{bot:true});o.w2=play(true,{bot:true});o.l1=play(false,{bot:true});
    ECO.tr=10;o.floor=play(false,{bot:true});
    o.pve=play(true,{});o.trAfter=trN();o.max=ECO.trMax;
    o.prof=myProf().tr;o.html=trResHTML({o:40,n:70,d:30,best:true});
    SCREEN='title';renderTitle();o.lobby=(document.querySelector('#t-rank small')||{}).textContent;
    o.vs=(()=>{const el=document.createElement('div');el.innerHTML=(MF={side:'A'},mfCard({n:'X',av:'',tr:1234},'D'));MF=null;return el.textContent;})();return o;});
  console.log(JSON.stringify(r));
  assert(r.noTiers,'tier code removed');
  assert.deepEqual([r.w1.o,r.w1.n],[0,30]);assert.deepEqual([r.w2.o,r.w2.n],[30,60]);assert.deepEqual([r.l1.o,r.l1.n,r.l1.d],[60,40,-20]);
  assert.deepEqual([r.floor.o,r.floor.n],[10,0]);assert.equal(r.pve,null,'versus AI does not change trophies');
  assert.equal(r.trAfter,0);assert.equal(r.max,60);assert.equal(r.prof,0);assert.match(r.html,/新紀錄/);
  assert.match(r.lobby||'',/獎盃 0/);assert.match(r.vs,/1,?234/);
  assert.deepEqual(errors,[]);console.log('PASS: trophies +30/−20 with floor, best kept, lobby/rank/profile show trophies; no page errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
