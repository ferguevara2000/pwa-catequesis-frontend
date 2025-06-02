"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import UserManagement from "@/components/users/userManagement"
import { User } from "@/services/users"
import { ReporteDialog } from "@/components/reportes/ReportDialog"
import { exportToExcel, exportToPDF } from "@/lib/utils"

export default function UsuariosPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>()
  const [userData, setUserData] = useState<User[]>([])

  const handleCreate = () => {
    setSelectedUser(undefined)
    setFormOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormOpen(true)
  }

  const handleExportPDF = () => {
      if (!userData.length) return
      exportToPDF({
      data: userData,
      columns: [
        { header: "Nombre", key: "nombre" },
        { header: "Apellidos", key: "apellidos" },
        { header: "Nombre Usuario", key: "usuario" },
        { header: "Rol", key: "rol" },
        { header: "Email", key: "email" },
      ],
      title: "Reporte de Usuario",
      filename: "reporte_usuarios"
    })
    }

  const handleExportExcel = () => {
    if (!userData.length) return;

    const columns = [
        { header: "Nombre", key: "nombre" },
        { header: "Apellidos", key: "apellidos" },
        { header: "Nombre Usuario", key: "usuario" },
        { header: "Rol", key: "rol" },
        { header: "Email", key: "email" },
      ];

    exportToExcel(userData, columns, "Reporte de Usuario");
  };

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <div className="flex gap-2">
            <ReporteDialog onPdfClick={handleExportPDF} onExcelClick={handleExportExcel} />
            <Button onClick={handleCreate} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Crear Usuario
            </Button>
          </div>
        </div>

        <UserManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false)
            setSelectedUser(undefined)
          }}
          selectedUser={selectedUser}
          onEdit={handleEdit}
          onDataReady={(data) => setUserData(data)}
        />
      </div>
    </RoleProtectedRoute>
  )
}
