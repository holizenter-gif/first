import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const PILARES = [
  {
    num:    "01",
    titulo: "Ciencia clínica",
    desc:   "MBSR avalado por la Universidad de Brown. 40 años de investigación en reducción del estrés basada en evidencia.",
  },
  {
    num:    "02",
    titulo: "Terapia holística",
    desc:   "Psicología integrativa, trabajo corporal y acompañamiento terapéutico que trata al ser humano completo.",
  },
  {
    num:    "03",
    titulo: "Tradición contemplativa",
    desc:   "Prácticas de meditación y mindfulness con raíces en tradiciones milenarias, adaptadas al contexto contemporáneo.",
  },
];

export default function MetodologiaMBSR() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <div>
            <FadeIn>
              <SectionLabel text="Ciencia + Humanismo + Tradición" />
              <h2
                className="font-sans font-bold mb-6"
                style={{ fontSize: "clamp(26px,3.5vw,38px)", color: "var(--hl-text)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
              >
                Basado en 40 años de{" "}
                <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
                  investigación clínica
                </em>
                .
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="font-sans leading-relaxed mb-4" style={{ fontSize: "16px", color: "var(--hl-text-muted)" }}>
                El <strong style={{ color: "var(--hl-text)" }}>MBSR (Mindfulness-Based Stress Reduction)</strong>,
                desarrollado por el Dr. Jon Kabat-Zinn y avalado por la Universidad de Brown,
                es el estándar de oro mundial en reducción del estrés basada en evidencia.
              </p>
              <p className="font-sans leading-relaxed mb-8" style={{ fontSize: "16px", color: "var(--hl-text-muted)" }}>
                En Holizenter lo integramos con terapia holística, psicología clínica y
                prácticas contemplativas — formando el único ecosistema de bienestar integral
                en México que une estas tres dimensiones en un solo programa.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border"
                style={{ background: "var(--hl-green-pale)", borderColor: "rgba(45,90,61,0.2)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "var(--hl-green)" }}
                >
                  BU
                </div>
                <div>
                  <p className="font-sans font-semibold text-xs" style={{ color: "var(--hl-text)" }}>
                    Universidad de Brown
                  </p>
                  <p className="font-sans text-xs" style={{ color: "var(--hl-text-muted)" }}>
                    Certificación oficial MBSR · Instructores avalados
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* 3 pilares */}
          <div className="space-y-4">
            {PILARES.map((p, i) => (
              <FadeIn key={p.num} delay={i * 0.1} direction="right">
                <div
                  className="p-5"
                  style={{
                    background:   "#FFFFFF",
                    borderLeft:   "3px solid var(--hl-green)",
                    borderRadius: "0 8px 8px 0",
                    boxShadow:    "0 2px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="font-dm-serif italic flex-shrink-0 leading-none"
                      style={{ fontSize: "28px", color: "var(--hl-green)", opacity: 0.4 }}
                    >
                      {p.num}
                    </span>
                    <div>
                      <h3 className="font-sans font-semibold mb-1" style={{ fontSize: "15px", color: "var(--hl-text)" }}>
                        {p.titulo}
                      </h3>
                      <p className="font-sans leading-relaxed" style={{ fontSize: "13px", color: "var(--hl-text-muted)" }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
