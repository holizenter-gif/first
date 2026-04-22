-- ============================================================
-- HOLIZENTER — BETA: Sueño + Resiliencia + tareas_biblioteca
-- Ejecutar en Supabase SQL Editor (una sola vez)
-- NOTA: user_sueno_tracking usa "sueno" sin ñ (evita encoding en URLs REST)
-- ============================================================

-- 1. tareas_biblioteca — schema enriquecido (convive con tareas_pool)

CREATE TABLE IF NOT EXISTS tareas_biblioteca (
  id              TEXT PRIMARY KEY, -- formato: 'burnout:pragmatico:5min:1'
  nombre          TEXT NOT NULL,
  instruccion     TEXT NOT NULL,
  por_que         TEXT NOT NULL,
  ciencia_breve   TEXT,
  protocolo       TEXT,             -- 'MBSR' | 'Recovery Science' | 'CBT' | etc.
  referencias     JSONB,            -- {autor, año, libro}
  validaciones    JSONB,            -- {pragmatico_positivo, introspectivo_neutro, ...}
  recurso_url     TEXT,
  emocion_target  TEXT NOT NULL CHECK (emocion_target IN ('burnout','estrés','ansiedad','mantenimiento','depresion','duelo')),
  motivacion_ideal TEXT NOT NULL CHECK (motivacion_ideal IN ('pragmatico','introspectivo','comunitario','competitivo')),
  tiempo_min      TEXT NOT NULL CHECK (tiempo_min IN ('5min','10min','15min','20min+')),
  tono            TEXT NOT NULL CHECK (tono IN ('accion','exploratorio','restaurativo','profundo')),
  dia_semana      INTEGER CHECK (dia_semana BETWEEN 1 AND 7),
  tipo            TEXT NOT NULL DEFAULT 'diaria' CHECK (tipo IN ('diaria','semanal')),
  activa          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 2. sleepcasts

CREATE TABLE IF NOT EXISTS sleepcasts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        TEXT NOT NULL,
  duracion_min  INTEGER NOT NULL,
  protocolo     TEXT,
  spotify_url   TEXT,
  transcript    TEXT,
  emocion_ideal TEXT[],
  complejidad   TEXT CHECK (complejidad IN ('ligero','medio','profundo')),
  referencias   JSONB,
  activa        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 3. user_sueno_tracking (sin ñ para compatibilidad REST)

CREATE TABLE IF NOT EXISTS user_sueno_tracking (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sleepcast_id  UUID REFERENCES sleepcasts(id),
  fecha         DATE NOT NULL,
  completado    BOOLEAN DEFAULT false,
  calidad_sueno INTEGER CHECK (calidad_sueno BETWEEN 1 AND 10),
  tiempo_dormido INTEGER,
  notas         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, fecha)
);

-- 4. user_emotion_tracking

