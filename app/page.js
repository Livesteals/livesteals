import Link from 'next/link'
import Image from 'next/image'
import CameraHero from './CameraHero'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">

      {/* Full-screen splash hero */}
      <CameraHero />

      {/* Stats */}
      <section className="border-b border-red-900/40 py-14 px-4 sm:px-8 bg-black">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-2 sm:gap-8 text-center">
          {[
            { value: '30–40', label: 'Cards Per Stream' },
            { value: 'Amazon', label: 'Gift Cards' },
            { value: '100%', label: 'Free to Win' },
          ].map(s => (
            <div key={s.label} className="min-w-0">
              <p className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-400 mb-1">{s.value}</p>
              <p className="text-zinc-500 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto px-8 py-24 bg-black scroll-mt-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-3">How It Works</h2>
          <p className="text-zinc-500">Simple. Fast. Free.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              num: '1',
              title: 'Join a Live Stream',
              desc: 'Follow LIVESTEALS on Whatnot and join any live session. Gift card giveaways run throughout every stream.',
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              ),
            },
            {
              num: '2',
              title: 'Win a Giveaway',
              desc: 'Winners get a card mailed directly to them. Inside the envelope is a QR code for instant redemption.',
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              ),
            },
            {
              num: '3',
              title: 'Claim Your Code',
              desc: 'Scan the QR code with your phone camera, enter your email, and your Amazon gift card code appears instantly.',
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              ),
            },
          ].map(item => (
            <div key={item.num} className="bg-zinc-950 rounded-3xl p-8 border border-red-900/30 hover:border-amber-400/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-b from-red-500 to-red-700 text-white rounded-xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Step {item.num}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 px-8 text-center bg-gradient-to-br from-red-700 via-red-800 to-red-950">
        <div className="absolute top-0 right-0 w-56 h-56 bg-black/30 translate-x-1/3 -translate-y-1/3 rotate-45" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/30 -translate-x-1/3 translate-y-1/3 rotate-45" />
        <div className="relative max-w-xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Don't Miss the Next Stream
          </h2>
          <p className="text-red-100 text-lg mb-10">
            Follow LIVESTEALS on Whatnot and get notified when we go live.
          </p>
          <a
            href="https://www.whatnot.com/s/WZZ45wou"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 bg-gradient-to-b from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-black font-black text-xl rounded-2xl transition-colors shadow-xl shadow-black/30"
          >
            Follow on Whatnot
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 bg-black">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo.jpg" alt="LIVE STEALS" width={36} height={36} className="rounded-lg" />
          <p className="text-zinc-600 text-sm">livesteals.co</p>
          <Link href="/admin" className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors">
            Admin
          </Link>
        </div>
      </footer>

    </div>
  )
}
