export const REWARDS = [
  { dias: 7,  desc: '5% descuento en sesión con especialista', codigo: 'STREAK7'  },
  { dias: 14, desc: 'Café gratis (Starbucks)',                  codigo: 'STREAK14' },
  { dias: 30, desc: 'Sesión grupal GRATIS',                     codigo: 'STREAK30' },
  { dias: 60, desc: '$200 Starbucks o Adidas',                  codigo: 'STREAK60' },
  { dias: 90, desc: 'Consulta con especialista GRATIS',         codigo: 'STREAK90' },
] as const;

export const BADGES = [
  { id: 'respiro_consciente',      nombre: 'Respiro Consciente',      dias: 1,  desc: 'Completaste tu primer día' },
  { id: 'cuerpo_consciente',       nombre: 'Cuerpo Consciente',       dias: 3,  desc: '3 días seguidos completados' },
  { id: 'caminante_consciente',    nombre: 'Caminante Consciente',    dias: 5,  desc: '5 días seguidos completados' },
  { id: 'pausa_de_oro',            nombre: 'Pausa de Oro',            dias: 10, desc: '10 días seguidos' },
  { id: 'maestro_mindfulness',     nombre: 'Maestro de Mindfulness',  dias: 30, desc: '30 días seguidos' },
  { id: 'leyenda',                 nombre: 'Leyenda',                  dias: 90, desc: '90 días seguidos' },
] as const;

export const XP_COMPLETAR_BASE = 50;
export const XP_DELTA_POSITIVO  = 50; // bonus si emocion_despues > emocion_antes

type Perfil = 'pragmático' | 'introspectivo' | 'comunitario' | 'competitivo';
type Nivel  = 'positivo' | 'neutro' | 'negativo';

const VALIDACIONES: Record<Perfil, Record<Nivel, string>> = {
  'pragmático': {
    positivo: 'Tu sistema nervioso registró el cambio. Eso es evidencia, no intuición.',
    neutro:   'Completaste. Eso construye el hábito aunque hoy no se sienta diferente.',
    negativo: 'Está bien. La práctica funciona en el largo plazo, no en cada sesión.',
  },
  'introspectivo': {
    positivo: 'Notaste el cambio adentro. Eso es lo más real que existe.',
    neutro:   'Hoy no hubo gran revelación. Pero estuviste contigo. Eso siempre cuenta.',
    negativo: 'Algunos días la práctica es simplemente mostarte. Eso ya es suficiente.',
  },
  'comunitario': {
    positivo: 'Te diste lo que le darías a alguien que quieres. Eso importa.',
    neutro:   'Hoy te conectaste contigo mismo/a. La conexión con otros empieza aquí.',
    negativo: 'No fue el mejor día, pero no estuviste solo/a en esto. Aquí estamos.',
  },
  'competitivo': {
    positivo: 'Resultado real. Streak activo. Vas en la dirección correcta.',
    neutro:   'Completaste sin sentir mucho. Eso es disciplina, no falta de progreso.',
    negativo: 'No fue tu mejor día, pero apareciste. La consistencia gana al talento.',
  },
};

export function generarValidacion(
  deltaEmocional: number,
  perfilTipo: string,
  streakActual: number
): string {
  const perfil = perfilTipo as Perfil;
  const mapa   = VALIDACIONES[perfil] ?? VALIDACIONES['pragmático'];
  const nivel: Nivel = deltaEmocional > 1 ? 'positivo' : deltaEmocional < 0 ? 'negativo' : 'neutro';
  let msg = mapa[nivel];
  if (perfil === 'competitivo' && nivel === 'positivo') {
    msg = `+${XP_COMPLETAR_BASE + XP_DELTA_POSITIVO} XP · Streak ${streakActual} días · ${msg}`;
  }
  return msg;
}
