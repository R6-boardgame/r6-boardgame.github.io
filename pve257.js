// v257: desktop solo PvE briefing. The mobile, tutorial and co-op wizards remain native.
const PV_DESK257=matchMedia('(min-width:1000px) and (min-height:620px)');
const PV_ART257='img/ui/pve-v257/';
const PV_GEAR265=PV_ART257+'gear-v265/';
const PV_ATTACK_POCKETS=['clay','frag','flash','smk','charges'];
const PV_DEFEND_POCKETS=['bpcam',null,'impact','nitro','shield'];
const PV_CLOCK257=[[0,'不計時'],[120,'入門'],[90,'冷靜'],[60,'標準'],[45,'極限']];
const pvMode257=()=>PV_DESK257.matches&&!WZ.coop&&!(typeof TU!=='undefined'&&TU&&TU.ph==='pre');
const pvMapArt257=k=>k==='bank'?'img/ui/lobby-bank-v249.jpg':mapBig(k)||mapThumb(k);
const pvName257=k=>copSlot(k)==null?mfName(k):copAll()[copSlot(k)].nm;
const pvFace257=k=>copSlot(k)==null?opFace(k):opArt(k);
const pvGear257=k=>{
  const src=PV_ATTACK_POCKETS.includes(k)?PV_GEAR265+k+'.webp':GIMG[k];
  return src?`<img src="${src}" alt="">`:WZI[k]||'';
};

function pvPlan257(m){
  const grid=parseMap(m),paths={hard:[],soft:[],door:[],window:[]},xs=[],ys=[];
  const joined=(x,y)=>wj(grid[y]?.[x]);
  grid.forEach((row,y)=>row.forEach((c,x)=>{
    if(c.indoor){xs.push(x);ys.push(y);}
    const cx=x+.5,cy=y+.5;
    const line=(dx,dy,kind=c.t)=>paths[kind].push(`M${cx} ${cy}l${dx} ${dy}`);
    if(c.kind){
      const hz=c.pair?c.pair[1]===y:joined(x-1,y)||joined(x+1,y)||!(joined(x,y-1)||joined(x,y+1));
      paths[c.kind].push(hz?`M${x} ${cy}h1`:`M${cx} ${y}v1`);
    }else if(!c.curve&&paths[c.t]){
      const dirs=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>joined(x+dx,y+dy));
      if(dirs.length)dirs.forEach(([dx,dy])=>line(dx/2,dy/2));
      else line(.02,0);
    }
  }));
  if(m.spiral){
    const {cx,cy,R}=m.spiral,r=R+.2;
    paths.hard.push(`M${cx-r} ${cy}A${r} ${r} 0 0 1 ${cx+r} ${cy}`);
  }
  const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x+1,h=Math.max(...ys)-y+1;
  return `<svg class="pvPlan" viewBox="${x-.6} ${y-.6} ${w+1.2} ${h+1.2}" role="img" aria-label="${esc(m.name)}格局圖" fill="none" stroke-linecap="round">${Object.entries(paths).map(([k,L])=>`<path class="${k}" d="${L.join(' ')}"/>`).join('')}</svg>`;
}

