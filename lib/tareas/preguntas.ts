export type Letra = 'A' | 'B' | 'C' | 'D';

export interface Opcion {
  letra:  Letra;
  texto:  string;
  valor:  string;
}

export interface Pregunta {
  id:        string;
  pregunta:  string;
  variable:  'emocion' | 'tiempo' | 'tono' | 'motivacional';
  opciones:  Opcion[];
}

// ─── ONBOARDING (6 preguntas fijas) ────────────────────────────────────────

export const PREGUNTAS_ONBOARDING: Pregunta[] = [
  {
    id: 'ob_q1',
    pregunta: '¿Cómo describes tu energía esta semana?',
    variable: 'emocion',
    opciones: [
      { letra: 'A', texto: 'Estable. Puedo seguir mi ritmo sin problema.', valor: 'mantenimiento' },
      { letra: 'B', texto: 'Dispersa. Pensamientos que no paran.', valor: 'ansiedad' },
      { letra: 'C', texto: 'Tensa. Presiones acumuladas que no ceden.', valor: 'estrés' },
      { letra: 'D', texto: 'Agotada. Sin reservas, todo cuesta mucho.', valor: 'burnout' },
    ],
  },
  {
    id: 'ob_q2',
    pregunta: '¿Cómo has dormido los últimos días?',
    variable: 'emocion',
    opciones: [
      { letra: 'A', texto: 'Bien. Descanso suficiente y me levanto bien.', valor: 'mantenimiento' },
      { letra: 'B', texto: 'Con vueltas. La mente no para aunque quiero dormir.', valor: 'ansiedad' },
      { letra: 'C', texto: 'Con dificultad para apagar el modo trabajo.', valor: 'estrés' },
      { letra: 'D', texto: 'Mal. Me despierto igual de cansado/a.', valor: 'burnout' },
    ],
  },
  {
    id: 'ob_q3',
    pregunta: '¿Cuánto tiempo puedes dedicar a tu bienestar cada día?',
    variable: 'tiempo',
    opciones: [
      { letra: 'A', texto: '5 minutos. Poco, pero constante.', valor: '5min' },
      { letra: 'B', texto: '10 minutos. Puedo encontrar ese espacio.', valor: '10min' },
      { letra: 'C', texto: '15 minutos. Tengo ese rato si me organizo.', valor: '15min' },
      { letra: 'D', texto: '20 minutos o más. Quiero comprometido.', valor: '20min+' },
    ],
  },
  {
    id: 'ob_q4',
    pregunta: '¿Qué tipo de actividad te llama más en este momento?',
    variable: 'tono',
    opciones: [
      { letra: 'A', texto: 'Algo concreto que pueda hacer y medir.', valor: 'acción' },
      { letra: 'B', texto: 'Algo para explorar y reflexionar sobre mí.', valor: 'exploratorio' },
      { letra: 'C', texto: 'Algo que me ayude a soltar tensión y descansar.', valor: 'restaurativo' },
      { letra: 'D', texto: 'Algo profundo que me mueva por dentro.', valor: 'profundo' },
    ],
  },
  {
    id: 'ob_q5',
    pregunta: '¿Qué te motiva más cuando emprendes algo nuevo?',
    variable: 'motivacional',
    opciones: [
      { letra: 'A', texto: 'Ver resultados tangibles rápido.', valor: 'pragmático' },
      { letra: 'B', texto: 'Entenderme mejor a mí mismo/a.', valor: 'introspectivo' },
      { letra: 'C', texto: 'Sentirme parte de algo o conectar con otros.', valor: 'comunitario' },
      { letra: 'D', texto: 'Superar mis propios límites.', valor: 'competitivo' },
    ],
  },
  {
    id: 'ob_q6',
    pregunta: 'Cuando algo se pone difícil, ¿qué te mantiene?',
    variable: 'motivacional',
    opciones: [
      { letra: 'A', texto: 'Saber que tiene un propósito práctico.', valor: 'pragmático' },
      { letra: 'B', texto: 'Escucharme y darme el espacio que necesito.', valor: 'introspectivo' },
      { letra: 'C', texto: 'Pensar en los que me rodean.', valor: 'comunitario' },
      { letra: 'D', texto: 'No querer rendirme.', valor: 'competitivo' },
    ],
  },
];

