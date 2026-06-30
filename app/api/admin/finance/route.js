import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
import { logActivity } from '../../../../lib/activity'
import { NextResponse } from 'next/server'

const TYPE_LABELS = { revenue: 'Revenue', earnings: 'Est. earnings', expense: 'Expense', payout: 'Payout' }
const CATEGORY_LABELS = { gift_cards: 'Giftcards', items: 'Items', other: 'Other' }

export async function GET(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('finance_entries')
    .select('*')
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entries: data })
}

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { entryType, category, amount, note, entryDate } = await request.json()

  if (!['revenue', 'earnings', 'expense', 'payout'].includes(entryType)) {
    return NextResponse.json({ error: 'Invalid entry type' }, { status: 400 })
  }
  const amountNum = Number(amount)
  if (!amountNum || amountNum <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('finance_entries')
    .insert({
      entry_type: entryType,
      category: category || null,
      amount: amountNum,
      note: note || null,
      entry_date: entryDate || new Date().toISOString().slice(0, 10),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const catText = category ? ` (${CATEGORY_LABELS[category] || category})` : ''
  logActivity(
    `finance_${entryType}`,
    `Logged ${TYPE_LABELS[entryType] || entryType}${catText} — $${amountNum.toFixed(2)}`,
    { amount: amountNum, meta: { category: category || null, note: note || null } }
  )

  return NextResponse.json({ entry: data })
}
