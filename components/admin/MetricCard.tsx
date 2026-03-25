interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function MetricCard({ label, value, sub, accent = false }: MetricCardProps) {
  return (
    <div
      className="p-5"
      style={{
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        borderTop: accent ? "3px solid var(--hl-green)" : "3px solid var(--hl-divider)",
      }}
    >
      <p className="font-sans" style={{ fontSize: "12px", color: "var(--hl-text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </p>
      <p
        className="font-sans font-bold mt-1"
        style={{ fontSize: "32px", color: accent ? "var(--hl-green)" : "var(--hl-text)", lineHeight: 1.1 }}
      >
        {value}
      </p>
      {sub && (
        <p className="font-sans mt-1" style={{ fontSize: "12px", color: "var(--hl-text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
