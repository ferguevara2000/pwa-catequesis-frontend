const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Defuncion = {
    id: number,
    nombres: string,
    apellidos: string,
    fecha_nacimiento?: string | null,
    sexo: string,
    fecha_defuncion: string,
    cedula?: string,
    padre?: string,
    madre?: string,
    estado_civil?: string,
    conyuge?: string
}

export async function getAllDefunciones(): Promise<Defuncion[]> {
    const response = await fetch(`${API_URL}/defuncion`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el listado de Defunciones")
    }
  
    return response.json()
  }

  export async function createDefuncion(defuncion: Omit<Defuncion, "id">): Promise<Defuncion> {
    const response = await fetch(`${API_URL}/defuncion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(defuncion),
    })
  
    if (!response.ok) {
      throw new Error("Error al crear el Defuncion")
    }
  
    return response.json()
  }
  
  export async function updateDefuncion(id: number, defuncion: Partial<Defuncion>): Promise<Defuncion> {
    const response = await fetch(`${API_URL}/defuncion/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(defuncion),
    })
  
    if (!response.ok) {
      throw new Error("Error al actualizar el Defuncion")
    }
  
    return response.json()
  }
  
  export async function deleteDefuncion(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/defuncion/${id}`, {
      method: "DELETE",
    })
  
    if (!response.ok) {
      throw new Error("Error al eliminar el Defuncion")
    }
  }