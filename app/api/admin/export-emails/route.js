import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Everyone who has actually claimed a card has an email on file.
  const { data, error } = await supabase
    .from('tokens')
    .select('email, claimed_at, batch_label, codes(code)')
    .eq('status', 'claimed')
    .not('email', 'is', null)
    .order('claimed_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rows: data })
}
