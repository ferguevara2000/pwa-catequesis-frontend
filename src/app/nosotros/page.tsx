import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Heart, Users, Calendar, MapPin, ArrowLeft } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-100">
      {/* Volver a Home */}
      <div className="bg-gray-100 dark:bg-gray-900 py-3 px-4 shadow">
        <div className="max-w-7xl mx-auto">
          <Link href="/home" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la página principal
          </Link>
        </div>
      </div>
    
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white py-6 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Iglesia San Miguel Arcangel</h1>
          <p className="text-lg md:text-xl opacity-90">Parroquia Montalvo</p>
        </div>
      </header>

      <main className="flex-1">
        

        {/* Sobre Nosotros */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#1e3a8a]">Sobre Nuestra Iglesia</h2>
                <p className="text-gray-700 mb-4">
                  Nuestra iglesia fue fundada en 1995 con la visión de ser un lugar donde las personas puedan encontrar
                  esperanza, sanidad y propósito a través de una relación personal con Jesucristo.
                </p>
                <p className="text-gray-700 mb-4">
                  A lo largo de los años, hemos crecido de un pequeño grupo de creyentes a una comunidad vibrante que
                  sirve a nuestra ciudad y más allá. Creemos en la importancia de la adoración auténtica, la enseñanza
                  bíblica sólida y las relaciones genuinas.
                </p>
                <p className="text-gray-700">
                  Te invitamos a unirte a nosotros en este viaje de fe, donde cada persona es valorada y tiene la
                  oportunidad de descubrir y desarrollar sus dones para la gloria de Dios.
                </p>
              </div>
              <div className="flex justify-center">
                
<Image
  src="https://i.imgur.com/NOqhDF8.png"
  alt="Nuestra iglesia"
  width={600}
  height={400}
  className="rounded-lg shadow-lg"
  style={{ 
    objectFit: "cover", 
    maxWidth: "100%",  // para que nunca se salga del contenedor padre
    maxHeight: "400px", // máximo alto
    width: "auto",      // que el ancho se ajuste automáticamente
    height: "auto"      // que el alto se ajuste automáticamente
  }}
/>

              </div>
            </div>
          </div>
        </section>

        {/* Misión, Visión y Valores */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#1e3a8a]">Nuestra Identidad</h2>

            <Tabs defaultValue="mision" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mision">Misión</TabsTrigger>
                <TabsTrigger value="vision">Visión</TabsTrigger>
                <TabsTrigger value="valores">Valores</TabsTrigger>
              </TabsList>
              <TabsContent value="mision" className="mt-6 p-6 bg-white rounded-lg shadow">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 bg-[#1e3a8a] text-white p-4 rounded-full">
                    <BookOpen className="h-12 w-12" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Nuestra Misión</h3>
                    <p className="text-gray-700">
                      Nuestra misión es amar a Dios apasionadamente, servir a otros desinteresadamente y hacer
                      discípulos intencionalmente. Nos esforzamos por compartir el mensaje transformador del evangelio,
                      equipar a los creyentes para el ministerio y extender el Reino de Dios en nuestra comunidad y más
                      allá.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="vision" className="mt-6 p-6 bg-white rounded-lg shadow">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 bg-[#1e3a8a] text-white p-4 rounded-full">
                    <Heart className="h-12 w-12" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Nuestra Visión</h3>
                    <p className="text-gray-700">
                      Visualizamos una iglesia vibrante que impacta a nuestra comunidad con el amor de Cristo, donde las
                      personas crecen en su fe, descubren sus dones y son equipadas para cumplir su propósito divino.
                      Aspiramos a ser un faro de esperanza, un refugio de sanidad y un centro de formación espiritual
                      para todas las generaciones.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="valores" className="mt-6 p-6 bg-white rounded-lg shadow">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 bg-[#1e3a8a] text-white p-4 rounded-full">
                    <Users className="h-12 w-12" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Nuestros Valores</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>
                        <span className="font-semibold">Excelencia Bíblica:</span> Comprometidos con la enseñanza fiel
                        de la Palabra de Dios.
                      </li>
                      <li>
                        <span className="font-semibold">Adoración Auténtica:</span> Cultivamos un ambiente de adoración
                        sincera y transformadora.
                      </li>
                      <li>
                        <span className="font-semibold">Comunidad Amorosa:</span> Fomentamos relaciones genuinas y un
                        sentido de pertenencia.
                      </li>
                      <li>
                        <span className="font-semibold">Servicio Compasivo:</span> Extendemos el amor de Cristo a través
                        del servicio práctico.
                      </li>
                      <li>
                        <span className="font-semibold">Discipulado Intencional:</span> Equipamos a cada creyente para
                        crecer en su fe y liderazgo.
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Liderazgo */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#1e3a8a]">Nuestro Liderazgo</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Ignacio Caizabanda Jerez",
                  role: "Sacerdote",
                  image: "/placeholder.svg?height=300&width=300",
                },
                {
                  name: "Santiago",
                  role: "Catequista",
                  image: "/placeholder.svg?height=300&width=300",
                },
                {
                  name: "Vinicio Guevara",
                  role: "Catequista",
                  image: "/placeholder.svg?height=300&width=300",
                },
              ].map((leader, index) => (
                <Card key={index} className="overflow-hidden">
                  <Image
                    src={leader.image || "/placeholder.svg"}
                    alt={leader.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold">{leader.name}</h3>
                    <p className="text-gray-600">{leader.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Historia */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#1e3a8a]">Nuestra Historia</h2>

            <div className="max-w-4xl mx-auto space-y-12">
              {[
                {
                  year: "1995",
                  title: "Los inicios",
                  description:
                    "Un pequeño grupo de 15 personas comenzó a reunirse en una casa para orar y estudiar la Biblia.",
                },
                {
                  year: "2000",
                  title: "Primer templo",
                  description:
                    "Adquirimos nuestro primer edificio y comenzamos a ofrecer servicios regulares los domingos.",
                },
                {
                  year: "2010",
                  title: "Expansión del ministerio",
                  description:
                    "Iniciamos varios ministerios comunitarios y programas de alcance para servir a nuestra ciudad.",
                },
                {
                  year: "2020",
                  title: "Nuevo campus",
                  description:
                    "Inauguramos nuestras nuevas instalaciones para acomodar el crecimiento de la congregación.",
                },
              ].map((event, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-[#1e3a8a] text-white w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold">
                      {event.year}
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Horarios y Ubicación */}
        <section className="py-16 bg-white dark:bg-gray-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
      Horarios y Ubicación
    </h2>

    <div className="grid md:grid-cols-2 gap-10">
      {/* Horarios */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="h-8 w-8 text-blue-800 dark:text-blue-300" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Horarios de Misa
          </h3>
        </div>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex justify-between">
            <span className="font-medium">Domingo:</span>
            <span>07:00 AM, 09:00 AM y 11:00 AM</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Miércoles:</span>
            <span>07:00 PM (Misa Comunitaria)</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Viernes:</span>
            <span>06:30 PM (Adoración al Santísimo)</span>
          </li>
        </ul>
      </div>

      {/* Ubicación */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-6">
          <MapPin className="h-8 w-8 text-blue-800 dark:text-blue-300" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ubicación
          </h3>
        </div>
        <address className="not-italic mb-4 text-gray-700 dark:text-gray-300">
          <p>Parroquia Juan Montalvo</p>
          <p>Calle Principal s/n y 10 de Agosto</p>
          <p>Montalvo, Cantón Ambato</p>
        </address>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            Mapa de ubicación
          </div>
        </div>
        <a
          href="https://www.google.com/maps?q=Parroquia+San+Juan+Bautista+de+Montalvo,+Ambato,+Ecuador"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full"
        >
          <button className="w-full bg-blue-800 text-white hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Ver en Google Maps
          </button>
        </a>
      </div>
    </div>
  </div>
</section>

      </main>

      <footer className="bg-gray-900 text-white py-12">

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()}. Todos los derechos reservados.</p>
          </div>
      </footer>
    </div>
  )
}
