import { supabase } from '../../../lib/supabase'
import { sendClaimEmail } from '../../../lib/email'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { token, email } = await request.json()

    if (!token || !email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'invalid_input' }, { status: 400 })
    }

    const { data, error } = await supabase.rpc('claim_token', {
      p_token: token,
      p_email: email.toLowerCase().trim(),
    })

    if (error) {
      console.error('Claim RPC error:', error)
      return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
    }

    const result = data[0]

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error_message })
    }

    // Send email — don't fail the claim if email fails
    sendClaimEmail(email.toLowerCase().trim(), result.code).catch(err =>
      console.error('Email send failed:', err)
    )

    return NextResponse.json({ success: true, code: result.code })
  } catch (err) {
    console.error('Unexpected claim error:', err)
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }
}
