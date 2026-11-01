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
  // FieldLux app: https on app.field-lux.com or another *.field-lux.com host.
  // Anything else falls back to the default, and a stored value that fails the
  // check is removed so it cannot persist for that visitor.
  const resolveAppUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('flowAppUrl');
    const supplied = fromQuery || safeStorage.get(appKey);
    let target = new URL(appDefault);
    if (supplied) {
      let parsed = null;
      try { parsed = new URL(supplied, window.location.href); } catch (_) {}
      const host = parsed ? parsed.hostname.toLowerCase() : '';
      if (parsed && parsed.protocol === 'https:' && (host === 'app.field-lux.com' || host.endsWith('.field-lux.com'))) {
        if (fromQuery) safeStorage.set(appKey, parsed.origin + parsed.pathname);
        target = parsed;
      } else {
        safeStorage.remove(appKey);
      }
    }
    target.searchParams.set('siteReturnUrl', window.location.href.split('#')[0]);
    return target.href;
  };

  const appUrl = resolveAppUrl();
  document.querySelectorAll('[data-app-link]').forEach((link) => { link.href = appUrl; });

  const menuButton = document.querySelector('[data-menu-toggle]');
  const menuPanel = document.querySelector('[data-menu-panel]');
  const setMenu = (open) => {
    if (!menuButton || !menuPanel) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuPanel.hidden = !open;
    body.classList.toggle('v3-menu-open', open);
  };

  if (menuButton && menuPanel) {
    setMenu(false);
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    menuPanel.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
        menuButton.focus();
      }
    });
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
  const savedMotion = safeStorage.get(motionKey);
  let reduceMotion = savedMotion ? savedMotion === 'reduced' : systemReduced.matches;

  const applyMotion = () => {
    root.dataset.motion = reduceMotion ? 'reduced' : 'full';
    motionButtons.forEach((button) => {
      button.textContent = reduceMotion ? 'Enable motion' : 'Reduce motion';
      button.setAttribute('aria-pressed', String(reduceMotion));
    });
    window.dispatchEvent(new CustomEvent('fieldlux:motionchange', { detail: { reduced: reduceMotion } }));
  };

  motionButtons.forEach((button) => button.addEventListener('click', () => {
    reduceMotion = !reduceMotion;
    safeStorage.set(motionKey, reduceMotion ? 'reduced' : 'full');
    applyMotion();
  }));
  applyMotion();

  const periodButtons = [...document.querySelectorAll('[data-period]')];
  const periodNote = document.querySelector('[data-period-note]');
  // One sentence for both periods, the same as the static note (launch review 5-1, item 4).
  const renewalNote = 'Plans renew automatically until you cancel. Cancel any time in Account settings and keep access until the end of the period you paid for.';
  const periodNotes = { monthly: renewalNote, yearly: renewalNote };

  const setPeriod = (period) => {
    if (!['monthly', 'yearly'].includes(period)) period = 'monthly';
    root.dataset.pricingPeriod = period;
    safeStorage.set('fieldlux_pricing_period', period);
    periodButtons.forEach((button) => {
      const active = button.dataset.period === period;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll('[data-plan]').forEach((card) => {
      const value = card.dataset[`${period}Price`] || 'Not available';
      const unit = card.dataset[`${period}Unit`] || '';
      const billing = card.dataset[`${period}Billing`] || '';
      const korea = card.dataset[`${period}Kr`] || '';
      const price = card.querySelector('[data-plan-price]');
      const priceUnit = card.querySelector('[data-plan-unit]');
      const bill = card.querySelector('[data-plan-billing]');
      const koreaLine = card.querySelector('[data-plan-kr]');
      if (price) price.textContent = value;
      if (priceUnit) priceUnit.textContent = unit;
      if (bill) bill.textContent = billing;
      if (koreaLine) koreaLine.textContent = korea;
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