CREATE TABLE IF NOT EXISTS user_emotion_tracking (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha            DATE NOT NULL,
  hora             TIME,
  emocion_dominante TEXT NOT NULL,
  intensidad       INTEGER CHECK (intensidad BETWEEN 1 AND 10),
  trigger          TEXT CHECK (trigger IN ('trabajo','relacion','fisico','sin_motivo','otro')),
  accion_tomada    TEXT CHECK (accion_tomada IN ('hice_tarea','respire','hable','ejercicio','otro')),
  resultado        INTEGER CHECK (resultado BETWEEN 1 AND 10),
  delta_resiliencia INTEGER,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- 5. user_resiliencia_patrones

CREATE TABLE IF NOT EXISTS user_resiliencia_patrones (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                      UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  patron_dominante             TEXT,
  frecuencia                   INTEGER,
  trigger_promedio             TEXT,
  accion_mas_efectiva          TEXT,
  velocidad_recuperacion_promedio INTEGER,
  updated_at                   TIMESTAMPTZ DEFAULT now()
);

-- 6. ALTER user_gamification — agregar streak_sueno y ultima_sueno_fecha si no existen

ALTER TABLE user_gamification
  ADD COLUMN IF NOT EXISTS streak_sueno        INTEGER DEFAULT 0;
ALTER TABLE user_gamification
  ADD COLUMN IF NOT EXISTS ultima_sueno_fecha  DATE;

-- 7. ÍNDICES

CREATE INDEX IF NOT EXISTS idx_tareas_bib_main ON tareas_biblioteca(emocion_target, motivacion_ideal, tiempo_min);
CREATE INDEX IF NOT EXISTS idx_tareas_bib_tipo  ON tareas_biblioteca(tipo, activa);
CREATE INDEX IF NOT EXISTS idx_user_sueno       ON user_sueno_tracking(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_user_emotion     ON user_emotion_tracking(user_id, fecha);

-- 8. RLS

ALTER TABLE tareas_biblioteca        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleepcasts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sueno_tracking      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_emotion_tracking    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resiliencia_patrones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tareas_bib_read"      ON tareas_biblioteca        FOR SELECT USING (true);
CREATE POLICY "sleepcasts_read"      ON sleepcasts               FOR SELECT USING (true);

CREATE POLICY "sueno_select"  ON user_sueno_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sueno_insert"  ON user_sueno_tracking FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sueno_update"  ON user_sueno_tracking FOR UPDATE  USING (auth.uid() = user_id);

CREATE POLICY "emotion_select" ON user_emotion_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "emotion_insert" ON user_emotion_tracking FOR INSERT  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resiliencia_select" ON user_resiliencia_patrones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "resiliencia_insert" ON user_resiliencia_patrones FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "resiliencia_update" ON user_resiliencia_patrones FOR UPDATE  USING (auth.uid() = user_id);

-- 9. SEED — sleepcasts (6 iniciales, Spotify URLs se añaden desde CMS)

INSERT INTO sleepcasts (nombre, duracion_min, protocolo, emocion_ideal, complejidad, referencias) VALUES
('Body Scan para el Descanso',       20, 'MBSR',        ARRAY['estres','ansiedad','burnout'],      'medio',    '{"autor":"Kabat-Zinn","año":1990,"libro":"Full Catastrophe Living"}'),
('Respiración 4-7-8 Nocturna',       10, 'MBSR',        ARRAY['ansiedad','estres'],                'ligero',   '{"autor":"Weil","año":2015,"libro":"Spontaneous Happiness"}'),
('Relajación Muscular Progresiva',   15, 'PMR',         ARRAY['estres','burnout'],                 'medio',    '{"autor":"Jacobson","año":1938,"libro":"Progressive Relaxation"}'),
('Hipnogogía Guiada',                30, 'Hipnogogía',  ARRAY['burnout','depresion'],              'profundo', '{"autor":"Andreas","año":2012,"libro":"Core Transformation"}'),
('Meditación de Gratitud Nocturna',  15, 'MBSR',        ARRAY['mantenimiento','ansiedad'],         'ligero',   '{"autor":"Emmons","año":2007,"libro":"Thanks!"}'),
('Visualización de Lugar Seguro',    20, 'CBT',         ARRAY['ansiedad','duelo','burnout'],       'profundo', '{"autor":"Beck","año":2011,"libro":"Cognitive Behavior Therapy"}')
ON CONFLICT DO NOTHING;

-- 10. SEED — tareas_biblioteca (muestra representativa, schema enriquecido)

INSERT INTO tareas_biblioteca
  (id, nombre, instruccion, por_que, ciencia_breve, protocolo, referencias, validaciones, emocion_target, motivacion_ideal, tiempo_min, tono, dia_semana, tipo)
VALUES

-- BURNOUT · pragmatico · 5min · diaria
('burnout:pragmatico:5min:1',
 'Registro de energía',
 'Escribe 1 frase: qué costó energía hoy, qué te la devolvió. Sin análisis. Solo registro.',
 'Necesitas datos reales, no sentimientos. Eso te ayuda a ver patrones.',
 'Recovery Science: registrar costo/beneficio entrena al cerebro a identificar límites reales.',
 'Recovery Science',
 '{"autor":"Gartner, Lahey","año":2023,"libro":"The Burnout Epidemic"}',
 '{"pragmatico_positivo":"Completaste. Eso es información real. +50 XP.","pragmatico_neutro":"Registraste aunque no se sintió bien. La consistencia es el cambio. +30 XP.","introspectivo_positivo":"Nombraste qué pasó hoy. Eso es conciencia. +50 XP.","comunitario_positivo":"Te cuidaste registrando tu verdad. +50 XP.","competitivo_positivo":"+50 XP. Streak activo. Vas en la dirección correcta."}',
 'burnout','pragmatico','5min','accion',1,'diaria'),

-- BURNOUT · introspectivo · 5min · diaria
('burnout:introspectivo:5min:1',
 'Respiración silenciosa',
 'Siéntate en un lugar tranquilo. Respira profundo 5 minutos. Nada más. Tu cuerpo necesita parar.',
 'Cuando estás agotado, tu sistema nervioso necesita desactivarse. Esto lo hace.',
 'MBSR: respiración diafragmática reduce cortisol en 15 minutos de práctica sostenida.',
 'MBSR',
 '{"autor":"Kabat-Zinn","año":1990,"libro":"Full Catastrophe Living"}',
 '{"introspectivo_positivo":"Sentiste tu cuerpo calmarse. Eso es lo que importa. +50 XP.","introspectivo_neutro":"Hoy tu mente no paró. Está bien. Viniste igual. +30 XP.","pragmatico_positivo":"5 minutos menos de cortisol. Bioquímica real. +50 XP.","competitivo_positivo":"+50 XP. Respiración completada. Streak activo."}',
 'burnout','introspectivo','5min','restaurativo',1,'diaria'),

-- BURNOUT · comunitario · 10min · diaria
('burnout:comunitario:10min:1',
 'Mensaje de conexión',
 'Escribe un mensaje a alguien que aprecias. No tiene que ser profundo. Solo genuino.',
 'El aislamiento amplifica el burnout. Un gesto de conexión lo interrumpe.',
 'Psicología positiva: actos prosociales aumentan oxitocina y reducen respuesta al estrés.',
 'Positive Psychology',
 '{"autor":"Seligman","año":2011,"libro":"Flourish"}',
 '{"comunitario_positivo":"Conectaste con alguien. Eso es bienestar real. +50 XP.","introspectivo_positivo":"Saliste de ti por un momento. Eso también es cuidado. +50 XP."}',
 'burnout','comunitario','10min','exploratorio',1,'diaria'),

-- BURNOUT · competitivo · 5min · diaria
('burnout:competitivo:5min:1',
 'Mini victoria documentada',
 'Escribe una cosa pequeña que completaste hoy. Una sola. Aunque sea mínima.',
 'El burnout te hace invisible lo que sí logras. Documentarlo lo hace real.',
 'Behavioral activation: registrar logros pequeños reactiva circuitos de motivación.',
 'CBT',
 '{"autor":"Beck","año":2011,"libro":"Cognitive Behavior Therapy"}',
 '{"competitivo_positivo":"+50 XP. Documentaste un logro. Streak activo.","competitivo_neutro":"Lo pequeño también cuenta. Apareciste. +30 XP."}',
 'burnout','competitivo','5min','accion',1,'diaria'),

-- ESTRÉS · pragmatico · 5min · diaria
('estres:pragmatico:5min:1',
 'Técnica 5-4-3-2-1',
 'Nombra: 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas. En orden.',
 'El estrés te saca del presente. Esta técnica te ancla al cuerpo en segundos.',
 'Terapia de exposición: activar los 5 sentidos interrumpe la respuesta de alarma del sistema nervioso.',
 'CBT',
 '{"autor":"Linehan","año":2014,"libro":"DBT Skills Training Manual"}',
 '{"pragmatico_positivo":"Técnica completada. Sistema nervioso anclado. +50 XP.","competitivo_positivo":"+50 XP. Streak activo. Técnica ejecutada."}',
 'estrés','pragmatico','5min','accion',1,'diaria'),

-- ESTRÉS · introspectivo · 10min · diaria
('estres:introspectivo:10min:1',
 'Escritura de descarga',
 'Pon un cronómetro en 10 minutos. Escribe sin parar lo que te pesa. Sin correcciones. Sin releerlo.',
 'Sacar la tensión del cuerpo a la página reduce su intensidad. No necesitas que tenga sentido.',
 'Expressive writing: James Pennebaker demostró que escribir sobre estrés reduce marcadores inflamatorios.',
 'Expressive Writing',
 '{"autor":"Pennebaker","año":1997,"libro":"Opening Up"}',
 '{"introspectivo_positivo":"Pusiste palabras al peso. Eso aligera. +50 XP.","introspectivo_neutro":"No fluyó pero escribiste. Eso también es práctica. +30 XP."}',
 'estrés','introspectivo','10min','exploratorio',1,'diaria'),

-- ANSIEDAD · pragmatico · 5min · diaria
('ansiedad:pragmatico:5min:1',
 'Respiración cuadrada',
 'Inhala 4s, sostén 4s, exhala 4s, sostén 4s. Repite 5 ciclos. Cierra los ojos si puedes.',
 'La respiración rítmica calma directamente el sistema nervioso autónomo que alimenta la ansiedad.',
 'Coherencia cardíaca: respiración a 0.1 Hz sincroniza ritmo cardíaco y reduce activación simpática.',
 'HeartMath',
 '{"autor":"McCraty","año":2015,"libro":"Science of the Heart"}',
 '{"pragmatico_positivo":"Ciclos completados. Frecuencia cardíaca estabilizada. +50 XP.","pragmatico_neutro":"Lo hiciste aunque no se sintió bien. La práctica funciona igual. +30 XP."}',
 'ansiedad','pragmatico','5min','accion',1,'diaria'),

-- ANSIEDAD · comunitario · 15min · diaria
('ansiedad:comunitario:15min:1',
 'Conversación de 15 minutos',
 'Llama o escribe a alguien de confianza. No para solucionar. Solo para estar en contacto.',
 'La ansiedad se alimenta del aislamiento. La conexión genuina la interrumpe.',
 'Social support: Uchino et al. demostraron que el apoyo social reduce reactividad cardiovascular al estrés.',
 'Social Support Theory',
 '{"autor":"Uchino","año":2004,"libro":"Social Support and Physical Health"}',
 '{"comunitario_positivo":"Conectaste. Eso es exactamente lo que necesitabas. +50 XP.","introspectivo_positivo":"Compartiste algo real. Eso toma valentía. +50 XP."}',
 'ansiedad','comunitario','15min','restaurativo',1,'diaria'),

-- MANTENIMIENTO · pragmatico · 5min · diaria
('mantenimiento:pragmatico:5min:1',
 'Meditación de atención focalizada',
 'Siéntate. Observa tu respiración por 5 minutos. Cada vez que la mente divague, regresa. Sin juzgar.',
 'Mantener la práctica en los días buenos es lo que hace que funcione en los difíciles.',
 'Neuroplasticidad: la práctica regular de atención sostenida engrosa la corteza prefrontal.',
 'MBSR',
 '{"autor":"Kabat-Zinn","año":2013,"libro":"Full Catastrophe Living (revised)"}',
 '{"pragmatico_positivo":"5 minutos de atención sostenida. Eso entrena el cerebro. +50 XP.","competitivo_positivo":"+50 XP. Streak activo. La consistencia es la clave."}',
 'mantenimiento','pragmatico','5min','accion',1,'diaria'),

-- MANTENIMIENTO · introspectivo · 20min+ · semanal
('mantenimiento:introspectivo:20min+:s1',
 'Revisión semanal profunda',
 '¿Qué semana tuve? ¿Qué me dio energía? ¿Qué me la quitó? ¿Qué quiero diferente? Escribe sin límite.',
 'La reflexión estructurada convierte experiencias en aprendizaje. Es la práctica más potente del mantenimiento.',
 'Metacognición: reflexionar sobre la propia experiencia activa integración prefrontal-límbica.',
 'Reflective Practice',
 '{"autor":"Schön","año":1983,"libro":"The Reflective Practitioner"}',
 '{"introspectivo_positivo":"Te escuchaste profundo. Eso es sabiduría propia. +100 XP.","pragmatico_positivo":"Datos de la semana recopilados. Útil para la siguiente. +100 XP."}',
 'mantenimiento','introspectivo','20min+','profundo',NULL,'semanal')

ON CONFLICT (id) DO NOTHING;
