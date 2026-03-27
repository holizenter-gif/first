"use client";

import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EditorContenidoProps {
  value:    string;
  onChange: (value: string) => void;
}

export default function EditorContenido({ value, onChange }: EditorContenidoProps) {
  return (
    <div>
      <label className="text-xs text-gray-500 font-display mb-1.5 block">
        Contenido del artículo
      </label>

      <div data-color-mode="light">
        <MDEditor
          value={value}
          onChange={(v) => onChange(v ?? "")}
          height={400}
          visibleDragbar={false}
          style={{
            borderRadius: "0.75rem",
            border:       "1px solid #E5E7EB",
            fontSize:     "14px",
          }}
        />
      </div>

      <p className="text-gray-400 text-xs mt-2 leading-relaxed">
        El contenido se guarda en Markdown y se convierte a HTML al publicar.
        Compatible con Make.com para distribuir a LinkedIn.
        Usa <code className="bg-gray-100 px-1 rounded text-[10px]">**negrita**</code>,{" "}
        <code className="bg-gray-100 px-1 rounded text-[10px]">## título</code> y{" "}
        <code className="bg-gray-100 px-1 rounded text-[10px]">[link](url)</code>.
      </p>
    </div>
  );
}
