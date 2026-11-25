-- RF-01: el operario necesita una contraseña para iniciar sesión
ALTER TABLE operario
  ADD COLUMN contrasena_hash VARCHAR(255) NULL AFTER correo;
