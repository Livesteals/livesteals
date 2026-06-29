'use client'
import { useState } from 'react'

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
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-1">Here's Your Code</h1>
          <p className="text-zinc-500 text-sm mb-8">A copy was also sent to {email}</p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Amazon Gift Card Code</p>
            <p className="text-3xl font-mono font-bold text-amber-400 tracking-wider mb-6 break-all">{result}</p>
            <button
              onClick={copyCode}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-bold text-base transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          <p className="text-zinc-600 text-sm">
            Redeem at <span className="text-zinc-400">amazon.com/gc/redeem</span>
          </p>
          <p className="text-zinc-800 text-xs mt-8">livesteals.co</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-3">LIVE STEALS</p>
          <h1 className="text-3xl font-bold mb-3">Claim Your Gift Card</h1>
          <p className="text-zinc-400 leading-relaxed">
            Enter your email to receive your Amazon gift card code instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white text-lg placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
              autoComplete="email"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2 px-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold text-lg transition-colors"
          >
            {loading ? 'Claiming...' : 'Claim Gift Card'}
          </button>
        </form>

        <p className="text-zinc-700 text-xs text-center mt-10">livesteals.co — one claim per card</p>
      </div>
    </div>
  )
}
