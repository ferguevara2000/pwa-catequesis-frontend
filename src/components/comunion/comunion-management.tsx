import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { Comunion, deleteComunion, getAllComuniones } from "@/services/comunion"
import ComunionForm from "./comunion-form"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedComunion?: Comunion
  onEdit: (Comunion: Comunion) => void
}

const ComunionColumns: Column<Comunion>[] = [
    { key: "nombres", label: "Nombres" },
    { key: "apellidos", label: "Apellidos"},
    { key: "fecha", label: "Fecha" }
  ]

export default function ComunionManagement({ formOpen, onCloseForm, selectedComunion, onEdit }: Props) {
  const [Comunion, setComunion] = useState<Comunion[]>([])

  const fetchData = async () => {
    try {
      const data = await getAllComuniones()
      setComunion(data)
    } catch (error) {
      console.error("Error al cargar el Comunion:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchData() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (Comunion: Comunion) => {
    try {
      await deleteComunion(Comunion.id!.toString());
      toast.success("Comunion eliminado correctamente");
      fetchData(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el Comunion");
      console.error(error);
    }
  };

  const formatFechaBonita = (value: string | Date) => {
    const date = new Date(value)
    const day = date.getDate()
    const month = date.toLocaleString("es-ES", { month: "long" })
    const year = date.getFullYear()
    return `${day}, ${month} ${year}`
  }


  return (
    <>
      <ComunionForm open={formOpen} onClose={handleClose} comunion={selectedComunion} />
      <GenericTable<Comunion> data={Comunion} columns={ComunionColumns} searchableKeys={["nombres", "apellidos", "fecha"]as (keyof Comunion)[]} customRender={{fecha: (value) => formatFechaBonita(value)}} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
