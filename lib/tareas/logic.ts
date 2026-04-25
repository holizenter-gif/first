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
  dia:         number;
  tarea_id:    string;
  nombre:      string;
  instruccion: string;
  por_que:     string;
  duracion_min: number;
}

// ─── Determinar pool según emoción ────────────────────────────────────────

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

// ─── NUEVA: calcularAdherencia ─────────────────────────────────────────────
// Entrada: completadas (número), total asignadas (default 7)
// Salida: porcentaje 0-100

export function calcularAdherencia(completadas: number, total: number = 7): number {
  if (total <= 0 || completadas <= 0) return 0;
  return Math.round((completadas / total) * 100);
}

// ─── NUEVA: obtenerTareasCompletadas28Dias ────────────────────────────────
// Usa completada_en (TIMESTAMPTZ) — columna agregada en migración 20260423
// Si el campo no existe todavía en DB, retorna [] sin romper

export async function obtenerTareasCompletadas28Dias(
  supabase: SupabaseClient,
  user_id: string
): Promise<string[]> {
  try {
    const hace28 = new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString();
    const { data, error } = await supabase
      .from('user_tareas_asignadas')
      .select('tarea_id')
      .eq('user_id', user_id)
      .eq('completada', true)
      .gte('completada_en', hace28);
    if (error) return [];
    return (data ?? []).map((r: { tarea_id: string }) => r.tarea_id);
  } catch {
    return [];
  }
}

// ─── NUEVA: determinarNivelDinamico ──────────────────────────────────────
// Si adherencia > 70% → sube nivel (máx 4). Si no → mantiene.

export function determinarNivelDinamico(adherencia: number, nivel_anterior: number): number {
  const base = nivel_anterior < 1 ? 1 : nivel_anterior;
  if (adherencia > 70) return Math.min(base + 1, 4);
  return base;
}

// ─── NUEVA: promediarPerfiles ─────────────────────────────────────────────
// Usa el perfil_semanal para motivacional, emocion, tiempo.
// El tono se PRESERVA del perfil inicial (onboarding).

export function promediarPerfiles(perfil_inicial: Perfil, perfil_semanal: Perfil): Perfil {
  return {
    motivacional: perfil_semanal.motivacional,
    emocion:      perfil_semanal.emocion,
    tiempo:       perfil_semanal.tiempo,
    tono:         perfil_inicial.tono,
  };
}

// ─── NUEVA: detectarRequiereRespuesta ────────────────────────────────────
// Detecta si la instrucción requiere que el usuario escriba algo.

export function detectarRequiereRespuesta(instruccion: string): boolean {
  const palabras = [
    'escribe', 'anota', 'registra', 'describe',
    'responde por escrito', 'escribe:', 'anota:', 'di qué',
  ];
  const texto = instruccion.toLowerCase();
  return palabras.some((p) => texto.includes(p));
}

// ─── NUEVA: generarPlan7DiasConNivel ────────────────────────────────────
// Busca en tareas_biblioteca (NO tareas_pool).
// Respeta nivel de dificultad y excluye tareas de los últimos 28 días.
// Fallback en cascada hasta generarPlan7DiasLegacy.

const EMOCIONES_VECINAS_BIB: Record<Emocion, Emocion[]> = {
  burnout:       ['estres', 'depresion'],
  estres:        ['burnout', 'ansiedad'],
  ansiedad:      ['estres', 'mantenimiento'],
  mantenimiento: ['ansiedad'],
  depresion:     ['burnout', 'duelo'],
  duelo:         ['depresion'],
};

// tareas_biblioteca usa 'estrés' con acento — las rutas usan 'estres' sin acento
function mapEmocionBib(emocion: Emocion): string {
  return emocion === 'estres' ? 'estrés' : emocion;
}

function tiempoAMinutos(tiempo: string): number {
  const mapa: Record<string, number> = { '5min': 5, '10min': 10, '15min': 15, '20min+': 25 };
  return mapa[tiempo] ?? 10;
}

