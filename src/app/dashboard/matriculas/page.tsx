"use client"

import MatriculasManagement from '@/components/matriculas/matriculas-management'
import RoleProtectedRoute from '@/components/RoleProtectedRoute'
import { Button } from '@/components/ui/button'
import { estudianteCurso } from '@/services/estudianteCurso'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function MatriculasPage() {
    const [formOpen, setFormOpen] = useState(false)
      const [selectedEstudianteCurso, setselectedEstudianteCurso] = useState<estudianteCurso | undefined>()

    const handleCreate = () => {
        setselectedEstudianteCurso(undefined)
        setFormOpen(true)
    }

    const handleEdit = (curso: estudianteCurso) => {
        console.log(curso)
        setselectedEstudianteCurso(curso)
        setFormOpen(true)
      }

  return(
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asignación de Cursos</h1>
            <Button onClick={handleCreate} className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Asignar curso
            </Button>
            </div>

            <MatriculasManagement
                      formOpen={formOpen}
                      onCloseForm={() => {
                        setFormOpen(false)
                        setselectedEstudianteCurso(undefined)
                      }}
                      selectedestudianteCurso={selectedEstudianteCurso}
                      onEdit={handleEdit}
                    />
        </div>
    </RoleProtectedRoute>
  )
}
