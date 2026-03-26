import type { Metadata }   from "next";
import { createClient }    from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link                from "next/link";
import { ArrowLeft }       from "lucide-react";
import ArticuloEditor      from "@/components/admin/ArticuloEditor";

export const metadata: Metadata = { title: "Editar artículo | Admin Holizenter" };

interface Props { params: Promise<{ id: string }> }

export default async function EditarArticuloPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: articulo } = await supabase
    .from("articulos")
    .select("*")
    .eq("id", id)
    .single();

  if (!articulo) notFound();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-brand-dark transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Editar artículo</h1>
          <p className="text-gray-500 text-sm mt-0.5 truncate max-w-md">{articulo.titulo}</p>
        </div>
      </div>
      <ArticuloEditor modo="editar" articulo={articulo} />
    </div>
  );
}
