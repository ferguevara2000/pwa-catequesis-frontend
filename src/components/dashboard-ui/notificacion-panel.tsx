// components/NotificationPanel.tsx
"use client"

import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AlertCircle, Bell, Calendar, Trash2 } from "lucide-react"
import {
  obtenerNotificacionesPorUsuario,
  marcarNotificacionComoLeida,
  eliminarNotificacion
} from "@/services/notificaciones"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"

interface Notificacion {
  id: string
  leido: boolean
  usuario_id: string
  comunicaciones: {
    titulo: string
    mensaje: string
    fecha: string
    enviado_por: string
  }
}

export function NotificationPanel() {
  const [openPopover, setOpenPopover] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [notificacionActiva, setNotificacionActiva] = useState<Notificacion | null>(null)

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    if (user?.id) {
      cargarNotificaciones()
    }
  }, [user?.id])

  const cargarNotificaciones = async () => {
    try {
      const data = await obtenerNotificacionesPorUsuario(user.id)
      setNotificaciones(data)
    } catch (err) {
      console.error("Error al obtener notificaciones", err)
    }
  }

  const abrirNotificacion = async (notificacion: Notificacion) => {
    setNotificacionActiva(notificacion)
    setOpenDialog(true)
    setOpenPopover(false)

    if (!notificacion.leido) {
      await marcarNotificacionComoLeida(notificacion.id)
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === notificacion.id ? { ...n, leido: true } : n))
      )
    }
  }

  const borrarNotificacion = async (id: string) => {
    try {
      await eliminarNotificacion(id)
      setNotificaciones((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      console.error("Error al eliminar notificación", err)
    }
  }

  const noLeidas = notificaciones.filter((n) => !n.leido)

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="relative p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors"
            aria-label="Ver notificaciones"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            {noLeidas.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4">
          <h4 className="text-lg font-semibold mb-2">Notificaciones</h4>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <li className="text-sm text-muted-foreground">No tienes notificaciones nuevas.</li>
            ) : (
              notificaciones.map((n) => (
                <li
                  key={n.id}
                  className={`text-sm p-2 rounded-md flex justify-between items-start gap-2 cursor-pointer transition hover:bg-muted/50
                    ${!n.leido ? "bg-muted/40 border-l-4 border-blue-500" : ""}`}
                  onClick={() => abrirNotificacion(n)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{n.comunicaciones.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.comunicaciones.fecha).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      borrarNotificacion(n.id)
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </li>
              ))
            )}
          </ul>
        </PopoverContent>
      </Popover>

      {/* Dialog para mostrar el contenido completo */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-md">
        {notificacionActiva ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">{notificacionActiva.comunicaciones.titulo}</h3>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(notificacionActiva.comunicaciones.fecha).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs rounded-full p-2">
                    {notificacionActiva.comunicaciones.enviado_por
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Enviado por</p>
                  <p className="text-sm text-muted-foreground">{notificacionActiva.comunicaciones.enviado_por}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm leading-relaxed">{notificacionActiva.comunicaciones.mensaje}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-lg font-medium">No hay notificación seleccionada</p>
            <p className="text-sm text-muted-foreground mt-1">Selecciona una notificación para ver su contenido</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
