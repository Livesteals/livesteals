'use client'
import { useState, useEffect } from 'react'
import { pickAllCodes } from '../../lib/extractCode'

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

const NAV_GROUPS = [
  {
    label: null,
    items: [{ key: 'dashboard', label: 'Dashboard', icon: 'grid' }],
  },
  {
    label: 'Operations',
    items: [
      { key: 'codes', label: 'Add Codes', icon: 'plus' },
      { key: 'generate', label: 'Generate Labels', icon: 'tag' },
      { key: 'claims', label: 'All Claims', icon: 'inbox' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { key: 'finance', label: 'Finances', icon: 'dollar' },
      { key: 'activity', label: 'Activity', icon: 'pulse' },
    ],
  },
]

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  codes: 'Add Codes',
  generate: 'Generate Labels',
  claims: 'All Claims',
  finance: 'Finances',
  activity: 'Activity',
}

function Icon({ name, className = 'w-[18px] h-[18px]' }) {
  const paths = {
    grid: <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />,
    plus: <path d="M12 5v14M5 12h14" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />,
    tag: <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    inbox: <path d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    dollar: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    pulse: <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {paths[name]}
    </svg>
  )
}

const financeLabels = {
  revenue: 'Revenue',
  earnings: 'Est. Earnings',
  expense: 'Expenses',
  payout: 'Payouts',
}

const categoryLabels = {
  gift_cards: 'Giftcards',
  items: 'Items',
  other: 'Other',
}

function activityStyle(type) {
  if (type === 'codes_added') return { dot: 'bg-green-500/15 text-green-400', icon: 'plus' }
  if (type === 'labels_generated') return { dot: 'bg-blue-500/15 text-blue-400', icon: 'tag' }
  if (type === 'claim_redeemed') return { dot: 'bg-amber-500/15 text-amber-400', icon: 'inbox' }
  if (type === 'finance_revenue' || type === 'finance_earnings') return { dot: 'bg-green-500/15 text-green-400', icon: 'dollar' }
  if (type === 'finance_expense' || type === 'finance_payout') return { dot: 'bg-red-500/15 text-red-400', icon: 'dollar' }
  if (type === 'finance_deleted') return { dot: 'bg-zinc-500/15 text-zinc-400', icon: 'pulse' }
  return { dot: 'bg-zinc-500/15 text-zinc-400', icon: 'pulse' }
}

