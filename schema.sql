-- Run this entire file in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

CREATE TABLE IF NOT EXISTS codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'unused' CHECK (status IN ('unused', 'claimed')),
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

-- Atomic claim function — prevents two people from grabbing the same code at the same time
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

  SELECT * INTO v_code FROM codes WHERE status = 'unused' ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'no_codes_available';
    RETURN;
  END IF;

  UPDATE codes SET status = 'claimed' WHERE id = v_code.id;
  UPDATE tokens SET status = 'claimed', email = p_email, code_id = v_code.id, claimed_at = NOW() WHERE id = v_token.id;

  RETURN QUERY SELECT true, v_code.code, 'success';
END;
$$;
