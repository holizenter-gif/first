import { ImageIcon } from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

function AvatarPlaceholder({ iniciales }: { iniciales: string }) {
  return (
    <div className="relative w-20 h-20 mb-4 flex-shrink-0">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center font-sans font-bold text-xl text-white"
        style={{ background: "linear-gradient(135deg, #5CB996 0%, #2D5A3D 100%)" }}
      >
        {iniciales}
      </div>
      <span
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 text-white font-sans font-medium whitespace-nowrap px-2 py-0.5 rounded-full"
        style={{ background: "#5CB996", fontSize: "9px" }}
      >
        <ImageIcon className="w-2.5 h-2.5" />
        Foto pendiente
      </span>
    </div>
  );
}

const EQUIPO = [
  {
    nombre:       "Noemí Molina",
    especialidad: "Terapeuta holística · Terapia holística integrativa",
    filosofia:    "Sanar el cuerpo y sanar la mente son el mismo acto.",
    experiencia:  "12 años",
    certs:        ["Psicología clínica", "Terapia somática", "Psicología positiva"],
    iniciales:    "NM",
  },
  {
    nombre:       "Ulises Zarco",
    especialidad: "Director · Bienestar organizacional",
    filosofia:    "Las empresas están hechas de personas. El bienestar empieza ahí.",
    experiencia:  "10 años",
    certs:        ["Desarrollo organizacional", "NOM-035", "Facilitación holística"],
    iniciales:    "UZ",
  },
];

export default function EquipoEspecialistas() {
  return (
    <section className="py-24 px-4" style={{ background: "var(--hl-beige)" }}>
      <div className="max-w-6xl mx-auto">

        <FadeIn>
          <SectionLabel text="Nuestros especialistas" />
          <h2
            className="font-sans font-bold mb-3"
            style={{ fontSize: "clamp(26px,3.5vw,38px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
          >
            Un equipo que integra ciencia, terapia{" "}
            <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
              y tradición contemplativa
            </em>
            .
          </h2>
          <p className="font-sans mb-12 max-w-2xl" style={{ fontSize: "16px", color: "var(--hl-text-muted)" }}>
            No tienes que elegir entre rigor clínico y apertura espiritual.
            En Holizenter encontrarás ambos — en el mismo lugar, con las mismas personas.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {EQUIPO.map((e, i) => (
            <FadeIn key={e.nombre} delay={i * 0.12}>
              <div
                className="p-6 flex flex-col"
                style={{
                  background:   "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow:    "0 2px 16px rgba(0,0,0,0.06)",
                  borderTop:    "3px solid var(--hl-green)",
                }}
              >
                <AvatarPlaceholder iniciales={e.iniciales} />

                <h3 className="font-sans font-bold mb-0.5" style={{ fontSize: "17px", color: "var(--hl-text)" }}>
                  {e.nombre}
                </h3>
                <p className="font-sans mb-3" style={{ fontSize: "12px", color: "var(--hl-green)", fontWeight: 500 }}>
                  {e.especialidad}
                </p>
                <p
                  className="font-dm-serif italic mb-4 flex-1 leading-relaxed"
                  style={{ fontSize: "15px", color: "var(--hl-text-muted)" }}
                >
                  &ldquo;{e.filosofia}&rdquo;
                </p>

                <div
                  className="border-t pt-3 flex items-center justify-between"
                  style={{ borderColor: "var(--hl-divider)" }}
                >
                  <span className="font-sans text-xs" style={{ color: "var(--hl-text-muted)" }}>
                    {e.experiencia} de experiencia
                  </span>
                  <div className="flex gap-1">
                    {e.certs.map((c) => (
                      <span
                        key={c}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--hl-green)", opacity: 0.4 }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
