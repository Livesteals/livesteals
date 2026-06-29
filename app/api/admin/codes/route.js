import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
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

  return NextResponse.json({ added: data?.length ?? 0 })
}
