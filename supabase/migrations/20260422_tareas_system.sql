-- ============================================================
-- SISTEMA DE TAREAS DIARIAS PERSONALIZADAS — Holizenter
-- Ejecutar en Supabase SQL Editor (una sola vez)
-- ============================================================

-- 1. TABLAS

CREATE TABLE IF NOT EXISTS user_quiz_preferences (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  perfil_motivacional   TEXT CHECK (perfil_motivacional IN ('pragmático','introspectivo','comunitario','competitivo')),
  emocion_actual        TEXT CHECK (emocion_actual IN ('mantenimiento','ansiedad','estrés','burnout')),
  tiempo_disponible     TEXT CHECK (tiempo_disponible IN ('5min','10min','15min','20min+')),
  tono_intencional      TEXT CHECK (tono_intencional IN ('acción','exploratorio','restaurativo','profundo')),
  preguntas_usadas      JSONB DEFAULT '[]',
  updated_at            TIMESTAMPTZ DEFAULT now(),
  created_at            TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS user_tareas_asignadas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tarea_id        TEXT NOT NULL,
  fecha_asignada  DATE NOT NULL,
  completada      BOOLEAN DEFAULT false,
  emocion_antes   INTEGER CHECK (emocion_antes BETWEEN 1 AND 10),
  emocion_despues INTEGER CHECK (emocion_despues BETWEEN 1 AND 10),
  notas           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, fecha_asignada)
);

CREATE TABLE IF NOT EXISTS tareas_pool (
  id               TEXT PRIMARY KEY,
  nombre           TEXT NOT NULL,
  instruccion      TEXT NOT NULL,
  duracion_min     INTEGER,
  emocion_target   TEXT NOT NULL CHECK (emocion_target IN ('burnout','estrés','ansiedad','mantenimiento')),
  motivacion_ideal TEXT CHECK (motivacion_ideal IN ('pragmático','introspectivo','comunitario','competitivo')),
  tiempo_min       TEXT CHECK (tiempo_min IN ('5min','10min','15min','20min+')),
  tono             TEXT CHECK (tono IN ('acción','exploratorio','restaurativo','profundo')),
  por_que          TEXT,
  dia_semana       INTEGER CHECK (dia_semana BETWEEN 1 AND 7)
);

