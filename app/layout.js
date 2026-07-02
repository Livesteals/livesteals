import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'LIVE STEALS — Win Amazon Gift Cards Live on Whatnot',
    template: '%s — LIVE STEALS',
  },
  description:
    'Live shopping steals and free Amazon gift card giveaways every stream. Watch live on Whatnot, win a card, scan the QR, and claim your code instantly.',
  metadataBase: new URL('https://livesteals.co'),
  openGraph: {
    title: 'LIVE STEALS — Win Amazon Gift Cards Live',
    description:
      'Free Amazon gift card giveaways every stream. Watch live on Whatnot and steal the deals.',
    url: 'https://livesteals.co',
    siteName: 'LIVE STEALS',
  },
}

export const viewport = {
  themeColor: '#060606',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="font-sans antialiased bg-[#060606]">
        {children}
      </body>
    </html>
  )
}
