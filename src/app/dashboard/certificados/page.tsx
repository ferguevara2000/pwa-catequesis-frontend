"use client"

import { useEffect, useState } from "react";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { Certificacion, getCertificacionesByUsuarioId } from "@/services/certificaciones";
import CertificadosCard from "@/components/shared/card-certificados";

export default function CertificadosPage() {
  const [cursos, setCursos] = useState<Certificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const imageUrl = "https://i.imgur.com/3fZ8VMQ.png"
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;
  const nombre = user.nombre + " " + user.apellidos

  useEffect(() => {

    if (userId) {
      getCertificacionesByUsuarioId(userId)
        .then((data) => setCursos(data))
        .catch(() => console.error("Error al cargar las certificaciones"))
        .finally(() => setLoading(false));
    } else {
      console.error("ID de usuario no encontrado en localStorage");
      setLoading(false);
    }
  }, [userId]);

  return (
    <RoleProtectedRoute allowedRoles={["Estudiante"]}>
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Mis Sacramentos Finalizados</h1>

        {loading ? (
          <p>Cargando certificaciones...</p>
        ) : cursos.length === 0 ? (
          <p>No tienes sacramentos finalizados todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <CertificadosCard
                key={curso.id}
                title={curso.matricula_id.curso_id.nombre}
                imageUrl={imageUrl}
                level={curso.matricula_id.curso_id.nivel_id.nombre}
                courseId={curso.id.toString()}
                data={curso}
                nombre={nombre}
              />
            ))}
          </div>
        )}
      </main>
    </RoleProtectedRoute>
  );
}