// ─── WEEKLY CHECK-IN (pools × slots × 2 variantes c/u) ─────────────────────

interface SemanaSlot {
  motivacional: Pregunta[];
  emocion_1:    Pregunta[];
  emocion_2:    Pregunta[];
  tiempo:       Pregunta[];
}

export const PREGUNTAS_SEMANA: Record<'ligero' | 'medio' | 'profundo', SemanaSlot> = {

  ligero: {
    motivacional: [
      {
        id: 'lig_mot_a',
        pregunta: 'Esta semana, ¿qué tipo de práctica de bienestar te llama más?',
        variable: 'motivacional',
        opciones: [
          { letra: 'A', texto: 'Algo que mejore mi rendimiento diario.', valor: 'pragmático' },
          { letra: 'B', texto: 'Un momento de introspección tranquila.', valor: 'introspectivo' },
          { letra: 'C', texto: 'Algo que me conecte con mi entorno.', valor: 'comunitario' },
          { letra: 'D', texto: 'Algo que me lleve un paso más allá.', valor: 'competitivo' },
        ],
      },
      {
        id: 'lig_mot_b',
        pregunta: '¿Cómo prefieres medir tu progreso esta semana?',
        variable: 'motivacional',
        opciones: [
          { letra: 'A', texto: 'Con hábitos concretos completados.', valor: 'pragmático' },
          { letra: 'B', texto: 'Sintiendo mayor claridad interior.', valor: 'introspectivo' },
          { letra: 'C', texto: 'Mejorando mis relaciones y entorno.', valor: 'comunitario' },
          { letra: 'D', texto: 'Superando mi marca de la semana pasada.', valor: 'competitivo' },
        ],
      },
    ],
    emocion_1: [
      {
        id: 'lig_em1_a',
        pregunta: '¿Cómo te has sentido en general esta semana?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'En equilibrio, sin grandes altibajos.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Con algo de ruido mental de fondo.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Con alguna presión acumulada.', valor: 'estrés' },
          { letra: 'D', texto: 'Cansado/a aunque haya descansado.', valor: 'burnout' },
        ],
      },
      {
        id: 'lig_em1_b',
        pregunta: '¿Cómo describes tu estado mental al despertar?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Claro y dispuesto/a para el día.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Algo acelerado, ya pensando en todo.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Tenso/a, con el modo trabajo encendido.', valor: 'estrés' },
          { letra: 'D', texto: 'Pesado/a, sin ganas de empezar.', valor: 'burnout' },
        ],
      },
    ],
    emocion_2: [
      {
        id: 'lig_em2_a',
        pregunta: '¿Tu energía durante el día es...?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Constante y fluida.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Irregular, con picos y caídas de ánimo.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Tensa en ciertos momentos del día.', valor: 'estrés' },
          { letra: 'D', texto: 'Baja en general, casi sin reservas.', valor: 'burnout' },
        ],
      },
      {
        id: 'lig_em2_b',
        pregunta: '¿Cómo te relacionas con tus responsabilidades esta semana?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Las manejo con calma y orden.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Me preocupan aunque las esté cumpliendo.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Siento que son muchas y no ceden.', valor: 'estrés' },
          { letra: 'D', texto: 'Me cuestan el doble de lo normal.', valor: 'burnout' },
        ],
      },
    ],
    tiempo: [
      {
        id: 'lig_tpo_a',
        pregunta: '¿Cuánto tiempo tienes esta semana para tu bienestar?',
        variable: 'tiempo',
        opciones: [
          { letra: 'A', texto: '5 minutos diarios.', valor: '5min' },
          { letra: 'B', texto: '10 minutos, puedo organizarlo.', valor: '10min' },
          { letra: 'C', texto: '15 minutos con algo de planificación.', valor: '15min' },
          { letra: 'D', texto: '20+ minutos, quiero profundizar.', valor: '20min+' },
        ],
      },
      {
        id: 'lig_tpo_b',
        pregunta: '¿Cuál es tu intención principal esta semana?',
        variable: 'tiempo',
        opciones: [
          { letra: 'A', texto: 'Mantener algo breve pero constante.', valor: '5min' },
          { letra: 'B', texto: 'Tener un espacio moderado para mí.', valor: '10min' },
          { letra: 'C', texto: 'Profundizar un poco más que la semana pasada.', valor: '15min' },
          { letra: 'D', texto: 'Hacer de esto una práctica seria.', valor: '20min+' },
        ],
      },
    ],
  },

  medio: {
    motivacional: [
      {
        id: 'med_mot_a',
        pregunta: 'Dado cómo te has sentido, ¿qué tipo de apoyo necesitas esta semana?',
        variable: 'motivacional',
        opciones: [
          { letra: 'A', texto: 'Herramientas prácticas que funcionen ya.', valor: 'pragmático' },
          { letra: 'B', texto: 'Espacio para entender qué me pasa.', valor: 'introspectivo' },
          { letra: 'C', texto: 'Sentir que no estoy solo/a en esto.', valor: 'comunitario' },
          { letra: 'D', texto: 'Recuperar el control de mi situación.', valor: 'competitivo' },
        ],
      },
      {
        id: 'med_mot_b',
        pregunta: '¿Qué te daría más alivio esta semana?',
        variable: 'motivacional',
        opciones: [
          { letra: 'A', texto: 'Completar algo tangible cada día.', valor: 'pragmático' },
          { letra: 'B', texto: 'Momentos de silencio y comprensión propia.', valor: 'introspectivo' },
          { letra: 'C', texto: 'Conectar genuinamente con alguien.', valor: 'comunitario' },
          { letra: 'D', texto: 'Sentir que avanzo aunque sea poco.', valor: 'competitivo' },
        ],
      },
    ],
    emocion_1: [
      {
        id: 'med_em1_a',
        pregunta: '¿Cómo describirías tu estado emocional esta semana?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Algo más estable que la semana pasada.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Con pensamientos que me dan vueltas.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Bajo presión constante.', valor: 'estrés' },
          { letra: 'D', texto: 'Agotado/a, sin energía de sobra.', valor: 'burnout' },
        ],
      },
      {
        id: 'med_em1_b',
        pregunta: '¿Cómo reaccionas a los imprevistos esta semana?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Con calma, los manejo bien.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Me alteran más de lo que quisiera.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Se acumulan y me saturan.', valor: 'estrés' },
          { letra: 'D', texto: 'Apenas tengo recursos para ellos.', valor: 'burnout' },
        ],
      },
    ],
    emocion_2: [
      {
        id: 'med_em2_a',
        pregunta: '¿Cómo es tu diálogo interno estos días?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Amable, me trato bien.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Acelerado, con muchos "y si..."', valor: 'ansiedad' },
          { letra: 'C', texto: 'Exigente, siempre hay algo más por hacer.', valor: 'estrés' },
          { letra: 'D', texto: 'Apagado, con poca motivación.', valor: 'burnout' },
        ],
      },
      {
        id: 'med_em2_b',
        pregunta: '¿Cómo duermes actualmente?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Bien, me despierto descansado/a.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Con dificultad para apagar la mente.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Interrumpido o insuficiente.', valor: 'estrés' },
          { letra: 'D', texto: 'Mal. El descanso no me recupera.', valor: 'burnout' },
        ],
      },
    ],
    tiempo: [
      {
        id: 'med_tpo_a',
        pregunta: '¿Con qué intención quieres trabajar esta semana?',
        variable: 'tiempo',
        opciones: [
          { letra: 'A', texto: '5 min: algo breve pero que me alivie.', valor: '5min' },
          { letra: 'B', texto: '10 min: un espacio real para mí.', valor: '10min' },
          { letra: 'C', texto: '15 min: quiero trabajarlo con más calma.', valor: '15min' },
          { letra: 'D', texto: '20+ min: necesito profundizar de verdad.', valor: '20min+' },
        ],
      },
      {
        id: 'med_tpo_b',
        pregunta: '¿Qué ritmo puedes sostener esta semana?',
        variable: 'tiempo',
        opciones: [
          { letra: 'A', texto: 'Micro-pausas, poco pero constante.', valor: '5min' },
          { letra: 'B', texto: 'Un rato moderado por las mañanas o noches.', valor: '10min' },
          { letra: 'C', texto: 'Un bloque de tiempo real cada día.', valor: '15min' },
          { letra: 'D', texto: 'Una sesión larga diaria.', valor: '20min+' },
        ],
      },
    ],
  },

  profundo: {
    motivacional: [
      {
        id: 'pro_mot_a',
        pregunta: 'En este momento de agotamiento profundo, ¿qué sientes que necesitas?',
        variable: 'motivacional',
        opciones: [
          { letra: 'A', texto: 'Algo concreto que me dé resultados rápidos.', valor: 'pragmático' },
          { letra: 'B', texto: 'Espacio para entender qué me trajo aquí.', valor: 'introspectivo' },
          { letra: 'C', texto: 'Sentir que no tengo que hacerlo solo/a.', valor: 'comunitario' },
          { letra: 'D', texto: 'Recuperar algo de control.', valor: 'competitivo' },
        ],
      },
      {
        id: 'pro_mot_b',
        pregunta: '¿Qué tipo de logro te daría más fuerza ahora mismo?',
        variable: 'motivacional',
        opciones: [
          { letra: 'A', texto: 'Completar una pequeña tarea práctica.', valor: 'pragmático' },
          { letra: 'B', texto: 'Entenderme un poco mejor.', valor: 'introspectivo' },
          { letra: 'C', texto: 'Conectar con alguien de forma real.', valor: 'comunitario' },
          { letra: 'D', texto: 'Sobrevivir el día y saber que puedo.', valor: 'competitivo' },
        ],
      },
    ],
    emocion_1: [
      {
        id: 'pro_em1_a',
        pregunta: '¿Cómo está tu energía esta semana?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Algo mejor, noto una pequeña mejoría.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Con mucho ruido mental y preocupación.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Bajo presión intensa, sin respiro.', valor: 'estrés' },
          { letra: 'D', texto: 'Igual o peor. Muy agotado/a.', valor: 'burnout' },
        ],
      },
      {
        id: 'pro_em1_b',
        pregunta: '¿Qué tan presente te sientes en tu propio cuerpo?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Bastante conectado/a.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'En la cabeza, poco en el cuerpo.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Tenso/a físicamente, cargado/a.', valor: 'estrés' },
          { letra: 'D', texto: 'Desconectado/a. Casi no lo siento.', valor: 'burnout' },
        ],
      },
    ],
    emocion_2: [
      {
        id: 'pro_em2_a',
        pregunta: '¿Qué tan difícil es hacer cosas básicas?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'No me cuesta, fluyo bien.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Me cuestan más cuando estoy preocupado/a.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Todo requiere más esfuerzo del normal.', valor: 'estrés' },
          { letra: 'D', texto: 'Hasta las cosas simples me pesan.', valor: 'burnout' },
        ],
      },
      {
        id: 'pro_em2_b',
        pregunta: '¿Cómo te sientes respecto a la semana que viene?',
        variable: 'emocion',
        opciones: [
          { letra: 'A', texto: 'Con calma y algo de ilusión.', valor: 'mantenimiento' },
          { letra: 'B', texto: 'Con incertidumbre y algo de miedo.', valor: 'ansiedad' },
          { letra: 'C', texto: 'Abrumado/a solo de pensarlo.', valor: 'estrés' },
          { letra: 'D', texto: 'Sin energía para anticipar nada.', valor: 'burnout' },
        ],
      },
    ],
    tiempo: [
      {
        id: 'pro_tpo_a',
        pregunta: '¿Cuánto puedes comprometerte esta semana con tu bienestar?',
        variable: 'tiempo',
        opciones: [
          { letra: 'A', texto: '5 min. Es lo máximo que puedo ahora.', valor: '5min' },
          { letra: 'B', texto: '10 min. Puedo encontrar ese rato.', valor: '10min' },
          { letra: 'C', texto: '15 min si me organizo.', valor: '15min' },
          { letra: 'D', texto: '20+ min. Quiero priorizar esto.', valor: '20min+' },
        ],
      },
      {
        id: 'pro_tpo_b',
        pregunta: '¿Qué tono quieres para tus prácticas esta semana?',
        variable: 'tiempo',
        opciones: [
          { letra: 'A', texto: 'Mínimo y sostenible. No quiero más presión.', valor: '5min' },
          { letra: 'B', texto: 'Moderado y gentil con mis límites.', valor: '10min' },
          { letra: 'C', texto: 'Con algo de profundidad cuando pueda.', valor: '15min' },
          { letra: 'D', texto: 'Comprometido. Quiero salir de esto.', valor: '20min+' },
        ],
      },
    ],
  },
};
