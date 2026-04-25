-- ============================================================
-- HOLIZENTER — Sistema de nivel, adherencia y respuestas
-- Ejecutar en Supabase SQL Editor (una sola vez)
-- ============================================================

-- 1. user_tareas_asignadas: completada_en + respuesta_usuario
ALTER TABLE user_tareas_asignadas
  ADD COLUMN IF NOT EXISTS completada_en     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS respuesta_usuario TEXT;

-- 2. user_gamification: nivel_actual del usuario
ALTER TABLE user_gamification
  ADD COLUMN IF NOT EXISTS nivel_actual INTEGER DEFAULT 1;

-- 3. tareas_biblioteca: nivel de dificultad de la tarea (1-4)
ALTER TABLE tareas_biblioteca
  ADD COLUMN IF NOT EXISTS nivel INTEGER DEFAULT 1;

-- 4. user_quiz_preferences: perfil del onboarding original (nunca se sobreescribe)
ALTER TABLE user_quiz_preferences
  ADD COLUMN IF NOT EXISTS perfil_inicial JSONB;

-- Índices
CREATE INDEX IF NOT EXISTS idx_tareas_completada_en ON user_tareas_asignadas(user_id, completada_en)
  WHERE completada_en IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tareas_bib_nivel ON tareas_biblioteca(emocion_target, nivel, motivacion_ideal);
