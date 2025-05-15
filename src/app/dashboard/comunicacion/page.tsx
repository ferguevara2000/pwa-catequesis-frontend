"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import ComunicacionManagement from "@/components/comunicacion/comunicacion-management"
import { Comunicacion } from "@/services/comunicacion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ComunicacionPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedComunicacion, setSelectedComunicacion] = useState<Comunicacion | undefined>()

  const handleCreate = () => {
    setSelectedComunicacion(undefined)
    setFormOpen(true)
  }

  const handleEdit = (comunicacion: Comunicacion) => {
    console.log(comunicacion)
    setSelectedComunicacion(comunicacion)
    setFormOpen(true)
  }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comunicaciones Parroquiales</h1>
          <Button onClick={handleCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Ingresar una Comunicación
          </Button>
        </div>

        <ComunicacionManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedComunicacion(undefined)
          }}
          selectedComunicacions={selectedComunicacion}
          onEdit={handleEdit}
        />
      </div>
    </RoleProtectedRoute>
  )
}