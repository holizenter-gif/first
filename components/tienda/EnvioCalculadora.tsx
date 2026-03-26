"use client";
interface EnvioCalculadoraProps {
  pesoTotalKg: number;
  onEnvioSeleccionado: (precio: number, proveedor: string) => void;
}

const OPCIONES_MOCK = [
  { proveedor: "DHL", precio: 149, diasEntrega: 2 },
  { proveedor: "FedEx", precio: 169, diasEntrega: 1 },
  { proveedor: "Estafeta", precio: 99, diasEntrega: 3 },
];

export default function EnvioCalculadora({ pesoTotalKg, onEnvioSeleccionado }: EnvioCalculadoraProps) {
  return (
    <div>
      <h3 className="font-semibold text-brand-dark mb-4">Opciones de envío ({pesoTotalKg}kg)</h3>
      <div className="space-y-3">
        {OPCIONES_MOCK.map((op) => (
          <button key={op.proveedor} onClick={() => onEnvioSeleccionado(op.precio, op.proveedor)} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-brand-teal transition-colors">
            <div>
              <p className="font-semibold text-sm">{op.proveedor}</p>
              <p className="text-xs text-gray-500">{op.diasEntrega} días hábiles</p>
            </div>
            <span className="font-bold text-brand-dark">${op.precio} MXN</span>
          </button>
        ))}
      </div>
    </div>
  );
}
