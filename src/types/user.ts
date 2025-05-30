// Puedes ajustarlo según los roles reales de tu app
export type Role = "Administrador" | "Catequista" | "Estudiante";

export type User = {
  id: string;
  nombre: string;
  apellidos: string;
  usuario: string;
  rol: Role;
} | null;
