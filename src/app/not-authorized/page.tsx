import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full p-4">
            <ShieldAlert className="h-10 w-10" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Acceso denegado</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
        </div>

        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
