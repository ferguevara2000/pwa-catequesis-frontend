"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CursosManagement from "@/components/cursos/cursos-management"
import { Curso } from "@/services/cursos"

export default function CursosPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCurso, setSelectedCurso] = useState<Curso | undefined>()

  const handleCreate = () => {
    setSelectedCurso(undefined)
    setFormOpen(true)
  }

  const handleEdit = (curso: Curso) => {
    console.log(curso)
    setSelectedCurso(curso)
    setFormOpen(true)
  }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Cursos</h1>
          <Button onClick={handleCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Crear curso
          </Button>
        </div>

        <CursosManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedCurso(undefined)
          }}
          selectedCursos={selectedCurso}
          onEdit={handleEdit}
        />
      </div>
    </RoleProtectedRoute>
  )
}
