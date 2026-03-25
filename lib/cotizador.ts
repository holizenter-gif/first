export type ServicioCotizador =
  | "taller" | "sensibilizacion"
  | "integracion_medio" | "integracion_dia"
  | "diagnostico" | "programa_anual";

export type Modalidad = "presencial" | "online" | "hibrido";

export interface ConfigServicio {
  label:        string;
  descripcion:  string;
  precio_base:  number;
  precio_max:   number;
  factor_pers:  number;
  min_personas: number;
  max_personas: number;
  modalidades:  Modalidad[];
  duracion:     string;
}

export const SERVICIOS_COTIZADOR: Record<ServicioCotizador, ConfigServicio> = {
  taller: {
    label: "Taller Grupal (2 horas)",
    descripcion: "Taller vivencial para tu equipo. Elige el tema que más necesita.",
    precio_base: 8000, precio_max: 25000,
    factor_pers: 120, min_personas: 10, max_personas: 200,
    modalidades: ["presencial", "online", "hibrido"], duracion: "2 horas",
  },
  sensibilizacion: {
    label: "Sensibilización Alta Dirección",
    descripcion: "Sesión estratégica para que la dirección apruebe el programa.",
    precio_base: 18000, precio_max: 45000,
    factor_pers: 800, min_personas: 3, max_personas: 15,
    modalidades: ["presencial", "online"], duracion: "3 horas",
  },
  integracion_medio: {
    label: "Integración de Equipos (medio día)",
    descripcion: "Experiencia vivencial de 4 horas para fortalecer cohesión.",
    precio_base: 22000, precio_max: 60000,
    factor_pers: 200, min_personas: 15, max_personas: 50,
    modalidades: ["presencial"], duracion: "4 horas",
  },
  integracion_dia: {
    label: "Integración de Equipos (día completo)",
    descripcion: "Experiencia de 8 horas. Incluye lunch y materiales.",
    precio_base: 45000, precio_max: 120000,
    factor_pers: 350, min_personas: 15, max_personas: 50,
    modalidades: ["presencial"], duracion: "8 horas",
  },
  diagnostico: {
    label: "Diagnóstico de Bienestar Laboral",
    descripcion: "Evaluación completa con reporte ejecutivo para dirección.",
    precio_base: 4500, precio_max: 12000,
    factor_pers: 30, min_personas: 20, max_personas: 500,
    modalidades: ["online", "presencial"], duracion: "90 minutos",
  },
  programa_anual: {
    label: "Programa Anual Recurrente",
    descripcion: "12 meses de intervención continua: talleres + diagnóstico trimestral.",
    precio_base: 120000, precio_max: 400000,
    factor_pers: 600, min_personas: 30, max_personas: 500,
    modalidades: ["presencial", "online", "hibrido"], duracion: "12 meses",
  },
};

export interface CotizacionResult {
  precio_estimado: number;
  precio_min:      number;
  precio_max:      number;
  anticipo_30:     number;
  incluye:         string[];
}

export function calcularCotizacion(
  servicio:  ServicioCotizador,
  personas:  number,
  modalidad: Modalidad
): CotizacionResult {
  const cfg = SERVICIOS_COTIZADOR[servicio];
  const extra = Math.max(0, personas - cfg.min_personas);
  let precio = cfg.precio_base + extra * cfg.factor_pers;

  const factores: Record<Modalidad, number> = {
    presencial: 1.0, hibrido: 0.85, online: 0.70,
  };
  precio *= factores[modalidad];

  const final = Math.round(
    Math.min(Math.max(precio, cfg.precio_base), cfg.precio_max) / 100
  ) * 100;

  const incluyeMap: Record<ServicioCotizador, string[]> = {
    taller:            ["Facilitador certificado", "Material digital", "Certificados", "Reporte NPS"],
    sensibilizacion:   ["Presentación ejecutiva", "Diagnóstico express", "Reporte PDF", "Plan 90 días"],
    integracion_medio: ["2 facilitadores", "Diseño personalizado", "Coffee break", "Reporte fotográfico"],
    integracion_dia:   ["2 facilitadores", "Diseño personalizado", "Lunch incluido", "Seguimiento 30 días"],
    diagnostico:       ["Reunión diagnóstico", "Cuestionario colaboradores", "Reporte ejecutivo", "Plan 6 meses"],
    programa_anual:    ["Talleres mensuales", "Diagnóstico trimestral", "Dashboard empresa", "Seguimiento continuo"],
  };

  return {
    precio_estimado: final,
    precio_min: cfg.precio_base,
    precio_max: cfg.precio_max,
    anticipo_30: Math.round((final * 0.3) / 100) * 100,
    incluye: incluyeMap[servicio],
  };
}

export function formatMXN(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN", minimumFractionDigits: 0,
  }).format(n);
}
