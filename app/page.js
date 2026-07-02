import Image from 'next/image'
import Hero from './Hero'
import ClaimPopup from './ClaimPopup'

const WHATNOT_URL = 'https://www.whatnot.com/s/WZZ45wou'

const TICKER_ITEMS = [
  'Amazon Gift Cards',
  '30–40 Cards Per Stream',
  '100% Free to Win',
  'Live on Whatnot',
  'Real Products, Steal Prices',
  'Instant QR Claim',
]

function Ticker() {
  const row = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <section aria-label="Highlights" className="relative border-y border-white/5 bg-white/[0.015] py-5 overflow-hidden">
      <div className="mask-fade-x">
        <div className="flex w-max motion-safe:animate-marquee gap-0">
          {row.map((item, i) => (
            <span key={i} className="flex items-center gap-10 pr-10 whitespace-nowrap">
              <span className="font-display text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
                {item}
              </span>
              <svg className="h-3 w-3 text-red-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5 2.3-7.2-6-4.6h7.6z" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const stats = [
    { value: '30–40', label: 'Cards Per Stream', sub: 'Given away live, every session' },
    { value: 'Amazon', label: 'Gift Cards', sub: 'Real codes, redeemable instantly' },
    { value: '100%', label: 'Free to Win', sub: 'No purchase ever required' },
  ]
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(s => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-3xl glass p-8 text-center transition-colors hover:bg-white/[0.05]"
          >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <p className="font-display text-4xl sm:text-5xl font-bold text-gradient-gold mb-2">{s.value}</p>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-300 mb-1">{s.label}</p>
            <p className="text-xs text-zinc-500">{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Join a Live Stream',
      desc: 'Follow LIVESTEALS on Whatnot and hop into any live session. Gift card giveaways run all stream long.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Win a Giveaway',
      desc: 'Winners get a physical card mailed straight to them. Inside the envelope: a QR code for instant redemption.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Claim Your Code',
      desc: 'Scan the QR with your phone, enter your email, and your Amazon gift card code appears instantly.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.008v.008H6.75V6.75zm0 7.875h.008v.008H6.75v-.008zm7.875-7.875h.008v.008h-.008V6.75zm-1.125 6.75h.008v.008H13.5v-.008zm0 5.25h.008v.008H13.5v-.008zm2.625-2.625h.008v.008h-.008v-.008zm0 5.25h.008v.008h-.008v-.008zm2.625-2.625h.008v.008h-.008v-.008zm0-5.25h.008v.008h-.008v-.008zm2.25 2.625h.008v.008H21v-.008zm0 5.25h.008v.008H21v-.008z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="how" className="relative overflow-hidden mx-auto max-w-6xl px-5 sm:px-8 py-24 scroll-mt-12">
      <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-red-900/20 blur-[120px]" />

      <div className="relative text-center mb-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-500 mb-4">The Playbook</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-gradient-white mb-4">
          How It Works
        </h2>
        <p className="text-zinc-500 text-lg">Simple. Fast. Free.</p>
      </div>

      <div className="relative grid gap-5 md:grid-cols-3">
        {steps.map(step => (
          <div
            key={step.num}
            className="group relative overflow-hidden rounded-3xl glass p-8 transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-1"
          >
            <span className="pointer-events-none absolute -top-4 -right-2 font-display text-8xl font-bold text-white/[0.04] transition-colors duration-300 group-hover:text-red-500/10">
              {step.num}
            </span>

            <div className="relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-red-500 to-red-700 text-white shadow-lg shadow-red-950/60">
              {step.icon}
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 mb-2">
              Step {step.num}
            </p>
            <h3 className="font-display text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-500">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ClaimSection() {
  return (
    <section id="claim" className="mx-auto max-w-6xl px-5 sm:px-8 pb-24 scroll-mt-12">
      <div className="relative overflow-hidden rounded-[2rem] glass px-8 py-14 sm:px-14 text-center sm:text-left">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-[90px]" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-red-600/15 blur-[90px]" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-4">Already Won?</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Got a card in the mail?
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Scan the QR code on your envelope — or enter your claim code here —
              and your Amazon gift card code is yours in seconds.
            </p>
          </div>

          <ClaimPopup
            trigger={
              <span className="inline-flex items-center gap-3">
                Claim Your Card
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            }
            className="cursor-pointer shrink-0 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 px-9 py-4 text-lg font-black text-black shadow-[0_10px_40px_-10px_rgba(251,191,36,0.5)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
          />
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="relative mx-auto max-w-5xl px-5 sm:px-8 pb-28">
      <div className="rounded-[2rem] border-beam">
        <div className="beam-content relative overflow-hidden px-8 py-16 sm:py-20 text-center">
          <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-40" />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-red-600/25 blur-[100px]" />

          <div className="relative mx-auto max-w-xl">
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-gradient-white mb-4">
              Don&rsquo;t Miss the Next Stream
            </h2>
            <p className="text-zinc-400 text-lg mb-10">
              Follow LIVESTEALS on Whatnot and get notified the moment we go live.
            </p>
            <a
              href={WHATNOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 px-12 py-5 text-xl font-black text-black shadow-[0_10px_50px_-10px_rgba(251,191,36,0.6)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent motion-safe:animate-shine" />
              Follow on Whatnot
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Image
          src="/logo-v3.png"
          alt="LIVE STEALS"
          width={150}
          height={100}
          className="h-10 w-auto object-contain"
        />
        <div className="flex items-center gap-8 text-sm text-zinc-500">
          <a href="#how" className="cursor-pointer hover:text-white transition-colors">How It Works</a>
          <a href={WHATNOT_URL} target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-white transition-colors">
            Whatnot
          </a>
        </div>
        <p className="text-sm text-zinc-600">livesteals.co</p>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060606] text-zinc-100">
      <Hero />
      <Ticker />
      <Stats />
      <HowItWorks />
      <ClaimSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
