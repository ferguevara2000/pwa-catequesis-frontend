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
import { comunicacionSchema } from "@/lib/validations/comunicacionSchema";
import {
  createComunicacion,
  updateComunicacion,
  Comunicacion,
} from "@/services/comunicacion";

const opcionesDirigidoA = ["Todos", "Catequistas", "Estudiantes"];

type ComunicacionFormData = {
  titulo: string;
  mensaje: string;
  dirigido_a: string[];
  fecha: string;
  enviado_por: string;
};

export default function ComunicacionForm({
  open,
  onClose,
  onComunicacionSaved,
  comunicacion,
}: {
  open: boolean;
  onClose: () => void;
  onComunicacionSaved?: () => void;
  comunicacion?: Partial<Comunicacion>;
}) {
  const [formData, setFormData] = useState<ComunicacionFormData>({
    titulo: "",
    mensaje: "",
    dirigido_a: [],
    fecha: "",
    enviado_por: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isCreating = !comunicacion;
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const enviadoPor = `${user?.nombre} ${user?.apellidos}` || "";

    if (comunicacion) {
      setFormData({
        titulo: comunicacion.titulo ?? "",
        mensaje: comunicacion.mensaje ?? "",
        dirigido_a: comunicacion.dirigido_a ?? [],
        fecha: comunicacion.fecha?.slice(0, 10) ?? "",
        enviado_por: enviadoPor,
      });
    } else {
      setFormData({
        titulo: "",
        mensaje: "",
        dirigido_a: [],
        fecha: "",
        enviado_por: enviadoPor,
      });
    }

    setErrors({});
  }, [comunicacion, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleDirigidoA = (opcion: string) => {
    setFormData((prev) => {
      let nuevoDirigidoA = [...prev.dirigido_a];

      if (opcion === "Todos") {
        // Si ya está seleccionado "Todos", lo deselecciona
        if (nuevoDirigidoA.includes("Todos")) {
          nuevoDirigidoA = [];
        } else {
          // Si se selecciona "Todos", elimina las demás opciones
          nuevoDirigidoA = ["Todos"];
        }
      } else {
        // Si "Todos" está seleccionado, no se puede seleccionar otra opción
        if (nuevoDirigidoA.includes("Todos")) return prev;

        if (nuevoDirigidoA.includes(opcion)) {
          nuevoDirigidoA = nuevoDirigidoA.filter((item) => item !== opcion);
        } else {
          nuevoDirigidoA.push(opcion);
        }
      }

      return {
        ...prev,
        dirigido_a: nuevoDirigidoA,
      };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // <-- activamos el spinner
    try {
      const validated = comunicacionSchema.parse(formData);

      if (isCreating) {
        await createComunicacion(validated);
      } else {
        await updateComunicacion(comunicacion!.id!, validated);
      }

      toast.success(
        `Comunicación ${isCreating ? "creada" : "actualizada"} exitosamente`
      );
      onComunicacionSaved?.();
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
    } finally {
      setIsSubmitting(false); // <-- desactivamos el spinner
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Nueva comunicación" : "Editar comunicación"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">
              Título *
            </label>
            <Input
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className={clsx(errors.titulo && "border-red-500")}
            />
            {errors.titulo && (
              <p className="text-xs text-red-500">{errors.titulo}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">
              Mensaje *
            </label>
            <textarea
              name="mensaje"
              rows={4}
              value={formData.mensaje}
              onChange={handleChange}
              className={clsx(
                "border rounded-md p-2",
                errors.mensaje && "border-red-500"
              )}
            />
            {errors.mensaje && (
              <p className="text-xs text-red-500">{errors.mensaje}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">
              Dirigido a *
            </label>
            <div className="flex flex-wrap gap-2">
              {opcionesDirigidoA.map((opcion) => (
                <Button
                  key={opcion}
                  variant={
                    formData.dirigido_a.includes(opcion) ? "default" : "outline"
                  }
                  onClick={() => toggleDirigidoA(opcion)}
                  type="button"
                  className="text-sm"
                >
                  {opcion}
                </Button>
              ))}
            </div>
            {errors.dirigido_a && (
              <p className="text-xs text-red-500">{errors.dirigido_a}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">
              Fecha *
            </label>
            <Input
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              className={clsx(errors.fecha && "border-red-500")}
            />
            {errors.fecha && (
              <p className="text-xs text-red-500">{errors.fecha}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">
              Enviado por *
            </label>
            <Input
              name="enviado_por"
              value={formData.enviado_por}
              readOnly
              className={clsx(errors.enviado_por && "border-red-500")}
            />
            {errors.enviado_por && (
              <p className="text-xs text-red-500">{errors.enviado_por}</p>
            )}
          </div>
        </div>

        <Button
          className="w-full mt-6 cursor-pointer"
          onClick={handleSubmit}
          disabled={isSubmitting} // <-- deshabilita el botón
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              <span>Enviando...</span>
            </div>
          ) : isCreating ? (
            "Crear comunicación"
          ) : (
            "Actualizar comunicación"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
