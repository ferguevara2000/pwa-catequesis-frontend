import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { UserProvider } from "@/context/UserContext";
import "./globals.css"; // 👈 asegúrate de que exista este archivo y tenga tus estilos tailwind
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistema de Catequesis",
  description: "Sistema para la gestión de catequesis parroquial",
  // themeColor: '#0a0a23',
  //manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
      {/* <link rel="manifest" href="/manifest.webmanifest" /> */}
      <meta name="theme-color" content="#0a0a23" />
    </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <UserProvider>
          {children}
          <Toaster/>
        </UserProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
