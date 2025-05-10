import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { z } from "zod";
import { bautismoSchema } from "@/lib/validations/bautismoSchema";
import { createBautismo, updateBautismo, Bautismo } from "@/services/bautismos";

type BautismoFormData = {
  sacerdote: string;
  sexo: string;
  fecha_nacimiento: string;
  nombres: string;
  apellidos: string;
  fecha_bautismo: string;
  nombres_padre?: string;
  apellidos_padre?: string;
  nombres_madre?: string;
  apellidos_madre?: string;
  padrino?: string;
  madrina?: string;
};

export default function BautismoForm({
  open,
  onClose,
  onBautismoSaved,
  bautismo,
}: {
  open: boolean;
  onClose: () => void;
  onBautismoSaved?: () => void;
  bautismo?: Partial<Bautismo>;
}) {
  const [formData, setFormData] = useState<BautismoFormData>({
    sacerdote: "",
    sexo: "",
    fecha_nacimiento: "",
    nombres: "",
    apellidos: "",
    fecha_bautismo: "",
    nombres_padre: "",
    apellidos_padre: "",
    nombres_madre: "",
    apellidos_madre: "",
    padrino: "",
    madrina: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isCreating = !bautismo;

  useEffect(() => {
    if (bautismo) {
      setFormData({
        sacerdote: bautismo.sacerdote ?? "",
        sexo: bautismo.sexo ?? "",
        fecha_nacimiento: bautismo.fecha_nacimiento?.slice(0, 10) ?? "",
        nombres: bautismo.nombres ?? "",
        apellidos: bautismo.apellidos ?? "",
        fecha_bautismo: bautismo.fecha_bautismo?.slice(0, 10) ?? "",
        nombres_padre: bautismo.nombres_padre ?? "",
        apellidos_padre: bautismo.apellidos_padre ?? "",
        nombres_madre: bautismo.nombres_madre ?? "",
        apellidos_madre: bautismo.apellidos_madre ?? "",
        padrino: bautismo.padrino ?? "",
        madrina: bautismo.madrina ?? "",
      });
    } else {
      setFormData({
        sacerdote: "",
        sexo: "",
        fecha_nacimiento: "",
        nombres: "",
        apellidos: "",
        fecha_bautismo: "",
        nombres_padre: "",
        apellidos_padre: "",
        nombres_madre: "",
        apellidos_madre: "",
        padrino: "",
        madrina: "",
      });
    }
    setErrors({});
  }, [bautismo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  

  const handleSubmit = async () => {
    try {
    
      const validated = bautismoSchema.parse(formData);
      

      if (isCreating) {
        await createBautismo(validated);
      } else {
        await updateBautismo(bautismo!.id!, validated);
      }

      toast.success(`Bautismo ${isCreating ? "creado" : "actualizado"} exitosamente`);

      onBautismoSaved?.();
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

  const fields = [
    { label: "Sacerdote", name: "sacerdote" },
    { label: "Sexo", name: "sexo", type: "select" },
    { label: "Fecha de nacimiento", name: "fecha_nacimiento", type: "date" },
    { label: "Nombres", name: "nombres" },
    { label: "Apellidos", name: "apellidos" },
    { label: "Fecha de bautismo", name: "fecha_bautismo", type: "date" },
    { label: "Nombres del padre", name: "nombres_padre" },
    { label: "Apellidos del padre", name: "apellidos_padre" },
    { label: "Nombres de la madre", name: "nombres_madre" },
    { label: "Apellidos de la madre", name: "apellidos_madre" },
    { label: "Padrino", name: "padrino" },
    { label: "Madrina", name: "madrina" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl"> {/* Ajusté el ancho de la ventana */}
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Ingresar un nuevo bautismo" : "Editar el registro de bautismo"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pt-4">
          {fields.map(({ label, name, type = "text" }) => (
            <div key={name} className="flex flex-col">
              <label className="block text-sm font-medium text-muted-foreground">
                {label} *
              </label>
              {type === "select" ? (
                <Select
                  value={formData[name as keyof BautismoFormData]}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, [name]: value }))
                  }
                >
                  <SelectTrigger className={clsx("w-full", errors[name] && "border-red-500")}>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="niño">Niño</SelectItem>
                    <SelectItem value="niña">Niña</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  name={name}
                  type={type}
                  value={formData[name as keyof BautismoFormData]}
                  onChange={handleChange}
                  className={clsx(errors[name] && "border-red-500")}
                />
              )}
              {errors[name] && (
                <p className="text-xs text-red-500">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>

        <Button className="w-full mt-6 cursor-pointer" onClick={handleSubmit}>
          {isCreating ? "Crear bautismo" : "Actualizar bautismo"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
