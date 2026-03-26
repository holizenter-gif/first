export interface OpcionPregunta {
  label: string;
  value: number;
}

export type TipoPregunta = "likert" | "opciones";

export interface PreguntaQuiz {
  id:      string;
  eje:     1 | 2 | 3;
  tipo:    TipoPregunta;
  texto:   string;
  opciones: OpcionPregunta[];
}

const LIKERT_OPCIONES: OpcionPregunta[] = [
  { label: "Casi nunca",     value: 1 },
  { label: "Pocas veces",    value: 2 },
  { label: "A veces",        value: 3 },
  { label: "Frecuentemente", value: 4 },
  { label: "Casi siempre",   value: 5 },
];

export const PREGUNTAS_BURNOUT: PreguntaQuiz[] = [
  // ── EJE 1: AGOTAMIENTO (4 preguntas · máx 20pts) ──────────────
  {
    id: "b1", eje: 1, tipo: "likert",
    texto: "¿Con qué frecuencia llegas al final del día sintiéndote completamente vaciado, sin energía para nada más?",
    opciones: LIKERT_OPCIONES,
  },
  {
    id: "b2", eje: 1, tipo: "opciones",
    texto: "Cuando piensas en empezar la semana laboral, ¿qué sientes principalmente?",
    opciones: [
      { label: "Energía y ganas de avanzar",              value: 1 },
      { label: "Indiferencia, ni bien ni mal",             value: 2 },
      { label: "Algo de pesadez pero lo supero",           value: 3 },
      { label: "Un cansancio que ya se hizo costumbre",    value: 4 },
      { label: "Angustia o resistencia real",              value: 5 },
    ],
  },
  {
    id: "b3", eje: 1, tipo: "opciones",
    texto: "¿Tu trabajo está afectando tu sueño, tu alimentación o tu vida física?",
    opciones: [
      { label: "No, estoy bien físicamente",          value: 1 },
      { label: "Algo, pero nada grave",               value: 2 },
      { label: "Sí, lo noto con frecuencia",          value: 3 },
      { label: "Bastante, es algo que me preocupa",   value: 5 },
    ],
  },
  {
    id: "b4", eje: 1, tipo: "likert",
    texto: "¿Con qué frecuencia sientes que das más de lo que recibes en el trabajo?",
    opciones: LIKERT_OPCIONES,
  },

  // ── EJE 2: DESCONEXIÓN (3 preguntas · máx 15pts) ─────────────
  {
    id: "b5", eje: 2, tipo: "opciones",
    texto: "¿Sientes que tu trabajo tiene un propósito real o que es solo cumplir un horario?",
    opciones: [
      { label: "Tiene propósito claro y lo siento",     value: 1 },
      { label: "A veces lo siento, a veces no",         value: 2 },
      { label: "Cada vez lo veo menos",                 value: 3 },
      { label: "Principalmente es cumplir, nada más",   value: 4 },
      { label: "Me resulta indiferente o vacío",        value: 5 },
    ],
  },
  {
    id: "b6", eje: 2, tipo: "opciones",
    texto: "Cuando surge un problema en el trabajo, ¿cuál es tu primera reacción interna?",
    opciones: [
      { label: "Lo enfrento, busco solución",                        value: 1 },
      { label: "Me afecta pero lo gestiono",                         value: 2 },
      { label: "Me genera ansiedad que me cuesta manejar",           value: 3 },
      { label: "Resignación, ya para qué",                           value: 5 },
    ],
  },
  {
    id: "b7", eje: 2, tipo: "likert",
    texto: "¿Qué tan seguido sientes que el ambiente laboral te quita más energía de la que te da?",
    opciones: LIKERT_OPCIONES,
  },

  // ── EJE 3: RECURSOS Y SOPORTE (3 preguntas · máx 15pts) ──────
  {
    id: "b8", eje: 3, tipo: "likert",
    texto: "¿Con qué frecuencia sientes que NO tienes lo que necesitas (tiempo, herramientas, claridad) para hacer bien tu trabajo?",
    opciones: LIKERT_OPCIONES,
  },
  {
    id: "b9", eje: 3, tipo: "opciones",
    texto: "Si tuvieras un problema personal que afectara tu trabajo, ¿hablarías con tu líder o con alguien en la empresa?",
    opciones: [
      { label: "Sí, me siento seguro/a haciéndolo",                    value: 1 },
      { label: "Quizás, dependiendo del problema",                      value: 2 },
      { label: "Probablemente no, prefiero resolverlo solo/a",          value: 3 },
      { label: "No, no confío en que se maneje bien",                   value: 5 },
    ],
  },
  {
    id: "b10", eje: 3, tipo: "opciones",
    texto: "Pensando en cómo estás hoy en el trabajo, ¿qué palabra te describe mejor?",
    opciones: [
      { label: "Motivado/a",      value: 1 },
      { label: "Estable",         value: 2 },
      { label: "Cansado/a",       value: 3 },
      { label: "Desconectado/a",  value: 4 },
      { label: "Agotado/a",       value: 5 },
    ],
  },
];
