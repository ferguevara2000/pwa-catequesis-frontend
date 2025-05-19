"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Estudiante } from "@/services/users"

interface MultiSelectComboboxProps {
  placeholder?: string
  emptyMessage?: string
  estudiantes?: Estudiante[]
  onChange?: (value: Estudiante[]) => void
}

export function EstudianteMultiSelect({
  placeholder = "Seleccionar estudiantes...",
  emptyMessage = "No se encontraron estudiantes.",
  estudiantes = [],
  onChange,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Estudiante[]>([])
  const [inputValue, setInputValue] = React.useState("")

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
            </div>
            <CommandList>
              {estudiantes.length === 0 ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : (
                <CommandGroup>
                  <ScrollArea className="h-[200px]">
                    {estudiantes.map((estudiante) => {
                      const isSelected = selected.some((item) => item.id === estudiante.id)
                      return (
                        <CommandItem
                          key={estudiante.id}
                          value={estudiante.id.toString()}
                          onSelect={() => handleSelect(estudiante)}
                        >
                          <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                          {estudiante.nombre}
                        </CommandItem>
                      )
                    })}
                  </ScrollArea>
                </CommandGroup>
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
