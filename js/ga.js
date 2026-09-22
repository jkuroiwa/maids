/* ===== Google Analytics 4 =====
   Set GA_ID to the property's Measurement ID (Admin → Data Streams → Web).
   Leave it as the placeholder and nothing loads — safe for local preview. */
const GA_ID = 'G-S1BSSN4SJ4';

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

if (/^G-[A-Z0-9]+$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX') {
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', GA_ID);
}

/* Lead events — called from estimate.js and main.js on successful submits */
function trackLead(form, extra) {
  gtag('event', 'generate_lead', Object.assign({ form_name: form }, extra || {}));
}
