export default function Paginacion({ desde, hasta, total, pagina, totalPaginas, irA }) {
  return (
    <div className="paginacion">
      <p aria-live="polite">
        {desde} a {hasta} de {total}
      </p>
      {totalPaginas > 1 && (
        <nav aria-label="Páginas">
          <ul>
            {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map((numero) => (
              <li key={numero}>
                <button
                  type="button"
                  aria-label={`Página ${numero}`}
                  aria-current={numero === pagina ? 'page' : undefined}
                  onClick={() => irA(numero)}
                >
                  {numero}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
