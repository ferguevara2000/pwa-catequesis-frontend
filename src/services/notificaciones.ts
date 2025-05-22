const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Obtener notificaciones de un usuario
export async function obtenerNotificacionesPorUsuario(usuarioId: string) {
  const res = await fetch(`${API_URL}/notificaciones/usuario/${usuarioId}`);
  if (!res.ok) {
    throw new Error("Error al obtener las notificaciones");
  }
  return await res.json();
}

// Marcar una notificación como leída
export async function marcarNotificacionComoLeida(notificacionId: string) {
  const res = await fetch(`${API_URL}/notificaciones/${notificacionId}`, {
    method: "PATCH",
  });
  if (!res.ok) {
    throw new Error("Error al marcar la notificación como leída");
  }
  return await res.json();
}

// Eliminar una notificación
export async function eliminarNotificacion(notificacionId: string) {
  const res = await fetch(`${API_URL}/notificaciones/${notificacionId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Error al eliminar la notificación");
  }
  return await res.json();
}
