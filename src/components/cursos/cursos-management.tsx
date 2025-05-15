import { toast } from "sonner"
import { useEffect, useState } from "react"
import GenericTable, { Column } from "../shared/generic-table"
import { Curso, deleteCurso, getAllCursos } from "@/services/cursos"
import CursoForm from "../cursos/cursos-form"
import { getAllEstudiantesByCursoId } from "@/services/estudianteCurso"

interface Props {
  formOpen: boolean
  onCloseForm: () => void
  selectedCursos?: Curso
  onEdit: (curso: Curso) => void
}

const cursoColumns: Column<Curso>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "nivel_nombre", label: "Nivel"},
    { key: "horario", label: "Horario" },
  ]

export default function CursosManagement({ formOpen, onCloseForm, selectedCursos, onEdit }: Props) {
  const [cursos, setCursos] = useState<Curso[]>([])

  const fetchUsers = async () => {
    try {
      const data = await getAllCursos()
      const cursosConNivelPlano = data.map(data => ({
        ...data,
        nivel_nombre: data.nivel?.nombre ?? 'Sin nivel',
      }));
      setCursos(cursosConNivelPlano)
    } catch (error) {
      console.error("Error al cargar el curso:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleClose = () => {
    onCloseForm()
    fetchUsers() // recarga usuarios después de cerrar el form
  }

  const handleDelete = async (curso: Curso) => {
    try {
      const estudiantes = await getAllEstudiantesByCursoId(curso.id.toString());

      if (estudiantes.length > 0) {
        toast.error("No se puede eliminar el curso porque tiene estudiantes matriculados");
        return;
      }
      await deleteCurso(curso.id!.toString());
      toast.success("Curso eliminado correctamente");
      fetchUsers(); // 🔁 recargar tabla
    } catch (error) {
      toast.error("Error al eliminar el curso");
      console.error(error);
    }
  };

  return (
    <>
      <CursoForm open={formOpen} onClose={handleClose} curso={selectedCursos} />
      <GenericTable<Curso> data={cursos} columns={cursoColumns} searchableKeys={["nombre", "nivel_nombre", "horario"]as (keyof Curso)[]} onEdit={onEdit} onDelete={handleDelete} />
    </>
  )
}
