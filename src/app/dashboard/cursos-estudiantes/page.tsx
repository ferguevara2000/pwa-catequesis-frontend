"use client";

import { useEffect, useState } from "react";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import CourseCard from "@/components/shared/curso-card";
import { getAllEstudiantesByUsuarioId, Matricula } from "@/services/estudianteCurso";

const imageUrl = "https://i.imgur.com/3fZ8VMQ.png";

export default function MisCursosPage() {
  const [curso, setCurso] = useState<Matricula | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id;

    if (!userId) return;

    const fetchCurso = async () => {
      try {
        const data = await getAllEstudiantesByUsuarioId(userId);
        setCurso(data);
      } catch (error) {
        console.error("Error al obtener curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurso();
  }, []);

  return (
    <RoleProtectedRoute allowedRoles={["Estudiante"]}>
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Mis Cursos</h1>

        {loading ? (
          <p>Cargando curso...</p>
        ) : !curso ? (
          <p>No tienes cursos asignados aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard
              key={curso.curso.id}
              title={curso.curso.nombre}
              imageUrl={imageUrl}
              level={curso.curso.nivel?.nombre || "Sin nivel"}
              courseId={curso.curso.id.toString()}
              route="cursos-estudiantes"
            />
          </div>
        )}
      </main>
    </RoleProtectedRoute>
  );
}
