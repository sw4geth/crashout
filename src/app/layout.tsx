import type { Metadata } from "next"
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Crashout",
  description: "Brutalist Web3 AI Terminal",
  icons: {
    icon: "/crash.svg"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${spaceGrotesk.variable} font-mono bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}
