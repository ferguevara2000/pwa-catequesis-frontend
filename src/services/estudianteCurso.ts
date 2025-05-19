import { Estudiante } from "./users";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Usuario = {
    id?: number,
    nombre: string
}

export type Curso = {
    id: number
    nombre: string
  }

export type estudianteCurso = {
    id: number
    estado: string
    usuario: Usuario
    curso: Curso
    usuario_nombre: string
    curso_nombre: string
  }

  export type estudianteCursoDTO = {
    estado: string
    usuario_ids: number[]
    curso_id: number
  }

  export type estudianteCursoUpdateDTO = {
    estado: string
    usuario_id: number
    curso_id: number
  }
  
  export async function getAllEstudiantesCursos(): Promise<estudianteCurso[]> {
    const response = await fetch(`${API_URL}/estudiantesCurso`)
  
    if (!response.ok) {
      throw new Error("Error al obtener los datos")
    }
  
    return response.json()
  }

  export async function getAllEstudiantesByCursoId(id: string): Promise<estudianteCurso[]> {
    const response = await fetch(`${API_URL}/estudiantesCurso/curso/${id}`)
  
    if (!response.ok) {
      throw new Error("Error al obtener los estudiantes")
    }
  
    return response.json()
  }

  export async function getAllEstudiantesNoMatriculados(): Promise<Estudiante[]> {
    const response = await fetch(`${API_URL}/estudiantesCurso/estudiantes`)
  
    if (!response.ok) {
      throw new Error("Error al obtener los estudiantes")
    }
  
    return response.json()
  }

  export async function createEstudianteCurso(data: estudianteCursoDTO) {
    const res = await fetch(`${API_URL}/estudiantesCurso`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
  
      // 🔥 Creamos un error con más información
      const error = new Error(errorData.message || "Error al crear la matrícula");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).status = res.status;
  
      throw error;
    }
  
    return await res.json();
  }
  

  export async function updateEstudianteCurso(data: estudianteCursoUpdateDTO, id: string) {
    const res = await fetch(`${API_URL}/estudiantesCurso/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!res.ok) {
      const errorData = await res.json();
  
      // 🔥 Creamos un error con más información
      const error = new Error(errorData.message || "Error al actualizar la matrícula");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).status = res.status;
  
      throw error;
    }
  
    return await res.json()
  }

  export async function deleteEstudianteCurso(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/estudiantesCurso/${id}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error("No se pudo eliminar el campo");
    }
  }

  
  
  