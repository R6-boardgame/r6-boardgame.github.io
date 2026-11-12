// v289: settings open on the player card; background / title / avatar rows scroll sideways, volume sliders, friend views show the card.
// Run: python3 -m http.server 8016 & node tests/player-card-v289.cjs   (R6_CHROME / R6_PLAYWRIGHT / R6_TEST_URL / R6_SHOT_DIR optional)
const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
const URL=process.env.R6_TEST_URL||'http://127.0.0.1:8016/',DIR=process.env.R6_SHOT_DIR||'/tmp';
(async()=>{const browser=await chromium.launch(process.env.R6_CHROME?{executablePath:process.env.R6_CHROME}:{});
try{for(const [w,h,tag] of [[390,844,'phone'],[1440,900,'desktop']]){
  const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:2}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(URL,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof renderSettings==='function'&&typeof cardHTML289==='function'&&typeof OPBASE!=='undefined');
  const r=await page.evaluate(()=>{document.querySelectorAll('#boot,#loading,#login,#lgate').forEach(e=>e.remove());
    OPBASE.slice(0,30).forEach((b,i)=>{ECO.mx[b]=i<12?99999:500;});ECO.title=OPBASE[0];ME.avatar='ash';ME.nick='一起打槍';openSettings();
    const box=document.querySelector('.psbox.ps289'),q=s=>[...box.querySelectorAll(s)];
    const ttl=q('[data-ttl]').map(b=>b.textContent),av=box.querySelector('.hs289.avs'),avScroll=av.scrollWidth>av.clientWidth;
    const h1=box.querySelector('.hs289.avs').getBoundingClientRect().height;
    PS289.edit=true;renderSettings();const ok=document.querySelector('#psNickOk').getBoundingClientRect(),bx=document.querySelector('.psbox').getBoundingClientRect();
    PS289.edit=false;renderSettings();
    return {card:!!box.querySelector('.pc289 .pcArt'),ttl,dupe:new Set(ttl).size!==ttl.length,avScroll,avRows:h1,
      okInside:ok.right<=bx.right+1&&ok.width>40,themes:q('[data-cth]').length,vol:!!document.querySelector('#psMv')&&!!document.querySelector('#psSv')};});
  console.log(tag,JSON.stringify(r));
  assert(r.card);assert(!r.dupe,'titles listed once');assert(r.avScroll,'avatars scroll sideways');assert(r.avRows<130,'avatar strip keeps two rows');assert(r.okInside,'save button not clipped');assert.equal(r.themes,4);assert(r.vol);
  await page.screenshot({path:`${DIR}/player-card-v289-settings-${tag}.png`});
  // volume slider changes the bus level and survives a reload of the setting
  const v=await page.evaluate(()=>{const s=document.querySelector('#psSv');s.value=40;s.dispatchEvent(new Event('input'));return [SFX.vol,localStorage.getItem('r6vol289')];});
  assert.equal(v[0],.4);assert.equal(v[1],'0.4');
  // the card someone else sees
  const c=await page.evaluate(()=>myCard289());assert.equal(c.n,'一起打槍');assert(c.m.length===3);
  await page.evaluate(c=>{closeSettings();profGet=async()=>({id:'u_x',n:'夜鷹小隊',c:Object.assign({},c,{n:'夜鷹小隊',th:'blue',av:'thatcher',r:1520,w:12,l:7})});openCard289('u_x','夜鷹小隊');},c);
  await page.waitForFunction(()=>document.querySelector('#card289 .pc289.blue'));await page.waitForTimeout(400);
  await page.screenshot({path:`${DIR}/player-card-v289-opponent-${tag}.png`});
  await page.evaluate(()=>{document.querySelector('#card289').hidden=true;FRP.code='K7Q2MX';FRP.id='me';openAch('req');frAddCode('R4ZT9P');});
  await page.waitForFunction(()=>document.querySelector('#achp .frFound289 .pc289'));await page.waitForTimeout(400);
  await page.screenshot({path:`${DIR}/player-card-v289-addcode-${tag}.png`});
  assert.deepEqual(errors,[]);await page.close();}
  console.log('PASS: player card settings, sideways rows, volume, opponent card, add-by-code preview; no page errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
