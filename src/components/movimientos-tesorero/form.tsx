/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { z } from "zod";
import { getAllFinanzas } from "@/services/finanzas";
import {
  createMovimiento,
  updateMovimiento,
  Movimiento,
} from "@/services/movimiento";

const movimientoSchema = z.object({
  finanza_id: z.number().min(1, "Selecciona una finanza"),
  tipo: z.enum(["Ingreso", "Egreso"]),
  monto: z.number().min(0.01, "Monto inválido"),
  fecha: z.string().min(1, "Fecha requerida"),
  registrado_por: z.string().min(1, "Campo requerido"),
  descripcion: z.string().min(1, "Campo requerido"),
});

export default function MovimientoForm({
  open,
  onClose,
  onMovimientoSaved,
  movimiento,
}: {
  open: boolean;
  onClose: () => void;
  onMovimientoSaved?: () => void;
  movimiento?: Partial<Movimiento>;
}) {
  const isCreating = !movimiento;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = `${user.nombre ?? ""} ${user.apellidos ?? ""}`.trim();
  const barrioIdUsuario = user.barrio_id;

  const [formData, setFormData] = useState({
    finanza_id: 0,
    tipo: "Ingreso" as "Ingreso" | "Egreso",
    monto: 0,
    fecha: "",
    registrado_por: fullName,
    descripcion: "",
  });

  const [finanzas, setFinanzas] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !isCreating;

  useEffect(() => {
    const fetchFinanzas = async () => {
      const data = await getAllFinanzas();
      setFinanzas(data);

      if (isCreating) {
        const finanzaUsuario = data.find(
          (f: any) => f.barrio_id === barrioIdUsuario
        );
        if (finanzaUsuario) {
          setFormData((prev) => ({
            ...prev,
            finanza_id: finanzaUsuario.id,
          }));
        }
      }
    };
    fetchFinanzas();
  }, [barrioIdUsuario, isCreating]);

  useEffect(() => {
    if (open && isCreating) {
      setFormData({
        finanza_id: user.barrio_id ?? 0,
        tipo: "Ingreso",
        monto: 0,
        fecha: "",
        registrado_por: fullName,
        descripcion: "",
      });
      setErrors({});
    }
  }, [fullName, isCreating, open, user.barrio_id]);

  useEffect(() => {
    if (movimiento) {
      setFormData({
        finanza_id: movimiento.finanza_id ?? 0,
        tipo: movimiento.tipo as "Ingreso" | "Egreso",
        monto: movimiento.monto ?? 0,
        fecha: movimiento.fecha?.slice(0, 10) ?? "",
        registrado_por: movimiento.registrado_por ?? fullName,
        descripcion: movimiento.descripcion ?? "",
      });
    } else {
      setFormData((prev) => ({ ...prev, registrado_por: fullName }));
    }
    setErrors({});
  }, [fullName, movimiento]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "monto" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    try {
      const validated = movimientoSchema.parse(formData);

      if (isCreating) {
        await createMovimiento(validated);
      } else {
        await updateMovimiento(movimiento!.id!, validated);
      }

      toast.success(
        `Movimiento ${isCreating ? "creado" : "actualizado"} exitosamente`
      );
      onMovimientoSaved?.();
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Registrar Movimiento" : "Editar Movimiento"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {/* Finanza */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">
              Barrio
            </label>
            <Select
              value={formData.finanza_id.toString()}
              disabled // <-- se bloquea siempre
            >
              <SelectTrigger
                className={clsx(
                  errors["finanza_id"] && "border-red-500",
                  "w-full"
                )}
              >
                <SelectValue placeholder="Selecciona una finanza" />
              </SelectTrigger>
              <SelectContent>
                {finanzas
                  .filter((fin) => fin.barrio_id === barrioIdUsuario)
                  .map((fin) => (
                    <SelectItem key={fin.id} value={fin.id.toString()}>
                      {fin.barrios?.nombre || `Finanza ${fin.id}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {errors["finanza_id"] && (
              <p className="text-xs text-red-500">{errors["finanza_id"]}</p>
            )}
          </div>

          {/* Tipo */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground mb-1">
              Tipo
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.tipo === "Ingreso" ? "default" : "outline"}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, tipo: "Ingreso" }))
                }
                className="flex-1"
                disabled={isEditing}
              >
                Ingreso
              </Button>
              <Button
                type="button"
                variant={formData.tipo === "Egreso" ? "destructive" : "outline"}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, tipo: "Egreso" }))
                }
                className="flex-1"
                disabled={isEditing}
              >
                Egreso
              </Button>
            </div>
            {errors["tipo"] && (
              <p className="text-xs text-red-500 mt-1">{errors["tipo"]}</p>
            )}
          </div>

          {/* Monto */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">
              Monto
            </label>
            <Input
              name="monto"
              type="number"
              value={formData.monto}
              onChange={handleChange}
              className={clsx(errors["monto"] && "border-red-500")}
              readOnly={isEditing}
            />
            {errors["monto"] && (
              <p className="text-xs text-red-500">{errors["monto"]}</p>
            )}
          </div>

          {/* Fecha */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">
              Fecha
            </label>
            <Input
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              className={clsx(errors["fecha"] && "border-red-500")}
              readOnly={isEditing}
            />
            {errors["fecha"] && (
              <p className="text-xs text-red-500">{errors["fecha"]}</p>
            )}
          </div>

          {/* Registrado Por */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">
              Registrado por
            </label>
            <Input
              name="registrado_por"
              value={formData.registrado_por}
              readOnly
              className="bg-muted cursor-not-allowed"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">
              Descripción
            </label>
            <Textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={clsx(errors["descripcion"] && "border-red-500")}
            />
            {errors["descripcion"] && (
              <p className="text-xs text-red-500">{errors["descripcion"]}</p>
            )}
          </div>
        </div>

        <Button className="w-full mt-6 cursor-pointer" onClick={handleSubmit}>
          {isCreating ? "Crear Movimiento" : "Actualizar Movimiento"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
