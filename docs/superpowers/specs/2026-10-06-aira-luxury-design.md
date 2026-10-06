# Aira — The Pilates House · Sitio luxury (diseño)

Fecha: 2026-10-06 · Estado: aprobado por el usuario (2026-10-06); sigue el plan de implementación

## 1. Objetivo

Sitio web nuevo, construido desde cero, para **Aira, The Pilates House**. Debe comunicar
exclusividad y calma ("luxury") y llevar a la persona a reservar por WhatsApp. No hereda
nada de `web-aira`.

Éxito = (a) fiel al brand guide de AM Studio 2024, (b) se siente editorial y de lujo en
celular de 320 px y en escritorio, (c) los datos inventados están todos marcados y no pueden publicarse por error, (d) cada texto
se edita desde `src/datos/` sin tocar el diseño.

## 2. Insumos y qué aportan

Ruta: `MEGA/CLIENTES POSIBLES/AIRA STUDIO PILATES/insumos web/`

| Insumo | Uso |
|---|---|
| `ENTREGABLES AIRA/BRAND GUIDE/AIRA_branding.pdf` | Fuente de verdad: paleta, tipografías, propósito, valores, storytelling |
| `ENTREGABLES AIRA/LOGOS/*.png` (48 variantes) | Logo principal, con eslogan, vertical, isotipo, versión clara |
| `ENTREGABLES AIRA/TIPOGRAFÍAS/*.otf` | Almarose (Thin/Semibold) y Techno Nue — se convierten a woff2 y se sirven locales |
| `Espacios Aira - Marzo-*.jpeg` (7) | Fotografía real del estudio |
| `ENTREGABLES AIRA/MOCKUPS/` | Tarjeta VIP, tote bag, vitrina |
| `referentes/` (3) | MYA, Rouge, Still Sundays: solo inspiración de ritmo y composición |

`propuesta.png` (carpeta del cliente) es una propuesta comercial de Emp2Web; **no** es
contenido del sitio y no se usa.

**Lo que no existe en los insumos:** WhatsApp, dirección, horarios, precios, listado de
clases, equipo, testimonios, redes. Se inventan solo para la demo, marcados (ver §7).

## 3. Marca

- **Paleta oficial (1.6):** `#F6F5E3` marfil · `#E7DEB5` arena · `#B49F84` taupe ·
  `#60554A` espresso.
- **Tipografías (1.7):** Techno Nue Thin y Almarose Thin.
- **Propósito:** propiciar la serenidad mental, el balance físico y espiritual mediante una
  experiencia sensorial consciente.
- **Atributos:** integral, minimalista, exclusivo. **Valores:** serenidad, conexión
  mente-cuerpo, bienestar.
- **Eslóganes del logo:** *The Pilates House* y *One breath at a time*.
- **Storytelling:** se usa casi textual (4 líneas del brand guide).

## 4. Dirección visual

Editorial claro con momentos espresso. Lujo por contención.

- **Fondos:** marfil `#F6F5E3` base; bandas en espresso `#60554A` con texto marfil para
  cita, CTA y footer.
- **Texto:** espresso sobre marfil (≈6.5:1). `#B49F84` y `#E7DEB5` son solo decorativos
  (líneas, fondos suaves, arcos); **nunca texto**, no pasan AA.
- **Tipografía:** Almarose Thin en titulares grandes. Techno Nue en etiquetas en
  versalitas con tracking amplio. Para texto corrido, Almarose Semibold: las Thin no se
  leen en tamaño pequeño. Titulares: tamaño fluido con `clamp()`.
- **Motivo:** arco (tarjeta VIP, mostrador del estudio). Las fotos se recortan en arco.
  El isotipo `. ‿ .` actúa como separador.
- **Fotografía:** a sangre, grande, con aire alrededor. Sin filtros ni overlays pesados.
- **Movimiento:** apariciones lentas, parallax entre 0.05 y 0.12 en una sola pieza por
  vista. Respeta `prefers-reduced-motion`. Patrones de `conocimiento/animaciones.md`
  adaptados; **no** se usa la técnica de cortina con `clip-path` (dejó una galería vacía
  en `web-aira`).
- **Evitar:** dorados, gradientes decorativos, sombras pesadas, iconos de relleno, y
  cualquier adorno que no venga del brand guide.

## 5. Estructura de páginas

| Ruta | Contenido | Datos |
|---|---|---|
| `/` Inicio | Portada con la foto de recepción, promesa de marca, adelanto de cada página, franja espresso con cita, invitación a reservar | `inicio.json` |
| `/la-casa` | Storytelling, propósito, atributos/valores, galería de espacios | `la-casa.json` |
| `/clases` | Introducción de marca + lista de clases leída del JSON | `clases.json` |
| `/membresia` | Tarjeta VIP (mockup) + introducción + planes leídos del JSON | `membresia.json` |
| `/contacto` | Reserva por WhatsApp, dirección, horarios, mapa | `contacto.json` |
| `/404` | Mensaje breve con retorno al inicio | — |

