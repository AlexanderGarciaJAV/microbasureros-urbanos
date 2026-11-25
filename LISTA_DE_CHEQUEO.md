# Lista de chequeo

Verificación del frontend del proyecto formativo.

| Dato | Valor |
|---|---|
| Proyecto | Sistema Ciudadano de Reporte de Microbasureros Urbanos |
| Aprendiz | Javier Alexander Garcia Mariño |
| Ficha | 3336057 |
| Evidencia | GA7-220501096-AA4-EV01 |
| Versión revisada | v1.1.0 |
| Fecha de revisión | 24 de noviembre de 2026 |
| Repositorio | https://github.com/AlexanderGarciaJAV/microbasureros-urbanos |

## Componentes reutilizables

| N.º | Ítem | Cumple | Observación |
|---|---|---|---|
| 1 | Existen botones, campos y tablas en una carpeta común | Sí | components/ui tiene 28 archivos. Boton.jsx, Campo.jsx y TablaDatos.jsx son la base de las demás vistas. |
| 2 | Los componentes reciben propiedades y no conocen el módulo que los usa | Sí | TablaDatos recibe columnas, filas y acciones. La misma tabla muestra zonas, categorías y reportes recientes. |
| 3 | Los campos muestran etiqueta, ayuda y error | Sí | CampoTexto, CampoArea, CampoSeleccion y CampoContrasena se apoyan en Campo.jsx. |
| 4 | No hay botones ni campos repetidos en las páginas | Sí | Las páginas importan los componentes. El catálogo en /componentes muestra variantes y estados. |

## Formularios con validaciones

| N.º | Ítem | Cumple | Observación |
|---|---|---|---|
| 5 | Los campos obligatorios se validan | Sí | Se comprobó en ingreso, registro, reporte, acción de limpieza, cambio de estado, zona y categoría. |
| 6 | Se valida el formato del correo | Sí | Con laura@ aparece: Revisa el correo. Ejemplo: nombre@dominio.com. |
| 7 | Se validan números y rangos | Sí | Con latitud 95 aparece: Escribe un número entre -90 y 90. |
| 8 | Se validan longitudes | Sí | Con una descripción de 5 letras el mensaje indica el mínimo de 10 y cuántas lleva. |
| 9 | Se valida el archivo | Sí | Con un archivo de texto aparece: Ese archivo no sirve. Usa una imagen JPG o PNG. |
| 10 | Se detectan datos repetidos | Sí | Se rechazó un correo ya registrado y una zona con el mismo nombre, barrio y municipio. |
| 11 | Los mensajes indican cómo corregir | Sí | Cada error dice qué pasó y qué hacer. El foco va al primer campo con error. |

## Navegación entre módulos

| N.º | Ítem | Cumple | Observación |
|---|---|---|---|
| 12 | El menú lleva a todos los módulos | Sí | El menú sale de routes/rutas.js y cambia según el rol. |
| 13 | Las rutas se declaran en un solo lugar | Sí | AppRouter.jsx tiene todas las rutas. |
| 14 | Las rutas protegidas piden sesión y rol | Sí | Al abrir /gestion sin sesión se vuelve al acceso. Con otro rol se vuelve al inicio de ese rol. |
| 15 | Hay respuesta para una ruta que no existe | Sí | Al abrir /nada aparece Página no encontrada con enlace al inicio. |
| 16 | Los módulos interactúan entre sí | Sí | El reporte REP-013 creado por el ciudadano apareció en Tareas y en Estadísticas sin recargar. |

## Gestión de estados

| N.º | Ítem | Cumple | Observación |
|---|---|---|---|
| 17 | Hay estado local en los formularios | Sí | useFormulario.js guarda valores, errores y envío. |
| 18 | Hay estado global separado por tema | Sí | AuthContext, DatosContext y AvisoContext. |
| 19 | Las tablas se actualizan al agregar | Sí | Al crear Zona Verde la tabla pasó de 7 a 8 registros. |
| 20 | Las tablas se actualizan al editar y eliminar | Sí | Al eliminar Zona Verde la fila salió de la tabla. Al desactivar una zona cambió su estado. |
| 21 | Los indicadores se recalculan | Sí | Después de crear y resolver REP-013 pasaron a 13 reportes y 5 resueltos. |
| 22 | Se muestran estados de carga, vacío y error | Sí | Cargando.jsx, EstadoVacio.jsx y Alerta.jsx con botón Reintentar. |

## Separación de responsabilidades

