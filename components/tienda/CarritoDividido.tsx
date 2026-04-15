"use client";

import Image              from "next/image";
import { Smartphone, Truck, Package } from "lucide-react";
import type { ItemCarritoEnvio, ResultadoEnvio, DireccionEnvio } from "@/lib/envios";
import { formatMXN }      from "@/lib/cotizador";
import DireccionEnvioForm from "./DireccionEnvioForm";

interface Props {
  digitales:      ItemCarritoEnvio[];
  fisicos:        ItemCarritoEnvio[];
  resultadoEnvio: ResultadoEnvio;
  onDireccion:    (d: DireccionEnvio | null, costoEnvio?: number) => void;
}

export default function CarritoDividido({
  digitales, fisicos, resultadoEnvio, onDireccion,
}: Props) {
  return (
    <div className="space-y-5">

      {/* Sección digital */}
      {digitales.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-brand-teal-50 border-b border-brand-teal/20">
            <Smartphone className="w-4 h-4 text-brand-teal" />
            <span className="font-display font-semibold text-brand-teal text-sm">
              Entrega digital — acceso inmediato
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {digitales.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
          <div className="px-5 py-3 bg-brand-beige flex justify-between">
            <span className="text-xs text-gray-500 font-display">Subtotal digital</span>
            <span className="font-display font-bold text-brand-dark text-sm">
              {formatMXN(digitales.reduce((s, i) => s + i.precio * i.cantidad, 0))}
            </span>
          </div>
        </div>
      )}

      {/* Sección física */}
      {fisicos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-brand-olive-50 border-b border-brand-olive/20">
            <Truck className="w-4 h-4 text-brand-olive" />
            <span className="font-display font-semibold text-brand-olive text-sm">
              Envío a domicilio — Todo México
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {fisicos.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Costo de envío */}
          <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500 font-display">Envío estándar</span>
              {resultadoEnvio.falta_para_gratis !== undefined && (
                <p className="text-xs text-brand-teal mt-0.5">
                  Te faltan {formatMXN(resultadoEnvio.falta_para_gratis)} en físicos para envío gratis
                </p>
              )}
            </div>
            <span className="font-display font-bold text-brand-dark text-sm">
              {resultadoEnvio.gratis ? (
                <span className="text-brand-teal">Gratis</span>
              ) : (
                formatMXN(resultadoEnvio.costo)
              )}
            </span>
          </div>

          <div className="px-5 py-3 bg-brand-beige flex justify-between">
            <span className="text-xs text-gray-500 font-display">Subtotal físico + envío</span>
            <span className="font-display font-bold text-brand-dark text-sm">
              {formatMXN(
                fisicos.reduce((s, i) => s + i.precio * i.cantidad, 0) +
                resultadoEnvio.costo
              )}
            </span>
          </div>

          {/* Formulario de dirección */}
          <div className="px-5 pb-5 pt-4 border-t border-gray-100">
            <DireccionEnvioForm
              onChange={onDireccion}
              items={fisicos.map((i) => ({ id: i.id, cantidad: i.cantidad }))}
            />
          </div>
        </div>
      )}

    </div>
  );
}

function ItemRow({ item }: { item: ItemCarritoEnvio }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 min-w-0">
      <div className="w-12 h-12 rounded-xl bg-brand-beige flex-shrink-0 overflow-hidden flex items-center justify-center">
        {item.imagen ? (
          <Image src={item.imagen} alt={item.nombre} width={48} height={48}
            className="object-cover w-full h-full" />
        ) : (
          <Package className="w-5 h-5 text-gray-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-brand-dark text-sm truncate">
          {item.nombre}
        </p>
        <p className="text-gray-400 text-xs">Cantidad: {item.cantidad}</p>
      </div>
      <span className="font-display font-bold text-brand-dark text-sm flex-shrink-0">
        {formatMXN(item.precio * item.cantidad)}
      </span>
    </div>
  );
}
