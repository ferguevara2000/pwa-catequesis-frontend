const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type User = {
    id?: number
    nombre: string
    usuario: string
    rol: string
    contraseña?: string
    email: string
    phone: string
  }
  
  export async function getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/usuarios`)
  
    if (!response.ok) {
      throw new Error("Error al obtener usuarios")
    }
  
    return response.json()
  }

  export async function createUser(data: User) {
    const res = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al crear el usuario")
    }
  
    return await res.json()
  }

  export async function deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/${userId}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error("No se pudo eliminar el usuario");
    }
  }
  
  