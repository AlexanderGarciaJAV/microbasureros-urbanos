// Iconos SVG sencillos (decorativos: aria-hidden) para no depender de librerías externas.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const IconLeaf = (p) => (
  <svg {...base} {...p}>
    <path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z" />
    <path d="M5 19c2-5 5-8 9-10" />
  </svg>
);
export const IconCamera = (p) => (
  <svg {...base} {...p}>
    <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
export const IconPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const IconCalendar = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16M9 3v4M15 3v4" />
  </svg>
);
export const IconEye = (p) => (
  <svg {...base} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const IconEyeOff = (p) => (
  <svg {...base} {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.5 7.5C3.7 9.3 2 12 2 12s3.5 6 10 6a9.7 9.7 0 0 0 3.7-.7" />
  </svg>
);
export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconEdit = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16z" />
  </svg>
);
export const IconTrash = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </svg>
);
export const IconDownload = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
  </svg>
);
export const IconFilter = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);
export const IconCheck = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.8 2.8L16 9.5" />
  </svg>
);
export const IconAlert = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4l9 16H3z" />
    <path d="M12 10v4M12 17.5v.01" />
  </svg>
);
export const IconTarget = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);
export const IconSend = (p) => (
  <svg {...base} {...p}>
    <path d="M4 12l16-8-6 16-3-7z" />
  </svg>
);
export const IconMenu = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const IconClose = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconSearch = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M16 16l4 4" />
  </svg>
);
