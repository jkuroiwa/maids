# Maids of Honolulu, Site Documentation

Static brochure site for The Maids of Honolulu, a residential cleaning service covering all of Oahu. Plain HTML/CSS/JS, no build step, deployed on Netlify.

## File Structure

```
/
├── index.html              Home page
├── about.html              About Us & FAQs
├── services.html           Cleaning Services overview + the 22 steps
├── estimate.html           Instant Estimate calculator + lead form
├── jobs.html               Cleaning Jobs + application form
├── contact.html            Contact Us + message form + areas served
├── 404.html                Branded not-found page (Netlify serves it automatically)
├── favicon.ico             Wordmark on brand navy, generated from the logo
├── sitemap.xml             Search-engine sitemap (15 pages, clean URLs)
├── robots.txt              Allows all crawlers, points at the sitemap
├── areas/                  Neighborhood landing pages (6)
│   ├── kailua.html         Windward: salt air, beach sand, humidity
│   ├── pearl-city.html     Pearl City & Aiea: PCS move-outs near JBPHH
│   ├── hawaii-kai.html     Larger homes, marina air, sun and dust
│   ├── kapolei.html        Kapolei & Ewa Beach: new builds, red dirt, commuters
│   ├── kaimuki.html        Kaimuki & Kahala: older homes, jalousie windows
│   └── mililani.html       Central Oahu: cooler, damper, mildew
├── services/
│   ├── kitchen.html        Kitchen Cleaning subpage
│   ├── bathroom.html       Bathroom Cleaning subpage
│   └── allrooms.html       All-Room Cleaning subpage
├── css/
│   └── style.css           All styles (single file, CSS variables)
├── js/
│   ├── main.js             Nav toggle, FAQ accordion, popup, form success
│   ├── estimate.js         Pricing tables + instant estimate calculator
│   └── ga.js               GA4 lead-event helper (gtag snippet is inline in each <head>)
├── images/                 Self-hosted photos, logo, icons, OG image
├── netlify.toml            Publish config, clean-URL redirects, cache + security headers
└── CLAUDE.md               This file
```

## Key Constants

| Item | Value |
|------|-------|
| Phone | (808) 263-8080 |
| Email | maidsofhonolulu@gmail.com |
| Owner / GM | Dan Okinishi |
| GA4 Measurement ID | G-S1BSSN4SJ4 |
| Live site | https://maidsofhonolulu.com |

## Writing style

**No em dashes** anywhere in site copy (use commas, colons, periods or parentheses) and **American English** spelling. En dashes in numeric and time ranges ($670 – $1,200, 8:00 am – 4:00 pm) are correct and stay. Standing rule from the owner, Sept 2026.

Copy should stay short. The original franchise site was verbose and it was deliberately cut down: customers already know what house cleaning is.

## Netlify Forms

Three forms are registered with `data-netlify="true"`. All include a `bot-field` honeypot.

### 1. Contact (`name="contact"`)
- **File:** `contact.html`
- **Fields:** name, phone, email, message
- **Success redirect:** `contact.html?form=success#contact-form`
- Formerly a 6-field `free-estimate` form, replaced by the Instant Estimate page.

### 2. Cleaning Jobs (`name="cleaning-jobs"`)
- **File:** `jobs.html`
- **Fields:** personal info, education, address, phone/email, skills, driver's license, three employer history blocks
- **Success redirect:** `jobs.html?form=success#apply`

### 3. Instant Estimate (`name="instant-estimate"`)
- **File:** `estimate.html`, logic in `js/estimate.js`
- **Fields submitted:** Estimate, Name, Phone, Email, Address, Zip, Region, Square Feet, Service, Frequency, Windows Last Cleaned, Discount, Estimate Low, Estimate High. All are hidden inputs that `estimate.js` fills with human-readable values before posting; the visible inputs are UI only and are not sent, so the notification email reads cleanly.
- **Submit:** AJAX POST to `/` (no redirect). The estimate is revealed only after Netlify accepts the submission. On localhost the estimate shows anyway with a console warning.

### Post-deploy form setup checklist
1. Netlify auto-detects forms on each deploy.
2. Netlify dashboard, Forms tab, add an email notification per form.
3. Currently one "any form" notification goes to jkuroiwa@gmail.com for testing. Switch to maidsofhonolulu@gmail.com when handing over.

## Instant Estimate Pricing

Tables in `js/estimate.js` mirror the spreadsheet `2026 Website Pricing - SF x lo hi.xlsx` (tabs "Scheduled Cleans" and "move out"). To change prices, edit those arrays. Nothing else depends on the numbers, and **no other page quotes a price**, deliberately, so this stays the single source of truth.

