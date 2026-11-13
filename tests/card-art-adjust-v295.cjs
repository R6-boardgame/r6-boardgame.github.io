// v295: the player moves / zooms the card art (drag, wheel, slider, reset); kept per art image, sent with the card so friends see it the same way.
// Run: python3 -m http.server 8016 & node tests/card-art-adjust-v295.cjs   (R6_SHOT_DIR optional)
const {chromium}=require(process.env.R6_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict');
const URL=process.env.R6_TEST_URL||'http://127.0.0.1:8016/',DIR=process.env.R6_SHOT_DIR||'/tmp';
(async()=>{const b=await chromium.launch(process.env.R6_CHROME?{executablePath:process.env.R6_CHROME}:{});
try{for(const [w,h,tag] of [[390,844,'phone'],[1440,900,'desktop']]){
  const ctx=await b.newContext({viewport:{width:w,height:h}}),p=await ctx.newPage(),errs=[];p.on('pageerror',e=>errs.push(e.message));
  const boot=async()=>{await p.goto(URL,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>typeof renderSettings==='function'&&typeof OPBASE!=='undefined');
    await p.evaluate(()=>{document.querySelectorAll('#boot,#loading,#login,#lgate').forEach(e=>e.remove());openSettings();});};
  await boot();
  await p.click('#psAdj');assert(await p.$('.psCard .pc289.adj295'));
  const art=()=>p.evaluate(()=>{const i=document.querySelector('.psCard .pcArt');return {t:i.style.translate,s:i.style.scale,r:i.getBoundingClientRect().toJSON()};});
  const a0=await art(),box=await (await p.$('.psCard .pc289')).boundingBox();
  await p.mouse.move(box.x+box.width*.8,box.y+box.height*.5);await p.mouse.down();await p.mouse.move(box.x+box.width*.6,box.y+box.height*.55,{steps:6});await p.mouse.up();
  const a1=await art();assert(a1.r.x<a0.r.x-20,'dragged left');
  await p.mouse.wheel(0,-300);const a2=await art();assert(+a2.s>1.3,'wheel zooms in '+a2.s);
  await p.fill('#psAxS','150');await p.dispatchEvent('#psAxS','input');assert.equal(+(await art()).s,1.5);
  await p.click('#psAdj');assert(!(await p.$('.pc289.adj295')));
  const c=await p.evaluate(()=>myCard289().ax);assert(c&&c.x<0&&c.s===1.5,JSON.stringify(c));
  await p.screenshot({path:`${DIR}/card-art-v295-${tag}.png`});
  // survives a reload and shows the same on a friend's view of the card
  await boot();const a3=await art();assert.equal(+a3.s,1.5);assert.equal(a3.t,a1.t);
  const fr=await p.evaluate(c=>{const d=document.createElement('div');d.style.width='300px';d.innerHTML=cardHTML289(c,'ABC');document.body.appendChild(d);const i=d.querySelector('.pcArt');return [i.style.scale,i.style.translate];},await p.evaluate(()=>myCard289()));
  assert.equal(+fr[0],1.5);
  // junk from someone else's card is clamped
  assert.equal(await p.evaluate(()=>cardHTML289({av:'cop:0',ax:{x:'<b>',y:999,s:50}}).match(/style="[^"]*"/)[0]),'style="translate:0.00cqw 60.00cqw;scale:3.000"');
  // reset
  await p.click('#psAdj');await p.click('#psAxR');assert.equal((await art()).s,'');assert.equal(await p.evaluate(()=>myCard289().ax),null);
  // other avatar keeps its own framing
  assert.deepEqual(errs,[]);console.log(tag,'ok');await ctx.close();}
  console.log('PASS: card art drag / wheel / slider / reset, saved, friends see it');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
