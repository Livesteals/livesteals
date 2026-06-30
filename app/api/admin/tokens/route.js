import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
import { logActivity } from '../../../../lib/activity'
import { NextResponse } from 'next/server'

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { quantity, batchLabel } = await request.json()
  const qty = Number(quantity)

  if (!qty || qty < 1 || qty > 200) {
    return NextResponse.json({ error: 'Quantity must be between 1 and 200' }, { status: 400 })
  }

  // Each label locks one available gift-card code (status unused -> unclaimed).
  const { data, error } = await supabase.rpc('generate_labels', {
    p_qty: qty,
    p_batch: batchLabel || null,
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('not_enough_codes')) {
      const available = msg.split('not_enough_codes:')[1]?.trim() || '0'
      return NextResponse.json(
        { error: `Not enough codes available. You have ${available} — add more codes in Add Codes, or generate fewer cards.` },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  logActivity(
    'labels_generated',
    `Generated ${qty} claim label${qty !== 1 ? 's' : ''}${batchLabel ? ` — ${batchLabel}` : ''}`,
    { meta: { count: qty, batch: batchLabel || null } }
  )

  return NextResponse.json({ tokens: data })
}
