# Componentes del frontend

La página `/componentes` de la aplicación muestra cada componente con sus variantes y estados.

## Variables de diseño

Están en `frontend/src/styles/tokens.css`. Los demás estilos solo usan estas variables.

| Grupo | Variables |
|---|---|
| Color | `--verde-oscuro`, `--verde`, `--azul`, `--rojo`, `--ambar` y su fondo |
| Neutros | `--texto`, `--texto-suave`, `--borde`, `--borde-control`, `--fondo`, `--superficie` |
| Espacio | `--e1` a `--e7` (4 a 48 px) |
| Letra | `--t-xs` a `--t-3xl`, familia Inter |
| Forma | `--radio`, `--radio-lg`, `--radio-total`, `--sombra-alta` |
| Interacción | `--tactil` (44 px) y `--rapido` (160 ms) |

## Componentes

| Componente | Propiedades principales | Estados | Accesibilidad |
|---|---|---|---|
| `Boton` | `variante`, `icono`, `estaCargando`, `ancho` | normal, cursor, carga, deshabilitado | `aria-busy` |
| `BotonIcono` | `icono`, `etiqueta`, `tono` | normal, cursor, foco | etiqueta obligatoria |
| `Campo` | `etiqueta`, `ayuda`, `error`, `maximo` | normal, error, opcional | `aria-invalid`, `aria-describedby` |
| `CampoTexto`, `CampoArea`, `CampoSeleccion`, `CampoContrasena` | contrato de `campo(nombre)` | los de `Campo` | los de `Campo` |
| `Interruptor` | `etiqueta`, `checked` | activo, inactivo, foco | `role="switch"` |
| `Buscador` y `Filtros` | `valor`, `onCambiar` | vacío, con valor | `aria-pressed` |
| `TablaDatos` | `columnas`, `filas`, `acciones`, `vacio`, `pie` | con datos, vacía | `caption`, `scope` |
| `Paginacion` | resultado de `usePaginacion` | una o varias páginas | `aria-current` |
| `Modal` | `titulo`, `onCerrar` | abierto | `<dialog>` nativo, Escape |
| `DialogoConfirmacion` | `onConfirmar`, `alternativa` | pregunta, envío, error | foco en el mensaje |
| `Pestanas` | `pestanas`, `activa` | activa, inactiva | flechas, `role="tablist"` |
| `Insignia`, `Alerta`, `Aviso` | `tono` | alerta, info, éxito, neutro | ícono y texto |
| `EstadoVacio` y `Cargando` | `titulo`, `mensaje`, `accion` | vacío, carga | `role="status"` |
| `Indicador`, `GraficoBarras`, `GraficoProporcion` | `titulo`, `datos` | con datos | valores en texto |

## Ejemplo

```jsx
const { campo, enviar, formularioRef } = useFormulario({
  inicial: { nombre: '' },
  validar: validarZona,
  onGuardar: guardarZona,
});

<form ref={formularioRef} onSubmit={enviar} noValidate>
  <CampoTexto etiqueta="Nombre de la zona" {...campo('nombre')} />
  <Boton type="submit">Guardar zona</Boton>
</form>;
```

## Principios SOLID

| Principio | Dónde se aplica |
|---|---|
| Responsabilidad única | Página, formulario, validación, servicio y hook en archivos separados |
| Abierto y cerrado | `TablaDatos` recibe columnas; `gestion/tipos.js` agrega catálogos sin tocar la página |
| Sustitución de Liskov | Los cuatro campos comparten contrato y se intercambian en cualquier formulario |
| Segregación de interfaces | Tres contextos y hooks pequeños en lugar de un contexto con todo |
| Inversión de dependencias | `AuthProvider` y `DatosProvider` reciben los servicios desde `main.jsx` |
