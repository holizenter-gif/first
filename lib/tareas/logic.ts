import type { SupabaseClient } from "@supabase/supabase-js";
import { PREGUNTAS_ONBOARDING, PREGUNTAS_SEMANA, type Letra } from "./preguntas";
import type { Pregunta } from "./preguntas";

export type Emocion     = 'burnout' | 'estres' | 'ansiedad' | 'mantenimiento' | 'depresion' | 'duelo';
export type Motivacion  = 'pragmatico' | 'introspectivo' | 'comunitario' | 'competitivo';
export type Tiempo      = '5min' | '10min' | '15min' | '20min+';
export type Tono        = 'accion' | 'exploratorio' | 'restaurativo' | 'profundo';
export type Pool        = 'ligero' | 'medio' | 'profundo';

export interface Perfil {
  motivacional: Motivacion;
  emocion:      Emocion;
  tiempo:       Tiempo;
  tono:         Tono;
}

export interface TareaDelDia {
  dia:        number;
  tarea_id:   string;
  nombre:     string;
  instruccion: string;
  por_que:    string;
  duracion_min: number;
}

// ─── Determinar pool según emoción anterior ────────────────────────────────

export function determinarPool(emocion: Emocion): Pool {
  if (emocion === 'mantenimiento')                        return 'ligero';
  if (emocion === 'ansiedad' || emocion === 'estres')     return 'medio';
  return 'profundo';
}

// ─── Scoring onboarding (6 respuestas) ────────────────────────────────────

export function scoringOnboarding(respuestas: Record<string, Letra>): Perfil {
  const preguntas = PREGUNTAS_ONBOARDING;

  const votos: Record<string, Record<string, number>> = {
    emocion:      {},
    tiempo:       {},
    tono:         {},
    motivacional: {},
  };

  for (const p of preguntas) {
    const letra = respuestas[p.id];
    if (!letra) continue;
    const opcion = p.opciones.find((o) => o.letra === letra);
    if (!opcion) continue;
    votos[p.variable][opcion.valor] = (votos[p.variable][opcion.valor] ?? 0) + 1;
  }

  const ganador = (v: Record<string, number>) =>
    Object.entries(v).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '';

  return {
    emocion:      (ganador(votos.emocion)      || 'mantenimiento') as Emocion,
    tiempo:       (ganador(votos.tiempo)       || '10min')         as Tiempo,
    tono:         (ganador(votos.tono)         || 'accion')        as Tono,
    motivacional: (ganador(votos.motivacional) || 'pragmatico')    as Motivacion,
  };
}

// ─── Scoring semanal (4 respuestas con IDs de pregunta) ───────────────────

export function scoringSemana(
  respuestas: { pregunta_id: string; letra: Letra }[],
  todasPreguntas: Pregunta[]
): Perfil {
  const votos: Record<string, Record<string, number>> = {
    emocion:      {},
    tiempo:       {},
    tono:         {},
    motivacional: {},
  };

  for (const r of respuestas) {
    const pregunta = todasPreguntas.find((p) => p.id === r.pregunta_id);
    if (!pregunta) continue;
    const opcion = pregunta.opciones.find((o) => o.letra === r.letra);
    if (!opcion) continue;
    votos[pregunta.variable][opcion.valor] = (votos[pregunta.variable][opcion.valor] ?? 0) + 1;
  }

  const ganador = (v: Record<string, number>) =>
    Object.entries(v).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '';

  return {
    emocion:      (ganador(votos.emocion)      || 'mantenimiento') as Emocion,
    tiempo:       (ganador(votos.tiempo)       || '10min')         as Tiempo,
    tono:         (ganador(votos.tono)         || 'accion')        as Tono,
    motivacional: (ganador(votos.motivacional) || 'pragmatico')    as Motivacion,
  };
}

// ─── Generar plan 7 días desde tareas_pool ───────────────────────────────

export async function generarPlan7Dias(
  supabase: SupabaseClient,
  perfil: Perfil
): Promise<TareaDelDia[]> {
  // Intento 1: match exacto en las 4 dimensiones
  let { data: tareas } = await supabase
    .from('tareas_pool')
    .select('*')
    .eq('emocion_target',   perfil.emocion)
    .eq('motivacion_ideal', perfil.motivacional)
    .eq('tiempo_min',       perfil.tiempo)
    .eq('tono',             perfil.tono)
    .order('dia_semana');

  // Intento 2: solo emocion (relaxar motivacion y tiempo)
  if (!tareas || tareas.length < 7) {
    const { data: t2 } = await supabase
      .from('tareas_pool')
      .select('*')
      .eq('emocion_target', perfil.emocion)
      .order('dia_semana');
    tareas = merge7(tareas ?? [], t2 ?? []);
  }

  // Intento 3: emociones vecinas
  if (tareas.length < 7) {
    const emocionesVecinas: Record<Emocion, Emocion[]> = {
      burnout:       ['estres', 'depresion'],
      estres:        ['burnout', 'ansiedad'],
      ansiedad:      ['estres', 'mantenimiento'],
      mantenimiento: ['ansiedad'],
      depresion:     ['burnout', 'duelo'],
      duelo:         ['depresion'],
    };
    for (const vecina of emocionesVecinas[perfil.emocion] ?? []) {
      const { data: t3 } = await supabase
        .from('tareas_pool')
        .select('*')
        .eq('emocion_target', vecina)
        .order('dia_semana');
      tareas = merge7(tareas, t3 ?? []);
      if (tareas.length >= 7) break;
    }
  }

  // Construir plan día 1-7
  const plan: TareaDelDia[] = [];
  for (let dia = 1; dia <= 7; dia++) {
    const tarea = tareas.find((t) => t.dia_semana === dia) ?? tareas[dia - 1] ?? tareas[0];
    if (!tarea) continue;
    plan.push({
      dia,
      tarea_id:     tarea.id,
      nombre:       tarea.nombre,
      instruccion:  tarea.instruccion,
      por_que:      tarea.por_que ?? '',
      duracion_min: tarea.duracion_min ?? 5,
    });
  }
  return plan;
}

function merge7<T extends { dia_semana: number }>(base: T[], extra: T[]): T[] {
  const dias = new Set(base.map((t) => t.dia_semana));
  for (const t of extra) {
    if (!dias.has(t.dia_semana)) {
      base.push(t);
      dias.add(t.dia_semana);
    }
    if (base.length >= 7) break;
  }
  return base;
}

// ─── Seleccionar preguntas para quiz semanal ─────────────────────────────

export function seleccionarPreguntasSemana(
  pool: Pool,
  preguntasUsadas: string[]
): Pregunta[] {
  const slots = PREGUNTAS_SEMANA[pool];
  const elegir = (opciones: Pregunta[]) => {
    const disponibles = opciones.filter((p) => !preguntasUsadas.includes(p.id));
    const fuente = disponibles.length > 0 ? disponibles : opciones;
    return fuente[Math.floor(Math.random() * fuente.length)];
  };

  return [
    elegir(slots.motivacional),
    elegir(slots.emocion_1),
    elegir(slots.emocion_2),
    elegir(slots.tiempo),
  ];
}

// ─── Todas las preguntas del pool semana (para scoring) ──────────────────

export function todasPreguntasSemana(): Pregunta[] {
  return Object.values(PREGUNTAS_SEMANA).flatMap((slot) => [
    ...slot.motivacional,
    ...slot.emocion_1,
    ...slot.emocion_2,
    ...slot.tiempo,
  ]);
}
