import { supabase } from '../../../../lib/supabase'
import { isAdmin } from '../../../../lib/auth'
import { sendClaimEmail } from '../../../../lib/email'
import { NextResponse } from 'next/server'

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tokenId } = await request.json()

  const { data, error } = await supabase
    .from('tokens')
    .select('email, status, codes(code)')
    .eq('id', tokenId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 })
  }

  if (data.status !== 'claimed') {
    return NextResponse.json({ error: 'Token not yet claimed' }, { status: 400 })
  }

  await sendClaimEmail(data.email, data.codes.code)
  return NextResponse.json({ success: true })
}
