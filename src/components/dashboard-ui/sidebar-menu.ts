import { Role } from "@/types/user"
import {
  BanknoteArrowUp,
  CalendarHeart,
  Church,
  CircleDollarSign,
  Cookie,
  Droplet,
    FileTextIcon,
    HelpCircle,
    Home,
    Mic,
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
      roles: ["Catequista", "Estudiante", "Tesorero"],
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
      label: "Usuarios",
      href: "/dashboard/usuarios",
      icon: User,
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
      label: "Comunicación",
      href: "/dashboard/comunicacion",
      icon: Mic,
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
      label: "Mis Cursos",
      href: "/dashboard/cursos-estudiantes",
      icon: School,
      roles: ["Estudiante"],
      section: "General",
    },
    {
      label: "Sacramentos",
      href: "/dashboard/certificados",
      icon: FileTextIcon,
      roles: ["Estudiante"],
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
      href: "/dashboard/comuniones",
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
      label: "Finanzas",
      href: "/dashboard/finanzas",
      icon: CircleDollarSign,
      roles: ["Administrador"],
      section: "Finanzas",
    },
    {
      label: "Movimientos",
      href: "/dashboard/movimientos",
      icon: BanknoteArrowUp,
      roles: ["Administrador"],
      section: "Finanzas",
    },
    {
      label: "Movimientos",
      href: "/dashboard/movimientos-tesorero",
      icon: BanknoteArrowUp,
      roles: ["Tesorero"],
      section: "Finanzas",
    },
    {
      label: "Ayuda",
      href: "/contact-admin",
      icon: HelpCircle,
      roles: ["Catequista", "Estudiante", "Tesorero"],
      section: "Otros",
    },
  ]
  