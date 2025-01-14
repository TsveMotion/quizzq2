'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Providers } from './providers'
import { cn } from '@/lib/utils'
import { ThemeProvider } from 'next-themes'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { TailwindIndicator } from '@/components/ui/tailwind-indicator'
import { usePathname } from 'next/navigation'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn(
        "min-h-screen font-sans antialiased",
        !isDashboard && "overflow-auto bg-background",
        isDashboard && "overflow-hidden bg-[#12141C]",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="dark"
        >
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              {!pathname?.includes('dashboard') && !pathname?.includes('admin') && <Footer />}
            </div>
            <Analytics />
            <SpeedInsights />
            <TailwindIndicator />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}