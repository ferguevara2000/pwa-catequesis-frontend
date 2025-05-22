"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { actualizarContraseña, getUserById, updateUser } from "@/services/users"
import { toast } from "sonner"

export default function UserProfileForm() {
  const [user, setUser] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    phone: "",
    usuario: "",
    rol: "",
    barrio: "",
    representante: "",
    nueva_contraseña: "",
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const { id } = JSON.parse(storedUser)
      getUserById(id).then(data => {
        setUser(prev => ({
          ...prev,
          ...data,
        }))
      })
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) return

    const { id } = JSON.parse(storedUser)

    const success = await updateUser(
      {
        ...user,
        representante: "" // <-- Valor manual aquí
      },
      id
    )

    if (success) {
      toast.success("Datos actualizados con exito")
    } else {
      toast.error("Error al actualizar los datos")
    }
  }

  const [passwordForm, setPasswordForm] = useState({
    actual: "",
    nueva: "",
    repetir: "",
  })

  const [passwordErrors, setPasswordErrors] = useState({
    actual: "",
    nueva: "",
    repetir: "",
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
    setPasswordErrors(prev => ({ ...prev, [name]: "" })) // limpiar error al escribir
  }

  const handlePasswordSave = async () => {
  const { actual, nueva, repetir } = passwordForm;

  // Validaciones de formulario
  if (!actual) {
    setPasswordErrors(prev => ({ ...prev, actual: "Ingresa tu contraseña actual" }));
    return;
  }

  if (!nueva) {
    setPasswordErrors(prev => ({ ...prev, nueva: "Ingresa la nueva contraseña" }));
    return;
  }

  if (nueva.length < 8) {
    setPasswordErrors(prev => ({
      ...prev,
      nueva: "La contraseña debe tener al menos 8 caracteres",
    }));
    return;
  }

  if (!/[A-Z]/.test(nueva)) {
    setPasswordErrors(prev => ({
      ...prev,
      nueva: "La contraseña debe contener al menos una letra mayúscula",
    }));
    return;
  }

  if (!/[0-9]/.test(nueva)) {
    setPasswordErrors(prev => ({
      ...prev,
      nueva: "La contraseña debe contener al menos un número",
    }));
    return;
  }

  if (nueva !== repetir) {
    setPasswordErrors(prev => ({
      ...prev,
      repetir: "Las contraseñas no coinciden",
    }));
    return;
  }

  try {
    const id = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).id : null;
    if (!id) return alert("Usuario no encontrado");

    const resultado = await actualizarContraseña(id, actual, nueva);

    if (!resultado.success) {
      if (resultado.message === "La contraseña actual es incorrecta") {
        setPasswordErrors(prev => ({
          ...prev,
          actual: resultado.message,
        }));
      } else {
        toast.error(resultado.message);
      }
      return; // ❌ Evita continuar si hubo error
    }

    // ✅ Solo si fue exitoso
    toast.success(resultado.message);
    setPasswordForm({ actual: "", nueva: "", repetir: "" });
    setPasswordErrors({ actual: "", nueva: "", repetir: "" });
  } catch (error) {
    console.error(error);
    toast.error("Error inesperado");
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Editar perfil de usuario</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" value={user.nombre} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input id="apellidos" name="apellidos" value={user.apellidos} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" name="email" type="email" value={user.email} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" value={user.phone} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="usuario">Usuario</Label>
          <Input id="usuario" value={user.usuario} readOnly />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rol">Rol</Label>
          <Input id="rol" value={user.rol} readOnly />
        </div>

        <div className="space-y-2">
          <Label htmlFor="barrio">Barrio</Label>
          <Input id="barrio" value={user.barrio.nombre} readOnly />
        </div>

        <div className="space-y-2">
          <Label>Contraseña</Label>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full cursor-pointer">Cambiar contraseña</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cambiar contraseña</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="actual">Contraseña actual</Label>
                  <Input
                    id="actual"
                    name="actual"
                    type="password"
                    value={passwordForm.actual}
                    onChange={handlePasswordChange}
                  />
                  {passwordErrors.actual && <p className="text-sm text-red-500">{passwordErrors.actual}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="nueva">Nueva contraseña</Label>
                  <Input
                    id="nueva"
                    name="nueva"
                    type="password"
                    value={passwordForm.nueva}
                    onChange={handlePasswordChange}
                  />
                  {passwordErrors.nueva && <p className="text-sm text-red-500">{passwordErrors.nueva}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="repetir">Repetir nueva contraseña</Label>
                  <Input
                    id="repetir"
                    name="repetir"
                    type="password"
                    value={passwordForm.repetir}
                    onChange={handlePasswordChange}
                  />
                  {passwordErrors.repetir && <p className="text-sm text-red-500">{passwordErrors.repetir}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" className={"cursor-pointer"} onClick={handlePasswordSave}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="pt-4">
        <Button className="w-full cursor-pointer" onClick={handleSave}>
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}
