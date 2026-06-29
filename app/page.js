import Link from 'next/link'
import ClaimPopup from './ClaimPopup'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-900">
        <span className="text-2xl font-black tracking-tight">
          <span className="text-white">LIVE</span><span className="text-amber-400">STEALS</span>
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://www.whatnot.com/s/WZZ45wou"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors"
          >
            Whatnot
          </a>
          <ClaimPopup />
          <a
            href="https://www.whatnot.com/s/WZZ45wou"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black rounded-lg transition-colors"
          >
            Watch Live
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-8 pt-24 pb-28 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.12),transparent_60%)]" />

        <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest border border-amber-400/20">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse inline-block"></span>
          Live Giveaways on Whatnot
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6">
          Win an <span className="text-amber-400">Amazon</span><br />Gift Card
        </h1>

        <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Join a LIVESTEALS stream on Whatnot, win a giveaway, and claim your code the moment your card arrives in the mail.
        </p>

        <a
          href="https://www.whatnot.com/s/WZZ45wou"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-amber-400 hover:bg-amber-300 text-black font-bold text-lg rounded-2xl transition-colors shadow-lg shadow-amber-400/20"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Watch Live on Whatnot
        </a>

        <p className="text-zinc-600 text-sm mt-5">Free to join. No purchase necessary.</p>

      </section>

      {/* Stats */}
      <section className="border-y border-zinc-900 py-14 px-4 sm:px-8">
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
      <section className="max-w-5xl mx-auto px-8 py-24">
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
            <div key={item.num} className="bg-zinc-950 rounded-3xl p-8 border border-zinc-900 hover:border-amber-400/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-400 text-black rounded-xl flex items-center justify-center shrink-0">
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
      <section className="bg-zinc-950 border-t border-zinc-900 py-20 px-8 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Don't Miss the Next Stream
          </h2>
          <p className="text-zinc-500 text-lg mb-10">
            Follow LIVESTEALS on Whatnot and get notified when we go live.
          </p>
          <a
            href="https://www.whatnot.com/s/WZZ45wou"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xl rounded-2xl transition-colors shadow-xl shadow-amber-400/20"
          >
            Follow on Whatnot
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-black">
            <span className="text-white">LIVE</span><span className="text-amber-400">STEALS</span>
          </span>
          <p className="text-zinc-600 text-sm">livesteals.co</p>
          <Link href="/admin" className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors">
            Admin
          </Link>
        </div>
      </footer>

    </div>
  )
}
