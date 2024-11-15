// app/layout.jsx
'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ToastProvider } from "@/providers/toast-provider"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ToastProvider>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 p-8 overflow-auto">
                {children}
              </main>
            </div>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}