import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { createAdminClient }         from "@/lib/supabase/admin";
import type { SupabaseClient }       from "@supabase/supabase-js";

type Motivacion = "pragmatico" | "introspectivo" | "comunitario" | "competitivo";
type Emocion    = "mantenimiento" | "ansiedad" | "estres" | "burnout" | "depresion" | "duelo";
type Tiempo     = "5min" | "10min" | "15min" | "20min+";
type Tono       = "accion" | "exploratorio" | "restaurativo" | "profundo";
interface Perfil { motivacional: Motivacion; emocion: Emocion; tiempo: Tiempo; tono: Tono; }
interface Tarea  { tarea_id: string; nombre: string; instruccion: string; por_que: string; dia: number; }

async function generarPlan7Dias(_admin: SupabaseClient, perfil: Perfil): Promise<Tarea[]> {
  return Array.from({ length: 7 }, (_, i) => ({
    tarea_id:    `${perfil.emocion}:${perfil.motivacional}:${perfil.tiempo}:${i + 1}`,
    nombre:      `Tarea día ${i + 1}`,
    instruccion: `Instrucción para ${perfil.emocion} — ${perfil.motivacional}`,
    por_que:     "Porque te cuidamos",
    dia:         i + 1,
  }));
}

// ─── PREGUNTAS POOL (33 preguntas = 11 ligero + 12 medio + 10 profundo) ────────

interface PreguntaPool {
  id:       string;
  pregunta: string;
  variable: "motivacional" | "emocion" | "tiempo";
  opciones: { letra: string; texto: string; valor: string }[];
}

