import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { Defuncion, deleteDefuncion, getAllDefunciones } from "@/services/defuncion"
import DefuncionForm from "./defuncion-form"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedDefuncion?: Defuncion
  onEdit: (defuncion: Defuncion) => void
}

const DefuncionColumns: Column<Defuncion>[] = [
    { key: "nombres", label: "Nombres" },
    { key: "apellidos", label: "Apellidos"},
    { key: "fecha_defuncion", label: "Fecha Defunción" }
  ]

export default function DefuncionManagement({ formOpen, onCloseForm, selectedDefuncion, onEdit }: Props) {
  const [defuncion, setDefuncion] = useState<Defuncion[]>([])

  const fetchData = async () => {
    try {
      const data = await getAllDefunciones()
      setDefuncion(data)
    } catch (error) {
      console.error("Error al cargar el Defuncion:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchData() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (defuncion: Defuncion) => {
    try {
      await deleteDefuncion(defuncion.id!.toString());
      toast.success("Defuncion eliminado correctamente");
      fetchData(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el Defuncion");
      console.error(error);
    }
  };

  return (
    <>
      <DefuncionForm open={formOpen} onClose={handleClose} defuncion={selectedDefuncion} />
      <GenericTable<Defuncion> data={defuncion} columns={DefuncionColumns} searchableKeys={["nombres", "apellidos", "fecha_defuncion"]as (keyof Defuncion)[]} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
