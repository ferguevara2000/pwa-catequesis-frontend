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
  import { confirmacionSchema } from "@/lib/validations/confirmacionSchema";
  import { createConfirmacion, updateConfirmacion, Confirmacion } from "@/services/confirmacion";
  
  type ConfirmacionFormData = {
    nombres: string;
    apellidos: string;
    sexo: string;
    fecha: string;
    sacerdote: string;
    padrino?: string;
    madrina?: string;
    padre?: string;
    madre?: string;
  };
  
  export default function ConfirmacionForm({
    open,
    onClose,
    onConfirmacionSaved,
    confirmacion,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirmacionSaved?: () => void;
    confirmacion?: Partial<Confirmacion>;
  }) {
    const [formData, setFormData] = useState<ConfirmacionFormData>({
      nombres: "",
      apellidos: "",
      sexo: "",
      fecha: "",
      sacerdote: "",
      padrino: "",
      madrina: "",
      padre: "",
      madre: "",
    });
  
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isCreating = !confirmacion;
  
    useEffect(() => {
      if (confirmacion) {
        setFormData({
          nombres: confirmacion.nombres ?? "",
          apellidos: confirmacion.apellidos ?? "",
          sexo: confirmacion.sexo ?? "",
          fecha: confirmacion.fecha?.slice(0, 10) ?? "",
          sacerdote: confirmacion.sacerdote ?? "",
          padrino: confirmacion.padrino ?? "",
          madrina: confirmacion.madrina ?? "",
          padre: confirmacion.padre ?? "",
          madre: confirmacion.madre ?? "",
        });
      } else {
        setFormData({
          nombres: "",
          apellidos: "",
          sexo: "",
          fecha: "",
          sacerdote: "",
          padrino: "",
          madrina: "",
          padre: "",
          madre: "",
        });
      }
      setErrors({});
    }, [confirmacion]);
  
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
        const validated = confirmacionSchema.parse(formData);
  
        if (isCreating) {
          await createConfirmacion(validated);
        } else {
          await updateConfirmacion(confirmacion!.id!, validated);
        }
  
        toast.success(`Confirmación ${isCreating ? "creada" : "actualizada"} exitosamente`);
  
        onConfirmacionSaved?.();
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
      {
        label: "Sexo",
        name: "sexo",
        type: "select",
        options: [
          { label: "Mujer", value: "Mujer" },
          { label: "Varón", value: "Varón" },
        ],
      },
      { label: "Fecha de Confirmación", name: "fecha", type: "date" },
      { label: "Sacerdote", name: "sacerdote" },
      { label: "Padrino", name: "padrino" },
      { label: "Madrina", name: "madrina" },
      { label: "Padre", name: "padre" },
      { label: "Madre", name: "madre" },
    ];
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Registrar Confirmación" : "Editar Confirmación"}
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
                    value={formData[name as keyof ConfirmacionFormData]}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, [name]: value }))
                    }
                  >
                    <SelectTrigger className={clsx("w-full", errors[name] && "border-red-500")}>
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
                    value={formData[name as keyof ConfirmacionFormData] || ""}
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
            {isCreating ? "Crear confirmación" : "Actualizar confirmación"}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
  