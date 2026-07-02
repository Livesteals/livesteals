'use client'
import { useState } from 'react'

function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-dot-grid mask-radial-fade opacity-50" />
      <div className="absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-red-600/20 blur-[130px]" />
      <div className="absolute bottom-0 right-0 h-64 w-96 rounded-full bg-amber-500/10 blur-[110px]" />
    </div>
  )
}

export default function ClaimClient({ token }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: trimmed }),
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.code)
      } else {
        const messages = {
          already_claimed: 'This gift card has already been claimed.',
          expired: 'This claim link has expired.',
          no_codes_available: 'No codes available right now. Please contact your seller.',
          invalid_token: 'This claim link is not valid.',
        }
        setError(messages[data.error] || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (result) {
    return (
      <div className="relative min-h-dvh flex items-center justify-center p-6 bg-[#060606] text-zinc-100 overflow-hidden">
        <Backdrop />

        <div className="motion-safe:animate-scale-in relative w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-emerald-400/20 to-emerald-600/10 border border-emerald-400/30 mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-gradient-white mb-2">
            Congratulations!
          </h1>
          <p className="text-zinc-500 text-sm mb-8">A copy was also sent to {email}</p>

          <div className="rounded-3xl border-beam mb-4">
            <div className="beam-content p-7">
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-4">
                Amazon Gift Card Code
              </p>
              <p className="font-mono text-2xl sm:text-3xl font-bold text-gradient-gold tracking-wider mb-7 break-all">
                {result}
              </p>
              <button
                onClick={copyCode}
                className="group cursor-pointer relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 py-3.5 text-base font-black text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent motion-safe:animate-shine" />
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          <p className="text-zinc-500 text-sm mb-6">
            Redeem at{' '}
            <a
              href="https://www.amazon.com/gc/redeem"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
            >
              amazon.com/gc/redeem
            </a>
          </p>

          <a
            href="https://www.whatnot.com/s/WZZ45wou"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer block rounded-2xl glass p-5 hover:bg-white/[0.06] transition-colors"
          >
            <p className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-sm mb-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5 2.3-7.2-6-4.6h7.6z" />
                </svg>
              ))}
            </p>
            <p className="text-zinc-300 font-bold text-sm mb-0.5">Enjoying LIVESTEALS?</p>
            <p className="text-zinc-500 text-xs">Leave us a 5-star review on Whatnot</p>
          </a>

          <p className="text-zinc-700 text-xs mt-8">livesteals.co</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-dvh flex items-center justify-center p-6 bg-[#060606] text-zinc-100 overflow-hidden">
      <Backdrop />

      <div className="motion-safe:animate-fade-up relative w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-amber-400 text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Live Steals</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-gradient-white mb-3">
            Claim Your Gift Card
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            Enter your email to receive your Amazon gift card code instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="claim-email" className="sr-only">Email address</label>
            <input
              id="claim-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-lg text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-400/70 focus:bg-white/[0.05]"
              autoComplete="email"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2 px-1" role="alert">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group cursor-pointer relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 py-4 text-lg font-black text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:hover:scale-100"
          >
            {!loading && (
              <span className="pointer-events-none absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent motion-safe:animate-shine" />
            )}
            {loading ? 'Claiming…' : 'Claim Gift Card'}
          </button>
        </form>

        <p className="text-zinc-600 text-xs text-center mt-10">livesteals.co — one claim per card</p>
      </div>
    </div>
  )
}
