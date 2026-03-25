import { notFound } from "next/navigation";
import { getServicioBySlug } from "@/lib/data/servicios";
import ServicioPageTemplate from "@/components/servicios/ServicioPageTemplate";

export const metadata = {
  title: "Integración de Equipos | Holizenter",
  description:
    "Team building holístico de medio día o día completo. Fortalece cohesión, confianza y comunicación con resultados medibles.",
};

export default function IntegracionPage() {
  const servicio = getServicioBySlug("integracion");
  if (!servicio) notFound();
  return <ServicioPageTemplate servicio={servicio} />;
}
