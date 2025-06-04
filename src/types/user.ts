// Puedes ajustarlo según los roles reales de tu app
export type Role = "Administrador" | "Catequista" | "Estudiante" | "Tesorero";

export type User = {
  id: string;
  nombre: string;
  apellidos: string;
  usuario: string;
  rol: Role;
  barrio_id: number
} | null;
