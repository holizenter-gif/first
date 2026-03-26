import type { Metadata } from "next";
import Link             from "next/link";
import { ArrowRight }   from "lucide-react";

export const metadata: Metadata = {
  title: "Nosotros — El equipo detrás de Holizenter",
  description:
    "Conoce a Eliane Herrera, Noemí Molina y Ulises Zarco — el equipo que construyó Holizenter desde la convicción de que el bienestar real es posible.",
};

const VALORES = [
  { titulo: "Ciencia con alma",      desc: "No elegimos entre rigor clínico y apertura espiritual. Los integramos." },
  { titulo: "Resultados medibles",   desc: "El bienestar no es un gasto. Es una inversión con ROI documentado." },
  { titulo: "Honestidad radical",    desc: "Si tu empresa necesita algo que nosotros no podemos dar, te lo decimos." },
  { titulo: "Comunidad de práctica", desc: "No somos proveedores. Somos compañeros de camino." },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="px-4 pt-8 pb-16" style={{ background: "#0D1A0F" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-sans font-bold text-white mb-4"
            style={{ fontSize: "clamp(32px,5vw,52px)" }}
          >
            El equipo detrás de Holizenter
          </h1>
          <p className="font-sans max-w-2xl mx-auto" style={{ fontSize: "20px", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
            Construimos Holizenter desde la convicción de que el bienestar real —
            científico, humano y sostenible — es posible en México.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-lg leading-relaxed mb-6" style={{ color: "#6B7280" }}>
            Holizenter nació de una frustración compartida: los programas de bienestar
            corporativo disponibles en México eran superficiales, desconectados y difíciles
            de justificar ante la dirección.
          </p>
          <p className="font-sans text-lg leading-relaxed mb-6" style={{ color: "#6B7280" }}>
            Noemí y Ulises se conocieron en un programa de formación en mindfulness
            basado en MBSR y descubrieron que compartían la misma visión: un espacio donde
            la ciencia clínica, la terapia holística y la tradición contemplativa no se
            contradicen — se potencian.
          </p>
          <p className="font-sans text-lg leading-relaxed" style={{ color: "#6B7280" }}>
            Tres años después, Holizenter ha acompañado a cientos de personas y decenas
            de empresas en Ciudad de México en procesos de transformación reales, medibles
            y sostenibles.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 px-4" style={{ background: "#F5F2EC" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-sans font-bold text-2xl mb-10 text-center" style={{ color: "#0D1A0F" }}>
            Lo que nos define
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALORES.map((v) => (
              <div
                key={v.titulo}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <h3 className="font-sans font-bold text-lg mb-2" style={{ color: "#5CB996" }}>
                  {v.titulo}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ background: "#0D1A0F" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-sans font-bold text-white text-2xl mb-3">
            ¿Quieres conocernos antes de decidir?
          </h2>
          <p className="font-sans mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
            El diagnóstico gratuito es la mejor forma de entender si Holizenter
            es lo que tu empresa necesita.
          </p>
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 font-sans font-semibold px-8 py-4 rounded-full transition-colors text-white"
            style={{ background: "#5CB996" }}
          >
            Agenda diagnóstico gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
