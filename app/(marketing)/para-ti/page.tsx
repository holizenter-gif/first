import type { Metadata } from "next";
import Link              from "next/link";
import {
  ArrowRight, Heart, Brain, Sparkles,
  CheckCircle, Star, Clock, Video,
} from "lucide-react";
import FadeInSection from "@/components/landing/FadeInSection";
import SectionLabel  from "@/components/landing/SectionLabel";
import QuizCTA       from "@/components/quiz/QuizCTA";

export const metadata: Metadata = {
  title: "Bienestar Personal — Para Ti | Holizenter",
  description:
    "Terapia holística individual, programa MBSR de 8 semanas, retiros y acompañamiento personalizado. Encuentra tu camino hacia el bienestar real en Ciudad de México.",
  keywords: [
    "terapia holística CDMX",
    "programa MBSR México",
    "psicología integrativa",
    "bienestar personal México",
    "meditación mindfulness CDMX",
  ],
};

const SERVICIOS_B2C = [
  {
    icono:       Heart,
    titulo:      "Terapia holística individual",
    descripcion: "Acompañamiento personalizado que integra psicología clínica, trabajo corporal y exploración del sentido. Para cuando sientes que algo no está bien pero no sabes exactamente qué.",
    duracion:    "55 min por sesión",
    modalidad:   "Presencial CDMX · Online",
    precio:      "Desde $900 MXN / sesión",
    para:        ["Ansiedad y estrés crónico", "Pérdida de sentido o propósito", "Transiciones de vida importantes", "Agotamiento que no cede con descanso"],
    cta:         "Agendar primera sesión",
    href:        "/agendar?tipo=orientacion&servicio=terapia",
    destacado:   false,
  },
  {
    icono:       Brain,
    titulo:      "Programa MBSR — 8 semanas",
    descripcion: "El programa de reducción del estrés más avalado del mundo, impartido por Noemí Molina, instructora certificada por la Universidad de Brown. 40 años de evidencia clínica aplicada a tu vida.",
    duracion:    "8 semanas · 2.5h por sesión",
    modalidad:   "Presencial CDMX · Online",
    precio:      "Desde $3,200 MXN el programa",
    para:        ["Estrés crónico o burnout personal", "Ansiedad que afecta tu día a día", "Insomnio y agotamiento persistente", "Querer herramientas basadas en evidencia"],
    cta:         "Reservar lugar en el próximo grupo",
    href:        "/tienda/programa-mbsr-8-semanas",
    destacado:   true,
  },
  {
    icono:       Sparkles,
    titulo:      "Retiros y experiencias grupales",
    descripcion: "Experiencias de un día o fin de semana para salir del modo automático. Combinamos meditación, movimiento consciente, silencio y reflexión guiada en espacios naturales cerca de CDMX.",
    duracion:    "1 día · Fin de semana",
    modalidad:   "Presencial — área metropolitana CDMX",
    precio:      "Desde $1,800 MXN",
    para:        ["Desconexión profunda del ruido cotidiano", "Reconectar con lo que importa", "Comunidad de personas en camino similar", "Reset personal en momentos de transición"],
    cta:         "Ver próximas fechas",
    href:        "/agendar?tipo=orientacion&servicio=retiro",
    destacado:   false,
  },
];

const PROCESO = [
  {
    numero: "01",
    titulo: "Sesión de orientación gratuita",
    desc:   "30 minutos para escucharte, entender qué estás buscando y ver juntos si Holizenter es el lugar correcto para ti. Sin compromiso.",
  },
  {
    numero: "02",
    titulo: "Evaluación personalizada",
    desc:   "Si decides continuar, hacemos una evaluación más profunda para entender tu historia, tus necesidades y el tipo de acompañamiento que más sentido tiene.",
  },
  {
    numero: "03",
    titulo: "Programa a tu medida",
    desc:   "Diseñamos juntos un camino — puede ser sesiones individuales, el programa MBSR, un retiro, o una combinación. Tú decides el ritmo.",
  },
  {
    numero: "04",
    titulo: "Seguimiento real",
    desc:   "No desaparecemos entre sesiones. Tienes acceso a materiales, prácticas guiadas y la comunidad Holizenter durante todo el proceso.",
  },
];

const TESTIMONIOS_B2C = [
  {
    texto:   "Llevaba dos años 'funcionando' pero sintiéndome vacía. En Holizenter por primera vez alguien me ayudó a entender qué estaba pasando realmente, no solo a gestionar los síntomas.",
    nombre:  "Mariana T.",
    perfil:  "Directora creativa · 34 años",
  },
  {
    texto:   "El MBSR cambió mi relación con el estrés de una forma que ningún libro ni podcast había logrado. Es la diferencia entre leer sobre nadar y aprender a nadar.",
    nombre:  "Roberto A.",
    perfil:  "Médico · 41 años",
  },
  {
    texto:   "Fui al retiro con mucho escepticismo y salí con una claridad que no tenía desde hacía años. No fue magia — fue trabajo. Pero trabajo con las personas correctas.",
    nombre:  "Sofía M.",
    perfil:  "Emprendedora · 29 años",
  },
];

