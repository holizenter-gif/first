export interface Servicio {
  id:          string;
  slug:        string;
  titulo:      string;
  subtitulo:   string;
  descripcion: string;
  emoji:       string;
  duracion:    string;
  modalidades: string[];
  precio_base: number;
  precio_max:  number;
  audiencia:   string;
  resultados:  string[];
  incluye:     string[];
  para_quien:  string[];
  faq:         { pregunta: string; respuesta: string }[];
}

export const SERVICIOS: Servicio[] = [
  {
    id: "sensibilizacion", slug: "sensibilizacion",
    titulo: "Sensibilización Alta Dirección",
    subtitulo: "El primer paso que lo cambia todo",
    descripcion: "Sesión estratégica de 3 horas para CEOs, directores y C-Suite. Presentamos el bienestar como inversión con datos duros, casos de éxito mexicanos y ROI proyectado. Al final, la dirección sale con un plan de acción concreto.",
    emoji: "🎯",
    duracion: "3 horas",
    modalidades: ["Presencial CDMX", "Online"],
    precio_base: 18000, precio_max: 45000,
    audiencia: "C-Suite · Directores Generales · VPs",
    resultados: [
      "Dirección convencida y comprometida con el programa",
      "Presupuesto de bienestar aprobado en la misma sesión",
      "Plan de acción a 90 días definido",
      "KPIs de bienestar acordados con dirección",
    ],
    incluye: [
      "Presentación ejecutiva personalizada con datos de tu industria",
      "Diagnóstico express del clima organizacional",
      "Reporte ejecutivo post-sesión en PDF",
      "Plan de acción a 90 días",
      "Seguimiento a 30 días post-sesión",
    ],
    para_quien: [
      "Empresas que quieren implementar bienestar pero la dirección no está convencida",
      "Directores de RRHH que necesitan respaldo ejecutivo para su presupuesto",
      "Organizaciones evaluando cumplir con NOM-035",
      "Corporativos con alta rotación o ausentismo que buscan solución estratégica",
    ],
    faq: [
      { pregunta: "¿Cuántos directivos deben asistir?", respuesta: "Entre 3 y 8 personas del C-Suite. La sesión está diseñada para grupos pequeños de toma de decisiones." },
      { pregunta: "¿Qué pasa si la dirección no queda convencida?", respuesta: "Reembolsamos el 50% del costo. Nuestra tasa de conversión post-sesión es del 87%." },
      { pregunta: "¿Se puede hacer de forma remota?", respuesta: "Sí, versión online de 2.5 horas con la misma efectividad. Recomendamos presencial para máximo impacto." },
      { pregunta: "¿Qué incluye el reporte ejecutivo?", respuesta: "Diagnóstico del estado actual, benchmarks de tu industria, ROI proyectado y plan de acción priorizado." },
    ],
  },
  {
    id: "talleres", slug: "talleres",
    titulo: "Talleres y Capacitaciones",
    subtitulo: "Aprendizaje vivencial que transforma equipos",
    descripcion: "Catálogo de 12+ talleres temáticos de 2 horas diseñados para equipos corporativos. Metodología 100% vivencial con aplicación práctica inmediata. Desde manejo del estrés hasta comunicación no violenta.",
    emoji: "🧘",
    duracion: "2 horas (estándar) · 4 horas (intensivo)",
    modalidades: ["Presencial CDMX", "Online", "Híbrido"],
    precio_base: 8000, precio_max: 25000,
    audiencia: "Equipos de 10 a 200 personas",
    resultados: [
      "Reducción del 40% en niveles de estrés reportado",
      "Mejora en comunicación y colaboración entre áreas",
      "Herramientas prácticas aplicables desde el día siguiente",
      "Certificado de participación para cada colaborador",
    ],
    incluye: [
      "Facilitador certificado en bienestar corporativo",
      "Material de trabajo digital para cada participante",
      "Ejercicios y dinámicas vivenciales",
      "Guía de práctica post-taller (30 días)",
      "Encuesta NPS post-taller y reporte de resultados",
    ],
    para_quien: [
      "Equipos con altos niveles de estrés o conflictos frecuentes",
      "Empresas que quieren cumplir NOM-035 con programas de capacitación",
      "Organizaciones en procesos de cambio o reestructuración",
      "RRHH que busca actividades de bienestar con impacto medible",
    ],
    faq: [
      { pregunta: "¿Cuántas personas pueden asistir?", respuesta: "Grupos de 15 a 50 personas. Para grupos más grandes dividimos en sesiones o adaptamos el formato." },
      { pregunta: "¿Cuáles son los talleres más solicitados?", respuesta: "Manejo del estrés, Comunicación No Violenta, Mindfulness aplicado e Inteligencia Emocional." },
      { pregunta: "¿Se puede hacer en nuestras instalaciones?", respuesta: "Sí. Solo necesitamos salón con sillas cómodas. Nosotros llevamos todo el material." },
      { pregunta: "¿Hay descuento por varios talleres?", respuesta: "Sí. A partir de 3 talleres al mes aplica 15% de descuento. Programas anuales hasta 25%." },
    ],
  },
  {
    id: "integracion", slug: "integracion",
    titulo: "Integración de Equipos",
    subtitulo: "Experiencias vivenciales que unen personas",
    descripcion: "Team building holístico de medio día o día completo. Combinamos dinámicas de bienestar, retos colaborativos y reflexión guiada para fortalecer cohesión, confianza y comunicación. Resultados medibles.",
    emoji: "🤝",
    duracion: "Medio día (4h) · Día completo (8h)",
    modalidades: ["Presencial CDMX y área metropolitana"],
    precio_base: 22000, precio_max: 120000,
    audiencia: "Equipos de 15 a 50 personas",
    resultados: [
      "Mayor confianza y cohesión entre compañeros",
      "Comunicación más abierta y efectiva",
      "Reducción de silos entre departamentos",
      "Equipo motivado y alineado con la cultura",
    ],
    incluye: [
      "2 facilitadores certificados para grupos hasta 30 personas",
      "Diseño personalizado según tu equipo",
      "Materiales y recursos para todas las dinámicas",
      "Lunch o coffee break incluido (día completo)",
      "Reporte fotográfico y resumen ejecutivo",
      "Seguimiento grupal a los 30 días",
    ],
    para_quien: [
      "Equipos nuevos que necesitan construir confianza rápidamente",
      "Departamentos con conflictos o falta de comunicación",
      "Empresas después de fusiones o reestructuraciones",
      "Equipos de liderazgo que quieren modelar cultura de bienestar",
    ],
    faq: [
      { pregunta: "¿Dónde se realiza?", respuesta: "En tus instalaciones, espacios naturales del área metropolitana o venues corporativos que recomendamos." },
      { pregunta: "¿Qué diferencia esto de un team building tradicional?", respuesta: "Integramos mindfulness, comunicación consciente y reflexión guiada con resultados medibles." },
      { pregunta: "¿Necesitamos experiencia en meditación?", respuesta: "Cero. Las dinámicas están diseñadas para cualquier perfil corporativo, incluyendo personas escépticas." },
      { pregunta: "¿Pueden asistir directivos y operativos juntos?", respuesta: "Sí, y es lo que recomendamos. La integración transversal genera el mayor impacto cultural." },
    ],
  },
  {
    id: "diagnostico", slug: "diagnostico",
    titulo: "Diagnóstico de Bienestar Laboral",
    subtitulo: "Datos reales para decisiones inteligentes",
    descripcion: "Evaluación completa del clima organizacional con metodología propia. Medimos factores de riesgo psicosocial según NOM-035, NPS interno, niveles de burnout y satisfacción laboral. Entregable: reporte ejecutivo para dirección general.",
    emoji: "📊",
    duracion: "60 min (básico · gratis) · 90 min (completo)",
    modalidades: ["Online", "Presencial CDMX"],
    precio_base: 0, precio_max: 12000,
    audiencia: "Empresas de 20 a 500 empleados",
    resultados: [
      "Mapa completo del estado de bienestar de tu organización",
      "Identificación de áreas críticas y factores de riesgo",
      "Baseline para medir impacto de futuras intervenciones",
      "Cumplimiento parcial de NOM-035 documentado",
    ],
    incluye: [
      "Reunión de 60-90 minutos con especialista Holizenter",
      "Cuestionario de diagnóstico para colaboradores",
      "Reporte ejecutivo en PDF con hallazgos y recomendaciones",
      "Presentación de resultados a dirección",
      "Plan de acción priorizado a 6 meses",
    ],
    para_quien: [
      "Empresas que quieren entender el estado real de su clima organizacional",
      "Directores de RRHH que necesitan datos para justificar inversión",
      "Organizaciones que deben cumplir con NOM-035 STPS",
      "PyMEs empezando su programa de bienestar desde cero",
    ],
    faq: [
      { pregunta: "¿El diagnóstico básico realmente es gratis?", respuesta: "Sí, completamente gratis y sin compromiso. Es nuestra forma de generar confianza desde el primer contacto." },
      { pregunta: "¿Cuál es la diferencia entre básico y completo?", respuesta: "El básico incluye sesión y reporte básico. El completo agrega cuestionario a colaboradores y análisis estadístico." },
      { pregunta: "¿Cuánto tarda el reporte?", respuesta: "El básico en 24-48h. El completo en 5-7 días hábiles." },
      { pregunta: "¿El diagnóstico ayuda con NOM-035?", respuesta: "Sí, el diagnóstico completo cubre los requisitos de identificación de factores de riesgo psicosocial." },
    ],
  },
];

export function getServicioBySlug(slug: string): Servicio | undefined {
  return SERVICIOS.find((s) => s.slug === slug);
}

export function formatPrecio(precio: number): string {
  if (precio === 0) return "Gratuito";
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN", minimumFractionDigits: 0,
  }).format(precio);
}
