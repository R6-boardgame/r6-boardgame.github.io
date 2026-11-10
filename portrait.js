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
    // v258: a phone held sideways shows the desktop design — the game gets a desktop-sized viewport, scaled down to fit
    const DESK_H = 640;
    const scale = landscape ? Math.min(1, h / DESK_H) : 1;
    frame.style.width = Math.floor(w / scale) + 'px';
    frame.style.height = Math.floor(h / scale) + 'px';
    frame.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
    stage.dataset.view = landscape ? 'desktop' : 'phone';
    const angle = 0;
    stage.dataset.turn = String(angle);
  };
  sync();
  stage.appendChild(frame);
  // Preserve the game document, network state and controls across both rotations.
  if (typeof ResizeObserver === 'function') new ResizeObserver(sync).observe(stage);
  addEventListener('resize', sync);
  addEventListener('orientationchange', sync);
  orientation?.addEventListener('change', sync);
})();
