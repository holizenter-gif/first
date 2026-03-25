interface PriceDisplayProps {
  precio: number;
  modalidad: "presencial" | "online" | "hibrido";
  colaboradores: number;
  servicio: string;
}

export default function PriceDisplay({ precio, modalidad, colaboradores, servicio }: PriceDisplayProps) {
  return (
    <div className="p-6 bg-brand-green rounded-2xl text-white text-center">
      <p className="text-white/60 text-sm uppercase tracking-wider">Estimado desde</p>
      <p className="font-serif text-5xl font-bold mt-2">${precio.toLocaleString()}</p>
      <p className="text-white/60 mt-1">MXN · {modalidad}</p>
      <a href="/agendar" className="mt-6 block py-3 bg-brand-gold text-white font-semibold rounded-lg hover:bg-brand-gold-dark transition-colors">
        Solicitar cotización formal
      </a>
    </div>
  );
}
