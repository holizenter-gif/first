export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link             from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import EventoForm       from "@/components/admin/EventoForm";

interface Props { params: Promise<{ id: string }> }

export default async function EditarEventoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: ev } = await supabase
    .from("eventos")
    .select("*")
    .eq("id", id)
    .single();

  if (!ev) notFound();

  // Convertir a strings para los inputs del formulario
  const inicial = {
    titulo:             ev.titulo            ?? "",
    slug:               ev.slug              ?? "",
    descripcion_corta:  ev.descripcion_corta ?? "",
    descripcion:        ev.descripcion       ?? "",
    fecha_inicio:       ev.fecha_inicio
      ? new Date(ev.fecha_inicio).toISOString().slice(0, 16)
      : "",
    fecha_fin:          ev.fecha_fin
      ? new Date(ev.fecha_fin).toISOString().slice(0, 16)
      : "",
    modalidad:          ev.modalidad         ?? "presencial",
    ubicacion:          ev.ubicacion         ?? "",
    link_virtual:       ev.link_virtual      ?? "",
    precio:             String(ev.precio     ?? 0),
    precio_descripcion: ev.precio_descripcion ?? "",
    cupo_maximo:        ev.cupo_maximo != null ? String(ev.cupo_maximo) : "",
    imagen_url:         ev.imagen_url        ?? "",
    activo:             ev.activo            ?? true,
    destacado:          ev.destacado         ?? false,
    pasado:             ev.pasado            ?? false,
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/eventos" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-sans text-2xl font-bold" style={{ color: "var(--hl-text)" }}>
              {ev.titulo}
            </h1>
            <p className="font-sans text-sm mt-0.5" style={{ color: "var(--hl-text-muted)" }}>
              Editar evento
            </p>
          </div>
        </div>
        <Link
          href={`/eventos/${ev.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs font-sans font-medium hover:underline"
          style={{ color: "#5CB996" }}
        >
          Ver público <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
      <EventoForm inicial={inicial} eventoId={id} />
    </div>
  );
}
