
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type User = {
    id?: number
    nombre: string
    apellidos: string
    usuario: string
    rol: string
    contraseña?: string
    email: string
    barrio_id?: number
    phone: string
    representante?: string
  }

export type Catequista = {
  id: number
  nombre: string
}

export type Estudiante = {
  id: number
  nombre: string
}
  
  export async function getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/usuarios`)
  
    if (!response.ok) {
      throw new Error("Error al obtener usuarios")
    }
  
    return response.json()
  }

  export async function getUserById(id: string): Promise<User> {
    const response = await fetch(`${API_URL}/usuarios/${id}`)
  
    if (!response.ok) {
      throw new Error("Error al obtener usuarios")
    }
  
    return response.json()
  }

  export async function getAllCatequistas(): Promise<Catequista[]> {
    const response = await fetch(`${API_URL}/usuarios/catequistas`)
  
    if (!response.ok) {
      throw new Error("Error al obtener los catequistas")
    }
  
    return response.json()
  }

  export async function getAllEstudiantes(): Promise<Estudiante[]> {
    const response = await fetch(`${API_URL}/usuarios/estudiantes`)
  
    if (!response.ok) {
      throw new Error("Error al obtener los catequistas")
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

  export async function updateUser(data: User, userId: string) {
    const res = await fetch(`${API_URL}/usuarios/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al actualizar el usuario")
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

  export async function updatePassword(userId: string, contraseña: string): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/${userId}/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contraseña }),
    });
  
    if (!response.ok) {
      throw new Error("No se pudo actualizar la contraseña");
    }
  }

  export async function actualizarContraseña(id: string, contraseña_actual: string, nueva_contraseña: string) {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}/userpassword`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contraseña_actual,
        nueva_contraseña,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.code === 'CONTRASEÑA_INCORRECTA') {
        console.error('Contraseña actual incorrecta');
        return { success: false, message: 'La contraseña actual es incorrecta' };
      } else {
        console.error('Error:', data.error);
        return { success: false, message: 'Error al actualizar la contraseña' };
      }
    }

    return { success: true, message: 'Contraseña actualizada correctamente' };
  } catch (error) {
    console.error('Error de red:', error);
    return { success: false, message: 'Error en el servidor' };
  }
}

export const recuperarContrasena = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/recovery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al recuperar la contraseña")
    }

    return { success: true, message: data.message }
  } catch (error) {
    console.error("❌ Error desde el frontend:", error)
    return { success: false, message: error }
  }
}

  
  
  