function merge7Bib<T extends { dia_semana: number | null; id: string }>(base: T[], extra: T[]): T[] {
  const ids  = new Set(base.map((t) => t.id));
  const dias = new Set(base.map((t) => t.dia_semana));
  for (const t of extra) {
    if (!ids.has(t.id) && !dias.has(t.dia_semana)) {
      base.push(t);
      ids.add(t.id);
      if (t.dia_semana !== null) dias.add(t.dia_semana);
    }
    if (base.length >= 7) break;
  }
  return base;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function construirPlanBib(tareas: any[]): TareaDelDia[] {
  return tareas.slice(0, 7).map((t, i) => ({
    dia:          i + 1,
    tarea_id:     t.id,
    nombre:       t.nombre,
    instruccion:  t.instruccion,
    por_que:      t.por_que ?? '',
    duracion_min: tiempoAMinutos(t.tiempo_min ?? '10min'),
  }));
}

async function buscarEnBiblioteca(
  supabase:   SupabaseClient,
  emocion:    string,
  motivacion: string,
  nivel:      number,
  excluidas:  string[]
) {
  const { data } = await supabase
    .from('tareas_biblioteca')
    .select('*')
    .eq('emocion_target',   emocion)
    .eq('motivacion_ideal', motivacion)
    .eq('nivel',            nivel)
    .eq('tipo',             'diaria')
    .eq('activa',           true)
    .order('dia_semana');

  const todas = data ?? [];
  const filtradas = todas.filter((t: { id: string }) => !excluidas.includes(t.id));
  // Si con exclusión no alcanza 7, permite repeticiones (sin exclusión)
  return filtradas.length >= 7 ? filtradas : todas;
}

export async function generarPlan7DiasConNivel(
  supabase: SupabaseClient,
  perfil:   Perfil,
  nivel:    number,
  user_id:  string
): Promise<TareaDelDia[]> {
  const excluidas    = await obtenerTareasCompletadas28Dias(supabase, user_id);
  const emocionBib   = mapEmocionBib(perfil.emocion);

  // Intento 1: emocion + motivacion exactos con nivel
  let tareas = await buscarEnBiblioteca(supabase, emocionBib, perfil.motivacional, nivel, excluidas);

  // Intento 2: relaja motivacion (solo emocion + nivel)
  if (tareas.length < 7) {
    const { data } = await supabase
      .from('tareas_biblioteca')
      .select('*')
      .eq('emocion_target', emocionBib)
      .eq('nivel',          nivel)
      .eq('tipo',           'diaria')
      .eq('activa',         true)
      .order('dia_semana');
    tareas = merge7Bib(tareas, (data ?? []).filter((t: { id: string }) => !excluidas.includes(t.id)));
  }

  // Intento 3: emociones vecinas con nivel
  if (tareas.length < 7) {
    for (const vecina of EMOCIONES_VECINAS_BIB[perfil.emocion] ?? []) {
      const vecinaBib = mapEmocionBib(vecina);
      const mas = await buscarEnBiblioteca(supabase, vecinaBib, perfil.motivacional, nivel, excluidas);
      tareas = merge7Bib(tareas, mas);
      if (tareas.length >= 7) break;
    }
  }

  // Intento 4: fallback a nivel 1 (si nivel > 1 y no hay suficientes)
  if (tareas.length < 7 && nivel > 1) {
    const mas = await buscarEnBiblioteca(supabase, emocionBib, perfil.motivacional, 1, excluidas);
    tareas = merge7Bib(tareas, mas);
  }

  // Fallback final: tareas_pool (legacy)
  if (tareas.length < 7) {
    return generarPlan7DiasLegacy(supabase, perfil);
  }

  return construirPlanBib(tareas);
}

// ─── generarPlan7DiasLegacy (antes: generarPlan7Dias) ───────────────────
// Busca en tareas_pool. Fallback del sistema.

export async function generarPlan7DiasLegacy(
  supabase: SupabaseClient,
  perfil:   Perfil
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

  // Intento 2: solo emocion
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

  const plan: TareaDelDia[] = [];
  for (let dia = 1; dia <= 7; dia++) {
    const tarea = tareas.find((t) => t.dia_semana === dia) ?? tareas[dia - 1] ?? tareas[0];
    if (!tarea) continue;
    plan.push({
      dia,
      tarea_id:    tarea.id,
      nombre:      tarea.nombre,
      instruccion: tarea.instruccion,
      por_que:     tarea.por_que ?? '',
      duracion_min: tarea.duracion_min ?? 5,
    });
  }
  return plan;
}

// Alias para compatibilidad con código que ya llama generarPlan7Dias
export const generarPlan7Dias = generarPlan7DiasLegacy;

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
  pool:             Pool,
  preguntasUsadas:  string[]
): Pregunta[] {
  const slots  = PREGUNTAS_SEMANA[pool];
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
