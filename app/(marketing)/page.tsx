import type { Metadata } from "next";
import HeroGeneral         from "@/components/landing/HeroGeneral";
import Manifiesto          from "@/components/landing/Manifiesto";
import TresCaminos         from "@/components/landing/TresCaminos";
import MetodologiaMBSR     from "@/components/landing/MetodologiaMBSR";
import EquipoEspecialistas from "@/components/landing/EquipoEspecialistas";
import PodcastSection      from "@/components/landing/PodcastSection";
import TresPilaresGeneral  from "@/components/landing/TresPilaresGeneral";
import PruebaSocial        from "@/components/landing/PruebaSocial";
import CTAFinal            from "@/components/landing/CTAFinal";
import QuizCTA             from "@/components/quiz/QuizCTA";

export const metadata: Metadata = {
  title: "Holizenter — El Poder de tu Bienestar | Bienestar Holístico Real",
  description:
    "Tu punto de encuentro para el bienestar real. Físico, emocional y espiritual. Para personas y empresas. Programa MBSR avalado por Brown University. Ciudad de México.",
  keywords: [
    "bienestar holístico México",
    "programa MBSR México",
    "terapia holística CDMX",
    "bienestar empresarial México",
    "mindfulness empresas",
    "Holizenter",
  ],
  openGraph: {
    title:       "Holizenter — Tu punto de encuentro para el bienestar real",
    description: "Físico, emocional y espiritual. Para personas y empresas. MBSR · Terapia holística · Bienestar organizacional.",
    url:         process.env.NEXT_PUBLIC_APP_URL ?? "https://holizenter.mx",
    images:      [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroGeneral />
      <Manifiesto />
      <TresCaminos />
      <div className="max-w-4xl mx-auto px-4 py-2">
        <QuizCTA quiz_id_override="burnout" variant="banner" source_section="home_mid" />
      </div>
      <MetodologiaMBSR />
      <EquipoEspecialistas />
      <PodcastSection />
      <TresPilaresGeneral />
      <PruebaSocial />
      <CTAFinal />
    </>
  );
}
