import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CarritoItem, Producto } from "@/lib/supabase/types";

const CART_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

interface CarritoStore {
  items: CarritoItem[];
  isOpen: boolean;
  createdAt: number | null;
  agregarItem: (producto: Producto, cantidad?: number) => void;
  quitarItem: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  toggleCarrito: () => void;
  totalItems: () => number;
  subtotal: () => number;
  tieneProductosFisicos: () => boolean;
  purgarSiExpirado: () => void;
}

export const useCarrito = create<CarritoStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      createdAt: null,

      agregarItem: (producto, cantidad = 1) => {
        const { items, createdAt } = get();
        const existente = items.find((i) => i.producto.id === producto.id);
        const now = Date.now();
        if (existente) {
          set({ items: items.map((i) => i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i) });
        } else {
          set({
            items: [...items, { producto, cantidad }],
            createdAt: createdAt ?? now,
          });
        }
      },

      quitarItem: (productoId) =>
        set({ items: get().items.filter((i) => i.producto.id !== productoId) }),

      actualizarCantidad: (productoId, cantidad) => {
        if (cantidad <= 0) { get().quitarItem(productoId); return; }
        set({ items: get().items.map((i) => i.producto.id === productoId ? { ...i, cantidad } : i) });
      },

      vaciarCarrito: () => set({ items: [], createdAt: null }),

      toggleCarrito: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.cantidad, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0),

      tieneProductosFisicos: () =>
        get().items.some((i) => i.producto.requiere_envio),

      purgarSiExpirado: () => {
        const { createdAt, items } = get();
        if (items.length === 0) return;
        if (createdAt && Date.now() - createdAt > CART_TTL_MS) {
          set({ items: [], createdAt: null });
        }
      },
    }),
    { name: "holizenter-carrito" }
  )
);
