/* Open-beta notice - a small popup on entering the site that says FieldLux
 * is free in open beta and points to the planned pricing (owner, 2026-11-09).
 *
 * LAUNCH SWITCH: this is open-beta copy. On the day the paid-plan start date
 * is posted (README "launch switches"), change the copy to the exact date or
 * remove this script tag from every page.
 *
 * Not shown on /pricing (the visitor is already there).
 * "Close" hides it for the rest of this visit (sessionStorage).
 * "Don't show again today" hides it until tomorrow (localStorage, the local
 * date as YYYY-MM-DD). Both are preference storage: nothing is sent anywhere.
 */
(() => {
  'use strict';

  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/pricing') return;

  const UNTIL_KEY = 'fieldlux_beta_notice_until';
  const CLOSED_KEY = 'fieldlux_beta_notice_closed';

  const store = (name) => { try { return window[name]; } catch (_) { return null; } };
  const read = (name, key) => { try { return store(name)?.getItem(key) ?? null; } catch (_) { return null; } };
  const write = (name, key, value) => { try { store(name)?.setItem(key, value); } catch (_) {} };

  const pad = (n) => String(n).padStart(2, '0');
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  if (read('localStorage', UNTIL_KEY) === today()) return;
  if (read('sessionStorage', CLOSED_KEY) === '1') return;

  const show = () => {
    const dialog = document.createElement('dialog');
    dialog.className = 'flx-consent flx-notice';
    dialog.setAttribute('aria-labelledby', 'flx-notice-title');
    dialog.setAttribute('aria-describedby', 'flx-notice-desc');
    dialog.innerHTML = `
      <p class="flx-notice-kicker">Open beta</p>
      <h2 id="flx-notice-title">FieldLux is free during the open beta.</h2>
      <p id="flx-notice-desc">No card required. Paid plans are planned to start in mid-December 2026; see what they will cost and what your account gets then. We will post the exact date on the Pricing page at least 14 days in advance.</p>
      <a class="flx-notice-primary" href="/pricing" data-notice-pricing>See planned pricing</a>
      <div class="flx-notice-secondary">
        <button type="button" data-notice-today>Don't show again today</button>
        <button type="button" data-notice-close>Close</button>
      </div>`;

    const closeForVisit = () => write('sessionStorage', CLOSED_KEY, '1');
    // A click on the dialog element itself lands on its padding too; only a
    // click outside its box is a click on the backdrop.
    const isBackdrop = (event) => {
      if (event.target !== dialog) return false;
      const r = dialog.getBoundingClientRect();
      return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
    };
    dialog.addEventListener('click', (event) => {
      if (event.target.closest('[data-notice-today]')) {
        write('localStorage', UNTIL_KEY, today());
        dialog.close();
      } else if (event.target.closest('[data-notice-close]') || isBackdrop(event)) {
        closeForVisit();
        dialog.close();
      } else if (event.target.closest('[data-notice-pricing]')) {
        closeForVisit();
      }
    });
    // Esc closes it like "Close".
    dialog.addEventListener('cancel', closeForVisit);
    dialog.addEventListener('close', () => dialog.remove());

    document.body.appendChild(dialog);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialog.querySelector('[data-notice-close]')?.focus();
  };

  const start = () => window.setTimeout(show, 500);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
