import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const STATS = [
  { valor: "75%",     label: "de trabajadores MX sufre estrés laboral",  fuente: "IMSS"        },
  { valor: "+500",    label: "colaboradores acompañados individualmente", fuente: "Holizenter"  },
  { valor: "3 años",  label: "construyendo comunidad de bienestar real",  fuente: "Desde 2023"  },
  { valor: "NOM-035", label: "cumplimiento garantizado para tu empresa",  fuente: "STPS México" },
];

const TESTIMONIOS = [
  {
    texto:  "El programa MBSR cambió completamente mi relación con el estrés. No es exagerado decir que me cambió la vida.",
    nombre: "Adriana V.",
    tipo:   "Participante programa 8 semanas",
    b2c:    true,
  },
  {
    texto:  "Holizenter entendió algo que ningún otro proveedor había logrado: hablarle a nuestros líderes en el lenguaje que necesitaban para tomar la decisión.",
    nombre: "Carlos M.",
    tipo:   "CEO · Empresa mediana CDMX",
    b2c:    false,
  },
  {
    texto:  "Después de años buscando un espacio que integrara la parte científica con la espiritual, encontré que Holizenter no solo lo promete — lo vive.",
    nombre: "Diana R.",
    tipo:   "Terapeuta · Programa de formación",
    b2c:    true,
  },
];

export default function PruebaSocial() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        <FadeIn>
          <SectionLabel text="Casos de éxito" />
          <h2
            className="font-sans font-bold mb-3"
            style={{ fontSize: "clamp(26px,3.5vw,38px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
          >
            Resultados reales.{" "}
            <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
              Documentados.
            </em>
          </h2>
          <p className="font-sans mb-12" style={{ fontSize: "16px", color: "var(--hl-text-muted)" }}>
            Empresas que transformaron su cultura. Personas que encontraron su camino.
          </p>
        </FadeIn>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {STATS.map((s, i) => (
            <FadeIn key={s.valor} delay={i * 0.08}>
              <div
                className="rounded-2xl p-5 border text-center"
                style={{ background: "var(--hl-beige)", borderColor: "var(--hl-divider)" }}
              >
                <div
                  className="font-sans font-bold mb-1"
                  style={{ fontSize: "clamp(22px,3vw,32px)", color: "var(--hl-green)" }}
                >
                  {s.valor}
                </div>
                <p className="font-sans mb-1" style={{ fontSize: "12px", color: "var(--hl-text-muted)" }}>
                  {s.label}
                </p>
                <p className="font-sans" style={{ fontSize: "11px", color: "var(--hl-text-muted)", opacity: 0.6 }}>
                  — {s.fuente}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Testimonios */}
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIOS.map((t, i) => (
            <FadeIn key={t.nombre} delay={i * 0.1}>
              <div
                className="rounded-2xl p-6 border flex flex-col h-full"
                style={{
                  background:  t.b2c ? "var(--hl-green-pale)" : "var(--hl-beige)",
                  borderColor: t.b2c ? "rgba(45,90,61,0.2)"   : "var(--hl-divider)",
                }}
              >
                <span
                  className="inline-block text-xs font-sans font-medium px-2.5 py-1 rounded-full mb-4 self-start"
                  style={{
                    background: t.b2c ? "rgba(45,90,61,0.1)" : "rgba(28,58,42,0.08)",
                    color:      "var(--hl-green)",
                  }}
                >
                  {t.b2c ? "Persona" : "Empresa"}
                </span>

                <p
                  className="font-dm-serif italic flex-1 leading-relaxed mb-4"
                  style={{ fontSize: "16px", color: "var(--hl-text)" }}
                >
                  &ldquo;{t.texto}&rdquo;
                </p>

                <div>
                  <p className="font-sans font-semibold" style={{ fontSize: "13px", color: "var(--hl-text)" }}>
                    {t.nombre}
                  </p>
                  <p className="font-sans" style={{ fontSize: "12px", color: "var(--hl-text-muted)" }}>
                    {t.tipo}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
