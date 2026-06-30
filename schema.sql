-- Run this entire file in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Code lifecycle:
--   'unused'    -> Available (entered, in inventory)
--   'unclaimed' -> locked to a printed label, awaiting redemption
--   'claimed'   -> redeemed
CREATE TABLE IF NOT EXISTS codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'unused' CHECK (status IN ('unused', 'unclaimed', 'claimed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  batch_label TEXT,
  status TEXT DEFAULT 'unclaimed' CHECK (status IN ('unclaimed', 'claimed', 'expired')),
  code_id UUID REFERENCES codes(id),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS tokens_token_idx ON tokens(token);
CREATE INDEX IF NOT EXISTS codes_status_idx ON codes(status);

-- Generate N claim labels, locking one available code to each (unused -> unclaimed).
-- Raises 'not_enough_codes:<available>' if there aren't enough available codes.
CREATE OR REPLACE FUNCTION generate_labels(p_qty INT, p_batch TEXT)
RETURNS TABLE(id UUID, token TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_available INT;
BEGIN
  SELECT COUNT(*) INTO v_available FROM codes WHERE status = 'unused';
  IF v_available < p_qty THEN
    RAISE EXCEPTION 'not_enough_codes:%', v_available;
  END IF;

  RETURN QUERY
  WITH picked AS (
    SELECT c.id
    FROM codes c
    WHERE c.status = 'unused'
    ORDER BY c.created_at
    LIMIT p_qty
    FOR UPDATE SKIP LOCKED
  ),
  bound AS (
    UPDATE codes
    SET status = 'unclaimed'
    WHERE codes.id IN (SELECT picked.id FROM picked)
    RETURNING codes.id
  ),
  created AS (
    INSERT INTO tokens (token, batch_label, status, code_id)
    SELECT replace(gen_random_uuid()::text, '-', ''), p_batch, 'unclaimed', bound.id
    FROM bound
    RETURNING tokens.id, tokens.token
  )
  SELECT created.id, created.token FROM created;
END;
$$;

-- Atomic claim — uses the code already locked to the label at generation time,
-- falling back to any available code for legacy labels with no bound code.
CREATE OR REPLACE FUNCTION claim_token(p_token TEXT, p_email TEXT)
RETURNS TABLE(success BOOLEAN, code TEXT, error_message TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_token tokens%ROWTYPE;
  v_code codes%ROWTYPE;
BEGIN
  SELECT * INTO v_token FROM tokens WHERE token = p_token FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'invalid_token';
    RETURN;
  END IF;

  IF v_token.status = 'claimed' THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'already_claimed';
    RETURN;
  END IF;

  IF v_token.expires_at < NOW() THEN
    UPDATE tokens SET status = 'expired' WHERE id = v_token.id;
    RETURN QUERY SELECT false, NULL::TEXT, 'expired';
    RETURN;
  END IF;

  IF v_token.code_id IS NOT NULL THEN
    SELECT * INTO v_code FROM codes WHERE id = v_token.code_id FOR UPDATE;
  ELSE
    SELECT * INTO v_code FROM codes WHERE status = 'unused' ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED;
  END IF;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'no_codes_available';
    RETURN;
  END IF;

  UPDATE codes SET status = 'claimed' WHERE id = v_code.id;
  UPDATE tokens SET status = 'claimed', email = p_email, code_id = v_code.id, claimed_at = NOW() WHERE id = v_token.id;

  RETURN QUERY SELECT true, v_code.code, 'success';
END;
$$;

-- Finance tracking: revenue, estimated earnings, expenses, and payouts
CREATE TABLE IF NOT EXISTS finance_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('revenue', 'earnings', 'expense', 'payout')),
  category TEXT,
  amount NUMERIC NOT NULL,
  note TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS finance_entries_type_idx ON finance_entries(entry_type);
CREATE INDEX IF NOT EXISTS finance_entries_date_idx ON finance_entries(entry_date);
