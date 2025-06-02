import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Bautismo, deleteBautismo, getAllBautismos } from "@/services/bautismos"
import BautismoForm from "./bautismo-form"
import TableSacraments, { Column } from "../shared/table-sacraments"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedBautismos?: Bautismo
  onEdit: (bautismo: Bautismo) => void
  onGenerarCertificado: (bautismo: Bautismo) => void
}

const bautismoColumns: Column<Bautismo>[] = [
  { key: "nombres", label: "Nombres" },
  { key: "apellidos", label: "Apellidos" },
  { key: "fecha_bautismo", label: "Fecha" }
]

export default function BautismoManagement({
  formOpen,
  onCloseForm,
  selectedBautismos,
  onEdit,
  onGenerarCertificado
}: Props) {
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
    fetchUsers()
  }

  const handleDelete = async (bautismo: Bautismo) => {
    try {
      await deleteBautismo(bautismo.id!.toString())
      toast.success("Bautismo eliminado correctamente")
      fetchUsers()
    } catch (error) {
      toast.error("Error al eliminar el bautismo")
      console.error(error)
    }
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
      <BautismoForm open={formOpen} onClose={handleClose} bautismo={selectedBautismos} />
      <TableSacraments<Bautismo>
        data={bautismo}
        columns={bautismoColumns}
        searchableKeys={["nombres", "apellidos", "partida", "fecha"] as (keyof Bautismo)[]}
        customRender={{ fecha_bautismo: (value) => formatFechaBonita(value) }}
        onEdit={onEdit}
        onDelete={handleDelete}
        onGenerarCertificado={onGenerarCertificado}
      />
    </>
  )
}
