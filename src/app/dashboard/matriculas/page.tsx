"use client"

import MatriculasManagement from '@/components/matriculas/matriculas-management'
import { ReporteDialog } from '@/components/reportes/ReportDialog'
import RoleProtectedRoute from '@/components/RoleProtectedRoute'
import { Button } from '@/components/ui/button'
import { exportToExcel, exportToPDF } from '@/lib/utils'
import { estudianteCurso } from '@/services/estudianteCurso'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function MatriculasPage() {
    const [formOpen, setFormOpen] = useState(false)
    const [selectedEstudianteCurso, setselectedEstudianteCurso] = useState<estudianteCurso | undefined>()
    const [matriculasData, setMatriculasData] = useState<estudianteCurso[]>([])

    const handleCreate = () => {
        setselectedEstudianteCurso(undefined)
        setFormOpen(true)
    }

    const handleEdit = (curso: estudianteCurso) => {
        console.log(curso)
        setselectedEstudianteCurso(curso)
        setFormOpen(true)
      }

    const handleExportPDF = () => {
      if (!matriculasData.length) return
      exportToPDF({
      data: matriculasData,
      columns: [
        { header: "Estudiante", key: "usuario_nombre" },
        { header: "Curso", key: "curso_nombre" },
        { header: "Estado", key: "estado" },
      ],
      title: "Reporte de Estudiantes",
      filename: "reporte_matriculas"
    })
    }

  const handleExportExcel = () => {
    if (!matriculasData.length) return;

    const columns = [
      { header: "Estudiante", key: "usuario_nombre" },
        { header: "Curso", key: "curso_nombre" },
        { header: "Estado", key: "estado" },
    ];

    exportToExcel(matriculasData, columns, "Reporte de Estudiantes");
  };

  return(
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asignación de Cursos - Estudiantes</h1>
            <div className="flex gap-2">
            <ReporteDialog onPdfClick={handleExportPDF} onExcelClick={handleExportExcel} />
            <Button onClick={handleCreate} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Asignar Curso
            </Button>
          </div>
            </div>

            <MatriculasManagement
                      formOpen={formOpen}
                      onCloseForm={() => {
                        setFormOpen(false)
                        setselectedEstudianteCurso(undefined)
                      }}
                      selectedestudianteCurso={selectedEstudianteCurso}
                      onEdit={handleEdit}
                      onDataReady={(data) => setMatriculasData(data)}
                    />
        </div>
    </RoleProtectedRoute>
  )
}
