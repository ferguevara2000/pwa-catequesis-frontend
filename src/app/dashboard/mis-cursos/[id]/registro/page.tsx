"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getFechasDeAsistenciaPorCurso, getAsistenciaByIdAndDate } from "@/services/asistencia"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Eye } from "lucide-react"

function formatFechaHumana(fechaIso: string) {
  const fecha = new Date(fechaIso)
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha)
}

interface Asistencia {
  id: number
  estado: string
  estudiante: {
    usuario: {
      nombre: string
    }
  }
}

export default function RegistroAsistenciaPage() {
  const { id: cursoId } = useParams()
  const [fechas, setFechas] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [asistenciaDia, setAsistenciaDia] = useState<Asistencia[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null)

  useEffect(() => {
    if (cursoId) {
      getFechasDeAsistenciaPorCurso(cursoId as string).then((data) => {
        setFechas(data)
        setLoading(false)
      })
    }
  }, [cursoId])

  const abrirDetalles = async (fecha: string) => {
    const data = await getAsistenciaByIdAndDate(cursoId as string, fecha)
    setAsistenciaDia(data)
    setFechaSeleccionada(fecha)
    setDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-xl border border-border bg-background text-foreground">
        <CardHeader className="bg-muted px-6 py-4">
          <CardTitle className="text-2xl font-bold">Registros de Asistencia</CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando registros...</span>
            </div>
          ) : fechas.length === 0 ? (
            <p className="text-muted-foreground">No se han registrado asistencias aún.</p>
          ) : (
            <ul className="space-y-3">
              {fechas.map((fecha, index) => (
                <li
                  key={fecha}
                  className="flex justify-between items-center bg-card border rounded-lg p-4 hover:shadow-md transition"
                >
                  <span className="font-medium text-foreground">
                    {index + 1}. Registro del {formatFechaHumana(fecha)}
                  </span>
                  <Button variant="secondary" size="sm" className="cursor-pointer" onClick={() => abrirDetalles(fecha)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalles
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Detalles de Asistencia —{" "}
              {fechaSeleccionada ? formatFechaHumana(fechaSeleccionada) : ""}
            </DialogTitle>
          </DialogHeader>

          {asistenciaDia.length === 0 ? (
            <p className="text-muted-foreground">No hay datos disponibles.</p>
          ) : (
            <table className="min-w-full table-auto border-collapse text-left mt-4">
              <thead>
                <tr className="border-b border-muted">
                  <th className="py-2 w-12">#</th>
                  <th className="py-2">Estudiante</th>
                  <th className="py-2 w-32">Estado</th>
                </tr>
              </thead>
              <tbody>
                {asistenciaDia.map((a, idx) => (
                  <tr key={a.id} className="border-b border-muted">
                    <td className="py-2">{idx + 1}</td>
                    <td className="py-2">{a.estudiante.usuario.nombre}</td>
                    <td className="py-2">{a.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
