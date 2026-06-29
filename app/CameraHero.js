'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Camera3D from './Camera3DWrapper'
import ClaimPopup from './ClaimPopup'

const MENU_LINK = 'text-4xl sm:text-5xl font-black uppercase tracking-tight text-white/90 hover:text-white transition-colors'

export default function CameraHero() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-[#d61f1f] text-white">
      {/* subtle vignette for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.28)_100%)]" />

      {/* Logo top center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
        <Image
          src="/logo-v3.png"
          alt="LIVE STEALS"
          width={300}
          height={200}
          priority
          className="h-20 w-auto object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* Giant text in front of the camera */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none">
        <h1 className="text-center font-black uppercase leading-[0.82] tracking-tighter text-white/95">
          <span className="block text-[19vw] sm:text-[15vw]">Live</span>
          <span className="block text-[13.5vw] sm:text-[11vw]">Giveaways</span>
        </h1>
      </div>

      {/* 3D camera floating behind the text */}
      <div className="absolute inset-0 z-10">
        <Camera3D />
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
            <Link href="/admin" onClick={() => setMenuOpen(false)} className={MENU_LINK}>
              Admin
            </Link>
          </nav>
        </div>
      )}
    </section>
  )
}
