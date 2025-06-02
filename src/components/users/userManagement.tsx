import { toast } from "sonner"
import UserForm from "./user-form"
import UserTable from "./user-table"
import { deleteUser, getAllUsers, User } from "@/services/users"
import { useEffect, useState } from "react"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedUser?: User
  onEdit: (user: User) => void
  onDataReady?: (data: User[]) => void
}

export default function UserManagement({ formOpen, onCloseForm, selectedUser, onEdit, onDataReady }: Props) {
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
    }
  }

  useEffect(() => {
    onDataReady?.(users) // tablaDatos es tu array de cursos actuales
  }, [users, onDataReady])

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchUsers() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id!.toString());
      toast.success("Usuario eliminado correctamente");
      fetchUsers(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar usuario");
      console.error(error);
    }
  };

  return (
    <>
      <UserForm open={formOpen} onClose={handleClose} user={selectedUser} />
      <UserTable users={users} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
