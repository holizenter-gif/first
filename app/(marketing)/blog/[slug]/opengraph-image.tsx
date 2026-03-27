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

  const { data: post } = await supabase
    .from("articulos")
    .select("titulo, descripcion, autor")
    .eq("slug", slug)
    .single();

  return new ImageResponse(
    (
      <div
        style={{
          background:    "#0D1A0F",
          width:         "100%",
          height:        "100%",
          display:       "flex",
          flexDirection: "column",
          padding:       "60px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 18, color: "#5CB996", letterSpacing: 3, fontWeight: 700 }}>
          HOLIZENTER · Blog
        </div>
        <div>
          <div
            style={{
              fontSize:   46,
              fontWeight: 700,
              color:      "#ffffff",
              lineHeight: 1.2,
              marginBottom: 20,
              maxWidth:   900,
            }}
          >
            {post?.titulo ?? "Holizenter Blog"}
          </div>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
            {post?.descripcion?.slice(0, 120) ?? "Bienestar con base real"}
          </div>
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>
          {post?.autor ?? "Holizenter"} · holizenter.com
        </div>
      </div>
    ),
    { ...size }
  );
}
