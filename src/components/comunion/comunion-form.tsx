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
  import { comunionSchema } from "@/lib/validations/comunionSchema";
  import {
    createComunion,
    updateComunion,
    Comunion,
  } from "@/services/comunion";
  
  type ComunionFormData = {
    nombres: string;
    apellidos: string;
    fecha: string;
    sacerdote: string;
    padrino?: string;
    madrina?: string;
    padre?: string;
    madre?: string;
  };
  
  export default function ComunionForm({
    open,
    onClose,
    onComunionSaved,
    comunion,
  }: {
    open: boolean;
    onClose: () => void;
    onComunionSaved?: () => void;
    comunion?: Partial<Comunion>;
  }) {
    const [formData, setFormData] = useState<ComunionFormData>({
      nombres: "",
      apellidos: "",
      fecha: "",
      sacerdote: "",
      padrino: "",
      madrina: "",
      padre: "",
      madre: "",
    });
  
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isCreating = !comunion;
  
    useEffect(() => {
      if (comunion) {
        setFormData({
          nombres: comunion.nombres ?? "",
          apellidos: comunion.apellidos ?? "",
          fecha: comunion.fecha?.slice(0, 10) ?? "",
          sacerdote: comunion.sacerdote ?? "",
          padrino: comunion.padrino ?? "",
          madrina: comunion.madrina ?? "",
          padre: comunion.padre ?? "",
          madre: comunion.madre ?? "",
        });
      } else {
        setFormData({
          nombres: "",
          apellidos: "",
          fecha: "",
          sacerdote: "",
          padrino: "",
          madrina: "",
          padre: "",
          madre: "",
        });
      }
      setErrors({});
    }, [comunion]);
  
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
        const validated = comunionSchema.parse(formData);
  
        if (isCreating) {
          await createComunion(validated);
        } else {
          await updateComunion(comunion!.id!, validated);
        }
  
        toast.success(
          `Comunión ${isCreating ? "creada" : "actualizada"} exitosamente`
        );
  
        onComunionSaved?.();
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
      { label: "Fecha de Comunión", name: "fecha", type: "date" },
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
              {isCreating ? "Registrar Comunión" : "Editar Comunión"}
            </DialogTitle>
          </DialogHeader>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {fields.map(({ label, name, type = "text" }) => (
              <div key={name} className="flex flex-col">
                <label className="block text-sm font-medium text-muted-foreground">
                  {label} *
                </label>
                <Input
                  name={name}
                  type={type}
                  value={formData[name as keyof ComunionFormData] || ""}
                  onChange={handleChange}
                  className={clsx(errors[name] && "border-red-500")}
                />
                {errors[name] && (
                  <p className="text-xs text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>
  
          <Button className="w-full mt-6 cursor-pointer" onClick={handleSubmit}>
            {isCreating ? "Crear comunión" : "Actualizar comunión"}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
  