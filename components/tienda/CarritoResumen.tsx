"use client";
import { useCarrito } from "@/lib/store/carrito";

interface CarritoResumenProps {
  mostrarBotonPago?: boolean;
}

export default function CarritoResumen({ mostrarBotonPago = true }: CarritoResumenProps) {
  const { items, subtotal } = useCarrito();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-brand-green mb-4">Resumen de compra</h3>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.producto.id} className="flex justify-between text-sm">
            <span className="text-gray-600 truncate flex-1 mr-2">{item.producto.nombre} x{item.cantidad}</span>
            <span className="font-medium">${(item.producto.precio * item.cantidad).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 flex justify-between font-bold">
        <span>Total</span>
        <span className="text-brand-green">${subtotal().toLocaleString()} MXN</span>
      </div>
      {mostrarBotonPago && (
        <a href="/checkout" className="mt-4 block text-center py-3 bg-brand-gold text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors">
          Pagar ahora
        </a>
      )}
    </div>
  );
}
