import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const alt         = "Holizenter — El Poder de tu Bienestar";
export const size        = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:        "100%",
          height:       "100%",
          display:      "flex",
          flexDirection:"column",
          alignItems:   "center",
          justifyContent:"center",
          background:   "#0D1A0F",
          fontFamily:   "sans-serif",
        }}
      >
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"5px", background:"#5CB996" }} />

        <div style={{ fontSize:"18px", fontWeight:700, letterSpacing:"4px", color:"#5CB996", marginBottom:"20px", textTransform:"uppercase" }}>
          HOLIZENTER
        </div>

        <div style={{ fontSize:"52px", fontWeight:700, color:"#FFFFFF", textAlign:"center", lineHeight:1.15, maxWidth:"780px", marginBottom:"16px" }}>
          El Poder de tu Bienestar
        </div>

        <div style={{ fontSize:"20px", color:"rgba(255,255,255,0.5)", textAlign:"center" }}>
          Bienestar holístico para empresas · CDMX
        </div>
      </div>
    ),
    { ...size }
  );
}
