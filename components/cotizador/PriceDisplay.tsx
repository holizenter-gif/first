interface PriceDisplayProps {
  precio: number;
  modalidad: "presencial" | "online" | "hibrido";
  colaboradores: number;
  servicio: string;
}

export default function PriceDisplay({ precio, modalidad, colaboradores, servicio }: PriceDisplayProps) {
  return (
    <div className="p-6 bg-brand-dark rounded-2xl text-white text-center">
      <p className="text-white/60 text-sm font-display uppercase tracking-wider">Estimado desde</p>
      <p className="font-display text-5xl font-bold text-brand-teal mt-2">${precio.toLocaleString()}</p>
      <p className="text-white/60 mt-1 font-display">MXN · {modalidad}</p>
      <a href="/agendar" className="mt-6 block py-3 bg-brand-teal text-white font-display font-semibold rounded-full hover:bg-brand-teal-dark transition-colors">
        Solicitar cotización formal
      </a>
    </div>
  );
}
