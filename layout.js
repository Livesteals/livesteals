import './globals.css'

export const metadata = {
  title: 'LIVE STEALS',
  description: 'Claim your Amazon gift card',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
