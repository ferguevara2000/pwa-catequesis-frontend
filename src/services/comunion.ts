const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Comunion = {
    id: number,
    nombres: string,
    apellidos: string,
    fecha: string,
    sacerdote: string,
    padre?: string,
    madre?: string
    padrino?: string,
    madrina?: string,
}

export async function getAllComuniones(): Promise<Comunion[]> {
    const response = await fetch(`${API_URL}/comunion`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de Comuniones")
    }
  
    return response.json()
  }

  export async function createComunion(Comunion: Omit<Comunion, "id">): Promise<Comunion> {
    const response = await fetch(`${API_URL}/comunion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Comunion),
    })
  
    if (!response.ok) {
      throw new Error("Error al crear el Comunion")
    }
  
    return response.json()
  }
  
  export async function updateComunion(id: number, comunion: Partial<Comunion>): Promise<Comunion> {
    const response = await fetch(`${API_URL}/comunion/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comunion),
    })
  
    if (!response.ok) {
      throw new Error("Error al actualizar el Comunion")
    }
  
    return response.json()
  }
  
  export async function deleteComunion(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/comunion/${id}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      throw new Error("Error al eliminar el Comunion")
    }
  }