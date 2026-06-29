import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [tokensRes, codesRes] = await Promise.all([
    supabase.from('tokens').delete().not('id', 'is', null),
    supabase.from('codes').delete().not('id', 'is', null),
  ])

  if (tokensRes.error) {
    return NextResponse.json({ error: tokensRes.error.message }, { status: 500 })
  }
  if (codesRes.error) {
    return NextResponse.json({ error: codesRes.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
