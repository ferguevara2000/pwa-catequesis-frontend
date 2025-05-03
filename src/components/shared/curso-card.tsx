"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface CourseCardProps {
  title: string
  imageUrl: string
  level: string
  courseId: string
}

export default function CourseCard({ title, imageUrl, level, courseId }: CourseCardProps) {

    const router = useRouter()

  // Determinar el color del badge según el nivel
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
    <Card className="overflow-hidden w-full max-w-sm transition-all hover:shadow-lg p-0">
      <div className="relative">
        <Badge className={`absolute top-2 left-2 z-10 
    dark:text-white 
    ${level === "Confirmación" ? "dark:bg-red-600" : "dark:bg-black"}`} variant={getBadgeVariant(level)}>
          {level}
        </Badge>
        <div className="relative h-48 w-full">
          <Image src={imageUrl || "/placeholder.svg?height=192&width=384"} alt={title} fill className="object-cover" />
        </div>
      </div>
      <CardHeader className="p-0 flex justify-center text-center">
        <h3 className="text-xl font-bold">{title}</h3>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => router.push(`/dashboard/mis-cursos/${courseId}`)} className="w-full group relative overflow-hidden cursor-pointer" size="lg">
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-[-8px]">
            Ingresar al curso
          </span>
          <ArrowRight className="absolute right-4 h-5 w-5 transform opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
        </Button>
      </CardFooter>
    </Card>
  )
}
