// v299: trophy ranks (20 badges), floor at the first rank of your colour, rank road rewards, wallet rank row, rank titles.
// Run: python3 -m http.server 8016 & node tests/trophy-rank-v299.cjs   (R6_CHROME / R6_PLAYWRIGHT / R6_TEST_URL optional)
const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch(process.env.R6_CHROME?{executablePath:process.env.R6_CHROME}:{});const errors=[];
try{for(const [w,h] of [[390,844],[1440,810]]){const page=await browser.newPage({viewport:{width:w,height:h}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.R6_TEST_URL||'http://127.0.0.1:8016/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof rkOpen==='function'&&typeof ecoGame==='function');
  const r=await page.evaluate(async()=>{const o={};document.querySelectorAll('#boot,#loading,#login,#lgate').forEach(e=>e.remove());
    o.n=RKS.length;o.idx=[0,24,25,99,100,599,600,642,999,1000,1999,2000,5000].map(t=>rkOf(t)[1]);o.floor=[0,74,120,642,1300,2400].map(rkFloor);
    const play=(win,start)=>{ECO.tr=start;mkBoard('bank','bomb','A');G.units=[mkUnit('ash','A',0),mkUnit('mute','D',0)];G.units[0].alive=false;G.bot=true;G.player='A';ecoGame(win?'A':'D');return trN();};
    o.flLoss=play(false,601);o.flLoss2=play(false,620);o.copper=play(false,2);
    ECO.tr=642;ECO.trMax=688;ECO.trClaim=[];const rn0=ECO.rn|0;o.can=rkCanN();rkClaim(12);o.rn=(ECO.rn|0)-rn0;o.claimed=rkClaimed().slice();rkClaim(12);o.rn2=(ECO.rn|0)-rn0;rkClaim(13);o.no13=!rkClaimed().includes(13);
    o.title=rkTitle('rk:gold');ECO.title='rk:gold';o.ttl=ttl289();
    SCREEN='title';renderTitle();renderPlayer();const prk=document.querySelector('#pcard #prk');o.wallet=prk&&prk.textContent.replace(/\s+/g,' ').trim();
    const pc=document.querySelector('#pcard').getBoundingClientRect(),btn=document.querySelector('#t-rank').getBoundingClientRect(),side=document.querySelector('.lobSide');
    o.noOverlap=pc.bottom<=btn.top+1&&(!side||!side.offsetParent||side.getBoundingClientRect().top>=pc.bottom-1);
    prk.click();await new Promise(r=>setTimeout(r,400));const pg=document.querySelector('#rkPage');o.open=!!pg&&!pg.hidden;o.nodes=pg.querySelectorAll('.rkNd').length;o.cur=pg.querySelector('.rkNd.cur b').textContent;
    const rd=pg.querySelector('#rkRoad'),cur=pg.querySelector('.rkNd.cur').getBoundingClientRect(),rr=rd.getBoundingClientRect();o.curVisible=cur.left>=rr.left-1&&cur.right<=rr.right+1;
    const dot=pg.querySelector('.rkNd .rkDot').getBoundingClientRect(),tr=pg.querySelector('.rkTrack').getBoundingClientRect();o.trackOnDots=Math.abs((dot.top+dot.height/2)-(tr.top+tr.height/2))<3;
    o.wide=document.documentElement.scrollWidth<=innerWidth;document.querySelector('#rkBk').click();o.closed=pg.hidden;return o;});
  console.log(w,JSON.stringify(r));
  assert.equal(r.n,20);assert.deepEqual(r.idx,['紅銅 IV','紅銅 IV','紅銅 III','紅銅 ★','青銅 IV','白銀 ★','黃金 IV','黃金 IV','黃金 ★','白金 III','白金 ★','冠軍','冠軍']);
  assert.deepEqual(r.floor,[0,0,100,600,1000,2000]);assert.equal(r.flLoss,600,'loss keeps gold floor');assert.equal(r.flLoss2,616);assert.equal(r.copper,0);
  assert.equal(r.can,12);assert.equal(r.rn,3000);assert.deepEqual(r.claimed,[12]);assert.equal(r.rn2,3000,'no double claim');assert(r.no13,'cannot claim unreached rank');
  assert.equal(r.title,'黃金幹員');assert.equal(r.ttl,'黃金幹員');assert.match(r.wallet,/黃金 IV/);assert(r.noOverlap,'wallet does not cover the lobby');
  assert(r.open);assert.equal(r.nodes,20);assert.equal(r.cur,'黃金 IV');assert(r.curVisible,'road scrolled to current rank');assert(r.trackOnDots,'road line passes through the nodes');assert(r.wide);assert(r.closed);
  await page.close();}
  assert.deepEqual(errors,[]);console.log('PASS: 20 ranks, colour floor, road rewards claim once, rank titles, wallet rank row, rank page on phone and desktop; no page errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
