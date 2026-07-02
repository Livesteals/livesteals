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
        className={className || 'cursor-pointer text-sm font-bold px-4 py-2 rounded-xl glass text-amber-400 hover:bg-white/10 transition-colors'}
      >
        {trigger || 'Claim Gift Card'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="motion-safe:animate-scale-in relative w-full max-w-sm rounded-3xl border-beam"
            onClick={e => e.stopPropagation()}
          >
            <div className="beam-content p-8">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 cursor-pointer flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <p className="text-amber-400 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">
                Live Steals
              </p>
              <h2 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
                Claim Your Gift Card
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-7">
                Enter the claim code from your card&rsquo;s envelope to continue.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="claim-code" className="sr-only">Claim code</label>
                  <input
                    id="claim-code"
                    type="text"
                    value={code}
                    onChange={e => { setCode(e.target.value); setError('') }}
                    placeholder="Claim code"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-lg text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-400/70 focus:bg-white/[0.05]"
                    autoFocus
                  />
                  {error && <p className="text-red-400 text-sm mt-2 px-1" role="alert">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="group cursor-pointer relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 py-4 text-lg font-black text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="pointer-events-none absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent motion-safe:animate-shine" />
                  Continue
                </button>
              </form>

              <p className="text-zinc-600 text-xs text-center mt-6">
                Find your code on the card mailed to you, or scan its QR code.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
