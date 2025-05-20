import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { Bautismo, deleteBautismo, getAllBautismos } from "@/services/bautismos"
import BautismoForm from "./bautismo-form"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedBautismos?: Bautismo
  onEdit: (bautismo: Bautismo) => void
}

const bautismoColumns: Column<Bautismo>[] = [
    { key: "nombres", label: "Nombres" },
    { key: "apellidos", label: "Apellidos"},
    { key: "fecha_bautismo", label: "Fecha" }
  ]

export default function BautismoManagement({ formOpen, onCloseForm, selectedBautismos, onEdit }: Props) {
  const [bautismo, setBautismo] = useState<Bautismo[]>([])

  const fetchUsers = async () => {
    try {
      const data = await getAllBautismos()
      setBautismo(data)
    } catch (error) {
      console.error("Error al cargar el bautismo:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchUsers() // recarga usuarios después de cerrar el form
  }

  const formatFechaBonita = (value: string | Date) => {
    const date = new Date(value)
    const day = date.getDate()
    const month = date.toLocaleString("es-ES", { month: "long" })
    const year = date.getFullYear()
    return `${day}, ${month} ${year}`
  }


  const handleDelete = async (bautismo: Bautismo) => {
    try {
      await deleteBautismo(bautismo.id!.toString());
      toast.success("bautismo eliminado correctamente");
      fetchUsers(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el bautismo");
      console.error(error);
    }
  };

  return (
    <>
      <BautismoForm open={formOpen} onClose={handleClose} bautismo={selectedBautismos} />
      <GenericTable<Bautismo> data={bautismo} columns={bautismoColumns} searchableKeys={["nombres", "apellidos", "partida", "fecha"]as (keyof Bautismo)[]} customRender={{fecha_bautismo: (value) => formatFechaBonita(value)}} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
