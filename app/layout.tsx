import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Navbar } from "@/components/navigation/nav-bar"
import { ThemeProvider } from "@/components/theme/theme-provider"

import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })
import "./globals.css"

export const metadata: Metadata = {
  title: "WillemSleegers.com",
  description: "My personal website.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.className, "antialiased flex flex-col min-h-dvh")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="grow">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
