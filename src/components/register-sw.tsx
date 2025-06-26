"use client"
import { useEffect } from "react"

export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/custom-sw.js")
        .then((reg) => {
          console.log("✅ Service Worker registrado:", reg)
        })
        .catch((err) => {
          console.error("❌ Error registrando el Service Worker:", err)
        })
    }
  }, [])

  return null
}