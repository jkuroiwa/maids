/* ===== Google Analytics 4 helpers =====
   The gtag snippet itself is inline in every page's <head> (Measurement ID
   G-S1BSSN4SJ4) so Google's tag detector can see it in the raw HTML. This file
   only adds the lead-event helper used by estimate.js and main.js. */
window.dataLayer = window.dataLayer || [];
if (typeof gtag !== 'function') { function gtag() { dataLayer.push(arguments); } }

/* Lead events, called from estimate.js and main.js on successful submits */
function trackLead(form, extra) {
  gtag('event', 'generate_lead', Object.assign({ form_name: form }, extra || {}));
}
