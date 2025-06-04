"use client"
import { useEffect, useState } from "react"
import AdminPanel from "./admin-panel"
import TreasurerDashboard from "../movimientos-tesorero/dashboard"

export default function Content() {
  const [role, setRole] = useState<string>("")
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setRole(user?.rol || "guest")
      setUsername(user?.nombre + " " + user.apellidos)
    }
  }, [])

  if (!role) {
    return <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
  }

  if (role === "Administrador") {
    return (
      <div className="space-y-4">
        <AdminPanel userName={username}/>
      </div>
    )
  }

  if (role === "Tesorero") {
    return (
      <TreasurerDashboard/>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      <p className="text-gray-600 dark:text-gray-300">No tienes permisos para ver este panel.</p>
    </div>
  )
}
