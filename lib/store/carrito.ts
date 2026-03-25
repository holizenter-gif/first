import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CarritoItem, Producto } from "@/lib/supabase/types";

interface CarritoStore {
  items: CarritoItem[];
  isOpen: boolean;
  agregarItem: (producto: Producto, cantidad?: number) => void;
  quitarItem: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  toggleCarrito: () => void;
  totalItems: () => number;
  subtotal: () => number;
  tieneProductosFisicos: () => boolean;
}

export const useCarrito = create<CarritoStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      agregarItem: (producto, cantidad = 1) => {
        const items = get().items;
        const existente = items.find((i) => i.producto.id === producto.id);
        if (existente) {
          set({ items: items.map((i) => i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i) });
        } else {
          set({ items: [...items, { producto, cantidad }] });
        }
      },
      quitarItem: (productoId) => set({ items: get().items.filter((i) => i.producto.id !== productoId) }),
      actualizarCantidad: (productoId, cantidad) => {
        if (cantidad <= 0) { get().quitarItem(productoId); return; }
        set({ items: get().items.map((i) => i.producto.id === productoId ? { ...i, cantidad } : i) });
      },
      vaciarCarrito: () => set({ items: [] }),
      toggleCarrito: () => set({ isOpen: !get().isOpen }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.cantidad, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0),
      tieneProductosFisicos: () => get().items.some((i) => i.producto.requiere_envio),
    }),
    { name: "holizenter-carrito" }
  )
);
