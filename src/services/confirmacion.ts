const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Confirmacion = {
    id: number,
    nombres: string,
    apellidos: string,
    sexo: string,
    fecha: string,
    sacerdote: string,
    padrino?: string,
    madrina?: string,
    padre?: string,
    madre?: string
}

export async function getAllConfirmaciones(): Promise<Confirmacion[]> {
    const response = await fetch(`${API_URL}/confirmacion`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de Confirmaciones")
    }
  
    return response.json()
  }

  export async function createConfirmacion(confirmacion: Omit<Confirmacion, "id">): Promise<Confirmacion> {
    const response = await fetch(`${API_URL}/confirmacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(confirmacion),
    })
  
    if (!response.ok) {
      throw new Error("Error al crear el Confirmacion")
    }
  
    return response.json()
  }
  
  export async function updateConfirmacion(id: number, confirmacion: Partial<Confirmacion>): Promise<Confirmacion> {
    const response = await fetch(`${API_URL}/confirmacion/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(confirmacion),
    })
  
    if (!response.ok) {
      throw new Error("Error al actualizar el Confirmacion")
    }
  
    return response.json()
  }
  
  export async function deleteConfirmacion(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/confirmacion/${id}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      throw new Error("Error al eliminar el Confirmacion")
    }
  }