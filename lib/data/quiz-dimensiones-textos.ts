export interface TextoDimension {
  manejable: string;
  acumulado:  string;
  critico:    string;
}

export interface TextosDimensiones {
  [dimension: string]: TextoDimension;
}

export const TEXTOS_DIMENSIONES: Record<string, TextosDimensiones> = {

  burnout: {
    agotamiento: {
      manejable: "Sugiere la presencia ocasional de fatiga o desgaste laboral, que puede manifestarse en disminución de energía, dificultad para concentrarse o sensación de saturación en momentos de alta demanda.",
      acumulado:  "Indica la presencia frecuente de fatiga física, mental o emocional asociada al trabajo. La persona puede experimentar sensación de sobrecarga, dificultad para mantener la concentración o disminución de la motivación debido al cansancio acumulado.",
      critico:    "Sugiere un nivel significativo de agotamiento laboral que puede afectar directamente la salud, el bienestar y el desempeño. Existe un riesgo elevado de desarrollar síndrome de burnout si no se implementan medidas de intervención oportunas.",
    },
    desconexion: {
      manejable: "Indica que la persona generalmente mantiene compromiso con su trabajo, aunque puede experimentar momentos de desmotivación, distanciamiento emocional o menor entusiasmo en ciertas actividades.",
      acumulado:  "Indica una disminución significativa en el vínculo emocional con el trabajo. La persona puede experimentar desmotivación, indiferencia hacia las tareas o una sensación de distanciamiento respecto a la organización o su rol.",
      critico:    "Refleja un nivel elevado de desconexión laboral, caracterizado por desapego emocional, desinterés persistente y posible rechazo hacia el trabajo. Este nivel puede afectar significativamente la calidad del desempeño y la permanencia en la organización.",
    },
    recursos: {
      manejable: "Indica que la persona percibe contar con recursos suficientes y apoyo adecuado para desempeñar su trabajo de manera efectiva. Existen condiciones organizacionales que facilitan el cumplimiento de las tareas y promueven el bienestar laboral.",
      acumulado:  "Sugiere la presencia de limitaciones relevantes en los recursos o en el apoyo organizacional disponible. La persona puede experimentar dificultades para cumplir sus responsabilidades debido a falta de herramientas, tiempo, orientación o acompañamiento.",
      critico:    "Indica una percepción significativa de carencia de recursos o soporte organizacional. Esta situación puede generar frustración, sensación de abandono laboral y un alto riesgo de errores, desgaste o deterioro del desempeño.",
    },
  },

  estres: {
    carga: {
      manejable: "Indica que la persona percibe que las exigencias laborales son razonables y compatibles con sus capacidades y recursos. La cantidad de trabajo, los plazos y el ritmo de las tareas se mantienen dentro de límites que permiten responder de manera efectiva sin generar un desgaste significativo.",
      acumulado:  "Sugiere que las demandas laborales comienzan a superar la capacidad habitual de respuesta de la persona. Este nivel refleja un estrés en desarrollo, donde la acumulación de exigencias puede generar fatiga progresiva si no se realizan ajustes en la carga laboral o en la gestión del trabajo.",
      critico:    "Indica que las demandas laborales son percibidas como excesivas o sostenidamente altas, generando una presión significativa sobre la persona. Este nivel puede afectar el desempeño, la salud y el bienestar general, y representa un riesgo elevado de estrés laboral intenso o burnout.",
    },
    control: {
      manejable: "Indica que la persona percibe un adecuado nivel de control sobre su trabajo. Tiene la posibilidad de organizar sus tareas, tomar decisiones y gestionar su tiempo de manera efectiva, lo que facilita el manejo de las exigencias laborales y reduce la percepción de estrés.",
      acumulado:  "Sugiere que la persona experimenta limitaciones en su capacidad de decisión o en la gestión de su trabajo. Esta situación puede aumentar la sensación de presión y disminuir la capacidad de adaptación frente a las demandas laborales.",
      critico:    "Indica una percepción significativa de falta de control o autonomía en el trabajo. Este nivel representa un riesgo alto para el bienestar psicológico y la satisfacción laboral.",
    },
    soporte: {
      manejable: "Indica que la persona percibe contar con apoyo suficiente por parte de su organización, jefatura o equipo de trabajo. Existe disponibilidad de ayuda, comunicación efectiva y acceso a recursos necesarios para desempeñar sus funciones. Este nivel actúa como un factor protector frente al estrés laboral.",
      acumulado:  "Sugiere que el apoyo organizacional es percibido como insuficiente o inconsistente. Este nivel puede aumentar la sensación de aislamiento laboral y contribuir al desarrollo de estrés.",
      critico:    "Indica una percepción significativa de falta de apoyo organizacional. Este nivel requiere atención prioritaria, ya que puede afectar el bienestar, el desempeño y la permanencia en la organización.",
    },
  },

  satisfaccion: {
    proposito: {
      manejable: "Indica que la persona experimenta un alto nivel de satisfacción respecto al sentido y valor de su trabajo. Percibe que sus actividades tienen relevancia, que contribuyen a objetivos importantes y que su rol genera impacto en la organización o en otras personas.",
      acumulado:  "Sugiere que la persona puede experimentar dudas ocasionales respecto al significado o impacto de su trabajo. Aunque reconoce la importancia de sus funciones, puede sentir que sus tareas son rutinarias, poco visibles o desconectadas de objetivos mayores.",
      critico:    "Indica una percepción significativa de falta de sentido o significado en el trabajo. La persona puede experimentar desmotivación persistente, baja identificación con su rol o dificultad para encontrar valor en sus actividades laborales.",
    },
    crecimiento: {
      manejable: "Indica que la persona percibe oportunidades adecuadas para aprender, desarrollarse y fortalecer sus habilidades en el trabajo. Este nivel refleja una sensación positiva de progreso y dominio de las competencias laborales.",
      acumulado:  "Sugiere que las oportunidades de crecimiento o desarrollo pueden ser percibidas como limitadas o irregulares. Este nivel puede generar una disminución gradual en la motivación y el compromiso laboral.",
      critico:    "Indica una percepción significativa de falta de oportunidades de desarrollo o de reconocimiento de las propias capacidades. Este nivel representa un riesgo alto para la satisfacción laboral y la permanencia en la organización.",
    },
    conexion: {
      manejable: "Indica que la persona experimenta relaciones laborales positivas y un sentido de pertenencia dentro de su equipo u organización. Existe confianza, colaboración y comunicación efectiva, lo que contribuye a un ambiente laboral satisfactorio.",
      acumulado:  "Sugiere que las relaciones laborales pueden ser funcionales, pero no necesariamente cercanas o satisfactorias. La persona puede experimentar dificultades ocasionales de comunicación, baja integración con el equipo o escasa interacción social significativa.",
      critico:    "Indica una percepción significativa de dificultades en las relaciones laborales o falta de conexión con el equipo u organización. La persona puede experimentar conflictos, aislamiento o sensación de no pertenecer al entorno laboral.",
    },
  },

  clima: {
    liderazgo: {
      manejable: "Indica que la persona percibe un liderazgo claro, accesible y coherente. Las jefaturas comunican expectativas de manera efectiva, brindan orientación y apoyo cuando se requiere, y promueven un ambiente de trabajo respetuoso y organizado.",
      acumulado:  "Sugiere que el liderazgo puede ser percibido como inconsistente o poco visible en algunas situaciones. La comunicación puede no ser siempre clara, o el apoyo puede variar según el contexto o la carga laboral.",
      critico:    "Indica una percepción significativa de dificultades en el liderazgo. La persona puede experimentar falta de dirección, comunicación deficiente o escaso apoyo por parte de la jefatura, lo que puede afectar la confianza y la coordinación del trabajo.",
    },
    carga_control: {
      manejable: "Indica que la persona percibe un equilibrio adecuado entre las exigencias laborales y el grado de control sobre su trabajo. Las tareas son manejables, existe claridad en las prioridades y se dispone de suficiente autonomía para organizar las responsabilidades.",
      acumulado:  "Sugiere que las demandas laborales pueden comenzar a superar la capacidad de gestión disponible. La persona puede experimentar presión por cumplir plazos o dificultad para priorizar tareas, especialmente en periodos de alta carga.",
      critico:    "Indica que la carga laboral es percibida como excesiva y que el control sobre el trabajo es limitado. La persona puede sentirse saturada, con escasa capacidad de decisión o con dificultades para cumplir sus responsabilidades dentro de los tiempos disponibles.",
    },
    ambiente: {
      manejable: "Indica que las condiciones de trabajo son adecuadas para el desempeño de las funciones. El entorno físico, los recursos disponibles y las herramientas laborales permiten realizar las tareas de manera segura y eficiente.",
      acumulado:  "Sugiere que las condiciones de trabajo pueden presentar limitaciones que afectan la eficiencia o la comodidad laboral. Pueden existir fallas en los recursos, interrupciones frecuentes o condiciones físicas que dificultan el desempeño óptimo.",
      critico:    "Indica que las condiciones de trabajo son percibidas como inadecuadas o deficientes. La falta de recursos, herramientas o condiciones físicas apropiadas puede afectar directamente el desempeño y el bienestar de la persona.",
    },
    relaciones: {
      manejable: "Indica que las relaciones laborales son positivas y que existe un buen nivel de colaboración dentro del equipo. La comunicación es respetuosa y las personas se sienten integradas en su entorno laboral.",
      acumulado:  "Sugiere que las relaciones laborales pueden ser funcionales, pero presentan tensiones ocasionales o falta de integración. La colaboración puede ser limitada o depender de situaciones específicas.",
      critico:    "Indica una percepción significativa de conflictos, falta de colaboración o escasa cohesión dentro del equipo. Este nivel representa un riesgo alto para el clima organizacional.",
    },
    equilibrio: {
      manejable: "Indica que la persona logra mantener un equilibrio adecuado entre sus responsabilidades laborales y su vida personal. Este nivel favorece el bienestar integral y la satisfacción laboral.",
      acumulado:  "Sugiere que el trabajo puede comenzar a interferir con la vida personal. Este nivel indica un riesgo creciente de fatiga y estrés.",
      critico:    "Indica que las responsabilidades laborales interfieren significativamente con la vida personal. Este nivel representa un riesgo alto para el bienestar y la sostenibilidad laboral.",
    },
  },

  holistico: {
    cuerpo: {
      manejable: "Indica que la persona mantiene un estado físico adecuado y hábitos de salud que favorecen su bienestar general. Este nivel refleja una relación positiva con el cuidado del cuerpo y la salud.",
      acumulado:  "Sugiere que pueden existir señales de desgaste físico o hábitos de salud irregulares. Este nivel indica un desgaste progresivo que, si se mantiene en el tiempo, puede afectar el bienestar general y el rendimiento cotidiano.",
      critico:    "Indica un deterioro significativo en el bienestar físico o en los hábitos de salud. Este nivel requiere atención prioritaria para prevenir afectaciones mayores en la salud y el bienestar.",
    },
    mente: {
      manejable: "Indica que la persona mantiene un estado emocional y mental estable. Este nivel refleja una buena capacidad de regulación emocional y adaptación.",
      acumulado:  "Sugiere la presencia de tensión mental o emocional que puede manifestarse en preocupaciones frecuentes, dificultad para concentrarse o sensación de saturación mental. Este nivel indica un desgaste psicológico progresivo.",
      critico:    "Indica un nivel elevado de tensión mental o emocional que puede afectar el bienestar general y la capacidad de funcionamiento diario. Este nivel representa un riesgo alto para la salud mental y requiere atención o apoyo oportuno.",
    },
    espiritu: {
      manejable: "Indica que la persona mantiene una sensación de propósito, coherencia personal y conexión con sus valores. Este nivel favorece la motivación, la resiliencia y el bienestar integral.",
      acumulado:  "Sugiere que la persona puede experimentar momentos de desconexión con su propósito o con lo que considera importante en su vida. Este nivel indica una disminución gradual en el sentido de significado personal.",
      critico:    "Indica una percepción significativa de vacío de sentido, desconexión con los propios valores o falta de dirección personal. Este nivel representa un riesgo alto para el bienestar integral y la motivación personal.",
    },
  },
};