| N.º | Ítem | Cumple | Observación |
|---|---|---|---|
| 23 | Las validaciones están fuera de las vistas | Sí | utils/validadores.js tiene las reglas y cada módulo su archivo validar. |
| 24 | La lógica de negocio está fuera de las vistas | Sí | Las transiciones, los duplicados y los bloqueos están en src/api. |
| 25 | El código se organiza por módulo | Sí | features/auth, reportes, acciones-limpieza, gestion y estadisticas. |
| 26 | Un módulo no importa de otro | Sí | Se buscó entre las importaciones. Lo compartido está en components, hooks y utils. |
| 27 | Se aplican los principios SOLID | Sí | Los servicios llegan por propiedad a los proveedores. El detalle está en docs/COMPONENTES.md. |

## Datos de prueba

| N.º | Ítem | Cumple | Observación |
|---|---|---|---|
| 28 | Hay datos simulados coherentes con la base de datos | Sí | datosPrueba.js usa los mismos ids de estado, zona y categoría del modelo relacional. |
| 29 | Los datos se consultan con servicios | Sí | crearServiciosMemoria entrega funciones asíncronas que luego se cambian por llamadas a la API. |
| 30 | Los datos son ficticios | Sí | Nombres y correos inventados con el dominio example.com. |

## Experiencia de usuario y accesibilidad

| N.º | Ítem | Cumple | Observación |
|---|---|---|---|
| 31 | El diseño se adapta a celular | Sí | A 375 px y a 683 px (ampliación del 200 %) no hay desplazamiento horizontal. Las tablas pasan a tarjetas. |
| 32 | Se puede usar con teclado | Sí | Pestañas con flechas, diálogo con Tab y Escape, y enlace para saltar al contenido. |
| 33 | El contraste cumple WCAG 2.1 AA | Sí | El texto va de 5,95:1 a 16,37:1. Los bordes de los campos tienen 4,28:1. |
| 34 | Las áreas de toque son suficientes | Sí | Botones, enlaces del menú y filtros miden 44 px o más. |
| 35 | El análisis automático no reporta fallas | Sí | axe-core: 0 violaciones en 14 vistas y tres tamaños de pantalla. |

## Verificación y versiones

| N.º | Ítem | Cumple | Observación |
|---|---|---|---|
| 36 | Las pruebas automáticas pasan | Sí | npm test: 17 de 17. Recorrido funcional en el navegador: 30 de 30. |
| 37 | El análisis de código no tiene errores | Sí | npm run lint termina sin errores ni advertencias. |
| 38 | La versión de producción se genera | Sí | npm run build termina correctamente. |
| 39 | La consola del navegador está limpia | Sí | Sin errores ni advertencias durante el recorrido. |
| 40 | Los cambios están en el repositorio remoto | Sí | Pull request 7, 8 y 9 hacia develop y versión v1.1.0 en main. |

## Correcciones aplicadas

| Hallazgo | Aspecto | Corrección | Commit |
|---|---|---|---|
| El mensaje de error movía la página y el clic no llegaba al botón Enviar | Formularios | useFormulario.js no valida al salir del campo si el foco pasa a un botón | `3e20a72` |
| Los campos vacíos se marcaban con error antes de enviar | Formularios | El campo vacío se avisa solo al enviar | `3e20a72` |
| El foco se perdía cuando fallaba una eliminación | Accesibilidad | DialogoConfirmacion.jsx pasa el foco al mensaje | `01a30a6` |
| En celular el foco se perdía al abrir una tarea | Accesibilidad | TareasPage.jsx pasa el foco al detalle o a la lista | `01a30a6` |
| El ícono y el texto de la insignia quedaban en dos líneas | Diseño | Insignia alineada en una línea | `7f44ea3` |
| El aviso de ingreso tapaba controles sin aportar | Experiencia de usuario | Se retiró el aviso | `7f44ea3` |
| El operario podía cerrar un reporte sin registrar la limpieza | Regla de negocio | El resultado es obligatorio y las transiciones dependen del rol | `a371e85` |
| Los mensajes mostraban términos técnicos de la base de datos | Experiencia de usuario | Mensajes nuevos con la razón y la solución | `5612048` |
| Las fotos de prueba no correspondían al residuo | Datos de prueba | Ilustración por categoría | `d7106bf` |

## Pendiente para la siguiente fase

- Cambiar los servicios en memoria por la API (MBU-22).
- Cambiar el esquema de ubicación por un mapa interactivo (MBU-28).

## Resultado

Se revisaron 40 ítems y los 40 cumplen.
