import type { Metadata } from "next";
import Link              from "next/link";
import {
  ArrowRight, GraduationCap, Users,
  BookOpen, CheckCircle, Star,
} from "lucide-react";
import FadeInSection from "@/components/landing/FadeInSection";
import SectionLabel  from "@/components/landing/SectionLabel";

export const metadata: Metadata = {
  title: "Formación para Profesionales del Bienestar | Holizenter",
  description:
    "Certificación MBSR, formación en terapia holística integrativa y supervisión clínica para psicólogos, coaches, médicos y terapeutas en México.",
  keywords: [
    "certificación MBSR México",
    "formación terapia holística",
    "supervisión clínica psicología",
    "coach bienestar certificación México",
  ],
};

const PROGRAMAS = [
  {
    icono:       GraduationCap,
    titulo:      "Certificación MBSR",
    subtitulo:   "Avalada por Brown University",
    descripcion: "Conviértete en instructor certificado del programa de reducción del estrés más avalado del mundo. Formación intensiva de 9 meses que te da las herramientas para impartir MBSR con rigor clínico.",
    duracion:    "9 meses · Intensivo",
    modalidad:   "Híbrido — CDMX + Online",
    precio:      "Consultar precio",
    incluye: [
      "140 horas de formación teórica y práctica",
      "Supervisión individual con Noemí Molina",
      "Práctica personal intensiva durante el programa",
      "Certificación avalada internacionalmente",
      "Acceso a la red de instructores Holizenter",
    ],
    para: ["Psicólogos y psiquiatras", "Médicos interesados en medicina integrativa", "Coaches certificados", "Terapeutas con práctica establecida"],
    destacado: true,
    cta:       "Solicitar información",
    href:      "/formacion/mbsr",
  },
  {
    icono:       BookOpen,
    titulo:      "Diplomado en Terapia Holística Integrativa",
    subtitulo:   "Metodología Holizenter",
    descripcion: "Programa de 6 meses que integra psicología clínica, trabajo somático, mindfulness y psicología transpersonal. Diseñado para profesionales que quieren ampliar su enfoque terapéutico.",
    duracion:    "6 meses · Fin de semana",
    modalidad:   "Presencial CDMX",
    precio:      "Consultar precio",
    incluye: [
      "96 horas presenciales los sábados",
      "Módulos de psicología somática y trabajo corporal",
      "Práctica supervisada con casos reales",
      "Material bibliográfico completo",
      "Certificado Holizenter + constancia de competencias",
    ],
    para: ["Psicólogos que quieren integrar el cuerpo en su práctica", "Terapeutas alternativos con formación de base", "Trabajadores sociales y enfermeros", "Profesionales de RRHH con interés clínico"],
    destacado: false,
    cta:       "Solicitar información",
    href:      "/formacion/diplomatico",
  },
  {
    icono:       Users,
    titulo:      "Supervisión Clínica",
    subtitulo:   "Con Noemí Molina",
    descripcion: "Grupos pequeños de supervisión de casos para psicólogos y terapeutas en práctica. Un espacio para crecer como clínico con acompañamiento experto y comunidad de pares.",
    duracion:    "Mensual · 2 horas por sesión",
    modalidad:   "Presencial CDMX · Online",
    precio:      "Desde $1,200 MXN / mes",
    incluye: [
      "Grupos de máximo 6 personas",
      "Presentación y análisis de casos en formato protegido",
      "Retroalimentación clínica individual",
      "Marco teórico integrador cada sesión",
      "Comunidad privada entre sesiones",
    ],
    para: ["Psicólogos en práctica privada reciente", "Terapeutas que trabajan solos y quieren pares", "Profesionales que quieren formación continua", "Cualquier clínico que busque crecer"],
    destacado: false,
    cta:       "Solicitar información",
    href:      "/formacion/supervision",
  },
];

const REQUISITOS = [
  "Título en psicología, medicina, trabajo social o carrera afín (para MBSR y Diplomado)",
  "Práctica clínica o terapéutica activa de al menos 1 año",
  "Compromiso con la práctica personal durante el programa",
  "Carta de intención de 300 palabras",
  "Entrevista de selección con el equipo Holizenter",
];

