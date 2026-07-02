'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import ClaimPopup from './ClaimPopup'

const WHATNOT_URL = 'https://www.whatnot.com/s/WZZ45wou'

/* ---------- Interactive 3D-tilt gift card ---------- */
function TiltCard() {
  const wrapRef = useRef(null)
  const [style, setStyle] = useState({})
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 })

  function onMove(e) {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * 18
    const ry = (px - 0.5) * 22
    setStyle({
      transform: `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.03)`,
      transition: 'transform 80ms linear',
    })
    setGlare({ x: px * 100, y: py * 100, o: 1 })
  }

  function onLeave() {
    setStyle({
      transform: 'perspective(1100px) rotateX(12deg) rotateY(-14deg)',
      transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
    })
    setGlare(g => ({ ...g, o: 0 }))
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative select-none [perspective:1100px] motion-safe:animate-float"
      aria-hidden="true"
    >
      {/* glow bed under the card */}
      <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-red-600/50 via-red-500/20 to-amber-500/40 blur-3xl" />

      <div
        style={{
          transform: 'perspective(1100px) rotateX(12deg) rotateY(-14deg)',
          ...style,
        }}
        className="relative w-[19rem] sm:w-[22rem] aspect-[8/5] rounded-3xl border border-white/15 bg-gradient-to-br from-[#1c1c1f] via-[#101012] to-[#1a0a0a] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(239,43,43,0.35)] overflow-hidden"
      >
        {/* holographic sheen */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgba(239,43,43,0.14)_38%,rgba(251,191,36,0.16)_50%,transparent_68%)]" />
        {/* pointer glare */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: glare.o,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.18), transparent 55%)`,
          }}
        />
        {/* shine sweep */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent motion-safe:animate-shine" />
        </div>

        {/* card face */}
        <div className="relative h-full flex flex-col justify-between p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <Image
              src="/logo-v3.png"
              alt=""
              width={150}
              height={100}
              className="h-10 w-auto object-contain"
            />
            <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-zinc-500 mt-1">
              Giveaway Card
            </span>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-zinc-500 mb-1">
              Amazon Gift Card
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-gradient-gold tracking-tight">
              You Won.
            </p>
          </div>

          <div className="flex items-end justify-between">
            <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-600">
              XXXX-XXXXXX-XXXX
            </p>
            {/* faux QR */}
            <div className="grid grid-cols-4 gap-[3px] p-[5px] rounded-md bg-white/90">
              {[1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1].map((v, i) => (
                <span key={i} className={`h-[5px] w-[5px] rounded-[1px] ${v ? 'bg-zinc-900' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Hero ---------- */
export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Lock page scroll while the menu is open
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [menuOpen])

  return (
    <header className="relative overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-dot-grid mask-radial-fade opacity-60" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[34rem] w-[60rem] rounded-full bg-red-600/25 blur-[140px] motion-safe:animate-aurora" />
        <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-red-900/40 blur-[120px]" />
        <div className="absolute -bottom-24 right-0 h-80 w-[30rem] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      {/* nav */}
      <nav className="relative z-40 mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 py-4">
        <Link href="/" aria-label="LIVE STEALS home" className="shrink-0 cursor-pointer transition-transform hover:scale-105">
          <Image
            src="/logo-v3.png"
            alt="LIVE STEALS"
            width={300}
            height={200}
            priority
            className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          />
        </Link>

        <div className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1.5">
          <a href="#how" className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
            How It Works
          </a>
          <a href="#claim" className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
            Claim a Card
          </a>
          <a
            href={WHATNOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-red-500 to-red-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-900/40 hover:from-red-400 hover:to-red-600 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Watch Live
          </a>
        </div>

        {/* mobile menu button */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="md:hidden cursor-pointer flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-2xl glass transition-transform active:scale-95"
        >
          <span className="block h-[2px] w-5 rounded-full bg-white" />
          <span className="block h-[2px] w-5 rounded-full bg-white" />
          <span className="block h-[2px] w-5 rounded-full bg-white" />
        </button>
      </nav>

      {/* hero body */}
      <div className="relative z-20 mx-auto grid max-w-7xl items-center gap-14 lg:gap-8 px-5 sm:px-8 pb-24 pt-10 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:pb-32">
        <div className="text-center lg:text-left">
          {/* badge */}
          <div className="motion-safe:animate-fade-up inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            Live Now on Whatnot
          </div>

          <h1 className="motion-safe:animate-fade-up [animation-delay:100ms] font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] mb-6">
            <span className="text-gradient-white">Win Gift Cards.</span>
            <br />
            <span className="text-gradient-gold">Steal the Deals.</span>
          </h1>

          <p className="motion-safe:animate-fade-up [animation-delay:200ms] mx-auto lg:mx-0 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-400 mb-10">
            Real products at steal prices, live on Whatnot — with free Amazon
            gift card giveaways running all stream long. Join, shop, and win.
          </p>

          <div className="motion-safe:animate-fade-up [animation-delay:300ms] flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a
              href={WHATNOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 px-9 py-4 text-lg font-black text-black shadow-[0_10px_40px_-10px_rgba(251,191,36,0.6)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent motion-safe:animate-shine" />
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Live on Whatnot
            </a>

            <ClaimPopup
              trigger={
                <span className="inline-flex items-center gap-2">
                  Claim a Gift Card
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              }
              className="group cursor-pointer inline-flex items-center rounded-2xl glass px-8 py-4 text-lg font-bold text-white hover:bg-white/10 transition-colors"
            />
          </div>

          {/* trust row */}
          <div className="motion-safe:animate-fade-up [animation-delay:400ms] mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
            <span className="whitespace-nowrap">100% Free to Win</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span className="whitespace-nowrap">Cards Mailed to You</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span className="whitespace-nowrap">Instant Claim</span>
          </div>
        </div>

        {/* tilt card */}
        <div className="motion-safe:animate-scale-in [animation-delay:250ms] flex justify-center lg:justify-end">
          <TiltCard />
        </div>
      </div>

      {/* fullscreen mobile menu */}
      {menuOpen && createPortal(
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl motion-safe:animate-scale-in">
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="absolute top-6 right-6 cursor-pointer flex h-11 w-11 items-center justify-center rounded-2xl glass text-zinc-300 hover:text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <Image
            src="/logo-v3.png"
            alt="LIVE STEALS"
            width={300}
            height={200}
            className="h-16 w-auto object-contain mb-12 drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]"
          />

          <nav className="flex flex-col items-center gap-7">
            <a
              href={WHATNOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer font-display text-4xl font-bold tracking-tight text-white/90 hover:text-white transition-colors"
            >
              Watch Live
            </a>
            <a
              href="#how"
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer font-display text-4xl font-bold tracking-tight text-white/90 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <ClaimPopup
              trigger="Claim Gift Card"
              className="cursor-pointer font-display text-4xl font-bold tracking-tight text-gradient-gold"
            />
          </nav>
        </div>,
        document.body
      )}
    </header>
  )
}
