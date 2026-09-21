# Maids of Honolulu — Site Documentation

Static brochure site for The Maids of Honolulu, a residential cleaning service covering all of Oahu. Plain HTML/CSS/JS, no build step, deployed on Netlify.

## File Structure

```
/
├── index.html              Home page
├── about.html              About Us & FAQs
├── services.html           Cleaning Services overview
├── jobs.html               Cleaning Jobs + application form
├── estimate.html           Instant Estimate calculator + lead form
├── contact.html            Contact Us + free estimate form
├── services/
│   ├── kitchen.html        Kitchen Cleaning subpage
│   ├── bathroom.html       Bathroom Cleaning subpage
│   └── allrooms.html       All-Room Cleaning subpage
├── css/
│   └── style.css           All styles (single file, CSS variables)
├── js/
│   ├── main.js             Nav toggle, FAQ accordion, popup, form success
│   └── estimate.js         Pricing tables + instant estimate calculator
├── images/                 Self-hosted photos, logo, icons
├── netlify.toml            Netlify publish config + clean-URL redirects
└── CLAUDE.md               This file
```

## Key Constants

| Item | Value |
|------|-------|
| Phone | (808) 263-8080 |
| Email | maidsofhonolulu@gmail.com |
| Netlify form notify email | maidsofhonolulu@gmail.com (set in Netlify dashboard) |

## Netlify Forms

Three forms are registered with `data-netlify="true"`:

### 1. Contact (`name="contact"`)
- **File:** `contact.html`
- **Fields:** name, phone, email, message
- **Success redirect:** `contact.html?form=success#contact-form`
- Formerly a 6-field `free-estimate` form; replaced by the Instant Estimate page.

### 2. Cleaning Jobs (`name="cleaning-jobs"`)
- **File:** `jobs.html`
- **Fields:** first_name, last_name, phone, email, neighborhood, availability, experience, transportation, message
- **Success redirect:** `jobs.html?form=success#apply`
- **Notification:** configure in Netlify dashboard → Forms → cleaning-jobs → Notifications → Email to maidsofhonolulu@gmail.com

### 3. Instant Estimate (`name="instant-estimate"`)
- **File:** `estimate.html`, logic in `js/estimate.js`
- **Fields submitted:** Estimate, Name, Phone, Email, Address, Zip, Square Feet, Service, Frequency, Windows Last Cleaned, Discount, Estimate Low, Estimate High — all hidden inputs that `estimate.js` fills with human-readable values before posting. The visible inputs are UI only and are not sent, so the notification email reads cleanly.
- **Submit:** AJAX POST to `/` (no redirect); the estimate is revealed only after Netlify accepts the submission. On localhost the estimate shows anyway with a console warning.
- **Notification:** configure in Netlify dashboard → Forms → instant-estimate → Notifications → Email to maidsofhonolulu@gmail.com

All forms include a `bot-field` honeypot for spam protection (Netlify handles this automatically with `netlify-honeypot`).

## Services page

`services.html#healthy-touch` lists all 22 Healthy Touch steps (kitchen 8, all rooms 9, bathrooms 3, windows 2), sourced from a sister franchise site. The home-page trust bar has a commented-out Google-rating badge waiting for the real rating and review count.

## Instant Estimate Pricing

Tables in `js/estimate.js` mirror the spreadsheet `2026 Website Pricing - SF x lo hi.xlsx` (two tabs: "Scheduled Cleans", "move out"). To change prices, edit the arrays there — no other code depends on the numbers.

- **One-time / move-out:** `sqft × rate × multiplier`. Rate is a low/high pair per sq-ft bracket (25 brackets), so the result is a range. Multiplier is by time since last professional clean (0.84 → 1.8). Move-out rates are the first-clean rates + $0.10.
- **Recurring:** `sqft × rate` per frequency (6) and bracket (24). Bracket 0 (≤437 sq ft) is a flat price, not a rate. Recurring customers are shown the one-time range as their initial clean plus the per-visit price.
- All figures rounded to the nearest $10.
- **Display:** deep clean and move-out show the full low–high range; recurring headlines the per-visit price with the initial clean as a range. (Briefly changed to "Starting at $low" in Sept 2026 after a competitor comparison; owner Dan asked for the range back.)
- The multiplier question is worded "When did you last clean your windows?" (owner's wording — the multiplier sheet is "1st with windows").
- The "onetime" service is labelled **Deep clean** in the UI.
- **Discounts:** a "Do any of these apply to you?" dropdown — Realtor 8% (reveals a required RB/RS license field), Healthcare worker / Law enforcement / Military / First responder / Educator 5% (reveals a required "Employer or agency" field). Verification happens on the callback / at the first cleaning, not online; the result fine print says "Discounts verified at your first cleaning." Table is `DISCOUNTS` in `estimate.js`. Applied silently — the customer is NOT told (owner's call); the office email gets a `Discount` field like "Realtor 8% — license RS-12345", "Military 5%", or "None", and the estimate summary notes it.
- Popup "Claim My Offer" button and every "Get Your Free Estimate" CTA link to `estimate.html`.

### Post-deploy form setup checklist
1. Deploy site to Netlify (connect GitHub repo, no build command needed)
2. Netlify auto-detects forms on first deploy
3. Go to Netlify dashboard → **Forms** tab
4. For each form, add an email notification to `maidsofhonolulu@gmail.com` (currently one "any form" notification goes to jkuroiwa@gmail.com for testing)

## New Customer Popup

Defined in every page's HTML with `id="offerPopup"`. Controlled in `js/main.js`:
- Fires after 2.5s delay on first visit
- Dismissed state stored in `sessionStorage` (key: `moh_popup_dismissed`) — resets each browser session
- "Claim My Offer" button navigates to `estimate.html` (path resolved from the navbar brand link so sub-pages work)
- Offer: $10 off 1st cleaning, $20 off 2nd, $20 off 3rd ($50 total)

## CSS Conventions

All colors are CSS variables in `:root` (see `css/style.css`):
- `--teal` / `--teal-dk` — primary brand color
- `--gold` — accent / CTA color
- `--dark` — body text
- `--off-wh` — alternate section background

Breakpoints: 768px (tablet/mobile nav), 480px (single-column footer).

## Areas Served

Single unified list on `index.html` (39 neighborhoods). Combines the old Honolulu, Windward, and Leeward franchise zones. No franchise routing — one phone number for all.

## Images

All images are self-hosted in `/images/` (photos, `the-maids-logo.jpg`, payment icons, social SVG icons, HomeGuide seal). The only remaining external image is the Getty stock photo on `index.html`. Sub-pages and `css/style.css` reference images with `../images/`.

## Local Preview

`.claude/launch.json` defines a `static` server (`python -m http.server 8765`). Form POSTs return 501 locally; the estimate page handles this and still shows the result.

## Deployment

- **Platform:** Netlify (static)
- **Build command:** *(none — publish directory is repo root)*
- **Publish directory:** `.` (set in `netlify.toml`)
- **No environment variables required**
