"use client";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCarrito } from "@/lib/store/carrito";
import type { Producto } from "@/lib/supabase/types";

interface AgregarCarritoBtnProps {
  producto: Producto;
  variant?: "primary" | "secondary";
  className?: string;
  label?: string;
}

export default function AgregarCarritoBtn({
  producto,
  variant = "primary",
  className = "",
  label = "Agregar al carrito",
}: AgregarCarritoBtnProps) {
  const [agregado, setAgregado] = useState(false);
  const { agregarItem, toggleCarrito } = useCarrito();

  const handleAgregar = () => {
    agregarItem(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const base =
    "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-200";

  const primary =
    "px-6 py-3 text-white text-sm";
  const secondary =
    "px-5 py-2.5 text-sm border";

  const style =
    variant === "primary"
      ? {
          background: agregado ? "#3A8A6E" : "#5CB996",
          border: "none",
          color: "#fff",
        }
      : {
          background: agregado ? "#EBF7F2" : "transparent",
          border: "1px solid #5CB996",
          color: agregado ? "#3A8A6E" : "#5CB996",
        };

  return (
    <button
      onClick={handleAgregar}
      className={`${base} ${variant === "primary" ? primary : secondary} ${className}`}
      style={style}
    >
      {agregado ? (
        <>
          <Check className="w-4 h-4" />
          ¡Agregado!
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}
