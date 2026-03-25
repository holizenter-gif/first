interface SectionLabelProps {
  text:       string;
  className?: string;
}

export default function SectionLabel({ text, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <div className="w-6 h-px bg-[#2D5A3D]" />
      <span className="text-[11px] font-sans font-medium text-[#2D5A3D] tracking-[0.12em] uppercase">
        {text}
      </span>
    </div>
  );
}
