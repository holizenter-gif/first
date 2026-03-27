"use client";
import { useCarrito } from "@/lib/store/carrito";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

export default function CarritoDrawer() {
  const { items, isOpen, toggleCarrito, quitarItem, actualizarCantidad, subtotal, totalItems, vaciarCarrito } =
    useCarrito();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={toggleCarrito}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#fff" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
          style={{ background: "#0D1A0F" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h2 className="font-display font-bold text-white">
              Carrito{" "}
              {totalItems() > 0 && (
                <span
                  className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#5CB996", color: "#fff" }}
                >
                  {totalItems()}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={toggleCarrito}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "#EBF7F2" }}
              >
                <ShoppingBag className="w-8 h-8" style={{ color: "#5CB996" }} />
              </div>
              <div>
                <p className="font-display font-semibold" style={{ color: "#0D1A0F" }}>
                  Tu carrito está vacío
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Explora nuestra tienda y encuentra algo para ti.
                </p>
              </div>
              <button
                onClick={toggleCarrito}
                className="mt-2 px-6 py-2.5 rounded-full font-display font-semibold text-sm text-white transition-colors"
                style={{ background: "#5CB996" }}
              >
                Explorar tienda
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.producto.id}
                  className="flex gap-3 p-3 rounded-2xl border border-gray-100"
                  style={{ background: "#F9FAFB" }}
                >
                  {/* Imagen / emoji placeholder */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: "#EBF7F2" }}
                  >
                    {item.producto.categoria === "cursos"            && "🎓"}
                    {item.producto.categoria === "materiales"        && "📄"}
                    {item.producto.categoria === "merchandising"     && "🌿"}
                    {item.producto.categoria === "talleres_grabados" && "🎥"}
                    {item.producto.categoria === "membresia"         && "⭐"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="font-sans font-semibold text-sm leading-snug line-clamp-2"
                      style={{ color: "#0D1A0F" }}
                    >
                      {item.producto.nombre}
                    </p>
                    <p
                      className="font-sans font-bold text-sm mt-1"
                      style={{ color: "#5CB996" }}
                    >
                      ${(item.producto.precio * item.cantidad).toLocaleString("es-MX")} MXN
                    </p>

                    {/* Cantidad */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-teal hover:text-brand-teal transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center" style={{ color: "#0D1A0F" }}>
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-teal hover:text-brand-teal transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => quitarItem(item.producto.id)}
                    className="self-start p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <span className="font-sans text-sm text-gray-500">Subtotal</span>
              <span className="font-display font-bold text-lg" style={{ color: "#0D1A0F" }}>
                ${subtotal().toLocaleString("es-MX")} MXN
              </span>
            </div>
            {useCarrito.getState().tieneProductosFisicos() && (
              <p className="text-xs text-gray-400 mb-3">
                + Envío calculado en checkout
              </p>
            )}

            <Link
              href="/checkout"
              onClick={toggleCarrito}
              className="block w-full text-center py-3.5 rounded-full font-display font-semibold text-white transition-colors mt-3"
              style={{ background: "#5CB996" }}
            >
              Ir al checkout →
            </Link>

            <button
              onClick={vaciarCarrito}
              className="w-full text-center py-2 mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors font-sans"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
