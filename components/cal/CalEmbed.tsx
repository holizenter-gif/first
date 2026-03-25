"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface CalEmbedProps {
  calUsername:   string;
  eventSlug:     string;
  prefillName?:  string;
  prefillEmail?: string;
  prefillNotes?: string;
  onBooked?:     (data: unknown) => void;
  className?:    string;
}

export default function CalEmbed({
  calUsername, eventSlug,
  prefillName, prefillEmail, prefillNotes,
  onBooked, className = "",
}: CalEmbedProps) {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const params = new URLSearchParams();
  if (prefillName)  params.set("name",  prefillName);
  if (prefillEmail) params.set("email", prefillEmail);
  if (prefillNotes) params.set("notes", prefillNotes);

  const calUrl = `https://cal.com/${calUsername}/${eventSlug}?${params.toString()}&embed=true&theme=light&hideEventTypeDetails=false&layout=month_view`;

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== "https://cal.com") return;
      if ((e.data as Record<string, unknown>)?.type === "CAL:bookingSuccessful") {
        onBooked?.(e.data);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onBooked]);

  return (
    <div className={`relative w-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-beige rounded-2xl z-10 min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-brand-teal animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Cargando calendario...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center bg-brand-beige rounded-2xl p-12 min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No se pudo cargar el calendario</p>
            <a
              href={`https://cal.com/${calUsername}/${eventSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-teal underline text-sm"
            >
              Abrir calendario en nueva pestaña →
            </a>
          </div>
        </div>
      )}
      <iframe
        src={calUrl}
        frameBorder={0}
        className={`w-full rounded-2xl ${error ? "hidden" : ""}`}
        style={{ minHeight: "700px" }}
        onLoad={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
        allow="camera; microphone; fullscreen"
        title="Agenda tu cita con Holizenter"
      />
    </div>
  );
}
