"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const MODALIDADES = [
  { value: "todos",      label: "Todos"              },
  { value: "presencial", label: "Presencial CDMX"    },
  { value: "online",     label: "Online"              },
  { value: "hibrido",    label: "Presencial + Online" },
];

const ESPECIALIDADES = [
  { value: "todos",                 label: "Todas las especialidades" },
  { value: "terapia individual",    label: "Terapia individual"       },
  { value: "bienestar corporativo", label: "Bienestar corporativo"    },
  { value: "mindfulness",           label: "Mindfulness"              },
  { value: "psicología clínica",    label: "Psicología clínica"       },
  { value: "NOM-035",               label: "NOM-035"                  },
];

interface FiltrosDirectorioProps {
  onBusquedaChange:     (v: string) => void;
  onModalidadChange:    (v: string) => void;
  onEspecialidadChange: (v: string) => void;
}

export default function FiltrosDirectorio({
  onBusquedaChange,
  onModalidadChange,
  onEspecialidadChange,
}: FiltrosDirectorioProps) {
  const [modalidad,    setModalidad]    = useState("todos");
  const [especialidad, setEspecialidad] = useState("todos");

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #E5E7EB",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#374151",
    background: "#fff",
    outline: "none",
  };

  return (
    <div
      className="rounded-2xl border border-gray-100 shadow-sm p-5 mb-8"
      style={{ background: "#fff" }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 font-sans transition-colors"
            style={inputStyle}
          />
        </div>

        {/* Modalidad */}
        <select
          value={modalidad}
          onChange={(e) => { setModalidad(e.target.value); onModalidadChange(e.target.value); }}
          className="font-sans px-4 py-2.5 min-w-[180px]"
          style={inputStyle}
        >
          {MODALIDADES.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        {/* Especialidad */}
        <select
          value={especialidad}
          onChange={(e) => { setEspecialidad(e.target.value); onEspecialidadChange(e.target.value); }}
          className="font-sans px-4 py-2.5 min-w-[200px]"
          style={inputStyle}
        >
          {ESPECIALIDADES.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
