import type { PreguntaQuiz, OpcionPregunta } from "./preguntas-burnout";

const LIKERT: OpcionPregunta[] = [
  { label: "Casi nunca",     value: 1 },
  { label: "Pocas veces",    value: 2 },
  { label: "A veces",        value: 3 },
  { label: "Frecuentemente", value: 4 },
  { label: "Casi siempre",   value: 5 },
];

// Usamos eje 1-3 del tipo base para los 5 ejes de clima
// eje 1 → Liderazgo
// eje 2 → Carga y control
// eje 3 → Ambiente y condiciones
// Los ejes 4 y 5 se mapean via campo extra en la clave del id

// NOTA TÉCNICA: PreguntaQuiz.eje es 1|2|3 en el tipo base.
// Para clima extendemos a 1|2|3|4|5 — usamos casting seguro.

export type EjeClima = 1 | 2 | 3 | 4 | 5;

export interface PreguntaClima extends Omit<PreguntaQuiz, "eje"> {
  eje: EjeClima;
}

export const EJE_CLIMA_LABEL: Record<EjeClima, string> = {
  1: "Liderazgo",
  2: "Carga y control",
  3: "Ambiente y condiciones",
  4: "Relaciones y cohesión",
  5: "Equilibrio vida-trabajo",
};

export const PREGUNTAS_CLIMA: PreguntaClima[] = [
  // ── EJE 1: LIDERAZGO (3 preguntas · máx 15pts) ───────────────
  {
    id: "c1", eje: 1, tipo: "opciones",
    texto: "¿Cómo describirías la forma en que el liderazgo de tu organización comunica decisiones que afectan al equipo?",
    opciones: [
      { label: "Con claridad y anticipación — el equipo entiende el porqué",       value: 1 },
      { label: "Generalmente bien, aunque a veces falta contexto",                 value: 2 },
      { label: "Con frecuencia hay vacíos que generan rumor o incertidumbre",      value: 3 },
      { label: "La comunicación es inconsistente o llega tarde",                   value: 4 },
      { label: "Es una fuente reconocida de tensión en la organización",           value: 5 },
    ],
  },
  {
    id: "c2", eje: 1, tipo: "likert",
    texto: "En tu organización, ¿con qué frecuencia el liderazgo NO reconoce el trabajo bien hecho de manera genuina?",
    opciones: LIKERT,
  },
  {
    id: "c3", eje: 1, tipo: "opciones",
    texto: "Cuando hay conflictos entre personas o áreas, ¿cómo los maneja el liderazgo?",
    opciones: [
      { label: "Los aborda directamente y genera resolución real",             value: 1 },
      { label: "Interviene cuando es necesario, con resultados variables",     value: 2 },
      { label: "Tiende a evitarlos o minimizarlos",                           value: 3 },
      { label: "Con frecuencia el liderazgo es parte del conflicto",          value: 5 },
    ],
  },

  // ── EJE 2: CARGA Y CONTROL (3 preguntas · máx 15pts) ─────────
  {
    id: "c4", eje: 2, tipo: "opciones",
    texto: "¿Cómo evaluarías la distribución de carga de trabajo en tu organización?",
    opciones: [
      { label: "Equitativa y manejable para la mayoría",                     value: 1 },
      { label: "Variable — algunos equipos tienen más presión que otros",    value: 2 },
      { label: "Hay sobrecarga crónica en áreas clave",                      value: 4 },
      { label: "La sobrecarga es generalizada y afecta resultados",          value: 5 },
    ],
  },
  {
    id: "c5", eje: 2, tipo: "likert",
    texto: "¿Con qué frecuencia los colaboradores NO tienen claridad sobre sus prioridades y dependen de aprobaciones constantes para avanzar?",
    opciones: LIKERT,
  },
  {
    id: "c6", eje: 2, tipo: "opciones",
    texto: "¿Cómo manejan los colaboradores las situaciones de alta presión o picos de trabajo?",
    opciones: [
      { label: "Con recursos y soporte — hay sistemas para sostenerlos",      value: 1 },
      { label: "Lo resuelven, aunque con desgaste visible",                   value: 2 },
      { label: "Generalmente solos, sin herramientas claras",                 value: 3 },
      { label: "Es cuando más se nota la falta de estructura o apoyo",        value: 5 },
    ],
  },

  // ── EJE 3: AMBIENTE Y CONDICIONES (3 preguntas · máx 15pts) ──
  {
    id: "c7", eje: 3, tipo: "opciones",
    texto: "¿Las condiciones físicas y operativas del trabajo permiten que la gente haga bien su trabajo?",
    opciones: [
      { label: "Sí — el ambiente facilita el desempeño",                     value: 1 },
      { label: "En general sí, con algunas áreas de mejora",                 value: 2 },
      { label: "Hay carencias que generan fricción frecuente",               value: 3 },
      { label: "Las condiciones son un obstáculo reconocido",                value: 5 },
    ],
  },
  {
    id: "c8", eje: 3, tipo: "likert",
    texto: "¿Con qué frecuencia la jornada laboral real excede la jornada formal de manera sistemática?",
    opciones: LIKERT,
  },
  {
    id: "c9", eje: 3, tipo: "opciones",
    texto: "¿Cómo describirías el nivel de ruido organizacional — reuniones innecesarias, interrupciones, procesos que no agregan valor?",
    opciones: [
      { label: "Bajo — la organización es bastante eficiente",                value: 1 },
      { label: "Moderado — hay áreas de mejora pero no paraliza",             value: 2 },
      { label: "Alto — consume tiempo y energía de forma notable",            value: 4 },
      { label: "Es uno de los principales generadores de desgaste",           value: 5 },
    ],
  },

  // ── EJE 4: RELACIONES Y COHESIÓN (3 preguntas · máx 15pts) ───
  {
    id: "c10", eje: 4, tipo: "opciones",
    texto: "¿Cómo describirías la calidad de las relaciones entre pares y equipos?",
    opciones: [
      { label: "Colaborativas y de confianza en general",                      value: 1 },
      { label: "Funcionales, aunque con tensiones puntuales",                  value: 2 },
      { label: "Hay silos o fricciones que afectan la colaboración",           value: 3 },
      { label: "Las relaciones son una fuente activa de conflicto o desgaste", value: 5 },
    ],
  },
  {
    id: "c11", eje: 4, tipo: "likert",
    texto: "¿Con qué frecuencia los colaboradores NO expresan abiertamente sus ideas o errores por temor a consecuencias negativas?",
    opciones: LIKERT,
  },
  {
    id: "c12", eje: 4, tipo: "opciones",
    texto: "¿Existe alguna forma de conducta que cruce límites — trato irrespetuoso, presión indebida, exclusión sistemática?",
    opciones: [
      { label: "No — hay cultura de respeto clara y sostenida",               value: 1 },
      { label: "Casos aislados que se atienden cuando ocurren",               value: 2 },
      { label: "Hay patrones que se toleran aunque no se nombran",            value: 4 },
      { label: "Es algo visible que no se está abordando",                    value: 5 },
    ],
  },

  // ── EJE 5: EQUILIBRIO VIDA-TRABAJO (3 preguntas · máx 15pts) ─
  {
    id: "c13", eje: 5, tipo: "opciones",
    texto: "¿Tu organización respeta en la práctica los límites entre el tiempo laboral y el tiempo personal?",
    opciones: [
      { label: "Sí — hay cultura real de desconexión",                                  value: 1 },
      { label: "En general sí, con excepciones ocasionales",                            value: 2 },
      { label: "Hay expectativa implícita de disponibilidad fuera de horario",          value: 4 },
      { label: "La frontera trabajo-vida personal es difusa de forma sistemática",      value: 5 },
    ],
  },
  {
    id: "c14", eje: 5, tipo: "likert",
    texto: "¿Con qué frecuencia escuchas que colaboradores sienten que el trabajo está afectando su vida personal, familiar o su salud?",
    opciones: LIKERT,
  },
  {
    id: "c15", eje: 5, tipo: "opciones",
    texto: "Si tuvieras que describir el bienestar general de tu organización hoy con una sola imagen, ¿cuál elegirías?",
    opciones: [
      { label: "Un equipo que corre junto con energía",                        value: 1 },
      { label: "Personas que avanzan aunque con cansancio visible",           value: 2 },
      { label: "Gente cargando más de lo que debería",                        value: 3 },
      { label: "Un sistema bajo presión que está empezando a ceder",          value: 4 },
      { label: "Señales claras de que algo necesita intervención ya",         value: 5 },
    ],
  },
];
