import type { Metadata } from "next"
import { IBM_Plex_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import FontLoader from "@/components/FontLoader"
import Web3Provider from "@/components/Web3Provider"

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Crashout Terminal",
  description: "Cyberpunk-themed Uniswap interface",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-mono bg-black text-white`}>
        <FontLoader />
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}