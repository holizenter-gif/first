import { ImageResponse } from "next/og";
import { createClient }  from "@supabase/supabase-js";

export const runtime     = "edge";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: producto } = await supabase
    .from("productos")
    .select("nombre, descripcion_corta, precio, precio_oferta, tipo_precio")
    .eq("slug", slug)
    .single();

  const precio =
    producto?.tipo_precio === "oferta" && producto?.precio_oferta
      ? producto.precio_oferta
      : producto?.precio ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          background:    "#F5F2EC",
          width:         "100%",
          height:        "100%",
          display:       "flex",
          flexDirection: "column",
          padding:       "60px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 18, color: "#5CB996", letterSpacing: 3, fontWeight: 700 }}>
          HOLIZENTER · Tienda
        </div>
        <div>
          <div
            style={{
              fontSize:   46,
              fontWeight: 700,
              color:      "#0D1A0F",
              lineHeight: 1.1,
              marginBottom: 16,
              maxWidth:   800,
            }}
          >
            {producto?.nombre ?? "Tienda Holizenter"}
          </div>
          <div style={{ fontSize: 20, color: "#4A5E4E", marginBottom: 20 }}>
            {(producto?.descripcion_corta ?? "").slice(0, 100)}
          </div>
          {precio > 0 && (
            <div style={{ fontSize: 40, fontWeight: 800, color: "#5CB996" }}>
              ${precio.toLocaleString("es-MX")} MXN
            </div>
          )}
        </div>
        <div style={{ fontSize: 14, color: "#9CA3AF" }}>holizenter.com/tienda</div>
      </div>
    ),
    { ...size }
  );
}
