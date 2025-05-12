import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { z } from "zod";
import { finanzaSchema } from "@/lib/validations/finanzasSchema";
import {
  createFinanza,
  updateFinanza,
  getAllBarrios,
  Finanza,
} from "@/services/finanzas";

type Barrio = {
  id: number;
  nombre: string;
};

type FinanzaFormData = {
  barrio_id: number;
  total_ingresos: number;
  total_egresos: number;
  saldo: number;
  actualizado_en: string;
};

export default function FinanzaForm({
  open,
  onClose,
  onFinanzaSaved,
  finanza,
}: {
  open: boolean;
  onClose: () => void;
  onFinanzaSaved?: () => void;
  finanza?: Partial<Finanza>;
}) {
  const [formData, setFormData] = useState<FinanzaFormData>({
    barrio_id: 0,
    total_ingresos: 0,
    total_egresos: 0,
    saldo: 0,
    actualizado_en: "",
  });

  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isCreating = !finanza;

  useEffect(() => {
    const fetchBarrios = async () => {
      const data = await getAllBarrios();
      setBarrios(data);
    };
    fetchBarrios();
  }, []);

  useEffect(() => {
    if (finanza) {
      setFormData({
        barrio_id: finanza.barrio_id ?? 0,
        total_ingresos: finanza.total_ingresos ?? 0,
        total_egresos: finanza.total_egresos ?? 0,
        saldo: finanza.saldo ?? 0,
        actualizado_en: finanza.actualizado_en?.slice(0, 10) ?? "",
      });
    } else {
      setFormData({
        barrio_id: 0,
        total_ingresos: 0,
        total_egresos: 0,
        saldo: 0,
        actualizado_en: "",
      });
    }
    setErrors({});
  }, [finanza]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ["barrio_id", "total_ingresos", "total_egresos", "saldo"];
    const newValue = numericFields.includes(name)
      ? Number(value)
      : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    try {
      const validated = finanzaSchema.parse(formData);
      console.log(validated)

      if (isCreating) {
        await createFinanza(validated);
      } else {
        await updateFinanza(finanza!.id!, validated);
      }

      toast.success(`Finanza ${isCreating ? "creada" : "actualizada"} exitosamente`);
      onFinanzaSaved?.();
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          const field = e.path[0] as string;
          zodErrors[field] = e.message;
        });
        setErrors(zodErrors);
        console.log(zodErrors)
        toast.error("Corrige los errores del formulario");
      } else {
        toast.error("Error inesperado al validar");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isCreating ? "Registrar Finanza" : "Editar Finanza"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {/* Barrio */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Barrio</label>
            <Select
              value={formData.barrio_id.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  barrio_id: Number(value),
                }))
              }
            >
              <SelectTrigger className={clsx(errors["barrio_id"] && "border-red-500", "w-full")}>
                <SelectValue placeholder="Selecciona un barrio" />
              </SelectTrigger>
              <SelectContent>
                {barrios.map((barrio) => (
                  <SelectItem key={barrio.id} value={barrio.id.toString()}>
                    {barrio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors["barrio_id"] && (
              <p className="text-xs text-red-500">{errors["barrio_id"]}</p>
            )}
          </div>

          {/* Total Ingresos */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Total Ingresos</label>
            <Input
              name="total_ingresos"
              type="number"
              value={formData.total_ingresos}
              onChange={handleChange}
              className={clsx(errors["total_ingresos"] && "border-red-500")}
            />
            {errors["total_ingresos"] && (
              <p className="text-xs text-red-500">{errors["total_ingresos"]}</p>
            )}
          </div>

          {/* Total Egresos */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Total Egresos</label>
            <Input
              name="total_egresos"
              type="number"
              value={formData.total_egresos}
              onChange={handleChange}
              className={clsx(errors["total_egresos"] && "border-red-500")}
            />
            {errors["total_egresos"] && (
              <p className="text-xs text-red-500">{errors["total_egresos"]}</p>
            )}
          </div>

          {/* Saldo */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Saldo</label>
            <Input
              name="saldo"
              type="number"
              value={formData.saldo}
              onChange={handleChange}
              className={clsx(errors["saldo"] && "border-red-500")}
            />
            {errors["saldo"] && (
              <p className="text-xs text-red-500">{errors["saldo"]}</p>
            )}
          </div>

          {/* Fecha Actualización */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Fecha Actualización</label>
            <Input
              name="actualizado_en"
              type="date"
              value={formData.actualizado_en}
              onChange={handleChange}
              className={clsx(errors["actualizado_en"] && "border-red-500")}
            />
            {errors["actualizado_en"] && (
              <p className="text-xs text-red-500">{errors["actualizado_en"]}</p>
            )}
          </div>
        </div>

        <Button className="w-full mt-6 cursor-pointer" onClick={handleSubmit}>
          {isCreating ? "Crear Finanza" : "Actualizar Finanza"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
