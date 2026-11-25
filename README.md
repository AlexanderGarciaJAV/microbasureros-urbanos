# Limpieza Urbana · Microbasureros Urbanos

Sistema Ciudadano de Reporte de Microbasureros Urbanos. Es una aplicación web en la que los
ciudadanos reportan puntos de acumulación irregular de residuos con fotografía y ubicación, los
operarios de aseo registran las acciones de limpieza y los administradores gestionan zonas,
categorías y estadísticas.

Proyecto formativo del Tecnólogo en Análisis y Desarrollo de Software, SENA, ficha 3336057.
Autor: Javier Alexander Garcia Mariño.

## Estado del proyecto

| Parte | Estado |
|---|---|
| Base de datos MySQL (11 tablas, trigger y datos de prueba) | Terminada |
| Frontend en React (pantallas de RF-01 a RF-05 con datos en memoria) | Versión inicial |
| Backend en Node.js (estructura, configuración y manejo de errores) | En construcción |

## Requerimientos funcionales

| Código | Requerimiento | Rol |
|---|---|---|
| RF-01 | Registro e inicio de sesión | Todos |
| RF-02 | Registro de reportes con fotografía y ubicación | Ciudadano |
| RF-03 | Registro de acciones de limpieza y cambio de estado | Operario |
| RF-04 | Gestión de zonas y categorías | Administrador |
| RF-05 | Estadísticas por zona y categoría | Administrador |

## Tecnologías

- Frontend: React 18, Vite 5 y React Router 6.
- Backend: Node.js, Express 4 y mysql2.
- Base de datos: MySQL 8 (InnoDB, utf8mb4).
- Calidad: ESLint 8 y Prettier 3.

## Requisitos

- Node.js 18 o superior y npm.
- MySQL 8.
- Git 2.23 o superior.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/AlexanderGarciaJAV/microbasureros-urbanos.git
   cd microbasureros-urbanos
   git switch develop
   ```

2. Crear la base de datos y aplicar las migraciones en orden. El primer script borra y vuelve a
   crear la base `microbasureros`, por lo que solo se usa en una instalación nueva:

   ```bash
   cd backend/src/database/migrations
   mysql -u root -p < 202610101030_crear_base_datos.sql
   mysql -u root -p microbasureros < 202611241030_agregar_contrasena_operario.sql
   mysql -u root -p microbasureros < 202611241040_agregar_activo_zona_categoria.sql
   cd ../../../..
   ```

3. Instalar y configurar el backend. En el archivo `.env` se escriben los datos de MySQL:

   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

   La API queda en http://localhost:3000 y se comprueba en http://localhost:3000/api/v1/salud.

4. Instalar y ejecutar el frontend en otra terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   La aplicación queda en http://localhost:5173.

## Cuentas de demostración

Los datos son ficticios y solo funcionan en el frontend mientras no se conecta a la API.

| Rol | Correo | Contraseña |
|---|---|---|
| Ciudadano | laura.martinez@example.com | Ciudadano123 |
| Operario | jorge.salazar@aseo.example.com | Operario123 |
| Administrador | admin@microbasureros.example.com | Admin12345 |

## Comandos

| Comando | Carpeta | Qué hace |
|---|---|---|
| `npm run dev` | frontend y backend | Inicia el servidor de desarrollo |
| `npm run build` | frontend | Genera la versión de producción en `dist/` |
| `npm run lint` | frontend y backend | Revisa el código con ESLint |
| `npm run format` | frontend y backend | Aplica el formato de Prettier |

## Estructura

```text
microbasureros-urbanos/
├── .github/                  plantilla de pull request
├── backend/
│   ├── src/config/           variables de entorno y conexión a MySQL
│   ├── src/database/         migraciones SQL
│   ├── src/shared/           errores y middlewares comunes
│   ├── src/app.js            configura Express
│   ├── src/server.js         abre el puerto
│   └── uploads/              fotografías (no se versionan)
├── frontend/
│   └── src/                  components, pages, context, utils y assets
├── .gitattributes
├── .gitignore
├── .prettierrc
└── README.md
```

## Ramas

| Rama | Uso |
|---|---|
| `main` | Versión estable; cada entrega lleva una etiqueta |
| `develop` | Integración de las tareas terminadas |
| `feature/MBU-NN-descripcion` | Funcionalidad del backlog; sale de `develop` |
| `fix/MBU-NN-descripcion` | Corrección no urgente; sale de `develop` |
| `docs/MBU-NN-descripcion` | Documentación; sale de `develop` |
| `release/vX.Y` | Preparación de una versión; sale de `develop` y llega a `main` |
| `hotfix/MBU-NN-descripcion` | Corrección urgente; sale de `main` |

## Mensajes de commit

Se usa Conventional Commits con el identificador de la tarea del tablero:

```text
<tipo>(<alcance>): <descripción en infinitivo> [MBU-NN]
feat(backend): agregar middleware central de errores [MBU-07]
```
