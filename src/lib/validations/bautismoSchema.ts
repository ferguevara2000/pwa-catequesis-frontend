// src/schemas/bautismo.schema.ts
import { z } from "zod";

export const bautismoSchema = z.object({
  sacerdote: z.string().min(1, "El nombre del sacerdote es obligatorio"),
  sexo: z.string().refine(val => val === "niño" || val === "niña", {
    message: "Campo requerido o inválido",
  }),
  fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha de nacimiento inválido"), // YYYY-MM-DD
  nombres: z.string().min(1, "Los nombres son obligatorios"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  fecha_bautismo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha de bautismo inválido"), // YYYY-MM-DD
  nombres_padre: z.string().optional(),
  apellidos_padre: z.string().optional(),
  nombres_madre: z.string().optional(),
  apellidos_madre: z.string().optional(),
  padrino: z.string().optional(),
  madrina: z.string().optional(),
});
