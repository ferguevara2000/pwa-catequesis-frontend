"use client"

import { useEffect, useState } from "react"
import { BookOpenIcon, ClockIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Curso, getCursoByCatequistaId } from "@/services/cursos"
import Link from "next/link"


export default function CatequistaDashboard() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [nombreCompleto, setNombreCompleto] = useState("")
  const [proximaClase, setProximaClase] = useState<Curso | null>(null)

  useEffect(() => {
    const fetchCursos = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const nombre = `${user.nombre} ${user.apellidos}`
      setNombreCompleto(nombre)

      if (!user.id) return

      try {
        const cursosData = await getCursoByCatequistaId(user.id)
        setCursos(cursosData)

        if (cursosData.length > 0) {
          // Puedes ordenar por fecha si hay varias clases
          const sortedCursos = cursosData.sort((a, b) =>
            new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime()
          )
          setProximaClase(sortedCursos[0])
        }
      } catch (error) {
        console.error("Error al cargar cursos del catequista:", error)
      }
    }

    fetchCursos()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt={nombreCompleto} />
            <AvatarFallback>
              {nombreCompleto
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">¡Bienvenido(a), {nombreCompleto}!</h1>
            <p className="text-muted-foreground">Panel de Catequista</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cursos Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cursos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div> {/* Puedes hacerlo dinámico luego */}
          </CardContent>
        </Card>
      </div>

      {proximaClase && (
        <Card>
          <CardHeader>
            <CardTitle>Próxima Clase</CardTitle>
            <CardDescription>Información sobre tu próxima sesión de catequesis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-primary" />
              <span className="font-medium">{proximaClase.nombre}</span>
              <Badge variant="outline">{proximaClase.nivel.nombre}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span>{proximaClase.horario}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/mis-cursos">
                <Button className="cursor-pointer">Ver mis cursos</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
