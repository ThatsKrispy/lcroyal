/* L&C Royal Management — main.js | ThatsKrispy */

/* ─── Nav scroll state ─── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ─── Mobile menu ─── */
const toggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.nav-mobile');
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─── Contact form — Web3Forms ─── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = form.querySelector('.form-submit');
    const success = document.getElementById('form-success');
    const error   = document.getElementById('form-error');
    success.style.display = 'none';
    error.style.display   = 'none';
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data = new FormData(form);
    // Web3Forms — free, no backend required
    data.append('access_key', form.dataset.key || '');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (json.success) {
        success.style.display = 'block';
        form.reset();
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch {
      error.style.display = 'block';
    } finally {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
}

/* ─── Cookie banner ─── */
const cookieBanner  = document.getElementById('cookie-banner');
const cookieAccept  = document.getElementById('cookie-accept');
const cookieDecline = document.getElementById('cookie-decline');
if (cookieBanner) {
  if (!localStorage.getItem('lcr-cookie')) {
    cookieBanner.style.display = 'flex';
  }
  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('lcr-cookie', 'accepted');
    cookieBanner.style.display = 'none';
  });
  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem('lcr-cookie', 'declined');
    cookieBanner.style.display = 'none';
  });
}

/* ─── Lazy load images ─── */
if ('IntersectionObserver' in window) {
  const imgs = document.querySelectorAll('img[data-src]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        e.target.removeAttribute('data-src');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => io.observe(img));
}

/* ─── ADA Accessibility Widget ─── */
const adaToggle = document.getElementById('ada-toggle');
const adaPanel  = document.getElementById('ada-panel');
if (adaToggle && adaPanel) {
  adaToggle.addEventListener('click', () => {
    adaPanel.classList.toggle('open');
    adaToggle.setAttribute('aria-expanded', adaPanel.classList.contains('open'));
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#ada-widget')) {
      adaPanel.classList.remove('open');
      adaToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Load saved prefs
  const prefs = JSON.parse(localStorage.getItem('lcr-ada') || '{}');
  if (prefs.hc)     document.body.classList.add('hc-mode');
  if (prefs.large)  document.body.classList.add('large-text');
  if (prefs.motion) document.body.classList.add('reduce-motion');

  function savePrefs() {
    localStorage.setItem('lcr-ada', JSON.stringify({
      hc:     document.body.classList.contains('hc-mode'),
      large:  document.body.classList.contains('large-text'),
      motion: document.body.classList.contains('reduce-motion')
    }));
  }

  document.getElementById('ada-hc')?.addEventListener('click', () => {
    document.body.classList.toggle('hc-mode'); savePrefs();
  });
  document.getElementById('ada-large')?.addEventListener('click', () => {
    document.body.classList.toggle('large-text'); savePrefs();
  });
  document.getElementById('ada-motion')?.addEventListener('click', () => {
    document.body.classList.toggle('reduce-motion'); savePrefs();
  });
  document.getElementById('ada-reset')?.addEventListener('click', () => {
    document.body.classList.remove('hc-mode','large-text','reduce-motion');
    localStorage.removeItem('lcr-ada');
  });
}
