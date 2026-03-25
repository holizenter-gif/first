import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const PILARES = [
  {
    emoji:  "💪",
    titulo: "Cuerpo",
    color:  "#EDF4EE",
    border: "rgba(45,90,61,0.15)",
    items: [
      "Movimiento consciente y yoga terapéutico",
      "Trabajo somático y liberación de tensiones",
      "Nutrición integrativa y hábitos corporales",
      "Respiración y regulación del sistema nervioso",
    ],
  },
  {
    emoji:  "🧠",
    titulo: "Mente",
    color:  "var(--hl-beige)",
    border: "var(--hl-divider)",
    items: [
      "Programa MBSR de 8 semanas",
      "Psicología clínica e integrativa",
      "Manejo del estrés basado en evidencia",
      "Herramientas de autoconocimiento",
    ],
  },
  {
    emoji:  "✨",
    titulo: "Espíritu",
    color:  "var(--hl-beige-alt)",
    border: "var(--hl-divider)",
    items: [
      "Meditación y tradición contemplativa",
      "Propósito, sentido y valores",
      "Conexión con lo que importa",
      "Prácticas de presencia y gratitud",
    ],
  },
];

export default function TresPilaresGeneral() {
  return (
    <section className="py-24 px-4" style={{ background: "var(--hl-beige)" }}>
      <div className="max-w-6xl mx-auto">

        <FadeIn>
          <SectionLabel text="Nuestra metodología" />
          <h2
            className="font-sans font-bold mb-3"
            style={{ fontSize: "clamp(26px,3.5vw,38px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
          >
            Los 3 pilares del{" "}
            <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
              ser humano completo
            </em>
            .
          </h2>
          <p className="font-sans mb-12 max-w-2xl" style={{ fontSize: "16px", color: "var(--hl-text-muted)" }}>
            No importa si vienes por ti o por tu empresa:
            el trabajo siempre empieza en la misma persona.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {PILARES.map((p, i) => (
            <FadeIn key={p.titulo} delay={i * 0.1}>
              <div
                className="rounded-2xl p-6 border h-full"
                style={{ background: p.color, borderColor: p.border }}
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="font-sans font-bold mb-4" style={{ fontSize: "20px", color: "var(--hl-text)" }}>
                  {p.titulo}
                </h3>
                <ul className="space-y-2.5">
                  {p.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 font-sans"
                      style={{ fontSize: "13px", color: "var(--hl-text-muted)" }}
                    >
                      <span style={{ color: "var(--hl-green)", marginTop: "2px" }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
