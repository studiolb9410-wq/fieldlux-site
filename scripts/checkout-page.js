/* /checkout - the page Paddle's checkout links open (owner decision 2026-11-11).
 *
 * Paddle approved field-lux.com for checkout; the app at app.field-lux.com
 * sits behind its sign-in and is not approved, and Paddle.js opens a checkout
 * only on an approved domain. So the app's billing server creates the Paddle
 * transaction and sends the buyer here, in a new tab:
 *     https://field-lux.com/checkout?_ptxn=txn_...
 * This page is also the account's DEFAULT PAYMENT LINK in Paddle, so a card
 * update or an invoice link lands here the same way.
 *
 * What it does, in order:
 *   no ?_ptxn (or a malformed one)  says there is nothing to pay; loads nothing
 *   no client-side token built in   says checkout is not available; loads nothing
 *   otherwise                       loads Paddle.js v2 from cdn.paddle.com and
 *                                   calls Paddle.Initialize. Paddle.js opens the
 *                                   checkout for ?_ptxn by itself, with the
 *                                   checkout.settings given here (Paddle docs,
 *                                   "Pass a transaction to a checkout"). The
 *                                   transaction already names its customer and
 *                                   items; allowLogout: false keeps the customer.
 *   checkout.completed              "Payment received. You can close this tab and
 *                                   return to FieldLux." The app tab sees the
 *                                   purchase through its own server; nothing is
 *                                   sent back from here (the opener is cut, and
 *                                   both sites set COOP).
 *   checkout.closed / .error        "Nothing was charged", with the way back and,
 *                                   after a close, a button to open it again.
 *
 * The token is a Paddle client-side token (live_... or test_...), public by
 * design. scripts/paddle-config.mjs writes it into this page's
 * <meta name="flx-paddle-token"> at build time from FLX_PADDLE_CLIENT_TOKEN,
 * with the environment its prefix names. No inline script on the page: the
 * /checkout CSP (vercel.json) allows scripts from 'self' and cdn.paddle.com
 * only.
 *
 * Copy is plain ASCII (README "Direction").
 */
