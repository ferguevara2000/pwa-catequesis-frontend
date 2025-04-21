import { Role } from "@/types/user"
import {
    Receipt,
    Building2,
    CreditCard,
    Folder,
    Wallet,
    Settings,
    HelpCircle,
    Home,
    User,
  } from "lucide-react"

  interface NavItem {
    label: string
    href: string
    icon: React.ElementType
    roles: Role[] // quién puede ver este item
    section: string
  }
  
  export const sidebarMenu: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["Administrador", "Catequista", "Estudiante"],
      section: "Overview",
    },
    {
      label: "Usuarios",
      href: "/dashboard/usuarios",
      icon: User,
      roles: ["Administrador", "Catequista"],
      section: "Overview",
    },
    {
      label: "Organization",
      href: "/organization",
      icon: Building2,
      roles: ["Administrador"],
      section: "Overview",
    },
    {
      label: "Projects",
      href: "/projects",
      icon: Folder,
      roles: ["Administrador", "Catequista"],
      section: "Overview",
    },
    {
      label: "Transactions",
      href: "/transactions",
      icon: Wallet,
      roles: ["Administrador"],
      section: "Finance",
    },
    {
      label: "Invoices",
      href: "/invoices",
      icon: Receipt,
      roles: ["Administrador", "Catequista"],
      section: "Finance",
    },
    {
      label: "Payments",
      href: "/payments",
      icon: CreditCard,
      roles: ["Administrador"],
      section: "Finance",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["Administrador", "Catequista", "Estudiante"],
      section: "Other",
    },
    {
      label: "Help",
      href: "/help",
      icon: HelpCircle,
      roles: ["Administrador", "Catequista", "Estudiante"],
      section: "Other",
    },
  ]
  