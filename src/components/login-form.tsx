import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                <p className="text-balance text-muted-foreground">Inicia sesión en tu cuenta de Catequesis</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Usuario</Label>
                <Input id="email" type="email" placeholder="ej. juanperez123" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>

              {/* Línea divisoria decorativa */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Sistema de Catequesis Parroquial
                </span>
              </div>

              <div className="text-center text-sm">
                ¿Tienes problemas para ingresar?{" "}<br />
                <a href="#" className="underline underline-offset-4">
                  Contacta al administrador
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://i.imgur.com/NOqhDF8.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Copyright© 2025.
      </div>
    </div>
  )
}