const RED_BENEFICIOS = [
  "Directorio de profesionales en holizenter.mx con perfil verificado",
  "Derivación de clientes que buscan tu especialidad",
  "Acceso a materiales y recursos clínicos continuamente actualizados",
  "Comunidad privada de práctica entre instructores y terapeutas",
  "Posibilidad de co-impartir programas con el equipo Holizenter",
  "Descuentos en formación continua y retiros",
];

export default function FormacionPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-16 pb-24 px-4"
        style={{ background: "#1C3A2A" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #5CB996 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <FadeInSection delay={0}>
              <div
                className="inline-flex items-center gap-2 text-xs font-sans font-medium px-4 py-2 rounded-full mb-8 border"
                style={{ background: "rgba(255,255,255,0.1)", color: "#A8DCC8", borderColor: "rgba(255,255,255,0.15)" }}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Para profesionales del bienestar
              </div>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <h1
                className="font-sans font-bold leading-[1.1] mb-6"
                style={{ fontSize: "clamp(34px,5vw,58px)", color: "#fff", letterSpacing: "-0.02em" }}
              >
                Integra ciencia y{" "}
                <em className="font-dm-serif not-italic italic" style={{ color: "#A8DCC8" }}>
                  tradición
                </em>{" "}
                en tu práctica.
              </h1>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <p
                className="font-sans leading-relaxed mb-10"
                style={{ fontSize: "18px", color: "rgba(255,255,255,0.65)" }}
              >
                Si eres psicólogo, coach, terapeuta o médico y quieres
                integrar el enfoque holístico en tu práctica con rigor,
                evidencia y una comunidad real — este es tu camino.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#programas"
                  className="inline-flex items-center justify-center gap-2 font-sans font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg"
                  style={{ background: "#5CB996", color: "#fff", fontSize: "15px" }}
                >
                  Ver programas <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#unirse"
                  className="inline-flex items-center justify-center gap-2 font-sans font-semibold px-8 py-4 rounded-full border-2 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.8)", fontSize: "15px" }}
                >
                  Unirme al directorio
                </Link>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── PROGRAMAS ─────────────────────────── */}
      <section id="programas" className="py-20 px-4" style={{ background: "var(--hl-beige)" }}>
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <SectionLabel text="Programas de formación" />
            <h2
              className="font-sans font-bold mb-12"
              style={{ fontSize: "clamp(26px,3.5vw,40px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
            >
              Formación con{" "}
              <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
                base clínica real
              </em>
              .
            </h2>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-6">
            {PROGRAMAS.map((p, i) => {
              const Icon = p.icono;
              return (
                <FadeInSection key={p.titulo} delay={i * 0.1}>
                  <div
                    className={`rounded-2xl p-6 flex flex-col h-full border-2 ${p.destacado ? "shadow-xl" : "shadow-sm"}`}
                    style={{
                      background:  p.destacado ? "var(--hl-green)" : "#fff",
                      borderColor: p.destacado ? "var(--hl-green)" : "var(--hl-divider)",
                    }}
                  >
                    {p.destacado && (
                      <div
                        className="inline-flex items-center gap-1 text-xs font-sans font-semibold mb-4 self-start px-3 py-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                      >
                        <Star className="w-3 h-3 fill-white" /> Certificación internacional
                      </div>
                    )}

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: p.destacado ? "rgba(255,255,255,0.15)" : "var(--hl-green-pale)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: p.destacado ? "#fff" : "var(--hl-green)" }} />
                    </div>

                    <h3
                      className="font-sans font-bold mb-0.5"
                      style={{ fontSize: "16px", color: p.destacado ? "#fff" : "var(--hl-text)" }}
                    >
                      {p.titulo}
                    </h3>
                    <p
                      className="font-sans text-xs font-medium mb-3"
                      style={{ color: p.destacado ? "rgba(255,255,255,0.6)" : "var(--hl-green)" }}
                    >
                      {p.subtitulo}
                    </p>
                    <p
                      className="font-sans mb-4 leading-relaxed flex-1"
                      style={{ fontSize: "13px", color: p.destacado ? "rgba(255,255,255,0.75)" : "var(--hl-text-muted)" }}
                    >
                      {p.descripcion}
                    </p>

                    <div className="mb-4 space-y-1.5">
                      {p.incluye.slice(0, 3).map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle
                            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                            style={{ color: p.destacado ? "rgba(255,255,255,0.6)" : "var(--hl-green)" }}
                          />
                          <span
                            className="font-sans text-xs"
                            style={{ color: p.destacado ? "rgba(255,255,255,0.7)" : "var(--hl-text-muted)" }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p
                      className="font-sans font-bold text-sm mb-4"
                      style={{ color: p.destacado ? "rgba(255,255,255,0.9)" : "var(--hl-green)" }}
                    >
                      {p.precio}
                    </p>

                    <Link
                      href={p.href}
                      className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm px-5 py-3 rounded-full transition-all mt-auto"
                      style={{
                        background: p.destacado ? "#fff" : "var(--hl-green)",
                        color:      p.destacado ? "var(--hl-green)" : "#fff",
                      }}
                    >
                      {p.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REQUISITOS + RED ──────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <FadeInSection direction="left">
              <SectionLabel text="Requisitos de ingreso" />
              <h2
                className="font-sans font-bold mb-6"
                style={{ fontSize: "clamp(22px,3vw,34px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
              >
                No aceptamos a todos —{" "}
                <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
                  por diseño
                </em>
                .
              </h2>
              <p
                className="font-sans leading-relaxed mb-6"
                style={{ fontSize: "15px", color: "var(--hl-text-muted)" }}
              >
                La calidad de la formación depende de quién está en el salón.
                Tenemos grupos pequeños y un proceso de selección cuidadoso
                para garantizar que cada participante tenga el perfil
                y el compromiso que el programa requiere.
              </p>
              <div className="space-y-3">
                {REQUISITOS.map((r) => (
                  <div key={r} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--hl-green)" }} />
                    <span className="font-sans text-sm" style={{ color: "var(--hl-text-muted)" }}>{r}</span>
                  </div>
                ))}
              </div>
            </FadeInSection>

            <FadeInSection direction="right">
              <SectionLabel text="Beneficios de la red Holizenter" />
              <h2
                className="font-sans font-bold mb-6"
                style={{ fontSize: "clamp(22px,3vw,34px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
              >
                Formar parte de algo{" "}
                <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
                  más grande
                </em>
                .
              </h2>
              <div className="space-y-3">
                {RED_BENEFICIOS.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                      style={{ background: "var(--hl-green)", minWidth: "16px" }}
                    >
                      <span className="text-white text-[8px] font-bold">✓</span>
                    </div>
                    <span className="font-sans text-sm" style={{ color: "var(--hl-text-muted)" }}>{b}</span>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────── */}
      <section id="unirse" className="py-20 px-4" style={{ background: "var(--hl-beige)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <FadeInSection>
            <SectionLabel text="Próximo paso" className="justify-center" />
            <h2
              className="font-sans font-bold mb-3"
              style={{ fontSize: "clamp(24px,3.5vw,38px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
            >
              ¿Te interesa algún programa?
            </h2>
            <p
              className="font-sans mb-8"
              style={{ fontSize: "15px", color: "var(--hl-text-muted)" }}
            >
              Déjanos tus datos y nos ponemos en contacto para contarte
              los detalles del programa que más se adapta a tu perfil.
            </p>
            <div
              className="rounded-2xl p-6 shadow-sm border"
              style={{ background: "#fff", borderColor: "var(--hl-divider)" }}
            >
              <p className="text-sm text-gray-500 text-center mb-4">
                Rellena el formulario y te contactamos en menos de 48 horas.
              </p>
              <Link
                href="/contacto?origen=formacion"
                className="w-full flex items-center justify-center gap-2 font-sans font-semibold px-6 py-4 rounded-full transition-all hover:scale-[1.02]"
                style={{ background: "var(--hl-green)", color: "#fff", fontSize: "15px" }}
              >
                Ir al formulario de contacto <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-center mt-3" style={{ color: "var(--hl-text-muted)" }}>
                También puedes escribirnos directamente a hola@holizenter.mx
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

    </div>
  );
}
