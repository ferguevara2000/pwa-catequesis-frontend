const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Certificacion = {
    id: number,
    matricula_id: number,
    porcentaje_asistencia: number,
    fecha?: string
}

export async function createCertificacion(bautismo: Omit<Certificacion, "id">): Promise<Certificacion> {
    const response = await fetch(`${API_URL}/certificaciones`, {
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
