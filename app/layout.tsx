import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { AppProviders } from "@/components/providers"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, inter.variable)}
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
