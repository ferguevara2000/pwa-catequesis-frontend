import { Role } from "@/types/user"
import {
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
      label: "Ayuda",
      href: "/help",
      icon: HelpCircle,
      roles: ["Administrador", "Catequista", "Estudiante"],
      section: "Other",
    },
  ]
  