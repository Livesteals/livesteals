-- Activity log: records every change across the admin (codes added, labels
-- generated, claims redeemed, finance entries added/deleted).
-- Run this once in the Supabase SQL editor.

create table if not exists public.activity_log (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,
  description text not null,
  amount      numeric,
  meta        jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists activity_log_created_at_idx
  on public.activity_log (created_at desc);

-- Writes happen via the service-role key (server-side only), so RLS can stay on
-- with no public policies — the anon/public role gets no access.
alter table public.activity_log enable row level security;
