import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { useState } from "react";
  import { toast } from "sonner";
  import { z } from "zod";
  import { Eye, Info } from "lucide-react";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  
  // Esquema de validación
  const passwordSchema = z.object({
    password: z.string().min(8, "Mínimo 8 caracteres").regex(/[A-Z]/, "Debe tener al menos una mayúscula").regex(/[0-9]/, "Debe tener al menos un número"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
  
  export default function UpdatePasswordModal({
    open,
    onClose,
    userId,
  }: {
    open: boolean;
    onClose: () => void;
    userId?: string;
  }) {
    const [formData, setFormData] = useState({
      password: "",
      confirmPassword: "",
    });
  
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    };
  
    const handleSubmit = async () => {
      try {
        const validated = passwordSchema.parse(formData);
        console.log("Actualizando contraseña de", userId, validated.password);
        toast.success("Contraseña actualizada correctamente");
        onClose();
      } catch (err) {
        if (err instanceof z.ZodError) {
          const zodErrors: Record<string, string> = {};
          err.errors.forEach((e) => {
            zodErrors[e.path[0] as string] = e.message;
          });
          setErrors(zodErrors);
          toast.error("Corrige los errores del formulario");
        } else {
          toast.error("Error inesperado");
        }
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Por favor, ingresa una nueva contraseña para el usuario. Asegúrate de que sea segura y que el usuario la recuerde.
            </p>
  
            {/* Campo contraseña */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>Nueva contraseña *</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-pointer" />
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
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                >
                  <Eye size={16} />
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>
  
            {/* Confirmar contraseña */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>Confirmar contraseña *</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs text-sm">
                          Repite la contraseña para asegurarte de que sea correcta.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                >
                  <Eye size={16} />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
  
            <div className="flex justify-end pt-2">
              <Button onClick={handleSubmit} className="cursor-pointer">Guardar contraseña</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  