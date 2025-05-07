/* eslint-disable @typescript-eslint/no-explicit-any */
// app/cursos/[id]/page.tsx
import { Calendar, ClipboardCheck, Clock, GraduationCap, User } from "lucide-react"
import { getCursoById } from "@/services/cursos"
import { notFound } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllEstudiantesByCursoId } from "@/services/estudianteCurso"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CursoPageProps {
  params: { id: string }
}

export default async function CursoPage({ params }: CursoPageProps) {
  const { id } = await params
  const data = await getCursoById(id)

  if (!data) return notFound()
  const curso = data
  const estudiantes = await getAllEstudiantesByCursoId(id)

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto shadow-xl border border-border bg-background text-foreground">
        <CardHeader className="px-6 py-5 bg-muted">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">{curso.nombre}</CardTitle>
              <CardDescription className="mt-1 text-base text-muted-foreground">
                {curso.descripcion}
              </CardDescription>
            </div>
            <Badge className="bg-blue-600 text-white hover:bg-blue-700">
              {curso.nivel.nombre}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InfoBlock
              icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
              label="Fechas"
              value={`${curso.fecha_inicio} - ${curso.fecha_fin}`}
            />
            <InfoBlock
              icon={<Clock className="h-5 w-5 text-muted-foreground" />}
              label="Horario"
              value={curso.horario}
            />
            <InfoBlock
              icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />}
              label="Nivel"
              value={curso.nivel.nombre}
            />
            <InfoBlock
              icon={<User className="h-5 w-5 text-muted-foreground" />}
              label="Catequista"
              value={curso.catequista!.nombre}
            />
          </div>

          <Separator />

          <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Listado de Estudiantes</h3>
            <Link href={`/dashboard/mis-cursos/${id}/asistencia`}>
              <Button className="bg-sky-500/75 hover:bg-sky-500/50 text-white cursor-pointer group relative overflow-hidden transition-all duration-300 active:scale-95">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" />
                  Pasar Lista
                </span>
              </Button>
            </Link>
          </div>
            {estudiantes?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Nombre del Estudiante</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudiantes.map((estudiante: any, index: number) => (
                    <TableRow key={estudiante.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{estudiante.usuario.nombre}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={
                            estudiante.estado === "activo"
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-cyan-500 hover:bg-red-700"
                          }
                        >
                          {estudiante.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">
                No hay estudiantes registrados en este curso.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

type InfoBlockProps = {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoBlock({ icon, label, value }: InfoBlockProps) {
  return (
    <div className="flex items-start space-x-3">
      {icon}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
