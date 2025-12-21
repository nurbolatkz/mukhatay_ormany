import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Add Google Fonts links for Spline Sans and Material Symbols
const fontLinks = [
  "https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700;800&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
]

export const metadata: Metadata = {
  title: "Mukhatay Ormany — Лесовосстановление в Казахстане",
  description:
    "Реальные экологические проекты по посадке деревьев и лесовосстановлению в Казахстане. От выращивания саженцев до долгосрочного ухода за лесами.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/tree-icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  keywords: ["лесовосстановление", "посадка деревьев", "Казахстан", "экология", "ESG", "CSR"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Load Google Fonts */}
        {fontLinks.map((href, index) => (
          <link key={index} href={href} rel="stylesheet" />
        ))}
      </head>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}