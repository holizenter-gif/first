import Link from "next/link";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const EPISODIOS_RECIENTES = [
  {
    titulo:   "Consciencia y Mindful Living",
    invitado: "Madlen Hage",
    resumen:  "Una conversación sobre cómo la consciencia plena transforma no solo la mente, sino cada relación y decisión del día a día.",
    duracion: "52 min",
  },
  {
    titulo:   "Gratitud y Abundancia — Reto 21 días",
    invitado: "Equipo Holizenter",
    resumen:  "El episodio más escuchado del podcast. Un reto práctico que miles de personas han completado con resultados documentados.",
    duracion: "38 min",
  },
  {
    titulo:   "Leyes Universales y Espiritualidad Práctica",
    invitado: "Episodio especial",
    resumen:  "Cómo integrar principios espirituales en la vida cotidiana sin perder el rigor ni la practicidad.",
    duracion: "61 min",
  },
];

const SPOTIFY_SHOW_ID = "5pfkh3LDv0ebuwN7pinzau";

export default function PodcastSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        <FadeIn>
          <SectionLabel text="El Podcast" />
          <h2
            className="font-sans font-bold mb-3"
            style={{ fontSize: "clamp(26px,3.5vw,38px)", color: "var(--hl-text)", letterSpacing: "-0.02em" }}
          >
            Conversaciones reales sobre{" "}
            <em className="font-dm-serif italic font-normal" style={{ color: "var(--hl-green)" }}>
              bienestar, ciencia y vida interior
            </em>
            .
          </h2>
          <p className="font-sans mb-12 max-w-2xl" style={{ fontSize: "16px", color: "var(--hl-text-muted)" }}>
            Cada episodio, un especialista. Cada especialista, un camino distinto hacia el mismo centro.
            Conducido por Eliane Herrera, Noemí Molina y Ulises Zarco.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Embed Spotify */}
          <FadeIn direction="left">
            <div className="rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: "var(--hl-divider)" }}>
              <iframe
                src={`https://open.spotify.com/embed/show/${SPOTIFY_SHOW_ID}?utm_source=generator&theme=0`}
                width="100%"
                height="352"
                frameBorder={0}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Holizenter — El Poder de tu Bienestar Podcast"
              />
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {[
                { nombre: "Spotify",       href: `https://open.spotify.com/show/${SPOTIFY_SHOW_ID}`, bg: "#1DB954", color: "#fff" },
                { nombre: "Apple Podcasts", href: "#",                                                 bg: "#9933CC", color: "#fff" },
                { nombre: "iVoox",          href: "#",                                                 bg: "#FF6B35", color: "#fff" },
              ].map((p) => (
                <Link
                  key={p.nombre}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold px-4 py-2 transition-opacity hover:opacity-80"
                  style={{ background: p.bg, color: p.color, borderRadius: "4px" }}
                >
                  {p.nombre}
                </Link>
              ))}
            </div>
          </FadeIn>

          {/* Episodios recientes */}
          <FadeIn direction="right">
            <div className="space-y-4">
              <p className="font-sans font-semibold text-sm mb-4" style={{ color: "var(--hl-text-muted)" }}>
                Episodios recientes
              </p>
              {EPISODIOS_RECIENTES.map((ep, i) => (
                <div
                  key={ep.titulo}
                  className="rounded-xl p-4 border flex gap-4 items-start"
                  style={{ background: "var(--hl-beige)", borderColor: "var(--hl-divider)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "var(--hl-green)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-semibold mb-0.5 truncate" style={{ fontSize: "14px", color: "var(--hl-text)" }}>
                      {ep.titulo}
                    </h4>
                    <p className="font-sans mb-1" style={{ fontSize: "11px", color: "var(--hl-green)" }}>
                      {ep.invitado}
                    </p>
                    <p className="font-sans leading-snug" style={{ fontSize: "12px", color: "var(--hl-text-muted)" }}>
                      {ep.resumen}
                    </p>
                    <p className="font-sans mt-1.5" style={{ fontSize: "11px", color: "var(--hl-text-muted)" }}>
                      {ep.duracion}
                    </p>
                  </div>
                </div>
              ))}

              <Link
                href={`https://open.spotify.com/show/${SPOTIFY_SHOW_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-sans font-semibold transition-colors hover:underline"
                style={{ fontSize: "13px", color: "var(--hl-green)" }}
              >
                Escuchar todos los episodios →
              </Link>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
