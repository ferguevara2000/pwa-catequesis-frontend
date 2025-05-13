"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Movimiento } from "@/services/movimiento"
import MovimientoManagement from "@/components/finanzas/movimientos-management"

export default function MovimientoPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedMovimiento, setSelectedMovimiento] = useState<Movimiento | undefined>()

  const handleCreate = () => {
    setSelectedMovimiento(undefined)
    setFormOpen(true)
  }

  const handleEdit = (movimiento: Movimiento) => {
    setSelectedMovimiento(movimiento)
    setFormOpen(true)
  }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Movimientos Financieros Parroquiales</h1>
          <Button onClick={handleCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Ingresar un movimiento
          </Button>
        </div>

        <MovimientoManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedMovimiento(undefined)
          }}
          selectedMovimiento={selectedMovimiento}
          onEdit={handleEdit}
        />
      </div>
    </RoleProtectedRoute>
  )
}