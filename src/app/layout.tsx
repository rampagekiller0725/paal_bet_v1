import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './style.scss'

import { appTitle } from '@/@core/constants'
import NextUiProvider from '@/@core/providers/NextUiPvoder'
import AppContextProvider from '@/@core/providers/ContextProvider'
import RainbowProvider from '@/@core/providers/RainbowProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: appTitle,
  description: 'Sports betting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RainbowProvider>
          <NextUiProvider>
            <AppContextProvider>
              {children}
            </AppContextProvider>
          </NextUiProvider>
        </RainbowProvider>
      </body>
    </html>
  )
}
