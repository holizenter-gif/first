import { PreguntaQuiz } from "./preguntas-burnout";

// Preguntas del quiz de estrés (legacy — se reemplazarán en Prompt Quiz 2)
// Se usan eje:1 y tipo:"opciones" como placeholder hasta actualización
export const PREGUNTAS_ESTRES: PreguntaQuiz[] = [
  { id: "e1", eje: 1, tipo: "opciones", texto: "¿Con qué frecuencia sientes que tienes demasiado trabajo y poco tiempo para completarlo?",
    opciones: [{ label: "Rara vez", value: 1 }, { label: "Algunas veces al mes", value: 2 }, { label: "Varias veces a la semana", value: 4 }, { label: "Todos los días", value: 5 }] },
  { id: "e2", eje: 1, tipo: "opciones", texto: "¿Cómo describes tu calidad de sueño en los últimos 3 meses?",
    opciones: [{ label: "Excelente, descanso bien", value: 1 }, { label: "Regular, con noches difíciles ocasionales", value: 2 }, { label: "Mala, frecuentemente despierto cansado", value: 4 }, { label: "Muy mala, insomnio frecuente", value: 5 }] },
  { id: "e3", eje: 1, tipo: "opciones", texto: "¿Puedes desconectarte del trabajo durante tu tiempo libre?",
    opciones: [{ label: "Sí, logro desconectarme completamente", value: 1 }, { label: "Mayormente sí, con algunos pensamientos", value: 2 }, { label: "Me cuesta mucho desconectarme", value: 4 }, { label: "Nunca logro desconectarme", value: 5 }] },
  { id: "e4", eje: 1, tipo: "opciones", texto: "¿Con qué frecuencia experimentas síntomas físicos relacionados al estrés?",
    opciones: [{ label: "Muy rara vez", value: 1 }, { label: "Una o dos veces al mes", value: 2 }, { label: "Varias veces a la semana", value: 4 }, { label: "Diariamente", value: 5 }] },
  { id: "e5", eje: 2, tipo: "opciones", texto: "¿Cómo es tu nivel de energía durante la jornada laboral?",
    opciones: [{ label: "Alto y sostenido durante el día", value: 1 }, { label: "Baja hacia el final del día", value: 2 }, { label: "Bajo la mayor parte del día", value: 4 }, { label: "Me siento agotado desde el inicio", value: 5 }] },
  { id: "e6", eje: 2, tipo: "opciones", texto: "¿Con qué frecuencia sientes irritabilidad o cambios de humor relacionados al trabajo?",
    opciones: [{ label: "Rara vez", value: 1 }, { label: "Ocasionalmente", value: 2 }, { label: "Frecuentemente", value: 4 }, { label: "Es mi estado habitual", value: 5 }] },
  { id: "e7", eje: 3, tipo: "opciones", texto: "¿Realizas actividades de autocuidado regularmente?",
    opciones: [{ label: "Sí, tengo rutinas establecidas", value: 1 }, { label: "Ocasionalmente cuando tengo tiempo", value: 2 }, { label: "Casi nunca por falta de tiempo", value: 4 }, { label: "No tengo ninguna práctica de autocuidado", value: 5 }] },
  { id: "e8", eje: 3, tipo: "opciones", texto: "¿Cómo describes tu capacidad de concentración en el trabajo?",
    opciones: [{ label: "Excelente, me enfoco fácilmente", value: 1 }, { label: "Buena, con distracciones ocasionales", value: 2 }, { label: "Me cuesta mantener el foco", value: 4 }, { label: "Muy difícil concentrarme", value: 5 }] },
];
