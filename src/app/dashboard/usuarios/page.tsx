import RoleProtectedRoute from "@/components/RoleProtectedRoute"

export default function UsuariosPage() {
    return (
    <RoleProtectedRoute allowedRoles={["Catequista"]}>    
      <div className="text-white">Aquí va el registro de usuarios</div>
    </RoleProtectedRoute>

    )
  }