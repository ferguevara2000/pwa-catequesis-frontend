const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CertificacionDTO = {
  id: number,
  matricula_id: number,
  porcentaje_asistencia: number
}

export type Certificacion = {
    id: number,
    matricula_id: Matricula,
    porcentaje_asistencia: number,
    fecha?: string
}

export type Matricula = {
  id: number,
  estado: string,
  curso_id: Curso,
  created_at: string,
  usuario_id: number
}

export type Curso = {
  nombre: string,
  nivel_id: Nivel
}

export type Nivel = {
  nombre: string
}

export async function createCertificacion(bautismo: Omit<CertificacionDTO, "id">): Promise<CertificacionDTO> {
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

  export async function getCertificacionesByUsuarioId(id: string): Promise<Certificacion[]> {
      const response = await fetch(`${API_URL}/certificaciones/usuario/${id}`)
    
      if (!response.ok) {
        throw new Error("Error al obtener el listado de certificaciones")
      }
    
      return response.json()
    }