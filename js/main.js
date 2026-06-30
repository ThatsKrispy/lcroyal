/* L&C Royal Management — main.js */

/* Nav scroll state */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* Mobile menu */
const toggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.nav-mobile');
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* Contact form */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const success = document.getElementById('form-success');
    const error = document.getElementById('form-error');
    success.style.display = 'none';
    error.style.display = 'none';
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Formspree or similar — swap action URL when live
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        success.style.display = 'block';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      error.style.display = 'block';
    } finally {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
}

/* Cookie banner */
const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
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

/* Lazy load images */
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

/* Scroll reveal */
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => ro.observe(el));
}
