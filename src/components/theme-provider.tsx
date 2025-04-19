"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { usePathname } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      value={{
        light: "light",
        dark: pathname === "/login" ? "light" : "dark", // 👈 Forzar light en /login
      }}
    >
      {children}
    </NextThemesProvider>
  );
}
