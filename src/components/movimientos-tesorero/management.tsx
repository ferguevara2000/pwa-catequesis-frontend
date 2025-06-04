import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { Movimiento, getAllMovimientosByBarrio } from "@/services/movimiento"
import MovimientoForm from "./form"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedMovimiento?: Movimiento
  onEdit: (movimiento: Movimiento) => void
  onDataReady?: (data: Movimiento[]) => void
}

const MovimientoColumns: Column<Movimiento>[] = [
    { key: "tipo", label: "Tipo"},
    { key: "monto", label: "Monto" },
    { key: "fecha", label: "Fecha" }
  ]

export default function TesoreroManagement({ formOpen, onCloseForm, selectedMovimiento, onEdit, onDataReady }: Props) {
  const [movimiento, setMovimiento] = useState<Movimiento[]>([])

  const fetchData = async () => {
    try {
      const barrio_id = JSON.parse(localStorage.getItem("user") || "{}")?.barrio_id;
      const data = await getAllMovimientosByBarrio(barrio_id);

      setMovimiento(data);
    } catch (error) {
      console.error("Error al cargar el Movimiento:", error);
    }
  };
  

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    onDataReady?.(movimiento) // tablaDatos es tu array de cursos actuales
  }, [movimiento, onDataReady])

  const handleClose = () => {
    onCloseForm()
    fetchData() // recarga usuarios después de cerrar el form
  }

  const formatFechaBonita = (value: string | Date) => {
    const date = new Date(value)
    const day = date.getDate()
    const month = date.toLocaleString("es-ES", { month: "long" })
    const year = date.getFullYear()
    return `${day}, ${month} ${year}`
  }


  return (
    <>
      <MovimientoForm open={formOpen} onClose={handleClose} movimiento={selectedMovimiento} />
      <GenericTable<Movimiento> data={movimiento} columns={MovimientoColumns} searchableKeys={["finanza_nombre", "tipo", "fecha"]as (keyof Movimiento)[]} customRender={{fecha: (value) => formatFechaBonita(value)}} onEdit={onEdit} />
    </>
  )
}