function pvDrawMap257(el,mk){
  const canvas=el.querySelector('.pvMap3');
  if(!canvas||!R3)return;
  requestAnimationFrame(()=>{
    if(!canvas.isConnected||el.hidden||SCREEN!=='setup'||G||cfg.map!==mk)return;
    const {renderer,scene}=R3,m=MAPS[mk],world=renderer.domElement,targets=R3.tgtIM;
    const previous=G;
    try{
      preview3D();
      const old=targets.visible;
      targets.visible=false;
      try{
        const aspect=world.width/world.height,panel=canvas.clientWidth/canvas.clientHeight;
        const visibleX=Math.min(1,panel/aspect),visibleY=Math.min(1,aspect/panel);
        const w=m.rows[0].length,h=m.rows.length,x=w/2,z=h/2,d=Math.max(w,h)*1.09;
        const cam=new THREE.PerspectiveCamera(38,aspect,.1,240);
        cam.position.set(x+d*.56,d*.43,z+d*.73);
        cam.lookAt(x,.5,z);
        cam.updateMatrixWorld();
        // Frame the building against the visible crop, allowing the table and base to extend off-screen.
        const points=[],p=new THREE.Vector3(),wallH=WALLH[R3.wall];
        m.rows.forEach((row,j)=>[...row].forEach((ch,i)=>{
          if(ch==='~')return;
          for(const dx of [0,1])for(const dz of [0,1]){
            points.push(p.set(i+dx,0,j+dz).project(cam).clone());
            if('#=WD'.includes(ch))points.push(p.set(i+dx,wallH,j+dz).project(cam).clone());
          }
        }));
        const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
        const l=Math.min(...xs),r=Math.max(...xs),b=Math.min(...ys),t=Math.max(...ys);
        cam.zoom=Math.min(visibleX*1.78/(r-l),visibleY*1.83/(t-b));
        cam.updateProjectionMatrix();
        cam.projectionMatrix.elements[8]+=(l+r)/2*cam.zoom-visibleX*.09;
        cam.projectionMatrix.elements[9]+=(b+t)/2*cam.zoom+visibleY*.05;
        cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
        renderer.render(scene,cam);
        canvas.width=Math.min(world.width,1600);canvas.height=Math.round(canvas.width/aspect);
        canvas.getContext('2d').drawImage(world,0,0,canvas.width,canvas.height);
        canvas.classList.add('ready');
      }finally{targets.visible=old;}
    }catch(e){/* map photo and exact floor plan remain visible without WebGL */}
    finally{G=previous;}
  });
}

const pvCanAdd257=(k,picks)=>owned(k)&&picks.length<5&&!picks.some(p=>mfBase(p)===mfBase(k));

function pvDossier257(k,picks){
  const c=copCard(OPC[k]),slot=copSlot(k),custom=slot==null?null:copAll()[slot];
  const img=custom?opArt(k):opArtU(k)||opArt(k)||opFace(k);
  const equipped=custom?(classEquipped(custom)?custom.sk:copSkOn(custom,c.side)):k;
  const skill=custom?null:skGet(k),ability=skill?.g||c.zh.g,desc=skill?.d||cardText(c);
  const unit=custom?copStat(custom):mkUnit(k,c.side,0);
  const hp=custom?unit.hp:unit.max,steps=custom?unit.mv:unit.speed;
  const part=picks.includes(k),can=part||pvCanAdd257(k,picks);
  return `<div class="pvDossierContent">
    <header><b>${esc(pvName257(k))}</b><small>幹員定位 <strong>${esc(c.zh.role||OPS[k]?.role||'幹員')}</strong></small></header>
    <section class="pvSkill" aria-label="技能">
      <div class="pvSkillTitle">${ability&&equipped?`<i>${skillIcon(equipped)}</i>`:''}<div><small>技能</small><b>${esc(ability||'沒有裝備技能')}</b></div></div>
      ${desc?`<div class="pvSkillDesc">${desc}</div>`:''}
    </section>
    <div class="pvVitals"><div><small>血量</small><strong>${hp} <span>HP</span></strong></div><div><small>移動步數</small><strong>${steps} <span>步</span></strong></div></div>
    <div class="pvDice">${['近距離','中距離','遠距離'].map((r,i)=>`<div><b>${r}</b><small>${['1–3','4–6','7+'][i]}</small><span>${hexDice(c.w[i]||[])}</span></div>`).join('')}</div>
    <button id="mfAdd" class="pvUtility${can?' on':''}" ${can?'':'disabled'}>${part?'移出小隊':!owned(k)?'尚未解鎖':picks.length>=5?'小隊已滿':!can?'已帶另一位':'加入小隊'}</button>
  </div><div class="pvHeroStage">${img?`<img class="pvHero" src="${esc(img)}" alt="">`:''}</div>`;
}

