(() => {
  const url = new URL(location.href);
  const stage = document.getElementById('r6PortraitStage');
  const phone = navigator.userAgentData?.mobile || /iPhone|iPod|Android.*Mobile|Windows Phone/i.test(navigator.userAgent)
    || (matchMedia('(pointer:coarse)').matches && navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) <= 540);
  const gameURL = new URL('./index.html' + url.search + url.hash, url);
  if (!stage) {
    if (window.top !== window || !phone || !/^https?:$/.test(url.protocol)) return;
    // The existing Google redirect fallback has to finish in the top window.
    try {
      if (['start', 'return'].includes(url.searchParams.get('r6Auth256')) && sessionStorage.getItem('r6.auth256')) return;
    } catch (_) {}
    location.replace(new URL('./portrait.html' + url.search + url.hash, url));
    return;
  }
  if (!phone) {
    location.replace(gameURL);
    return;
  }
  const frame = document.createElement('iframe');
  frame.id = 'r6PortraitFrame';
  frame.title = document.title;
  frame.allowFullscreen = true;
  frame.src = gameURL.href;
  const orientation = screen.orientation;
  const sync = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    const legacy = typeof window.orientation === 'number' ? window.orientation : null;
    const landscape = w > h && (orientation?.type ? orientation.type.startsWith('landscape') : legacy === null || Math.abs(legacy) === 90);
    const deviceAngle = orientation?.angle ?? legacy;
    const angle = landscape ? (deviceAngle === 270 || deviceAngle === -90 ? 90 : -90) : 0;
    const visibleWidth = landscape ? h : w, visibleHeight = landscape ? w : h;
    const scale = landscape ? Math.min(1, visibleWidth / 320) : 1;
    // v277: sizes live in CSS variables; portrait.html picks the set by media query, so a turn never paints unrotated first.
    const st = frame.style;
    if (landscape) {
      st.setProperty('--lw', Math.floor(visibleWidth / scale) + 'px');
      st.setProperty('--lh', Math.floor(visibleHeight / scale) + 'px');
      st.setProperty('--la', angle + 'deg');
      st.setProperty('--ls', String(scale));
    } else {
      st.setProperty('--pw', w + 'px');
      st.setProperty('--ph', h + 'px');
    }
    stage.dataset.turn = String(angle);
  };
  sync();
  stage.appendChild(frame);
  // Preserve the game document, network state and controls across both rotations.
  if (typeof ResizeObserver === 'function') new ResizeObserver(sync).observe(stage);
  addEventListener('resize', sync);
  addEventListener('orientationchange', sync);
  orientation?.addEventListener('change', sync);
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    try { orientation?.lock?.('portrait-primary')?.catch(() => {}); } catch (_) {}
  }
})();
