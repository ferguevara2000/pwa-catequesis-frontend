import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { useEffect, useState } from "react";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { toast } from "sonner";
  import clsx from "clsx";
  import { z } from "zod";
  import { cursoSchema } from "@/lib/validations/cursoSchema";
  import { createCurso, getAllNiveles, Nivel, updateCurso } from "@/services/cursos";
import { Catequista, getAllCatequistas } from "@/services/users";
import { ComboBox } from "../shared/combobox";
  
  type CursoFormData = {
    id?: number;
    nombre: string;
    descripcion: string;
    nivel_id: string;
    nivel?: Nivel;
    fecha_inicio: string;
    fecha_fin: string;
    horario: string;
    catequista_id: string;
    catequista?: Catequista;
  };
  
  export default function CursoForm({
    open,
    onClose,
    onCursoSaved,
    curso,
  }: {
    open: boolean;
    onClose: () => void;
    onCursoSaved?: () => void;
    curso?: Partial<CursoFormData>;
  }) {
    const [formData, setFormData] = useState<CursoFormData>({
      nombre: "",
      descripcion: "",
      nivel_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      horario: "",
      catequista_id: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [niveles, setNiveles] = useState<Nivel[]>([]);
    const [catequistas, setCatequistas] = useState<Catequista[]>([]);
  
    const isCreating = !curso;
  
    useEffect(() => {
      async function fetchCatequistas() {
        const data = await getAllCatequistas();
        setCatequistas(data);
      }
    
      fetchCatequistas();
    }, []);

    useEffect(() => {
      const fetchNiveles = async () => {
        try {
          const data = await getAllNiveles();
          setNiveles(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          toast.error("Error al obtener los niveles");
        }
      };
  
      fetchNiveles();
    }, []);
  
    useEffect(() => {
      if (curso && catequistas) {
        setFormData({
          nombre: curso.nombre ?? "",
          descripcion: curso.descripcion ?? "",
          nivel_id: curso.nivel?.id?.toString() ?? "",
          fecha_inicio: curso.fecha_inicio ?? "",
          fecha_fin: curso.fecha_fin ?? "",
          horario: curso.horario ?? "",
          catequista_id: curso.catequista?.id.toString() ?? ""
        });
      } else {
        setFormData({
          nombre: "",
          descripcion: "",
          nivel_id: "",
          fecha_inicio: "",
          fecha_fin: "",
          horario: "",
          catequista_id: ""
        });
      }
      setErrors({});
    }, [curso, catequistas]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    };
  
    const handleNivelChange = (value: string) => {
      setFormData((prev) => ({ ...prev, nivel_id: (value) }));
      setErrors((prev) => ({ ...prev, nivel_id: "" }));
    };
  
    const handleSubmit = async () => {
      try {
        const validated = cursoSchema.parse({
            ...formData,
            catequista_id: Number(formData.catequista_id),
            nivel_id: Number(formData.nivel_id), // ✅ conversión aquí
          });
          console.log(validated)
        if (isCreating){
            await createCurso(validated)
        }else{
            await updateCurso(validated, curso.id!.toString())
        }
  
        // Aquí iría createCurso o updateCurso según el caso
        toast.success(`Curso ${isCreating ? "creado" : "actualizado"} exitosamente`);
  
        setFormData({
          nombre: "",
          descripcion: "",
          nivel_id: "",
          fecha_inicio: "",
          fecha_fin: "",
          horario: "",
          catequista_id: ""
        });
  
        onCursoSaved?.();
        onClose();
      } catch (err) {
        if (err instanceof z.ZodError) {
          const zodErrors: Record<string, string> = {};
          err.errors.forEach((e) => {
            const field = e.path[0] as string;
            zodErrors[field] = e.message;
          });
          setErrors(zodErrors);
          toast.error("Corrige los errores del formulario");
        } else {
          toast.error("Error inesperado al validar");
        }
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Crear curso" : "Editar curso"}</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4 pt-2">
            {[
              { label: "Nombre", name: "nombre" },
              { label: "Descripción", name: "descripcion" },
              { label: "Fecha de inicio", name: "fecha_inicio", type: "date" },
              { label: "Fecha de fin", name: "fecha_fin", type: "date" },
              { label: "Horario", name: "horario" },
            ].map(({ label, name, type = "text" }) => (
              <div className="space-y-1" key={name}>
                <label className="block text-sm font-medium text-muted-foreground">
                  {label} *
                </label>
                <Input
                  name={name}
                  type={type}
                  value={String(formData[name as keyof CursoFormData] ?? "")}
                  onChange={handleChange}
                  className={clsx(errors[name] && "border-red-500")}
                />
                {errors[name] && (
                  <p className="text-xs text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}

            {/* Catequista Combobox */}
            <div className="space-y-1 w-full">
              <label className="block text-sm font-medium text-muted-foreground">
                Catequista *
              </label>
              <ComboBox 
                options={catequistas.map((c) => ({
                  value: c.id.toString(),
                  label: c.nombre
                }))}
                value={formData.catequista_id}
                onChange={(value) => setFormData({...formData, catequista_id:value})}
                label="catequista"
                placeholder="Seleccione un catequista"

              />
              {errors.catequista_id && (
                <p className="text-xs text-red-500">{errors.catequista_id}</p>
              )}
            </div>
  
            {/* Nivel Select */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-muted-foreground">
                Nivel *
              </label>
              <Select value={formData.nivel_id?.toString() || ""} onValueChange={handleNivelChange}>
                <SelectTrigger className={clsx("w-full", errors.nivel_id && "border-red-500")}>
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  {niveles.map((nivel) => (
                    <SelectItem key={nivel.id} value={nivel.id!.toString()}>
                      {nivel.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nivel_id && (
                <p className="text-xs text-red-500">{errors.nivel_id}</p>
              )}
            </div>
  
            <Button className="w-full cursor-pointer" onClick={handleSubmit}>
              {isCreating ? "Crear curso" : "Actualizar curso"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  