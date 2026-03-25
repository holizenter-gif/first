import type { Metadata }    from "next";
import { getProfesionales } from "@/lib/data/profesionales-helpers";
import DirectorioClient     from "@/components/directorio/DirectorioClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Directorio de Especialistas en Bienestar | Holizenter",
  description:
    "Coaches de bienestar, psicólogos, instructores MBSR y facilitadores holísticos certificados. Agenda sesiones individuales o invítalos a tu empresa.",
};

export default async function DirectorioPage() {
  const profesionales = await getProfesionales();

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>

      {/* Hero */}
      <section className="px-4 pt-8 pb-16" style={{ background: "#0D1A0F" }}>
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="inline-block text-xs font-sans font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider"
            style={{ background: "rgba(255,255,255,0.1)", color: "#5CB996" }}
          >
            Especialistas certificados
          </div>
          <h1
            className="font-sans font-bold mb-4 leading-tight"
            style={{ fontSize: "clamp(32px,5vw,52px)", color: "#fff" }}
          >
            Directorio de especialistas
          </h1>
          <p
            className="font-sans max-w-2xl mx-auto"
            style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}
          >
            Psicólogos, coaches, facilitadores e instructores MBSR.
            Presencial en CDMX y online.
          </p>
        </div>
      </section>

      {/* Listado */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <DirectorioClient profesionales={profesionales} />
        </div>
      </section>

    </div>
  );
}
