/* ===== MAIDS OF HONOLULU — main.js ===== */

/* --- Mobile nav toggle --- */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
}

/* --- Active nav link --- */
(function markActiveLink() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
})();

/* --- FAQ accordion --- */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* --- Popup / $50 new-customer offer --- */
(function initPopup() {
  const overlay = document.getElementById('offerPopup');
  if (!overlay) return;

  const STORAGE_KEY = 'moh_popup_dismissed';
  const dismissed   = sessionStorage.getItem(STORAGE_KEY);

  if (!dismissed) {
    setTimeout(() => overlay.classList.remove('hidden'), 2500);
  }

  function closePopup() {
    overlay.classList.add('hidden');
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  overlay.querySelector('.popup-close')?.addEventListener('click', closePopup);
  overlay.querySelector('.popup-dismiss')?.addEventListener('click', closePopup);
  overlay.querySelector('.popup-cta')?.addEventListener('click', () => {
    closePopup();
    const contactPage = 'contact.html';
    if (!location.pathname.includes(contactPage)) {
      location.href = contactPage + '#estimate-form';
    } else {
      document.getElementById('estimate-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });
})();

/* --- Netlify form success redirect handling --- */
(function handleFormSuccess() {
  const params = new URLSearchParams(location.search);
  if (params.get('form') === 'success') {
    const successEl = document.querySelector('.form-success');
    if (successEl) {
      successEl.style.display = 'block';
      successEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
})();
