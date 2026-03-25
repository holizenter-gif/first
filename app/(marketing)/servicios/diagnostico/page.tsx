import { notFound } from "next/navigation";
import { getServicioBySlug } from "@/lib/data/servicios";
import ServicioPageTemplate from "@/components/servicios/ServicioPageTemplate";

export const metadata = {
  title: "Diagnóstico de Bienestar Laboral | Holizenter",
  description:
    "Evaluación completa del clima organizacional con metodología propia. Mide factores de riesgo psicosocial según NOM-035. Primera sesión gratuita.",
};

export default function DiagnosticoPage() {
  const servicio = getServicioBySlug("diagnostico");
  if (!servicio) notFound();
  return <ServicioPageTemplate servicio={servicio} />;
}
