import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendClaimEmail(to, code) {
  const { data, error } = await resend.emails.send({
    // TEMP smoke test: onboarding@resend.dev works without domain verification,
    // but only delivers to the Resend account owner's email. Revert to
    // process.env.EMAIL_FROM once livesteals.co is verified.
    from: 'LIVE STEALS <onboarding@resend.dev>',
    to,
    subject: 'Your $5 Amazon Gift Card — LIVE STEALS',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
        <div style="max-width:480px;margin:40px auto;padding:0 20px;">

          <div style="text-align:center;margin-bottom:32px;">
            <p style="color:#f5a623;font-size:11px;letter-spacing:4px;font-weight:bold;margin:0 0 8px;text-transform:uppercase;">Live Steals</p>
            <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:bold;">Your $5 Amazon Gift Card</h1>
          </div>

          <div style="background:#141414;border:1px solid #2a2a2a;border-radius:12px;padding:32px;text-align:center;margin-bottom:24px;">
            <p style="color:#555;font-size:10px;text-transform:uppercase;letter-spacing:3px;margin:0 0 12px;">Your Code</p>
            <p style="color:#f5a623;font-size:30px;font-weight:bold;letter-spacing:4px;font-family:monospace;margin:0 0 24px;">${code}</p>
            <a href="https://www.amazon.com/gc/redeem"
               style="display:inline-block;background:#f5a623;color:#000000;text-decoration:none;padding:13px 36px;border-radius:8px;font-weight:bold;font-size:15px;">
              Redeem on Amazon
            </a>
          </div>

          <div style="text-align:center;color:#444;font-size:13px;line-height:1.6;">
            <p style="margin:0 0 8px;">To redeem manually, visit <strong style="color:#666;">amazon.com/gc/redeem</strong> and enter the code above.</p>
            <p style="margin:0;">Thanks for joining a LIVE STEALS stream!</p>
          </div>

          <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #1a1a1a;">
            <p style="color:#2a2a2a;font-size:11px;margin:0;">livesteals.co</p>
          </div>

        </div>
      </body>
      </html>
    `,
  })

  if (error) {
    // Resend returns errors in the response body rather than throwing.
    const message = typeof error === 'string' ? error : error.message || JSON.stringify(error)
    throw new Error(`Resend: ${message}`)
  }

  return data
}
