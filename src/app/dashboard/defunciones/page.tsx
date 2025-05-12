"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Defuncion } from "@/services/defuncion"
import DefuncionManagement from "@/components/defuncion/defuncion-management"

export default function DefuncionPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedDefuncion, setSelectedDefuncion] = useState<Defuncion | undefined>()

  const handleCreate = () => {
    setSelectedDefuncion(undefined)
    setFormOpen(true)
  }

  const handleEdit = (Defuncion: Defuncion) => {
    setSelectedDefuncion(Defuncion)
    setFormOpen(true)
  }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Libro de Defunciones Parroquial</h1>
          <Button onClick={handleCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Ingresar una Defunción
          </Button>
        </div>

        <DefuncionManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedDefuncion(undefined)
          }}
          selectedDefuncion={selectedDefuncion}
          onEdit={handleEdit}
        />
      </div>
    </RoleProtectedRoute>
  )
}