Datos compartidos (menú, WhatsApp, redes, legales): `sitio.json`.

Legales (privacidad, tratamiento de datos): se crean solo si el cliente confirma la
razón social; entran en `PENDIENTES.md` hasta entonces.

## 6. Arquitectura técnica

- **Base:** `generador/plantillas/astro-base/` (Astro + Tailwind v4). Se copia a esta
  carpeta; nada del generador viaja al sitio (`conocimiento/` queda fuera).
- **Contenido:** todo en `src/datos/*.json`, un archivo por página. Los `.astro` no llevan
  texto escrito.
- **Componentes** (uno por responsabilidad): `Cabecera`, `Pie`, `Portada`, `ArcoFoto`,
  `SeccionTexto`, `Galeria`, `BandaEspresso`, `TarjetaClase`, `BotonReserva`.
- **Fuentes:** `.otf` → `woff2`, en `public/fonts/`, con `font-display: swap`.
- **Imágenes:** originales (3888×5184) a WebP en varios anchos con `srcset`; `alt`
  descriptivo; la de portada con prioridad de carga, el resto `loading="lazy"`.
- **Animación:** GSAP + ScrollTrigger solo para portada y piezas protagonistas;
  IntersectionObserver en CSS para el resto, con escalonado. Nunca los dos sobre un mismo
  nodo.
- **Reserva:** enlaces `wa.me` generados desde `sitio.json`; sin carrito, sin formulario
  con backend, sin claves en el navegador.
- **SEO:** `<title>` y `description` por página, Open Graph, `sitemap`, `lang="es"`.
- **Módulos opcionales** (blog con IA, Telegram): apagados.

## 7. Datos de demostración (decisión del usuario, 2026-10-06)

Los insumos no traen WhatsApp, dirección, horarios, precios, clases, equipo ni redes. Para
poder **mostrar el sitio completo**, el usuario autorizó inventar datos de ejemplo. Esto
reemplaza la regla "no inventar" solo para esta etapa de demo, y se controla así:

- **Verosímiles y coherentes con la marca:** clases de pilates reformer/mat, planes de
  membresía, horarios, dirección y redes de ejemplo. Tono de lujo y calma, sin cifras
  médicas ni promesas de resultados.
- **Etiquetados en el dato:** todo valor inventado vive en `src/datos/` con
  `"_demo": true` en su bloque. Nada inventado queda escrito en un `.astro`.
- **Registro único:** `PENDIENTES.md` lista cada dato inventado, a qué página afecta y
  qué dato real lo reemplaza.
- **Revisor antes de publicar:** `scripts/revisar-demo.mjs` recorre `src/datos/` y falla
  si queda algún `_demo: true`. Se corre antes de cualquier publicación; el sitio no sale
  a producción con datos de ejemplo.
- **WhatsApp:** número falso reconocible (`573000000000`), para que ningún cliente real
  escriba a un tercero por error.
- **Precios y planes:** valores de ejemplo en COP, marcados como demo.
- **Dirección y teléfono:** ficticios y reconocibles; no se usa ninguna dirección real.
- **Testimonios de ejemplo (autorizados por el usuario):** 3 en `inicio.json`, solo con
  nombre de pila ficticio, `"_demo": true`, sobre la sensación de calma y la atención,
  nunca sobre resultados físicos o de salud. Sin cifras de resultados ni premios.
- **`AGENTS.md` del sitio** advierte que los datos son de demostración y que no se deben
  tratar como reales.
- Imágenes que falten: SVG local o `placehold.co`, anotado.

## 8. Verificación (antes de decir "listo")

1. `npm run build` sin errores ni avisos.
2. Revisión visual en navegador a 320, 375, 768 y 1440 px (banco con iframes, según
   `conocimiento/verificacion-responsive.md`).
3. Contraste AA en todo texto; foco visible; navegación por teclado.
4. `prefers-reduced-motion` probado: todo visible y sin movimiento.
5. Ningún texto fuera de `src/datos/`; ningún `{{marcador}}` sin reemplazar; `revisar-demo` lista todos los datos de ejemplo.
6. Lighthouse móvil: rendimiento y accesibilidad ≥ 95.

## 9. Documentación y entrega (se escribe mientras se construye)

`AGENTS.md` y `CLAUDE.md` del sitio, `TUTORIAL.md` con ejemplos reales de Aira, scripts
de `entrega/`, los ocho archivos de `conocimiento_generado/`, `PENDIENTES.md`. Remoto sin
alias de SSH del proveedor y commits reales. Publicación: se decide con el cliente después.

## 10. Fuera de alcance

Blog, tienda o pagos, reservas con calendario propio, multi-idioma, panel de
administración, publicación en producción, textos legales sin datos del cliente.
