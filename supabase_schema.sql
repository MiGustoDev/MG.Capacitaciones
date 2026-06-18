-- 1. Crear la tabla de participantes
CREATE TABLE public.participants (
    user_name TEXT PRIMARY KEY,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    evaluation_score INTEGER,
    evaluation_failed BOOLEAN,
    completed_lessons_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar la seguridad a nivel de fila (Row Level Security - RLS)
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- 3. Crear las políticas para permitir accesos públicos (anónimos) a la base de datos:

-- A. Permitir lectura de registros a cualquiera (requerido para el panel del supervisor)
CREATE POLICY "Permitir lectura publica"
ON public.participants
FOR SELECT
USING (true);

-- B. Permitir inserción de nuevos registros a cualquiera
CREATE POLICY "Permitir insercion publica"
ON public.participants
FOR INSERT
WITH CHECK (true);

-- C. Permitir actualizaciones de registros existentes a cualquiera (para cuando continúan y completan la capacitación)
CREATE POLICY "Permitir actualizacion publica"
ON public.participants
FOR UPDATE
USING (true)
WITH CHECK (true);

-- D. Permitir eliminar registros (para cuando el supervisor borra registros desde el panel de control)
CREATE POLICY "Permitir eliminacion publica"
ON public.participants
FOR DELETE
USING (true);