export default function ParaTiPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────── */}
      <section
        className="relative min-h-[80vh] flex items-center overflow-hidden"
        style={{ background: "var(--hl-beige)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #2D5A3D 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #6D8339 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">

            <FadeInSection delay={0}>
              <div
                className="inline-flex items-center gap-2 text-xs font-sans font-medium px-4 py-2 rounded-full mb-8 border"
                style={{
                  background:  "var(--hl-green-pale)",
                  color:       "var(--hl-green)",
                  borderColor: "var(--hl-divider)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3D] animate-pulse" />
                Bienestar personal · Para ti
              </div>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <h1
                className="font-sans font-bold leading-[1.1] mb-6"
                style={{
                  fontSize:      "clamp(36px, 5.5vw, 62px)",
                  color:         "var(--hl-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                El trabajo más importante<br />
                que puedes hacer{" "}
                <em
                  className="font-dm-serif not-italic italic"
                  style={{ color: "var(--hl-green)" }}
                >
                  es hacia adentro
                </em>
                .
              </h1>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <p
                className="font-sans leading-relaxed mb-10 max-w-xl"
                style={{ fontSize: "18px", color: "var(--hl-text-muted)" }}
              >
                No tienes que estar en crisis para buscar apoyo.
                Holizenter es para las personas que sienten que pueden estar
                mejor — y quieren un camino con base real para lograrlo.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/agendar?tipo=orientacion"
                  className="inline-flex items-center justify-center gap-2 font-sans font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
                  style={{
                    background: "var(--hl-green)",
                    color:      "#fff",
                    fontSize:   "15px",
                    boxShadow:  "0 4px 24px rgba(45,90,61,0.25)",
                  }}
                >
                  Primera sesión gratuita
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#servicios"
                  className="inline-flex items-center justify-center gap-2 font-sans font-semibold px-8 py-4 rounded-full border-2 transition-all duration-200 hover:bg-[#2D5A3D] hover:text-white"
                  style={{
                    borderColor: "var(--hl-green)",
                    color:       "var(--hl-green)",
                    fontSize:    "15px",
                  }}
                >
                  Ver los programas
                </Link>
              </div>
            </FadeInSection>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none">
            <path d="M0 50L1440 50L1440 25C1200 50 960 0 720 15C480 30 240 0 0 25L0 50Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── QUIZ CONTEXTUAL ───────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <FadeInSection>
            <p
              className="font-sans text-center mb-6"
              style={{ fontSize: "15px", color: "var(--hl-text-muted)" }}
            >
              ¿No sabes por dónde empezar? Este test te ayuda a entender
              en qué dimensión necesitas más atención.
            </p>
            <QuizCTA
              quiz_id_override="holistico"
              source_section="para_ti_hero"
              variant="banner"
            />
          </FadeInSection>
        </div>
      </section>

      {/* ── SERVICIOS ─────────────────────────── */}
      <section id="servicios" className="py-20 px-4" style={{ background: "var(--hl-beige)" }}>
        <div className="max-w-5xl mx-auto">

          <FadeInSection>
            <SectionLabel text="Programas y servicios" />
            <h2
              className="font-sans font-bold mb-3 max-w-2xl"
              style={{ fontSize: "clamp(26px,3.5vw,40px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
            >
              Tres caminos hacia el mismo{" "}
              <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
                centro
              </em>
              .
            </h2>
            <p className="font-sans mb-12" style={{ fontSize: "16px", color: "var(--hl-text-muted)" }}>
              No importa por cuál empieces. Todos llevan al mismo lugar: una versión más íntegra de ti.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICIOS_B2C.map((s, i) => {
              const Icon = s.icono;
              return (
                <FadeInSection key={s.titulo} delay={i * 0.1}>
                  <div
                    className={`rounded-2xl p-6 flex flex-col h-full border-2 transition-all ${
                      s.destacado ? "shadow-lg" : "shadow-sm"
                    }`}
                    style={{
                      background:  s.destacado ? "var(--hl-green)" : "#fff",
                      borderColor: s.destacado ? "var(--hl-green)" : "var(--hl-divider)",
                    }}
                  >
                    {s.destacado && (
                      <div
                        className="inline-flex items-center gap-1 text-xs font-sans font-semibold mb-4 self-start px-3 py-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                      >
                        <Star className="w-3 h-3 fill-white" /> Más popular
                      </div>
                    )}

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: s.destacado ? "rgba(255,255,255,0.2)" : "var(--hl-green-pale)",
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: s.destacado ? "#fff" : "var(--hl-green)" }} />
                    </div>

                    <h3
                      className="font-sans font-bold mb-2"
                      style={{ fontSize: "17px", color: s.destacado ? "#fff" : "var(--hl-text)" }}
                    >
                      {s.titulo}
                    </h3>
                    <p
                      className="font-sans mb-4 leading-relaxed flex-1"
                      style={{ fontSize: "13px", color: s.destacado ? "rgba(255,255,255,0.75)" : "var(--hl-text-muted)" }}
                    >
                      {s.descripcion}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      {[
                        { icon: Clock, text: s.duracion },
                        { icon: Video, text: s.modalidad },
                      ].map(({ icon: I, text }) => (
                        <div key={text} className="flex items-center gap-2">
                          <I className="w-3.5 h-3.5 flex-shrink-0"
                             style={{ color: s.destacado ? "rgba(255,255,255,0.6)" : "var(--hl-green)" }} />
                          <span className="font-sans text-xs"
                                style={{ color: s.destacado ? "rgba(255,255,255,0.7)" : "var(--hl-text-muted)" }}>
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      {s.para.map((p) => (
                        <div key={p} className="flex items-start gap-2 mb-1.5">
                          <CheckCircle
                            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                            style={{ color: s.destacado ? "rgba(255,255,255,0.7)" : "var(--hl-green)" }}
                          />
                          <span className="font-sans text-xs"
                                style={{ color: s.destacado ? "rgba(255,255,255,0.7)" : "var(--hl-text-muted)" }}>
                            {p}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p
                      className="font-sans font-bold text-sm mb-4"
                      style={{ color: s.destacado ? "rgba(255,255,255,0.9)" : "var(--hl-green)" }}
                    >
                      {s.precio}
                    </p>

                    <Link
                      href={s.href}
                      className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm px-5 py-3 rounded-full transition-all mt-auto"
                      style={{
                        background: s.destacado ? "#fff" : "var(--hl-green)",
                        color:      s.destacado ? "var(--hl-green)" : "#fff",
                      }}
                    >
                      {s.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESO ───────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <SectionLabel text="Cómo funciona" />
            <h2
              className="font-sans font-bold mb-12 max-w-xl"
              style={{ fontSize: "clamp(24px,3vw,36px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
            >
              Un camino claro desde el{" "}
              <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
                primer paso
              </em>
              .
            </h2>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 gap-6">
            {PROCESO.map((p, i) => (
              <FadeInSection key={p.numero} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 border"
                  style={{ background: "var(--hl-beige)", borderColor: "var(--hl-divider)" }}
                >
                  <span
                    className="font-dm-serif italic block mb-3"
                    style={{ fontSize: "36px", color: "var(--hl-green)", opacity: 0.35 }}
                  >
                    {p.numero}
                  </span>
                  <h3
                    className="font-sans font-bold mb-2"
                    style={{ fontSize: "16px", color: "var(--hl-text)" }}
                  >
                    {p.titulo}
                  </h3>
                  <p
                    className="font-sans leading-relaxed"
                    style={{ fontSize: "13px", color: "var(--hl-text-muted)" }}
                  >
                    {p.desc}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ───────────────────────── */}
      <section className="py-20 px-4" style={{ background: "var(--hl-beige)" }}>
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <SectionLabel text="Lo que dicen" />
            <h2
              className="font-sans font-bold mb-12"
              style={{ fontSize: "clamp(24px,3vw,36px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
            >
              Personas reales.{" "}
              <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
                Resultados reales.
              </em>
            </h2>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIOS_B2C.map((t, i) => (
              <FadeInSection key={t.nombre} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 border flex flex-col h-full"
                  style={{ background: "#fff", borderColor: "var(--hl-divider)" }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#2D5A3D] text-[#2D5A3D]" />
                    ))}
                  </div>
                  <p
                    className="font-dm-serif italic flex-1 leading-relaxed mb-4"
                    style={{ fontSize: "15px", color: "var(--hl-text)" }}
                  >
                    &ldquo;{t.texto}&rdquo;
                  </p>
                  <div>
                    <p className="font-sans font-semibold text-sm" style={{ color: "var(--hl-text)" }}>
                      {t.nombre}
                    </p>
                    <p className="font-sans text-xs" style={{ color: "var(--hl-text-muted)" }}>
                      {t.perfil}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInSection>
            <h2
              className="font-sans font-bold mb-4"
              style={{ fontSize: "clamp(28px,4vw,44px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
            >
              El primer paso es solo{" "}
              <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
                una conversación
              </em>
              .
            </h2>
            <p
              className="font-sans mb-8 max-w-xl mx-auto"
              style={{ fontSize: "16px", color: "var(--hl-text-muted)" }}
            >
              30 minutos gratuitos para escucharte y ver juntos si Holizenter
              es el lugar correcto para ti. Sin compromiso. Sin presión.
            </p>
            <Link
              href="/agendar?tipo=orientacion"
              className="inline-flex items-center gap-2 font-sans font-semibold px-10 py-4 rounded-full transition-all hover:scale-105 shadow-lg"
              style={{
                background: "var(--hl-green)",
                color:      "#fff",
                fontSize:   "15px",
                boxShadow:  "0 4px 24px rgba(45,90,61,0.2)",
              }}
            >
              Agendar sesión de orientación gratuita
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p
              className="font-sans mt-3"
              style={{ fontSize: "12px", color: "var(--hl-text-muted)" }}
            >
              Online · 30 minutos · Sin costo · Sin compromiso
            </p>
          </FadeInSection>
        </div>
      </section>

    </div>
  );
}
