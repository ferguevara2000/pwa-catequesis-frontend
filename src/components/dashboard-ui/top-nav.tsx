"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import Profile01 from "./profile-01"
import { ThemeToggle } from "../theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NotificationPanel } from "./notificacion-panel"

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function TopNav() {
  const pathname = usePathname()

  const pathParts = pathname.split("/").filter(Boolean)

  const formatLabel = (label: string) =>
    label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g, " ")

  const breadcrumbs: BreadcrumbItem[] = [
    ...pathParts.map((part, idx) => ({
      label: formatLabel(part),
      href: "/" + pathParts.slice(0, idx + 1).join("/"),
    })),
  ]

  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23] h-full">
      <div className="font-medium text-sm hidden sm:flex items-center space-x-1 truncate max-w-[300px]">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400 mx-1" />
            )}
            <Link
              href={item.href ?? "#"}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
        <NotificationPanel />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src="https://i.imgur.com/QYiF8AV.png"
              alt="User avatar"
              width={28}
              height={28}
              className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-8 sm:h-8 cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-background border-border rounded-lg shadow-lg"
          >
            <Profile01 avatar="https://i.imgur.com/QYiF8AV.png" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
