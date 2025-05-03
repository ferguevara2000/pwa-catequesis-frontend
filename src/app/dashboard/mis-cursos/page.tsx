"use client"

import { useEffect, useState } from "react";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import CourseCard from "@/components/shared/curso-card";
import { getCursoByCatequistaId, Curso } from "@/services/cursos";

export default function MisCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const imageUrl = "https://i.imgur.com/3fZ8VMQ.png"

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id;

    if (userId) {
      getCursoByCatequistaId(userId)
        .then((data) => setCursos(data))
        .catch(() => console.error("Error al cargar los cursos del catequista"))
        .finally(() => setLoading(false));
    } else {
      console.error("ID de usuario no encontrado en localStorage");
      setLoading(false);
    }
  }, []);

  return (
    <RoleProtectedRoute allowedRoles={["Catequista"]}>
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Mis Cursos</h1>

        {loading ? (
          <p>Cargando cursos...</p>
        ) : cursos.length === 0 ? (
          <p>No tienes cursos asignados aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <CourseCard
                key={curso.id}
                title={curso.nombre}
                imageUrl={imageUrl}
                level={curso.nivel.nombre}
                courseId={curso.id.toString()}
              />
            ))}
          </div>
        )}
      </main>
    </RoleProtectedRoute>
  );
}
