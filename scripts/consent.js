/* Cookie settings - the footer "Cookie settings" button on every page.
 *
 * This website sets no cookies, loads nothing from other servers (the CSP
 * allows 'self' only) and runs no analytics. It keeps a few preferences in
 * localStorage, all of them "strictly necessary / preference" storage that
 * needs no consent under the ePrivacy rules. So there is nothing here to
 * accept or refuse, and the site shows no first-visit banner: a banner that
 * asks for consent the site does not need is noise, and regulators (CNIL,
 * EDPB cookie-banner taskforce) say so. What the site owes the visitor is a
 * clear, always-reachable statement of what it stores, which is this dialog.
 *
 * The accept/refuse choice belongs in the app (app.field-lux.com), which does
 * collect usage reports; see docs in the app repo for that work.
 */
(() => {
  'use strict';

  const buttons = [...document.querySelectorAll('[data-cookie-settings]')];
  if (!buttons.length) return;

  let dialog = null;
  let opener = null;

  const build = () => {
    dialog = document.createElement('dialog');
    dialog.className = 'flx-consent';
    dialog.setAttribute('aria-labelledby', 'flx-consent-title');
    dialog.innerHTML = `
      <h2 id="flx-consent-title">Cookie settings</h2>
      <p>This website sets no cookies, runs no analytics and loads nothing from other companies. It only keeps a few settings in your browser so pages stay the way you left them.</p>
      <div class="flx-consent-row">
        <div>
          <strong>Necessary</strong>
          <p>Remembers your choices on this site, such as Reduce motion, the billing period you picked on Pricing and whether you hid the open-beta notice. Nothing leaves your browser.</p>
        </div>
        <span class="flx-consent-state">Always on</span>
      </div>
      <div class="flx-consent-row">
        <div>
          <strong>Analytics and marketing</strong>
          <p>Not used on this website.</p>
        </div>
        <span class="flx-consent-state">None</span>
      </div>
      <p style="margin-top:14px">In the FieldLux app, you can turn usage reports off from <strong>Privacy choices</strong> on the sign-in screen. Details are in our <a href="/privacy">Privacy Policy</a>.</p>
      <div class="flx-consent-actions">
        <button type="button" data-consent-primary data-consent-close>Close</button>
      </div>`;
    dialog.addEventListener('click', (event) => {
      const r = dialog.getBoundingClientRect();
      const outside = event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom);
      if (event.target.closest('[data-consent-close]') || outside) dialog.close();
    });
    dialog.addEventListener('close', () => { opener?.focus(); });
    document.body.appendChild(dialog);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!dialog) build();
      opener = button;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      dialog.querySelector('[data-consent-close]')?.focus();
    });
  });
})();
