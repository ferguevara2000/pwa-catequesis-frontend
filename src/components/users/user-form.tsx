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
import { usuarioSchema } from "@/lib/validations/usuarioSchema";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createUser } from "@/services/users";

type FormData = {
  nombre: string;
  usuario: string;
  contraseña: string;
  confirmarContraseña: string;
  email: string;
  phone: string;
  rol: string;
};

export default function UserForm({
  open,
  onClose,
  onUserSaved,
  user,
}: {
  open: boolean;
  onClose: () => void;
  onUserSaved?: () => void;
  user?: Partial<FormData>;
}) {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    usuario: "",
    contraseña: "",
    confirmarContraseña: "",
    email: "",
    phone: "",
    rol: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isCreating = !user;

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre ?? "",
        usuario: user.usuario ?? "",
        contraseña: "",
        confirmarContraseña: "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        rol: user.rol ?? "",
      });
    } else {
      setFormData({
        nombre: "",
        usuario: "",
        contraseña: "",
        confirmarContraseña: "",
        email: "",
        phone: "",
        rol: "",
      });
    }
    setErrors({});
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rol: value }));
    setErrors((prev) => ({ ...prev, rol: "" }));
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    // Validación previa: campos obligatorios vacíos
    if (!formData.nombre.trim()) newErrors.nombre = "Campo requerido";
    if (!formData.usuario.trim()) newErrors.usuario = "Campo requerido";
    if (!formData.contraseña.trim()) newErrors.contraseña = "Campo requerido";
    if (!formData.rol.trim()) newErrors.rol = "Campo requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    if (isCreating && formData.contraseña !== formData.confirmarContraseña) {
      setErrors((prev) => ({
        ...prev,
        confirmarContraseña: "Las contraseñas no coinciden",
      }));
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      const validated = usuarioSchema.parse(formData);
      await createUser(validated)
      toast.success("Usuario guardado exitosamente");
      setFormData({
      nombre: "",
      usuario: "",
      contraseña: "",
      confirmarContraseña: "",
      email: "",
      phone: "",
      rol: "",
    })
      onUserSaved?.();
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
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {user ? "Editar usuario" : "Crear nuevo usuario"}
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-4 pt-2">
      {[
        { label: "Nombre", name: "nombre", type: "text", required: true },
        { label: "Usuario", name: "usuario", type: "text", required: true },
        {
          label: "Correo electrónico",
          name: "email",
          type: "email",
          required: false,
        },
        { label: "Teléfono", name: "phone", type: "tel", required: false },
      ].map(({ label, name, type, required }) => (
        <div className="space-y-1" key={name}>
          <label className="block text-sm font-medium text-muted-foreground">
            <span>
              {label} {required && "*"}
            </span>
          </label>
          <Input
            name={name}
            type={type}
            value={formData[name as keyof FormData]}
            onChange={handleChange}
            className={clsx(errors[name] && "border-red-500")}
          />
          {errors[name] && (
            <p className="text-xs text-red-500">{errors[name]}</p>
          )}
        </div>
      ))}

      {/* Campo contraseña y confirmar contraseña */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Contraseña *</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    size={14}
                    className="text-muted-foreground cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-xs text-sm">
                    Mínimo 8 caracteres, al menos una mayúscula y un número.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </label>
        <Input
          name="contraseña"
          type="password"
          value={formData.contraseña}
          onChange={handleChange}
          className={clsx(errors.contraseña && "border-red-500")}
        />
        {errors.contraseña && (
          <p className="text-xs text-red-500">{errors.contraseña}</p>
        )}
      </div>

      {!user && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Confirmar contraseña *</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      size={14}
                      className="text-muted-foreground cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-xs text-sm">
                      Repite la contraseña para verificar que sea correcta.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </label>
          <Input
            name="confirmarContraseña"
            type="password"
            value={formData.confirmarContraseña || ""}
            onChange={handleChange}
            className={clsx(errors.confirmarContraseña && "border-red-500")}
          />
          {errors.confirmarContraseña && (
            <p className="text-xs text-red-500">{errors.confirmarContraseña}</p>
          )}
        </div>
      )}

      {/* Campo rol */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-muted-foreground">
          Rol *
        </label>
        <Select value={formData.rol} onValueChange={handleRoleChange}>
          <SelectTrigger
            className={clsx("w-full", errors.rol && "border-red-500")}
          >
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Administrador">Administrador</SelectItem>
            <SelectItem value="Catequista">Catequista</SelectItem>
            <SelectItem value="Estudiante">Estudiante</SelectItem>
          </SelectContent>
        </Select>
        {errors.rol && (
          <p className="text-xs text-red-500">{errors.rol}</p>
        )}
      </div>
    </div>

    <div className="flex justify-end pt-4">
      <Button onClick={handleSubmit} className="cursor-pointer">
        {user ? "Guardar cambios" : "Crear"}
      </Button>
    </div>
  </DialogContent>
</Dialog>

  );
}
