-- ============================================================
-- Codes lifecycle migration
-- Bind a gift-card code to each claim label at GENERATION time.
--
--   Add codes        -> 'unused'     (Available)
--   Generate labels  -> 'unclaimed'  (a code is locked to each printed card)
--   Someone claims    -> 'claimed'    (redeemed)
--
-- Run this ENTIRE file once in the Supabase SQL Editor.
-- It is safe to run more than once.
-- ============================================================

-- 1. Allow a code to sit in the new 'unclaimed' (locked to a printed label) state.
ALTER TABLE codes DROP CONSTRAINT IF EXISTS codes_status_check;
ALTER TABLE codes ADD CONSTRAINT codes_status_check
  CHECK (status IN ('unused', 'unclaimed', 'claimed'));

-- 2. Generating labels now locks one available code per label, atomically.
--    Raises 'not_enough_codes:<N>' if there aren't enough available codes.
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

-- 3. Claiming now uses the code already bound to the label.
--    Falls back to picking an available code for any legacy label
--    that was generated before codes were bound at print time.
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
    -- new model: the code was locked to this label at generation time
    SELECT * INTO v_code FROM codes WHERE id = v_token.code_id FOR UPDATE;
  ELSE
    -- legacy label: pull any still-available code
    SELECT * INTO v_code FROM codes
    WHERE status = 'unused' ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED;
  END IF;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'no_codes_available';
    RETURN;
  END IF;

  UPDATE codes SET status = 'claimed' WHERE id = v_code.id;
  UPDATE tokens SET status = 'claimed', email = p_email, code_id = v_code.id, claimed_at = NOW()
  WHERE id = v_token.id;

  RETURN QUERY SELECT true, v_code.code, 'success';
END;
$$;

-- 4. Backfill: bind already-printed labels (status 'unclaimed', no code yet)
--    to the codes currently sitting 'unused', oldest-to-oldest. This makes the
--    dashboard reflect reality for cards you printed before this change.
WITH unbound_tokens AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
  FROM tokens
  WHERE status = 'unclaimed' AND code_id IS NULL
),
free_codes AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
  FROM codes
  WHERE status = 'unused'
),
pairs AS (
  SELECT ut.id AS token_id, fc.id AS code_id
  FROM unbound_tokens ut
  JOIN free_codes fc ON ut.rn = fc.rn
),
bind_codes AS (
  UPDATE codes SET status = 'unclaimed'
  WHERE id IN (SELECT code_id FROM pairs)
  RETURNING id
)
UPDATE tokens t SET code_id = p.code_id
FROM pairs p
WHERE t.id = p.token_id;
