import { createClient } from "@/lib/supabase/server";
import { redirect }     from "next/navigation";
import Image            from "next/image";
import Link             from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDirectorioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profesionales } = await supabase
    .from("profesionales")
    .select("*")
    .order("orden", { ascending: true });

  const lista = profesionales ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans font-bold" style={{ fontSize: "24px", color: "var(--hl-text)" }}>
            Directorio
          </h1>
          <p className="font-sans mt-1" style={{ fontSize: "14px", color: "var(--hl-text-muted)" }}>
            Gestión de especialistas
          </p>
        </div>
        <span className="font-sans" style={{ fontSize: "12px", color: "var(--hl-text-muted)" }}>
          {lista.length} especialistas
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.map((p) => {
          const initials = (p.nombre as string).split(" ").map((n: string) => n[0]).join("").slice(0, 2);
          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
            >
              {/* Foto */}
              <div className="relative h-40" style={{ background: "#EBF8F2" }}>
                {p.foto_url ? (
                  <Image
                    src={p.foto_url}
                    alt={p.nombre}
                    fill
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-sans font-bold text-xl"
                      style={{ background: "#5CB996" }}
                    >
                      {initials}
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {p.activo ? (
                    <span
                      className="bg-white/90 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-sans"
                      style={{ color: "#5CB996" }}
                    >
                      <CheckCircle className="w-3 h-3" /> Activo
                    </span>
                  ) : (
                    <span
                      className="bg-white/90 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-sans"
                      style={{ color: "#9CA3AF" }}
                    >
                      <XCircle className="w-3 h-3" /> Inactivo
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-sans font-bold mb-0.5" style={{ color: "var(--hl-text)" }}>
                  {p.nombre}
                </h3>
                <p className="font-sans text-xs font-semibold mb-1" style={{ color: "#5CB996" }}>
                  {p.especialidad}
                </p>
                <p className="font-sans text-xs mb-3" style={{ color: "var(--hl-text-muted)" }}>
                  {p.experiencia_anos} años · {p.modalidad}
                </p>
                <Link
                  href={`/directorio/${p.slug}`}
                  target="_blank"
                  className="font-sans text-xs hover:underline"
                  style={{ color: "#5CB996" }}
                >
                  Ver perfil público →
                </Link>
              </div>
            </div>
          );
        })}

        {/* Placeholder agregar */}
        <div
          className="rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center min-h-[200px]"
          style={{ background: "var(--hl-beige)" }}
        >
          <p className="font-sans text-sm" style={{ color: "#9CA3AF" }}>Agregar especialista</p>
          <p className="font-sans text-xs mt-1" style={{ color: "#D1D5DB" }}>Próximamente vía panel</p>
        </div>
      </div>
    </div>
  );
}
