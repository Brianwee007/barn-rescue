// ============================================================
//  Barn Rescue — on-application Edge Function
//  Called by the website right after an application is inserted
//  (app.js → supabase.functions.invoke). It re-reads the real
//  row server-side with the service-role key (so the email
//  contents can't be spoofed by the caller), then sends:
//    1) a notification to the owner (OWNER_EMAIL) with ALL fields
//    2) a warm auto-reply to the applicant
//  ...over HTTPS via the Resend API (raw SMTP is blocked on the
//  Supabase edge runtime, so we don't use it).
//
//  Secrets you set (`supabase secrets set ...`):
//    RESEND_API_KEY   required — from resend.com → API Keys
//    OWNER_EMAIL      where application alerts go (defaults to GMAIL_USER if set)
//    RESEND_FROM      sender, e.g. "Barn Rescue <onboarding@resend.dev>" while you're
//                     still verifying impulsion.io; later "Barn Rescue <brian@impulsion.io>".
//                     Defaults to onboarding@resend.dev (Resend's no-setup test sender).
//    BRAND_NAME       optional, defaults to "Barn Rescue"
//  Auto-injected by Supabase (no action needed):
//    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
//  NOTE on Resend test mode: until you verify a sending domain, Resend only
//  delivers to the address you signed up with. So the OWNER alert (to you) works
//  immediately; the applicant auto-reply turns on once the domain is verified.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") ?? Deno.env.get("GMAIL_USER") ?? "";
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "Barn Rescue <onboarding@resend.dev>";
const BRAND = Deno.env.get("BRAND_NAME") ?? "Barn Rescue";
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });

const money = (v: unknown) =>
  v == null || v === "" ? "—" : "$" + Number(v).toLocaleString("en-US");
const txt = (v: unknown) => (v == null || v === "" ? "—" : String(v));

// ---- send one email via the Resend HTTP API ----
async function sendEmail(msg: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ ok: boolean; detail: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
  });
  const detail = await res.text();
  return { ok: res.ok, detail };
}

function ownerEmail(r: Record<string, unknown>) {
  const rows: [string, string][] = [
    ["Name", txt(r.full_name)],
    ["Email", txt(r.email)],
    ["Phone", txt(r.phone)],
    ["Barn", txt(r.barn_name)],
    ["Location", `${txt(r.city)}, ${txt(r.state)}`],
    ["Stalls", txt(r.num_stalls)],
    ["Avg lesson price", money(r.avg_lesson_price)],
    ["Monthly revenue", money(r.monthly_revenue)],
    ["Owner take-home / mo", money(r.owner_monthly_income)],
    ["Instructors", txt(r.num_instructors)],
    ["Support staff", txt(r.num_support_staff)],
    ["Monthly payroll", money(r.monthly_payroll)],
    ["Biggest struggle", txt(r.biggest_struggle)],
    ["Goals", txt(r.goals)],
    ["Source", txt(r.source)],
  ];
  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;max-width:620px">
      <h2 style="margin:0 0 4px">New ${BRAND} application</h2>
      <p style="color:#666;margin:0 0 16px">${txt(r.full_name)} — ${txt(r.barn_name)}</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#888;white-space:nowrap;vertical-align:top">${k}</td>
               <td style="padding:6px 10px;border-bottom:1px solid #eee">${v}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return { html, text };
}

function applicantEmail(r: Record<string, unknown>) {
  const name = (txt(r.full_name).split(" ")[0] || "there").trim();
  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;max-width:560px;line-height:1.6;color:#222">
      <p>Hi ${name},</p>
      <p>Thanks for applying to <strong>${BRAND}</strong> — we got it, and we read every
      single application ourselves.</p>
      <p>We're partnering with just a handful of Ohio barns, so we take a little time with
      each one. If your barn looks like a fit, we'll reach out personally by email to set
      up a conversation. Keep an eye on your inbox over the next few days.</p>
      <p>In the meantime, if anything important changes about your barn, just reply to this
      email — it comes straight to us.</p>
      <p>Talk soon,<br/>The ${BRAND} Team</p>
    </div>`;
  const text =
    `Hi ${name},\n\nThanks for applying to ${BRAND} — we got it, and we read every ` +
    `application ourselves.\n\nWe're partnering with just a handful of Ohio barns, so we ` +
    `take a little time with each one. If your barn looks like a fit, we'll reach out ` +
    `personally by email. Keep an eye on your inbox over the next few days.\n\n` +
    `If anything changes, just reply to this email — it comes straight to us.\n\n` +
    `Talk soon,\nThe ${BRAND} Team`;
  return { html, text };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  if (!RESEND_API_KEY) {
    return json({ error: "RESEND_API_KEY not set" }, 500);
  }

  let id: string | undefined;
  let inline: Record<string, unknown> | undefined;
  try {
    const body = await req.json();
    id = body.id;
    inline = body.record; // allows manual testing without an id
  } catch {
    return new Response("Bad request", { status: 400, headers: cors });
  }

  // Re-read the real row server-side so email contents can't be spoofed.
  let record = inline;
  if (id) {
    const admin = createClient(SB_URL, SB_SERVICE_KEY);
    const { data, error } = await admin
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return json({ error: "row not found" }, 404);
    record = data;
  }

  if (!record?.email) return json({ error: "No email on record" }, 400);

  const results: Record<string, string> = {};

  // 1) Owner notification — this is the one that must land.
  const o = ownerEmail(record);
  const ownerRes = await sendEmail({
    to: OWNER_EMAIL,
    replyTo: String(record.email),
    subject: `New ${BRAND} application — ${txt(record.full_name)}`,
    html: o.html,
    text: o.text,
  });
  if (!ownerRes.ok) {
    return json({ error: "owner email failed", detail: ownerRes.detail }, 502);
  }
  results.owner = "sent";

  // 2) Applicant auto-reply — best effort (needs a verified domain to reach
  //    arbitrary addresses; don't fail the whole request if it's not ready yet).
  const a = applicantEmail(record);
  const applicantRes = await sendEmail({
    to: String(record.email),
    subject: `We got your ${BRAND} application`,
    html: a.html,
    text: a.text,
  });
  results.applicant = applicantRes.ok
    ? "sent"
    : `skipped: ${applicantRes.detail}`;

  return json({ ok: true, results });
});