function timeAgo(iso) {
  const d = new Date(iso)
  const secs = Math.floor((Date.now() - d.getTime()) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

function csvCell(val) {
  const s = String(val ?? '')
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const [codesInput, setCodesInput] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [addResult, setAddResult] = useState(null)

  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrProgress, setOcrProgress] = useState('')
  const [ocrIssues, setOcrIssues] = useState([])

  const [pasteText, setPasteText] = useState('')
  const [pasteResult, setPasteResult] = useState(null)

  const [genQty, setGenQty] = useState(10)
  const [genBatch, setGenBatch] = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [genMessage, setGenMessage] = useState('')

  const [claims, setClaims] = useState([])
  const [claimsLoading, setClaimsLoading] = useState(false)
  const [resendingId, setResendingId] = useState(null)
  const [resendDone, setResendDone] = useState(null)
  const [exportingEmails, setExportingEmails] = useState(false)

  const [resetLoading, setResetLoading] = useState(false)

  const [financeEntries, setFinanceEntries] = useState([])
  const [financeLoading, setFinanceLoading] = useState(false)
  const [financeType, setFinanceType] = useState('revenue')
  const [financeCategory, setFinanceCategory] = useState('gift_cards')
  const [financeAmount, setFinanceAmount] = useState('')
  const [financeNote, setFinanceNote] = useState('')
  const [financeDate, setFinanceDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [financeSaving, setFinanceSaving] = useState(false)
  const [financeFilter, setFinanceFilter] = useState('all')

  const [activity, setActivity] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)

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
    setSidebarOpen(false)
    if (activeTab === 'dashboard') { loadStats(); loadFinance(); loadActivity() }
    if (activeTab === 'codes') loadStats()
    if (activeTab === 'generate') loadStats()
    if (activeTab === 'claims') loadClaims()
    if (activeTab === 'finance') loadFinance()
    if (activeTab === 'activity') loadActivity()
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

  // Parse the PDF entirely in the browser. This avoids uploading the file to a
  // serverless function (which has a ~4.5MB request-body limit and a short
  // timeout) — so large batches of cards work regardless of file size.
  async function extractFromPdf(file) {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString()
    const data = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data }).promise
    let text = ''
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p)
      const content = await page.getTextContent()
      text += content.items.map(it => (it.str || '')).join(' ') + '\n'
    }
    return pickAllCodes(text)
  }

  async function handleExtractCodes(files) {
    if (!files || files.length === 0) return
    setOcrLoading(true)
    setOcrIssues([])

    const Tesseract = (await import('tesseract.js')).default

    const foundCodes = new Set()
    const issues = []

    for (let i = 0; i < files.length; i++) {
      setOcrProgress(`Reading file ${i + 1} of ${files.length}...`)
      try {
        let codes = []
        const isPdf = files[i].type === 'application/pdf' || files[i].name.toLowerCase().endsWith('.pdf')
        if (isPdf) {
          codes = await extractFromPdf(files[i])
        } else {
          const { data } = await Tesseract.recognize(files[i], 'eng')
          codes = pickAllCodes(data.text)
        }
        if (codes.length > 0) {
          codes.forEach(c => foundCodes.add(c.toUpperCase()))
        } else {
          issues.push(files[i].name)
        }
      } catch {
        issues.push(files[i].name)
      }
    }

    setCodesInput(prev => {
      const existing = prev.trim()
      const added = [...foundCodes].join('\n')
      if (!added) return prev
      return existing ? `${existing}\n${added}` : added
    })
    setOcrIssues(issues)
    setOcrProgress('')
    setOcrLoading(false)
  }

  function handleExtractFromPaste() {
    const codes = pickAllCodes(pasteText)
    if (codes.length === 0) {
      setPasteResult({ found: 0 })
      return
    }
    setCodesInput(prev => {
      const existing = prev.trim()
      const added = codes.join('\n')
      return existing ? `${existing}\n${added}` : added
    })
    setPasteResult({ found: codes.length })
    setPasteText('')
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

  async function handleReset() {
    const confirmed = window.prompt(
      'This permanently deletes ALL codes and claim cards, including unused gift card codes. This cannot be undone.\n\nType RESET to confirm.'
    )
    if (confirmed !== 'RESET') return

    setResetLoading(true)
    try {
      await adminFetch('/api/admin/reset', { method: 'POST' })
      await loadStats()
    } finally {
      setResetLoading(false)
    }
  }

  async function loadClaims() {
    setClaimsLoading(true)
    const res = await adminFetch('/api/admin/claims')
    if (res.ok) { const d = await res.json(); setClaims(d.claims || []) }
    setClaimsLoading(false)
  }

  async function handleExportEmails() {
    setExportingEmails(true)
    try {
      const res = await adminFetch('/api/admin/export-emails')
      if (!res.ok) return
      const { rows } = await res.json()
      if (!rows || rows.length === 0) {
        window.alert('No claimed emails to export yet.')
        return
      }
      const header = ['Email', 'Date Claimed', 'Batch', 'Gift Code']
      const lines = rows.map(r => [
        r.email || '',
        r.claimed_at ? new Date(r.claimed_at).toLocaleString() : '',
        r.batch_label || '',
        r.codes?.code || '',
      ])
      // ﻿ BOM so Excel opens UTF-8 correctly
      const csv = '﻿' + [header, ...lines].map(cols => cols.map(csvCell).join(',')).join('\r\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `livesteals-emails-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setExportingEmails(false)
    }
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

  async function loadFinance() {
    setFinanceLoading(true)
    const res = await adminFetch('/api/admin/finance')
    if (res.ok) { const d = await res.json(); setFinanceEntries(d.entries || []) }
    setFinanceLoading(false)
  }

  async function loadActivity() {
    setActivityLoading(true)
    const res = await adminFetch('/api/admin/activity')
    if (res.ok) { const d = await res.json(); setActivity(d.activity || []) }
    setActivityLoading(false)
  }

  async function handleAddFinance(e) {
    e.preventDefault()
    if (!financeAmount || Number(financeAmount) <= 0) return
    setFinanceSaving(true)
    try {
      const res = await adminFetch('/api/admin/finance', {
        method: 'POST',
        body: JSON.stringify({
          entryType: financeType,
          category: financeType === 'expense' ? financeCategory : null,
          amount: financeAmount,
          note: financeNote,
          entryDate: financeDate,
        }),
      })
      if (res.ok) {
        setFinanceAmount('')
        setFinanceNote('')
        loadFinance()
      }
    } finally {
      setFinanceSaving(false)
    }
  }

  async function handleDeleteFinance(id) {
    if (!window.confirm('Delete this entry?')) return
    await adminFetch(`/api/admin/finance/${id}`, { method: 'DELETE' })
    setFinanceEntries(prev => prev.filter(e => e.id !== id))
  }

  const financeTotals = financeEntries.reduce((acc, e) => {
    acc[e.entry_type] = (acc[e.entry_type] || 0) + Number(e.amount)
    return acc
  }, {})
  const netTotal = (financeTotals.revenue || 0) - (financeTotals.expense || 0)

  const visibleFinanceEntries = financeFilter === 'all'
    ? financeEntries
    : financeEntries.filter(e => e.entry_type === financeFilter)

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 text-white">
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black border-r border-zinc-800/80 flex flex-col transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 h-16 flex items-center border-b border-zinc-800/80 shrink-0">
          <button
            onClick={() => window.location.reload()}
            title="Refresh"
            className="text-amber-500 font-black tracking-widest text-sm uppercase hover:text-amber-400 transition-colors"
          >
            LIVE STEALS
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">{group.label}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === item.key
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-sm">
              LS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-200 truncate">Admin</p>
              <p className="text-xs text-zinc-600 truncate">livesteals.co</p>
            </div>
            <button onClick={logout} title="Sign out" className="text-zinc-500 hover:text-zinc-200 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[18px] h-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/80 flex items-center gap-3 px-4 md:px-8 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-zinc-400 hover:text-white"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">{PAGE_TITLES[activeTab]}</h1>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full">

          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black">Welcome back 👋</h2>
                <p className="text-zinc-500 mt-1">Everything across your giveaways and storefront at a glance.</p>
              </div>

              {/* Inventory stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Available', value: stats?.codes.available, color: 'text-green-400' },
                  { label: 'Unclaimed', value: stats?.codes.unclaimed, color: 'text-amber-400' },
                  { label: 'Claimed', value: stats?.codes.claimed, color: 'text-zinc-200' },
                  { label: 'Total Codes', value: stats?.codes.total, color: 'text-zinc-400' },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <p className={`text-3xl font-black ${s.color}`}>{s.value ?? '—'}</p>
                    <p className="text-zinc-500 text-xs mt-1.5 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              {stats && stats.codes.available <= 5 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                  <p className="text-red-400 font-semibold text-sm mb-1">Low on codes</p>
                  <p className="text-red-400/60 text-sm">
                    Only {stats.codes.available} code{stats.codes.available !== 1 ? 's' : ''} available. Add more before your next stream.
                  </p>
                </div>
              )}

              {/* Money + recent activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Money</h3>
                    <button onClick={() => setActiveTab('finance')} className="text-xs text-amber-400 hover:text-amber-300">View all</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xl font-black text-green-400">${(financeTotals.revenue || 0).toFixed(0)}</p>
                      <p className="text-zinc-500 text-[11px] mt-1">Revenue</p>
                    </div>
                    <div>
                      <p className="text-xl font-black text-red-400">${(financeTotals.expense || 0).toFixed(0)}</p>
                      <p className="text-zinc-500 text-[11px] mt-1">Expenses</p>
                    </div>
                    <div>
                      <p className={`text-xl font-black ${netTotal >= 0 ? 'text-amber-400' : 'text-red-400'}`}>${netTotal.toFixed(0)}</p>
                      <p className="text-zinc-500 text-[11px] mt-1">Net</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Recent Activity</h3>
                    <button onClick={() => setActiveTab('activity')} className="text-xs text-amber-400 hover:text-amber-300">View all</button>
                  </div>
                  {activity.length === 0 ? (
                    <p className="text-zinc-600 text-sm py-4">Nothing yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {activity.slice(0, 5).map(a => {
                        const st = activityStyle(a.type)
                        return (
                          <div key={a.id} className="flex items-center gap-3">
                            <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${st.dot}`}>
                              <Icon name={st.icon} className="w-3.5 h-3.5" />
                            </span>
                            <p className="text-sm text-zinc-300 truncate flex-1">{a.description}</p>
                            <span className="text-xs text-zinc-600 shrink-0">{timeAgo(a.created_at)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'codes' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h2 className="text-xl font-bold mb-1">Add Gift Card Codes</h2>
                <p className="text-zinc-500 text-sm">Paste codes, or upload the gift card images Amazon emails you and we'll read the codes off them.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                <label className="block">
                  <span className="block text-sm text-zinc-400 mb-2">Upload gift card images or PDFs</span>
                  <input
                    type="file"
                    multiple
                    disabled={ocrLoading}
                    onChange={e => handleExtractCodes(e.target.files)}
                    className="w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-bold file:text-sm hover:file:bg-amber-400 file:cursor-pointer disabled:opacity-50"
                  />
                </label>
                {ocrLoading && (
                  <p className="text-sm text-amber-400">{ocrProgress || 'Reading images...'}</p>
                )}
                {!ocrLoading && ocrIssues.length > 0 && (
                  <div className="text-sm text-red-400">
                    <p className="font-semibold mb-1">Couldn't read a code from {ocrIssues.length} file{ocrIssues.length !== 1 ? 's' : ''} — add manually:</p>
                    <ul className="list-disc list-inside text-red-400/70">
                      {ocrIssues.map(name => <li key={name}>{name}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div>
                  <span className="block text-sm text-zinc-400 mb-1">Or paste text copied from a gift card PDF</span>
                  <span className="block text-xs text-zinc-600 mb-2">Open the PDF, select all, copy, and paste below — we'll pull out just the claim code(s), even from multiple cards pasted together.</span>
                  <textarea
                    value={pasteText}
                    onChange={e => { setPasteText(e.target.value); setPasteResult(null) }}
                    placeholder="Paste copied PDF text here..."
                    rows={5}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 font-mono text-xs resize-none transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleExtractFromPaste}
                  disabled={!pasteText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold text-sm transition-colors"
                >
                  Extract Codes
                </button>
                {pasteResult && (
                  <p className={`text-sm ${pasteResult.found > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pasteResult.found > 0
                      ? `Found ${pasteResult.found} code${pasteResult.found !== 1 ? 's' : ''}.`
                      : "No claim code found in that text."}
                  </p>
                )}
              </div>

              <form onSubmit={handleAddCodes} className="space-y-4">
                <p className="text-zinc-500 text-sm">Review the codes below before adding — OCR can make mistakes.</p>
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
                <p className="text-zinc-500 text-sm mt-2">
                  Each card locks one available code.{' '}
                  <span className="text-green-400 font-semibold">{stats?.codes.available ?? '—'} available</span> to generate from.
                </p>
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
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">All Claims</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportEmails}
                    disabled={exportingEmails}
                    className="text-sm px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold transition-colors"
                  >
                    {exportingEmails ? 'Exporting...' : 'Download Emails (CSV)'}
                  </button>
                  <button
                    onClick={loadClaims}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
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

          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Finances</h2>
                <button onClick={loadFinance} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['revenue', 'expense'].map(t => (
                  <div key={t} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <p className={`text-2xl font-bold ${t === 'revenue' ? 'text-green-400' : 'text-red-400'}`}>
                      ${(financeTotals[t] || 0).toFixed(2)}
                    </p>
                    <p className="text-zinc-600 text-xs mt-1 leading-tight">{financeLabels[t]}</p>
                  </div>
                ))}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <p className={`text-2xl font-bold ${netTotal >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                    ${netTotal.toFixed(2)}
                  </p>
                  <p className="text-zinc-600 text-xs mt-1 leading-tight">Total</p>
                </div>
              </div>

              <form onSubmit={handleAddFinance} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-zinc-300">Add Entry</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">Type</label>
                    <select
                      value={financeType}
                      onChange={e => setFinanceType(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="revenue">Revenue</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  {financeType === 'expense' ? (
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Category</label>
                      <select
                        value={financeCategory}
                        onChange={e => setFinanceCategory(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="gift_cards">Giftcards</option>
                        <option value="items">Items</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Date</label>
                      <input
                        type="date"
                        value={financeDate}
                        onChange={e => setFinanceDate(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  )}
                </div>
                {financeType === 'expense' && (
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">Date</label>
                    <input
                      type="date"
                      value={financeDate}
                      onChange={e => setFinanceDate(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={financeAmount}
                    onChange={e => setFinanceAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2.5 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Note <span className="text-zinc-700">optional</span></label>
                  <input
                    type="text"
                    value={financeNote}
                    onChange={e => setFinanceNote(e.target.value)}
                    placeholder="e.g. June 28 stream"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2.5 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={financeSaving || !financeAmount}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold text-sm transition-colors"
                >
                  {financeSaving ? 'Saving...' : 'Add Entry'}
                </button>
              </form>

              <div className="flex gap-2 overflow-x-auto">
                {['all', 'revenue', 'expense'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFinanceFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      financeFilter === f ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {f === 'all' ? 'All' : financeLabels[f]}
                  </button>
                ))}
              </div>

              {financeLoading ? (
                <div className="space-y-2">
                  {[0,1,2].map(i => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 animate-pulse">
                      <div className="h-4 w-24 bg-zinc-800 rounded mb-2" />
                      <div className="h-3 w-40 bg-zinc-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : visibleFinanceEntries.length === 0 ? (
                <p className="text-zinc-600 py-8 text-center">No entries yet.</p>
              ) : (
                <div className="space-y-2">
                  {visibleFinanceEntries.map(entry => (
                    <div key={entry.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            entry.entry_type === 'revenue' ? 'bg-green-500/15 text-green-400' :
                            entry.entry_type === 'earnings' ? 'bg-amber-500/15 text-amber-400' :
                            entry.entry_type === 'expense' ? 'bg-red-500/15 text-red-400' :
                            'bg-zinc-500/15 text-zinc-300'
                          }`}>
                            {financeLabels[entry.entry_type]}
                          </span>
                          {entry.category && (
                            <span className="text-zinc-700 text-xs">{categoryLabels[entry.category] || entry.category}</span>
                          )}
                        </div>
                        <p className="text-lg font-bold text-white">${Number(entry.amount).toFixed(2)}</p>
                        {entry.note && <p className="text-sm text-zinc-400 truncate">{entry.note}</p>}
                        <p className="text-xs text-zinc-700 mt-1">{entry.entry_date}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteFinance(entry.id)}
                        className="shrink-0 text-xs text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Activity</h2>
                  <p className="text-zinc-500 text-sm mt-0.5">Every change across the app — codes, labels, claims and money.</p>
                </div>
                <button onClick={loadActivity} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors shrink-0">
                  Refresh
                </button>
              </div>

              {activityLoading ? (
                <div className="space-y-2">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse">
                      <div className="h-4 w-48 bg-zinc-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : activity.length === 0 ? (
                <p className="text-zinc-600 py-8 text-center">No activity yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {activity.map(a => {
                    const st = activityStyle(a.type)
                    return (
                      <div key={a.id} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                        <span className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${st.dot}`}>
                          <Icon name={st.icon} className="w-4 h-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-200 truncate">{a.description}</p>
                          {a.meta?.code && (
                            <p className="text-xs font-mono text-amber-500/70 mt-0.5">{a.meta.code}</p>
                          )}
                        </div>
                        {a.amount != null && (
                          <span className={`text-sm font-bold shrink-0 ${
                            a.type === 'finance_expense' || a.type === 'finance_payout' || a.type === 'finance_deleted'
                              ? 'text-red-400' : 'text-green-400'
                          }`}>
                            ${Number(a.amount).toFixed(2)}
                          </span>
                        )}
                        <span className="text-xs text-zinc-600 shrink-0 w-16 text-right">{timeAgo(a.created_at)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Maintenance — only on dashboard footer */}
          {activeTab === 'dashboard' && (
            <div className="mt-10 pt-6 border-t border-zinc-900 flex items-center gap-4">
              <button
                onClick={loadStats}
                disabled={statsLoading}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {statsLoading ? 'Refreshing...' : 'Refresh stats'}
              </button>
              <button
                onClick={handleReset}
                disabled={resetLoading}
                className="text-sm text-red-500/70 hover:text-red-400 transition-colors"
              >
                {resetLoading ? 'Resetting...' : 'Reset all codes & cards'}
              </button>
            </div>
          )}

        </main>
      </div>
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

    // Headline
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('YOU WON A GIVEAWAY!', 2, 0.42, { align: 'center' })

    // Title
    doc.setFontSize(11)
    doc.setTextColor(110, 110, 110)
    doc.text('LIVE STEALS', 2, 0.65, { align: 'center' })

    // Divider
    doc.setDrawColor(210, 210, 210)
    doc.line(0.4, 0.82, 3.6, 0.82)

    // Subtitle
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(110, 110, 110)
    doc.text("This card is proof you won a", 2, 1.05, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text('Amazon Gift Card!', 2, 1.3, { align: 'center' })

    // QR Code — smaller, centered
    doc.addImage(qrDataUrl, 'PNG', 0.75, 1.5, 2.5, 2.5)

    // How to claim
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('HOW TO CLAIM IT', 2, 4.13, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('Point your phone camera at the QR code to claim instantly.', 2, 4.32, { align: 'center' })

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

    // Expiration
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(0, 0, 0)
    doc.text('EXPIRES IN 30 DAYS', 2, 5.55, { align: 'center' })

    // Footer
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(185, 185, 185)
    doc.text('livesteals.co', 2, 5.78, { align: 'center' })
  }

  const filename = batchLabel
    ? `livesteals-${batchLabel.replace(/\s+/g, '-').toLowerCase()}.pdf`
    : 'livesteals-batch.pdf'

  doc.save(filename)
}
