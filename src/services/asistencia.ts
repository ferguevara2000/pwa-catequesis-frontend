const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Estudiante = {
  id: number,
  usuario: { id:number, nombre: string}
  curso_id: number
}

export type Asistencia = {
  id?: number,
  fecha: string,
  estado: string,
  matricula_id: number,
  estudiante?: Estudiante
}

export async function createAsistencia(data: Asistencia) {
    const res = await fetch(`${API_URL}/asistencia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al guardar la asistencia")
    }
  
    return await res.json()
  }

  export async function updateAsistencia(data: Asistencia, id: string) {
    const res = await fetch(`${API_URL}/asistencia/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al editar la asistencia")
    }
  
    return await res.json()
  }

export async function getAsistenciaByIdAndDate(curso_id: string, fecha: string): Promise<Asistencia[]> {
  try {
    const res = await fetch(`${API_URL}/asistencia/${curso_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ curso_id, fecha }),
    });

    if (!res.ok) {
      throw new Error("Error al obtener asistencia del curso",);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getAsistenciaPorCursoYFecha:", error);
    throw error;
  }
}