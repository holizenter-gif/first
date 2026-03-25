"use client";
type MetodoPago = "mercado_pago" | "stripe" | "transferencia";

interface PagoMethodsProps {
  onSelectMethod: (method: MetodoPago) => void;
  totalMXN: number;
}

export default function PagoMethods({ onSelectMethod, totalMXN }: PagoMethodsProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-brand-green mb-4">Método de pago</h3>
      {([
        { id: "mercado_pago" as MetodoPago, label: "Mercado Pago", desc: "Tarjeta, OXXO, transferencia SPEI", icon: "💳" },
        { id: "stripe" as MetodoPago, label: "Tarjeta internacional", desc: "Visa, Mastercard, Amex", icon: "🌐" },
        { id: "transferencia" as MetodoPago, label: "Transferencia bancaria", desc: "SPEI directo — confirmación en 24h", icon: "🏦" },
      ]).map((method) => (
        <button key={method.id} onClick={() => onSelectMethod(method.id)} className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-brand-gold transition-colors text-left">
          <span className="text-2xl">{method.icon}</span>
          <div>
            <p className="font-semibold text-sm text-brand-green">{method.label}</p>
            <p className="text-xs text-gray-500">{method.desc}</p>
          </div>
        </button>
      ))}
      <p className="text-center text-sm text-gray-500 mt-4">Total a pagar: <strong className="text-brand-green">${totalMXN.toLocaleString()} MXN</strong></p>
    </div>
  );
}
