import { useRef, useState } from 'react';

/**
 * Estado y comportamiento común de los formularios. No conoce los campos ni las reglas:
 * recibe la función que valida y la que guarda.
 * @param {object} opciones
 * @param {object} opciones.inicial valores iniciales
 * @param {(valores: object) => Record<string, string>} opciones.validar
 * @param {(valores: object) => Promise<void>} opciones.onGuardar
 */
export function useFormulario({ inicial, validar, onGuardar }) {
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [estaEnviando, setEstaEnviando] = useState(false);
  const formularioRef = useRef(null);
  const visitados = useRef(new Set());

  const asignar = (campo, valor) => {
    const siguientes = { ...valores, [campo]: valor };
    setValores((previos) => ({ ...previos, [campo]: valor }));
    // Mientras se corrige un campo ya revisado, el mensaje se actualiza con cada tecla.
    if (visitados.current.has(campo)) {
      setErrores((previos) => ({ ...previos, [campo]: validar(siguientes)[campo] }));
    }
  };

  const cambiar = ({ target }) =>
    asignar(target.name, target.type === 'checkbox' ? target.checked : target.value);

  const alSalir = ({ target, relatedTarget }) => {
    // Un mensaje nuevo mueve la página: si el foco va a un botón, el clic no acertaría.
    if (relatedTarget instanceof HTMLButtonElement) return;
    // Un campo vacío se avisa al enviar: marcarlo antes interrumpe a quien apenas empieza.
    if (!(target.name in inicial) || target.type === 'checkbox' || !target.value) return;
    visitados.current.add(target.name);
    setErrores((previos) => ({ ...previos, [target.name]: validar(valores)[target.name] }));
  };

  const enfocarPrimerError = () =>
    requestAnimationFrame(() =>
      formularioRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    );

  const enviar = async (evento) => {
    evento.preventDefault();
    if (estaEnviando) return;
    const encontrados = validar(valores);
    Object.keys(inicial).forEach((campo) => visitados.current.add(campo));
    setErrores(encontrados);
    setErrorGeneral('');
    if (Object.keys(encontrados).length > 0) {
      enfocarPrimerError();
      return;
    }
    setEstaEnviando(true);
    try {
      await onGuardar(valores);
    } catch (error) {
      if (error.campo) {
        setErrores({ [error.campo]: error.message });
        enfocarPrimerError();
      } else {
        setErrorGeneral(error.message);
      }
    } finally {
      setEstaEnviando(false);
    }
  };

  const reiniciar = (nuevos = inicial) => {
    visitados.current.clear();
    setValores(nuevos);
    setErrores({});
    setErrorGeneral('');
  };

  /** Propiedades que comparten todos los campos: contrato único para texto, lista o área. */
  const campo = (nombre) => ({
    name: nombre,
    value: valores[nombre],
    onChange: cambiar,
    onBlur: alSalir,
    error: errores[nombre],
  });

  return {
    valores,
    errores,
    errorGeneral,
    estaEnviando,
    formularioRef,
    campo,
    cambiar,
    asignar,
    enviar,
    reiniciar,
  };
}
