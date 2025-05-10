import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { Confirmacion, deleteConfirmacion, getAllConfirmaciones } from "@/services/confirmacion"
import ConfirmacionForm from "./confirmacion-form"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedConfirmacion?: Confirmacion
  onEdit: (confirmacion: Confirmacion) => void
}

const ConfirmacionColumns: Column<Confirmacion>[] = [
    { key: "nombres", label: "Nombres" },
    { key: "apellidos", label: "Apellidos"},
    { key: "fecha", label: "Fecha" }
  ]

export default function ConfirmacionManagement({ formOpen, onCloseForm, selectedConfirmacion, onEdit }: Props) {
  const [Confirmacion, setConfirmacion] = useState<Confirmacion[]>([])

  const fetchData = async () => {
    try {
      const data = await getAllConfirmaciones()
      setConfirmacion(data)
    } catch (error) {
      console.error("Error al cargar el Confirmacion:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchData() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (Confirmacion: Confirmacion) => {
    try {
      await deleteConfirmacion(Confirmacion.id!.toString());
      toast.success("Confirmacion eliminado correctamente");
      fetchData(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el Confirmacion");
      console.error(error);
    }
  };

  return (
    <>
      <ConfirmacionForm open={formOpen} onClose={handleClose} confirmacion={selectedConfirmacion} />
      <GenericTable<Confirmacion> data={Confirmacion} columns={ConfirmacionColumns} searchableKeys={["nombres", "apellidos", "fecha"]as (keyof Confirmacion)[]} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
