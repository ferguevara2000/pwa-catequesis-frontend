import { Role } from "@/types/user"
import {
    HelpCircle,
    Home,
    Shapes,
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
      section: "General",
    },
    {
      label: "Usuarios",
      href: "/dashboard/usuarios",
      icon: User,
      roles: ["Administrador"],
      section: "General",
    },
    {
      label: "Cursos",
      href: "/dashboard/cursos",
      icon: Shapes,
      roles: ["Administrador"],
      section: "General",
    },
    {
      label: "Ayuda",
      href: "/help",
      icon: HelpCircle,
      roles: ["Administrador", "Catequista", "Estudiante"],
      section: "Other",
    },
  ]
  