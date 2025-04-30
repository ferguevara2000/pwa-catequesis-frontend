import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DeleteAlertDialog from "./deleteAlertDialog"

type SortDirection = "asc" | "desc" | null

export type Column<T> = {
  key: keyof T
  label: string
}

type Props<T> = {
  data: T[]
  columns: Column<T>[]
  searchableKeys: (keyof T)[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customRender?: Partial<Record<keyof T, (value: any, item: T) => React.ReactNode>>
}

export default function GenericTable<T extends { id: string | number }>({
  data,
  columns,
  searchableKeys,
  onEdit,
  onDelete,
  customRender = {}
}: Props<T>) {
  const [search, setSearch] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const handleSort = (column: keyof T) => {
    if (sortColumn !== column) {
      setSortColumn(column)
      setSortDirection("asc")
    } else if (sortDirection === "asc") {
      setSortDirection("desc")
    } else {
      setSortColumn(null)
      setSortDirection(null)
    }
  }

  const filteredData = useMemo(() => {
    const filtered = data.filter(item =>
      searchableKeys.some(key =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    )

    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = String(a[sortColumn] ?? "")
        const bValue = String(b[sortColumn] ?? "")
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      })
    }

    return filtered
  }, [data, search, searchableKeys, sortColumn, sortDirection])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar..."
        value={search}
        onChange={e => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
      />

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-muted transition"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortColumn === col.key ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-primary" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.map(item => (
              <tr key={item.id} className="border-t hover:bg-muted/30">
                {columns.map(col => (
                  <td key={String(col.key)} className="px-4 py-3">
                    {customRender[col.key]
                      ? customRender[col.key]?.(item[col.key], item)
                      : String(item[col.key] ?? "")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right space-x-2">
                    {onEdit && (
                      <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && <DeleteAlertDialog onConfirm={() => onDelete(item)} />}
                  </td>
                )}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center px-4 py-6 text-muted-foreground">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-2 pt-2">
        <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
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
