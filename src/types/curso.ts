export type Nivel = {
    id?: number,
    nombre: string
}

export type Curso = {
    id: number
    nombre: string
    descripcion?: string
    nivel_catequesis: Nivel
    fecha_inicio: Date
    fecha_fin: Date
    horario: string
    nivel_nombre?: string
  }