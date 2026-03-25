import { PreguntaQuiz } from "./preguntas-burnout";

export const PREGUNTAS_ESTRES: PreguntaQuiz[] = [
  { id: "e1", texto: "¿Con qué frecuencia sientes que tienes demasiado trabajo y poco tiempo para completarlo?", categoria: "estres",
    opciones: [{ label: "Rara vez", value: 10 }, { label: "Algunas veces al mes", value: 7 }, { label: "Varias veces a la semana", value: 4 }, { label: "Todos los días", value: 1 }] },
  { id: "e2", texto: "¿Cómo describes tu calidad de sueño en los últimos 3 meses?", categoria: "estres",
    opciones: [{ label: "Excelente, descanso bien", value: 10 }, { label: "Regular, con noches difíciles ocasionales", value: 7 }, { label: "Mala, frecuentemente despierto cansado", value: 4 }, { label: "Muy mala, insomnio frecuente", value: 1 }] },
  { id: "e3", texto: "¿Puedes desconectarte del trabajo durante tu tiempo libre?", categoria: "estres",
    opciones: [{ label: "Sí, logro desconectarme completamente", value: 10 }, { label: "Mayormente sí, con algunos pensamientos de trabajo", value: 7 }, { label: "Me cuesta mucho desconectarme", value: 4 }, { label: "Nunca logro desconectarme", value: 1 }] },
  { id: "e4", texto: "¿Con qué frecuencia experimentas síntomas físicos relacionados al estrés?", categoria: "estres",
    opciones: [{ label: "Muy rara vez", value: 10 }, { label: "Una o dos veces al mes", value: 7 }, { label: "Varias veces a la semana", value: 4 }, { label: "Diariamente", value: 1 }] },
  { id: "e5", texto: "¿Cómo es tu nivel de energía durante la jornada laboral?", categoria: "estres",
    opciones: [{ label: "Alto y sostenido durante el día", value: 10 }, { label: "Baja hacia el final del día", value: 7 }, { label: "Bajo la mayor parte del día", value: 4 }, { label: "Me siento agotado desde el inicio", value: 1 }] },
  { id: "e6", texto: "¿Con qué frecuencia sientes irritabilidad o cambios de humor relacionados al trabajo?", categoria: "clima",
    opciones: [{ label: "Rara vez", value: 10 }, { label: "Ocasionalmente", value: 7 }, { label: "Frecuentemente", value: 4 }, { label: "Es mi estado habitual", value: 1 }] },
  { id: "e7", texto: "¿Realizas actividades de autocuidado regularmente (ejercicio, meditación, hobbies)?", categoria: "clima",
    opciones: [{ label: "Sí, tengo rutinas establecidas", value: 10 }, { label: "Ocasionalmente cuando tengo tiempo", value: 7 }, { label: "Casi nunca por falta de tiempo o energía", value: 4 }, { label: "No tengo ninguna práctica de autocuidado", value: 1 }] },
  { id: "e8", texto: "¿Cómo describes tu capacidad de concentración en el trabajo?", categoria: "estres",
    opciones: [{ label: "Excelente, me enfoco fácilmente", value: 10 }, { label: "Buena, con distracciones ocasionales", value: 7 }, { label: "Me cuesta mantener el foco", value: 4 }, { label: "Muy difícil concentrarme", value: 1 }] },
];
