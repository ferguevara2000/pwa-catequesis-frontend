import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { Finanza, deleteFinanza, getAllFinanzas } from "@/services/finanzas"
import FinanzaForm from "./finanzas-form"

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
  

  useEffect(() => {
    fetchData()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchData() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (Finanza: Finanza) => {
    try {
      await deleteFinanza(Finanza.id!.toString());
      toast.success("Finanza eliminado correctamente");
      fetchData(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el Finanza");
      console.error(error);
    }
  };

  return (
    <>
      <FinanzaForm open={formOpen} onClose={handleClose} finanza={selectedFinanza} />
      <GenericTable<Finanza> data={Finanza} columns={FinanzaColumns} searchableKeys={["barrio_id", "actualizado_en"]as (keyof Finanza)[]} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
