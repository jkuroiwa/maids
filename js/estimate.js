/* ===== MAIDS OF HONOLULU — estimate.js =====
   Instant estimate calculator. Pricing tables mirror
   "2026 Website Pricing - SF x lo hi.xlsx".

   One-time & move-out:  sq ft × rate(lo/hi by bracket) × multiplier(last cleaned)
   Recurring:            sq ft × rate(by frequency + bracket); flat minimum under 438 sq ft
*/

/* --- Sq-ft brackets for one-time / move-out cleans.
   [maxSqFt, lowRate, highRate] — first bracket whose max >= sqft wins. --- */
const FIRST_CLEAN_RATES = [
  [357,  0.90, 1.30], [457,  0.80, 1.20], [557,  0.70, 1.16], [657,  0.66, 1.12],
  [757,  0.62, 1.08], [857,  0.60, 1.04], [957,  0.58, 1.02], [1057, 0.56, 1.00],
  [1157, 0.54, 0.98], [1257, 0.52, 0.96], [1357, 0.50, 0.94], [1457, 0.48, 0.92],
  [1557, 0.46, 0.90], [1657, 0.44, 0.88], [1757, 0.42, 0.86], [1857, 0.40, 0.84],
  [2257, 0.39, 0.83], [2657, 0.38, 0.82], [3057, 0.37, 0.81], [3657, 0.36, 0.80],
  [4257, 0.35, 0.79], [4857, 0.34, 0.78], [5657, 0.33, 0.77], [6257, 0.32, 0.76],
  [Infinity, 0.31, 0.75],
];

const MOVE_OUT_RATES = [
  [357,  1.00, 1.40], [457,  0.90, 1.30], [557,  0.80, 1.26], [657,  0.76, 1.22],
  [757,  0.72, 1.18], [857,  0.70, 1.14], [957,  0.68, 1.12], [1057, 0.66, 1.10],
  [1157, 0.64, 1.08], [1257, 0.62, 1.06], [1357, 0.60, 1.04], [1457, 0.58, 1.02],
  [1557, 0.56, 1.00], [1657, 0.54, 0.98], [1757, 0.52, 0.96], [1857, 0.50, 0.94],
  [2257, 0.49, 0.93], [2657, 0.48, 0.92], [3057, 0.47, 0.91], [3657, 0.46, 0.90],
  [4257, 0.45, 0.89], [4857, 0.44, 0.88], [5657, 0.43, 0.87], [6257, 0.42, 0.86],
  [Infinity, 0.41, 0.85],
];

/* --- Multiplier by time since the windows were last cleaned --- */
const LAST_CLEANED = {
  lt_week:  { label: 'Less than a week ago',        mult: 0.84 },
  lt_month: { label: 'Less than a month ago',       mult: 1.00 },
  '1_2_mo': { label: '1–2 months ago',              mult: 1.10 },
  '2_6_mo': { label: '2–6 months ago',              mult: 1.20 },
  '6_12_mo':{ label: '6–12 months ago',             mult: 1.40 },
  '1_2_yr': { label: '1–2 years ago',               mult: 1.60 },
  '2_plus': { label: 'Over 2 years ago / never',    mult: 1.80 },
};

/* --- Recurring: bracket upper bounds, then a rate per frequency.
   Index 0 is a FLAT PRICE (homes up to 437 sq ft); the rest are $/sq ft. --- */
const RECURRING_BRACKETS = [
  437, 557, 657, 757, 857, 957, 1057, 1157, 1257, 1357, 1457, 1557,
  1657, 1757, 1857, 2257, 2657, 3057, 3657, 4257, 4857, 5657, 6257, Infinity,
];

const RECURRING = {
  every4: { label: 'Every 4 weeks',   rates: [195, .46, .40, .34, .32, .30, .28, .26, .25, .24, .23, .22, .21, .20, .19, .185, .18, .175, .17, .165, .16, .155, .15, .14] },
  every2: { label: 'Every 2 weeks',   rates: [190, .44, .38, .33, .31, .29, .27, .25, .24, .23, .22, .21, .20, .19, .185, .18, .175, .17, .165, .16, .155, .15, .14, .135] },
  weekly: { label: 'Weekly',          rates: [185, .42, .37, .32, .30, .28, .26, .24, .23, .22, .21, .20, .19, .185, .18, .175, .17, .165, .16, .155, .15, .14, .135, .13] },
  twice:  { label: '2 times a week',  rates: [180, .40, .35, .30, .28, .26, .24, .23, .22, .21, .20, .19, .185, .18, .175, .17, .165, .16, .155, .15, .14, .135, .13, .125] },
  thrice: { label: '3 times a week',  rates: [176, .38, .33, .28, .26, .24, .23, .22, .21, .20, .19, .185, .18, .175, .17, .165, .16, .155, .15, .14, .135, .13, .125, .12] },
  daily:  { label: 'Daily',           rates: [170, .36, .31, .26, .24, .23, .22, .21, .20, .19, .185, .18, .175, .17, .165, .16, .155, .15, .14, .135, .13, .125, .12, .115] },
};

/* --- Calculator --- */
function bracketIndex(bounds, sqft) {
  return bounds.findIndex(max => sqft <= max);
}

function round10(n) { return Math.round(n / 10) * 10; }

/* Returns { low, high } for a one-time or move-out clean */
function oneTimeEstimate(table, sqft, lastCleanedKey) {
  const [, lo, hi] = table[bracketIndex(table.map(r => r[0]), sqft)];
  const mult = LAST_CLEANED[lastCleanedKey].mult;
  return { low: round10(sqft * lo * mult), high: round10(sqft * hi * mult) };
}

