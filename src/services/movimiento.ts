import { Finanza } from "./finanzas";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Movimiento = {
    id: number,
    finanza_id: number,
    tipo: string,
    monto: number,
    descripcion: string,
    fecha: string,
    registrado_por: string,
    finanzas?: Finanza,
    finanza_nombre?: string
}

export async function getAllMovimientos(): Promise<Movimiento[]> {
    const response = await fetch(`${API_URL}/movimientos`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de Movimientos")
    }
  
    return response.json()
  }

  export async function getAllMovimientosByBarrio(barrio_id: string): Promise<Movimiento[]> {
    const response = await fetch(`${API_URL}/movimientos/barrio/${barrio_id}`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de Movimientos")
    }
  
    return response.json()
  }

  export async function createMovimiento(movimiento: Omit<Movimiento, "id">): Promise<Movimiento> {
    const response = await fetch(`${API_URL}/movimientos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movimiento),
    })
  
    if (!response.ok) {
      throw new Error("Error al crear el Movimiento")
    }
  
    return response.json()
  }
  
  export async function updateMovimiento(id: number, movimiento: Partial<Movimiento>): Promise<Movimiento> {
    const response = await fetch(`${API_URL}/movimientos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movimiento),
    })
  
    if (!response.ok) {
      throw new Error("Error al actualizar el Movimiento")
    }
  
    return response.json()
  }
  
  export async function deleteMovimiento(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/movimientos/${id}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      throw new Error("Error al eliminar el Movimiento")
    }
  }