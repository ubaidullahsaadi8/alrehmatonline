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

export const metadata: Metadata = {
  title: "HatBrain - Software Development Company",
  description: "Leading tech company specializing in software development, AI solutions, and digital transformation",
  generator: "v0.app",
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
            </Providers>
          </CurrencyProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
