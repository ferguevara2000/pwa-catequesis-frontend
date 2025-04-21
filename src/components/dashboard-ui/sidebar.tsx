"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { sidebarMenu } from "./sidebar-menu"
import { User, Role } from "@/types/user"

// Simulación para obtener usuario desde localStorage o context
const getUser = () : User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ rol: Role } | null>(null)

  useEffect(() => {
    const u = getUser()
    setUser(u)
  }, [])

  const groupedMenu = sidebarMenu.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {} as Record<string, typeof sidebarMenu>)

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any
    children: React.ReactNode
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      <nav
        className={`
          fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static border-r border-gray-200 dark:border-[#1F1F23]
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/"
            className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
          >
            <div className="flex items-center gap-3">
              <Image
                src="https://i.imgur.com/nV81zDF.png"
                alt="logo"
                width={50}
                height={50}
                className="flex-shrink-0"
              />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Catequesis
              </span>
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            {user &&
              Object.entries(groupedMenu).map(([section, items]) => {
                const visibleItems = items.filter((item) =>
                  item.roles.includes(user.rol)
                )
                if (visibleItems.length === 0) return null

                return (
                  <div key={section} className="mb-6">
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {section}
                    </div>
                    <div className="space-y-1">
                      {visibleItems.map(({ label, href, icon }) => (
                        <NavItem key={href} href={href} icon={icon}>
                          {label}
                        </NavItem>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
