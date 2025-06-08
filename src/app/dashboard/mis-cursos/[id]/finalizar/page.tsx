/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Importa tu función para obtener los datos
import { getPorcentajeAsistenciaByUser } from "@/services/asistencia" 
import { createCertificacion } from "@/services/certificaciones"
import { toast } from "sonner"

interface EstudianteResumen {
  matricula_id: number
  nombre: string
  total_sesiones: number
  asistencias: number
  porcentaje_asistencia: number
}

export default function ResumenAsistenciaPage() {
  const { id: cursoId } = useParams()
  const router = useRouter() // ✅ Inicializa el router
  const [data, setData] = useState<EstudianteResumen[]>([])
  const [loading, setLoading] = useState(false)
  const [resultados, setResultados] = useState<Record<number, string>>({})

  useEffect(() => {
    if (!cursoId) return
    setLoading(true)
    getPorcentajeAsistenciaByUser(cursoId as string)
      .then((res: any) => {
        setData(res)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }, [cursoId])

  const handleSelectChange = (matricula_id: number, value: string) => {
    setResultados((prev) => ({
      ...prev,
      [matricula_id]: value,
    }))
  }

const handleGuardar = async () => {
  try {
    const aprobados = data.filter((est) => resultados[est.matricula_id] === "Aprobar")

    if (aprobados.length === 0) {
      console.log("No hay estudiantes aprobados para certificar")
      toast.info("No hay estudiantes aprobados para certificar")
      return
    }

    for (const estudiante of aprobados) {
      await createCertificacion({
        matricula_id: estudiante.matricula_id,
        porcentaje_asistencia: estudiante.porcentaje_asistencia,
      })
    }

    toast.success("Certificaciones generadas exitosamente")

    // ✅ Redirige después de un pequeño delay (opcional para que se vea el toast)
    setTimeout(() => {
      router.push("/dashboard/mis-cursos")
    }, 1500)
    
  } catch (error) {
    console.error("Error al guardar certificaciones:", error)
    toast.error("Ocurrió un error al guardar las certificaciones")
  }
}



  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-500">Cargando datos...</div>
  }

  if (!data.length) {
    return <div className="p-8 text-center text-gray-500">No hay datos para mostrar</div>
  }

  return (
<div className="max-w-6xl mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-8 text-primary">Resumen de Asistencia</h1>

      <Table>
        <TableCaption>Resumen de asistencia y estado del curso</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-center">Total Sesiones</TableHead>
            <TableHead className="text-center">Asistencias</TableHead>
            <TableHead className="text-center">% Asistencia</TableHead>
            <TableHead className="text-center">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ matricula_id, nombre, total_sesiones, asistencias, porcentaje_asistencia }) => (
            <TableRow key={matricula_id}>
              <TableCell>{nombre}</TableCell>
              <TableCell className="text-center font-medium">{total_sesiones}</TableCell>
              <TableCell className="text-center font-medium">{asistencias}</TableCell>
              <TableCell className="text-center font-semibold text-primary">{porcentaje_asistencia}%</TableCell>
              <TableCell className="text-center">
                <Select
                  value={resultados[matricula_id] || ""}
                  onValueChange={(value) => handleSelectChange(matricula_id, value)}
                  defaultValue=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aprobar">Aprobar</SelectItem>
                    <SelectItem value="Reprobar">Reprobar</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-8">
        <Button onClick={handleGuardar} className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white">
          Guardar Resultados
        </Button>
      </div>
    </div>
  )
}