const POOL: Record<"ligero" | "medio" | "profundo", { motivacional: PreguntaPool[]; emocion: PreguntaPool[]; tiempo: PreguntaPool[] }> = {
  ligero: {
    motivacional: [
      { id: "lig_mot_1", pregunta: "Esta semana, ¿qué tipo de práctica de bienestar te llama más?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Algo que mejore mi rendimiento diario.", valor: "pragmatico" }, { letra: "B", texto: "Un momento de introspección tranquila.", valor: "introspectivo" }, { letra: "C", texto: "Algo que me conecte con mi entorno.", valor: "comunitario" }, { letra: "D", texto: "Algo que me lleve un paso más allá.", valor: "competitivo" }] },
      { id: "lig_mot_2", pregunta: "¿Cómo prefieres medir tu progreso esta semana?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Con hábitos concretos completados.", valor: "pragmatico" }, { letra: "B", texto: "Sintiendo mayor claridad interior.", valor: "introspectivo" }, { letra: "C", texto: "Mejorando mis relaciones y entorno.", valor: "comunitario" }, { letra: "D", texto: "Superando mi marca de la semana pasada.", valor: "competitivo" }] },
      { id: "lig_mot_3", pregunta: "¿Qué resultado te daría más satisfacción al final de la semana?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Ver métricas de hábito cumplidas.", valor: "pragmatico" }, { letra: "B", texto: "Sentirme más conectado/a conmigo.", valor: "introspectivo" }, { letra: "C", texto: "Haber compartido algo valioso.", valor: "comunitario" }, { letra: "D", texto: "Haber cumplido mi reto personal.", valor: "competitivo" }] },
      { id: "lig_mot_4", pregunta: "Cuando algo va bien, ¿cómo lo celebras internamente?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Anoto el logro y planifico el siguiente.", valor: "pragmatico" }, { letra: "B", texto: "Me doy un momento de gratitud tranquila.", valor: "introspectivo" }, { letra: "C", texto: "Quiero compartirlo con alguien.", valor: "comunitario" }, { letra: "D", texto: "Pongo el listón un poco más alto.", valor: "competitivo" }] },
    ],
    emocion: [
      { id: "lig_em_1", pregunta: "¿Cómo te has sentido en general esta semana?", variable: "emocion",
        opciones: [{ letra: "A", texto: "En equilibrio, sin grandes altibajos.", valor: "mantenimiento" }, { letra: "B", texto: "Con algo de ruido mental de fondo.", valor: "ansiedad" }, { letra: "C", texto: "Con alguna presión acumulada.", valor: "estres" }, { letra: "D", texto: "Cansado/a aunque haya descansado.", valor: "burnout" }] },
      { id: "lig_em_2", pregunta: "¿Cómo describes tu estado mental al despertar?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Claro y dispuesto/a para el día.", valor: "mantenimiento" }, { letra: "B", texto: "Algo acelerado, ya pensando en todo.", valor: "ansiedad" }, { letra: "C", texto: "Tenso/a, con el modo trabajo encendido.", valor: "estres" }, { letra: "D", texto: "Pesado/a, sin ganas de empezar.", valor: "burnout" }] },
      { id: "lig_em_3", pregunta: "¿Tu energía durante el día es...?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Constante y fluida.", valor: "mantenimiento" }, { letra: "B", texto: "Irregular, con picos y caídas de ánimo.", valor: "ansiedad" }, { letra: "C", texto: "Tensa en ciertos momentos.", valor: "estres" }, { letra: "D", texto: "Baja en general, casi sin reservas.", valor: "burnout" }] },
      { id: "lig_em_4", pregunta: "¿Cómo te relacionas con tus responsabilidades esta semana?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Las manejo con calma y orden.", valor: "mantenimiento" }, { letra: "B", texto: "Me preocupan aunque las esté cumpliendo.", valor: "ansiedad" }, { letra: "C", texto: "Siento que son muchas y no ceden.", valor: "estres" }, { letra: "D", texto: "Me cuestan el doble de lo normal.", valor: "burnout" }] },
      { id: "lig_em_5", pregunta: "¿Cómo describes tu humor en general?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Estable, con momentos de alegría.", valor: "mantenimiento" }, { letra: "B", texto: "Variable, me altera lo pequeño.", valor: "ansiedad" }, { letra: "C", texto: "Irritable cuando hay presión.", valor: "estres" }, { letra: "D", texto: "Apagado, poca emoción.", valor: "burnout" }] },
    ],
    tiempo: [
      { id: "lig_tpo_1", pregunta: "¿Cuánto tiempo tienes esta semana para tu bienestar?", variable: "tiempo",
        opciones: [{ letra: "A", texto: "5 minutos diarios.", valor: "5min" }, { letra: "B", texto: "10 minutos, puedo organizarlo.", valor: "10min" }, { letra: "C", texto: "15 minutos con algo de planificación.", valor: "15min" }, { letra: "D", texto: "20+ minutos, quiero profundizar.", valor: "20min+" }] },
      { id: "lig_tpo_2", pregunta: "¿Cuál es tu intención principal esta semana?", variable: "tiempo",
        opciones: [{ letra: "A", texto: "Mantener algo breve pero constante.", valor: "5min" }, { letra: "B", texto: "Tener un espacio moderado para mí.", valor: "10min" }, { letra: "C", texto: "Profundizar un poco más que la semana pasada.", valor: "15min" }, { letra: "D", texto: "Hacer de esto una práctica seria.", valor: "20min+" }] },
    ],
  },

  medio: {
    motivacional: [
      { id: "med_mot_1", pregunta: "Dado cómo te has sentido, ¿qué tipo de apoyo necesitas esta semana?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Herramientas prácticas que funcionen ya.", valor: "pragmatico" }, { letra: "B", texto: "Espacio para entender qué me pasa.", valor: "introspectivo" }, { letra: "C", texto: "Sentir que no estoy solo/a en esto.", valor: "comunitario" }, { letra: "D", texto: "Recuperar el control de mi situación.", valor: "competitivo" }] },
      { id: "med_mot_2", pregunta: "¿Qué te daría más alivio esta semana?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Completar algo tangible cada día.", valor: "pragmatico" }, { letra: "B", texto: "Momentos de silencio y comprensión propia.", valor: "introspectivo" }, { letra: "C", texto: "Conectar genuinamente con alguien.", valor: "comunitario" }, { letra: "D", texto: "Sentir que avanzo aunque sea poco.", valor: "competitivo" }] },
      { id: "med_mot_3", pregunta: "¿Qué tipo de logro te haría sentir que valió la semana?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Haber sido productivo/a con mi bienestar.", valor: "pragmatico" }, { letra: "B", texto: "Haberme entendido mejor.", valor: "introspectivo" }, { letra: "C", texto: "Haber apoyado o sido apoyado/a.", valor: "comunitario" }, { letra: "D", texto: "Haber mantenido el ritmo bajo presión.", valor: "competitivo" }] },
      { id: "med_mot_4", pregunta: "Cuando sientes presión, ¿qué te ayuda más?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Descomponer el problema en pasos.", valor: "pragmatico" }, { letra: "B", texto: "Pararme y escucharme.", valor: "introspectivo" }, { letra: "C", texto: "Hablar con alguien de confianza.", valor: "comunitario" }, { letra: "D", texto: "Recordar que puedo con esto.", valor: "competitivo" }] },
      { id: "med_mot_5", pregunta: "¿Qué es lo que más te motiva a cuidarte ahora mismo?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Ver resultados en mi desempeño.", valor: "pragmatico" }, { letra: "B", texto: "Entender mejor lo que siento.", valor: "introspectivo" }, { letra: "C", texto: "Estar bien para quienes me rodean.", valor: "comunitario" }, { letra: "D", texto: "Demostrarme que puedo.", valor: "competitivo" }] },
    ],
    emocion: [
      { id: "med_em_1", pregunta: "¿Cómo describirías tu estado emocional esta semana?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Algo más estable que la semana pasada.", valor: "mantenimiento" }, { letra: "B", texto: "Con pensamientos que me dan vueltas.", valor: "ansiedad" }, { letra: "C", texto: "Bajo presión constante.", valor: "estres" }, { letra: "D", texto: "Agotado/a, sin energía de sobra.", valor: "burnout" }] },
      { id: "med_em_2", pregunta: "¿Cómo reaccionas a los imprevistos esta semana?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Con calma, los manejo bien.", valor: "mantenimiento" }, { letra: "B", texto: "Me alteran más de lo que quisiera.", valor: "ansiedad" }, { letra: "C", texto: "Se acumulan y me saturan.", valor: "estres" }, { letra: "D", texto: "Apenas tengo recursos para ellos.", valor: "burnout" }] },
      { id: "med_em_3", pregunta: "¿Cómo es tu diálogo interno estos días?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Amable, me trato bien.", valor: "mantenimiento" }, { letra: "B", texto: "Acelerado, con muchos 'y si...'", valor: "ansiedad" }, { letra: "C", texto: "Exigente, siempre hay algo más.", valor: "estres" }, { letra: "D", texto: "Apagado, con poca motivación.", valor: "burnout" }] },
      { id: "med_em_4", pregunta: "¿Cómo duermes actualmente?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Bien, me despierto descansado/a.", valor: "mantenimiento" }, { letra: "B", texto: "Con dificultad para apagar la mente.", valor: "ansiedad" }, { letra: "C", texto: "Interrumpido o insuficiente.", valor: "estres" }, { letra: "D", texto: "Mal. El descanso no me recupera.", valor: "burnout" }] },
      { id: "med_em_5", pregunta: "¿Cómo sientes tu cuerpo físicamente esta semana?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Ligero y con energía.", valor: "mantenimiento" }, { letra: "B", texto: "Tenso en hombros o mandíbula.", valor: "ansiedad" }, { letra: "C", texto: "Pesado, cargado de tensión.", valor: "estres" }, { letra: "D", texto: "Agotado, sin fuerza.", valor: "burnout" }] },
    ],
    tiempo: [
      { id: "med_tpo_1", pregunta: "¿Con qué intención quieres trabajar esta semana?", variable: "tiempo",
        opciones: [{ letra: "A", texto: "5 min: algo breve que me alivie.", valor: "5min" }, { letra: "B", texto: "10 min: un espacio real para mí.", valor: "10min" }, { letra: "C", texto: "15 min: quiero trabajarlo con calma.", valor: "15min" }, { letra: "D", texto: "20+ min: necesito profundizar.", valor: "20min+" }] },
      { id: "med_tpo_2", pregunta: "¿Qué ritmo puedes sostener esta semana?", variable: "tiempo",
        opciones: [{ letra: "A", texto: "Micro-pausas, poco pero constante.", valor: "5min" }, { letra: "B", texto: "Un rato moderado por las mañanas.", valor: "10min" }, { letra: "C", texto: "Un bloque de tiempo real cada día.", valor: "15min" }, { letra: "D", texto: "Una sesión larga diaria.", valor: "20min+" }] },
    ],
  },

  profundo: {
    motivacional: [
      { id: "pro_mot_1", pregunta: "En este momento de agotamiento, ¿qué sientes que necesitas?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Algo concreto que me dé resultados rápidos.", valor: "pragmatico" }, { letra: "B", texto: "Espacio para entender qué me trajo aquí.", valor: "introspectivo" }, { letra: "C", texto: "Sentir que no tengo que hacerlo solo/a.", valor: "comunitario" }, { letra: "D", texto: "Recuperar algo de control.", valor: "competitivo" }] },
      { id: "pro_mot_2", pregunta: "¿Qué tipo de logro te daría más fuerza ahora?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Completar una pequeña tarea práctica.", valor: "pragmatico" }, { letra: "B", texto: "Entenderme un poco mejor.", valor: "introspectivo" }, { letra: "C", texto: "Conectar con alguien de forma real.", valor: "comunitario" }, { letra: "D", texto: "Sobrevivir el día y saber que puedo.", valor: "competitivo" }] },
      { id: "pro_mot_3", pregunta: "¿Qué te ha mantenido en pie esta semana?", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Cumplir mis compromisos mínimos.", valor: "pragmatico" }, { letra: "B", texto: "Escucharme y darme espacio.", valor: "introspectivo" }, { letra: "C", texto: "Las personas que quiero.", valor: "comunitario" }, { letra: "D", texto: "No querer rendirme.", valor: "competitivo" }] },
      { id: "pro_mot_4", pregunta: "Si tuvieras que elegir UNA cosa de apoyo esta semana, sería:", variable: "motivacional",
        opciones: [{ letra: "A", texto: "Una técnica que funcione de inmediato.", valor: "pragmatico" }, { letra: "B", texto: "Tiempo solo/a para procesar.", valor: "introspectivo" }, { letra: "C", texto: "Alguien que me escuche.", valor: "comunitario" }, { letra: "D", texto: "Un objetivo pequeño que ganar.", valor: "competitivo" }] },
    ],
    emocion: [
      { id: "pro_em_1", pregunta: "¿Cómo está tu energía esta semana?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Algo mejor, noto una pequeña mejoría.", valor: "mantenimiento" }, { letra: "B", texto: "Con mucho ruido mental y preocupación.", valor: "ansiedad" }, { letra: "C", texto: "Bajo presión intensa, sin respiro.", valor: "estres" }, { letra: "D", texto: "Igual o peor. Muy agotado/a.", valor: "burnout" }] },
      { id: "pro_em_2", pregunta: "¿Qué tan presente te sientes en tu propio cuerpo?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Bastante conectado/a.", valor: "mantenimiento" }, { letra: "B", texto: "En la cabeza, poco en el cuerpo.", valor: "ansiedad" }, { letra: "C", texto: "Tenso/a físicamente, cargado/a.", valor: "estres" }, { letra: "D", texto: "Desconectado/a. Casi no lo siento.", valor: "burnout" }] },
      { id: "pro_em_3", pregunta: "¿Qué tan difícil es hacer cosas básicas?", variable: "emocion",
        opciones: [{ letra: "A", texto: "No me cuesta, fluyo bien.", valor: "mantenimiento" }, { letra: "B", texto: "Me cuestan más cuando estoy preocupado/a.", valor: "ansiedad" }, { letra: "C", texto: "Todo requiere más esfuerzo del normal.", valor: "estres" }, { letra: "D", texto: "Hasta las cosas simples me pesan.", valor: "burnout" }] },
      { id: "pro_em_4", pregunta: "¿Cómo te sientes respecto a la semana que viene?", variable: "emocion",
        opciones: [{ letra: "A", texto: "Con calma y algo de ilusión.", valor: "mantenimiento" }, { letra: "B", texto: "Con incertidumbre y algo de miedo.", valor: "ansiedad" }, { letra: "C", texto: "Abrumado/a solo de pensarlo.", valor: "estres" }, { letra: "D", texto: "Sin energía para anticipar nada.", valor: "burnout" }] },
    ],
    tiempo: [
      { id: "pro_tpo_1", pregunta: "¿Cuánto puedes comprometerte esta semana con tu bienestar?", variable: "tiempo",
        opciones: [{ letra: "A", texto: "5 min. Es lo máximo que puedo ahora.", valor: "5min" }, { letra: "B", texto: "10 min. Puedo encontrar ese rato.", valor: "10min" }, { letra: "C", texto: "15 min si me organizo.", valor: "15min" }, { letra: "D", texto: "20+ min. Quiero priorizar esto.", valor: "20min+" }] },
      { id: "pro_tpo_2", pregunta: "¿Qué tono quieres para tus prácticas esta semana?", variable: "tiempo",
        opciones: [{ letra: "A", texto: "Mínimo y sostenible. Sin más presión.", valor: "5min" }, { letra: "B", texto: "Moderado y gentil con mis límites.", valor: "10min" }, { letra: "C", texto: "Con algo de profundidad cuando pueda.", valor: "15min" }, { letra: "D", texto: "Comprometido. Quiero salir de esto.", valor: "20min+" }] },
    ],
  },
};

