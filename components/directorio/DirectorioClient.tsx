"use client";

import { useState } from "react";
import type { Profesional } from "@/lib/supabase/types";
import ProfessionalCard  from "./ProfessionalCard";
import FiltrosDirectorio from "./FiltrosDirectorio";

interface DirectorioClientProps {
  profesionales: Profesional[];
}

export default function DirectorioClient({ profesionales }: DirectorioClientProps) {
  const [busqueda,     setBusqueda]     = useState("");
  const [modalidad,    setModalidad]    = useState("todos");
  const [especialidad, setEspecialidad] = useState("todos");

  const filtrados = profesionales.filter((p) => {
    const matchBusqueda =
      !busqueda ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(busqueda.toLowerCase()));

    const matchModalidad =
      modalidad === "todos" || p.modalidad === modalidad;

    const matchEsp =
      especialidad === "todos" ||
      p.tags.some((t) => t.toLowerCase().includes(especialidad.toLowerCase())) ||
      p.especialidad.toLowerCase().includes(especialidad.toLowerCase());

    return matchBusqueda && matchModalidad && matchEsp;
  });

  return (
    <div>
      <FiltrosDirectorio
        onBusquedaChange={setBusqueda}
        onModalidadChange={setModalidad}
        onEspecialidadChange={setEspecialidad}
      />

      {filtrados.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-sans text-sm" style={{ color: "#9CA3AF" }}>
            No hay profesionales que coincidan con los filtros.
          </p>
        </div>
      ) : (
        <>
          <p className="font-sans text-xs mb-4" style={{ color: "#9CA3AF" }}>
            {filtrados.length} especialista{filtrados.length !== 1 ? "s" : ""} disponible{filtrados.length !== 1 ? "s" : ""}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((p) => (
              <ProfessionalCard key={p.id} profesional={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
