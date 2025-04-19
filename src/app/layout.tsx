import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { UserProvider } from "@/context/UserContext";
import "./globals.css"; // 👈 asegúrate de que exista este archivo y tenga tus estilos tailwind
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistema de Catequesis",
  description: "Sistema para la gestión de catequesis parroquial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <UserProvider>
          {children}
        </UserProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
