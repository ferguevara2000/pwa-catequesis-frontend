import { Role } from "@/types/user"
import {
  CalendarHeart,
  Church,
  Cookie,
  Droplet,
    HelpCircle,
    Home,
    School,
    Shapes,
    User,
    Wine,
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
      label: "Matriculación",
      href: "/dashboard/matriculas",
      icon: School,
      roles: ["Administrador"],
      section: "General",
    },
    {
      label: "Mis Cursos",
      href: "/dashboard/mis-cursos",
      icon: School,
      roles: ["Catequista"],
      section: "General",
    },
    {
      label: "Bautismos",
      href: "/dashboard/bautismos",
      icon: Droplet,
      roles: ["Administrador"],
      section: "Libros Parroquiales",
    },
    {
      label: "Primera Comunión",
      href: "/dashboard/primera-comunion",
      icon: Wine,
      roles: ["Administrador"],
      section: "Libros Parroquiales",
    },
    {
      label: "Confirmaciones",
      href: "/dashboard/confirmaciones",
      icon: Cookie,
      roles: ["Administrador"],
      section: "Libros Parroquiales",
    },
    {
      label: "Matrimonios",
      href: "/dashboard/matrimonios",
      icon: Church,
      roles: ["Administrador"],
      section: "Libros Parroquiales",
    },
    {
      label: "Defunciones",
      href: "/dashboard/defunciones",
      icon: CalendarHeart,
      roles: ["Administrador"],
      section: "Libros Parroquiales",
    },
    {
      label: "Ayuda",
      href: "/help",
      icon: HelpCircle,
      roles: ["Administrador", "Catequista", "Estudiante"],
      section: "Other",
    },
  ]
  