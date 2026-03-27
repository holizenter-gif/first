import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "Holizenter — El Poder de tu Bienestar";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:      "100%",
          height:     "100%",
          display:    "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D1A0F",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#5CB996",
          }}
        />

        {/* Logo text */}
        <div
          style={{
            fontSize:    "20px",
            fontWeight:  700,
            letterSpacing: "4px",
            color:       "#5CB996",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          HOLIZENTER
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize:    "56px",
            fontWeight:  700,
            color:       "#FFFFFF",
            textAlign:   "center",
            lineHeight:  1.15,
            maxWidth:    "800px",
            marginBottom: "20px",
          }}
        >
          El Poder de tu Bienestar
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize:    "22px",
            color:       "rgba(255,255,255,0.55)",
            textAlign:   "center",
            maxWidth:    "680px",
            lineHeight:  1.5,
            marginBottom: "40px",
          }}
        >
          Bienestar holístico para empresas · Cuerpo · Mente · Espíritu
        </div>

        {/* CTA pill */}
        <div
          style={{
            background:   "#5CB996",
            color:        "#fff",
            fontSize:     "18px",
            fontWeight:   600,
            padding:      "14px 36px",
            borderRadius: "999px",
          }}
        >
          Diagnóstico gratis → holizenter.com
        </div>
      </div>
    ),
    { ...size }
  );
}
