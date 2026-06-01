// ============================================================
//  Barn Rescue — on-application Edge Function
//  Called by the website right after an application is inserted
//  (app.js → supabase.functions.invoke). It re-reads the real
//  row server-side with the service-role key (so the email
//  contents can't be spoofed by the caller), then sends:
//    1) a notification to the owner (GMAIL_USER)
//    2) a warm auto-reply to the applicant
//  ...both from your Google Workspace via Gmail SMTP.
//
//  Secrets you set (`supabase secrets set ...`):
//    GMAIL_USER            e.g. brian@impulsion.io
//    GMAIL_APP_PASSWORD    16-char Google App Password (NOT your login password)
//    BRAND_NAME            optional, defaults to "Barn Rescue"
//  Auto-injected by Supabase (no action needed):
//    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GMAIL_USER = Deno.env.get("GMAIL_USER")!;
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;
const BRAND = Deno.env.get("BRAND_NAME") ?? "Barn Rescue";
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const money = (v: unknown) =>
  v == null || v === "" ? "—" : "$" + Number(v).toLocaleString("en-US");
const txt = (v: unknown) => (v == null || v === "" ? "—" : String(v));

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
    if (error || !data) {
      return new Response(JSON.stringify({ error: "row not found" }), {
        status: 404,
        headers: { ...cors, "content-type": "application/json" },
      });
    }
    record = data;
  }

  if (!record?.email) {
    return new Response("No email on record", { status: 400, headers: cors });
  }

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
    },
  });

  const from = `${BRAND} <${GMAIL_USER}>`;
  const results: Record<string, string> = {};

  try {
    const o = ownerEmail(record);
    await client.send({
      from,
      to: GMAIL_USER,
      replyTo: String(record.email),
      subject: `New ${BRAND} application — ${txt(record.full_name)}`,
      content: o.text,
      html: o.html,
    });
    results.owner = "sent";

    const a = applicantEmail(record);
    await client.send({
      from,
      to: String(record.email),
      subject: `We got your ${BRAND} application`,
      content: a.text,
      html: a.html,
    });
    results.applicant = "sent";
  } catch (err) {
    console.error("send failed:", err);
    await client.close().catch(() => {});
    return new Response(JSON.stringify({ error: String(err), results }), {
      status: 500,
      headers: { ...cors, "content-type": "application/json" },
    });
  }

  await client.close().catch(() => {});
  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { ...cors, "content-type": "application/json" },
  });
});
