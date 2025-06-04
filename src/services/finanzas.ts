const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Finanza = {
    id: number,
    barrio_id: number,
    total_ingresos: number,
    total_egresos: number,
    saldo: number,
    actualizado_en: string,
    barrios?: Barrio,
    barrio_nombre?: string
    tesorero: Tesorero
}

export type Tesorero = {
  id: number,
  nombre: string,
  apellidos: string,
  barrio_id: number,
  rol: string
}

export type Barrio = {
  id: number,
  nombre: string
}

export type Finanza_Barrio = {
  total_ingresos: number,
  total_egresos: number,
  saldo: number
  movimientos: Movimientos[]
}

export type Movimientos = {
  tipo: string,
  monto: number,
  descripcion: string,
  fecha: string
}

export async function getAllFinanzas(): Promise<Finanza[]> {
    const response = await fetch(`${API_URL}/finanzas`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de Finanzas")
    }
  
    return response.json()
  }

export async function getAllFinanzasByBarrio(barrio_id: string): Promise<Finanza_Barrio> {
    const response = await fetch(`${API_URL}/finanzas/barrio/${barrio_id}`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de Finanzas")
    }
  
    return response.json()
  }

export async function getAllBarrios(): Promise<Barrio[]> {
    const response = await fetch(`${API_URL}/finanzas/barrios`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de barrios")
    }
  
    return response.json()
  }

  export async function createFinanza(finanzas: Omit<Finanza, "id">): Promise<Finanza> {
    const response = await fetch(`${API_URL}/finanzas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finanzas),
    })
  
    if (!response.ok) {
      throw new Error("Error al crear el finanzas")
    }
  
    return response.json()
  }
  
  export async function updateFinanza(id: number, finanzas: Partial<Finanza>): Promise<Finanza> {
    const response = await fetch(`${API_URL}/finanzas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finanzas),
    })
  
    if (!response.ok) {
      throw new Error("Error al actualizar el Finanzas")
    }
  
    return response.json()
  }
  
  export async function deleteFinanza(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/finanzas/${id}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      throw new Error("Error al eliminar el Finanzas")
    }
  }