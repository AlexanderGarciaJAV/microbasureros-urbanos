import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import { IconCamera, IconSend, IconTarget } from '../components/Icons.jsx';
import { useApp } from '../context/AppContext.jsx';
import mapa from '../assets/mapa-reporte.jpg';
import * as v from '../utils/validators.js';

const INICIAL = {
  archivo: null,
  latitud: '7.7625',
  longitud: '-73.3917',
  categoriaId: '',
  zonaId: '',
  descripcion: '',
};

export default function Reportar() {
  const { categorias, zonas, agregarReporte, notificar } = useApp();
  const navegar = useNavigate();
  const [form, setForm] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const [vista, setVista] = useState('');
  const [geo, setGeo] = useState('');
  const entrada = useRef(null);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errores[name]) setErrores((er) => ({ ...er, [name]: '' }));
  };

  const elegirFoto = (e) => {
    const archivo = e.target.files?.[0] ?? null;
    if (vista) URL.revokeObjectURL(vista);
    const err = archivo ? v.foto(archivo) : '';
    setErrores((er) => ({ ...er, archivo: err }));
    if (err || !archivo) {
      setForm((f) => ({ ...f, archivo: null }));
      setVista('');
      return;
    }
    setForm((f) => ({ ...f, archivo }));
    setVista(URL.createObjectURL(archivo));
  };

  const ubicar = () => {
    if (!navigator.geolocation)
      return setGeo(
        'Tu navegador no permite obtener la ubicación; ajusta las coordenadas manualmente.'
      );
    setGeo('Obteniendo ubicación…');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setForm((f) => ({
          ...f,
          latitud: p.coords.latitude.toFixed(6),
          longitud: p.coords.longitude.toFixed(6),
        }));
        setGeo('Ubicación capturada automáticamente.');
      },
      () => setGeo('No se pudo obtener la ubicación; ajusta las coordenadas manualmente.'),
      { timeout: 6000 }
    );
  };

  const validar = () => {
    const lat = Number(form.latitud);
    const lon = Number(form.longitud);
    return {
      archivo: v.foto(form.archivo),
      latitud:
        form.latitud === '' || Number.isNaN(lat) || lat < -90 || lat > 90
          ? 'La latitud debe estar entre -90 y 90.'
          : '',
      longitud:
        form.longitud === '' || Number.isNaN(lon) || lon < -180 || lon > 180
          ? 'La longitud debe estar entre -180 y 180.'
          : '',
      categoriaId: form.categoriaId ? '' : 'Selecciona una categoría.',
      zonaId: form.zonaId ? '' : 'Selecciona la zona.',
      descripcion: v.texto(form.descripcion, 10, 500, 'La descripción'),
    };
  };

  const enviar = (ev) => {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (v.hayErrores(e)) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const nuevo = agregarReporte({
      descripcion: form.descripcion.trim(),
      latitud: Number(form.latitud),
      longitud: Number(form.longitud),
      categoriaId: Number(form.categoriaId),
      zonaId: Number(form.zonaId),
      foto: vista,
    });
    notificar(`Reporte ${nuevo.codigo} enviado correctamente.`);
    navegar('/mis-reportes');
  };

  const cancelar = () => {
    setForm(INICIAL);
    setErrores({});
    setVista('');
    setGeo('');
    if (entrada.current) entrada.current.value = '';
  };

  return (
    <section className="tarjeta formulario-ancho" aria-labelledby="titulo-reporte">
      <h1 id="titulo-reporte">Registrar Nuevo Microbasurero</h1>
      <p className="lead">
        Complete la información a continuación para reportar un microbasurero. Su colaboración es
        fundamental para mantener nuestra ciudad limpia.
      </p>

      <form onSubmit={enviar} noValidate>
        <fieldset className="grupo">
          <legend>Fotografía del Microbasurero (Obligatorio)</legend>
          <label
            className={`subida ${errores.archivo ? 'subida--error' : ''} ${vista ? 'subida--con-foto' : ''}`}
          >
            {vista ? (
              <img src={vista} alt="Vista previa de la fotografía seleccionada" />
            ) : (
              <>
                <IconCamera width={36} height={36} />
                <strong>Tomar o Adjuntar Fotografía</strong>
                <small>Formatos soportados: JPG, PNG. Máx 5MB.</small>
              </>
            )}
            <input
              ref={entrada}
              type="file"
              accept="image/jpeg,image/png"
              onChange={elegirFoto}
              aria-invalid={errores.archivo ? 'true' : 'false'}
              aria-describedby={errores.archivo ? 'err-foto' : undefined}
            />
          </label>
          {errores.archivo && (
            <p id="err-foto" className="campo__error" role="alert">
              {errores.archivo}
            </p>
          )}
        </fieldset>

        <fieldset className="grupo">
          <legend>Ubicación (Mapa Interactivo)</legend>
          <div className="mapa">
            <img
              src={mapa}
              alt="Mapa de la zona con un marcador naranja que indica la ubicación del microbasurero"
            />
            <button type="button" className="mapa__btn" onClick={ubicar}>
              <IconTarget />
              <span className="sr-only">Usar mi ubicación actual</span>
            </button>
          </div>
          <p className="campo__hint" aria-live="polite">
            {geo ||
              'Pulsa el botón de objetivo para capturar tu ubicación o ajusta las coordenadas.'}
          </p>
          <div className="fila">
            <Field
              label="Latitud"
              name="latitud"
              inputMode="decimal"
              value={form.latitud}
              onChange={cambiar}
              error={errores.latitud}
              required
            />
            <Field
              label="Longitud"
              name="longitud"
              inputMode="decimal"
              value={form.longitud}
              onChange={cambiar}
              error={errores.longitud}
              required
            />
          </div>
        </fieldset>

        <div className="fila">
          <Field
            as="select"
            label="Categoría Principal de Residuo"
            name="categoriaId"
            value={form.categoriaId}
            onChange={cambiar}
            error={errores.categoriaId}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias
              .filter((c) => c.activo)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
          </Field>
          <Field
            as="select"
            label="Zona Municipal"
            name="zonaId"
            value={form.zonaId}
            onChange={cambiar}
            error={errores.zonaId}
            required
          >
            <option value="">Seleccione la zona</option>
            {zonas
              .filter((z) => z.activo)
              .map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre} - {z.barrio}
                </option>
              ))}
          </Field>
        </div>

        <Field
          as="textarea"
          label="Descripción Detallada"
          name="descripcion"
          rows={4}
          value={form.descripcion}
          onChange={cambiar}
          error={errores.descripcion}
          maxLength={500}
          placeholder="Proporcione detalles adicionales que ayuden a las cuadrillas de limpieza (ej. dificultad de acceso, volumen aproximado, olores fuertes)."
          hint={`${form.descripcion.length}/500 caracteres (mínimo 10).`}
          required
        />

        <div className="acciones">
          <button type="button" className="btn btn--outline" onClick={cancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primario">
            <IconSend /> Enviar Reporte
          </button>
        </div>
      </form>
    </section>
  );
}
