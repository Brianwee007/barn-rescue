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
  SUPABASE_URL: "https://cmmlyvyohfoderlbkiuq.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbWx5dnlvaGZvZGVybGJraXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjk0MTIsImV4cCI6MjA5NTkwNTQxMn0.B8n8RE2QRd314GD__usqCKdIEJwLi6Vk0c-NEvLqT1E",

  // Must match the table name in supabase-schema.sql
  TABLE: "applications",
};
