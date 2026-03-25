import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import ServicesGrid from "@/components/sections/ServicesGrid";
import TresPilares from "@/components/sections/TresPilares";
import QuizCTABanner from "@/components/sections/QuizCTABanner";
import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel";
import Nom035Banner from "@/components/sections/Nom035Banner";

export const metadata: Metadata = {
  title: "Holizenter — El Poder de tu Bienestar | Bienestar Holístico para Empresas",
  description:
    "Diagnóstico laboral gratuito, talleres de bienestar, integración de equipos y sensibilización de alta dirección para empresas en México. NOM-035 Cumplimiento Garantizado.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesGrid />
      <TresPilares />
      <QuizCTABanner />
      <TestimonialsCarousel />
      <Nom035Banner />
    </>
  );
}
