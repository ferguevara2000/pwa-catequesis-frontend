import { useState, useMemo } from "react"
import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const mockUsers = [
  { id: 1, name: "Juan Pérez", user: "ferguevara", role: "Administrador", email: "juan@example.com" },
  { id: 1, name: "Juan Pérez", user: "ferguevara", role: "Administrador", email: "juan@example.com" },
  { id: 1, name: "Juan Pérez", user: "ferguevara", role: "Administrador", email: "juan@example.com" },
  { id: 1, name: "Juan Pérez", user: "ferguevara", role: "Administrador", email: "juan@example.com" },
]

type SortDirection = "asc" | "desc" | null

const columns = [
  { key: "name", label: "Nombre" },
  { key: "user", label: "Usuario" },
  { key: "role", label: "Rol" },
  { key: "email", label: "Correo" },
]

type User = typeof mockUsers[number]

function maskEmail(email: string): string {
  const [user, domain] = email.split("@")
  if (!user || !domain) return email
  const visiblePart = user[0]
  const maskedPart = "*".repeat(user.length - 1)
  return `${visiblePart}${maskedPart}@${domain}`
}

export default function UserTable({ onEdit }: { onEdit: (user: User) => void }) {
  const [search, setSearch] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 5

  const handleSort = (column: keyof User) => {
    if (sortColumn !== column) {
      setSortColumn(column)
      setSortDirection("asc")
    } else if (sortDirection === "asc") {
      setSortDirection("desc")
    } else if (sortDirection === "desc") {
      setSortDirection(null)
      setSortColumn(null)
    }
  }

  const filteredUsers = useMemo(() => {
    const filtered = mockUsers.filter(
      u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    )

    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const valueA = a[sortColumn] || ""
        const valueB = b[sortColumn] || ""
        if (sortDirection === "asc") return valueA > valueB ? 1 : -1
        if (sortDirection === "desc") return valueA < valueB ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [search, sortColumn, sortDirection])

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Buscar por nombre, correo o rol"
        value={search}
        onChange={e => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
      />

      {/* Tabla */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground cursor-pointer select-none hover:bg-muted transition"
                  onClick={() => handleSort(col.key as keyof User)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortColumn === col.key ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4 text-primary" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-primary" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.user}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">{maskEmail(user.email)}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(user)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Anterior
        </Button>
        <span className="text-sm px-2 text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
