import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('tokens')
    .select('id, token, status, email, batch_label, created_at, claimed_at, codes(code)')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ claims: data })
}
