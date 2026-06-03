// import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import './globals.css'

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: 'Pinger - Uptime Monitoring',
//   description: 'Real-time uptime monitoring and incident tracking for your services',
//   generator: 'v0.app',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
//   viewport: {
//     width: 'device-width',
//     initialScale: 1,
//     maximumScale: 1,
//   },
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" className="dark bg-background">
//       <body className="font-sans antialiased bg-background text-foreground">
//         {children}
//         {process.env.NODE_ENV === 'production' && <Analytics />}
//       </body>
//     </html>
//   )
// }


























// // APP/LAYOUT.TSX

// import type { Metadata, Viewport } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import './globals.css'

// const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
// const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

// // 1. Next.js Compliant Metadata Block
// export const metadata: Metadata = {
//   title: 'Pinger - Uptime Monitoring',
//   description: 'Real-time uptime monitoring and incident tracking for your services',
//   generator: 'v0.app',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// // 2. Dedicated Cross-Browser Viewport Export
// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 1,
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html 
//       lang="en" 
//       className={`dark bg-background ${geist.variable} ${geistMono.variable}`}
//       suppressHydrationWarning // 👈 Protects html tag from theme/extension mismatches
//     >
//       <body 
//         className="font-sans antialiased bg-background text-foreground"
//         suppressHydrationWarning={true} // 👈 Safely bypasses browser extension attribute injections
//       >
//         {children}
//         {process.env.NODE_ENV === 'production' && <Analytics />}
//       </body>
//     </html>
//   )
// }



































// app/layout.tsx
// Root Layout Component - Manages application html shell wrappers and metadata properties

import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Pinger - Uptime Monitoring',
  description: 'Real-time uptime monitoring and incident tracking for your services',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      className={`dark bg-background ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body 
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning={true}
      >
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}