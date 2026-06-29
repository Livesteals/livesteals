'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClaimPopup({ trigger, className }) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) {
      setError('Enter the code from your gift card envelope.')
      return
    }
    router.push(`/c/${trimmed}`)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className || 'text-sm font-bold px-4 py-2 border border-amber-400/40 hover:border-amber-400 text-amber-400 rounded-lg transition-colors'}
      >
        {trigger || 'Claim Gift Card'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Live Steals</p>
            <h2 className="text-2xl font-bold text-white mb-2">Claim Your Gift Card</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Enter the claim code from your card's envelope to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value); setError('') }}
                  placeholder="Claim code"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-white text-lg placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                  autoFocus
                />
                {error && <p className="text-red-400 text-sm mt-2 px-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-lg transition-colors"
              >
                Continue
              </button>
            </form>

            <p className="text-zinc-700 text-xs text-center mt-6">
              Find your code on the card mailed to you, or scan its QR code.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
