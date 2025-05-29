import { Church } from "lucide-react"

interface AdminPanelProps {
  userName: string
}

export default function AdminPanel({ userName }: AdminPanelProps) {
  return (
    <div className="min-h-screen dark:border-[#1F1F23] flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        {/* Logo / Imagen */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-amber-600 dark:bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <Church className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Título principal */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
            ¡Bienvenido al Sistema de
            <span className="text-amber-600 dark:text-amber-400 block">Catequesis</span>
            <span className="text-gray-700 dark:text-gray-200 block text-3xl md:text-4xl mt-2">Parroquia Montalvo</span>
          </h1>
        </div>

        {/* Nombre del usuario */}
        <div className="mt-8">
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200">{userName}</p>
        </div>
      </div>
    </div>
  )
}
