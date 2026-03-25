import { Activity, Brain, Sparkles } from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const PILARES = [
  {
    Icon:   Activity,
    num:    "01",
    titulo: "Cuerpo",
    items: [
      "Movimiento consciente y yoga terapéutico",
      "Trabajo somático y liberación de tensiones",
      "Nutrición integrativa y hábitos corporales",
      "Respiración y regulación del sistema nervioso",
    ],
  },
  {
    Icon:   Brain,
    num:    "02",
    titulo: "Mente",
    items: [
      "Programa MBSR de 8 semanas",
      "Psicología clínica e integrativa",
      "Manejo del estrés basado en evidencia",
      "Herramientas de autoconocimiento",
    ],
  },
  {
    Icon:   Sparkles,
    num:    "03",
    titulo: "Espíritu",
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
                className="p-8 h-full relative"
                style={{
                  background:   "#FFFFFF",
                  borderLeft:   "3px solid var(--hl-green)",
                  borderRadius: "0 8px 8px 0",
                  boxShadow:    "0 2px 16px rgba(0,0,0,0.06)",
                }}
              >
                {/* Número decorativo */}
                <span
                  style={{
                    fontSize:       "72px",
                    fontWeight:     "800",
                    color:          "var(--hl-green)",
                    opacity:        0.07,
                    position:       "absolute",
                    top:            "12px",
                    right:          "16px",
                    lineHeight:     "1",
                    pointerEvents:  "none",
                    fontFamily:     "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  {p.num}
                </span>

                {/* Ícono SVG */}
                <div
                  style={{
                    width:          "48px",
                    height:         "48px",
                    border:         "1.5px solid var(--hl-green)",
                    borderRadius:   "8px",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    marginBottom:   "20px",
                  }}
                >
                  <p.Icon size={24} strokeWidth={1.5} color="var(--hl-green)" />
                </div>

                <h3 className="font-sans font-bold mb-4" style={{ fontSize: "20px", color: "var(--hl-text)" }}>
                  {p.titulo}
                </h3>
                <ul className="space-y-2.5">
                  {p.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 font-sans"
                      style={{ fontSize: "13px", color: "var(--hl-text-muted)", lineHeight: "1.8" }}
                    >
                      <span style={{ color: "var(--hl-green)", marginTop: "2px", flexShrink: 0 }}>·</span>
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
