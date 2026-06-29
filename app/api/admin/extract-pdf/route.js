import { isAdmin } from '../../../../lib/auth'
import { pickCode } from '../../../../lib/extractCode'
import { NextResponse } from 'next/server'

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const { text } = await pdfParse(buffer)
    const code = pickCode(text)
    return NextResponse.json({ code })
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Could not read PDF' }, { status: 500 })
  }
}
