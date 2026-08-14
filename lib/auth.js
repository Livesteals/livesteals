import crypto from 'crypto'

// Signing key for the admin session cookie. Prefer a dedicated secret; fall
// back to the admin password so the app still works if it isn't set yet.
// Set ADMIN_SESSION_SECRET (a long random string) in production.
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''

export const SESSION_COOKIE = 'ls_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

// Constant-time string comparison — avoids leaking the secret via timing.
function safeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !password) return false
  return safeEqual(password, expected)
}

function sign(payload) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')
}

// A session token is `<base64url(JSON{exp})>.<hmac>` — stateless and tamper-proof.
export function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !SESSION_SECRET) return false
  const [payload, mac] = token.split('.')
  if (!payload || !mac) return false
  if (!safeEqual(mac, sign(payload))) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  }
}

export function isAdmin(request) {
  const token = request.cookies?.get(SESSION_COOKIE)?.value
  return verifySessionToken(token)
}
