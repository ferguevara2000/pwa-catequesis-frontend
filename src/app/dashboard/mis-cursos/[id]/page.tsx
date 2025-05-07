// app/cursos/[id]/page.tsx
import { getCursoById } from "@/services/cursos"
import { getAllEstudiantesByCursoId } from "@/services/estudianteCurso"
import { notFound } from "next/navigation"
import CursoPageClient from "@/components/cursos/curso-page-client"

interface CursoPageProps {
  params: { id: string }
}

export default async function CursoPage({ params }: CursoPageProps) {
  const { id } = await params
  const curso = await getCursoById(id)
  if (!curso) return notFound()
  const estudiantes = await getAllEstudiantesByCursoId(id)

  return <CursoPageClient curso={curso} estudiantes={estudiantes} id={id} />
}
