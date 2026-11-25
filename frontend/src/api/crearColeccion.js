// Colección en memoria con el mismo contrato que tendrá la API: todos los métodos son
// asíncronos y devuelven copias, para que nadie modifique los datos por fuera de aquí.
const copiar = (valor) => ({ ...valor });

export function crearColeccion(iniciales, espera = 0) {
  let registros = iniciales.map(copiar);
  const responder = (valor) =>
    new Promise((resolver) => {
      setTimeout(() => resolver(valor), espera);
    });

  return {
    listar: () => responder(registros.map(copiar)),
    obtener: (id) => {
      const registro = registros.find((item) => item.id === id);
      return responder(registro ? copiar(registro) : null);
    },
    crear: (datos) => {
      const nuevo = { ...datos, id: Math.max(0, ...registros.map((item) => item.id)) + 1 };
      registros = [...registros, nuevo];
      return responder(copiar(nuevo));
    },
    actualizar: (id, cambios) => {
      registros = registros.map((item) => (item.id === id ? { ...item, ...cambios, id } : item));
      return responder(copiar(registros.find((item) => item.id === id)));
    },
    eliminar: (id) => {
      registros = registros.filter((item) => item.id !== id);
      return responder(undefined);
    },
  };
}