/* Returns a single per-visit price for a recurring schedule */
function recurringEstimate(sqft, freqKey) {
  const i = bracketIndex(RECURRING_BRACKETS, sqft);
  const rate = RECURRING[freqKey].rates[i];
  return round10(i === 0 ? rate : sqft * rate);
}

function estimate({ sqft, service, lastCleaned, frequency }) {
  if (service === 'moveout') {
    return { type: 'moveout', ...oneTimeEstimate(MOVE_OUT_RATES, sqft, lastCleaned) };
  }
  const first = oneTimeEstimate(FIRST_CLEAN_RATES, sqft, lastCleaned);
  if (service === 'recurring') {
    return { type: 'recurring', ...first, perVisit: recurringEstimate(sqft, frequency), frequency };
  }
  return { type: 'onetime', ...first };
}

const money = n => '$' + n.toLocaleString('en-US');

const REALTOR_DISCOUNT = 0.08;

/* Apply the Realtor discount to every dollar figure in a result */
function discount(r) {
  const d = n => round10(n * (1 - REALTOR_DISCOUNT));
  return { ...r, low: d(r.low), high: d(r.high), ...(r.perVisit != null && { perVisit: d(r.perVisit) }), realtor: true };
}

const SERVICE_LABELS = { onetime: 'Deep clean (one-time)', recurring: 'Recurring cleaning', moveout: 'Move-out cleaning' };

/* "18083832979" / "808-383-2979" -> "(808) 383-2979"; anything else passes through */
function formatPhone(raw) {
  const d = raw.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : raw.trim();
}

/* --- Form wiring --- */
(function initEstimateForm() {
  const form = document.getElementById('estimateForm');
  if (!form) return;

  const freqGroup   = document.getElementById('frequencyGroup');
  const realtorBox  = document.getElementById('e-realtor');
  const licenseGrp  = document.getElementById('licenseGroup');
  const licenseIn   = document.getElementById('e-license');
  const freqSelect  = form.elements.frequency;
  const resultEl    = document.getElementById('estimateResult');
  const errorEl     = document.getElementById('estimateError');
  const submitBtn   = form.querySelector('button[type="submit"]');

  /* Show the frequency question only for recurring */
  function syncFrequency() {
    const recurring = form.elements.service_type.value === 'recurring';
    freqGroup.hidden = !recurring;
    freqSelect.required = recurring;
  }
  form.querySelectorAll('input[name="service_type"]').forEach(r => r.addEventListener('change', syncFrequency));
  syncFrequency();

  /* Ask for the license number only if they say they're a Realtor */
  function syncRealtor() {
    licenseGrp.hidden = !realtorBox.checked;
    licenseIn.required = realtorBox.checked;
  }
  realtorBox.addEventListener('change', syncRealtor);
  syncRealtor();

  /* Deep clean and move-out show the full low–high range (owner's call);
     recurring headlines the per-visit price with the initial clean as a range. */
  function renderResult(r) {
    const range = `${money(r.low)} – ${money(r.high)}`;
    let headline, price, detail;
    if (r.type === 'moveout') {
      headline = 'Move-out cleaning';
      price = range;
      detail = 'A top-to-bottom clean to get your deposit back.';
    } else if (r.type === 'recurring') {
      headline = `Recurring cleaning, ${RECURRING[r.frequency].label.toLowerCase()}`;
      price = `${money(r.perVisit)} per visit`;
      detail = `Starts with an initial deep clean of <strong>${range}</strong>.`;
    } else {
      headline = 'Deep clean';
      price = range;
      detail = 'Our full first-time or one-time cleaning.';
    }
    resultEl.querySelector('.estimate-headline').textContent = headline;
    resultEl.querySelector('.estimate-price').textContent = price;
    resultEl.querySelector('.estimate-detail').innerHTML = detail;
    form.hidden = true;
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const sqft = parseInt(form.elements.sqft.value, 10);
    let result = estimate({
      sqft,
      service:     form.elements.service_type.value,
      lastCleaned: form.elements.last_cleaned.value,
      frequency:   freqSelect.value,
    });
    const isRealtor = realtorBox.checked;
    if (isRealtor) result = discount(result);

    /* Build a human-readable submission (only the hidden fields are sent) */
    let summary = `${money(result.low)} – ${money(result.high)}`;
    if (result.type === 'recurring') {
      summary += ` initial, then ${money(result.perVisit)}/visit ${RECURRING[result.frequency].label.toLowerCase()}`;
    }
    if (isRealtor) summary += ' (8% Realtor discount applied)';
    const f = form.elements;
    const payload = {
      'form-name':     f['form-name'].value,
      'bot-field':     f['bot-field'].value,
      'Estimate':      summary,
      'Name':          `${f.first_name.value.trim()} ${f.last_name.value.trim()}`,
      'Phone':         formatPhone(f.phone.value),
      'Email':         f.email.value.trim(),
      'Address':       f.address.value.trim(),
      'Zip':           f.zip.value.trim(),
      'Square Feet':   sqft,
      'Service':       SERVICE_LABELS[result.type],
      'Frequency':     result.type === 'recurring' ? RECURRING[result.frequency].label : 'n/a',
      'Windows Last Cleaned': LAST_CLEANED[f.last_cleaned.value].label,
      'Realtor':       isRealtor ? `Yes — license ${f.license.value.trim().toUpperCase()}` : 'No',
      'Estimate Low':  result.low,
      'Estimate High': result.high,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Calculating…';
    errorEl.hidden = true;

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
      if (!res.ok && !isLocal) throw new Error('Netlify responded ' + res.status);
      if (!res.ok) console.warn('Local preview: form not submitted (no Netlify), showing estimate anyway.');
      renderResult(result);
    } catch (err) {
      console.error(err);
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Show My Estimate';
    }
  });
})();
