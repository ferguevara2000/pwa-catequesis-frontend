import { Button } from "@/components/ui/button"
import { Church, Users, Bell, BookOpen } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center relative text-white"
      style={{ backgroundImage: "url('https://i.imgur.com/CBSips9.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Header */}
      <header className="absolute top-0 w-full py-4 px-4 sm:px-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Church className="h-6 w-6 sm:h-8 sm:w-8" />
          <span className="text-lg sm:text-xl font-bold">San Miguel de Montalvo</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="z-10 text-center px-4 max-w-5xl w-full mt-20 mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Bienvenidos a</h1>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8">Catequesis Parroquial</h2>
        <p className="text-base sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
          Parroquia Juan Montalvo
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-100 flex items-center justify-center gap-2 text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
              size="lg"
            >
              <Users className="h-5 w-5" />
              <span>Iniciar Sesión</span>
            </Button>
          </Link>

          <Link href="/comunicados" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-100 flex items-center justify-center gap-2 text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
              size="lg"
            >
              <Bell className="h-5 w-5" />
              <span>Comunicados</span>
            </Button>
          </Link>

          <Link href="/nosotros" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-100 flex items-center justify-center gap-2 text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
              size="lg"
            >
              <BookOpen className="h-5 w-5" />
              <span>Nuestra Historia</span>
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 text-center z-10 px-4 text-sm sm:text-base">
        <p>
          © {new Date().getFullYear()} Iglesia San Miguel de Montalvo - Parroquia Juan Montalvo
        </p>
      </footer>
    </div>
  )
}
