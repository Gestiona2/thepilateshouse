# Con qué está hecho

Sitio **estático**: se compila a HTML, CSS y poco JavaScript. No hay servidor ni base de
datos.

| Pieza | Versión | Para qué |
|---|---|---|
| Node.js | 22.23.1 | Ejecuta todo (vista previa, compilado, pruebas) |
| Astro | 7.3.6 | Construye las páginas |
| Tailwind CSS | 4.3.3 | Solo el reinicio base; los estilos son propios |
| `sharp` | 0.35.5 | Convierte fotos y logos (`npm run assets`) |
| `fonttools` + `brotli` (Python) | 4.63.0 | Convierte las fuentes a woff2 (`scripts/preparar-fuentes.sh`) |

Sin GSAP ni Lucide: las apariciones son CSS + `IntersectionObserver` y el parallax es un
`requestAnimationFrame` propio (unas 20 líneas en `Layout.astro`).

## Comandos
| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias (una vez) |
| `npm run dev` | Vista previa en `http://localhost:4321` |
| `npm run build` | Compila a `dist/` |
| `npm test` | Valida datos, activos, fuentes y las 6 páginas compiladas |
| `npm run assets "<insumos>"` | Regenera fotos, logos, favicon e imagen para redes |
| `npm run revisar-demo` | Lista los datos de demostración que quedan |
| `npm run revisar-demo -- --produccion` | Igual, y falla si queda alguno (úsalo antes de publicar) |

## Dónde está cada cosa
```
src/datos/        todo el texto editable (un JSON por página + sitio.json)
src/pages/        las páginas (solo componen, sin texto)
src/components/   Cabecera, Pie, Portada, Foto, Arco, Boton, Encabezado, TarjetaClase...
src/layouts/      Layout.astro: estructura común, menú móvil, apariciones y parallax
src/lib/          wa.js (enlaces de WhatsApp) y ruta.js (rutas con base)
src/styles/       global.css: colores, tipografías y utilidades
public/           fonts, img (WebP), brand (logos), robots.txt
scripts/ tests/   herramientas y pruebas
```

## Rutas con base
Los enlaces y recursos pasan por `ruta()` (`src/lib/ruta.js`) para que el sitio funcione si se
publica en una subcarpeta. Para eso se cambia `base` en `astro.config.mjs`.

## Verificado al entregar
Lighthouse móvil sobre el compilado: rendimiento 99 a 100, accesibilidad 100, buenas
prácticas 100, CLS 0. SEO 69 solo porque el sitio de demostración lleva `noindex`.
