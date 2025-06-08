/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { exportCertificadoPDF } from "@/lib/utils"
import { useState } from "react"

interface CourseCardProps {
  title: string
  imageUrl: string
  level: string
  courseId: string
  data: any
  nombre: string
}

export default function CertificadosCard({ title, imageUrl, level, data, nombre }: CourseCardProps) {

    const [pdfUrl, setPdfUrl] = useState<string | null>(null)


  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "Primera Comunión":
        return "default"
      case "Confirmación":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Dialog onOpenChange={(open) => {
  if (open) {
    const url = exportCertificadoPDF(data, nombre)
    setPdfUrl(url)
  } else {
    setPdfUrl(null)
  }
}}>
      <Card className="overflow-hidden w-full max-w-sm transition-all hover:shadow-lg p-0">
        <div className="relative">
          <Badge 
            className={`absolute top-2 left-2 z-10 dark:text-white 
              ${level === "Confirmación" ? "dark:bg-red-600" : "dark:bg-black"}`} 
            variant={getBadgeVariant(level)}
          >
            {level}
          </Badge>
          <div className="relative h-48 w-full">
            <Image 
              src={imageUrl || "/placeholder.svg?height=192&width=384"} 
              alt={title} 
              fill 
              className="object-cover" 
            />
          </div>
        </div>

        <CardHeader className="p-0 flex justify-center text-center">
          <h3 className="text-xl font-bold">{title}</h3>
        </CardHeader>

        <CardFooter className="p-4 pt-0">
          <DialogTrigger asChild>
            <Button
              className="w-full group relative overflow-hidden cursor-pointer"
              size="lg"
            >
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-[-8px]">
                Ver Certificado
              </span>
              <ArrowRight className="absolute right-4 h-5 w-5 transform opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Certificado del Curso</DialogTitle>
          <DialogDescription>
            Aquí se mostrará el certificado PDF para descargar o imprimir.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-[500px] flex flex-col items-center justify-center border rounded-md bg-muted text-muted-foreground gap-4">
  {pdfUrl ? (
    <iframe
      src={pdfUrl}
      className="w-full h-full rounded-md border"
      title="Vista previa del certificado"
    />
  ) : (
    <p>Cargando certificado...</p>
  )}
  <Button onClick={() => window.open(pdfUrl ?? "", "_blank")}>
    Descargar PDF
  </Button>
</div>

      </DialogContent>
    </Dialog>
  )
}
