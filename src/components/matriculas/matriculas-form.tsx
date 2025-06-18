/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { z } from "zod";

import { Estudiante } from "@/services/users";
import { getAllCursos } from "@/services/cursos";
import {
  createEstudianteCurso,
  Cursos,
  getAllEstudiantesNoMatriculados,
  updateEstudianteCurso,
  Usuario,
} from "@/services/estudianteCurso";
import { EstudianteMultiSelect } from "../shared/estudianteMultiSelect";
import { estudianteCursoSchema, estudianteCursoUpdateSchema } from "@/lib/validations/estudiantesCurso";
import { Input } from "../ui/input";

type MatriculaFormData = {
  id?: number;
  usuario_id: string;
  curso_id: string;
  usuario?: Usuario;
  curso?: Cursos;
  estado: "activo" | "aprobado" | "retirado";
  estudiante_ids?: string[];
};

export default function MatriculaForm({ open, onClose, onMatriculaSaved, matricula }: {
  open: boolean;
  onClose: () => void;
  onMatriculaSaved?: () => void;
  matricula?: Partial<MatriculaFormData>;
}) {
  const [formData, setFormData] = useState<MatriculaFormData>({
    usuario_id: "",
    curso_id: "",
    estado: "activo",
    estudiante_ids: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Cursos[]>([]);

  const isCreating = !matricula;

  useEffect(() => {
    if (open) {
          getAllEstudiantesNoMatriculados().then(setEstudiantes);
          getAllCursos().then(setCursos);
        }

    if (matricula) {
      setFormData({
        usuario_id: matricula.usuario?.id?.toString() || "",
        curso_id: matricula.curso?.id.toString() || "",
        estado: matricula.estado || "activo",
        estudiante_ids: matricula.estudiante_ids || [],
      });
    } else {
      setFormData({
        usuario_id: "",
        curso_id: "",
        estado: "activo",
        estudiante_ids: [],
      });
    }
    setErrors({});
  }, [open, matricula]);

  const handleSubmit = async () => {
    try {
      if (isCreating) {
        // Validar y enviar array (crear múltiples matrículas)
        if (!formData.estudiante_ids || formData.estudiante_ids.length === 0) {
          setErrors({ estudiante_ids: "Selecciona al menos un estudiante" });
          toast.error("Corrige los errores del formulario");
          return;
        }

        const validatedData = estudianteCursoSchema
          .omit({ usuario_ids: true })
          .parse({
            curso_id: Number(formData.curso_id),
            estado: formData.estado,
          });

        const results = await Promise.allSettled(
          formData.estudiante_ids.map((id) =>
            createEstudianteCurso({
              ...validatedData,
              usuario_ids: [Number(id)],
            })
          )
        );

        const errorsCount = results.filter((r) => r.status === "rejected").length;

        if (errorsCount === 0) {
          toast.success("Matrículas creadas exitosamente");
          onMatriculaSaved?.();
          onClose();
        } else {
          toast.error(`Se produjo un error en ${errorsCount} de las matrículas`);
        }
      } else {

        const validatedDataUpdate = estudianteCursoUpdateSchema.parse({
          usuario_id: Number(formData.usuario_id),
          curso_id: Number(formData.curso_id),
          estado: formData.estado,
        });

        await updateEstudianteCurso(validatedDataUpdate, matricula.id!.toString());
        toast.success("Matrícula actualizada exitosamente");
        onMatriculaSaved?.();
        onClose();
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          const field = e.path[0] as string;
          zodErrors[field] = e.message;
        });
        setErrors(zodErrors);
        toast.error("Corrige los errores del formulario");
      } else {
        toast.error("Error inesperado al guardar la matrícula");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isCreating ? "Nueva matrícula" : "Editar matrícula"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* En modo creación: multi-select para estudiantes */}
          {isCreating ? (
            <div className="space-y-1">
              <label className="block text-sm font-medium mb-2">Estudiantes seleccionados *</label>
              <EstudianteMultiSelect
                estudiantes={estudiantes}
                onChange={(seleccionados) =>
                  setFormData({
                    ...formData,
                    estudiante_ids: seleccionados.map((e) => e.id.toString()),
                  })
                }
                placeholder="Seleccionar estudiantes..."
                emptyMessage="No se encontraron estudiantes no matriculados."
              />
              {errors.estudiante_ids && (
                <p className="text-xs text-red-500">{errors.estudiante_ids}</p>
              )}
            </div>
          ) : (
            // En modo edición: mostrar solo el estudiante bloqueado en un label o input readonly
            <div className="space-y-1">
              <label className="block text-sm font-medium mb-2">Estudiante</label>
              <Input
                value={matricula?.usuario?.nombre || "Estudiante no encontrado"}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
          )}

          {/* Curso Select */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-muted-foreground">Curso *</label>
            <Select
              value={formData.curso_id}
              onValueChange={(value) => setFormData({ ...formData, curso_id: value })}
            >
              <SelectTrigger className={clsx("w-full", errors.curso_id && "border-red-500")}>
                <SelectValue placeholder="Selecciona un curso" />
              </SelectTrigger>
              <SelectContent>
                {cursos.map((curso) => (
                  <SelectItem key={curso.id} value={curso.id.toString()}>
                    {curso.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.curso_id && <p className="text-xs text-red-500">{errors.curso_id}</p>}
          </div>

          {/* Estado Select */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-muted-foreground">Estado *</label>
            <Select
              value={formData.estado}
              onValueChange={(value) =>
                setFormData({ ...formData, estado: value as MatriculaFormData["estado"] })
              }
            >
              <SelectTrigger className={clsx("w-full", errors.estado && "border-red-500")}>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {["activo", "aprobado", "retirado"].map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.estado && <p className="text-xs text-red-500">{errors.estado}</p>}
          </div>

          <Button className="w-full cursor-pointer" onClick={handleSubmit}>
            {isCreating ? "Crear matrícula" : "Actualizar matrícula"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
