import Link from "next/link";
import FadeIn from "./FadeIn";

export default function CTAFinal() {
  return (
    <section className="py-24 px-4" style={{ background: "var(--hl-beige)" }}>
      <div className="max-w-5xl mx-auto">

        <FadeIn>
          <div className="text-center mb-14">
            <h2
              className="font-sans font-bold mb-4"
              style={{ fontSize: "clamp(30px,4.5vw,52px)", color: "var(--hl-text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              ¿Por dónde empieza tu{" "}
              <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
                transformación
              </em>
              ?
            </h2>
            <p className="font-sans max-w-xl mx-auto" style={{ fontSize: "17px", color: "var(--hl-text-muted)" }}>
              No importa si buscas algo para ti o para tu equipo.
              El primer paso es el mismo: una conversación.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* B2C */}
          <FadeIn delay={0.1} direction="left">
            <div
              className="p-7 flex flex-col h-full"
              style={{
                background:   "#FFFFFF",
                borderLeft:   "3px solid var(--hl-green)",
                borderRadius: "0 8px 8px 0",
                boxShadow:    "0 2px 16px rgba(0,0,0,0.06)",
              }}
            >
              <span
                className="inline-block text-xs font-sans font-semibold px-3 py-1 mb-5 self-start"
                style={{
                  background:    "var(--hl-green)",
                  color:         "#fff",
                  borderRadius:  "4px",
                  letterSpacing: "0.08em",
                }}
              >
                Soy una persona
              </span>
              <h3 className="font-sans font-bold mb-2" style={{ fontSize: "20px", color: "var(--hl-text)" }}>
                Primera sesión de orientación gratuita
              </h3>
              <p className="font-sans leading-relaxed mb-6 flex-1" style={{ fontSize: "14px", color: "var(--hl-text-muted)", lineHeight: "1.8" }}>
                Te escuchamos sin compromiso y encontramos juntos qué camino
                tiene más sentido para ti.
              </p>
              <Link
                href="/agendar?tipo=orientacion"
                className="inline-flex items-center justify-center gap-2 font-sans font-semibold px-6 py-3.5 transition-all hover:opacity-90"
                style={{
                  background:    "var(--hl-green)",
                  color:         "#fff",
                  fontSize:      "14px",
                  letterSpacing: "0.04em",
                  borderRadius:  "4px",
                  boxShadow:     "0 4px 16px rgba(45,90,61,0.2)",
                }}
              >
                Quiero mi sesión de orientación →
              </Link>
            </div>
          </FadeIn>

          {/* B2B */}
          <FadeIn delay={0.15} direction="right">
            <div
              className="p-7 flex flex-col h-full"
              style={{
                background:   "#FFFFFF",
                border:       "1px solid var(--hl-divider)",
                borderRadius: "8px",
                boxShadow:    "0 2px 16px rgba(0,0,0,0.06)",
              }}
            >
              <span
                className="inline-block text-xs font-sans font-semibold px-3 py-1 mb-5 self-start"
                style={{
                  background:    "var(--hl-text)",
                  color:         "#fff",
                  borderRadius:  "4px",
                  letterSpacing: "0.08em",
                }}
              >
                Represento a una empresa
              </span>
              <h3 className="font-sans font-bold mb-2" style={{ fontSize: "20px", color: "var(--hl-text)" }}>
                Diagnóstico gratuito de 60 minutos
              </h3>
              <p className="font-sans leading-relaxed mb-6 flex-1" style={{ fontSize: "14px", color: "var(--hl-text-muted)", lineHeight: "1.8" }}>
                Analizamos el estado actual de bienestar en tu empresa
                y te decimos qué necesita tu equipo.
              </p>
              <Link
                href="/agendar"
                className="inline-flex items-center justify-center gap-2 font-sans font-semibold px-6 py-3.5 transition-all hover:bg-[#2D5A3D] hover:text-white"
                style={{
                  border:        "1.5px solid var(--hl-green)",
                  color:         "var(--hl-green)",
                  fontSize:      "14px",
                  letterSpacing: "0.04em",
                  borderRadius:  "4px",
                  background:    "transparent",
                }}
              >
                Agendar diagnóstico gratuito →
              </Link>
            </div>
          </FadeIn>

        </div>

        <FadeIn delay={0.2}>
          <p
            className="text-center font-sans mt-10"
            style={{ fontSize: "13px", color: "var(--hl-text-muted)" }}
          >
            Sin compromiso · Sin tarjeta · Atendemos en Ciudad de México y online
          </p>
        </FadeIn>

      </div>
    </section>
  );
}
