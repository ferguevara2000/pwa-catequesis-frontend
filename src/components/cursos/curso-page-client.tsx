/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  Calendar,
  ClipboardCheck,
  Clock,
  GraduationCap,
  User,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getAsistenciaByIdAndDate } from "@/services/asistencia"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface CursoPageClientProps {
  curso: any
  estudiantes: any[]
  id: string
}

export default function CursoPageClient({
  curso,
  estudiantes,
  id,
}: CursoPageClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mostrarDialog, setMostrarDialog] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [fechaActual, setFechaActual] = useState("")

  const handleClick = async () => {
    setLoading(true)
    const hoy = format(new Date(), "yyyy-MM-dd")
    setFechaActual(hoy)

    const asistencia = await getAsistenciaByIdAndDate(id, hoy)
    setLoading(false)

    if (asistencia && asistencia.length > 0) {
      setMostrarDialog(true)
    } else {
      router.push(`/dashboard/mis-cursos/${id}/asistencia`)
    }
  }

  const handleEditar = () => {
    router.push(`/dashboard/mis-cursos/${id}/asistencia?edit=true&fecha=${fechaActual}`)
    setMostrarDialog(false)
  }

  const handleConfirmarFinalizar = () => {
    setShowDialog(false)
    router.push(`/dashboard/mis-cursos/${id}/finalizar`)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto shadow-xl border border-border bg-background text-foreground">
        <CardHeader className="px-6 py-5 bg-muted">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">{curso.nombre}</CardTitle>
              <CardDescription className="mt-1 text-base text-muted-foreground">
                {curso.descripcion}
              </CardDescription>
            </div>
            <Badge className="bg-blue-600 text-white hover:bg-blue-700">
              {curso.nivel.nombre}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InfoBlock
              icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
              label="Fechas"
              value={`${curso.fecha_inicio} - ${curso.fecha_fin}`}
            />
            <InfoBlock
              icon={<Clock className="h-5 w-5 text-muted-foreground" />}
              label="Horario"
              value={curso.horario}
            />
            <InfoBlock
              icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />}
              label="Nivel"
              value={curso.nivel.nombre}
            />
            <InfoBlock
              icon={<User className="h-5 w-5 text-muted-foreground" />}
              label="Catequista"
              value={curso.catequista!.nombre}
            />
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-4">
  <h3 className="font-semibold">Listado de Estudiantes</h3>
  <div className="flex gap-3 flex-wrap">
    <Button
        className="bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer group relative overflow-hidden transition-all duration-300 active:scale-95"
        onClick={() => setShowDialog(true)}
      >
        <span className="relative flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          Finalizar Curso
        </span>
      </Button>
    
    <Button
      className="bg-green-600 hover:bg-green-700 text-white cursor-pointer group relative overflow-hidden transition-all duration-300 active:scale-95"
      onClick={() => router.push(`/dashboard/mis-cursos/${id}/registro`)}
    >
      <span className="relative flex items-center gap-2">
        <ClipboardCheck className="w-4 h-4" />
        Ver Registros
      </span>
    </Button>

    <Button
      className="bg-sky-500/75 hover:bg-sky-500/50 text-white cursor-pointer group relative overflow-hidden transition-all duration-300 active:scale-95"
      onClick={handleClick}
      disabled={loading}
    >
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
      <span className="relative flex items-center gap-2">
        <ClipboardCheck className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" />
        {loading ? "Cargando..." : "Pasar Lista"}
      </span>
    </Button>
  </div>
</div>


            {estudiantes?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Nombre del Estudiante</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudiantes.map((estudiante: any, index: number) => (
                    <TableRow key={estudiante.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{estudiante.usuario.nombre}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={
                            estudiante.estado === "activo"
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-cyan-500 hover:bg-red-700"
                          }
                        >
                          {estudiante.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">
                No hay estudiantes registrados en este curso.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asistencia ya registrada</DialogTitle>
          </DialogHeader>
          <p>¿Deseas editar la lista de asistencia existente?</p>
          <DialogFooter>
            <Button className="cursor-pointer" variant="secondary" onClick={() => setMostrarDialog(false)}>
              Cancelar
            </Button>
            <Button className="cursor-pointer" onClick={handleEditar}>Editar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

            {/* Dialog Finalizar Curso*/}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar curso de catequesis</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Estás a punto de finalizar este curso de catequesis. Esto significa que se evaluará a los estudiantes y se asignarán al siguiente nivel si han cumplido los requisitos.
            <br /><br />
            Esta acción es irreversible. ¿Estás seguro de continuar? Se abrira la pagina de finalización.
          </p>
          <DialogFooter>
            <Button className="cursor-pointer" variant="secondary" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarFinalizar} className="bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer">
              Sí, finalizar curso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type InfoBlockProps = {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoBlock({ icon, label, value }: InfoBlockProps) {
  return (
    <div className="flex items-start space-x-3">
      {icon}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