- **Deep clean / move-out:** `sqft × rate × multiplier`. Rate is a low/high pair per sq-ft bracket (25 brackets), so the result is a range. Multiplier is by how long since the windows were cleaned (0.84 up to 1.8). Move-out rates are the deep-clean rates plus $0.10.
- **Recurring:** `sqft × rate` per frequency (6) and bracket (24). Bracket 0 (up to 437 sq ft) is a flat price, not a rate. Recurring customers see the per-visit price headlined, with the initial deep clean shown as a range.
- All figures round to the nearest $10.
- **Display:** deep clean and move-out show the full low to high range. (Briefly changed to "Starting at $low" in Sept 2026 after a competitor comparison; Dan asked for the range back.)
- The multiplier question is worded "When did you last clean your windows?" (Dan's wording; the source sheet is "1st with windows").
- The "onetime" service is labelled **Deep clean** in the UI.
- **Discounts:** a dropdown asking if the customer is a Realtor, healthcare worker, first responder, in law enforcement, the military, or education. Realtor is 8% and reveals a required RB/RS license field; the other five are 5% and reveal a required "Employer or agency" field. Table is `DISCOUNTS` in `estimate.js`. Applied **silently**: the customer is never told a discount exists (Dan's call), only the office email notes it, as `Discount: Realtor 8%: license RS-12345` or `None`. Verification happens on the callback or at the first cleaning; the result fine print says so.

## Areas Served

**The Maids' franchising changed and Dan now holds the license for all of Oahu** (confirmed Sept 2026), so "Serving All of Oahu" is a real entitlement. Do **not** narrow site copy to a subset of zips.

Dan's 15 operating zips are his priority areas, not a coverage boundary:

| Region | Zips |
|---|---|
| Town | 96825, 96821, 96816, 96813, 96814, 96817 |
| Windward | 96734, 96744 |
| Leeward | 96701, 96818 (Moanalua/Salt Lake), 96782, 96797, 96789, 96706, 96707 |

These live in `ZIP_AREAS` in `js/estimate.js`. The estimate form maps the customer's zip to a `Region` field in the office email ("Windward (Kailua)"), falling back to "Other Oahu". It is a routing label only and never blocks or warns the customer, because Dan can take work anywhere on the island.

The Contact page lists main areas by region as examples under a "We serve all of Oahu" heading, with a note to call if an area is not listed.

### Neighborhood landing pages

Six pages under `areas/` target local searches ("house cleaning kailua"). Each has its own title, description, canonical, OG tags and `Service` JSON-LD with `areaServed`, and each is linked from the Contact page area list so none is orphaned.

The shared nav and footer are copied into each page by hand (no build step). **When copying the shell from `services/` into `areas/`, fix the footer service links:** inside `services/` they are siblings (`kitchen.html`), which silently 404 from `areas/`. They must read `../services/kitchen.html`. This broke 18 links before it was caught.

**Content must stay genuinely distinct per area.** Near-duplicate pages that only swap the place name are doorway pages and get penalized. Each page is built on a real local difference: windward salt and humidity (Kailua), military PCS move-outs (Pearl City), square footage and marina air (Hawaii Kai), red dirt and commuting (Kapolei), jalousie windows and old housing stock (Kaimuki), damp and mildew (Mililani). Pairwise word overlap is 31 to 37 percent, which is just shared vocabulary. Keep it there.

## Services page

`services.html#healthy-touch` lists all 22 Healthy Touch steps (kitchen 8, all rooms 9, bathrooms 3, windows 2), sourced from a sister franchise site. Worth having Dan confirm they match what his teams actually do.

## New Customer Popup

Defined in every page's HTML with `id="offerPopup"`, controlled in `js/main.js`:
- Fires after 2.5s on first visit
- Dismissed state in `sessionStorage` (key `moh_popup_dismissed`), resets each browser session
- "Claim My Offer" resolves the estimate page from the nav's own link, so it works on sub-pages and under Netlify's pretty URLs
- Offer: $10 off 1st cleaning, $20 off 2nd, $20 off 3rd ($50 total)

## Images

All images are self-hosted in `/images/`. Sub-pages and `css/style.css` reference them with `../images/`. **No external images remain.** The Getty stock cutout in the home hero was hotlinked to the old WordPress host and broke when the domain moved to Netlify (Sept 2026). It was removed rather than re-hosted, since it was stock licensed to the previous owner, and `.hero-inner` is now a single column.

Photos were downsized (Sept 2026) to roughly 2x their largest on-page display width, not the 1920px originals. The home page went from 1.7 MB to about 160 KB on first view. The `-1920w` and `-2880w` suffixes in filenames are historical from the old CDN and no longer describe the actual size. Current widths: 1040px (photos shown up to 516px), 520px (shown up to 252px), 1600px (`_232_`, the CSS hero background). **If you replace a photo, resize it to match. Do not drop in a full-resolution original.**

Every `<img>` carries `width`/`height` (prevents layout shift) and `loading="lazy"`, except the navbar logo which stays eager. `images/og-image.jpg` (1200x630) is the social preview; `favicon.ico` and `images/apple-touch-icon.png` are generated from the logo on brand navy.

## SEO

Every page carries Open Graph and Twitter card tags, a favicon, `theme-color`, and a `rel="canonical"` pointing at its clean URL. Both `/about` and `/about.html` return 200, so without the canonical Google would see duplicates.

`index.html` has **LocalBusiness** JSON-LD and `about.html` has **FAQPage** JSON-LD built from the nine real FAQs. The LocalBusiness block deliberately has **no `address`**: the business street address was never confirmed, so it was left out rather than guessed. Adding a verified address would strengthen local rich results.

`sitemap.xml` lists all 15 pages on clean URLs with `lastmod` from each file's last git commit. Regenerate by hand when pages are added.

## Analytics

The standard gtag snippet (`G-S1BSSN4SJ4`) is inline at the top of every page's `<head>`, because Google's tag detector reads the raw HTML and cannot see a dynamically loaded tag. `js/ga.js` holds only the `trackLead()` helper, which sends a `generate_lead` event on every successful form submit: `form_name` is `instant-estimate` (with `service`, `value`, and `discount_group`), `contact`, or `cleaning-jobs`. Mark `generate_lead` as a key event in GA4 to get lead counts and conversion rate.

## Domain

`maidsofhonolulu.com` is registered at GoDaddy, in an account held by the former owner (Arun Savara / Mira's Cleaning Service). Dan should have it transferred to his own account. Jared has delegate access.

**Live on Netlify since Sept 21 2026.** Nameservers were changed at GoDaddy from Cloudflare to Netlify DNS (`dns1-4.p01.nsone.net`). Let's Encrypt cert auto-provisioned; `www` and `http` both 301 to `https://maidsofhonolulu.com`. No MX records exist, email is gmail.com, so nothing about email was affected.

DNS zone (Netlify, Team, DNS) holds the two NETLIFY records plus two TXT records on `@`:

- `google-site-verification=Gn5L0sDwHf-oFXEA8nDbLbJZlw86NTuyIj-QfAuXi7Y` (pre-existing)
- `google-site-verification=M9xXHSgPnASNQazWZTPzFOx-vpJBVIkIoGh7h7o_nXk` (Search Console, also a meta tag on `index.html`)

**Rollback** to the old WordPress site: set GoDaddy nameservers back to `anna.ns.cloudflare.com` and `tim.ns.cloudflare.com`.

## CSS Conventions

All colors are CSS variables in `:root` (see `css/style.css`): `--navy`, `--navy-dk`, `--yellow`, `--white`, `--off-wh`, `--gray-lt`, `--gray`, `--dark`.

Breakpoints: 768px (tablet/mobile nav, grids collapse to one column), 600px, 480px (single-column footer).

Layout grids belong in CSS classes, not inline `style="grid-template-columns:..."`. A hard-coded two-column inline grid on the home page once made the page 461px wide on a 375px phone, which broke `position: fixed` and mis-rendered the popup. `html, body { overflow-x: clip }` is a safety net against a repeat.

## Security posture

Reviewed Sept 2026. No secrets in the repo, no XSS path (the single `innerHTML` in `estimate.js` receives only computed currency values and fixed table labels, never user input; form data goes straight into a `URLSearchParams` POST body). All 48 external links carry `rel="noopener"`. HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy are set in `netlify.toml`. **No CSP**, which would need care around the inline gtag snippet.

Known and accepted: the pricing tables and discount percentages are readable in `js/estimate.js`, and the discount dropdown is client-side, so a visitor could claim a discount they are not entitled to or tamper with the posted estimate. Both are mitigated by Dan confirming every price by phone and verifying eligibility at the first cleaning. There is no server-side logic to attack.

**Open gap: no privacy policy.** The estimate form collects name, street address, zip, phone, email, and for discounts a real estate license number or employer name. The footer's Terms and Privacy links were removed in Sept 2026 because they pointed nowhere.

## Local Preview

`.claude/launch.json` defines a `static` server (`python -m http.server 8765`). Form POSTs return 501 locally; the estimate page handles this and still shows the result.

## Deployment

- **Platform:** Netlify (static), project `maidsofhonolulu`, team "Black Rock Consulting"
- **Build command:** none. Publish directory is the repo root
- **Auto-deploys** from `main` on github.com/jkuroiwa/maids

**Deploys cost credits.** A production deploy is 15 credits; the Free plan gives 300/month, so roughly 20 deploys. Twenty deploys in four days exhausted it in Sept 2026 and paused production deploys until the team was upgraded to Personal ($9/month, 1,000 credits). **Batch changes into one deploy per working session** rather than pushing per tweak. Consider dropping back to Free once the pace settles.

Everything in the repo root is publicly served, so `netlify.toml` returns 404 for `/CLAUDE.md`. Dotfiles and `netlify.toml` itself are excluded by Netlify automatically.
