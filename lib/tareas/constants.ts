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

type Perfil = 'pragmatico' | 'introspectivo' | 'comunitario' | 'competitivo';
type Nivel  = 'positivo' | 'neutro' | 'negativo';

const VALIDACIONES: Record<Perfil, Record<Nivel, string>> = {
  pragmatico: {
    positivo: 'Hiciste algo difícil hoy. No fue perfecto, pero fue real. Eso es lo que importa.',
    neutro:   'Hoy no viste avance. Pero registraste. La consistencia es el cambio.',
    negativo: 'No fue tu mejor día. Pero apareciste. Eso también construye.',
  },
  introspectivo: {
    positivo: 'Nombraste qué pasó hoy. Eso es conciencia. Te conoces un poco más.',
    neutro:   'Hoy tu mente no paró. Está bien. Viniste igual. Eso es suficiente.',
    negativo: 'Algunos días la práctica es simplemente mostrarte. Ya lo hiciste.',
  },
  comunitario: {
    positivo: 'Te cuidaste hoy. Como lo harías con alguien que amas. No estás solo/a en esto.',
    neutro:   'Viniste aunque fuera difícil. Eso cuenta. Estamos contigo.',
    negativo: 'No fue el mejor día, pero no lo enfrentaste solo/a. Aquí seguimos.',
  },
  competitivo: {
    positivo: 'Resultado real. Streak activo. Vas en la dirección correcta. Mantén el momentum.',
    neutro:   'No fue la mejor, pero completaste. Eso es consistencia, no debilidad.',
    negativo: 'No fue tu mejor día, pero apareciste. La consistencia gana al talento.',
  },
};

export function generarValidacion(
  deltaEmocional: number,
  perfilTipo: string,
  streakActual: number
): string {
  const perfil = (perfilTipo as Perfil) in VALIDACIONES ? (perfilTipo as Perfil) : 'pragmatico';
  const mapa   = VALIDACIONES[perfil];
  const nivel: Nivel = deltaEmocional > 1 ? 'positivo' : deltaEmocional < 0 ? 'negativo' : 'neutro';
  let msg = mapa[nivel];
  if (perfil === 'competitivo' && nivel === 'positivo') {
    msg = `+${XP_COMPLETAR_BASE + XP_DELTA_POSITIVO} XP · Streak ${streakActual} días · ${msg}`;
  }
  return msg;
}
