/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Share2, Bookmark } from "lucide-react"
import { Comunicacion, getComunicacionById } from "@/services/comunicacion"

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function obtenerColorCategoria(categoria: string) {
  const colores = {
    Anuncio: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Evento: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Recursos: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Celebración: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  }
  return colores[categoria as keyof typeof colores] || "bg-gray-100 text-gray-800"
}

export default function ComunicadoPage() {
  const { id } = useParams()
  const [data, setData] = useState<Comunicacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || typeof id !== "string") return

    const fetchData = async () => {
      try {
        const comunicado = await getComunicacionById(id)
        setData(comunicado)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <p className="p-4 text-center text-gray-500">Cargando comunicado...</p>
  if (error) return <p className="p-4 text-center text-red-500">Error: {error}</p>
  if (!data) return <p className="p-4 text-center text-gray-500">Comunicado no encontrado.</p>


  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a comunicados
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex flex-col gap-4">
              <Badge className={`${obtenerColorCategoria(data.categoria!)} w-fit`}>{data.categoria}</Badge>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {data.titulo}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{formatearFecha(data.fecha)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{data.enviado_por}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="w-4 h-4" />
                  Guardar
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {data.mensaje.split("\n\n").map((parrafo, index) => {
                if (parrafo.startsWith("**") && parrafo.endsWith("**")) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      {parrafo.replace(/\*\*/g, "")}
                    </h3>
                  )
                }

                if (parrafo.includes("- ")) {
                  const items = parrafo.split("\n").filter((item) => item.trim().startsWith("- "))
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 my-4">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700 dark:text-gray-300">
                          {item.replace("- ", "")}
                        </li>
                      ))}
                    </ul>
                  )
                }

                if (parrafo.match(/^\d+\./)) {
                  const items = parrafo.split("\n").filter((item) => item.trim().match(/^\d+\./))
                  return (
                    <ol key={index} className="list-decimal list-inside space-y-2 my-4">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700 dark:text-gray-300">
                          {item.replace(/^\d+\.\s*/, "")}
                        </li>
                      ))}
                    </ol>
                  )
                }

                return (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {parrafo}
                  </p>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link href="/comunicados">
            <Button className="gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Volver a todos los comunicados
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Sistema de Catequesis. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
