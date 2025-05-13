import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { Movimiento, deleteMovimiento, getAllMovimientos } from "@/services/movimiento"
import MovimientoForm from "./movimientos-form"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedMovimiento?: Movimiento
  onEdit: (movimiento: Movimiento) => void
}

const MovimientoColumns: Column<Movimiento>[] = [
    { key: "finanza_nombre", label: "Barrio"},
    { key: "tipo", label: "Tipo"},
    { key: "monto", label: "Monto" },
    { key: "fecha", label: "Fecha" }
  ]

export default function MovimientoManagement({ formOpen, onCloseForm, selectedMovimiento, onEdit }: Props) {
  const [movimiento, setMovimiento] = useState<Movimiento[]>([])

  const fetchData = async () => {
    try {
      const data = await getAllMovimientos();
  
      const dataWithBarrioNombre = data.map((movimiento) => ({
        ...movimiento,
        finanza_nombre: movimiento.finanzas?.barrios?.nombre ?? "Sin barrio",
      }));
  
      setMovimiento(dataWithBarrioNombre);
    } catch (error) {
      console.error("Error al cargar el Movimiento:", error);
    }
  };
  

  useEffect(() => {
    fetchData()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchData() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (movimiento: Movimiento) => {
    try {
      await deleteMovimiento(movimiento.id!.toString());
      toast.success("Movimiento eliminado correctamente");
      fetchData(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el Movimiento");
      console.error(error);
    }
  };

  return (
    <>
      <MovimientoForm open={formOpen} onClose={handleClose} movimiento={selectedMovimiento} />
      <GenericTable<Movimiento> data={movimiento} columns={MovimientoColumns} searchableKeys={["finanza_nombre", "tipo", "fecha"]as (keyof Movimiento)[]} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
