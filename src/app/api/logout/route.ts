// /app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada" });
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expirar cookie
    path: "/",
  });
  return response;
}
