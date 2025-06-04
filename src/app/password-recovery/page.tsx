"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { recuperarContrasena } from "@/services/users"

export default function PasswordRecovery() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError(null)

    const result = await recuperarContrasena (email)

    if (result.success) {
      setIsEmailSent(true)
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Correo enviado</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Si el correo está asignado a una cuenta, se ha enviado una contraseña temporal al correo electrónico ingresado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                ¿No recibiste el correo?{" "}
                <button
                  onClick={() => setIsEmailSent(false)}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Reenviar
                </button>
              </p>
            </div>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Recuperar contraseña</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !email}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar enlace de recuperación
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}