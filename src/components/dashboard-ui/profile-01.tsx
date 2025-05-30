import { useUser } from "@/context/UserContext"
import { LogOut, MoveUpRight, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface MenuItem {
  label: string
  value?: string
  href: string
  icon?: React.ReactNode
  external?: boolean
}

interface Profile01Props {
  name: string
  role: string
  avatar: string
  subscription?: string
}

const defaultProfile = {
  name: "Eugene An",
  role: "Prompt Engineer",
  avatar: "https://i.imgur.com/QYiF8AV.png",
  subscription: "Free Trial"
} satisfies Required<Profile01Props>

export default function Profile01({
  name = defaultProfile.name,
  avatar = defaultProfile.avatar,
}: Partial<Profile01Props> = defaultProfile) {
  const { user, setUser } = useUser();
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleLogout = async () => {
    try {
      // Llama al endpoint para borrar la cookie del token
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include' // Necesario para que envíe y borre la cookie
      });
  
      // Limpia el estado del frontend
      setUser(null);
      localStorage.removeItem("nombre");
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
      localStorage.removeItem("userData")
  
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  const menuItems: MenuItem[] = [
    {
      label: "Configuración de la cuenta",
      href: "/dashboard/user-config",
      icon: <Settings className="w-4 h-4" />,
    },
  ]

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative px-6 pt-12 pb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative shrink-0">
              <Image
                src={avatar}
                alt={name}
                width={72}
                height={72}
                className="rounded-full ring-4 ring-white dark:ring-zinc-900 object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{user?.nombre}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">{user?.rol}</p>
            </div>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-2 
                                    hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                    rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.value && <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">{item.value}</span>}
                  {item.external && <MoveUpRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              type="button"
              className="w-full flex items-center justify-between p-2 
                                hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Cerrar Sesión</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
