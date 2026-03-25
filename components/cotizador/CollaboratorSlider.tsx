"use client";
interface CollaboratorSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function CollaboratorSlider({ value, onChange }: CollaboratorSliderProps) {
  const segment = value <= 50 ? "PyME" : value <= 200 ? "Mediana Empresa" : "Corporativo";
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-brand-teal font-bold text-2xl">{value}+ colaboradores</span>
        <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-sm font-semibold rounded-full">{segment}</span>
      </div>
      <input type="range" min={10} max={500} step={10} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-brand-teal" />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>10</span><span>50</span><span>200</span><span>500+</span>
      </div>
    </div>
  );
}
