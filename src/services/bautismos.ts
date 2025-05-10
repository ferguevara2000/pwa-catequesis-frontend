const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Bautismo = {
    id: number,
    sacerdote: string,
    sexo: string,
    fecha_nacimiento: string,
    nombres: string,
    apellidos: string,
    fecha_bautismo: string,
    nombres_padre?: string,
    apellidos_padre?: string,
    nombres_madre?: string,
    apellidos_madre?: string,
    padrino?: string,
    madrina?: string
}

export async function getAllBautismos(): Promise<Bautismo[]> {
    const response = await fetch(`${API_URL}/bautismo`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de bautismos")
    }
  
    return response.json()
  }

  export async function createBautismo(bautismo: Omit<Bautismo, "id">): Promise<Bautismo> {
    const response = await fetch(`${API_URL}/bautismo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bautismo),
    })
  
    if (!response.ok) {
      throw new Error("Error al crear el bautismo")
    }
  
    return response.json()
  }
  
  export async function updateBautismo(id: number, bautismo: Partial<Bautismo>): Promise<Bautismo> {
    const response = await fetch(`${API_URL}/bautismo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bautismo),
    })
  
    if (!response.ok) {
      throw new Error("Error al actualizar el bautismo")
    }
  
    return response.json()
  }
  
  export async function deleteBautismo(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/bautismo/${id}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      throw new Error("Error al eliminar el bautismo")
    }
  }