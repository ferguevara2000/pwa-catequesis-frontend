import { Catequista } from "./users";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Nivel = {
    id?: number,
    nombre: string
}

export type Curso = {
    id: number
    nombre: string
    descripcion?: string
    nivel: Nivel
    fecha_inicio: Date
    fecha_fin: Date
    horario: string
    nivel_nombre: string
    catequista?: Catequista
  }

  export type CursoDTO = {
    id?: number
    nombre: string
    descripcion?: string
    nivel_id: number
    fecha_inicio: string
    fecha_fin: string
    horario: string
  }
  
  export async function getAllCursos(): Promise<Curso[]> {
    const response = await fetch(`${API_URL}/cursos`)
  
    if (!response.ok) {
      throw new Error("Error al obtener los cursos")
    }
  
    return response.json()
  }

  export async function getCursoById(id: string): Promise<Curso[]> {
    const response = await fetch(`${API_URL}/cursos/${id}`)
  
    if (!response.ok) {
      throw new Error("Error al obtener el curso")
    }
  
    return response.json()
  }

  export async function getCursoByCatequistaId(id: string): Promise<Curso[]> {
    const response = await fetch(`${API_URL}/cursos/catequista/${id}`)
  
    if (!response.ok) {
      throw new Error("Error al obtener los cursos")
    }
  
    return response.json()
  }

  export async function getAllNiveles(): Promise<Nivel[]> {
    const response = await fetch(`${API_URL}/cursos/niveles`)
  
    if (!response.ok) {
      throw new Error("Error al obtener los niveles")
    }
  
    return response.json()
  }

  export async function createCurso(data: CursoDTO) {
    const res = await fetch(`${API_URL}/cursos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al crear el curso")
    }
  
    return await res.json()
  }

  export async function updateCurso(data: CursoDTO, CursoId: string) {
    const res = await fetch(`${API_URL}/cursos/${CursoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al crear el curso")
    }
  
    return await res.json()
  }

  export async function deleteCurso(CursoId: string): Promise<void> {
    const response = await fetch(`${API_URL}/cursos/${CursoId}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error("No se pudo eliminar el curso");
    }
  }

  
  
  