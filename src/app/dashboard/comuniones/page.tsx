"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Comunion } from "@/services/comunion"
import ComunionManagement from "@/components/comunion/comunion-management"

export default function ComunionPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedComunion, setSelectedComunion] = useState<Comunion | undefined>()

  const handleCreate = () => {
    setSelectedComunion(undefined)
    setFormOpen(true)
  }

  const handleEdit = (comunion: Comunion) => {
    setSelectedComunion(comunion)
    setFormOpen(true)
  }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Libro de Comuniones Parroquial</h1>
          <Button onClick={handleCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Ingresar una Primera Comunión
          </Button>
        </div>

        <ComunionManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedComunion(undefined)
          }}
          selectedComunion={selectedComunion}
          onEdit={handleEdit}
        />
      </div>
    </RoleProtectedRoute>
  )
}