"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CursosManagement from "@/components/cursos/cursos-management"
import { Curso } from "@/services/cursos"
import { ReporteDialog } from "@/components/reportes/ReportDialog"
import { exportToExcel, exportToPDF } from "@/lib/utils"

export default function CursosPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCurso, setSelectedCurso] = useState<Curso | undefined>()
  const [cursosData, setCursosData] = useState<Curso[]>([])

  const handleCreate = () => {
    setSelectedCurso(undefined)
    setFormOpen(true)
  }

  const handleEdit = (curso: Curso) => {
    console.log(curso)
    setSelectedCurso(curso)
    setFormOpen(true)
  }
  
  const handleExportPDF = () => {
    if (!cursosData.length) return
    exportToPDF({
    data: cursosData,
    columns: [
      { header: "Nombre", key: "nombre" },
      { header: "Nivel", key: "nivel_nombre" },
      { header: "Horario", key: "horario" },
    ],
    title: "Reporte de Cursos",
    filename: "reporte_cursos"
  })
  }

const handleExportExcel = () => {
  if (!cursosData.length) return;

  const columns = [
    { key: "nombre", header: "Nombre" },
    { key: "nivel_nombre", header: "Nivel" },
    { key: "horario", header: "Horario" }
  ];

  exportToExcel(cursosData, columns, "Reporte de Cursos");
};

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Cursos</h1>
          <div className="flex gap-2">
            <ReporteDialog onPdfClick={handleExportPDF} onExcelClick={handleExportExcel} />
            <Button onClick={handleCreate} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Crear curso
            </Button>
          </div>
        </div>

        <CursosManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedCurso(undefined)
          }}
          selectedCursos={selectedCurso}
          onEdit={handleEdit}
          onDataReady={(data) => setCursosData(data)}
        />
      </div>
    </RoleProtectedRoute>
  )
}
