(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const appDefault = 'https://app.field-lux.com/';
  const appKey = 'fieldlux_flow_app_url';
  const motionKey = 'fieldlux_motion';

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (_) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (_) {}
    },
    remove(key) {
      try { window.localStorage.removeItem(key); } catch (_) {}
    },
  };

  // ?flowAppUrl= (README "Review overrides") may only point the CTAs at the
  // FieldLux app: https on app.field-lux.com or another *.field-lux.com host,
  // on the default port and without user info (*.vercel.app stays out: anyone
  // can create one). Only the origin and path are kept (a query or #hash in
  // the override is dropped), and the override lasts for this tab only
  // (sessionStorage), so one shared link cannot repoint a visitor's buttons
  // for good. A value left in localStorage by the older script is removed.
  const isReviewHost = (host) => host === 'app.field-lux.com' || host.endsWith('.field-lux.com');
  const resolveAppUrl = () => {
    safeStorage.remove(appKey);
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('flowAppUrl');
    let fromSession = null;
    try { fromSession = window.sessionStorage.getItem(appKey); } catch (_) {}
    const supplied = fromQuery || fromSession;
    let target = new URL(appDefault);
    if (supplied) {
      let parsed = null;
      try { parsed = new URL(supplied); } catch (_) {}
      const host = parsed ? parsed.hostname.toLowerCase() : '';
      if (parsed && parsed.protocol === 'https:' && parsed.port === '' && !parsed.username && !parsed.password
          && isReviewHost(host)) {
        target = new URL(parsed.origin + parsed.pathname);
        try { window.sessionStorage.setItem(appKey, target.href); } catch (_) {}
      } else {
        try { window.sessionStorage.removeItem(appKey); } catch (_) {}
      }
    }
    target.searchParams.set('siteReturnUrl', window.location.href.split('#')[0]);
    return target.href;
  };

  const appUrl = resolveAppUrl();
  document.querySelectorAll('[data-app-link]').forEach((link) => { link.href = appUrl; });

  const menuButton = document.querySelector('[data-menu-toggle]');
  const menuPanel = document.querySelector('[data-menu-panel]');
  const isMenuOpen = () => menuButton?.getAttribute('aria-expanded') === 'true';
  const setMenu = (open) => {
    if (!menuButton || !menuPanel) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuPanel.hidden = !open;
    body.classList.toggle('v3-menu-open', open);
    if (open) menuPanel.querySelector('a')?.focus();
  };

  if (menuButton && menuPanel) {
    setMenu(false);
    menuButton.addEventListener('click', () => setMenu(!isMenuOpen()));
    menuPanel.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isMenuOpen()) {
        setMenu(false);
        menuButton.focus();
      }
    });
    // Rotating a tablet or widening the window past the menu breakpoint hides
    // the toggle; close the panel too, or the page stays scroll-locked.
    const desktop = window.matchMedia('(min-width: 981px)');
    desktop.addEventListener('change', (event) => { if (event.matches && isMenuOpen()) setMenu(false); });
  }

  // The home hero's live 3D scene. On a desktop it mounts at once over its
  // still, exactly as before.
  //
  // PHONES, 1109 (owner: "touch should go straight to moving the 3D; on the
  // phone you have to touch once more"). The old phone path waited for a tap
  // on "Open the live 3D scene", then showed the same still for 8+ seconds
  // with nothing moving, so the visitor tapped again. Now:
  //   - the scene starts loading by itself once the page has loaded and the
  //     frame is on screen, unless the browser asks to save data;
  //   - the still stays up, the control shows real progress, and the scene
  //     fades in only when it has actually drawn (the frame says so);
  //   - from then on the first finger on the scene turns it. No second tap.
  // With Save-Data on, one tap anywhere on the still starts the same path.
  // Phones load the upright camera (?scene=hero-portrait) and ask the frame
  // not to print its own invitation (&intro=0): the control below is it.
  const heroFrame = document.querySelector('.hero-frame');
  const heroEmbed = heroFrame?.querySelector('.hero-frame-embed[data-src]');
  if (heroFrame && heroEmbed) {
    const launch = heroFrame.querySelector('[data-embed-launch]');
    const pctNode = heroFrame.querySelector('[data-embed-pct]');
    const statusNode = heroFrame.querySelector('[data-embed-status]');
    const phone = window.matchMedia('(max-width: 680px)').matches;
    const shortTouch = window.matchMedia('(max-height: 540px) and (pointer: coarse)').matches;
    const saveData = navigator.connection?.saveData === true;
    let state = 'still';
    let revealTimer = 0;

    const say = (text) => { if (statusNode) statusNode.textContent = text; };
    const setState = (next) => {
      if (state === next || state === 'used' && next === 'ready') return;
      state = next;
      heroFrame.dataset.live = next;
      if (!launch) return;
      // Only the idle control is a button. Every later state is a picture of
      // what the scene is doing, and must not catch a touch meant for it.
      const actionable = next === 'idle';
      launch.disabled = !actionable;
      launch.tabIndex = actionable ? 0 : -1;
      if (actionable) launch.removeAttribute('aria-hidden');
      else launch.setAttribute('aria-hidden', 'true');
      if (next === 'loading') say('Loading the live 3D scene.');
      if (next === 'ready') say('The live 3D scene is ready.');
      if (next === 'failed') say('The live 3D scene could not start on this device.');
    };
    const setProgress = (p) => {
      const value = Math.max(0, Math.min(1, Number(p) || 0));
      heroFrame.style.setProperty('--live-p', value.toFixed(3));
      if (pctNode) pctNode.textContent = `${Math.round(value * 100)}%`;
    };

    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin || event.source !== heroEmbed.contentWindow) return;
      const data = event.data;
      if (!data || data.source !== 'flx-embed') return;
      if (data.state === 'progress' && state === 'loading') setProgress(data.p);
      if (data.state === 'ready') {
        setProgress(1);
        window.clearTimeout(revealTimer);
        setState('ready');
        // Controls that stand in the middle of the scene step aside after a
        // few seconds even if nobody has touched it (the CSS decides which).
        window.setTimeout(() => { heroFrame.dataset.liveRest = ''; }, 5000);
      }
      if (data.state === 'used' && state === 'ready') setState('used');
      if (data.state === 'failed') { window.clearTimeout(revealTimer); setState('failed'); }
    });

    const mountHero = () => {
      if (heroEmbed.getAttribute('src')) return;
      const src = (phone && heroEmbed.dataset.srcPhone) || heroEmbed.dataset.src;
      heroEmbed.setAttribute('src', src);
      heroFrame.dataset.embedState = 'mounted';
      setProgress(0);
      setState('loading');
      // A frame that never reports (an old cached copy, a blocked message)
      // must not stay invisible behind the still for good. It is the same
      // origin, so look: a scene canvas means show it; none means keep the
      // still rather than uncover an empty or broken frame.
      revealTimer = window.setTimeout(() => {
        if (state !== 'loading') return;
        let drawn = false;
        try { drawn = !!heroEmbed.contentDocument?.querySelector('.flx-embed-stage canvas'); } catch (_) {}
        setState(drawn ? 'ready' : 'failed');
      }, 25000);
    };

    if (!phone && !shortTouch && !saveData) {
      mountHero();
    } else if (launch) {
      launch.hidden = false;
      launch.addEventListener('click', () => { if (state === 'idle') mountHero(); });
      if (saveData) {
        setState('idle');
      } else {
        // Auto-start: after the page itself has loaded (the still and the
        // copy come first), and only while the frame is actually on screen.
        // The control already reads "Loading" at 0%, so nothing asks for a
        // tap that is about to be unnecessary.
        setProgress(0);
        setState('loading');
        const start = () => {
          if (!('IntersectionObserver' in window)) { mountHero(); return; }
          const seen = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) { seen.disconnect(); mountHero(); }
          }, { threshold: 0.25 });
          seen.observe(heroFrame);
        };
        if (document.readyState === 'complete') window.setTimeout(start, 250);
        else window.addEventListener('load', () => window.setTimeout(start, 250), { once: true });
      }
    } else {
      mountHero();
    }
  }

  const header = document.querySelector('.v3-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = [...document.querySelectorAll('.v3-reveal')];
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-in'));
  }

  const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButtons = [...document.querySelectorAll('[data-motion-toggle]')];
  // The stored choice uses the document pages' format (spec 5.9): 'on' or
  // 'off'. These pages stored 'full' and 'reduced' until 2026-11; read those
  // as the same choice and rewrite them, and drop anything else so the OS
  // setting applies. data-motion on <html> stays 'full' / 'reduced' here,
  // because the v3 styles select on it.
  let savedMotion = safeStorage.get(motionKey);
  if (savedMotion === 'full' || savedMotion === 'reduced') {
    savedMotion = savedMotion === 'full' ? 'on' : 'off';
    safeStorage.set(motionKey, savedMotion);
  } else if (savedMotion !== null && savedMotion !== 'on' && savedMotion !== 'off') {
    savedMotion = null;
    safeStorage.remove(motionKey);
  }
  let reduceMotion = savedMotion ? savedMotion === 'off' : systemReduced.matches;

  const applyMotion = () => {
    root.dataset.motion = reduceMotion ? 'reduced' : 'full';
    // The label names the action; no aria-pressed, which would read
    // "Enable motion, pressed" while motion is in fact off.
    motionButtons.forEach((button) => {
      button.textContent = reduceMotion ? 'Enable motion' : 'Reduce motion';
      button.removeAttribute('aria-pressed');
    });
    window.dispatchEvent(new CustomEvent('fieldlux:motionchange', { detail: { reduced: reduceMotion } }));
  };

  motionButtons.forEach((button) => button.addEventListener('click', () => {
    reduceMotion = !reduceMotion;
    safeStorage.set(motionKey, reduceMotion ? 'off' : 'on');
    applyMotion();
  }));
  applyMotion();

  const periodButtons = [...document.querySelectorAll('[data-period]')];
  const periodNote = document.querySelector('[data-period-note]');
  // One sentence for monthly and yearly, the same as the static note (launch review 5-1, item 4).
  const renewalNote = 'Plans renew automatically until you cancel. Cancel any time in Account settings and keep access until the end of the period you paid for.';
  // A 7-day pass is a single payment: nothing renews, so nothing needs cancelling.
  const passNote = 'A 7-day pass is one payment. It starts when you buy it, ends 7 days later and never renews, so there is nothing to cancel.';
  const periodNotes = { weekly: passNote, monthly: renewalNote, yearly: renewalNote };

  const setPeriod = (period) => {
    if (!['weekly', 'monthly', 'yearly'].includes(period)) period = 'monthly';
    root.dataset.pricingPeriod = period;
    safeStorage.set('fieldlux_pricing_period', period);
    periodButtons.forEach((button) => {
      const active = button.dataset.period === period;
      button.setAttribute('aria-pressed', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll('[data-plan]').forEach((card) => {
      const value = card.dataset[`${period}Price`] || 'Not available';
      const unit = card.dataset[`${period}Unit`] || '';
      const billing = card.dataset[`${period}Billing`] || '';
      const price = card.querySelector('[data-plan-price]');
      const priceUnit = card.querySelector('[data-plan-unit]');
      const bill = card.querySelector('[data-plan-billing]');
      if (price) price.textContent = value;
      if (priceUnit) priceUnit.textContent = unit;
      if (bill) bill.textContent = billing;
      const storage = card.querySelector('[data-plan-storage]');
      const storageText = card.dataset[`${period}Storage`];
      if (storage && storageText) storage.textContent = storageText;
      card.classList.toggle('is-unavailable', value === 'Not available');
    });
    if (periodNote) periodNote.textContent = periodNotes[period];
  };

  if (periodButtons.length) {
    periodButtons.forEach((button, index) => {
      button.addEventListener('click', () => setPeriod(button.dataset.period));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % periodButtons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + periodButtons.length) % periodButtons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = periodButtons.length - 1;
        periodButtons[next].focus();
        setPeriod(periodButtons[next].dataset.period);
      });
    });
    setPeriod(safeStorage.get('fieldlux_pricing_period') || 'monthly');
  }
})();
