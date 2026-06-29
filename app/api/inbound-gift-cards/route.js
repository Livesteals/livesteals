import { supabase } from '../../../lib/supabase'
import { NextResponse } from 'next/server'

const CODE_REGEX = /\b[A-Z0-9]{3,8}-[A-Z0-9]{3,8}-[A-Z0-9]{3,8}\b/gi

function extractCodesFromText(text) {
  const matches = text.match(CODE_REGEX) || []
  // Prefer matches with letters — pure-digit groups are usually order/serial numbers, not claim codes.
  return matches.filter(m => /[A-Z]/i.test(m)).map(m => m.toUpperCase())
}

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('token') !== process.env.POSTMARK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await request.json()
  const attachments = payload.Attachments || []

  const pdfParse = (await import('pdf-parse')).default
  const foundCodes = new Set()

  for (const att of attachments) {
    if (att.ContentType !== 'application/pdf') continue
    try {
      const buffer = Buffer.from(att.Content, 'base64')
      const { text } = await pdfParse(buffer)
      extractCodesFromText(text).forEach(code => foundCodes.add(code))
    } catch {
      // skip unreadable attachment
    }
  }

  if (foundCodes.size === 0) {
    return NextResponse.json({ added: 0 })
  }

  const rows = [...foundCodes].map(code => ({ code }))
  const { data, error } = await supabase
    .from('codes')
    .upsert(rows, { onConflict: 'code', ignoreDuplicates: true })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ added: data?.length ?? 0 })
}
