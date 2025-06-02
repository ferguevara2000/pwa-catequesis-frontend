"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Confirmacion } from "@/services/confirmacion"
import ConfirmacionManagement from "@/components/confirmacion/confirmacion-management"
import GenerarCertificadoGlobal from "@/components/certificates/global-certificate"

export default function ConfirmacionPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedConfirmacion, setSelectedConfirmacion] = useState<Confirmacion | undefined>()

  const handleCreate = () => {
    setSelectedConfirmacion(undefined)
    setFormOpen(true)
  }

  const handleEdit = (confirmacion: Confirmacion) => {
    setSelectedConfirmacion(confirmacion)
    setFormOpen(true)
  }

   const handleCertificate = () => {
      setShowModal(true)
    }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Libro de Confirmaciones Parroquial</h1>
          <Button onClick={handleCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Ingresar una Confirmacion
          </Button>
        </div>

        <ConfirmacionManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedConfirmacion(undefined)
          }}
          selectedConfirmacion={selectedConfirmacion}
          onEdit={handleEdit}
          onGenerarCertificado={handleCertificate}
        />

        <GenerarCertificadoGlobal
                            titulo="de Confirmación"
                            open={showModal}
                            onOpenChange={setShowModal}
                          />
      </div>
    </RoleProtectedRoute>
  )
}