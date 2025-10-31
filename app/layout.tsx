import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import "./globals.css"
import "@/styles/scrollbar-fix.css"  

import "@/lib/system-init"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/lib/currency-context"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"
import WhatsAppFloat from "@/components/whatsapp-float"

export const metadata: Metadata = {
  title: "LearnQuraan - Online Quran Academy",
  description: "Learn Quran online with qualified teachers. Professional Quran teaching services for all ages. Start your Quranic journey today.",
  generator: "v0.app",
  icons: {
    icon: '/white-logo.png',
    shortcut: '/white-logo.png',
    apple: '/white-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CurrencyProvider>
            <Providers>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              <Toaster />
              <WhatsAppFloat />
            </Providers>
          </CurrencyProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
