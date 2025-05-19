"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, RefreshCw, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Eliminamos los datos estáticos ya que ahora se cargarán dinámicamente
export type Estudiante = {
  id: string
  nombre: string
}

interface MultiSelectComboboxProps {
  placeholder?: string
  emptyMessage?: string
  loadingMessage?: string
  errorMessage?: string
  fetchEstudiantes?: () => Promise<Estudiante[]>
  onChange?: (value: Estudiante[]) => void
}

export function EstudianteMultiSelect({
  placeholder = "Seleccionar estudiantes...",
  emptyMessage = "No se encontraron estudiantes.",
  loadingMessage = "Cargando estudiantes...",
  errorMessage = "Error al cargar estudiantes.",
  fetchEstudiantes,
  onChange,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Estudiante[]>([])
  const [inputValue, setInputValue] = React.useState("")
  const [estudiantes, setEstudiantes] = React.useState<Estudiante[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  const loadEstudiantes = React.useCallback(async () => {
    if (!fetchEstudiantes) return

    setLoading(true)
    setError(false)

    try {
      const data = await fetchEstudiantes()
      setEstudiantes(data)
    } catch (err) {
      console.error("Error cargando estudiantes:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [fetchEstudiantes])

  // Cargar estudiantes al montar el componente o cuando cambia fetchEstudiantes
  React.useEffect(() => {
    loadEstudiantes()
  }, [loadEstudiantes])

  const handleSelect = (estudiante: Estudiante) => {
    const isSelected = selected.some((item) => item.id === estudiante.id)

    let newSelected: Estudiante[]
    if (isSelected) {
      newSelected = selected.filter((item) => item.id !== estudiante.id)
    } else {
      newSelected = [...selected, estudiante]
    }

    setSelected(newSelected)
    onChange?.(newSelected)
    setInputValue("")
  }

  const handleRemove = (estudiante: Estudiante) => {
    const newSelected = selected.filter((item) => item.id !== estudiante.id)
    setSelected(newSelected)
    onChange?.(newSelected)
  }

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selected.length > 0
              ? `${selected.length} estudiante${selected.length !== 1 ? "s" : ""} seleccionado${selected.length !== 1 ? "s" : ""}`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <div className="flex items-center px-3 pt-3">
              <CommandInput
                placeholder="Buscar estudiante..."
                value={inputValue}
                onValueChange={setInputValue}
                className="flex-1"
              />
              {fetchEstudiantes && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-8 w-8"
                  onClick={() => loadEstudiantes()}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  <span className="sr-only">Recargar estudiantes</span>
                </Button>
              )}
            </div>
            <CommandList>
              {loading ? (
                <div className="py-6 text-center text-sm">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin opacity-50" />
                  <p className="mt-2 text-muted-foreground">{loadingMessage}</p>
                </div>
              ) : error ? (
                <div className="py-6 text-center text-sm">
                  <p className="text-destructive">{errorMessage}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => loadEstudiantes()}>
                    Intentar de nuevo
                  </Button>
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[200px]">
                      {estudiantes.map((estudiante) => {
                        const isSelected = selected.some((item) => item.id === estudiante.id)
                        return (
                          <CommandItem
                            key={estudiante.id}
                            value={estudiante.nombre}
                            onSelect={() => handleSelect(estudiante)}
                          >
                            <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                            {estudiante.nombre}
                          </CommandItem>
                        )
                      })}
                    </ScrollArea>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Estudiantes seleccionados:</h3>
          <div className="flex flex-wrap gap-2">
            {selected.map((estudiante) => (
              <Badge key={estudiante.id} variant="secondary" className="flex items-center gap-1">
                {estudiante.nombre}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemove(estudiante)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Eliminar {estudiante.nombre}</span>
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
