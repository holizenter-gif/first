import type { Metadata }  from "next";
import { createClient }   from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link               from "next/link";
import { ArrowLeft }      from "lucide-react";
import ProductoEditorForm from "@/components/admin/ProductoEditorForm";

export const metadata: Metadata = { title: "Editar producto | Admin Holizenter" };

interface Props { params: Promise<{ id: string }> }

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: producto } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (!producto) notFound();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/tienda" className="text-gray-400 hover:text-brand-dark transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Editar producto</h1>
          <p className="text-gray-500 text-sm mt-0.5 truncate max-w-md">{producto.nombre}</p>
        </div>
      </div>
      <ProductoEditorForm modo="editar" producto={producto} />
    </div>
  );
}
