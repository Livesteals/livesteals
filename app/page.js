import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-5">
        <span className="text-2xl font-black tracking-tight">
          <span className="text-gray-900">LIVE</span><span className="text-red-600">STEALS</span>
        </span>
        <Link href="/admin" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
          Admin
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24">

        {/* Giant lightning bolt background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg className="w-[700px] h-[700px] text-red-50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L4.5 13.5H10L8.5 22L19.5 10.5H14L13 2Z" />
          </svg>
        </div>

        <div className="relative text-center max-w-4xl mx-auto">

          {/* Logo block */}
          <div className="relative inline-flex items-center justify-center mb-8 gap-3">

            {/* Camera icon */}
            <svg className="w-12 h-12 text-gray-800 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              <circle cx="12" cy="12" r="2.8"/>
            </svg>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none drop-shadow-sm">
              <span className="text-gray-900">LIVE</span><span className="text-red-600">STEALS</span>
            </h1>

          </div>

          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Win <span className="text-red-600">$5 Amazon Gift Cards</span> — Every Stream.
          </p>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Join live, win a giveaway, get a card in the mail. Scan the QR and your code appears instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.whatnot.com/s/WZZ45wou"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-lg rounded-2xl transition-colors shadow-xl shadow-red-200"
            >
              Watch Live on Whatnot
            </a>
            <a
              href="https://www.whatnot.com/s/WZZ45wou"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 border-2 border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-600 font-bold text-lg rounded-2xl transition-colors"
            >
              Follow for Giveaways
            </a>
          </div>

        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-red-600 py-12 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center text-white">
          {[
            { value: '30–40', label: 'Gift Cards Per Stream' },
            { value: '$5', label: 'Amazon Gift Cards' },
            { value: '100%', label: 'Free to Win' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-4xl md:text-5xl font-black mb-1">{s.value}</p>
              <p className="text-red-200 text-sm font-medium uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-center text-gray-400 mb-14">Three simple steps from stream to code.</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                ),
                title: 'Join a Live Stream',
                desc: 'Follow LIVESTEALS on Whatnot and tune in. Gift card giveaways happen every single session.',
              },
              {
                step: '02',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                ),
                title: 'Win a Giveaway',
                desc: "Winners get a card mailed to them with a QR code inside. Watch your mailbox.",
              },
              {
                step: '03',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L4.5 13.5H10L8.5 22L19.5 10.5H14L13 2Z"/>
                  </svg>
                ),
                title: 'Claim Instantly',
                desc: 'Scan the QR code, enter your email, and your $5 Amazon code appears on screen immediately.',
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-2xl mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-red-400 tracking-widest mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-6xl mb-6">
            <svg className="w-16 h-16 text-red-600 mx-auto" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L4.5 13.5H10L8.5 22L19.5 10.5H14L13 2Z"/>
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Ready to Win?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Follow LIVESTEALS on Whatnot and join the next stream. Giveaways happen every session — don't miss out.
          </p>
          <a
            href="https://www.whatnot.com/s/WZZ45wou"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-2xl transition-colors shadow-xl shadow-red-200"
          >
            Follow on Whatnot
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xl font-black">
            <span className="text-gray-900">LIVE</span><span className="text-red-600">STEALS</span>
          </span>
          <p className="text-gray-300 text-sm">livesteals.co</p>
        </div>
      </footer>

    </div>
  )
}
