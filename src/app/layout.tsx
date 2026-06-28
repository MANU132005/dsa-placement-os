import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
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
        <AuthProvider>
          <DataProvider>
            {/* Main application router content guard */}
            <AppLayoutShell>{children}</AppLayoutShell>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

// Internal client-wrapper to conditionally hide sidebar on the Login and Onboarding pages
import ClientShellWrapper from "@/components/ClientShellWrapper"
function AppLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <ClientShellWrapper>
      {children}
    </ClientShellWrapper>
  )
}
