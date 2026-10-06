// Configuración compartida por preparar-assets.mjs y sus pruebas.

/** nombre de salida → archivo original en la carpeta de insumos.
 *  "Marzo-7 (4)" es idéntico byte a byte a "Marzo-7 (3)": no se usa. */
export const FOTOS = {
  "estudio-recepcion": "Espacios Aira - Marzo-1 (6).jpg.jpeg",
  "estudio-pelotas": "Espacios Aira - Marzo-10 (4).jpg.jpeg",
  "estudio-sala": "Espacios Aira - Marzo-12 (1).jpg.jpeg",
  "estudio-nichos": "Espacios Aira - Marzo-2 (2).jpg.jpeg",
  "estudio-toallas": "Espacios Aira - Marzo-3 (3).jpg.jpeg",
  "estudio-cortinas": "Espacios Aira - Marzo-7 (3).jpg.jpeg",
};
export const ANCHOS = [480, 800, 1200, 1800];

/** clave → { archivo de ENTREGABLES AIRA/LOGOS (negro sobre transparente), ancho de salida } */
export const LOGOS = {
  logo: { archivo: "logos_AIRA-18.png", ancho: 560 },
  "logo-casa": { archivo: "logos_AIRA-12.png", ancho: 700 },
  "logo-eslogan": { archivo: "logos_AIRA-06.png", ancho: 700 },
  isotipo: { archivo: "logos_AIRA-48.png", ancho: 240 },
};
export const COLORES = { espresso: [96, 85, 74], marfil: [246, 245, 227] };
export const MOCKUP_VIP = { archivo: "ENTREGABLES AIRA/MOCKUPS/aira vip card.png", anchos: [800, 1400] };
