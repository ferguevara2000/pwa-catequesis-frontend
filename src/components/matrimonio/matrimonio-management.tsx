import { toast } from "sonner"
import { useEffect, useState } from "react"
import { deleteMatrimonio, getAllMatrimonios, Matrimonio } from "@/services/matrimonio"
import MatrimonioForm from "./matrimonio-form"
import TableSacraments, { Column } from "../shared/table-sacraments"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedMatrimonio?: Matrimonio
  onEdit: (matrimonio: Matrimonio) => void
  onGenerarCertificado: () => void
}

const matrimonioColumns: Column<Matrimonio>[] = [
    { key: "nombre_novio", label: "Nombres Novio" },
    { key: "apellidos_novio", label: "Apellidos Novio"},
    { key: "nombre_novia", label: "Nombres Novia" },
    { key: "apellidos_novia", label: "Apellidos Novia"},
    { key: "fecha_matrimonio", label: "Fecha" }
  ]

export default function MatrimonioManagement({ formOpen, onCloseForm, selectedMatrimonio, onEdit, onGenerarCertificado }: Props) {
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

  const formatFechaBonita = (value: string | Date) => {
    const date = new Date(value)
    const day = date.getDate()
    const month = date.toLocaleString("es-ES", { month: "long" })
    const year = date.getFullYear()
    return `${day}, ${month} ${year}`
  }


  return (
    <>
      <MatrimonioForm open={formOpen} onClose={handleClose} matrimonio={selectedMatrimonio} />
      <TableSacraments<Matrimonio> data={matrimonio} columns={matrimonioColumns} searchableKeys={["nombre_novio", "apellidos_novio", "nombre_novia", "apellidos_novia", "fecha"]as (keyof Matrimonio)[]} customRender={{fecha_matrimonio: (value) => formatFechaBonita(value)}} onEdit={onEdit} onDelete={handleDelete} onGenerarCertificado={onGenerarCertificado} />
    </>
  )
}
