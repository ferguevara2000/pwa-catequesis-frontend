import { useEffect, useState } from "react"
import { Column } from "../shared/generic-table"
import { Finanza, getAllFinanzas } from "@/services/finanzas"
import FinanzaForm from "./finanzas-form"
import FinanzasTable from "./finanzas-table"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedFinanza?: Finanza
  onEdit: (Finanza: Finanza) => void
}

const FinanzaColumns: Column<Finanza>[] = [
    { key: "barrio_nombre", label: "Barrio"},
    { key: "saldo", label: "Saldo"},
    { key: "actualizado_en", label: "Última Actualización" }
  ]

export default function FinanzaManagement({ formOpen, onCloseForm, selectedFinanza, onEdit }: Props) {
  const [Finanza, setFinanza] = useState<Finanza[]>([])

  const fetchData = async () => {
    try {
      const data = await getAllFinanzas();
  
      const dataWithBarrioNombre = data.map((finanza) => ({
        ...finanza,
        barrio_nombre: finanza.barrios?.nombre ?? "Sin barrio",
      }));
  
      setFinanza(dataWithBarrioNombre);
    } catch (error) {
      console.error("Error al cargar el Finanza:", error);
    }
  };

  const formatFechaBonita = (value: string | Date) => {
    const date = new Date(value)
    const day = date.getDate()
    const month = date.toLocaleString("es-ES", { month: "long" })
    const year = date.getFullYear()
    return `${day}, ${month} ${year}`
  }

  

  useEffect(() => {
    fetchData()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchData() // recarga usuarios después de cerrar el form
  }

  return (
    <>
      <FinanzaForm open={formOpen} onClose={handleClose} finanza={selectedFinanza} />
      <FinanzasTable<Finanza> data={Finanza} columns={FinanzaColumns} searchableKeys={["barrio_id", "actualizado_en"]as (keyof Finanza)[]} customRender={{actualizado_en: (value) => formatFechaBonita(value)}} onView={onEdit} />
    </>
  )
}