(() => {
  'use strict';

  const doc = document;
  const PADDLE_JS = 'https://cdn.paddle.com/paddle/v2/paddle.js';
  const TXN_RE = /^txn_[a-z0-9]{26}$/;
  const TOKEN_RE = /^(live|test)_[A-Za-z0-9]+$/;
  const LOAD_TIMEOUT_MS = 20000;

  const meta = (name) => {
    const el = doc.querySelector(`meta[name="${name}"]`);
    return el ? String(el.getAttribute('content') || '').trim() : '';
  };

  const STATES = {
    loading: {
      title: 'SECURE CHECKOUT.',
      status: 'Opening the secure checkout...',
      detail: 'The payment window opens on this page. Paddle.com runs it: Paddle is the Merchant of Record for FieldLux orders, charges your card, handles tax and emails your receipt.',
    },
    open: {
      title: 'SECURE CHECKOUT.',
      status: 'The secure checkout is open on this page.',
      detail: 'Pay in the Paddle window. If you close it without paying, nothing is charged.',
    },
    completed: {
      title: 'PAYMENT RECEIVED.',
      status: 'Payment received. You can close this tab and return to FieldLux.',
      detail: 'Paddle emails your receipt. In FieldLux, the tab you came from updates by itself within a minute or two. If it has not after an hour, email info@field-lux.com.',
      actions: true,
    },
    closed: {
      title: 'CHECKOUT CLOSED.',
      status: 'The checkout was closed. Nothing was charged.',
      detail: 'To pay, open the checkout again. To choose something else, go back to FieldLux.',
      actions: true,
      reopen: true,
    },
    error: {
      title: 'CHECKOUT DID NOT OPEN.',
      status: 'The checkout could not open. Nothing was charged.',
      detail: 'The link may have been paid already or replaced by a newer one. Go back to FieldLux and start again, or email info@field-lux.com with the link.',
      actions: true,
    },
    blocked: {
      title: 'CHECKOUT DID NOT LOAD.',
      status: 'The secure checkout could not load. Nothing was charged.',
      detail: 'Check your connection, or allow cdn.paddle.com if an ad blocker is on, then reload this page.',
      actions: true,
    },
    none: {
      title: 'NOTHING TO PAY HERE.',
      status: 'There is no payment to open here. Nothing was charged.',
      detail: 'Checkout links from FieldLux and Paddle open this page with the payment attached. To buy a plan or a 7-day pass, sign in to FieldLux and choose one.',
      actions: true,
    },
    unavailable: {
      title: 'CHECKOUT UNAVAILABLE.',
      status: 'Checkout is not available here right now. Nothing was charged.',
      detail: 'Email info@field-lux.com and we will help you pay.',
      actions: true,
    },
  };

  const title = doc.getElementById('checkout-title');
  const status = doc.getElementById('checkout-status');
  const detail = doc.getElementById('checkout-detail');
  const actions = doc.getElementById('checkout-actions');
  const reopen = doc.getElementById('checkout-reopen');

  const show = (key) => {
    const state = STATES[key];
    if (!state) return;
    doc.body.setAttribute('data-checkout-state', key);
    if (title) title.textContent = state.title;
    if (status) status.textContent = state.status;
    if (detail) detail.textContent = state.detail;
    if (actions) actions.hidden = !state.actions;
    if (reopen) reopen.hidden = !state.reopen;
  };

  let txn = null;
  try {
    txn = new URLSearchParams(window.location.search).get('_ptxn');
  } catch (e) {
    txn = null;
  }
  if (!txn || !TXN_RE.test(txn)) {
    show('none');
    return;
  }

  const token = meta('flx-paddle-token');
  const env = meta('flx-paddle-env');
  const envFromToken = token.startsWith('live_') ? 'production' : token.startsWith('test_') ? 'sandbox' : '';
  if (!TOKEN_RE.test(token) || env !== envFromToken) {
    show('unavailable');
    return;
  }

  show('loading');
  let completed = false;

  // Every checkout event Paddle.js emits for this page (Paddle.Initialize eventCallback).
  const onEvent = (event) => {
    const name = event && event.name;
    if (name === 'checkout.completed') {
      completed = true;
      show('completed');
    } else if (completed) {
      // After a payment the overlay's own success screen closes too: the page stays "received".
    } else if (name === 'checkout.loaded') {
      show('open');
    } else if (name === 'checkout.closed') {
      show('closed');
    } else if (name === 'checkout.error') {
      show('error');
    }
  };

  const script = doc.createElement('script');
  script.src = PADDLE_JS;
  script.async = true;
  const timer = window.setTimeout(() => {
    if (!window.Paddle) show('blocked');
  }, LOAD_TIMEOUT_MS);
  script.onerror = () => {
    window.clearTimeout(timer);
    show('blocked');
  };
  script.onload = () => {
    window.clearTimeout(timer);
    const Paddle = window.Paddle;
    if (!Paddle || typeof Paddle.Initialize !== 'function') {
      show('blocked');
      return;
    }
    try {
      if (env === 'sandbox') Paddle.Environment.set('sandbox');
      Paddle.Initialize({
        token,
        checkout: {
          settings: {
            displayMode: 'overlay',
            theme: 'light',
            locale: 'en',
            allowLogout: false,
            showAddDiscounts: false,
          },
        },
        eventCallback: onEvent,
      });
    } catch (e) {
      show('error');
    }
  };

  if (reopen) {
    reopen.addEventListener('click', () => {
      try {
        window.Paddle.Checkout.open({ transactionId: txn });
        show('loading');
      } catch (e) {
        show('error');
      }
    });
  }

  doc.head.appendChild(script);
})();
