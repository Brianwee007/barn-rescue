/* ============================================================
   BARN RESCUE — app.js
   Multi-step funnel + Supabase submit.
   ============================================================ */

(function () {
  "use strict";

  const cfg = window.BARN_RESCUE_CONFIG || {};
  const form = document.getElementById("apply-form");
  const steps = Array.from(document.querySelectorAll(".step"));
  const progressSteps = Array.from(document.querySelectorAll(".progress-step"));
  const successEl = document.getElementById("success");
  const errorEl = document.getElementById("form-error");
  const submitBtn = document.getElementById("submit-btn");

  let current = 1;

  /* ---------- Supabase client ---------- */
  let supabase = null;
  try {
    if (window.supabase && cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("YOUR-")) {
      supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    }
  } catch (e) {
    console.error("Supabase init failed:", e);
  }

  /* ---------- step navigation ---------- */
  function showStep(n) {
    steps.forEach((s) => s.classList.toggle("active", Number(s.dataset.step) === n));
    progressSteps.forEach((p) => {
      const step = Number(p.dataset.step);
      p.classList.toggle("active", step === n);
      p.classList.toggle("done", step < n);
    });
    current = n;
    // scroll the apply section into view on mobile
    document.getElementById("apply").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Required fields per step (step 1 only — the rest are estimate-friendly)
  const required = {
    1: ["full_name", "email"],
  };

  function validateStep(n) {
    let ok = true;
    (required[n] || []).forEach((name) => {
      const input = form.elements[name];
      const field = input.closest(".field");
      const valid = input.value.trim() !== "" && (input.type !== "email" || /\S+@\S+\.\S+/.test(input.value));
      field.classList.toggle("invalid", !valid);
      if (!valid && ok) input.focus();
      if (!valid) ok = false;
    });
    return ok;
  }

  document.querySelectorAll(".next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = Number(btn.dataset.next);
      if (validateStep(current)) showStep(target);
    });
  });

  document.querySelectorAll(".back").forEach((btn) => {
    btn.addEventListener("click", () => showStep(Number(btn.dataset.back)));
  });

  /* ---------- helpers ---------- */
  function num(v) {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  function str(v) {
    return v && v.trim() !== "" ? v.trim() : null;
  }

  function collect() {
    const f = form.elements;
    return {
      full_name: str(f.full_name.value),
      email: str(f.email.value),
      phone: str(f.phone.value),
      barn_name: str(f.barn_name.value),
      city: str(f.city.value),
      state: str(f.state.value) || "OH",
      num_stalls: num(f.num_stalls.value),
      monthly_revenue: num(f.monthly_revenue.value),
      avg_lesson_price: num(f.avg_lesson_price.value),
      owner_monthly_income: num(f.owner_monthly_income.value),
      num_instructors: num(f.num_instructors.value),
      num_support_staff: num(f.num_support_staff.value),
      monthly_payroll: num(f.monthly_payroll.value),
      biggest_struggle: str(f.biggest_struggle.value),
      goals: str(f.goals.value),
      source: "facebook",
    };
  }

  /* ---------- submit ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    if (!validateStep(1)) {
      showStep(1);
      return;
    }

    const payload = collect();
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    try {
      if (!supabase) {
        throw new Error(
          "Supabase isn't configured yet. Add your project URL and anon key to config.js."
        );
      }

      const { error } = await supabase.from(cfg.TABLE || "applications").insert(payload);
      if (error) throw error;

      form.hidden = true;
      document.getElementById("progress").hidden = true;
      successEl.hidden = false;
      successEl.scrollIntoView({ behavior: "smooth", block: "center" });

      // Optional: fire a Facebook Pixel "Lead" event if the pixel is installed.
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", { content_name: "Barn Rescue Application" });
      }
    } catch (err) {
      console.error(err);
      errorEl.textContent =
        "Something went wrong submitting your application. Please try again — if it keeps happening, email us directly.";
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit application";
    }
  });

  /* ---------- scroll reveals ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".reveal-up").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal-up").forEach((el) => el.classList.add("in"));
  }
})();
