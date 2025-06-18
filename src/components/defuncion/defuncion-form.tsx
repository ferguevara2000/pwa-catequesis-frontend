import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { z } from "zod";
import { defuncionSchema } from "@/lib/validations/defuncionSchema";
import {
  createDefuncion,
  updateDefuncion,
  Defuncion,
} from "@/services/defuncion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type DefuncionFormData = {
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string | null;
  sexo: string;
  fecha_defuncion: string;
  cedula?: string;
  padre?: string;
  madre?: string;
  estado_civil?: string;
  conyuge?: string;
};

export default function DefuncionForm({
  open,
  onClose,
  onDefuncionSaved,
  defuncion,
}: {
  open: boolean;
  onClose: () => void;
  onDefuncionSaved?: () => void;
  defuncion?: Partial<Defuncion>;
}) {
  const [formData, setFormData] = useState<DefuncionFormData>({
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    sexo: "",
    fecha_defuncion: "",
    cedula: "",
    padre: "",
    madre: "",
    estado_civil: "",
    conyuge: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isCreating = !defuncion;

  useEffect(() => {
    if (defuncion) {
      setFormData({
        nombres: defuncion.nombres ?? "",
        apellidos: defuncion.apellidos ?? "",
        fecha_nacimiento: defuncion.fecha_nacimiento?.slice(0, 10) ?? "",
        sexo: defuncion.sexo ?? "",
        fecha_defuncion: defuncion.fecha_defuncion?.slice(0, 10) ?? "",
        cedula: defuncion.cedula ?? "",
        padre: defuncion.padre ?? "",
        madre: defuncion.madre ?? "",
        estado_civil: defuncion.estado_civil ?? "",
        conyuge: defuncion.conyuge ?? "",
      });
    } else {
      setFormData({
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        sexo: "",
        fecha_defuncion: "",
        cedula: "",
        padre: "",
        madre: "",
        estado_civil: "",
        conyuge: "",
      });
    }
    setErrors({});
  }, [defuncion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    try {
      const validated = defuncionSchema.parse(formData);

      // 👇 Aquí normalizamos las fechas vacías
      const cleanData = {
        ...validated,
        fecha_nacimiento:
          validated.fecha_nacimiento?.trim() === ""
            ? null
            : validated.fecha_nacimiento,
      };

      if (isCreating) {
        await createDefuncion(cleanData);
      } else {
        await updateDefuncion(defuncion!.id!, cleanData);
      }

      toast.success(
        `Defunción ${isCreating ? "creada" : "actualizada"} exitosamente`
      );
      onDefuncionSaved?.();
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
    { label: "Nombres", name: "nombres" },
    { label: "Apellidos", name: "apellidos" },
    { label: "Fecha de Nacimiento", name: "fecha_nacimiento", type: "date" },
    {
      label: "Sexo",
      name: "sexo",
      type: "select",
      options: [
        { label: "Mujer", value: "Mujer" },
        { label: "Varón", value: "Varón" },
      ],
    },
    { label: "Fecha de Defunción", name: "fecha_defuncion", type: "date" },
    { label: "Cédula", name: "cedula" },
    { label: "Padre", name: "padre" },
    { label: "Madre", name: "madre" },
    {
      label: "Estado Civil",
      name: "estado_civil",
      type: "select",
      options: [
        { label: "Casado", value: "Casado" },
        { label: "Casada", value: "Casada" },
        { label: "Divorciado", value: "Divorciado" },
        { label: "Divorciada", value: "Divorciada" },
        { label: "Soltero", value: "Soltero" },
        { label: "Soltera", value: "Soltera" },
        { label: "Unido", value: "Unido" },
        { label: "Unida", value: "Unida" },
        { label: "Viudo", value: "Viudo" },
        { label: "Viuda", value: "Viuda" },
      ],
    },
    { label: "Cónyuge", name: "conyuge" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Registrar Defunción" : "Editar Defunción"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {fields.map(({ label, name, type = "text", options }) => (
            <div key={name} className="flex flex-col">
              <label className="block text-sm font-medium text-muted-foreground">
                {label} *
              </label>

              {type === "select" ? (
                <Select
                 value={(formData[name as keyof DefuncionFormData] ?? undefined) as string | undefined}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, [name]: value }))
                  }
                >
                  <SelectTrigger
                    className={clsx("w-full", errors[name] && "border-red-500")}
                  >
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  name={name}
                  type={type}
                  value={formData[name as keyof DefuncionFormData] || ""}
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
          {isCreating ? "Crear defunción" : "Actualizar defunción"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
