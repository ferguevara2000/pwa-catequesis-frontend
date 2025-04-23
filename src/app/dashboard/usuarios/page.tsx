"use client"

import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import UserTable from "@/components/users/user-table"
import UserForm from "@/components/users/user-form"

export default function UsuariosPage() {
  const [openForm, setOpenForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setOpenForm(true)
  }

  const handleCreate = () => {
    setSelectedUser(null)
    setOpenForm(true)
  }

    return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>    
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Crear usuario
        </Button>
      </div>

      <UserTable onEdit={handleEdit} />

      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        user={selectedUser}
      />
    </div>
    </RoleProtectedRoute>

    )
  }