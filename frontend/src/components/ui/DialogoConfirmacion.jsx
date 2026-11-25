import { useState } from 'react';
import Alerta from './Alerta.jsx';
import Boton from './Boton.jsx';
import Modal from './Modal.jsx';

// Confirma una acción delicada y muestra la razón si no se puede completar.
export default function DialogoConfirmacion({
  titulo,
  mensaje,
  textoConfirmar,
  textoCancelar = 'Cancelar',
  alternativa,
  onConfirmar,
  onCerrar,
}) {
  const [error, setError] = useState('');
  const [estaEnviando, setEstaEnviando] = useState(false);

  const ejecutar = async (accion) => {
    setEstaEnviando(true);
    try {
      await accion();
      onCerrar();
    } catch (fallo) {
      setError(fallo.message);
      setEstaEnviando(false);
    }
  };

  return (
    <Modal titulo={titulo} onCerrar={onCerrar}>
      {error ? <Alerta>{error}</Alerta> : <p>{mensaje}</p>}
      <div className="acciones">
        <Boton variante="secundario" onClick={onCerrar}>
          {error ? 'Cerrar' : textoCancelar}
        </Boton>
        {error && alternativa && (
          <Boton estaCargando={estaEnviando} onClick={() => ejecutar(alternativa.accion)}>
            {alternativa.texto}
          </Boton>
        )}
        {!error && (
          <Boton
            variante="peligro"
            estaCargando={estaEnviando}
            onClick={() => ejecutar(onConfirmar)}
          >
            {textoConfirmar}
          </Boton>
        )}
      </div>
    </Modal>
  );
}
