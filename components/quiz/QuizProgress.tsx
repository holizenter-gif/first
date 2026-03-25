interface QuizProgressProps { current: number; total: number; percentage: number; }

export default function QuizProgress({ current, total, percentage }: QuizProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[#1B4332]">Pregunta {current} de {total}</span>
        <span className="text-sm text-gray-500">{percentage}% completado</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-[#1B4332] rounded-full transition-all duration-500 ease-out" style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < current ? "bg-[#1B4332]" : "bg-gray-300"}`} />
        ))}
      </div>
    </div>
  );
}
