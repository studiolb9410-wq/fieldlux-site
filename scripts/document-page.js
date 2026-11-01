/* The document pages' script: /privacy, /terms, /refund and the 404 page load
   it. Until 2026-11 it sat inline in privacy.html and 404.html as two
   identical copies; one file keeps the CTA allowlist in one place. The same
   three JS contracts index.html runs (spec 10.4), plus the shared motion,
   overlay and reveal blocks.

   What is deliberately NOT here, because these pages have none of the elements
   those blocks drive and a guarded block that can never fire is dead code:
   the hero typewriter, the hero frame facade embed, the .pin-panel progress
   observer, the chapter <video> visibility observer, and the leanData probe
   that only the video blocks consumed. The scroll listener keeps the header
   state only, exactly as index.html does now that the perspective monitor is
   retired: there is no --mon-tilt to lerp on any page. */
(() => {
  'use strict';

  const doc  = document;
  const root = doc.documentElement;

  /* -- storage, guarded ------------------------------------------------ */
  const store = (() => {
    try {
      const s = window.localStorage;
      const probe = '__fieldlux_probe__';
      s.setItem(probe, '1'); s.removeItem(probe);
      return s;
    } catch (_) { return null; }
  })();
  const read  = (k) => { try { return store && store.getItem(k); }  catch (_) { return null; } };
  const write = (k, v) => { try { store && store.setItem(k, v); }   catch (_) {} };
  const drop  = (k) => { try { store && store.removeItem(k); }      catch (_) {} };

  const params = new URLSearchParams(window.location.search);

  /* == 10.4 (b), flowAppUrl review override: host allowlist ============
     https only, on app.field-lux.com or another *.field-lux.com host: the
     rule scripts/site-experience.js applies on the v3 pages. *.vercel.app
     and localhost are out. Anyone can create a vercel.app host, and the 5/18
     site let a javascript://localhost/... value through its localhost case. */
  const DEFAULT_APP_URL = 'https://app.field-lux.com';
  const APP_KEY = 'fieldlux_flow_app_url';

  function isAllowedAppHost(u) {
    try {
      const p = new URL(u);
      const h = p.hostname.toLowerCase();
      return p.protocol === 'https:' && (h === 'app.field-lux.com' || h.endsWith('.field-lux.com'));
    } catch { return false; }
  }

  let appUrl = DEFAULT_APP_URL;
  const suppliedApp = params.get('flowAppUrl') || read(APP_KEY);
  if (suppliedApp) {
    if (isAllowedAppHost(suppliedApp)) {
      appUrl = new URL(suppliedApp).href;
      write(APP_KEY, appUrl);
    } else {
      /* a bad value must not persist for this visitor */
      appUrl = DEFAULT_APP_URL;
      drop(APP_KEY);
    }
  }

  /* == 10.4 (a), data-app-link rewriting, with siteReturnUrl ============ */
  const getAppLinkUrl = () => {
    try {
      const url = new URL(appUrl, window.location.href);
      url.searchParams.set('siteReturnUrl', window.location.href);
      return url.href;
    } catch (_) { return appUrl; }
  };

  doc.querySelectorAll('[data-app-link]').forEach((link) => {
    const appLinkUrl = getAppLinkUrl();
    link.href = appLinkUrl;
    link.addEventListener('click', (event) => {
      /* modifier-key / middle-click passthrough: let the browser do its thing */
      if (event.defaultPrevented || event.button !== 0
          || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      window.location.assign(appLinkUrl);
    });
  });

  /* == 10.4 (c), discordUrl allowlist ================================== */
  const DEFAULT_DISCORD_URL = 'https://discord.gg/JpeQ7Hgsnd';
  const DISCORD_KEY = 'fieldlux_discord_url';

  let discordUrl = DEFAULT_DISCORD_URL;
  const suppliedDiscord = params.get('discordUrl') || read(DISCORD_KEY);
  if (suppliedDiscord) {
    try {
      const parsed = new URL(suppliedDiscord, window.location.href);
      const h = parsed.hostname;
      const isDiscordHost = h === 'discord.gg' || h === 'discord.com' || h.endsWith('.discord.com');
      if (parsed.protocol === 'https:' && isDiscordHost) {
        discordUrl = parsed.href;
        write(DISCORD_KEY, discordUrl);
      }
    } catch (_) { discordUrl = DEFAULT_DISCORD_URL; }
  }

  doc.querySelectorAll('[data-discord-link]').forEach((link) => {
    link.href = discordUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-disabled', 'false');
    link.removeAttribute('title');   /* the CSS ::after tooltip is the only tooltip */
  });

  /* == 5.9, Motion: tri-state (on / off / follow the OS) =============== */
  const MOTION_KEY = 'fieldlux_motion';
  const osReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => {
    const m = root.dataset.motion;
    if (m === 'on')  return true;
    if (m === 'off') return false;
    return !osReduce.matches;
  };
  const MOTION_EVENT = 'fieldlux:motionchange';
  const announceMotion = () => doc.dispatchEvent(new CustomEvent(MOTION_EVENT));

  const motionToggles = [...doc.querySelectorAll('.motion-toggle')];
  const syncMotionToggles = () => {
    const reduced = !motionAllowed();
    motionToggles.forEach((b) => b.setAttribute('aria-pressed', reduced ? 'true' : 'false'));
  };
  motionToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      root.dataset.motion = motionAllowed() ? 'off' : 'on';
      write(MOTION_KEY, root.dataset.motion);
      syncMotionToggles();
      announceMotion();
    });
  });
  if (osReduce.addEventListener) {
    osReduce.addEventListener('change', () => { syncMotionToggles(); announceMotion(); });
  }
  syncMotionToggles();

  /* == 5.8, One overlay system, one Escape handler ====================== */
  const overlays = [];
  function openOverlay(rec) { overlays.push(rec); doc.body.classList.add('overlay-open'); }
  function closeTop() {
    const r = overlays.pop();
    if (r && r.close) r.close();
    if (!overlays.length) doc.body.classList.remove('overlay-open');
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlays.length) closeTop();
  });

  /* == 5.6, Nav overlay: focus trap, inert, focus return =============== */
  const navToggle  = doc.querySelector('.nav-toggle');
  const navOverlay = doc.getElementById('nav-overlay');
  const siteMain   = doc.getElementById('main');
  const siteFooter = doc.querySelector('.site-footer');
  const FOCUSABLE  = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

  if (navToggle && navOverlay) {
    let navReturnFocus = null;
    let navHideTimer = null;

    const trapStops = () => [navToggle].concat([...navOverlay.querySelectorAll(FOCUSABLE)]);

    const onTrapKeydown = (e) => {
      if (e.key !== 'Tab') return;
      const stops = trapStops();
      if (!stops.length) return;
      const first = stops[0];
      const last  = stops[stops.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    const closeNav = () => {
      navOverlay.removeAttribute('data-open');
      /* the 420 ms exit is still painted and still hit-testable: take it out of
         the tab order for the whole close, not only once `hidden` lands (spec 5.6) */
      navOverlay.setAttribute('inert', '');
      navToggle.setAttribute('aria-expanded', 'false');
      if (siteMain)   siteMain.removeAttribute('inert');
      if (siteFooter) siteFooter.removeAttribute('inert');
      doc.removeEventListener('keydown', onTrapKeydown, true);
      window.clearTimeout(navHideTimer);
      navHideTimer = window.setTimeout(() => {
        navOverlay.hidden = true;
        navOverlay.removeAttribute('inert');
      }, motionAllowed() ? 440 : 0);
      if (navReturnFocus && navReturnFocus.focus) navReturnFocus.focus();
      navReturnFocus = null;
    };

    const openNav = () => {
      navReturnFocus = doc.activeElement;
      window.clearTimeout(navHideTimer);   /* a reopen mid-exit skips the timer... */
      navOverlay.removeAttribute('inert'); /* ...so clear the closing inert here   */
      navOverlay.hidden = false;
      navToggle.setAttribute('aria-expanded', 'true');
      if (siteMain)   siteMain.setAttribute('inert', '');
      if (siteFooter) siteFooter.setAttribute('inert', '');
      requestAnimationFrame(() => navOverlay.setAttribute('data-open', ''));
      doc.addEventListener('keydown', onTrapKeydown, true);
      const first = navOverlay.querySelector(FOCUSABLE);
      if (first) first.focus();
      openOverlay({ el: navOverlay, close: closeNav });
    };

    navToggle.addEventListener('click', () => {
      if (navToggle.getAttribute('aria-expanded') === 'true') closeTop();
      else openNav();
    });

    navOverlay.querySelectorAll('.nav-overlay-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (navToggle.getAttribute('aria-expanded') === 'true') closeTop();
      });
    });
  }

  /* == 5.1, Scroll: one passive listener ===============================
     Header state only. The monitor settle is gone with the monitor (OVERRIDE
     2): a fixed frame has no tilt to lerp, so there is no rAF loop left. */
  const header = doc.querySelector('.site-header');

  let isScrolled = false;

  const syncHeader = () => {
    const y = window.scrollY;
    if (!isScrolled && y > 24)      { isScrolled = true;  header && header.classList.add('is-scrolled'); }
    else if (isScrolled && y < 12)  { isScrolled = false; header && header.classList.remove('is-scrolled'); }
  };

  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  /* == 5.3, Scroll reveal: one-shot, per-section stagger =============== */
  const revealTargets = [...doc.querySelectorAll('.reveal, .reveal-lines')];
  if (!motionAllowed() || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    revealTargets.forEach((el) => {
      const group = el.closest('.section') || doc;
      const sibs = [...group.querySelectorAll('.reveal, .reveal-lines')];
      el.style.setProperty('--i', String(sibs.indexOf(el) % 6));   // per-section, not global
      io.observe(el);
    });
    /* turning motion off mid-page must not strand un-revealed copy */
    doc.addEventListener(MOTION_EVENT, () => {
      if (!motionAllowed()) revealTargets.forEach((el) => el.classList.add('is-in'));
    });
  }

})();
