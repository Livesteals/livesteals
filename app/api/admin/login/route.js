import { verifyPassword, createSessionToken, sessionCookieOptions, SESSION_COOKIE } from '../../../../lib/auth'
import { checkLoginRate, recordFailure, clearFailures, clientIp } from '../../../../lib/rateLimit'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const ip = clientIp(request)

  const { allowed, retryAfterSec } = await checkLoginRate(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    )
  }

  let password
  try {
    ({ password } = await request.json())
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  if (!verifyPassword(password)) {
    await recordFailure(ip)
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  await clearFailures(ip)
  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions())
  return res
}
