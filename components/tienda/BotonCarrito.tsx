"use client";
import { ShoppingBag } from "lucide-react";
import { useCarrito } from "@/lib/store/carrito";

interface BotonCarritoProps {
  solid?: boolean; // true when navbar background is white
}

export default function BotonCarrito({ solid = false }: BotonCarritoProps) {
  const { toggleCarrito, totalItems } = useCarrito();
  const count = totalItems();

  return (
    <button
      onClick={toggleCarrito}
      aria-label="Abrir carrito"
      className={`relative p-2 rounded-full transition-colors ${
        solid
          ? "text-gray-600 hover:text-brand-teal hover:bg-gray-100"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
    >
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
          style={{ background: "#5CB996" }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
