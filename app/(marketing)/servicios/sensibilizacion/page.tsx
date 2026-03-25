import { notFound } from "next/navigation";
import { getServicioBySlug } from "@/lib/data/servicios";
import ServicioPageTemplate from "@/components/servicios/ServicioPageTemplate";

export const metadata = {
  title: "Sensibilización Alta Dirección | Holizenter",
  description:
    "Sesión estratégica de 3 horas para CEOs y directores. Convierte a la dirección en aliada del bienestar con datos duros y ROI proyectado.",
};

export default function SensibilizacionPage() {
  const servicio = getServicioBySlug("sensibilizacion");
  if (!servicio) notFound();
  return <ServicioPageTemplate servicio={servicio} />;
}
