import { CalendarIcon, BookOpenIcon, ClockIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Datos de ejemplo - normalmente vendrían de una API o base de datos
const catequistaData = {
  nombre: "María González",
  cursos: [
    {
      id: 3,
      nombre: "Curso de prueba",
      descripcion: "Descripción Curso de prueba",
      fecha_inicio: "2025-04-29",
      fecha_fin: "2025-04-29",
      horario: "Domingo, 8:00 am",
      nivel: {
        id: 2,
        nombre: "Primera Comunión",
      },
    },
  ],
}

export default function CatequistaDashboard() {
  // Calcular la próxima clase
  const proximaClase = catequistaData.cursos[0]
  const fechaProxima = new Date(proximaClase.fecha_inicio)
  const hoy = new Date()
  const diasRestantes = Math.ceil((fechaProxima.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt={catequistaData.nombre} />
            <AvatarFallback>
              {catequistaData.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">¡Bienvenido(a), {catequistaData.nombre}!</h1>
            <p className="text-muted-foreground">Panel de Catequista</p>
          </div>
        </div>
        <Button>Ver mi perfil</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cursos Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{catequistaData.cursos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

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
          <div className="flex items-center gap-2 text-amber-600">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium">
              {diasRestantes > 0
                ? `Faltan ${diasRestantes} días para esta clase`
                : diasRestantes === 0
                  ? "¡Esta clase es hoy!"
                  : "Esta clase ya pasó"}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Ver mis cursos</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
