// ============================================================
//  CONFIG — paste your Supabase project values here.
//  Find them in Supabase → Project Settings → API.
//
//  The ANON key is SAFE to expose publicly. That's its job.
//  Your table is protected by Row Level Security (insert-only),
//  so visitors can submit applications but cannot read anyone's
//  data. Never put the SERVICE ROLE key here.
// ============================================================

window.BARN_RESCUE_CONFIG = {
  SUPABASE_URL: "https://YOUR-PROJECT-ref.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-ANON-PUBLIC-KEY",

  // Must match the table name in supabase-schema.sql
  TABLE: "applications",
};
