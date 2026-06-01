-- ============================================================
--  BARN RESCUE — Application table (managed via migration)
--  Mirrors supabase-schema.sql; applied with `supabase db push`.
-- ============================================================

create table if not exists public.applications (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  -- contact
  full_name             text not null,
  email                 text not null,
  phone                 text,

  -- barn basics
  barn_name             text,
  city                  text,
  state                 text default 'OH',

  -- the numbers (simplified blueprint — first half)
  num_stalls            integer,
  monthly_revenue       numeric,
  avg_lesson_price      numeric,
  owner_monthly_income  numeric,

  -- payroll (first half of blueprint)
  num_instructors       integer,
  num_support_staff     integer,
  monthly_payroll       numeric,

  -- qualifying / "why"
  biggest_struggle      text,
  goals                 text,

  -- meta
  source                text default 'facebook'
);

-- Lock the table down: applicants can WRITE but never READ each other's data.
alter table public.applications enable row level security;

drop policy if exists "anon can insert applications" on public.applications;
create policy "anon can insert applications"
  on public.applications
  for insert
  to anon
  with check (true);

-- Index for sorting newest-first in the dashboard.
create index if not exists applications_created_at_idx
  on public.applications (created_at desc);
