"use client";
import type { Producto } from "@/lib/supabase/types";
import { useCarrito } from "@/lib/store/carrito";

interface BotonAgregarProps {
  producto: Producto;
  variant?: "primary" | "outline" | "icon";
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS = { sm: "py-2 px-4 text-xs", md: "py-3 px-6 text-sm", lg: "py-4 px-8 text-base" };

export default function BotonAgregar({ producto, variant = "primary", size = "md" }: BotonAgregarProps) {
  const { agregarItem, toggleCarrito } = useCarrito();

  const handleClick = () => {
    agregarItem(producto);
    toggleCarrito();
  };

  const base = `${SIZE_CLASS[size]} font-semibold rounded-lg transition-colors`;
  const variantClass = variant === "primary"
    ? "bg-brand-teal text-white hover:bg-amber-700"
    : variant === "outline"
    ? "border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
    : "w-10 h-10 flex items-center justify-center bg-brand-teal text-white rounded-full";

  return (
    <button onClick={handleClick} className={`${base} ${variantClass}`}>
      {variant === "icon" ? "+" : "Agregar al carrito"}
    </button>
  );
}
