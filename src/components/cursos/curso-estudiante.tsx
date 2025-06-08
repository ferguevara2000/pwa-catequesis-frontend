/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Calendar, Clock, GraduationCap, User } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface CursoPageClientProps {
  curso: any
}

export default function CursoPageStudent({
  curso,
}: CursoPageClientProps) {
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