function pvRender257(el){
  const st=WZ.step,side=cfg.side,mk=cfg.map,mis=cfg.mission,picks=cfg.picks[side],inv=cfg.inv[side],cap=INV_CAP[side],used=invUsed(side);
  const full=WZSTEPS[3].ok(),last=st===6,restore=scrollSnap(el);
  const focus=document.activeElement?.closest('#wiz button'), focusKey=focus&&['data-k','data-iv','data-pvslot','data-wz-side','data-wz-mis','data-wz-map','data-tm'].find(k=>focus.hasAttribute(k));
  const fs=focusKey&&[focusKey,focus.getAttribute(focusKey),focus.getAttribute('data-d')];
  const selected=(x,attr)=>`class="pvPlate${x?' on':''}" aria-pressed="${x}" ${attr}`;
  const card=(key,attr,on,title,icon,desc)=>`<button ${selected(on,attr)}><img src="${PV_ART257+key}.jpg" alt=""><span class="pvChoiceLabel"><i>${icon}</i><span><b>${title}</b><small>${desc}</small></span>${on?'<em aria-hidden="true">✓</em>':''}</span></button>`;
  const portrait=(k,icon=true)=>`<img src="${esc(pvFace257(k)||opIcon(k))}" alt="" loading="lazy">${icon?`<i><img src="${esc(opIcon(k))}" alt=""></i>`:''}<b>${esc(pvName257(k))}</b>`;
  const mapImg=(k,cls='')=>`<img class="${cls}" src="${esc(pvMapArt257(k))}" alt="">`;
  const heading=['選擇陣營','選擇任務','選擇地圖','組成你的小隊','分配戰術裝備','計時方式','確認任務'][st];
  let body='';
  if(st===0){
    body=`<div class="pvChoices">${card('defend','data-wz-side="D"',side==='D','防守方',emblem('D'),'佈下陷阱與攝影機，守住炸彈點或人質')}${card('attack','data-wz-side="A"',side==='A','進攻方',emblem('A'),'無人機偵查、破牆、安裝拆彈器或救出人質')}</div>`;
  }else if(st===1){
    body=`<div class="pvChoices">${card('bomb','data-wz-mis="bomb"',mis!=='hostage','炸彈',WZI.bomb,'安裝或破壞拆彈器')}${card('hostage','data-wz-mis="hostage"',mis==='hostage','人質',WZI.hostageIc,'救出或守住人質')}</div>`;
  }else if(st===2){
    const maps=['bank','clubhouse','consulate','kafe',...Object.keys(MAPS).filter(k=>!['bank','clubhouse','consulate','kafe'].includes(k))];
    body=`<div class="pvMaps"><div class="pvMapList">${maps.map(k=>`<button ${selected(k===mk,`data-wz-map="${k}"`)}>${mapImg(k)}<b>${MAPS[k].name}</b></button>`).join('')}</div>
    <figure class="pvMapScene pvPlate">${mapImg(mk)}<canvas class="pvMap3" aria-hidden="true"></canvas>${pvPlan257(MAPS[mk])}</figure></div>`;
  }else if(st===3){
    const pool=mfPool(side,false);
    if(!pool.includes(WZ.cur)&&!picks.includes(WZ.cur))WZ.cur=picks[0]||pool[0];
    const k=WZ.cur;
    body=`<div class="pvSquad"><div class="pvRoster">
      <div class="pvSlots pvPlate">${Array.from({length:5},(_,i)=>picks[i]?`<button class="pvFace" data-pvslot="${i}" aria-label="${esc(pvName257(picks[i]))} · 移出">${portrait(picks[i])}</button>`:`<div class="pvFace empty">${i+1}</div>`).join('')}<strong>${picks.length}/5</strong></div>
      <div class="pvRosterBox pvPlate"><div class="pvRosterHead"><span>${side==='A'?'進攻方':'防守方'}</span><small>左鍵雙擊加入小隊</small></div><div class="pvOpGrid">${pool.map(id=>{
        const shown=picks.find(p=>p===id||copSlot(p)==null&&copSlot(id)==null&&mfBase(p)===mfBase(id))||id;
        const picked=picks.includes(shown),locked=!owned(shown);
        return `<button class="pvFace${picked?' picked':''}${locked?' locked':''}${shown===k?' current':''}" data-k="${esc(shown)}" aria-pressed="${shown===k}">${portrait(shown)}${locked?'<em aria-label="尚未解鎖">🔒</em>':picked?'<em aria-hidden="true">✓</em>':''}</button>`;
      }).join('')}</div></div>
    </div><article class="pvDossier pvPlate">${pvDossier257(k,picks)}</article></div>`;
  }else if(st===4){
    const fixed=side==='A'?'另有 3 架無人機。':'另有 3 捲鐵絲網與地圖上的攝影機。';
    body=`<div class="pvGear"><div class="pvGearRows">${Object.entries(INV[side]).map(([k,[label,max,desc]])=>`<article class="pvGearRow pvPlate"><i>${pvGear257(k)}</i><div><b>${label}</b><small>${desc}</small></div><div class="pvCount"><button data-iv="${k}" data-d="-1" aria-label="減少${label}" ${inv[k]<=0?'disabled':''}>−</button><strong>${inv[k]|0}</strong><button data-iv="${k}" data-d="1" aria-label="增加${label}" ${used>=cap||inv[k]>=max?'disabled':''}>＋</button></div></article>`).join('')}</div>
      <aside class="pvBudget pvPlate"><header><b>共用裝備</b><strong>${used} / ${cap}</strong></header><div class="pvPips">${Array.from({length:cap},(_,i)=>`<i class="${i<used?'on':''}"></i>`).join('')}</div>
      <div class="pvTray"><div class="pvCase"><img class="pvCasePhoto" src="${PV_GEAR265}case.webp" alt=""><ul>${(side==='A'?PV_ATTACK_POCKETS:PV_DEFEND_POCKETS).map((k,i)=>k?`<li data-case-item="${k}" ${inv[k]>0?'':'hidden'} data-pocket="${i}" title="${INV[side][k][0]}"><span>${pvGear257(k)}</span><b aria-hidden="true">×${inv[k]|0}</b><small>${INV[side][k][0]} · ${inv[k]|0}</small></li>`:'').join('')}</ul></div></div>
      <footer>${fixed}<button id="mfRnd" class="pvUtility">隨機</button></footer></aside></div>`;
  }else if(st===5){
    body=`<div class="pvTimer"><p>每輪時間 = 在場幹員數 × 秒數，兩個啟動階段共用。第一次玩建議不計時。</p><div>${PV_CLOCK257.map(([t,n])=>`<button ${selected((cfg.timer||0)===t,`data-tm="${t}"`)}><b>${n}</b><strong>${t||'∞'}${t?'<small> 秒</small>':''}</strong>${t?'<span>每名幹員</span>':''}</button>`).join('')}</div></div>`;
  }else{
    const edit=(i,label,value,icon)=>`<button data-wz-edit="${i}" class="pvUtility"><i>${icon}</i><span><small>${label}</small><b>${value}</b></span><em>修改</em></button>`;
    const timer=PV_CLOCK257.find(([t])=>t===(cfg.timer||0))||PV_CLOCK257[0];
    body=`<div class="pvReview"><div class="pvReviewInfo">
      <div class="pvRecap pvPlate">${edit(0,'陣營',side==='A'?'進攻方':'防守方',emblem(side))}${edit(1,'任務',mis==='hostage'?'人質':'炸彈',mis==='hostage'?WZI.hostageIc:WZI.bomb)}${edit(2,'地圖',MAPS[mk].name,`<img src="${mapThumb(mk)}" alt="">`)}${edit(5,'計時',timer[1]+(timer[0]?` ${timer[0]} 秒`:''),WZI.clock(timer[0]))}</div>
      <section class="pvPlate"><header><b>幹員</b><button data-wz-edit="3" class="pvUtility">修改</button></header><div class="pvReviewOps">${picks.map(k=>`<div class="pvFace">${portrait(k)}</div>`).join('')}</div></section>
      <section class="pvPlate"><header><b>裝備</b><button data-wz-edit="4" class="pvUtility">修改</button></header><div class="pvReviewGear">${Object.keys(INV[side]).filter(k=>inv[k]>0).map(k=>`<span title="${INV[side][k][0]}">${pvGear257(k)}<b>×${inv[k]}</b></span>`).join('')||'<small>未選</small>'}</div></section>
    </div><figure class="pvReviewArt pvPlate">${mapImg(mk)}<figcaption>${MAPS[mk].name}</figcaption></figure></div>`;
  }
  el.dataset.pvStep=st;
  const canStep=i=>i<=WZ.seen&&WZSTEPS.slice(0,i).every(x=>x.ok());
  el.innerHTML=`<div class="pvFrame"><header class="pvHeader">
    <button id="wzBack" class="pvBack" aria-keyshortcuts="Escape"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4-8 8 8 8" fill="none" stroke="currentColor" stroke-width="3"/></svg><span>返回</span><kbd>Esc</kbd></button>
    <h2>對戰電腦</h2><span id="wzOnline"></span><button id="wzRules" class="pvUtility">規則</button>
    </header><nav class="pvSteps" aria-label="對戰電腦設定">${WZSTEPS.map(({t},i)=>`<button data-wz-go="${i}" ${i===st?'aria-current="step"':canStep(i)?'':'disabled'}><span>${t}</span></button>`).join('')}</nav>
    <main class="pvMain"><h3>${heading}</h3>${body}</main>
    <footer class="pvFooter"><span>${String(st+1).padStart(2,'0')} / 07</span>
    ${st===3?`<button id="mfRnd" class="pvUtility pvRandom"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h2c5 0 8 12 13 12h3m-4-4 4 4-4 4M3 18h2c1.9 0 3.6-1.8 5-4m4-4c1.4-2.2 3.1-4 5-4h2m-4-4 4 4-4 4"/></svg><span>隨機選角</span></button>`:''}
    <button id="wzNext" class="pvGold" ${(st===3||last)&&!full?'disabled':''}>${last?'開始任務':st===3&&!full?`再選 ${5-picks.length} 名`:'下一步'}<span aria-hidden="true">›</span></button></footer></div>`;

  const on=(sel,fn)=>el.querySelectorAll(sel).forEach(b=>b.onclick=()=>fn(b));
  const re=()=>renderWiz();
  const go=(i,ret=null)=>{WZ.ret=ret;WZ.step=i;WZ.arm=null;re();};
  const returning=()=>WZ.ret===6&&WZSTEPS.slice(0,6).every(x=>x.ok());
  on('#wzBack',()=>{if(returning())go(6);else if(st)go(st-1);else{WZ.ret=null;el.hidden=true;goTitle();}menuSync250();});
  on('#wzNext',()=>{
    if((st===3||last)&&!WZSTEPS[3].ok())return;
    if(st===4)SFX.play('gear-case',1,0);
    if(last){WZ.ret=null;el.hidden=true;newGame();return;}
    go(returning()?6:st+1);
  });
  on('#wzRules',()=>openRules());
  on('[data-wz-go]',b=>{const i=+b.dataset.wzGo;if(i!==st&&canStep(i))go(i);});
  on('[data-wz-edit]',b=>go(+b.dataset.wzEdit,6));
  on('[data-wz-side]',b=>{if(cfg.side===b.dataset.wzSide)return;cfg.side=b.dataset.wzSide;WZ.cur=null;WZ.seen=Math.min(WZ.seen,2);if(!WZSTEPS[3].ok())WZ.ret=null;re();});
  on('[data-wz-mis]',b=>{cfg.mission=b.dataset.wzMis;re();});
  on('[data-wz-map]',b=>{cfg.map=b.dataset.wzMap;re();});
  on('[data-tm]',b=>{cfg.timer=+b.dataset.tm;re();});
  on('[data-pvslot]',b=>{picks.splice(+b.dataset.pvslot,1);re();});
  if(st===3){
    const dossier=el.querySelector('.pvDossier'),cards=el.querySelectorAll('.pvOpGrid [data-k]');
    dossier.onclick=e=>{
      if(!e.target.closest('#mfAdd'))return;
      const k=WZ.cur,i=picks.indexOf(k);
      if(i>=0)picks.splice(i,1);else if(pvCanAdd257(k,picks))picks.push(k);else return;
      re();
    };
    cards.forEach(b=>{
      const k=b.dataset.k;
      b.onclick=()=>{
        if(WZ.cur===k)return;
        WZ.cur=k;
        cards.forEach(card=>{const current=card===b;card.classList.toggle('current',current);card.setAttribute('aria-pressed',current);});
        dossier.innerHTML=pvDossier257(k,picks);
      };
      b.ondblclick=e=>{
        if(e.button!==0||!pvCanAdd257(k,picks))return;
        picks.push(k);
        re();
      };
    });
  }
  on('[data-iv]',b=>{
    const k=b.dataset.iv,d=+b.dataset.d,n=(inv[k]|0)+d;
    if(n<0||n>INV[side][k][1]||d>0&&invUsed(side)>=cap)return;
    inv[k]=n;
    const total=invUsed(side),item=el.querySelector(`[data-case-item="${k}"]`);
    item.hidden=n===0;
    item.querySelector('b').textContent=`×${n}`;
    item.querySelector('small').textContent=`${INV[side][k][0]} · ${n}`;
    b.parentElement.querySelector('strong').textContent=n;
    el.querySelector('.pvBudget header strong').textContent=`${total} / ${cap}`;
    el.querySelectorAll('.pvPips i').forEach((pip,i)=>pip.classList.toggle('on',i<total));
    el.querySelectorAll('[data-iv]').forEach(btn=>{
      const key=btn.dataset.iv;
      btn.disabled=+btn.dataset.d<0?inv[key]<=0:total>=cap||inv[key]>=INV[side][key][1];
    });
    const art=item.querySelector('span');
    if(!n||d>0)art.getAnimations().forEach(a=>a.cancel());
    const motion=!matchMedia('(prefers-reduced-motion:reduce)').matches;
    // The foam recording's main contact is ~170 ms into the clip.
    if(d>0)SFX.play('gear-foam',1,0,motion?.028:0);
    if(d>0&&motion){
      const box=item.closest('.pvCase');
      box.getAnimations().forEach(a=>a.cancel());
      art.animate([
        {transform:'translateY(-36%) rotate(-8deg) scale(1.22)',opacity:.35,easing:'cubic-bezier(.5,0,.85,.5)'},
        {transform:'translateY(5%) rotate(2deg) scale(.95)',opacity:1,offset:.64},
        {transform:'translateY(-3%) rotate(-1deg) scale(1.02)',offset:.83},
        {transform:'none'}
      ],{duration:310});
      box.animate([
        {transform:'translate(0,0)'},
        {transform:'translate(1.5px,2px) rotate(.3deg)'},
        {transform:'translate(-1.5px,-1px) rotate(-.22deg)'},
        {transform:'translate(.6px,.7px)'},
        {transform:'translate(0,0)'}
      ],{duration:150,delay:198});
    }
  });
  on('#mfRnd',b=>{
    const restoreFocus=document.activeElement===b;
    if(st===3){cfg.picks[side]=rndPicks(side,true);WZ.cur=cfg.picks[side][0];}
    else if(st===4)cfg.inv[side]=rndInv(side);
    re();
    if(restoreFocus)el.querySelector('#mfRnd')?.focus({preventScroll:true});
  });
  restore();
  if(fs){const b=[...el.querySelectorAll('button['+fs[0]+']')].find(e=>e.getAttribute(fs[0])===fs[1]&&e.getAttribute('data-d')===fs[2]);if(b&&!b.disabled)b.focus({preventScroll:true});}
  if(st===2)pvDrawMap257(el,mk);
  placeOnline();
  menuSync250();
}

// Escape uses the same back actions as the buttons. Capture only consumed Escape
// events so old per-dialog handlers cannot accidentally close a second layer.
function pvEsc257(e){
  if(e.key!=='Escape'||e.isComposing||e.keyCode===229||e.defaultPrevented||!matchMedia('(pointer:fine)').matches)return;
  if(e.target?.closest?.('#cpNm'))return; // let the name editor cancel and keep the screen open
  const visible=el=>el&&!el.hidden&&!el.classList.contains('out')&&getComputedStyle(el).display!=='none'&&el.getClientRects().length;
  if(visible($('#boot'))||visible($('#login'))||visible($('#lgate')))return;
  const selectors={
    opsel:'#osBack',rbook:'#rbX',manual:'#manualClose',psettings:'#psClose',copAl:'#alBack',achp:'#bX'
  };
  const overlays=[...document.querySelectorAll('#opsel,#rbook,#manual,#psettings,#copAl,#achp,.psettings:has(.tsX)')]
    .filter(visible).sort((a,b)=>(+getComputedStyle(a).zIndex||0)-(+getComputedStyle(b).zIndex||0));
  const top=overlays.at(-1);
  let fn=null;
  if(top){
    const b=top.querySelector(selectors[top.id]||'.tsX');
    fn=b?()=>b.click():top.id==='achp'?()=>top.remove():null;
  }
  if(!fn&&G?.over){
    const b=['#anHome','#lvBack'].map(s=>$(s)).find(visible);
    if(b)fn=()=>b.click();
  }
  if(!fn&&preGame()){
    if(visible($('#wiz'))&&SCREEN==='setup')fn=()=>$('#wzBack')?.click();
    else fn=menuRoute250(true);
    if(!fn){
      const b=['#dq-x','#t-qcancel','#t-back','#t-back2','#t-back3','#t-cancel'].map(s=>$(s)).find(visible);
      if(b)fn=()=>b.click();
    }
  }
  if(!fn)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(!e.repeat){fn();menuSync250();}
}
addEventListener('keydown',pvEsc257,true);
PV_DESK257.addEventListener('change',()=>{const el=$('#wiz');if(SCREEN==='setup'&&el&&!el.hidden)renderWiz();});
