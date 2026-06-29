import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { quantity, batchLabel } = await request.json()
  const qty = Number(quantity)

  if (!qty || qty < 1 || qty > 200) {
    return NextResponse.json({ error: 'Quantity must be between 1 and 200' }, { status: 400 })
  }

  const rows = Array.from({ length: qty }, () => ({
    token: randomUUID().replace(/-/g, ''),
    batch_label: batchLabel || null,
  }))

  const { data, error } = await supabase.from('tokens').insert(rows).select('id, token')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ tokens: data })
}
