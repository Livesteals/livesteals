import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
import { logActivity } from '../../../../lib/activity'
import { NextResponse } from 'next/server'

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { codes } = await request.json()

  if (!Array.isArray(codes) || codes.length === 0) {
    return NextResponse.json({ error: 'No codes provided' }, { status: 400 })
  }

  const rows = codes.map(c => ({ code: c.trim() })).filter(r => r.code.length > 0)

  const { data, error } = await supabase
    .from('codes')
    .upsert(rows, { onConflict: 'code', ignoreDuplicates: true })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const added = data?.length ?? 0
  if (added > 0) {
    logActivity('codes_added', `Added ${added} gift card code${added !== 1 ? 's' : ''}`, { meta: { count: added } })
  }

  return NextResponse.json({ added })
}
