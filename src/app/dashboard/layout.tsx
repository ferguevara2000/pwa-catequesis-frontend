"use client"

import type { ReactNode } from "react"
import Sidebar from "@/components/dashboard-ui/sidebar"
import TopNav from "@/components/dashboard-ui/top-nav"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Toaster } from "@/components/ui/sonner"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
        <Sidebar />
        <div className="w-full flex flex-1 flex-col">
          <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
            <TopNav />
          </header>
          <main className="flex-1 overflow-auto p-6 bg-white dark:bg-[#0F0F12]">{children}</main>
        </div>
      </div>
      <Toaster richColors position="top-right" /> 
    </ProtectedRoute>
  )
}
