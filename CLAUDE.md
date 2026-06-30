# Maids of Honolulu — Site Documentation

Static brochure site for The Maids of Honolulu, a residential cleaning service covering all of Oahu. Plain HTML/CSS/JS, no build step, deployed on Netlify.

## File Structure

```
/
├── index.html              Home page
├── about.html              About Us & FAQs
├── services.html           Cleaning Services overview
├── jobs.html               Cleaning Jobs + application form
├── contact.html            Contact Us + free estimate form
├── services/
│   ├── kitchen.html        Kitchen Cleaning subpage
│   ├── bathroom.html       Bathroom Cleaning subpage
│   └── allrooms.html       All-Room Cleaning subpage
├── css/
│   └── style.css           All styles (single file, CSS variables)
├── js/
│   └── main.js             Nav toggle, FAQ accordion, popup, form success
├── images/                 (add favicon.png and any photos here)
├── netlify.toml            Netlify publish config + clean-URL redirects
└── CLAUDE.md               This file
```

## Key Constants

| Item | Value |
|------|-------|
| Phone | (808) 942-8080 |
| Email | maidsofhonolulu@gmail.com |
| Netlify form notify email | maidsofhonolulu@gmail.com (set in Netlify dashboard) |

## Netlify Forms

Two forms are registered with `data-netlify="true"`:

### 1. Free Estimate (`name="free-estimate"`)
- **File:** `contact.html`
- **Fields:** first_name, last_name, phone, email, address, home_size, service_type, message
- **Success redirect:** `contact.html?form=success#estimate-form`
- **Notification:** configure in Netlify dashboard → Forms → free-estimate → Notifications → Email to maidsofhonolulu@gmail.com

### 2. Cleaning Jobs (`name="cleaning-jobs"`)
- **File:** `jobs.html`
- **Fields:** first_name, last_name, phone, email, neighborhood, availability, experience, transportation, message
- **Success redirect:** `jobs.html?form=success#apply`
- **Notification:** configure in Netlify dashboard → Forms → cleaning-jobs → Notifications → Email to maidsofhonolulu@gmail.com

Both forms include a `bot-field` honeypot for spam protection (Netlify handles this automatically with `netlify-honeypot`).

### Post-deploy form setup checklist
1. Deploy site to Netlify (connect GitHub repo, no build command needed)
2. Netlify auto-detects forms on first deploy
3. Go to Netlify dashboard → **Forms** tab
4. For each form, add an email notification to `maidsofhonolulu@gmail.com`

## New Customer Popup

Defined in every page's HTML with `id="offerPopup"`. Controlled in `js/main.js`:
- Fires after 2.5s delay on first visit
- Dismissed state stored in `sessionStorage` (key: `moh_popup_dismissed`) — resets each browser session
- "Claim My Offer" button navigates to `contact.html#estimate-form`
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

## Adding Images

Place image files in `/images/`. The navbar brand currently renders as text only. To add a logo:
1. Add `favicon.png` and `logo.png` to `/images/`
2. In each `<link rel="icon">` tag, the href is already set to `images/favicon.png`
3. To show a logo in the navbar, add inside `.navbar-brand`: `<img src="images/logo.png" alt="Maids of Honolulu">`

## Deployment

- **Platform:** Netlify (static)
- **Build command:** *(none — publish directory is repo root)*
- **Publish directory:** `.` (set in `netlify.toml`)
- **No environment variables required**
