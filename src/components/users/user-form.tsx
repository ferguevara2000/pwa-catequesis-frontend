import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UserForm({ open, onClose, user }: { open: boolean, onClose: () => void, user?: any }) {
  const [formData, setFormData] = useState({ name: "", email: "", role: "" })

  useEffect(() => {
    if (user) {
      setFormData(user)
    } else {
      setFormData({ name: "", email: "", role: "" })
    }
  }, [user])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    // Aquí puedes llamar a tu API para crear o actualizar
    console.log("Guardando usuario:", formData)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Editar usuario" : "Crear nuevo usuario"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Nombre" name="name" value={formData.name} onChange={handleChange} />
          <Input placeholder="Correo" name="email" value={formData.email} onChange={handleChange} />
          <Input placeholder="Rol" name="role" value={formData.role} onChange={handleChange} />
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit}>
            {user ? "Guardar cambios" : "Crear"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
