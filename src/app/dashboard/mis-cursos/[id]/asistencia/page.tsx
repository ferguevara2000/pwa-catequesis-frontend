"use client"

import React, { use, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Asistencia, createAsistencia, getAsistenciaByIdAndDate, updateAsistencia } from "@/services/asistencia"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { getAllEstudiantesByCursoId } from "@/services/estudianteCurso"

interface Estudiante {
  id: number
  usuario: {
    nombre: string
  }
}

export default function AsistenciaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [asistencias, setAsistencias] = useState<Record<number, Asistencia>>({}) // Aseguramos que el id sea un número
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const { id } = use(params)
  const fechaParam = searchParams.get("fecha")

  const fechaHoy = fechaParam ?? new Date().toISOString().split("T")[0]

  useEffect(() => {
    async function cargarDatos() {
      if (fechaParam) {
        // Modo edición
        const data = await getAsistenciaByIdAndDate(id, fechaParam)
        const asistenciasMap: Record<number, Asistencia> = {}
        const estudiantesMap: Estudiante[] = data.map((a) => {
          asistenciasMap[a.id!] = a // Usamos matricula_id como clave
          return {
            id: a.id!,
            matricula_id: a.estudiante?.id,
            usuario: { nombre: a.estudiante!.usuario.nombre }
          }
        })
        setEstudiantes(estudiantesMap)
        setAsistencias(asistenciasMap)
      } else {
        // Modo nuevo
        const data = await getAllEstudiantesByCursoId(id)
        setEstudiantes(data)
        const inicial: Record<number, Asistencia> = {}
        data.forEach((est) => {
          inicial[est.id] = { id: est.id, fecha: fechaHoy, estado: "Presente", matricula_id: est.usuario.id! } // Crear objeto AsistenciaDTO
        })
        setAsistencias(inicial)
      }
    }

    cargarDatos()
  }, [id, fechaParam, fechaHoy])

  const handleChange = (matriculaId: number, estado: string) => {
    setAsistencias(prev => ({
      ...prev,
      [matriculaId]: { ...prev[matriculaId], estado } // Actualizamos solo el estado
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    for (const matriculaId in asistencias) {
      const asistencia = asistencias[matriculaId]
      const estado = asistencia.estado
      const matricula_id = Number(asistencia.estudiante?.id)

      if (fechaParam) {
        await updateAsistencia({
          fecha: fechaHoy,
          estado,
          matricula_id,
        }, asistencia.id!.toString()) // Usamos matriculaId como ID
      } else {
        await createAsistencia({ fecha: fechaHoy, estado, matricula_id: Number(matriculaId) })
      }
    }

    toast.success("Asistencia guardada correctamente")
    router.push(`/dashboard/mis-cursos/${id}`)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Asistencia</CardTitle>
          <p className="text-muted-foreground">Marca la asistencia de los estudiantes</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Fecha: <span className="font-medium">{new Date(fechaHoy).toLocaleDateString("es-EC")}</span>
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <table className="min-w-full table-auto border-collapse text-left">
              <thead>
                <tr className="border-b border-muted">
                  <th className="py-2 w-12">#</th>
                  <th className="py-2">Nombre</th>
                  <th className="py-2 w-32 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est, index) => (
                  <tr key={est.id} className="border-b border-muted">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{est.usuario.nombre}</td>
                    <td className="py-2">
                      <Select
                        value={asistencias[est.id]?.estado} // Usamos el estado de AsistenciaDTO
                        onValueChange={(value) => handleChange(est.id, value)} // Pasamos el id como número
                      >
                        <SelectTrigger className="w-32 text-left">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Presente">Presente</SelectItem>
                          <SelectItem value="Falta">Falta</SelectItem>
                          <SelectItem value="Justificado">Justificado</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 text-right">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Guardar Asistencia
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