CREATE TABLE IF NOT EXISTS user_gamification (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  xp_total          INTEGER DEFAULT 0,
  streak_actual     INTEGER DEFAULT 0,
  streak_maximo     INTEGER DEFAULT 0,
  ultima_tarea_fecha DATE,
  badges_collected  TEXT[] DEFAULT '{}',
  rewards_redeemed  TEXT[] DEFAULT '{}',
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 2. ÍNDICES

CREATE INDEX IF NOT EXISTS idx_user_quiz_pref    ON user_quiz_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tareas       ON user_tareas_asignadas(user_id, fecha_asignada);
CREATE INDEX IF NOT EXISTS idx_tareas_pool_main  ON tareas_pool(emocion_target, dia_semana);
CREATE INDEX IF NOT EXISTS idx_tareas_pool_full  ON tareas_pool(emocion_target, motivacion_ideal, tiempo_min);

-- 3. RLS

ALTER TABLE user_quiz_preferences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tareas_asignadas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas_pool            ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_quiz_pref_select" ON user_quiz_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_quiz_pref_insert" ON user_quiz_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_quiz_pref_update" ON user_quiz_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_tareas_select" ON user_tareas_asignadas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_tareas_insert" ON user_tareas_asignadas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_tareas_update" ON user_tareas_asignadas FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "tareas_pool_public_read" ON tareas_pool FOR SELECT USING (true);

CREATE POLICY "user_gamif_select" ON user_gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_gamif_insert" ON user_gamification FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_gamif_update" ON user_gamification FOR UPDATE USING (auth.uid() = user_id);

-- 4. SEED — tareas_pool (28 tareas base: 4 emociones × 7 días)

INSERT INTO tareas_pool (id, nombre, instruccion, duracion_min, emocion_target, motivacion_ideal, tiempo_min, tono, por_que, dia_semana) VALUES

-- BURNOUT
('burnout_d1','Respiración 4-7-8','Inhala 4 segundos, retén 7, exhala 8. Repite 4 veces. Hazlo sentado, con los ojos cerrados.',5,'burnout','pragmático','5min','acción','Tu sistema nervioso está saturado. Esta técnica activa el freno fisiológico en menos de 2 minutos.',1),
('burnout_d2','Body scan en cama','Acostado, lleva tu atención lentamente de los pies a la cabeza. Sin juzgar. Solo observar.',10,'burnout','introspectivo','10min','restaurativo','El cuerpo guarda el agotamiento. Escucharlo es el primer paso para soltarlo.',2),
('burnout_d3','Caminata sin destino','Sal 15 minutos sin teléfono, sin prisa. Observa 5 cosas que no habías notado antes.',15,'burnout','comunitario','15min','exploratorio','Desconectarte del mundo digital y reconectarte con el físico resetea el cortisol.',3),
('burnout_d4','Diario de lo mínimo','Escribe solo 3 líneas: ¿Qué pasó hoy? ¿Cómo me siento? ¿Qué necesito mañana?',5,'burnout','introspectivo','5min','profundo','Nombrar lo que sientes lo hace manejable. No necesitas escribir mucho, solo lo honesto.',4),
('burnout_d5','Pausa activa guiada','Cada hora, detente 1 minuto: estira el cuello, mueve los hombros, respira 3 veces profundo.',5,'burnout','pragmático','5min','acción','El burnout se alimenta de la hiperactividad continua. Pausas cortas rompen ese ciclo.',5),
('burnout_d6','Meditación de compasión','Siéntate cómodo. Imagina a alguien que quieres. Desea que esté bien. Luego haz lo mismo por ti.',10,'burnout','introspectivo','10min','restaurativo','Cuando estamos agotados, somos los más duros con nosotros mismos. Esta práctica lo interrumpe.',6),
('burnout_d7','Carta sin enviar','Escribe una carta a tu versión más cansada. Dile lo que necesitaría escuchar. No la envíes.',20,'burnout','introspectivo','20min+','profundo','Poner palabras al agotamiento profundo crea distancia y perspectiva. Es liberador.',7),

-- ESTRÉS
('estres_d1','Técnica 5-4-3-2-1','Nombra: 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas.',5,'estrés','pragmático','5min','acción','El estrés te saca del presente. Esta técnica te ancla al cuerpo en segundos.',1),
('estres_d2','Estiramientos de cuello','Inclina la cabeza a cada lado 30 segundos. Luego rota suavemente. Repite 3 veces.',10,'estrés','pragmático','10min','restaurativo','La tensión muscular es estrés acumulado. Soltarla físicamente libera también la mental.',2),
('estres_d3','Lista de lo que controlo','Escribe dos columnas: lo que puedes controlar hoy vs. lo que no. Enfócate en la primera.',5,'estrés','competitivo','5min','acción','El estrés se intensifica cuando sentimos que no controlamos nada. Esta lista te devuelve agencia.',3),
('estres_d4','Respiración abdominal','Pon una mano en el vientre. Inhala lento hasta que la mano suba. Exhala doble tiempo. 5 veces.',5,'estrés','introspectivo','5min','restaurativo','Respirar desde el vientre activa el sistema parasimpático y baja la respuesta de alarma.',4),
('estres_d5','Paseo de aire libre','Camina 15 minutos al aire libre. Sin auriculares. Observa el cielo y lo que te rodea.',15,'estrés','comunitario','15min','exploratorio','El entorno natural baja el cortisol. No necesitas meditar, solo caminar y estar presente.',5),
('estres_d6','Jarra de preocupaciones','Escribe tus preocupaciones en papelitos y mételos en un frasco. Ciérralo. Revisarás mañana.',10,'estrés','introspectivo','10min','exploratorio','Externalizar las preocupaciones le dice a tu mente que están "guardadas" y puede descansar.',6),
('estres_d7','Revisión semanal','¿Qué funcionó esta semana? ¿Qué no? ¿Qué cambiarías? Escribe 3 respuestas en 20 minutos.',20,'estrés','pragmático','20min+','profundo','Reflexionar con estructura convierte el caos de la semana en aprendizaje accionable.',7),

-- ANSIEDAD
('ansiedad_d1','Respiración cuadrada','Inhala 4s, sostén 4s, exhala 4s, sostén 4s. Repite 5 ciclos. Cierra los ojos.',5,'ansiedad','pragmático','5min','acción','La respiración rítmica calma directamente el sistema nervioso autónomo que alimenta la ansiedad.',1),
('ansiedad_d2','Escritura libre','Pon un cronómetro en 5 minutos. Escribe sin parar, sin corregir, lo que sientes ahora.',5,'ansiedad','introspectivo','5min','exploratorio','Sacar la ansiedad del cuerpo a la página reduce su intensidad. No necesitas que tenga sentido.',2),
('ansiedad_d3','Movimiento libre','Pon música que te guste. Mueve el cuerpo como quieras por 10 minutos. Sin coreografía.',10,'ansiedad','comunitario','10min','restaurativo','La ansiedad se almacena en el cuerpo. El movimiento libre la procesa sin que tengas que pensar.',3),
('ansiedad_d4','Técnica de anclaje físico','Pon los pies en el suelo. Siente el peso de tu cuerpo. Aprieta y suelta los puños 5 veces.',5,'ansiedad','pragmático','5min','acción','El anclaje físico interrumpe el ciclo de pensamientos ansiosos y te trae al momento presente.',4),
('ansiedad_d5','Meditación de amabilidad','Cierra los ojos. Repite: "Que yo esté bien. Que yo esté tranquilo. Que yo esté en paz." 5 min.',15,'ansiedad','comunitario','15min','profundo','La auto-compasión reduce la autocrítica que amplifica la ansiedad.',5),
('ansiedad_d6','Lo que puedo y no controlar','Dibuja dos círculos. Dentro: lo que controlas hoy. Fuera: lo que no. Suelta mentalmente lo exterior.',10,'ansiedad','competitivo','10min','acción','La ansiedad florece en la ilusión de control total. Soltar conscientemente lo incontrolable libera.',6),
('ansiedad_d7','Reflexión guiada','Pregúntate: ¿A qué le tengo miedo realmente? ¿Qué haría si no tuviera miedo? Escribe 10 min.',20,'ansiedad','introspectivo','20min+','profundo','Ir al fondo de la ansiedad en un espacio seguro reduce su poder.',7),

-- MANTENIMIENTO
('mant_d1','Meditación de 5 min','Siéntate. Observa tu respiración natural por 5 minutos. Cuando la mente se distraiga, vuelve.',5,'mantenimiento','pragmático','5min','acción','Mantener la práctica en los días buenos es lo que hace que funcione en los difíciles.',1),
('mant_d2','Journaling de intención','¿Cuál es mi intención para hoy? ¿Cómo quiero sentirme al final del día? Escribe 10 min.',10,'mantenimiento','introspectivo','10min','exploratorio','Comenzar el día con intención consciente cambia cómo navegas lo que venga.',2),
('mant_d3','Caminata consciente','Camina 15 min prestando atención a cada paso, a tu respiración, al entorno. Sin música.',15,'mantenimiento','comunitario','15min','exploratorio','En el mantenimiento, la práctica es cultivar presencia en lo cotidiano.',3),
('mant_d4','Práctica de gratitud','Escribe 3 cosas específicas por las que hoy estás agradecido/a y por qué. No repitas del día anterior.',5,'mantenimiento','introspectivo','5min','profundo','La gratitud específica (no genérica) recablea los circuitos del bienestar.',4),
('mant_d5','Reto personal pequeño','Define una cosa pequeña que te incomode un poco y hazla hoy. Luego anota cómo te sentiste.',10,'mantenimiento','competitivo','10min','acción','El crecimiento está justo al borde de la zona de confort. Pequeños retos la expanden.',5),
('mant_d6','Respiración corazón','Respira al ritmo: inhala 5s, exhala 5s. Pon una mano en el corazón. Hazlo 5 minutos.',5,'mantenimiento','pragmático','5min','restaurativo','La coherencia cardíaca en mantenimiento mejora la regulación emocional a largo plazo.',6),
('mant_d7','Visualización semanal','Cierra los ojos. Visualiza la semana que viene. ¿Cómo quieres sentirte? ¿Qué priorizarás?',20,'mantenimiento','introspectivo','20min+','profundo','Preparar la mente para la semana siguiente desde la calma mejora la toma de decisiones.',7)

ON CONFLICT (id) DO NOTHING;
