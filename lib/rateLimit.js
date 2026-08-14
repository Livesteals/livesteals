import { supabase } from './supabase'

// Admin-login rate limiting, backed by the auth_attempts table so it holds up
// across serverless instances (in-memory counters would reset on every cold
// start and wouldn't be shared between concurrent lambdas).
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_FAILURES = 8 // failed attempts per IP per window before lockout

export function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

// Returns { allowed, retryAfterSec }. Call BEFORE checking the password.
export async function checkLoginRate(ip) {
  const since = new Date(Date.now() - WINDOW_MS).toISOString()
  try {
    const { count } = await supabase
      .from('auth_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('created_at', since)

    if ((count ?? 0) >= MAX_FAILURES) {
      return { allowed: false, retryAfterSec: Math.ceil(WINDOW_MS / 1000) }
    }
  } catch {
    // If the limiter store is unreachable, fail OPEN so admins aren't locked
    // out by an infra blip — the password check still gates access.
  }
  return { allowed: true, retryAfterSec: 0 }
}

// Record a failed attempt and opportunistically prune this IP's old rows.
export async function recordFailure(ip) {
  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString()
  try {
    await supabase.from('auth_attempts').insert({ ip })
    await supabase.from('auth_attempts').delete().eq('ip', ip).lt('created_at', cutoff)
  } catch {
    // best-effort
  }
}

// Clear an IP's failures after a successful login.
export async function clearFailures(ip) {
  try {
    await supabase.from('auth_attempts').delete().eq('ip', ip)
  } catch {
    // best-effort
  }
}
