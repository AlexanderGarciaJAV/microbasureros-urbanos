// Dibujo por categoría para los reportes de prueba que no tienen fotografía.
const FIGURAS = {
  1: (
    <>
      <path d="M40 128l34-46 30 22 28-38 48 62z" fill="#b08968" />
      <path d="M62 128l20-26 22 26z" fill="#8d6a4c" />
      <rect
        x="118"
        y="96"
        width="34"
        height="18"
        rx="2"
        fill="#c2410c"
        transform="rotate(14 118 96)"
      />
      <rect x="84" y="108" width="30" height="16" rx="2" fill="#9a3412" />
    </>
  ),
  2: (
    <>
      <path d="M44 128c8-34 32-44 62-40 30-8 58 8 66 40z" fill="#5b8c3e" />
      <path d="M70 112c10-18 26-22 40-18-6 16-20 24-40 18z" fill="#86b85f" />
      <path d="M118 104c12-12 26-12 38-4-10 12-24 14-38 4z" fill="#3f6b28" />
    </>
  ),
  3: (
    <>
      <circle cx="84" cy="104" r="26" fill="#2f3431" />
      <circle cx="84" cy="104" r="11" fill="#dfe5e0" />
      <circle cx="138" cy="104" r="26" fill="#3d4440" />
      <circle cx="138" cy="104" r="11" fill="#dfe5e0" />
      <circle cx="111" cy="62" r="26" fill="#1f2421" />
      <circle cx="111" cy="62" r="11" fill="#dfe5e0" />
    </>
  ),
  4: (
    <>
      <path d="M60 128c-10-30 4-50 22-52l-4-12h16l-4 12c18 2 30 22 20 52z" fill="#2c3e50" />
      <path d="M116 128c-8-24 4-40 18-42l-4-10h14l-4 10c14 2 24 18 16 42z" fill="#46637f" />
      <rect x="150" y="112" width="24" height="16" rx="2" fill="#d08c45" />
    </>
  ),
  5: (
    <>
      <rect x="54" y="84" width="82" height="30" rx="6" fill="#7c6a9c" />
      <rect x="46" y="96" width="98" height="24" rx="6" fill="#9788b5" />
      <path d="M56 120v10M134 120v10" stroke="#4b3f63" strokeWidth="6" strokeLinecap="round" />
      <rect x="148" y="66" width="30" height="62" rx="4" fill="#cfd8dc" />
      <path d="M148 92h30M155 76v8M155 100v10" stroke="#78909c" strokeWidth="3" />
    </>
  ),
};

export default function Ilustracion({ categoriaId, titulo }) {
  return (
    <svg
      viewBox="0 0 220 150"
      className="ilustracion"
      role="img"
      aria-label={titulo}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="220" height="150" fill="#e3ede4" />
      <path d="M0 70h30V44h26v26h22V30h34v40h30V52h28v18h50v80H0z" fill="#cfdfd1" />
      <rect y="126" width="220" height="24" fill="#b9c7bb" />
      {FIGURAS[categoriaId] ?? FIGURAS[4]}
    </svg>
  );
}
