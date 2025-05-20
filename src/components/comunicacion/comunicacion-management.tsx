import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { Comunicacion, deleteComunicacion, getAllComunicacions } from "@/services/comunicacion"
import ComunicacionForm from "./comunicacion-form"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedComunicacions?: Comunicacion
  onEdit: (comunicacion: Comunicacion) => void
}

const formatFechaBonita = (value: string | Date) => {
  const date = new Date(value)
  const day = date.getDate()
  const month = date.toLocaleString("es-ES", { month: "long" })
  const year = date.getFullYear()
  return `${day}, ${month} ${year}`
}


const ComunicacionColumns: Column<Comunicacion>[] = [
    { key: "titulo", label: "Titulo" },
    { key: "dirigido_a", label: "Dirigido A"},
    { key: "fecha", label: "Fecha" }
  ]

export default function ComunicacionManagement({ formOpen, onCloseForm, selectedComunicacions, onEdit }: Props) {
  const [comunicacion, setComunicacion] = useState<Comunicacion[]>([])

  const fetchUsers = async () => {
    try {
      const data = await getAllComunicacions()
      setComunicacion(data)
    } catch (error) {
      console.error("Error al cargar el Comunicacion:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchUsers() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (comunicacion: Comunicacion) => {
    try {
      await deleteComunicacion(comunicacion.id!.toString());
      toast.success("Comunicacion eliminado correctamente");
      fetchUsers(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el Comunicacion");
      console.error(error);
    }
  };

  return (
    <>
      <ComunicacionForm open={formOpen} onClose={handleClose} comunicacion={selectedComunicacions} />
      <GenericTable<Comunicacion> data={comunicacion} columns={ComunicacionColumns} searchableKeys={["titulo", "dirigido_a", "fecha"]as (keyof Comunicacion)[]} customRender={{fecha: (value) => formatFechaBonita(value)}} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
