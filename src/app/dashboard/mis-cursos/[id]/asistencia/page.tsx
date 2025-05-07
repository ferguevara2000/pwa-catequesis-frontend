// app/cursos/[id]/asistencia/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createAsistencia } from "@/services/asistencia"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Estudiante {
  id: string
  usuario: {
    nombre: string
  }
}

export default function AsistenciaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [asistencias, setAsistencias] = useState<Record<string, string>>({})
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const fechaHoy = new Date().toISOString().split("T")[0] // yyyy-mm-dd
  const { id } = React.use(params)

  // Cargar estudiantes desde el servidor
  useEffect(() => {
    fetch(`${API_URL}/estudiantesCurso/curso/${id}`)
    .then(res => res.json())
    .then(data => {
      setEstudiantes(data)
      const asistenciaInicial: Record<string, string> = {}
      data.forEach((est: Estudiante) => {
        asistenciaInicial[est.id] = "Presente"
      })
      setAsistencias(asistenciaInicial)
    })
  }, [id])

  const handleChange = (matriculaId: string, estado: string) => {
    setAsistencias(prev => ({
      ...prev,
      [matriculaId]: estado,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    for (const matriculaId in asistencias) {
      const estado = asistencias[matriculaId]
      const matricula_id = Number(matriculaId)
      const asistenciaGuardada= await createAsistencia({
        fecha: fechaHoy,
        estado,
        matricula_id,
      })
      console.log(asistenciaGuardada)
    }

    toast.success('Asistencia guardada correctamente')
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
                        defaultValue="Presente"
                        onValueChange={(value) => handleChange(est.id, value)}
                      >
                        <SelectTrigger className="w-32 text-left">
                          <SelectValue />
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
