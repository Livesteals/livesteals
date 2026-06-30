import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [codesRes, tokensRes] = await Promise.all([
    supabase.from('codes').select('status'),
    supabase.from('tokens').select('status'),
  ])

  const codes = codesRes.data || []
  const tokens = tokensRes.data || []

  return NextResponse.json({
    codes: {
      total: codes.length,
      available: codes.filter(c => c.status === 'unused').length,
      unclaimed: codes.filter(c => c.status === 'unclaimed').length,
      claimed: codes.filter(c => c.status === 'claimed').length,
    },
    tokens: {
      total: tokens.length,
      unclaimed: tokens.filter(t => t.status === 'unclaimed').length,
      claimed: tokens.filter(t => t.status === 'claimed').length,
    },
  })
}
