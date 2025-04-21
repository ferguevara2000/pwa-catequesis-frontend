"use client"

import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles: string[]
}) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(user.rol))) {
      router.replace("/not-authorized")
    }
  }, [user, loading])

  if (loading || !user || !allowedRoles.includes(user.rol)) {
    return null // O spinner si quieres
  }

  return <>{children}</>
}
