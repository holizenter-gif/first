"use client";
import { useEffect } from "react";
import { useCarrito } from "@/lib/store/carrito";

/** Mounts once in the marketing layout and purges the cart if it's older than 24 h. */
export default function CarritoExpiracionCheck() {
  const purgarSiExpirado = useCarrito((s) => s.purgarSiExpirado);
  useEffect(() => {
    purgarSiExpirado();
  }, [purgarSiExpirado]);
  return null;
}
