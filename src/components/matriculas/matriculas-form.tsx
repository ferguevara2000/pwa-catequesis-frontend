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
  
  import { getAllEstudiantes, Estudiante } from "@/services/users";
  import { getAllCursos } from "@/services/cursos";
  import { estudianteCursoSchema } from "@/lib/validations/estudiantesCurso";
  import { createEstudianteCurso, Curso, updateEstudianteCurso, Usuario } from "@/services/estudianteCurso";
//import { EstudiantesMultiSelect } from "../shared/estudianteMultiSelect";
  
  type MatriculaFormData = {
    id?: string;
    usuario_id: string;
    curso_id: string;
    usuario?: Usuario;
    curso?: Curso;
    estado: "activo" | "aprobado" | "retirado";
    estudiante_ids?: string[];
  };
  
  export default function MatriculaForm({
    open,
    onClose,
    onMatriculaSaved,
    matricula,
  }: {
    open: boolean;
    onClose: () => void;
    onMatriculaSaved?: () => void;
    matricula?: Partial<MatriculaFormData & { id: string }>;
  }) {
    const [formData, setFormData] = useState<MatriculaFormData>({
      usuario_id: "",
      curso_id: "",
      estado: "activo",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
  
    const isCreating = !matricula;
  
    useEffect(() => {
      getAllEstudiantes().then(setEstudiantes);
      getAllCursos().then(setCursos);
    }, []);
  
    useEffect(() => {
      if (matricula) {
        setFormData({
          usuario_id: matricula.usuario?.id?.toString() || "",
          curso_id: matricula.curso?.id.toString() || "",
          estado: matricula.estado || "activo",
        });
      } else {
        setFormData({
          usuario_id: "",
          curso_id: "",
          estado: "activo",
        });
      }
      setErrors({});
    }, [matricula]);
  
    const handleSubmit = async () => {
      try {
        const validated = estudianteCursoSchema.parse({
            ...formData,
            usuario_id: Number(formData.usuario_id),
            curso_id: Number(formData.curso_id), // ✅ conversión aquí
        });
  
        if (isCreating) {
            console.log(validated)
          await createEstudianteCurso(validated);
        } else {
          await updateEstudianteCurso(validated, matricula.id!);
        }
  
        toast.success(`Matrícula ${isCreating ? "creada" : "actualizada"} exitosamente`);
        onMatriculaSaved?.();
        onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err instanceof z.ZodError) {
          const zodErrors: Record<string, string> = {};
          err.errors.forEach((e) => {
            const field = e.path[0] as string;
            zodErrors[field] = e.message;
          });
          setErrors(zodErrors);
          toast.error("Corrige los errores del formulario");
        } else if (err.status === 409) {
          toast.error("Este estudiante ya está inscrito en este curso.");
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
  
            {/* Estudiante Select */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-muted-foreground">Estudiante *</label>
              <Select
                value={formData.usuario_id}
                onValueChange={(value) => setFormData({ ...formData, usuario_id: value })}
              >
                <SelectTrigger className={clsx("w-full", errors.usuario_id && "border-red-500")}>
                  <SelectValue placeholder="Selecciona un estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {estudiantes.map((est) => (
                    <SelectItem key={est.id} value={est.id.toString()}>
                      {est.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.usuario_id && <p className="text-xs text-red-500">{errors.usuario_id}</p>}
            </div>

            {/* <div className="space-y-1">
              <label className="block text-sm font-medium text-muted-foreground">Estudiante *</label>
              <EstudiantesMultiSelect
                estudiantes={estudiantes}
                selected={formData.estudiante_ids || []}
                onChange={(ids) => setFormData((prev) => ({ ...prev, estudiante_ids: ids }))}
              />
              {errors.estudiante_ids && (
                <p className="text-xs text-red-500">{errors.estudiante_ids}</p>
              )}
            </div> */}
  
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
                onValueChange={(value) => setFormData({ ...formData, estado: value as MatriculaFormData["estado"] })}
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
  