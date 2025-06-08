// app/cursos/[id]/page.tsx
import { getCursoById } from "@/services/cursos"
import { notFound } from "next/navigation"
import CursoPageStudent from "@/components/cursos/curso-estudiante"

interface CursoPageProps {
  params: { id: string }
}

export default async function CursoPage({ params }: CursoPageProps) {
  const { id } = await params
  const curso = await getCursoById(id)
  if (!curso) return notFound()

  return <CursoPageStudent curso={curso} />
}
