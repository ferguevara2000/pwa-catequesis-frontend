"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, MessageSquare, User, Mail, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

export default function ContactAdmin() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isMessageSent, setIsMessageSent] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.category || !formData.message) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsMessageSent(true)
    }, 2000)
  }

  const isFormValid = formData.name && formData.email && formData.subject && formData.category && formData.message

  if (isMessageSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Mensaje enviado</CardTitle>
            <CardDescription>
              Tu mensaje ha sido enviado correctamente al administrador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Hemos recibido tu consulta y te responderemos lo antes posible.</p>
              <p className="font-medium">Tiempo de respuesta estimado: 24-48 horas</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Número de ticket:</strong> #ADM-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                Guarda este número para hacer seguimiento de tu consulta
              </p>
            </div>
            <Link href="/dashboard" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            Contactar Administrador
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            ¿Necesitas ayuda? Completa el formulario y nos pondremos en contacto contigo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="w-4 h-4 inline mr-1" />
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                <FileText className="w-4 h-4 inline mr-1" />
                Categoría de consulta
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Problema técnico</SelectItem>
                  <SelectItem value="account">Problema con cuenta</SelectItem>
                  <SelectItem value="bug">Reporte de error</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Describe brevemente tu consulta"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                placeholder="Describe detalladamente tu consulta o problema..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                required
                disabled={isLoading}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 10 caracteres ({formData.message.length}/10)
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Información importante:</strong> Para consultas urgentes, también puedes contactarnos por
                teléfono al +1 (555) 123-4567.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isFormValid || formData.message.length < 10}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando mensaje...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar mensaje
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
