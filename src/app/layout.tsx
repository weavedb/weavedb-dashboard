import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WeaveDB Dashboard',
  description: 'NoSQL Database as a Smart Contract',
  icons: {
    icon: 'favicon.svg',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'WeaveDB Dashboard',
    description: 'NoSQL Database as a Smart Contract',
    images: ['https://weavedb.dev/twitterImage.png'],
  },
  openGraph: {
    title: 'WeaveDB Dashboard',
    description: 'NoSQL Database as a Smart Contract',
    url: 'https://dashboard.weavedb.dev',
    images: ['https://weavedb.dev/twitterImage.png'],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
