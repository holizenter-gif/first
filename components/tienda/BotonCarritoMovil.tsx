"use client";

import { ShoppingCart } from "lucide-react";
import { useCarrito }   from "@/lib/store/carrito";

export default function BotonCarritoMovil() {
  const { totalItems, toggleCarrito } = useCarrito();
  const n = totalItems();

  return (
    <button
      onClick={toggleCarrito}
      aria-label="Abrir carrito"
      className="flex items-center gap-2 bg-brand-dark text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg shadow-black/30 border border-white/10 active:scale-95 transition-transform"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5 text-brand-teal" />
        {n > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-brand-teal text-white text-[9px] font-display font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {n > 9 ? "9+" : n}
          </span>
        )}
      </div>
      <span className="font-display font-semibold text-sm">
        {n > 0 ? `${n} ${n === 1 ? "producto" : "productos"}` : "Carrito"}
      </span>
    </button>
  );
}
