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
import { usuarioSchema, usuarioSchemaUpdate } from "@/lib/validations/usuarioSchema";
import { Info, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createUser, updateUser } from "@/services/users";
import UpdatePasswordModal from "./updatePasswordModal";
import { Barrio, getAllBarrios } from "@/services/finanzas";

type FormData = {
  id?: string;
  nombre: string;
  apellidos: string;
  usuario: string;
  contraseña: string;
  confirmarContraseña: string;
  email: string;
  phone: string;
  rol: string;
  barrio_id: string;
  representante?: string;
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
    apellidos: "",
    usuario: "",
    contraseña: "",
    confirmarContraseña: "",
    email: "",
    phone: "",
    rol: "",
    barrio_id: "",
    representante: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isCreating = !user;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [barrios, setBarrios] = useState<Barrio[]>([]);


  useEffect(() => {
    const fetchBarrios = async () => {
        try{
          const data = await getAllBarrios();
          setBarrios(data);
        }catch (error) {
          console.error("Error al cargar los barrios", error)
        }
      };

      fetchBarrios();
      
    if (user) {
      setFormData({
        nombre: user.nombre ?? "",
        apellidos: user.apellidos ?? "",
        usuario: user.usuario ?? "",
        contraseña: "",
        confirmarContraseña: "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        rol: user.rol ?? "",
        barrio_id: user.barrio_id?.toString() ?? "",
        representante: user.representante ?? ""
      });
    } else {
      setFormData({
        nombre: "",
        apellidos: "",
        usuario: "",
        contraseña: "",
        confirmarContraseña: "",
        email: "",
        phone: "",
        rol: "",
        barrio_id: "",
        representante: ""
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

  const handleBarrioChange = (value: string) => {
  setFormData((prev) => ({ ...prev, barrio_id: value }));
};


  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

      if (isCreating){
        // Validación previa: campos obligatorios vacíos
        if (!formData.nombre.trim()) newErrors.nombre = "Campo requerido";
        if (!formData.apellidos.trim()) newErrors.apellidos = "Campo requerido";
        if (!formData.usuario.trim()) newErrors.usuario = "Campo requerido";
        if (!formData.contraseña.trim()) newErrors.contraseña = "Campo requerido";
        if (!formData.rol.trim()) newErrors.rol = "Campo requerido";
        if (!formData.email.trim()) newErrors.email = "Campo requerido";
        if (!formData.barrio_id.trim()) newErrors.barrio_id = "Campo requerido";
        if (formData.rol === "Estudiante" && !formData.representante?.trim()) {
              newErrors.representante = "El campo representante es obligatorio para estudiantes.";
            }
      }else {
        if (!formData.nombre.trim()) newErrors.nombre = "Campo requerido";
        if (!formData.apellidos.trim()) newErrors.apellidos = "Campo requerido";
        if (!formData.usuario.trim()) newErrors.usuario = "Campo requerido";
        if (!formData.rol.trim()) newErrors.rol = "Campo requerido";
        if (!formData.email.trim()) newErrors.email = "Campo requerido";
        if (!formData.barrio_id) newErrors.barrio_id = "Campo requerido";
        if (formData.rol === "Estudiante" && !formData.representante?.trim()) {
              newErrors.representante = "El campo representante es obligatorio para estudiantes.";
            }
      }

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
      const validated = isCreating
        ? usuarioSchema.parse(formData)
        : usuarioSchemaUpdate.parse(formData)

      if (isCreating) {
        await createUser(validated);
      } else {
        await updateUser(validated, user.id!);
        console.log(formData)
      }
      toast.success("Usuario guardado exitosamente");
      setFormData({
      nombre: "",
      apellidos: "",
      usuario: "",
      contraseña: "",
      confirmarContraseña: "",
      email: "",
      phone: "",
      rol: "",
      barrio_id: "",
      representante: ""
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
        console.log(zodErrors)
        console.log(formData)
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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 pt-2">
      {[
        { label: "Nombre", name: "nombre", type: "text", required: true },
        { label: "Apellidos", name: "apellidos", type: "text", required: true },
        { label: "Usuario", name: "usuario", type: "text", required: true },
        {
          label: "Correo electrónico",
          name: "email",
          type: "email",
          required: true,
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
      {isCreating ? (
        <>  
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
            <div className="relative">
              <Input
                name="contraseña"
                type={showPassword ? "text" : "password"}
                value={formData.contraseña}
                onChange={handleChange}
                className={clsx(errors.contraseña && "border-red-500")}
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
            {errors.contraseña && (
              <p className="text-xs text-red-500">{errors.contraseña}</p>
            )}
          </div>
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
            <div className="relative">
              <Input
                name="confirmarContraseña"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmarContraseña || ""}
                onChange={handleChange}
                className={clsx(errors.confirmarContraseña && "border-red-500")}
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
            {errors.confirmarContraseña && (
              <p className="text-xs text-red-500">{errors.confirmarContraseña}</p>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-muted-foreground">
            Contraseña
          </label>
          <Button className="cursor-pointer" onClick={() => setOpenPasswordModal(true)} variant="outline">
            Actualizar contraseña
          </Button>
          <UpdatePasswordModal
            open={openPasswordModal}
            onClose={() => setOpenPasswordModal(false)}
            userId={user?.id}
          />
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
            <SelectItem value="Parroco">Parroco</SelectItem>
            <SelectItem value="Tesorero">Tesorero</SelectItem>
          </SelectContent>
        </Select>
        {errors.rol && (
          <p className="text-xs text-red-500">{errors.rol}</p>
        )}
      </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-muted-foreground">
        Barrio *
      </label>
      <Select value={formData.barrio_id.toString()} onValueChange={handleBarrioChange}>
        <SelectTrigger
          className={clsx("w-full", errors.barrio_id && "border-red-500")}
        >
          <SelectValue placeholder="Seleccionar barrio" />
        </SelectTrigger>
        <SelectContent>
          {barrios.map((barrio) => (
            <SelectItem key={barrio.id} value={barrio.id.toString()}>
              {barrio.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.barrio_id && (
        <p className="text-xs text-red-500">{errors.barrio_id}</p>
      )}
    </div>

    {/* Campo Representante: solo visible si el rol es "Estudiante" */}
    {formData.rol === "Estudiante" && (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Representante *</span>
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
                    Este campo es requerido porque el estudiante es menor de edad.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </label>
        <Input
          name="representante"
          type="text"
          value={formData.representante}
          onChange={handleChange}
          className={clsx(errors.representante && "border-red-500")}
        />
        {errors.representante && (
          <p className="text-xs text-red-500">{errors.representante}</p>
        )}
      </div>
    )}

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
