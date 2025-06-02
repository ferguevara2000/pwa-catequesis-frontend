"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import BautismoManagement from "@/components/bautismo/bautismo-management"
import { Bautismo } from "@/services/bautismos"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import GenerarCertificadoModal from "@/components/certificates/bautismo-certificate"

export default function BautismoPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedBautismo, setSelectedBautismo] = useState<Bautismo | undefined>()

  const handleCreate = () => {
    setSelectedBautismo(undefined)
    setFormOpen(true)
  }

  const handleEdit = (bautismo: Bautismo) => {
    setSelectedBautismo(bautismo)
    setFormOpen(true)
  }

  const handleCertificate = (bautismo: Bautismo) => {
    setSelectedBautismo(bautismo)
    setShowModal(true)
  }

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Libro de Bautismos Parroquial</h1>
          <Button onClick={handleCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Ingresar un bautismo
          </Button>
        </div>

        <BautismoManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedBautismo(undefined)
          }}
          selectedBautismos={selectedBautismo}
          onEdit={handleEdit}
          onGenerarCertificado={handleCertificate}
        />

        {selectedBautismo && (
          <GenerarCertificadoModal
            item={selectedBautismo}
            open={showModal}
            onOpenChange={setShowModal}
          />
        )}
      </div>
    </RoleProtectedRoute>
  )
}
