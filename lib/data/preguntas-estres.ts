import type { PreguntaQuiz } from "./preguntas-burnout";

const LIKERT_OPCIONES = [
  { label: "Casi nunca",     value: 1 },
  { label: "Pocas veces",    value: 2 },
  { label: "A veces",        value: 3 },
  { label: "Frecuentemente", value: 4 },
  { label: "Casi siempre",   value: 5 },
];

export const PREGUNTAS_ESTRES: PreguntaQuiz[] = [
  // ── EJE 1: CARGA Y DEMANDAS (4 preguntas · máx 20pts) ─────────────
  {
    id: "e1", eje: 1, tipo: "likert",
    texto: "¿Con qué frecuencia sientes que la cantidad de trabajo que tienes es difícil de sostener en el tiempo?",
    opciones: LIKERT_OPCIONES,
  },
  {
    id: "e2", eje: 1, tipo: "opciones",
    texto: "Cuando termina tu jornada laboral, ¿cómo describirías tu relación con los pendientes?",
    opciones: [
      { label: "Los cierro bien, salgo con la mente tranquila",                   value: 1 },
      { label: "Quedan cosas, pero es manejable",                                 value: 2 },
      { label: "Siempre hay más de lo que puedo terminar",                        value: 3 },
      { label: "Los pendientes me siguen fuera del trabajo",                      value: 4 },
      { label: "Siento que nunca es suficiente, sin importar cuánto haga",        value: 5 },
    ],
  },
  {
    id: "e3", eje: 1, tipo: "opciones",
    texto: "¿Cómo afecta la presión del tiempo la calidad de tu trabajo?",
    opciones: [
      { label: "No la afecta, tengo margen suficiente",                           value: 1 },
      { label: "A veces me apresuro, pero el resultado es bueno",                 value: 2 },
      { label: "Con frecuencia tengo que sacrificar calidad por velocidad",       value: 4 },
      { label: "Es constante — la presión ya distorsiona cómo trabajo",           value: 5 },
    ],
  },
  {
    id: "e4", eje: 1, tipo: "likert",
    texto: "¿Con qué frecuencia las interrupciones o cambios de prioridad rompen tu concentración de forma significativa?",
    opciones: LIKERT_OPCIONES,
  },

  // ── EJE 2: CONTROL Y AUTONOMÍA (3 preguntas · máx 15pts) ──────────
  {
    id: "e5", eje: 2, tipo: "opciones",
    texto: "¿Qué tan claro tienes lo que se espera de ti en tu rol?",
    opciones: [
      { label: "Muy claro — sé exactamente mis prioridades y límites",            value: 1 },
      { label: "Bastante claro, aunque a veces hay zonas grises",                 value: 2 },
      { label: "Hay ambigüedad frecuente que me genera tensión",                  value: 4 },
      { label: "No está claro — eso es una fuente constante de estrés",           value: 5 },
    ],
  },
  {
    id: "e6", eje: 2, tipo: "opciones",
    texto: "¿Sientes que tienes autonomía real para decidir cómo hacer tu trabajo?",
    opciones: [
      { label: "Sí, tengo margen real para decidir",                              value: 1 },
      { label: "En algunos aspectos sí, en otros no",                             value: 2 },
      { label: "Poco — hay mucho control o aprobación constante",                 value: 4 },
      { label: "No — casi todo requiere validación externa",                      value: 5 },
    ],
  },
  {
    id: "e7", eje: 2, tipo: "opciones",
    texto: "Cuando el liderazgo toma decisiones que afectan tu trabajo, ¿cómo lo vives?",
    opciones: [
      { label: "Con confianza — generalmente tienen sentido",                     value: 1 },
      { label: "A veces no entiendo el porqué, pero lo acepto",                   value: 2 },
      { label: "Con frecuencia genera presión o confusión en el equipo",          value: 3 },
      { label: "Es una fuente constante de tensión o frustración",                value: 5 },
    ],
  },

  // ── EJE 3: SOPORTE ORGANIZACIONAL (3 preguntas · máx 15pts) ───────
  {
    id: "e8", eje: 3, tipo: "opciones",
    texto: "Si hoy estuvieras al límite de tu capacidad, ¿qué tan probable es que alguien en tu organización lo notara y actuara?",
    opciones: [
      { label: "Muy probable — hay cultura de apoyo real",                        value: 1 },
      { label: "Quizás, si yo lo dijera explícitamente",                          value: 2 },
      { label: "Poco probable — cada quien resuelve lo suyo",                     value: 4 },
      { label: "No pasaría — no es parte de la cultura",                          value: 5 },
    ],
  },
  {
    id: "e9", eje: 3, tipo: "opciones",
    texto: "¿Sientes que tu esfuerzo es reconocido de forma que te importa — no solo con palabras, sino con hechos?",
    opciones: [
      { label: "Sí, hay reconocimiento real y consistente",                       value: 1 },
      { label: "A veces, aunque podría ser más",                                  value: 2 },
      { label: "Rara vez — el esfuerzo se da por sentado",                        value: 4 },
      { label: "No — trabajar más no cambia nada",                                value: 5 },
    ],
  },
  {
    id: "e10", eje: 3, tipo: "opciones",
    texto: "Si tuvieras que describir el nivel de estrés de tu entorno laboral hoy, ¿qué elegirías?",
    opciones: [
      { label: "Manejable y con sentido",                                          value: 1 },
      { label: "Intenso pero sostenible",                                          value: 2 },
      { label: "Alto y con pocas válvulas de escape",                              value: 3 },
      { label: "Al límite",                                                        value: 4 },
      { label: "Insostenible",                                                     value: 5 },
    ],
  },
];
