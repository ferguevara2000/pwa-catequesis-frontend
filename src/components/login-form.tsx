"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth"; // 👈 importar tu función
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await login(username, password);
      console.log("Login exitoso:", response);
      localStorage.setItem("user", JSON.stringify(response));
      setUser({ id: response.id, nombre: response.nombre, apellidos: response.apellidos,usuario: response.usuario, rol: response.rol });
      router.push("/dashboard"); // 👈 Redirección al dashboard
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden bg-white text-gray-900 dark:bg-[#1F1F23] dark:text-white border border-border shadow-md">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                <p className="text-balance text-muted-foreground dark:text-gray-300">
                  Inicia sesión en tu cuenta de Catequesis
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Usuario</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="ej. juanperez123"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white text-black dark:bg-[#2A2A2E] dark:text-white dark:placeholder:text-gray-400"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="/password-recovery"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white text-black pr-10 dark:bg-[#2A2A2E] dark:text-white dark:placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Ingresar"
                )}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border dark:after:border-white">
                <span className="relative z-10 bg-background dark:bg-[#1F1F23] px-2 text-muted-foreground dark:text-white">
                  Sistema de Catequesis Parroquial
                </span>
              </div>

              <div className="text-center text-sm">
                ¿Tienes problemas para ingresar? <br />
                <a href="#" className="underline underline-offset-4">
                  Contacta al administrador
                </a>
              </div>
            </div>
          </form>

          <div className="hidden md:flex items-center justify-center p-4">
            <img
              src="https://i.imgur.com/NOqhDF8.png"
              alt="Fondo Catequesis"
              className="object-contain max-h-[500px] w-full rounded-lg"
            />
          </div>

        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary dark:text-white">
        Copyright© 2025.
      </div>
    </div>
  );
}
