"use client";
import type { DireccionEnvio } from "@/lib/supabase/types";

interface CheckoutFormProps {
  requiereEnvio: boolean;
  onSubmit: (data: { email: string; nombre: string; direccion?: DireccionEnvio }) => Promise<void>;
}

export default function CheckoutForm({ requiereEnvio, onSubmit }: CheckoutFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-brand-green mb-4">Datos de contacto</h3>
        <div className="space-y-3">
          <input type="text" placeholder="Nombre completo" className="w-full p-3 border border-gray-200 rounded-lg" />
          <input type="email" placeholder="Email" className="w-full p-3 border border-gray-200 rounded-lg" />
        </div>
      </div>
      {requiereEnvio && (
        <div>
          <h3 className="font-semibold text-brand-green mb-4">Dirección de envío</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Calle" className="w-full p-3 border border-gray-200 rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="No. Ext." className="p-3 border border-gray-200 rounded-lg" />
              <input type="text" placeholder="No. Int. (opcional)" className="p-3 border border-gray-200 rounded-lg" />
            </div>
            <input type="text" placeholder="Colonia" className="w-full p-3 border border-gray-200 rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Ciudad" className="p-3 border border-gray-200 rounded-lg" />
              <input type="text" placeholder="Estado" className="p-3 border border-gray-200 rounded-lg" />
            </div>
            <input type="text" placeholder="Código Postal" className="w-full p-3 border border-gray-200 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
