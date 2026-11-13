// v290/v292: online matches use trophies instead of ranked tiers.
// v297: online win +7 / loss −4, versus AI win +5 / loss −3. Plus: +1 per own surviving operator, +2 objective; loss −3, −1 hostage killed; −1 per teammate killed; floor 0.
// Run: python3 -m http.server 8016 & node tests/trophies-v290.cjs   (R6_CHROME / R6_PLAYWRIGHT / R6_TEST_URL optional)
const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch(process.env.R6_CHROME?{executablePath:process.env.R6_CHROME}:{});const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{await page.goto(process.env.R6_TEST_URL||'http://127.0.0.1:8016/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof trGame==='function'&&typeof ecoGame==='function');
  const r=await page.evaluate(()=>{const o={};ECO.tr=0;ECO.trMax=0;
    o.noTiers=typeof TIERS==='undefined'&&typeof rankBadge==='undefined'&&typeof rankResult==='undefined';
    const play=(win,ex,side='A',dead=0)=>{mkBoard('bank','bomb',side);G.units=['ash','sledge','thermite'].map((k,i)=>mkUnit(k,side,i)).concat([mkUnit('mute',side==='A'?'D':'A',0)]);
      G.units.slice(0,dead).forEach(u=>u.alive=false);Object.assign(G,{bot:true},ex);if(ex.bot===false)G.bot=false;G.player=side;ecoGame(win?side:(side==='A'?'D':'A'));return G._trd||null;};
    o.w=play(true,{},'A',1);                                   // 5 + 2 alive = 7
    o.wObj=play(true,{_why:'炸彈已被拆除，進攻方獲勝'});        // 5 + 3 + 2 = 10
    o.wDef=play(true,{_df:true},'D');                          // 5 + 3 + 2 = 10
    o.wHost=play(true,{_why:'人質已安全撤離'});                 // 10
    o.wFF=play(true,{_ffn:2},'A',2);                           // 5 + 1 - 2 = 4
    o.l=play(false,{});                                        // -3
    o.lHost=play(false,{_hk:1,_ffn:1});                         // -3 -1 -1 = -5
    ECO.tr=2;o.floor=play(false,{});o.pve=play(true,{bot:false});o.pveL=play(false,{bot:false});o.lv=(()=>{const t=play(true,{bot:false,lv:{n:'x'}});return t;})();
    o.max=ECO.trMax;o.html=trResHTML(o.wObj);
    SCREEN='title';renderTitle();o.lobby=(document.querySelector('#t-rank small')||{}).textContent;
    o.vs=(()=>{const el=document.createElement('div');el.innerHTML=(MF={side:'A'},mfCard({n:'X',av:'',tr:1234},'D'));MF=null;return el.textContent;})();return o;});
  console.log(JSON.stringify(Object.assign({},r,{html:undefined})));
  assert(r.noTiers,'tier code removed');
  assert.deepEqual([r.w.d,r.wObj.d,r.wDef.d,r.wHost.d,r.wFF.d,r.l.d,r.lHost.d],[9,12,12,12,6,-4,-6]);
  assert.deepEqual([r.floor.o,r.floor.n],[2,0]);assert.deepEqual([r.pve.o,r.pve.d],[0,8],'versus AI win +5 +3 alive');assert.equal(r.pveL.d,-3);assert.equal(r.lv,null,'training levels give no trophies');
  assert.equal(r.max,9+12+12+12+6);assert.match(r.html,/完成任務/);assert.match(r.html,/存活 3/);
  assert.equal(r.lobby,'PVP · 單人或組隊');assert.match(r.vs,/1,?234/);
  assert.deepEqual(errors,[]);console.log('PASS: trophy scoring (win/survivors/objective/loss/hostage/teamkill, floor 0), lobby says solo or squad, VS shows trophies; no page errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
