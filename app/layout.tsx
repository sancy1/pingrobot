
// // app/layout.tsx
// // Root Layout Component - Manages application html shell wrappers and metadata properties

// import type { Metadata, Viewport } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import './globals.css'

// const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
// const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

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
//       suppressHydrationWarning
//     >
//       <body 
//         className="font-sans antialiased bg-background text-foreground"
//         suppressHydrationWarning={true}
//       >
//         {children}
//         {process.env.NODE_ENV === 'production' && <Analytics />}
//       </body>
//     </html>
//   )
// }
























// // app/layout.tsx
// // Root Layout Component - Manages application html shell wrappers and metadata properties
// // Includes SessionProvider for authentication state

// import type { Metadata, Viewport } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import { Providers } from '@/components/providers'
// import './globals.css'

// const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
// const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

// export const metadata: Metadata = {
//   title: 'PingRobot - Aggressive URL Monitoring & Wake-Up Tool',
//   description: 'Keep your cloud services awake with 60-second timeout + 3 retry attempts. Perfect for Render, Heroku, Railway, and Fly.io free tiers.',
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
//       suppressHydrationWarning
//     >
//       <body 
//         className="font-sans antialiased bg-background text-foreground"
//         suppressHydrationWarning={true}
//       >
//         <Providers>
//           {children}
//         </Providers>
//         {process.env.NODE_ENV === 'production' && <Analytics />}
//       </body>
//     </html>
//   )
// }
































// app/layout.tsx
// Root Layout Component - Manages application html shell wrappers and metadata properties
// Includes PWA support, mobile app install, and social media preview (Open Graph / Twitter Cards)

import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Application Name and URL
const APP_NAME = "PingRobot";
const APP_DESCRIPTION = "Keep your cloud services awake with 60-second timeout + 3 retry attempts. Perfect for Render, Heroku, Railway, and Fly.io free tiers.";
const APP_URL = "https://pingrobot-seven.vercel.app";
const APP_IMAGE = "https://pingrobot-seven.vercel.app/android-chrome-512x512.png";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Aggressive URL Monitoring & Wake-Up Tool`,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  keywords: [
    "uptime monitoring",
    "URL monitoring",
    "wake-up tool",
    "Render wake-up",
    "Heroku wake-up",
    "Railway wake-up",
    "Fly.io wake-up",
    "cold start prevention",
    "server monitoring",
    "API monitoring",
    "ping service",
    "keep alive",
    "PingRobot"
  ],
  authors: [{ name: "PingRobot", url: APP_URL }],
  creator: "PingRobot",
  publisher: "PingRobot",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Aggressive URL Monitoring & Wake-Up Tool`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: APP_IMAGE,
        width: 512,
        height: 512,
        alt: `${APP_NAME} App Icon`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Aggressive URL Monitoring & Wake-Up Tool`,
    description: APP_DESCRIPTION,
    images: [APP_IMAGE],
    creator: "@pingrobot",
    site: "@pingrobot",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "application-name": APP_NAME,
    "msapplication-TileColor": "#0a0a1a",
    "msapplication-config": "/browserconfig.xml",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a1a",
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
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://pingrobot-seven.vercel.app" />
        
        {/* Additional meta tags for better mobile experience */}
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="msapplication-TileColor" content="#0a0a1a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body 
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}