"use client";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute"; // 👈 Asegúrate de importar bien

export default function DashboardPage() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Hola {user?.nombre}, tu rol es <strong>{user?.rol}</strong>
        </h1>

        <Button onClick={handleLogout} variant="destructive">
          Cerrar sesión
        </Button>
      </div>
    </ProtectedRoute>
  );
}