// Maps quiz label strings (from scoring files) to dimension keys in TEXTOS_DIMENSIONES
const LABEL_TO_DIM_ID: Record<string, string> = {
  // burnout
  "agotamiento":          "agotamiento",
  "desconexión":          "desconexion",
  "recursos y soporte":   "recursos",
  // estres
  "carga y demandas":     "carga",
  "control y autonomía":  "control",
  "soporte organizacional": "soporte",
  // satisfaccion
  "propósito y significado":   "proposito",
  "crecimiento y competencia": "crecimiento",
  "conexión y relaciones":     "conexion",
  // clima
  "liderazgo":                 "liderazgo",
  "carga y control":           "carga_control",
  "ambiente y condiciones":    "ambiente",
  "relaciones y cohesión":     "relaciones",
  "equilibrio vida-trabajo":   "equilibrio",
  // holistico
  "cuerpo":    "cuerpo",
  "mente":     "mente",
  "espíritu":  "espiritu",
};

export function getTextoDimension(
  quiz_id:   string,
  dimension: string,
  pct:       number
): string {
  const textos = TEXTOS_DIMENSIONES[quiz_id]?.[dimension];
  if (!textos) return "";
  if (pct <= 40) return textos.manejable;
  if (pct <= 70) return textos.acumulado;
  return textos.critico;
}

/** Lookup by the human-readable label used in EjeScore (e.g. "Agotamiento"). */
export function getTextoDimensionByLabel(
  quiz_id: string,
  label:   string,
  pct:     number
): string {
  const dim_id = LABEL_TO_DIM_ID[label.toLowerCase()] ?? "";
  return getTextoDimension(quiz_id, dim_id, pct);
}

export function getLabelNivel(pct: number): string {
  if (pct <= 40) return "Manejable";
  if (pct <= 70) return "Acumulado";
  return "Crítico";
}

export function getColorNivel(pct: number): string {
  if (pct <= 40) return "#5CB996";
  if (pct <= 70) return "#F59E0B";
  return "#EF4444";
}
