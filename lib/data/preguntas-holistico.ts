import type { OpcionPregunta, PreguntaQuiz } from "@/lib/data/preguntas-burnout";

const LIKERT_OPCIONES: OpcionPregunta[] = [
  { label: "Casi nunca",     value: 1 },
  { label: "Pocas veces",    value: 2 },
  { label: "A veces",        value: 3 },
  { label: "Frecuentemente", value: 4 },
  { label: "Casi siempre",   value: 5 },
];

export const PREGUNTAS_HOLISTICO: PreguntaQuiz[] = [
  // ── EJE 1: CUERPO (3 preguntas · máx 15pts) ──────────────────────
  {
    id: "h1", eje: 1, tipo: "opciones",
    texto: "Cuando te despiertas por la mañana, ¿cómo describirías lo que siente tu cuerpo antes de que empiece el día?",
    opciones: [
      { label: "Descansado y con energía real",                       value: 1 },
      { label: "Bien en general, aunque con algo de inercia",         value: 2 },
      { label: "Cansado desde antes de empezar",                      value: 3 },
      { label: "Con tensión o pesadez que ya se siente familiar",     value: 4 },
      { label: "Agotado — como si el descanso no alcanzara",          value: 5 },
    ],
  },
  {
    id: "h2", eje: 1, tipo: "opciones",
    texto: "¿Tu cuerpo te está mandando señales que sabes que deberías atender — y que has ido posponiendo?",
    opciones: [
      { label: "No — estoy en sintonía con lo que necesito físicamente",  value: 1 },
      { label: "Algunas cosas menores que tengo en mente",               value: 2 },
      { label: "Sí, hay señales que llevo tiempo ignorando",             value: 4 },
      { label: "Sí, y me preocupa no haberlas atendido",                 value: 5 },
    ],
  },
  {
    id: "h3", eje: 1, tipo: "likert",
    texto: "¿Con qué frecuencia sientes que NO tienes energía física real para hacer lo que quieres hacer — no solo lo que tienes que hacer?",
    opciones: LIKERT_OPCIONES,
  },

  // ── EJE 2: MENTE (3 preguntas · máx 15pts) ───────────────────────
  {
    id: "h4", eje: 2, tipo: "opciones",
    texto: "¿Cómo describirías tu estado mental la mayor parte del tiempo — no en tus mejores días, sino en los días ordinarios?",
    opciones: [
      { label: "Claro y presente — puedo estar donde estoy",                        value: 1 },
      { label: "Funcional, aunque con ruido de fondo",                              value: 2 },
      { label: "Con frecuencia disperso o ansioso sin razón clara",                 value: 3 },
      { label: "Bajo una carga mental que se siente constante",                     value: 4 },
      { label: "Agotado mentalmente — me cuesta concentrarme o descansar",          value: 5 },
    ],
  },
  {
    id: "h5", eje: 2, tipo: "opciones",
    texto: "Cuando algo te preocupa o te afecta emocionalmente, ¿qué suele pasar dentro de ti?",
    opciones: [
      { label: "Lo proceso, busco entenderlo y sigo",                               value: 1 },
      { label: "Me afecta un tiempo pero lo integro",                               value: 2 },
      { label: "Tiende a quedarse dando vueltas más de lo que quisiera",            value: 3 },
      { label: "Me cuesta mucho salir de ese estado una vez que entra",             value: 4 },
      { label: "Con frecuencia me desborda o lo bloqueo para poder seguir",         value: 5 },
    ],
  },
  {
    id: "h6", eje: 2, tipo: "likert",
    texto: "¿Con qué frecuencia tu mente está en otro lado — sin poder estar presente en lo que estás haciendo?",
    opciones: LIKERT_OPCIONES,
  },

  // ── EJE 3: ESPÍRITU (4 preguntas · máx 20pts) ────────────────────
  {
    id: "h7", eje: 3, tipo: "opciones",
    texto: "¿Sientes que tu vida — no solo tu trabajo, sino tu vida — tiene una dirección que tiene sentido para ti?",
    opciones: [
      { label: "Sí — hay un hilo que conecta lo que hago con lo que quiero",                    value: 1 },
      { label: "En parte — algunos aspectos sí, otros se sienten a la deriva",                  value: 2 },
      { label: "Hay momentos donde lo siento, pero no es constante",                            value: 3 },
      { label: "Con frecuencia siento que estoy cumpliendo más que viviendo",                   value: 4 },
      { label: "Hay una desconexión que llevo tiempo sintiendo y no he sabido nombrar",         value: 5 },
    ],
  },
  {
    id: "h8", eje: 3, tipo: "opciones",
    texto: "¿Hay algo en tu vida — una actividad, una relación, una práctica — que genuinamente te recargue, no solo que te distraiga?",
    opciones: [
      { label: "Sí, y lo tengo presente en mi vida con regularidad",              value: 1 },
      { label: "Sí, aunque últimamente le doy menos espacio del que quisiera",    value: 2 },
      { label: "Lo tenía, pero lo he ido dejando ir",                             value: 3 },
      { label: "No estoy seguro/a de qué es lo que me recarga realmente",         value: 5 },
    ],
  },
  {
    id: "h9", eje: 3, tipo: "likert",
    texto: "¿Con qué frecuencia sientes que te falta conexión real — con personas, con algo que te importa, con la vida que estás viviendo?",
    opciones: LIKERT_OPCIONES,
  },
  {
    id: "h10", eje: 3, tipo: "opciones",
    texto: "Si pudieras cambiar una sola cosa de cómo estás viviendo ahora mismo — no en el trabajo, sino en tu vida — ¿qué área elegirías?",
    opciones: [
      { label: "Nada urgente — estoy en un buen momento",                          value: 1 },
      { label: "Cómo cuido mi cuerpo y mi energía",                               value: 2 },
      { label: "Cómo manejo mis emociones y mi mente",                            value: 3 },
      { label: "La calidad de mis relaciones o conexiones",                        value: 4 },
      { label: "El sentido de lo que estoy haciendo con mi vida",                  value: 5 },
    ],
  },
];