// Mapa plano id→pregunta para lookup en POST
const TODAS_PREGUNTAS = Object.values(POOL)
  .flatMap((p) => [...p.motivacional, ...p.emocion, ...p.tiempo])
  .reduce<Record<string, PreguntaPool>>((acc, p) => { acc[p.id] = p; return acc; }, {});

function determinarPool(emocion: string): "ligero" | "medio" | "profundo" {
  if (emocion === "mantenimiento") return "ligero";
  if (["ansiedad", "estres"].includes(emocion)) return "medio";
  return "profundo";
}

function elegir<T extends { id: string }>(lista: T[], excluir: string[]): T {
  const disp = lista.filter((p) => !excluir.includes(p.id));
  const fuente = disp.length > 0 ? disp : lista;
  return fuente[Math.floor(Math.random() * fuente.length)];
}

function votar(valores: string[]): string {
  const c: Record<string, number> = {};
  for (const v of valores) c[v] = (c[v] ?? 0) + 1;
  return Object.entries(c).sort(([, a], [, b]) => b - a)[0][0];
}

// ─── GET — devuelve 4 preguntas para el check-in semanal ─────────────────────

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { data: prefs } = await supabase
      .from("user_quiz_preferences")
      .select("emocion_actual, updated_at")
      .eq("user_id", user.id)
      .single();

    if (!prefs) {
      return NextResponse.json({ error: "Completa primero el quiz inicial" }, { status: 400 });
    }

    // Cooldown 7 días
    if (prefs.updated_at) {
      const diffDias = (Date.now() - new Date(prefs.updated_at).getTime()) / 86_400_000;
      if (diffDias < 7) {
        return NextResponse.json({
          error:         "Ya hiciste tu check-in esta semana",
          proxima_fecha: new Date(new Date(prefs.updated_at).getTime() + 7 * 86_400_000).toISOString(),
        }, { status: 429 });
      }
    }

    // Preguntas usadas en las últimas 2 semanas (vía admin para sortear RLS)
    const admin = createAdminClient();
    const hace14 = new Date(Date.now() - 14 * 86_400_000).toISOString().split("T")[0];
    const { data: recientes } = await admin
      .from("user_preguntas_historial")
      .select("pregunta_id")
      .eq("user_id", user.id)
      .eq("tipo_quiz", "semanal")
      .gte("fecha", hace14);

    const excluir = (recientes ?? []).map((r: { pregunta_id: string }) => r.pregunta_id);

    const poolKey  = determinarPool(prefs.emocion_actual ?? "mantenimiento");
    const pool     = POOL[poolKey];

    const p1 = elegir(pool.motivacional, excluir);
    const p2 = elegir(pool.emocion,      excluir);
    const p3 = elegir(pool.emocion,      [...excluir, p2.id]);
    const p4 = elegir(pool.tiempo,       excluir);

    return NextResponse.json({ pool: poolKey, preguntas: [p1, p2, p3, p4] });
  } catch (err) {
    console.error("Error en GET quiz/tareas/semana:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// ─── POST — recibe 4 respuestas, actualiza perfil, genera plan ───────────────

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Body: { respuestas: [{pregunta_id, letra}×4] }
    const body: { respuestas: { pregunta_id: string; letra: string }[] } = await req.json();
    if (!body.respuestas || body.respuestas.length !== 4) {
      return NextResponse.json({ error: "Se requieren exactamente 4 respuestas" }, { status: 400 });
    }

    // Mapear respuestas a valores usando metadata de la pregunta
    const valores: { motivacional: string[]; emocion: string[]; tiempo: string[] } = {
      motivacional: [], emocion: [], tiempo: [],
    };
    for (const r of body.respuestas) {
      const pregunta = TODAS_PREGUNTAS[r.pregunta_id];
      if (!pregunta) continue;
      const opcion = pregunta.opciones.find((o) => o.letra === r.letra);
      if (!opcion) continue;
      valores[pregunta.variable].push(opcion.valor);
    }

    const { data: prefsActuales } = await supabase
      .from("user_quiz_preferences")
      .select("tono_intencional")
      .eq("user_id", user.id)
      .single();

    const perfil_motivacional = valores.motivacional.length > 0 ? votar(valores.motivacional) : "pragmatico";
    const emocion_actual      = valores.emocion.length      > 0 ? votar(valores.emocion)      : "mantenimiento";
    const tiempo_disponible   = valores.tiempo.length       > 0 ? valores.tiempo[0]           : "10min";
    const tono_intencional    = prefsActuales?.tono_intencional ?? "accion"; // preservar del onboarding

    // Actualizar perfil (sin preguntas_usadas)
    const { error: updateError } = await supabase
      .from("user_quiz_preferences")
      .update({ perfil_motivacional, emocion_actual, tiempo_disponible, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("semana/update_prefs:", JSON.stringify(updateError));
      return NextResponse.json({ error: "Error actualizando perfil", detail: updateError.message }, { status: 500 });
    }

    // Guardar historial vía admin
    const admin = createAdminClient();
    const hoy   = new Date().toISOString().split("T")[0];
    const historial = body.respuestas.map((r) => ({
      user_id:     user.id,
      pregunta_id: r.pregunta_id,
      respuesta:   r.letra,
      tipo_quiz:   "semanal",
      fecha:       hoy,
    }));
    const { error: histError } = await admin.from("user_preguntas_historial").insert(historial);
    if (histError) console.error("semana/historial (non-blocking):", JSON.stringify(histError));

    // Generar plan 7 días
    const perfil: Perfil = {
      motivacional: perfil_motivacional as Motivacion,
      emocion:      emocion_actual      as Emocion,
      tiempo:       tiempo_disponible   as Tiempo,
      tono:         tono_intencional    as Tono,
    };
    const plan7dias = await generarPlan7Dias(admin, perfil);

    // Asignar desde mañana
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const asignaciones = plan7dias.map((t, i) => {
      const f = new Date(manana);
      f.setDate(manana.getDate() + i);
      return { user_id: user.id, tarea_id: t.tarea_id, fecha_asignada: f.toISOString().split("T")[0] };
    });
    if (asignaciones.length > 0) {
      const { error: asigError } = await admin
        .from("user_tareas_asignadas")
        .upsert(asignaciones, { onConflict: "user_id,fecha_asignada", ignoreDuplicates: true });
      if (asigError) console.error("semana/asignar:", JSON.stringify(asigError));
    }

    return NextResponse.json({
      success:            true,
      perfil_motivacional,
      emocion_actual,
      tiempo_disponible,
      tono_intencional,
      pool_asignado:      determinarPool(emocion_actual),
      plan_7dias:         plan7dias,
    });
  } catch (err) {
    console.error("Error en POST quiz/tareas/semana:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error", detail: JSON.stringify(err) },
      { status: 500 }
    );
  }
}
