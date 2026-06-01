# Barn Rescue — Meta (Facebook/Instagram) Ad Campaign · Ohio

Casting call for a **new TV/documentary series**. We film a few **Ohio barns**,
rebuild the business on camera using **Horse-First Profit Architecture**, compensate
owners for their time, and hand them a free book on the method. The ad's job: make
people *want to be on the show* and apply — or grab the free book and warm up.

**Angle:** be on film · get compensated · get your business fixed · have fun.
**Destination:** **https://apply.barn-rescue.com**

---

## 0. GO-LIVE CHECKLIST (do these, in order)

These last three steps cost money or go live, so they're yours to pull the trigger on:

1. **[ ] Deploy the site.** Push to GitHub → Railway auto-deploys (see `README.md`).
   Confirm **https://apply.barn-rescue.com** loads, the photos show, the **free book
   downloads**, and a test application lands in Supabase.
2. **[ ] (Optional) Install the Meta Pixel.** Paste your Pixel snippet just before
   `</head>` in `index.html`. The site already fires a **Lead** event on submit, so
   the campaign can optimize for applications once the pixel is live.
3. **[ ] Launch the campaign** below, **$25/day**, Ohio, and watch **cost per application**.

Everything else (the site, the book, the funnel, the share image) is built and ready.

---

## 1. Campaign structure

| Level | Setting | Value |
|-------|---------|-------|
| **Campaign** | Objective | **Leads** |
| | Budget | CBO off while learning (set at ad-set level) |
| **Ad set** | Conversion location | **Website** |
| | Optimization event | Start on **Landing page views**. After ~30–50 applications, switch to the **Lead** event (the site fires `fbq('track','Lead')`). |
| | Daily budget | **$25/day** to start (niche Ohio audience — this covers it). |
| | Schedule | Run 7 days, judge on **cost per application**. |
| **Ad** | Format | 1 short casting-style video + 2–3 single images. |
| | CTA button | **Apply Now** (or **Download** for the book ad) |
| | Destination URL | `https://apply.barn-rescue.com` |

---

## 2. Audience

**Location:** State of **Ohio** — "People living in this location."
**Age:** 30–65+   **Gender:** All (skews female; don't exclude).

**Detailed targeting** interests:
`Equestrianism` · `Horse` · `Equestrian facility` · `Horseback riding` ·
`Stable (horse)` · `Dressage` · `Show jumping` · `Hunter (equestrian)` ·
`Trail riding` · `Pony`

**Narrow (recommended):** AND layer → **Behaviors → Small business owners**
(or `Facebook Page admins`) so it favors *owners*, not just riders.

**Turn OFF Advantage detailed-targeting expansion** while learning — keep it on
Ohio horse people.

---

## 3. Ad copy (test these against each other)

**Variant A — the casting call**
> 📺 NOW CASTING: Ohio barns for a new TV series.
>
> We're filming a handful of barns and riding schools — and rebuilding the
> business on camera with you. You get the spotlight, a real turnaround, and
> you're **compensated for your time on film**.
>
> If your barn is full of lessons but never full of money, this is your shot.
> Apply in 3 minutes 👇

**Variant B — be the story**
> Your barn could be the next episode. 🐴🎬
>
> Barn Rescue is casting Ohio barns to film this season. Our team comes in,
> tells your story, and rebuilds how your barn actually makes money — on camera.
> You're paid for your time as a contributor and you keep every system we build.
>
> Beautiful barns deserve a comeback worth filming. Apply to be considered.

**Variant C — the fun + the fix**
> Cameras. A crew that actually gets barns. And finally, real momentum.
>
> We're filming a few Ohio barns for Barn Rescue — rebuilding the business,
> having a blast doing it, and paying owners for their time on film. You've been
> grinding alone long enough. Let's make your turnaround the story.
>
> 3-minute application. No cost. 👇

**Variant D — the free book (top-of-funnel / warm-up)**
> Free for Ohio barn owners: *Horse-First Profit Architecture for Riding Schools.* 📖🐴
>
> Written by Brian Wee — CFP, EA, and the operator who rebuilds barns on our new
> series, Barn Rescue. It's the whole method: how a riding school can put horses
> **first** and finally turn a profit, because each one depends on the other.
>
> Grab the book free (no strings) — and if it lights something up, apply to be on
> the show. 👇

**Headlines (test):**
- Now Casting Ohio Barns — Be On The Show
- Get Filmed. Get Paid. Get Your Barn Fixed.
- Your Barn's Comeback, On Camera
- Free Book: Horse-First Profit Architecture (Ohio barns)

**Description:** `A new series. We film it, rebuild your business & pay you for your time. Free book inside. ~3 min to apply.`

---

## 4. Creative direction

- **Lead with casting-call energy.** A 15–30s vertical video works best:
  fast cuts of a barn at golden hour, an owner mid-chores, a camera rig, text
  overlays — *"We're casting Ohio barns."* → *"Get filmed. Get paid."* →
  *"Get your business rebuilt."* → *"Apply to be on the show."*
- **Use Ed's reel energy** — premium, cinematic, character-led (BBC/Discovery/
  ITV/CNN/PBS pedigree). A 15s teaser cut from the reel makes a strong video ad.
- **Static images (already on the site, ready to reuse):**
  - `images/hero.jpg` — horseman + two horses on the dunes (the share image too).
  - `images/lesson.jpg` — instructor + child on a lesson horse (warm, relatable).
  - `images/ebook-cover.jpg` — the book cover, for Variant D.
  - `images/family.jpg`, `images/jump1.jpg`, `images/teaching.jpg` — strong supporting frames.
  Add a bold **"NOW CASTING · OHIO"** overlay on one, and a text card:
  *"Get filmed. Get paid. Get your barn fixed."*
- Square (1:1) and vertical (4:5 / 9:16 for Reels & Stories). Real and rural,
  not stocky/corporate.

> ⚠️ Compliance: keep compensation language honest and non-specific in the ad
> ("compensated for your time on film"). Nail down exact terms with selected
> contributors via a release/agreement, not in the ad copy.

---

## 5. The share preview (already set)

The site now has an Open Graph image (`images/og.jpg`, 1200×630) and OG title/
description, so when the link is shared or used in an ad the preview looks premium.
Nothing to do here unless you want to swap the image.

---

## 6. The Pixel (do before spending, optional but recommended)

The site fires a **Lead** event on submit — but only if your Pixel is installed.
Give me your **Pixel ID** and I'll drop the snippet into `index.html`; then create a
**Lead** custom conversion in Events Manager so you can optimize and measure
cost-per-application.

---

## 7. Reading results

- The metric that matters is **cost per application** (Ads Manager once the Lead
  event fires, or Supabase row count ÷ spend).
- Applications land in **Supabase → Table Editor → applications** (and hit your
  inbox once the email pipeline's app password is set). Export to CSV anytime.
- If you run Variant D (the book), also watch **book downloads → applications** as a
  softer second funnel; book-grabbers are warm leads to follow up with.
