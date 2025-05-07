const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AsistenciaDTO = {
    fecha: string,
    estado: string,
    matricula_id: number
}

export async function createAsistencia(data: AsistenciaDTO) {
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

export async function getAsistenciaByIdAndDate(id: string): Promise<AsistenciaDTO[]> {
    const response = await fetch(`${API_URL}/estudiantesCurso/curso/${id}`)
  
    if (!response.ok) {
      throw new Error("Error al obtener los estudiantes")
    }
  
    return response.json()
  }