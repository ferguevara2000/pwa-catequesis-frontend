"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Matrimonio } from "@/services/matrimonio"
import MatrimonioManagement from "@/components/matrimonio/matrimonio-management"
import GenerarCertificadoGlobal from "@/components/certificates/global-certificate"

export default function MatrimoniosPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedMatrimonio, setSelectedMatrimonio] = useState<Matrimonio | undefined>()

  const handleCreate = () => {
    setSelectedMatrimonio(undefined)
    setFormOpen(true)
  }

  const handleEdit = (matrimonio: Matrimonio) => {
    setSelectedMatrimonio(matrimonio)
    setFormOpen(true)
  }

  const handleCertificate = () => {
      setShowModal(true)
    }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Libro de Matrimonios Parroquial</h1>
          <Button onClick={handleCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Ingresar un Matrimonio
          </Button>
        </div>

        <MatrimonioManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedMatrimonio(undefined)
          }}
          selectedMatrimonio={selectedMatrimonio}
          onEdit={handleEdit}
          onGenerarCertificado={handleCertificate}
        />

        <GenerarCertificadoGlobal
                                    titulo="de Matrimonio"
                                    open={showModal}
                                    onOpenChange={setShowModal}
                                  />
      </div>
    </RoleProtectedRoute>
  )
}