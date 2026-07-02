import { supabase } from '../../../lib/supabase'
import ClaimClient from './ClaimClient'

export default async function ClaimPage({ params }) {
  const { token } = await params

  const { data } = await supabase
    .from('tokens')
    .select('id, status, expires_at')
    .eq('token', token)
    .single()

  if (!data) {
    return <ErrorPage message="This claim link is not valid." />
  }

  if (data.status === 'claimed') {
    return <ErrorPage message="This gift card has already been claimed." />
  }

  if (new Date(data.expires_at) < new Date()) {
    return <ErrorPage message="This claim link has expired. Contact your seller for help." />
  }

  return <ClaimClient token={token} />
}

function ErrorPage({ message }) {
  return (
    <div className="relative min-h-dvh flex items-center justify-center p-6 bg-[#060606] text-zinc-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-dot-grid mask-radial-fade opacity-40" />
        <div className="absolute -top-32 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-red-600/15 blur-[120px]" />
      </div>
      <div className="relative w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-red-500/20 to-red-700/10 border border-red-500/30 mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient-white mb-2">Unable to Claim</h1>
        <p className="text-zinc-400 mb-8">{message}</p>
        <p className="text-zinc-700 text-xs">livesteals.co</p>
      </div>
    </div>
  )
}
