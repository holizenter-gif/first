"use client";
import { useCarrito } from "@/lib/store/carrito";

export default function CarritoDrawer() {
  const { items, isOpen, toggleCarrito, quitarItem, subtotal, totalItems } = useCarrito();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={toggleCarrito} />
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-serif text-xl font-bold text-brand-dark">Carrito ({totalItems()})</h2>
          <button onClick={toggleCarrito} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-12">Tu carrito está vacío</p>
          ) : (
            items.map((item) => (
              <div key={item.producto.id} className="flex gap-4 items-start">
                <div className="w-16 h-16 bg-brand-beige rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🛍️</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-brand-dark line-clamp-2">{item.producto.nombre}</p>
                  <p className="text-brand-teal font-bold text-sm mt-1">${item.producto.precio.toLocaleString()} MXN</p>
                </div>
                <button onClick={() => quitarItem(item.producto.id)} className="text-gray-300 hover:text-red-500 text-lg">×</button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Subtotal</span>
              <span className="font-bold text-brand-dark">${subtotal().toLocaleString()} MXN</span>
            </div>
            <a href="/checkout" className="block w-full text-center py-3 bg-brand-teal text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors">
              Proceder al pago
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
