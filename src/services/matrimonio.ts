const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Matrimonio = {
    id: number,
    fecha_matrimonio: string,
    sacerdote: string,
    nombre_novio: string,
    apellidos_novio: string,
    padre_novio?: string,
    madre_novio?: string,
    nombre_novia: string,
    apellidos_novia: string,
    padre_novia?: string,
    madre_novia?: string,
    padrino?: string,
    madrina?: string
}

export async function getAllMatrimonios(): Promise<Matrimonio[]> {
    const response = await fetch(`${API_URL}/matrimonio`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de matrimonios")
    }
  
    return response.json()
  }

  export async function createMatrimonio(matrimonio: Omit<Matrimonio, "id">): Promise<Matrimonio> {
    const response = await fetch(`${API_URL}/matrimonio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matrimonio),
    })
  
    if (!response.ok) {
      throw new Error("Error al crear el matrimonio")
    }
  
    return response.json()
  }
  
  export async function updateMatrimonio(id: number, matrimonio: Partial<Matrimonio>): Promise<Matrimonio> {
    const response = await fetch(`${API_URL}/matrimonio/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matrimonio),
    })
  
    if (!response.ok) {
      throw new Error("Error al actualizar el matrimonio")
    }
  
    return response.json()
  }
  
  export async function deleteMatrimonio(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/matrimonio/${id}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      throw new Error("Error al eliminar el matrimonio")
    }
  }