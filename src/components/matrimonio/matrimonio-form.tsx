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
  import { matrimonioSchema } from "@/lib/validations/matrimonioSchema"; // Asegúrate de definir este esquema
  import { createMatrimonio, updateMatrimonio, Matrimonio } from "@/services/matrimonio"; // Asegúrate de definir estos servicios
  
  type MatrimonioFormData = {
    sacerdote: string;
    fecha_matrimonio: string;
    nombre_novio: string;
    apellidos_novio: string;
    padre_novio?: string;
    madre_novio?: string;
    nombre_novia: string;
    apellidos_novia: string;
    padre_novia?: string;
    madre_novia?: string;
    padrino?: string;
    madrina?: string;
  };
  
  export default function MatrimonioForm({
    open,
    onClose,
    onMatrimonioSaved,
    matrimonio,
  }: {
    open: boolean;
    onClose: () => void;
    onMatrimonioSaved?: () => void;
    matrimonio?: Partial<Matrimonio>;
  }) {
    const [formData, setFormData] = useState<MatrimonioFormData>({
      sacerdote: "",
      fecha_matrimonio: "",
      nombre_novio: "",
      apellidos_novio: "",
      padre_novio: "",
      madre_novio: "",
      nombre_novia: "",
      apellidos_novia: "",
      padre_novia: "",
      madre_novia: "",
      padrino: "",
      madrina: "",
    });
  
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isCreating = !matrimonio;
  
    useEffect(() => {
      if (matrimonio) {
        setFormData({
          sacerdote: matrimonio.sacerdote ?? "",
          fecha_matrimonio: matrimonio.fecha_matrimonio?.slice(0, 10) ?? "",
          nombre_novio: matrimonio.nombre_novio ?? "",
          apellidos_novio: matrimonio.apellidos_novio ?? "",
          padre_novio: matrimonio.padre_novio ?? "",
          madre_novio: matrimonio.madre_novio ?? "",
          nombre_novia: matrimonio.nombre_novia ?? "",
          apellidos_novia: matrimonio.apellidos_novia ?? "",
          padre_novia: matrimonio.padre_novia ?? "",
          madre_novia: matrimonio.madre_novia ?? "",
          padrino: matrimonio.padrino ?? "",
          madrina: matrimonio.madrina ?? "",
        });
      } else {
        setFormData({
          sacerdote: "",
          fecha_matrimonio: "",
          nombre_novio: "",
          apellidos_novio: "",
          padre_novio: "",
          madre_novio: "",
          nombre_novia: "",
          apellidos_novia: "",
          padre_novia: "",
          madre_novia: "",
          padrino: "",
          madrina: "",
        });
      }
      setErrors({});
    }, [matrimonio]);
  
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
        const validated = matrimonioSchema.parse(formData);
  
        if (isCreating) {
          await createMatrimonio(validated);
        } else {
          await updateMatrimonio(matrimonio!.id!, validated);
        }
  
        toast.success(`Matrimonio ${isCreating ? "creado" : "actualizado"} exitosamente`);
  
        onMatrimonioSaved?.();
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
      { label: "Fecha de matrimonio", name: "fecha_matrimonio", type: "date" },
      { label: "Nombres del novio", name: "nombre_novio" },
      { label: "Apellidos del novio", name: "apellidos_novio" },
      { label: "Padre del novio", name: "padre_novio" },
      { label: "Madre del novio", name: "madre_novio" },
      { label: "Nombres de la novia", name: "nombre_novia" },
      { label: "Apellidos de la novia", name: "apellidos_novia" },
      { label: "Padre de la novia", name: "padre_novia" },
      { label: "Madre de la novia", name: "madre_novia" },
      { label: "Padrino", name: "padrino" },
      { label: "Madrina", name: "madrina" },
    ];
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Ingresar un nuevo matrimonio" : "Editar el registro de matrimonio"}
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
                    value={formData[name as keyof MatrimonioFormData]}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, [name]: value }))
                    }
                  >
                    <SelectTrigger className={clsx("w-full", errors[name] && "border-red-500")}>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novio">Novio</SelectItem>
                      <SelectItem value="novia">Novia</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    name={name}
                    type={type}
                    value={formData[name as keyof MatrimonioFormData]}
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
            {isCreating ? "Crear matrimonio" : "Actualizar matrimonio"}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
  