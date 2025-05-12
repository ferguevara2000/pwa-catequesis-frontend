"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Finanza } from "@/services/finanzas"
import FinanzaManagement from "@/components/finanzas/finanzas-magement"

export default function FinanzaPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedFinanza, setSelectedFinanza] = useState<Finanza | undefined>()

  const handleCreate = () => {
    setSelectedFinanza(undefined)
    setFormOpen(true)
  }

  const handleEdit = (finanza: Finanza) => {
    setSelectedFinanza(finanza)
    setFormOpen(true)
  }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finanzas Parroquiales</h1>
          <Button onClick={handleCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Ingresar un barrio
          </Button>
        </div>

        <FinanzaManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedFinanza(undefined)
          }}
          selectedFinanza={selectedFinanza}
          onEdit={handleEdit}
        />
      </div>
    </RoleProtectedRoute>
  )
}