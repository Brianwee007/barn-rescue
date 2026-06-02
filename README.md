# Barn Rescue — landing page + application funnel

A single static site that writes applications straight into Supabase. No GHL,
no backend you have to babysit. The browser talks directly to Supabase, and a
Row-Level-Security policy means visitors can **submit** applications but can't
**read** anyone's data.

## What's on the page (June 2026)

- **Photos throughout** — optimized for mobile and stored in `images/`. The raw
  originals stay on your disk but are git-ignored to keep the repo light.
- **Impulsion.io** is referenced *loosely* in Brian's bio on purpose — the
  software stays under wraps.
- **Share image** — `images/og.jpg` (1200×630) is wired into the Open Graph tags
  so ad/link previews look premium.

### The book (prepared, not published on the site yet)

A 28-page book, *Horse-First Profit Architecture for Riding Schools* (Brian Sean
Wee, CFP, EA), is authored in `ebook.html` (+ `cover.html` for the cover) and
rendered to `Horse-First-Profit-Architecture-for-Riding-Schools.pdf`. These files
are kept **locally but git-ignored**, so the book is **not** served on the live
site for now. To put it back, un-ignore the files, re-add the "The Method" section
in `index.html`, and push. To re-render after an edit:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw --virtual-time-budget=20000 \
  --print-to-pdf="Horse-First-Profit-Architecture-for-Riding-Schools.pdf" ebook.html
```

## What's here

| File | What it does |
|------|--------------|
| `index.html` | Landing page + 3-step application form |
| `styles.css` | All styling |
| `app.js` | Funnel logic, validation, Supabase insert |
| `config.js` | **You edit this** — your Supabase URL + anon key |
| `supabase-schema.sql` | Run once in Supabase to create the table |
| `server.js` | Tiny static server so Railway runs with zero config |
| `package.json` | Tells Railway to run `node server.js` |

---

## Step 1 — Supabase (≈2 min)

1. In your Supabase project, open **SQL Editor → New query**.
2. Paste the contents of `supabase-schema.sql` and click **Run**.
   - This creates the `applications` table and locks it down (insert-only).
3. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key (the public one — *not* the service_role key)

> The anon key is meant to be public. It's safe in `config.js`. The table's
> RLS policy only allows inserts, so nobody can read submissions with it.

## Step 2 — Add your keys

Open `config.js` and paste in your values:

```js
window.BARN_RESCUE_CONFIG = {
  SUPABASE_URL: "https://abcd1234.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGc...your anon key...",
  TABLE: "applications",
};
```

## Step 3 — Test locally (optional)

```bash
npm start
# open http://localhost:3000
```

Submit a test application, then check **Table Editor → applications** in
Supabase to confirm the row landed.

## Step 4 — Push to GitHub

```bash
cd barn-rescue
git init
git add .
git commit -m "Barn Rescue landing + funnel"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/barn-rescue.git
git push -u origin main
```

## Step 5 — Deploy on Railway

1. Railway → **New Project → Deploy from GitHub repo** → pick `barn-rescue`.
2. Railway auto-detects Node, runs `npm start`. No build command needed.
3. Under **Settings → Networking**, click **Generate Domain**.
4. That URL is what you point your Facebook ads at.

(If you want a custom domain like `apply.yourbrand.com`, add it under
Settings → Networking → Custom Domain and update your DNS.)

---

## Reading applications

Open **Supabase → Table Editor → applications**, sorted newest-first. Export to
CSV anytime. If you want email alerts on new applications, add a Supabase
**Database Webhook** (Database → Webhooks) on insert → send to your email tool
or a Zapier/Make webhook.

## Facebook ads notes

- Point the ad's destination URL at your Railway domain.
- Most traffic will be mobile — the form is built mobile-first and steps are
  thumb-friendly.
- If you install the Facebook Pixel, drop the pixel snippet into `index.html`
  just before `</head>`. `app.js` already fires a **Lead** event on successful
  submit, so you can optimize the campaign for applications.

## Adjusting the form

- **Add/remove fields:** edit the matching `<input>` in `index.html`, add the
  column to `supabase-schema.sql` (and to the table in Supabase), and add it to
  the `collect()` object in `app.js`. Keep the three in sync.
- **Required vs optional:** only name + email are required (so estimates on the
  numbers don't block submission). Change this in the `required` object in
  `app.js`.
