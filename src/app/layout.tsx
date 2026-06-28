import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { DataProvider } from "@/context/DataContext"
import { Sidebar } from "@/components/Sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Ultimate DSA Placement OS",
  description: "Advanced Developer Spaced-Repetition Placement Dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Dark/Light mode theme hydration script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('dsa_theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground flex transition-colors duration-200">
        <DataProvider>
          <Sidebar />
          <main className="pl-64 flex-1 flex flex-col min-h-screen">
            <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
              {children}
            </div>
          </main>
        </DataProvider>
      </body>
    </html>
  )
}
