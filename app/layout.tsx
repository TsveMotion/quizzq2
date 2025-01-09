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

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'QuizzQ - AI-Powered Learning Platform',
  description: 'An intelligent quiz platform powered by AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn(
        "min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900",
        "font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
          <TailwindIndicator />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}