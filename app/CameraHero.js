'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ClaimPopup from './ClaimPopup'

const MENU_LINK = 'text-4xl sm:text-5xl font-black uppercase tracking-tight text-white/90 hover:text-white transition-colors'

export default function CameraHero() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-[#d61f1f] text-white">
      {/* subtle vignette for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.28)_100%)]" />

      {/* Logo top center — click to refresh */}
      <button
        onClick={() => window.location.reload()}
        aria-label="Refresh page"
        className="absolute top-6 left-1/2 -translate-x-1/2 z-30 cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <Image
          src="/logo-v3.png"
          alt="LIVE STEALS"
          width={300}
          height={200}
          priority
          className="h-20 w-auto object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
        />
      </button>

      {/* Hero content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-full mb-7 uppercase tracking-widest">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block"></span>
            Now Live on Whatnot
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-white [text-shadow:0_1px_0_#8a1818,0_2px_0_#7a1515,0_3px_0_#6a1212,0_4px_0_#5a0f0f,0_8px_12px_rgba(0,0,0,0.5)]">
            Win Gift Cards.<br />
            <span className="bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent [filter:drop-shadow(0_2px_0_rgba(120,70,0,0.6))_drop-shadow(0_4px_0_rgba(90,50,0,0.6))_drop-shadow(0_10px_14px_rgba(0,0,0,0.45))]">
              Steal the Deals.
            </span>
          </h1>

          <p className="text-lg text-red-50 max-w-xl mx-auto mb-9 leading-relaxed">
            More than a giveaway. I go live on Whatnot selling real products at steal prices &mdash; plus free Amazon gift card giveaways every stream. Join, shop, and win.
          </p>

          <a
            href="https://www.whatnot.com/s/WZZ45wou"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-b from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-black font-black text-lg rounded-2xl transition-colors shadow-xl shadow-black/30"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Live on Whatnot
          </a>
        </div>
      </div>

      {/* Bubble decoration bottom left */}
      <div className="absolute bottom-7 left-7 z-30 h-14 w-14 rounded-full border-2 border-white/70 overflow-hidden">
        <div className="absolute -top-1 left-2 h-6 w-9 rounded-full bg-white/80" />
      </div>

      {/* Hamburger menu button — center bottom */}
      <button
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex h-16 w-16 flex-col items-center justify-center gap-[5px] rounded-3xl bg-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95"
      >
        <span className="block h-[3px] w-7 rounded-full bg-[#d61f1f]" />
        <span className="block h-[3px] w-7 rounded-full bg-[#d61f1f]" />
        <span className="block h-[3px] w-7 rounded-full bg-[#d61f1f]" />
      </button>

      {/* SCROLL indicator bottom right */}
      <div className="absolute bottom-9 right-7 z-30 flex items-center gap-3">
        <span className="h-7 w-px bg-white/60" />
        <span className="text-sm font-semibold tracking-[0.2em] uppercase text-white/90">Scroll</span>
      </div>

      {/* Fullscreen menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#d61f1f]">
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="absolute top-8 right-8 text-white/90 hover:text-white transition-colors"
          >
            <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <Image
            src="/logo-v3.png"
            alt="LIVE STEALS"
            width={300}
            height={200}
            className="h-20 w-auto object-contain mb-12 drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
          />

          <nav className="flex flex-col items-center gap-6">
            <a
              href="https://www.whatnot.com/s/WZZ45wou"
              target="_blank"
              rel="noopener noreferrer"
              className={MENU_LINK}
            >
              Watch Live
            </a>
            <Link href="/#how" onClick={() => setMenuOpen(false)} className={MENU_LINK}>
              How It Works
            </Link>
            <ClaimPopup trigger="Claim Gift Card" className={MENU_LINK} />
          </nav>
        </div>
      )}
    </section>
  )
}
