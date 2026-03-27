"use client";

import { useState, useRef } from "react";
import Image                 from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface ImagenUploaderProps {
  value:        string;
  onChange:     (url: string) => void;
  bucket?:      "imagenes-blog" | "imagenes-productos";
  label?:       string;
  aspectRatio?: "banner" | "cuadrado";
}

export default function ImagenUploader({
  value,
  onChange,
  bucket      = "imagenes-blog",
  label       = "Imagen de portada",
  aspectRatio = "banner",
}: ImagenUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const apiEndpoint =
    bucket === "imagenes-blog"
      ? "/api/admin/blog/upload-imagen"
      : "/api/admin/productos/upload-imagen";

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5MB");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res  = await fetch(apiEndpoint, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error subiendo imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const alturaPreview = aspectRatio === "cuadrado" ? "h-48 w-48 mx-auto" : "h-48";

  return (
    <div>
      <label className="text-xs text-gray-500 font-display mb-1.5 block">{label}</label>

      {value ? (
        <div className="relative">
          <div className={`relative ${alturaPreview} rounded-xl overflow-hidden border border-gray-200`}>
            <Image src={value} alt="Preview" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white border border-gray-200 rounded-full w-7 h-7 flex items-center justify-center shadow-sm transition-colors"
          >
            <X className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-2 text-xs font-display hover:underline"
            style={{ color: "#5CB996" }}
          >
            Cambiar imagen
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl ${alturaPreview} flex flex-col items-center justify-center cursor-pointer transition-all`}
          style={{ borderColor: "#E5E7EB" }}
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {loading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin mb-2" style={{ color: "#5CB996" }} />
              <p className="text-sm font-display" style={{ color: "#5CB996" }}>Subiendo...</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-300 mb-2" />
              <p className="font-display font-semibold text-gray-500 text-sm">
                Arrastra una imagen o haz clic
              </p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP · Máx 5MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
