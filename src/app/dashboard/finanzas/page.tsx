"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Finanza } from "@/services/finanzas"
import FinanzaManagement from "@/components/finanzas/finanzas-magement"

export default function FinanzaPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedFinanza, setSelectedFinanza] = useState<Finanza | undefined>()

  const handleEdit = (finanza: Finanza) => {
    setSelectedFinanza(finanza)
    setFormOpen(true)
  }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">

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