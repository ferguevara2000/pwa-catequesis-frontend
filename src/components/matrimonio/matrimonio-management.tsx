import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { deleteMatrimonio, getAllMatrimonios, Matrimonio } from "@/services/matrimonio"
import MatrimonioForm from "./matrimonio-form"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedMatrimonio?: Matrimonio
  onEdit: (matrimonio: Matrimonio) => void
}

const matrimonioColumns: Column<Matrimonio>[] = [
    { key: "nombre_novio", label: "Nombres Novio" },
    { key: "apellidos_novio", label: "Apellidos Novio"},
    { key: "nombre_novia", label: "Nombres Novia" },
    { key: "apellidos_novia", label: "Apellidos Novia"},
    { key: "fecha_matrimonio", label: "Fecha" }
  ]

export default function MatrimonioManagement({ formOpen, onCloseForm, selectedMatrimonio, onEdit }: Props) {
  const [matrimonio, setMatrimonio] = useState<Matrimonio[]>([])

  const fetchMatrimonios = async () => {
    try {
      const data = await getAllMatrimonios()
      setMatrimonio(data)
    } catch (error) {
      console.error("Error al cargar el matrimonio:", error)
    }
  }

  useEffect(() => {
    fetchMatrimonios()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchMatrimonios() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (matrimonio: Matrimonio) => {
    try {
      await deleteMatrimonio(matrimonio.id!.toString());
      toast.success("matrimonio eliminado correctamente");
      fetchMatrimonios(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el matrimonio");
      console.error(error);
    }
  };

  return (
    <>
      <MatrimonioForm open={formOpen} onClose={handleClose} matrimonio={selectedMatrimonio} />
      <GenericTable<Matrimonio> data={matrimonio} columns={matrimonioColumns} searchableKeys={["nombre_novio", "apellidos_novio", "nombre_novia", "apellidos_novia", "fecha"]as (keyof Matrimonio)[]} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
