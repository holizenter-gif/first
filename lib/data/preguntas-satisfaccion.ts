import type { PreguntaQuiz, OpcionPregunta } from "@/lib/data/preguntas-burnout";

const LIKERT_OPCIONES: OpcionPregunta[] = [
  { label: "Casi nunca",     value: 1 },
  { label: "Pocas veces",    value: 2 },
  { label: "A veces",        value: 3 },
  { label: "Frecuentemente", value: 4 },
  { label: "Casi siempre",   value: 5 },
];

export const PREGUNTAS_SATISFACCION: PreguntaQuiz[] = [
  // ── EJE 1: PROPÓSITO Y SIGNIFICADO (4 preguntas · máx 20pts) ──────────
  {
    id: "s1", eje: 1, tipo: "likert",
    texto: "¿Con qué frecuencia sientes que lo que haces en el trabajo NO tiene un impacto real en otros o en algo que importa?",
    opciones: LIKERT_OPCIONES,
  },
  {
    id: "s2", eje: 1, tipo: "opciones",
    texto: "Cuando imaginas tu trabajo dentro de 2 años, ¿qué sientes principalmente?",
    opciones: [
      { label: "Entusiasmo — quiero seguir construyendo aquí",            value: 1 },
      { label: "Tranquilidad — está bien, no necesita cambiar",           value: 2 },
      { label: "Incertidumbre — no sé si esto es lo mío",                value: 3 },
      { label: "Resignación — probablemente siga igual aunque no quiera", value: 4 },
      { label: "Necesito un cambio, pero no sé cuál",                    value: 5 },
    ],
  },
  {
    id: "s3", eje: 1, tipo: "opciones",
    texto: "¿En qué medida sientes que tu trabajo refleja lo que realmente eres o lo que te importa?",
    opciones: [
      { label: "Mucho — hay una conexión real entre quien soy y lo que hago", value: 1 },
      { label: "En parte — algunos aspectos sí, otros no",                    value: 2 },
      { label: "Poco — es más lo que tengo que hacer que lo que elegiría",    value: 4 },
      { label: "Casi nada — siento una distancia importante",                 value: 5 },
    ],
  },
  {
    id: "s4", eje: 1, tipo: "likert",
    texto: "¿Con qué frecuencia terminas el día sintiendo que NO valió la pena lo que hiciste?",
    opciones: LIKERT_OPCIONES,
  },

  // ── EJE 2: CRECIMIENTO Y COMPETENCIA (3 preguntas · máx 15pts) ────────
  {
    id: "s5", eje: 2, tipo: "opciones",
    texto: "¿Tu trabajo te está ayudando a crecer — a aprender, a desarrollarte, a ser mejor en algo que te importa?",
    opciones: [
      { label: "Sí, siento que avanzo constantemente",              value: 1 },
      { label: "A veces, aunque podría ser más",                    value: 2 },
      { label: "Poco — siento que estoy estancado/a",               value: 4 },
      { label: "No — incluso siento que he retrocedido",            value: 5 },
    ],
  },
  {
    id: "s6", eje: 2, tipo: "likert",
    texto: "¿Con qué frecuencia sientes que NO tienes dominio real sobre tu trabajo — que no eres tan bueno/a en lo que haces como quisieras?",
    opciones: LIKERT_OPCIONES,
  },
  {
    id: "s7", eje: 2, tipo: "opciones",
    texto: "Cuando logras algo en el trabajo, ¿cómo lo vives internamente?",
    opciones: [
      { label: "Con satisfacción genuina — me importa y lo siento",    value: 1 },
      { label: "Bien, aunque pronto viene lo siguiente",               value: 2 },
      { label: "Con alivio más que con satisfacción",                  value: 3 },
      { label: "Indiferencia — los logros ya no me mueven mucho",      value: 5 },
    ],
  },

  // ── EJE 3: CONEXIÓN Y RELACIONES (3 preguntas · máx 15pts) ───────────
  {
    id: "s8", eje: 3, tipo: "opciones",
    texto: "¿Cómo describirías la calidad de tus relaciones en el trabajo — con tu equipo, tu líder, tus pares?",
    opciones: [
      { label: "Nutritivas — me dan energía y apoyo",                   value: 1 },
      { label: "Funcionales — correctas, aunque sin mucha profundidad", value: 2 },
      { label: "Tensas o distantes con frecuencia",                     value: 4 },
      { label: "Son una fuente de desgaste más que de apoyo",           value: 5 },
    ],
  },
  {
    id: "s9", eje: 3, tipo: "likert",
    texto: "¿Con qué frecuencia sientes que NO puedes ser tú mismo/a en el trabajo — que tienes que actuar o esconder cómo te sientes?",
    opciones: LIKERT_OPCIONES,
  },
  {
    id: "s10", eje: 3, tipo: "opciones",
    texto: "Si un amigo cercano te preguntara cómo estás en tu trabajo, ¿qué le dirías honestamente?",
    opciones: [
      { label: "Que estoy bien — con retos, pero bien",                       value: 1 },
      { label: "Que está bien aunque me gustaría más",                        value: 2 },
      { label: "Que estoy aguantando más que disfrutando",                    value: 3 },
      { label: "Que estoy pensando seriamente en cambiar",                    value: 4 },
      { label: "Que no estoy bien, aunque no siempre lo digo",               value: 5 },
    ],
  },
];
