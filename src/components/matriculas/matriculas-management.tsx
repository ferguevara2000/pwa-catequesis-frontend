import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { deleteEstudianteCurso, estudianteCurso, getAllEstudiantesCursos } from "@/services/estudianteCurso"
import MatriculaForm from "./matriculas-form"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedestudianteCurso?: estudianteCurso
  onEdit: (curso: estudianteCurso) => void
  onDataReady?: (data: estudianteCurso[]) => void
}

const cursoColumns: Column<estudianteCurso>[] = [
    { key: "usuario_nombre", label: "Estudiante" },
    { key: "curso_nombre", label: "Curso"},
    { key: "estado", label: "Estado" },
  ]

export default function MatriculasManagement({ formOpen, onCloseForm, selectedestudianteCurso, onEdit, onDataReady }: Props) {
  const [estudianteCurso, setestudianteCurso] = useState<estudianteCurso[]>([])

  const fetchEstudiantesCursos = async () => {
    try {
      const data = await getAllEstudiantesCursos()
      const estudianteCursoConNivelPlano = data.map(data => ({
        ...data,
        usuario_nombre: data.usuario?.nombre ?? 'Estudiante no asignado',
        curso_nombre: data.curso?.nombre ?? 'Sin curso'
      }));
      setestudianteCurso(estudianteCursoConNivelPlano)
    } catch (error) {
      console.error("Error al cargar el curso:", error)
    }
  }

  useEffect(() => {
    fetchEstudiantesCursos()
  }, [])

  useEffect(() => {
    onDataReady?.(estudianteCurso) // tablaDatos es tu array de cursos actuales
  }, [estudianteCurso, onDataReady])

  const handleClose = () => {
    onCloseForm()
    fetchEstudiantesCursos() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (estudianteCurso: estudianteCurso) => {
    try {
      await deleteEstudianteCurso(estudianteCurso.id!.toString());
      toast.success("Fila eliminada correctamente");
      fetchEstudiantesCursos(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el campo");
      console.error(error);
    }
  };

  return (
    <>
      <MatriculaForm open={formOpen} onClose={handleClose} matricula={selectedestudianteCurso} />
      <GenericTable<estudianteCurso> data={estudianteCurso} columns={cursoColumns} searchableKeys={["usuario_nombre", "curso_nombre"]as (keyof estudianteCurso)[]} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
