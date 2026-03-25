import { notFound } from "next/navigation";
import { getServicioBySlug } from "@/lib/data/servicios";
import ServicioPageTemplate from "@/components/servicios/ServicioPageTemplate";

export const metadata = {
  title: "Talleres y Capacitaciones | Holizenter",
  description:
    "Catálogo de 12+ talleres vivenciales de 2 horas para equipos corporativos. Manejo del estrés, comunicación no violenta, mindfulness y más.",
};

export default function TalleresPage() {
  const servicio = getServicioBySlug("talleres");
  if (!servicio) notFound();
  return <ServicioPageTemplate servicio={servicio} />;
}
