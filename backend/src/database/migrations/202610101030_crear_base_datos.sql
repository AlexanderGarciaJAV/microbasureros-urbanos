-- GA6-220501096-AA2-EV01: implementacion del modelo (MySQL 8.0, InnoDB)
-- Contenido: estructura (DDL), trigger, datos de prueba y transiciones de estado
DROP DATABASE IF EXISTS microbasureros;
CREATE DATABASE microbasureros CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE microbasureros;

CREATE TABLE municipio (
  id_municipio     INT AUTO_INCREMENT PRIMARY KEY,
  nombre_municipio VARCHAR(100) NOT NULL,
  departamento     VARCHAR(100) NOT NULL,
  CONSTRAINT uq_municipio UNIQUE (nombre_municipio, departamento)
) ENGINE=InnoDB;

CREATE TABLE zona (
  id_zona      INT AUTO_INCREMENT PRIMARY KEY,
  nombre_zona  VARCHAR(100) NOT NULL,
  barrio       VARCHAR(100) NOT NULL,
  id_municipio INT NOT NULL,
  CONSTRAINT fk_zona_municipio FOREIGN KEY (id_municipio)
    REFERENCES municipio (id_municipio) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE categoria (
  id_categoria     INT AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria VARCHAR(80) NOT NULL,
  descripcion      TEXT NULL,
  CONSTRAINT uq_categoria_nombre UNIQUE (nombre_categoria)
) ENGINE=InnoDB;

CREATE TABLE estado_reporte (
  id_estado     TINYINT PRIMARY KEY,
  nombre_estado VARCHAR(30)  NOT NULL,
  descripcion   VARCHAR(150) NOT NULL,
  CONSTRAINT uq_estado_nombre UNIQUE (nombre_estado)
) ENGINE=InnoDB;

CREATE TABLE ciudadano (
  id_ciudadano    INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(80)  NOT NULL,
  apellido        VARCHAR(80)  NOT NULL,
  correo          VARCHAR(120) NOT NULL,
  telefono        VARCHAR(15)  NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  fecha_registro  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activo          TINYINT(1)   NOT NULL DEFAULT 1,
  CONSTRAINT uq_ciudadano_correo UNIQUE (correo),
  CONSTRAINT ck_ciudadano_correo CHECK (correo LIKE '%_@_%._%'),
  CONSTRAINT ck_ciudadano_telefono CHECK (telefono IS NULL OR telefono REGEXP '^[0-9]{7,15}$'),
  CONSTRAINT ck_ciudadano_activo CHECK (activo IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE administrador (
  id_admin        INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(80)  NOT NULL,
  apellido        VARCHAR(80)  NOT NULL,
  correo          VARCHAR(120) NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  rol             VARCHAR(50)  NOT NULL DEFAULT 'admin',
  activo          TINYINT(1)   NOT NULL DEFAULT 1,
  CONSTRAINT uq_admin_correo UNIQUE (correo),
  CONSTRAINT ck_admin_activo CHECK (activo IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE operario (
  id_operario INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(80)  NOT NULL,
  apellido    VARCHAR(80)  NOT NULL,
  cargo       VARCHAR(80)  NOT NULL,
  correo      VARCHAR(120) NOT NULL,
  activo      TINYINT(1)   NOT NULL DEFAULT 1,
  CONSTRAINT uq_operario_correo UNIQUE (correo),
  CONSTRAINT ck_operario_activo CHECK (activo IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE reporte (
  id_reporte    INT AUTO_INCREMENT PRIMARY KEY,
  descripcion   TEXT          NOT NULL,
  fecha_reporte DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  latitud       DECIMAL(10,7) NOT NULL,
  longitud      DECIMAL(10,7) NOT NULL,
  id_ciudadano  INT           NOT NULL,
  id_zona       INT           NOT NULL,
  id_categoria  INT           NOT NULL,
  id_estado     TINYINT       NOT NULL DEFAULT 1,
  CONSTRAINT ck_reporte_latitud  CHECK (latitud  BETWEEN -90 AND 90),
  CONSTRAINT ck_reporte_longitud CHECK (longitud BETWEEN -180 AND 180),
  CONSTRAINT fk_reporte_ciudadano FOREIGN KEY (id_ciudadano)
    REFERENCES ciudadano (id_ciudadano) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_reporte_zona FOREIGN KEY (id_zona)
    REFERENCES zona (id_zona) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_reporte_categoria FOREIGN KEY (id_categoria)
    REFERENCES categoria (id_categoria) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_reporte_estado FOREIGN KEY (id_estado)
    REFERENCES estado_reporte (id_estado) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_reporte_estado_fecha (id_estado, fecha_reporte),
  INDEX idx_reporte_zona_categoria (id_zona, id_categoria)
) ENGINE=InnoDB;

CREATE TABLE fotografia (
  id_foto     INT AUTO_INCREMENT PRIMARY KEY,
  url_imagen  VARCHAR(500) NOT NULL,
  fecha_carga DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_reporte  INT          NOT NULL,
  CONSTRAINT fk_foto_reporte FOREIGN KEY (id_reporte)
    REFERENCES reporte (id_reporte) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE accion_limpieza (
  id_accion    INT AUTO_INCREMENT PRIMARY KEY,
  fecha_accion DATETIME NOT NULL,
  descripcion  TEXT     NOT NULL,
  resultado    ENUM('Limpieza_total','Limpieza_parcial','Sin_accion') NOT NULL,
  id_reporte   INT      NOT NULL,
  id_operario  INT      NOT NULL,
  CONSTRAINT fk_accion_reporte FOREIGN KEY (id_reporte)
    REFERENCES reporte (id_reporte) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_accion_operario FOREIGN KEY (id_operario)
    REFERENCES operario (id_operario) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_accion_fecha (fecha_accion)
) ENGINE=InnoDB;

CREATE TABLE historial_estado (
  id_historial       INT AUTO_INCREMENT PRIMARY KEY,
  fecha_cambio       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_reporte         INT      NOT NULL,
  id_estado_anterior TINYINT  NULL,
  id_estado_nuevo    TINYINT  NOT NULL,
  id_operario        INT      NULL,
  id_admin           INT      NULL,
  CONSTRAINT ck_hist_autor  CHECK (id_operario IS NULL OR id_admin IS NULL),
  CONSTRAINT ck_hist_estado CHECK (id_estado_anterior IS NULL OR id_estado_anterior <> id_estado_nuevo),
  CONSTRAINT fk_hist_reporte FOREIGN KEY (id_reporte)
    REFERENCES reporte (id_reporte) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_hist_estado_ant FOREIGN KEY (id_estado_anterior)
    REFERENCES estado_reporte (id_estado) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_hist_estado_nuevo FOREIGN KEY (id_estado_nuevo)
    REFERENCES estado_reporte (id_estado) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_hist_operario FOREIGN KEY (id_operario)
    REFERENCES operario (id_operario) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_hist_admin FOREIGN KEY (id_admin)
    REFERENCES administrador (id_admin) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

DELIMITER $$
CREATE TRIGGER trg_reporte_resuelto
BEFORE UPDATE ON reporte
FOR EACH ROW
BEGIN
  IF NEW.id_estado = 3 AND OLD.id_estado <> 3
     AND NOT EXISTS (SELECT 1 FROM accion_limpieza WHERE id_reporte = NEW.id_reporte) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Regla de negocio: un reporte no puede pasar a Resuelto sin acciones de limpieza';
  END IF;
END$$
DELIMITER ;



INSERT INTO estado_reporte (id_estado, nombre_estado, descripcion) VALUES
  (1, 'Pendiente',  'Reporte registrado, sin atender'),
  (2, 'En proceso', 'Reporte en atencion por un operario'),
  (3, 'Resuelto',   'Microbasurero limpiado'),
  (4, 'Rechazado',  'Reporte no procedente');

INSERT INTO municipio (nombre_municipio, departamento) VALUES
  ('San Alberto', 'Cesar'), ('Aguachica', 'Cesar'), ('Armenia', 'Quindío');

INSERT INTO zona (nombre_zona, barrio, id_municipio) VALUES
  ('Zona Centro',   'Centro',        1),
  ('Zona Norte',    'La Esperanza',  1),
  ('Zona Sur',      'El Progreso',   1),
  ('Ribera Quebrada','Villa Nueva',  1),
  ('Zona Centro',   'San José',      2),
  ('Zona Oriental', 'Los Almendros', 2),
  ('Zona Industrial','Quimbaya',     3);

INSERT INTO categoria (nombre_categoria, descripcion) VALUES
  ('Escombros',            'Residuos de construcción y demolición'),
  ('Residuos orgánicos',   'Restos de comida, poda y material vegetal'),
  ('Llantas',              'Llantas y neumáticos en desuso'),
  ('Residuos domiciliarios','Basura doméstica mezclada'),
  ('Voluminosos',          'Muebles, colchones y electrodomésticos');

INSERT INTO ciudadano (nombre, apellido, correo, telefono, contrasena_hash, fecha_registro) VALUES
  ('Laura',    'Martínez', 'laura.martinez@example.com',  '3101234567', '$2b$10$hashDePrueba0001', '2026-09-01 08:15:00'),
  ('Pedro',    'Ramírez',  'pedro.ramirez@example.com',   '3112345678', '$2b$10$hashDePrueba0002', '2026-09-03 10:20:00'),
  ('Camila',   'Torres',   'camila.torres@example.com',   '3123456789', '$2b$10$hashDePrueba0003', '2026-09-05 14:05:00'),
  ('Andrés',   'Gómez',    'andres.gomez@example.com',    NULL,         '$2b$10$hashDePrueba0004', '2026-09-10 09:40:00'),
  ('Valentina','Rojas',    'valentina.rojas@example.com', '3145678901', '$2b$10$hashDePrueba0005', '2026-09-12 16:30:00'),
  ('Diego',    'Castro',   'diego.castro@example.com',    '3156789012', '$2b$10$hashDePrueba0006', '2026-09-15 11:10:00');

INSERT INTO administrador (nombre, apellido, correo, contrasena_hash, rol) VALUES
  ('Administrador', 'Principal',  'admin@microbasureros.example.com',      '$2b$10$hashDePrueba0101', 'admin'),
  ('Sandra',        'Villamizar', 'supervision@microbasureros.example.com','$2b$10$hashDePrueba0102', 'supervisor');

INSERT INTO operario (nombre, apellido, cargo, correo) VALUES
  ('Jorge',  'Salazar',  'Operario de aseo',        'jorge.salazar@aseo.example.com'),
  ('Marta',  'Quintero', 'Conductora de volqueta',  'marta.quintero@aseo.example.com'),
  ('Luis',   'Herrera',  'Supervisor de cuadrilla', 'luis.herrera@aseo.example.com');

INSERT INTO reporte (descripcion, fecha_reporte, latitud, longitud, id_ciudadano, id_zona, id_categoria) VALUES
  ('Montón de escombros en la esquina del parque',     '2026-09-20 07:45:00', 7.7625000, -73.3917000, 1, 1, 1),
  ('Basura acumulada junto al caño',                   '2026-09-22 18:10:00', 7.7681000, -73.3950000, 2, 2, 4),
  ('Llantas abandonadas en lote baldío',               '2026-09-25 09:30:00', 7.7590000, -73.3880000, 3, 3, 3),
  ('Restos de poda frente a la escuela',               '2026-09-27 12:00:00', 7.7640000, -73.3935000, 1, 1, 2),
  ('Colchones y sillas en la vía principal',           '2026-10-01 08:20:00', 7.7702000, -73.3961000, 4, 2, 5),
  ('Escombros sobre la ribera de la quebrada',         '2026-10-02 15:35:00', 7.7555000, -73.3902000, 5, 4, 1),
  ('Basura domiciliaria tirada en la calle',           '2026-10-03 06:50:00', 7.7611000, -73.3925000, 2, 1, 4),
  ('Llantas apiladas detrás del taller',               '2026-10-04 10:15:00', 8.3080000, -73.6150000, 6, 5, 3),
  ('Material vegetal en el separador vial',            '2026-10-05 17:25:00', 8.3112000, -73.6098000, 3, 6, 2),
  ('Escombros de obra frente al colegio',              '2026-10-06 13:40:00', 7.7668000, -73.3944000, 1, 2, 1),
  ('Electrodomésticos viejos en zona industrial',      '2026-10-07 09:05:00', 4.5339000, -75.6811000, 5, 7, 5),
  ('Bolsas de basura en la esquina del mercado',       '2026-10-08 07:10:00', 7.7630000, -73.3910000, 4, 1, 4);

INSERT INTO fotografia (url_imagen, fecha_carga, id_reporte) VALUES
  ('/uploads/rep01_a.jpg', '2026-09-20 07:46:00', 1), ('/uploads/rep01_b.jpg', '2026-09-20 07:46:30', 1),
  ('/uploads/rep02_a.jpg', '2026-09-22 18:11:00', 2),
  ('/uploads/rep03_a.jpg', '2026-09-25 09:31:00', 3), ('/uploads/rep03_b.jpg', '2026-09-25 09:31:20', 3),
  ('/uploads/rep04_a.jpg', '2026-09-27 12:01:00', 4),
  ('/uploads/rep05_a.jpg', '2026-10-01 08:21:00', 5), ('/uploads/rep05_b.jpg', '2026-10-01 08:21:40', 5),
  ('/uploads/rep06_a.jpg', '2026-10-02 15:36:00', 6),
  ('/uploads/rep07_a.jpg', '2026-10-03 06:51:00', 7),
  ('/uploads/rep08_a.jpg', '2026-10-04 10:16:00', 8),
  ('/uploads/rep09_a.jpg', '2026-10-05 17:26:00', 9),
  ('/uploads/rep10_a.jpg', '2026-10-06 13:41:00', 10), ('/uploads/rep10_b.jpg', '2026-10-06 13:41:30', 10),
  ('/uploads/rep11_a.jpg', '2026-10-07 09:06:00', 11),
  ('/uploads/rep12_a.jpg', '2026-10-08 07:11:00', 12);

INSERT INTO historial_estado (fecha_cambio, id_reporte, id_estado_anterior, id_estado_nuevo)
SELECT fecha_reporte, id_reporte, NULL, 1 FROM reporte;

INSERT INTO accion_limpieza (fecha_accion, descripcion, resultado, id_reporte, id_operario) VALUES
  ('2026-09-21 08:00:00', 'Retiro parcial con volqueta',               'Limpieza_parcial', 1, 1),
  ('2026-09-23 08:30:00', 'Retiro del material restante',              'Limpieza_total',   1, 2),
  ('2026-09-24 09:00:00', 'Recolección de basura y limpieza del caño', 'Limpieza_total',   2, 1),
  ('2026-09-29 10:00:00', 'Recolección de llantas enviadas a gestor',  'Limpieza_parcial', 3, 3),
  ('2026-10-03 08:00:00', 'Retiro de restos de poda',                  'Limpieza_total',   4, 2),
  ('2026-10-08 09:00:00', 'Retiro parcial de escombros de la ribera',  'Limpieza_parcial', 6, 1),
  ('2026-10-09 08:00:00', 'Recolección de material vegetal',           'Limpieza_total',   9, 2);



-- Transiciones de estado: cada UPDATE de reporte va con su registro en historial_estado
START TRANSACTION;

UPDATE reporte SET id_estado = 2 WHERE id_reporte IN (1, 2, 3, 4, 6, 9, 11);
INSERT INTO historial_estado (fecha_cambio, id_reporte, id_estado_anterior, id_estado_nuevo, id_operario) VALUES
  ('2026-09-21 07:30:00', 1, 1, 2, 1), ('2026-09-23 07:45:00', 2, 1, 2, 1),
  ('2026-09-28 08:00:00', 3, 1, 2, 3), ('2026-10-02 07:00:00', 4, 1, 2, 2),
  ('2026-10-08 08:30:00', 6, 1, 2, 1), ('2026-10-09 07:30:00', 9, 1, 2, 2),
  ('2026-10-09 10:00:00', 11, 1, 2, 3);

UPDATE reporte SET id_estado = 3 WHERE id_reporte IN (1, 2, 4, 9);
INSERT INTO historial_estado (fecha_cambio, id_reporte, id_estado_anterior, id_estado_nuevo, id_operario) VALUES
  ('2026-09-23 09:30:00', 1, 2, 3, 2), ('2026-09-24 10:30:00', 2, 2, 3, 1),
  ('2026-10-03 09:00:00', 4, 2, 3, 2), ('2026-10-09 09:00:00', 9, 2, 3, 2);

UPDATE reporte SET id_estado = 4 WHERE id_reporte = 7;
INSERT INTO historial_estado (fecha_cambio, id_reporte, id_estado_anterior, id_estado_nuevo, id_admin) VALUES
  ('2026-10-04 11:00:00', 7, 1, 4, 1);

COMMIT;

