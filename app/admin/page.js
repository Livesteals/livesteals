'use client'
import { useState, useEffect } from 'react'

function adminFetch(url, options = {}) {
  const pw = typeof window !== 'undefined' ? localStorage.getItem('ls_pw') : ''
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': pw || '',
      ...(options.headers || {}),
    },
  })
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const [codesInput, setCodesInput] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [addResult, setAddResult] = useState(null)

  const [genQty, setGenQty] = useState(10)
  const [genBatch, setGenBatch] = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [genMessage, setGenMessage] = useState('')

  const [claims, setClaims] = useState([])
  const [claimsLoading, setClaimsLoading] = useState(false)
  const [resendingId, setResendingId] = useState(null)
  const [resendDone, setResendDone] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('ls_pw')
    if (!saved) return
    fetch('/api/admin/stats', { headers: { 'x-admin-password': saved } })
      .then(r => {
        if (r.ok) { setAuthed(true); return r.json() }
        localStorage.removeItem('ls_pw')
      })
      .then(data => { if (data) setStats(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!authed) return
    if (activeTab === 'overview') loadStats()
    if (activeTab === 'claims') loadClaims()
  }, [activeTab, authed])

  async function handleLogin(e) {
    e.preventDefault()
    setAuthError('')
    const res = await fetch('/api/admin/stats', {
      headers: { 'x-admin-password': password },
    })
    if (res.ok) {
      localStorage.setItem('ls_pw', password)
      setAuthed(true)
      setStats(await res.json())
    } else {
      setAuthError('Incorrect password.')
    }
  }

  function logout() {
    localStorage.removeItem('ls_pw')
    setAuthed(false)
    setPassword('')
    setStats(null)
  }

  async function loadStats() {
    setStatsLoading(true)
    const res = await adminFetch('/api/admin/stats')
    if (res.ok) setStats(await res.json())
    setStatsLoading(false)
  }

  async function handleAddCodes(e) {
    e.preventDefault()
    const lines = codesInput.split('\n').map(l => l.trim()).filter(Boolean)
    if (!lines.length) return
    setAddLoading(true)
    setAddResult(null)
    try {
      const res = await adminFetch('/api/admin/codes', {
        method: 'POST',
        body: JSON.stringify({ codes: lines }),
      })
      const data = await res.json()
      setAddResult(data)
      if (data.added > 0) { setCodesInput(''); loadStats() }
    } finally {
      setAddLoading(false)
    }
  }

  async function handleGenerate(e) {
    e.preventDefault()
    setGenLoading(true)
    setGenMessage('')
    try {
      const res = await adminFetch('/api/admin/tokens', {
        method: 'POST',
        body: JSON.stringify({ quantity: Number(genQty), batchLabel: genBatch }),
      })
      const data = await res.json()
      if (data.tokens) {
        setGenMessage(`Generated ${data.tokens.length} cards — building PDF...`)
        await generatePDF(data.tokens, genBatch)
        setGenMessage(`Done! ${data.tokens.length} cards downloaded.`)
        loadStats()
      } else {
        setGenMessage('Error: ' + (data.error || 'Unknown error'))
      }
    } finally {
      setGenLoading(false)
    }
  }

  async function loadClaims() {
    setClaimsLoading(true)
    const res = await adminFetch('/api/admin/claims')
    if (res.ok) { const d = await res.json(); setClaims(d.claims || []) }
    setClaimsLoading(false)
  }

  async function handleResend(id) {
    setResendingId(id)
    setResendDone(null)
    await adminFetch('/api/admin/resend-email', {
      method: 'POST',
      body: JSON.stringify({ tokenId: id }),
    })
    setResendingId(null)
    setResendDone(id)
    setTimeout(() => setResendDone(null), 3000)
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-3">LIVE STEALS</p>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-base"
              autoFocus
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-base transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-800 px-4 md:px-6 py-3.5 flex items-center justify-between shrink-0">
        <span className="text-amber-500 font-bold tracking-widest text-sm uppercase">LIVE STEALS</span>
        <button onClick={logout} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          Sign out
        </button>
      </header>

      <nav className="border-b border-zinc-800 px-4 md:px-6 flex gap-0 overflow-x-auto shrink-0">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'codes', label: 'Add Codes' },
          { key: 'generate', label: 'Generate Cards' },
          { key: 'claims', label: 'All Claims' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-6">

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Overview</h2>
              <button
                onClick={loadStats}
                disabled={statsLoading}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {statsLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {stats ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Codes Available', value: stats.codes.unused, color: 'text-green-400' },
                    { label: 'Codes Used', value: stats.codes.claimed, color: 'text-zinc-300' },
                    { label: 'Cards Unclaimed', value: stats.tokens.unclaimed, color: 'text-amber-400' },
                    { label: 'Cards Claimed', value: stats.tokens.claimed, color: 'text-zinc-300' },
                  ].map(s => (
                    <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                      <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-zinc-600 text-xs mt-1 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>

                {stats.codes.unused <= 5 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                    <p className="text-red-400 font-semibold text-sm mb-1">Low on codes</p>
                    <p className="text-red-400/60 text-sm">
                      Only {stats.codes.unused} code{stats.codes.unused !== 1 ? 's' : ''} left. Add more before your next stream.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[0,1,2,3].map(i => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 animate-pulse">
                    <div className="h-8 w-12 bg-zinc-800 rounded mb-2" />
                    <div className="h-3 w-20 bg-zinc-800 rounded" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'codes' && (
          <div className="space-y-6 max-w-lg">
            <div>
              <h2 className="text-xl font-bold mb-1">Add Gift Card Codes</h2>
              <p className="text-zinc-500 text-sm">Paste your Amazon gift card codes — one per line.</p>
            </div>
            <form onSubmit={handleAddCodes} className="space-y-4">
              <textarea
                value={codesInput}
                onChange={e => setCodesInput(e.target.value)}
                placeholder={'XXXX-XXXX-XXXX\nXXXX-XXXX-XXXX\nXXXX-XXXX-XXXX'}
                rows={12}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 font-mono text-sm resize-none transition-colors"
              />
              {addResult && (
                <p className={`text-sm ${addResult.added > 0 ? 'text-green-400' : 'text-zinc-500'}`}>
                  {addResult.added > 0
                    ? `${addResult.added} code${addResult.added !== 1 ? 's' : ''} added.`
                    : 'No new codes added (may already exist).'}
                </p>
              )}
              <button
                type="submit"
                disabled={addLoading || !codesInput.trim()}
                className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold transition-colors"
              >
                {addLoading ? 'Adding...' : 'Add Codes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="space-y-6 max-w-sm">
            <div>
              <h2 className="text-xl font-bold mb-1">Generate QR Cards</h2>
              <p className="text-zinc-500 text-sm">Creates a PDF of printable claim cards. Print on 4×6 thermal labels.</p>
            </div>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Number of Cards</label>
                <input
                  type="number"
                  value={genQty}
                  onChange={e => setGenQty(e.target.value)}
                  min={1}
                  max={200}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Batch Label <span className="text-zinc-700">optional</span>
                </label>
                <input
                  type="text"
                  value={genBatch}
                  onChange={e => setGenBatch(e.target.value)}
                  placeholder="e.g. June 28 Stream"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              {genMessage && (
                <p className={`text-sm ${genMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                  {genMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={genLoading}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold transition-colors"
              >
                {genLoading ? 'Building PDF...' : 'Generate & Download PDF'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Claims</h2>
              <button
                onClick={loadClaims}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Refresh
              </button>
            </div>

            {claimsLoading ? (
              <div className="space-y-2">
                {[0,1,2,3].map(i => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 animate-pulse">
                    <div className="h-4 w-24 bg-zinc-800 rounded mb-2" />
                    <div className="h-3 w-40 bg-zinc-800 rounded" />
                  </div>
                ))}
              </div>
            ) : claims.length === 0 ? (
              <p className="text-zinc-600 py-8 text-center">No claims yet.</p>
            ) : (
              <div className="space-y-2">
                {claims.map(claim => (
                  <div key={claim.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            claim.status === 'claimed'   ? 'bg-green-500/15 text-green-400' :
                            claim.status === 'expired'   ? 'bg-red-500/15 text-red-400' :
                                                           'bg-amber-500/15 text-amber-400'
                          }`}>
                            {claim.status}
                          </span>
                          {claim.batch_label && (
                            <span className="text-zinc-700 text-xs">{claim.batch_label}</span>
                          )}
                        </div>
                        {claim.email && (
                          <p className="text-sm text-zinc-300 truncate">{claim.email}</p>
                        )}
                        {claim.codes?.code && (
                          <p className="text-xs font-mono text-amber-500/80 mt-1">{claim.codes.code}</p>
                        )}
                        {claim.claimed_at && (
                          <p className="text-xs text-zinc-700 mt-1">
                            {new Date(claim.claimed_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      {claim.status === 'claimed' && (
                        <button
                          onClick={() => handleResend(claim.id)}
                          disabled={resendingId === claim.id}
                          className="shrink-0 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 disabled:opacity-40 transition-colors"
                        >
                          {resendingId === claim.id ? 'Sending...' : resendDone === claim.id ? 'Sent!' : 'Resend'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}

async function generatePDF(tokens, batchLabel) {
  const QRCode = (await import('qrcode')).default
  const { jsPDF } = await import('jspdf')

  const baseUrl = window.location.origin
  const doc = new jsPDF({ unit: 'in', format: [4, 6] })

  for (let i = 0; i < tokens.length; i++) {
    if (i > 0) doc.addPage()

    const url = `${baseUrl}/c/${tokens[i].token}`
    const shortUrl = url.replace('https://', '')

    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 250,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    })

    // Congratulations
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('CONGRATULATIONS!', 2, 0.4, { align: 'center' })

    // Title
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('LIVE STEALS', 2, 0.72, { align: 'center' })

    // Divider
    doc.setDrawColor(210, 210, 210)
    doc.line(0.4, 0.88, 3.6, 0.88)

    // Subtitle
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(110, 110, 110)
    doc.text("You've won a", 2, 1.1, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text('Amazon Gift Card!', 2, 1.35, { align: 'center' })

    // QR Code — smaller, centered
    doc.addImage(qrDataUrl, 'PNG', 0.75, 1.55, 2.5, 2.5)

    // Scan instruction
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('Point your phone camera at the QR code to claim', 2, 4.18, { align: 'center' })

    // OR divider
    doc.setFontSize(8)
    doc.setTextColor(180, 180, 180)
    doc.text('- - - - - - - - - - OR - - - - - - - - - -', 2, 4.42, { align: 'center' })

    // Manual link
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(100, 100, 100)
    doc.text("Can't scan? Type this link in your browser:", 2, 4.65, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(0, 0, 0)
    const urlLines = doc.splitTextToSize(shortUrl, 3.4)
    doc.text(urlLines, 2, 4.85, { align: 'center' })

    // Divider
    doc.setDrawColor(230, 230, 230)
    const footerY = 4.85 + (urlLines.length * 0.1) + 0.12
    doc.line(0.4, footerY, 3.6, footerY)

    // Token (for support)
    doc.setFontSize(5.5)
    doc.setTextColor(195, 195, 195)
    doc.text(tokens[i].token, 2, footerY + 0.18, { align: 'center' })

    if (batchLabel) {
      doc.setFontSize(7)
      doc.setTextColor(165, 165, 165)
      doc.text(`Batch: ${batchLabel}`, 2, 5.32, { align: 'center' })
    }

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(185, 185, 185)
    doc.text('livesteals.co', 2, 5.78, { align: 'center' })
  }

  const filename = batchLabel
    ? `livesteals-${batchLabel.replace(/\s+/g, '-').toLowerCase()}.pdf`
    : 'livesteals-batch.pdf'

  doc.save(filename)
}
