/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ChevronRight } from "lucide-react"
import { getAllComunicacionsForAll } from "@/services/comunicacion"

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

export default function HomePage() {
  const [comunicados, setComunicados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await getAllComunicacionsForAll()
      setComunicados(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Comunicados Parroquiales</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Mantente informado sobre las actividades y anuncios de la comunidad
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
    <Link
      href="/home"
      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
    >
      ← Volver a la pantalla principal
    </Link>
  </div>
        <div className="grid gap-6 md:gap-8">
          {comunicados.map((comunicado) => (
            <Card
              key={comunicado.id}
              className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className={obtenerColorCategoria(comunicado.categoria)}>
                        {comunicado.categoria}
                      </Badge>
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      {comunicado.titulo}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatearFecha(comunicado.fecha)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{comunicado.autor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {comunicado.mensaje.length > 200
                    ? `${comunicado.mensaje.substring(0, 200)}...`
                    : comunicado.mensaje}
                </p>
                <Link
                  href={`/comunicados/${comunicado.id}`}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Leer más
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado vacío o cargando */}
        {!loading && comunicados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No hay comunicados disponibles</h3>
              <p>Los nuevos comunicados aparecerán aquí cuando sean publicados.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 Sistema de Catequesis. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
