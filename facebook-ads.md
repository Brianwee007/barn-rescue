# Barn Rescue — Facebook/Meta Ad Campaign (paste-ready)

Targeting **Ohio horse-barn / riding-school owners**, driving them to the
application funnel. Everything below is built to paste straight into Meta Ads
Manager. Replace the destination URL with your live site URL once it's deployed.

---

## 1. Campaign structure

| Level | Setting | Value |
|-------|---------|-------|
| **Campaign** | Objective | **Leads** (then optimize as noted below) |
| | Budget | Campaign budget optimization OFF (set at ad-set level while learning) |
| **Ad set** | Conversion location | **Website** |
| | Optimization event | Start on **Landing page views**. After ~30–50 form submits, switch to the **Lead** event (the site already fires `fbq('track','Lead')`). |
| | Daily budget | **$25/day** to start (Ohio equestrian audience is small; this covers it). |
| | Schedule | Run 7 days, then judge on **cost per application**, not clicks. |
| **Ad** | Format | 1 short video + 2 single images (test all three). |
| | CTA button | **Apply Now** |
| | Destination URL | `https://YOUR-LIVE-URL` ← swap in after deploy |

> Why "Landing page views" first: a brand-new pixel has no Lead history, so Meta
> can't optimize for Leads until it has data. Start on LPV, then graduate.

---

## 2. Audience

**Location:** State of **Ohio** — "People living in this location."

**Age:** 30–65+   **Gender:** All (audience skews female, but don't exclude).

**Detailed targeting** — add these interests so it lands on horse people:
`Equestrianism` · `Horse` · `Equestrian facility` · `Horseback riding` ·
`Stable (horse)` · `Dressage` · `Show jumping` · `Hunter (equestrian)` ·
`Trail riding` · `Pony`

**Narrow further (recommended):** add an AND layer →
**Behaviors → Small business owners** (or `Facebook Page admins`). This pushes
toward *owners*, not just riders.

**Turn OFF Advantage detailed-targeting expansion** at first — the niche is the
point; don't let Meta widen it past Ohio horse people while learning.

---

## 3. Ad copy (3 primary-text variants — test them against each other)

**Variant A — the pain**
> You're full of lessons. The barn's always busy. So why is there never any
> money left at the end of the month?
>
> We partner with a handful of Ohio barns each year and put our time, expertise,
> and capital behind the ones we work with — to rebuild how the barn actually
> makes money. No cost to apply. Takes about 3 minutes.
>
> 👉 Apply to be considered.

**Variant B — the offer**
> Now casting Ohio barns. 🐴
>
> We're choosing a small number of barns and riding schools to partner with —
> investing our own time, operators, and capital to help them grow. If you've
> been doing the work of five people and still aren't getting paid like an owner,
> this is for you.
>
> Apply in 3 minutes — estimates are fine.

**Variant C — the story**
> Most barns aren't broken. They're just running blind.
>
> Beautiful horses, great instructors, owners working 80-hour weeks — and somehow
> still losing money. The riding is almost never the problem. The business around
> it is. We fix that, and for the right barns we back it with real capital.
>
> A few Ohio barns. Apply to be one of them.

**Headlines (test):**
- Now Casting Ohio Barns
- Your Barn, Rebuilt From the Ground Up
- We Back Ohio Barns — Apply to Be Considered

**Description (under headline):** `Time, expertise & capital for a few Ohio barns. ~3 min to apply.`

---

## 4. Creative direction

- **Best performer is usually video.** A 15–30s clip: golden-hour barn aisle, a
  horse's eye, an owner doing chores at dusk — text overlay: *"Full barn. Empty
  bank account?"* → *"We back Ohio barns."* → *"Apply."*
- **Static images:** (1) a clean barn aisle / horse portrait, (2) a bold
  text-on-photo card with the headline. Avoid stocky corporate vibes — real,
  warm, rural.
- Square (1:1) and vertical (4:5 / 9:16 for Reels & Stories).

---

## 5. The Pixel (do this before spending)

The site already fires a **Lead** event on submit — but only if your Pixel is
installed. Paste your Meta Pixel base code into `index.html` just before
`</head>`:

```html
<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s){/* ... Meta's standard pixel snippet ... */}();
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

Then in Events Manager, create a **custom conversion / standard event = Lead**
so you can optimize and measure cost-per-application. (Ask me and I'll wire the
exact snippet in once you give me the Pixel ID.)

---

## 6. Reading results

- The metric that matters is **cost per application**, found in Ads Manager once
  the Lead event fires (or count rows in Supabase ÷ spend).
- Applications themselves land in **Supabase → Table Editor → applications**,
  newest first. Export to CSV anytime.
