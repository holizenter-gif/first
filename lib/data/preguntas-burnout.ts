export interface OpcionPregunta { label: string; value: number; }
export interface PreguntaQuiz {
  id: string;
  texto: string;
  categoria: "clima" | "rotacion" | "ausentismo" | "estres" | "liderazgo";
  opciones: OpcionPregunta[];
}

export const PREGUNTAS_BURNOUT: PreguntaQuiz[] = [
  { id: "q1", texto: "¿Con qué frecuencia los miembros de tu equipo expresan sentirse agotados o sin energía al final del día?", categoria: "estres",
    opciones: [{ label: "Casi nunca — el equipo mantiene buena energía", value: 10 }, { label: "Ocasionalmente — algunos días difíciles", value: 7 }, { label: "Con frecuencia — es algo común en el equipo", value: 4 }, { label: "Casi siempre — el agotamiento es generalizado", value: 1 }] },
  { id: "q2", texto: "¿Cómo describirías el nivel de rotación de personal en tu empresa en los últimos 12 meses?", categoria: "rotacion",
    opciones: [{ label: "Muy baja — el equipo es estable y comprometido", value: 10 }, { label: "Normal — salidas y entradas naturales del mercado", value: 7 }, { label: "Alta — hemos perdido talento clave este año", value: 4 }, { label: "Muy alta — la rotación está afectando la operación", value: 1 }] },
  { id: "q3", texto: "¿Con qué frecuencia hay ausentismo injustificado o incapacidades médicas relacionadas con estrés en tu equipo?", categoria: "ausentismo",
    opciones: [{ label: "Casi nunca — el equipo tiene excelente asistencia", value: 10 }, { label: "Raramente — casos aislados sin impacto real", value: 7 }, { label: "Regularmente — afecta la productividad del equipo", value: 4 }, { label: "Constantemente — es un problema operativo serio", value: 1 }] },
  { id: "q4", texto: "¿Cómo perciben los colaboradores la carga de trabajo actual?", categoria: "estres",
    opciones: [{ label: "Manejable — hay equilibrio entre demanda y capacidad", value: 10 }, { label: "Un poco elevada — pero el equipo lo maneja bien", value: 7 }, { label: "Alta — muchos sienten que no alcanzan a cumplir", value: 4 }, { label: "Insostenible — el equipo trabaja bajo presión extrema", value: 1 }] },
  { id: "q5", texto: "¿Cómo es la comunicación entre líderes y sus equipos en tu organización?", categoria: "liderazgo",
    opciones: [{ label: "Abierta y fluida — hay confianza y claridad", value: 10 }, { label: "Adecuada — funciona aunque hay áreas de mejora", value: 7 }, { label: "Deficiente — hay tensión o falta de información", value: 4 }, { label: "Muy mala — existe desconfianza o conflictos frecuentes", value: 1 }] },
  { id: "q6", texto: "¿Tu empresa tiene algún programa o iniciativa formal de bienestar para los colaboradores?", categoria: "clima",
    opciones: [{ label: "Sí, activo y con seguimiento regular", value: 10 }, { label: "Tenemos algo básico pero sin estructura formal", value: 7 }, { label: "Está planeado pero aún no se implementa", value: 4 }, { label: "No existe ningún programa de bienestar", value: 1 }] },
  { id: "q7", texto: "¿Con qué frecuencia los colaboradores trabajan horas extra o fines de semana de forma recurrente?", categoria: "estres",
    opciones: [{ label: "Rara vez — se respetan los horarios laborales", value: 10 }, { label: "Ocasionalmente — solo en períodos de alta demanda", value: 7 }, { label: "Seguido — las horas extra son práctica común", value: 4 }, { label: "Siempre — el equipo nunca desconecta realmente", value: 1 }] },
  { id: "q8", texto: "¿Cómo evaluarías el clima laboral y la convivencia entre compañeros en tu empresa?", categoria: "clima",
    opciones: [{ label: "Excelente — hay compañerismo y ambiente positivo", value: 10 }, { label: "Bueno — aunque con algunas fricciones normales", value: 7 }, { label: "Tenso — hay conflictos o competencia negativa", value: 4 }, { label: "Muy malo — hay toxicidad o acoso en el equipo", value: 1 }] },
  { id: "q9", texto: "¿Los colaboradores sienten que su trabajo tiene propósito y es valorado por la organización?", categoria: "clima",
    opciones: [{ label: "Sí — hay reconocimiento y sentido de impacto claro", value: 10 }, { label: "En general sí — aunque podría mejorarse el reconocimiento", value: 7 }, { label: "Poco — muchos sienten que su trabajo no es valorado", value: 4 }, { label: "No — hay desmotivación y falta de propósito generalizada", value: 1 }] },
  { id: "q10", texto: "Si tuvieras que calificar el nivel general de bienestar de tu equipo hoy del 1 al 10, ¿qué número darías?", categoria: "clima",
    opciones: [{ label: "8 a 10 — el equipo está bien y productivo", value: 10 }, { label: "6 a 7 — aceptable pero con espacio de mejora", value: 7 }, { label: "4 a 5 — hay problemas que requieren atención", value: 4 }, { label: "1 a 3 — la situación es crítica y urgente", value: 1 }] },
];
