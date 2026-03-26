import type { Metadata }   from "next";
import { createClient }    from "@/lib/supabase/server";
import { redirect }        from "next/navigation";
import Link                from "next/link";
import { ArrowLeft }       from "lucide-react";
import ArticuloEditor      from "@/components/admin/ArticuloEditor";

export const metadata: Metadata = { title: "Nuevo artículo | Admin Holizenter" };

export default async function NuevoArticuloPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-brand-dark transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Nuevo artículo</h1>
          <p className="text-gray-500 text-sm mt-0.5">Redacta y publica un nuevo artículo en el blog</p>
        </div>
      </div>
      <ArticuloEditor modo="crear" />
    </div>
  );
}
