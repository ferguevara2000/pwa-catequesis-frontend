"use client"
import { useEffect } from "react";
import { suscribirAPush } from "@/services/push";

export default function PushSuscriber() {
  useEffect(() => {
    suscribirAPush().catch(() => {});
  }, []);
  return null;
}