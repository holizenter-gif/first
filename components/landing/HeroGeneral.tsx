import Link from "next/link";
import FadeIn from "./FadeIn";

export default function HeroGeneral() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden -mt-16 pt-16"
      style={{ background: "var(--hl-beige)" }}
    >
      {/* Fondo orgánico */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #2D5A3D 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #2D5A3D 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">

          <FadeIn delay={0}>
            <div
              className="inline-flex items-center gap-2 text-xs font-sans font-medium px-4 py-2 rounded-full mb-10 border"
              style={{
                background:  "var(--hl-green-pale)",
                color:       "var(--hl-green)",
                borderColor: "var(--hl-divider)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3D] animate-pulse" />
              Holizenter · El Poder de tu Bienestar
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              className="font-sans font-bold leading-[1.08] mb-6"
              style={{
                fontSize:      "clamp(40px, 6vw, 72px)",
                color:         "var(--hl-text)",
                letterSpacing: "-0.02em",
              }}
            >
              Tu punto de encuentro<br />
              para el{" "}
              <em className="font-dm-serif not-italic italic" style={{ color: "var(--hl-green)" }}>
                bienestar real
              </em>
              .
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p
              className="font-sans leading-relaxed mb-10 max-w-2xl"
              style={{ fontSize: "18px", color: "var(--hl-text-muted)" }}
            >
              Físico, emocional y espiritual. En tu vida personal y en tu trabajo.
              <br className="hidden md:block" />
              Holizenter es el espacio donde encuentras respuestas,
              personas que entienden lo que sientes, y un camino que tiene sentido para ti.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/para-ti"
                className="inline-flex items-center justify-center gap-2 font-sans font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  background: "var(--hl-green)",
                  color:      "#fff",
                  fontSize:   "15px",
                  boxShadow:  "0 4px 24px rgba(45,90,61,0.25)",
                }}
              >
                Quiero empezar por mí
                <span className="text-white/70">→</span>
              </Link>

              <Link
                href="/empresas"
                className="inline-flex items-center justify-center gap-2 font-sans font-semibold px-8 py-4 rounded-full border-2 transition-all duration-200 hover:bg-[#2D5A3D] hover:text-white"
                style={{
                  borderColor: "var(--hl-green)",
                  color:       "var(--hl-green)",
                  fontSize:    "15px",
                  background:  "transparent",
                }}
              >
                Es para mi empresa
                <span>→</span>
              </Link>
            </div>

            <p
              className="mt-4 font-sans text-xs"
              style={{ color: "var(--hl-text-muted)" }}
            >
              Primera sesión de orientación gratuita · Diagnóstico empresarial gratuito
            </p>
          </FadeIn>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60L1440 60L1440 30C1200 60 960 0 720 20C480 40 240 0 0 30L0 60Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}
