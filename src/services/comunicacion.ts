const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Comunicacion = {
    id: number,
    titulo: string,
    mensaje: string,
    dirigido_a: string[],
    fecha: string,
    enviado_por: string,
    categoria?: string
}

export async function getAllComunicacions(): Promise<Comunicacion[]> {
    const response = await fetch(`${API_URL}/comunicacion`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de Comunicacions")
    }
  
    return response.json()
  }
  
export async function getComunicacionById(id: string): Promise<Comunicacion> {
    const response = await fetch(`${API_URL}/comunicacion/${id}`)
  
    if (!response.ok) {
      throw new Error("Error al obtener la Comunicacion")
    }
  
    return response.json()
  }

  export async function getAllComunicacionsForAll(): Promise<Comunicacion[]> {
    const response = await fetch(`${API_URL}/comunicacion/todos`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de Comunicacions")
    }
  
    return response.json()
  }

  export async function createComunicacion(comunicacion: Omit<Comunicacion, "id">): Promise<Comunicacion> {
    const response = await fetch(`${API_URL}/comunicacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comunicacion),
    })
  
    if (!response.ok) {
      throw new Error("Error al crear el Comunicacion")
    }
  
    return response.json()
  }
  
  export async function updateComunicacion(id: number, comunicacion: Partial<Comunicacion>): Promise<Comunicacion> {
    const response = await fetch(`${API_URL}/comunicacion/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comunicacion),
    })
  
    if (!response.ok) {
      throw new Error("Error al actualizar el Comunicacion")
    }
  
    return response.json()
  }
  
  export async function deleteComunicacion(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/comunicacion/${id}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      throw new Error("Error al eliminar el Comunicacion")
    }
  }