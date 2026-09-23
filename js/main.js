/* ===== MAIDS OF HONOLULU main.js ===== */

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
  // Normalize "index.html", "/", "/about", "about.html" -> "index", "about"
  // (Netlify's pretty URLs rewrite hrefs to extensionless paths at deploy time)
  const slug = p => (p.split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
  const path = slug(location.pathname);
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (slug(a.getAttribute('href')) === path) a.classList.add('active');
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
    // Reuse the nav's own link so the path is right on sub-pages and on
    // Netlify, where hrefs are rewritten to pretty URLs at deploy time
    const navLink = document.querySelector('.nav-links a[href*="estimate"]');
    location.href = navLink ? navLink.getAttribute('href') : '/estimate';
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });
})();

/* --- Unique email subjects so Gmail does not thread notifications --- */
(function setFormSubjects() {
  const val = (form, name) => (form.querySelector(`[name="${name}"]`)?.value || '').trim();
  const SUBJECTS = {
    'contact':       f => `Message: ${val(f, 'name') || 'website visitor'}`,
    'cleaning-jobs': f => `Job application: ${[val(f, 'first_name'), val(f, 'last_name')].filter(Boolean).join(' ') || 'applicant'}`,
  };
  for (const [name, build] of Object.entries(SUBJECTS)) {
    const form = document.querySelector(`form[name="${name}"]`);
    if (!form) continue;
    form.addEventListener('submit', () => {
      const field = form.querySelector('[name="subject"]');
      if (field) field.value = build(form);
    });
  }
})();

/* --- Netlify form success redirect handling --- */
(function handleFormSuccess() {
  const params = new URLSearchParams(location.search);
  if (params.get('form') === 'success') {
    const successEl = document.querySelector('.form-success');
    if (successEl) {
      successEl.style.display = 'block';
      successEl.scrollIntoView({ behavior: 'smooth' });
      if (typeof trackLead === 'function') {
        trackLead(location.pathname.includes('jobs') ? 'cleaning-jobs' : 'contact');
      }
    }
  }
})();
