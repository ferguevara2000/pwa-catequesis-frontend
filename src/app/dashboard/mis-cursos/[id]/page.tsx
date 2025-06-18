// app/cursos/[id]/page.tsx
import { getCursoById } from "@/services/cursos"
import { getAllEstudiantesByCursoId } from "@/services/estudianteCurso"
import { notFound } from "next/navigation"
import CursoPageClient from "@/components/cursos/curso-page-client"

export default async function CursoPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params
  const curso = await getCursoById(id)
  if (!curso) return notFound()
  const estudiantes = await getAllEstudiantesByCursoId(id)

  return <CursoPageClient curso={curso} estudiantes={estudiantes} id={id} />
}
