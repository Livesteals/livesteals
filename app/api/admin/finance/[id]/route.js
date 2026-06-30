import { supabase } from '../../../../../lib/supabase'
import { isAdmin } from '../../../../../lib/auth'
import { logActivity } from '../../../../../lib/activity'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { data: existing } = await supabase
    .from('finance_entries')
    .select('entry_type, amount')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('finance_entries').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (existing) {
    logActivity(
      'finance_deleted',
      `Deleted ${existing.entry_type} entry — $${Number(existing.amount).toFixed(2)}`,
      { amount: Number(existing.amount) }
    )
  }

  return NextResponse.json({ success: true })
}
