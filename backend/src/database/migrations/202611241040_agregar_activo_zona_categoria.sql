-- RF-04: permite desactivar zonas y categorías sin borrar su histórico
ALTER TABLE zona
  ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1,
  ADD CONSTRAINT ck_zona_activo CHECK (activo IN (0, 1));
ALTER TABLE categoria
  ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1,
  ADD CONSTRAINT ck_categoria_activo CHECK (activo IN (0, 1));
