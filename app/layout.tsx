import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

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
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}