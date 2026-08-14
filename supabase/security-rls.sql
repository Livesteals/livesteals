-- ============================================================
-- Security hardening — run this ENTIRE file once in the Supabase SQL Editor.
-- Safe to run more than once.
--
-- What it does:
--   1. Turns on Row Level Security for every table, with NO public policies.
--      All app access goes through the service-role key (server-side only),
--      which bypasses RLS — so the app keeps working exactly as before.
--      But if the anon/public key is ever exposed to the browser, the public
--      REST API gets ZERO access to gift-card codes, tokens, emails, or money.
--   2. Creates the auth_attempts table used to rate-limit admin logins.
-- ============================================================

-- 1. Lock down every data table. No policies == no anon/public access.
ALTER TABLE public.codes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log    ENABLE ROW LEVEL SECURITY;

-- Belt-and-suspenders: revoke the default table grants the anon/authenticated
-- roles get, so even a future "temporary" policy can't accidentally leak these.
REVOKE ALL ON public.codes           FROM anon, authenticated;
REVOKE ALL ON public.tokens          FROM anon, authenticated;
REVOKE ALL ON public.finance_entries FROM anon, authenticated;
REVOKE ALL ON public.activity_log    FROM anon, authenticated;

-- 2. Rate-limit store for admin login attempts (one row per failed attempt).
CREATE TABLE IF NOT EXISTS public.auth_attempts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip         TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS auth_attempts_ip_time_idx
  ON public.auth_attempts (ip, created_at DESC);

ALTER TABLE public.auth_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.auth_attempts FROM anon, authenticated;
