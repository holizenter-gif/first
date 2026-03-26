import Link from "next/link";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const CAMINOS = [
  {
    tag:         "Para ti",
    titulo:      "Bienestar personal",
    descripcion: "Sesiones individuales, retiros, programas de 8 semanas y acompañamiento por especialistas que entienden que eres un ser completo.",
    items: [
      "Terapia holística individual",
      "Programa MBSR — 8 semanas",
      "Retiros y experiencias grupales",
      "Psicología integrativa",
      "Meditación y movimiento consciente",
    ],
    cta:      "Explorar experiencias personales",
    href:     "/para-ti",
    bg:       "var(--hl-green-pale)",
    border:   "rgba(45,90,61,0.15)",
    tagBg:    "var(--hl-green)",
    tagColor: "#fff",
  },
  {
    tag:         "Para tu empresa",
    titulo:      "Cultura organizacional",
    descripcion: "Programas que reducen el burnout, mejoran el rendimiento y fortalecen la cultura desde adentro hacia afuera.",
    items: [
      "Talleres y capacitaciones",
      "Diagnóstico y NOM-035",
      "Certificaciones corporativas",
      "Retiros de equipo",
      "Programas continuos de bienestar",
    ],
    cta:      "Ver programas para tu empresa",
    href:     "/servicios",
    bg:       "var(--hl-beige)",
    border:   "var(--hl-divider)",
    tagBg:    "var(--hl-text)",
    tagColor: "#fff",
  },
  {
    tag:         "Para profesionales",
    titulo:      "Formación y certificaciones",
    descripcion: "Si eres psicólogo, coach, terapeuta o médico y quieres integrar el enfoque holístico en tu práctica — este es tu camino.",
    items: [
      "Certificación MBSR",
      "Formación en terapia holística",
      "Supervisión clínica",
      "Comunidad de práctica",
    ],
    cta:      "Ver programas de formación",
    href:     "/formacion",
    bg:       "var(--hl-beige-alt)",
    border:   "var(--hl-divider)",
    tagBg:    "var(--hl-green-dark)",
    tagColor: "#fff",
  },
];

export default function TresCaminos() {
  return (
    <section className="py-24 px-4" style={{ background: "var(--hl-beige)" }}>
      <div className="max-w-6xl mx-auto">

        <FadeIn>
          <SectionLabel text="Tres caminos. Un centro." />
          <h2
            className="font-sans font-bold mb-3 max-w-2xl"
            style={{ fontSize: "clamp(28px,4vw,42px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
          >
            No importa por dónde empieces.{" "}
            <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
              Todos los caminos llevan al mismo centro.
            </em>
          </h2>
          <p className="font-sans mb-12" style={{ fontSize: "16px", color: "var(--hl-text-muted)" }}>
            Una versión más íntegra y consciente de ti mismo.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {CAMINOS.map((c, i) => (
            <FadeIn key={c.tag} delay={i * 0.12}>
              <div
                className="p-6 flex flex-col h-full relative"
                style={{
                  background:   "#FFFFFF",
                  borderLeft:   "3px solid var(--hl-green)",
                  borderRadius: "0 8px 8px 0",
                  boxShadow:    "0 2px 16px rgba(0,0,0,0.06)",
                }}
              >
                <span
                  className="inline-block text-xs font-sans font-semibold px-3 py-1 mb-4 self-start"
                  style={{ background: c.tagBg, color: c.tagColor, borderRadius: "4px", letterSpacing: "0.08em" }}
                >
                  {c.tag}
                </span>

                <h3
                  className="font-sans font-bold mb-3"
                  style={{ fontSize: "20px", color: "var(--hl-text)" }}
                >
                  {c.titulo}
                </h3>

                <p
                  className="font-sans mb-5 leading-relaxed flex-1"
                  style={{ fontSize: "14px", color: "var(--hl-text-muted)" }}
                >
                  {c.descripcion}
                </p>

                <ul className="space-y-2 mb-6">
                  {c.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 font-sans"
                      style={{ fontSize: "13px", color: "var(--hl-text-muted)" }}
                    >
                      <span style={{ color: "var(--hl-green)" }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={c.href}
                  className="font-sans font-semibold transition-colors hover:underline mt-auto self-start"
                  style={{ fontSize: "13px", color: "var(--hl-green)" }}
                >
                  {c.cta} →
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
