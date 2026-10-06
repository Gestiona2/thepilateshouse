# Aira — Sitio luxury · Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el sitio multipágina "luxury" de Aira, The Pilates House (Inicio, La casa, Clases, Membresía, Contacto, 404) con datos de demostración marcados y listo para mostrar al cliente.

**Architecture:** Sitio estático Astro 7 + Tailwind v4 (base del generador). Todo el texto vive en `src/datos/*.json`; los `.astro` solo componen. Un pipeline de scripts convierte los insumos del cliente (fotos, logos, fuentes) a activos web. Estilos globales mínimos (tokens, tipografía, utilidades) y estilos de componente dentro de cada `.astro`.

**Tech Stack:** Astro 7, Tailwind CSS 4 (solo `@import` y preflight), `sharp` (imágenes y logos), `pyftsubset` de fonttools (fuentes), `node:test` (pruebas). Sin GSAP: el parallax es un `requestAnimationFrame` de ~20 líneas.

**Spec:** `docs/superpowers/specs/2026-10-06-aira-luxury-design.md`

## Global Constraints

- Carpeta del sitio: `/mnt/5ddaa367-d44e-4462-8632-c0f57f33031c/DESARROLLO/PAGINAS WEB IA/base_web_ia/web-spaaira` (Git propio, rama `main`). **Toda ruta va entre comillas** (hay espacios en los nombres).
- Insumos (solo lectura, fuera del repo): `/mnt/5ddaa367-d44e-4462-8632-c0f57f33031c/MEGA/CLIENTES POSIBLES/AIRA STUDIO PILATES/insumos web`. Nunca copiar originales al repo; solo los derivados optimizados.
- Paleta oficial: `#F6F5E3` marfil · `#E7DEB5` arena · `#B49F84` taupe · `#60554A` espresso. Texto secundario `#6F6457` (5.3:1 sobre marfil). `taupe` y `arena` **nunca** como color de texto.
- Tipografías: Almarose (Thin 100 y Semibold 600) y Techno Nue (Thin 100 y Regular 400), auto-hospedadas en woff2. **Thin solo desde 28 px**; texto corrido y etiquetas pequeñas en Semibold/Regular.
- Tema **solo claro** (`color-scheme: light`). No hay botón ni variables de tema oscuro.
- Todo texto visible sale de `src/datos/`. Los `.astro` no llevan texto escrito (ni siquiera `aria-label`: viene de `sitio.ui`).
- Todo dato inventado lleva `"_demo": true` en su bloque. `sitio.indexar` es `false` mientras haya demo (meta `noindex`).
- WhatsApp provisional: `573000000000`. Dirección ficticia reconocible: `Calle 00 # 00-00`. Nada de datos reales de terceros.
- Español con todas sus tildes y la ñ en todo texto, comentarios y documentos.
- Rutas internas con el helper `ruta()` (`src/lib/ruta.js`) para soportar `base` si se publica en subcarpeta.
- Movimiento: contenido visible por defecto; se oculta para animar **solo** bajo `html.js`. Todo respeta `prefers-reduced-motion`.
- Commits con el pie:
  ```
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw
  ```
- Antes de las Tareas 5 a 9 (diseño visual), invocar las skills `frontend-design` e `impeccable` (y `ui-ux-pro-max` si ayuda) y aplicar su criterio sobre la base de código de este plan. Se juzga viendo el resultado en el navegador, no solo compilando.

## Review Focus

1. **Sin JavaScript o con movimiento reducido** el contenido no puede quedar invisible (antecedente: galería en blanco en `web-aira`). Prueba: el CSS compilado solo oculta `.rev` bajo `.js`; el HTML no trae `opacity:0` en línea.
2. **Datos opcionales vacíos** (`redes: []`, `legales: []`, `mapa.embedUrl: ""`, `referencia` ausente) no deben pintar títulos huérfanos, enlaces con `href=""` ni listas vacías. Prueba: no hay `href=""` en `dist/` y los componentes se omiten.
3. **Mensajes de WhatsApp con tildes, ñ, `&`, `#` o saltos de línea** deben codificarse bien. Prueba: `enlaceWa` con "Reformer & Mat #1: ¿Cuándo?".
4. **Celular de 320 px**: ningún desbordamiento horizontal ni titular cortado ("movimiento", "Membresía", "Experiencia inmersiva" en Thin grande). Se verifica con `scrollWidth <= innerWidth` en 320 y 375.
5. **Fotos referenciadas que no existen** (error de nombre en el JSON) rompen la página sin avisar. Prueba: todo valor de la clave `imagen` en `src/datos/` tiene sus `-800.webp`.
6. **Datos de demo que se cuelan a producción.** Prueba: `revisar-demo --produccion` sale con código 1 mientras exista un `_demo`.

---

## Mapa de archivos

```
web-spaaira/
├── package.json · astro.config.mjs · .gitignore
├── scripts/
│   ├── assets-config.mjs        # nombres de fotos/logos/anchos (compartido por script y pruebas)
│   ├── preparar-assets.mjs      # fotos → WebP, logos recoloreados, favicon, og, mockup VIP
│   ├── preparar-fuentes.sh      # .otf → woff2 subset latin
│   └── revisar-demo.mjs         # lista/bloquea datos _demo
├── tests/                       # node:test
│   ├── wa.test.mjs · demo.test.mjs · datos.test.mjs
│   ├── fuentes.test.mjs · assets.test.mjs · build.test.mjs
├── public/ fonts/ img/ brand/ robots.txt
├── src/
│   ├── datos/ sitio.json inicio.json la-casa.json clases.json membresia.json contacto.json
│   ├── lib/ wa.js ruta.js
│   ├── styles/global.css
│   ├── layouts/Layout.astro
│   ├── components/ Foto Arco Boton Encabezado Separador Cabecera Pie Portada TarjetaClase PlanMembresia Cita
│   └── pages/ index la-casa clases membresia contacto 404 .astro · sitemap.xml.js
├── conocimiento_generado/ (8 archivos) · AGENTS.md · CLAUDE.md · TUTORIAL.md · PENDIENTES.md
└── docs/superpowers/ (spec y plan)
```

---

### Task 1: Esqueleto del proyecto

**Files:**
- Create: `package.json`, `astro.config.mjs`, `.gitignore`, `src/pages/index.astro` (provisional), carpetas vacías
- Modify: `docs/superpowers/specs/2026-10-06-aira-luxury-design.md` (§4, §6)

**Interfaces:**
- Produces: `npm run build` funcional; scripts `test`, `revisar-demo`, `assets`; carpetas `src/{datos,lib,styles,layouts,components,pages}`, `public/{fonts,img,brand}`, `scripts`, `tests`.

- [ ] **Step 1: Crear estructura y archivos base**

```bash
cd "/mnt/5ddaa367-d44e-4462-8632-c0f57f33031c/DESARROLLO/PAGINAS WEB IA/base_web_ia/web-spaaira"
mkdir -p src/{datos,lib,styles,layouts,components,pages} public/{fonts,img,brand} scripts tests conocimiento_generado
```

`package.json`:

```json
{
  "name": "web-spaaira",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "node --test tests/",
    "assets": "node scripts/preparar-assets.mjs",
    "revisar-demo": "node scripts/revisar-demo.mjs"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "astro": "^7.0.0",
    "tailwindcss": "^4.1.0"
  }
}
```

`astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Sitio estático. Cambiar `site` (y `base` si se publica en subcarpeta) al elegir hosting.
export default defineConfig({
  site: "https://aira.example",
  vite: { plugins: [tailwindcss()] },
});
```

`.gitignore`:

```
node_modules/
dist/
.astro/
insumos/
*.log
```

`src/pages/index.astro` (provisional, se reemplaza en la Tarea 6):

```astro
---
---
<html lang="es"><head><meta charset="utf-8" /><title>Aira provisional</title></head><body><h1>Aira</h1></body></html>
```

- [ ] **Step 2: Instalar y compilar**

Run: `npm install && npm install -D sharp && npm run build`
Expected: termina sin error; existe `dist/index.html`.

- [ ] **Step 3: Corregir el spec (decisiones tomadas al planear)**

En `docs/superpowers/specs/2026-10-06-aira-luxury-design.md`:
- §4, línea "Movimiento": reemplazar "parallax entre 0.05 y 0.12 en una sola pieza por vista" por "parallax de ±28 px en una sola pieza por vista, con `requestAnimationFrame` (sin GSAP)".
- §6, línea "Animación": reemplazar el texto por "IntersectionObserver + CSS con escalonado, y un parallax propio con `requestAnimationFrame`. Sin GSAP: el sitio solo necesita un efecto y la librería pesa ~50 KB."
- §6: agregar la línea "**Tema:** solo claro; sin conmutador de tema oscuro (la marca es marfil y la fotografía es clara)."
- §5, fila Contacto: reemplazar "mapa" por "mapa solo si hay `mapa.embedUrl`; si no, tarjeta de dirección".

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Esqueleto Astro del sitio de Aira y ajustes al spec" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```

---

### Task 2: Helpers `wa.js`, `ruta.js` y `revisar-demo`

**Files:**
- Create: `src/lib/wa.js`, `src/lib/ruta.js`, `scripts/revisar-demo.mjs`, `tests/wa.test.mjs`, `tests/demo.test.mjs`

**Interfaces:**
- Produces:
  - `enlaceWa(numero: string, mensaje?: string): string`
  - `ruta(p: string): string` (antepone `import.meta.env.BASE_URL`)
  - `listarDemo(dir: string): Promise<string[]>` (cada entrada `"archivo.json › ruta.al.bloque"`)
  - CLI `node scripts/revisar-demo.mjs [--produccion]`

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/wa.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { enlaceWa } from "../src/lib/wa.js";

test("sin mensaje, solo el número", () => {
  assert.equal(enlaceWa("573000000000"), "https://wa.me/573000000000");
});

test("codifica tildes, ñ, &, # y saltos de línea", () => {
  const url = enlaceWa("573000000000", "Reformer & Mat #1: ¿Cuándo?\nGracias, niño");
  assert.ok(url.startsWith("https://wa.me/573000000000?text="));
  const texto = decodeURIComponent(url.split("?text=")[1]);
  assert.equal(texto, "Reformer & Mat #1: ¿Cuándo?\nGracias, niño");
  assert.ok(!url.includes(" ") && !url.includes("&Mat"));
});

test("limpia símbolos del número", () => {
  assert.equal(enlaceWa("+57 300 000 0000"), "https://wa.me/573000000000");
});
```

`tests/demo.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { listarDemo } from "../scripts/revisar-demo.mjs";

async function fixture(obj, nombre = "a.json") {
  const dir = await mkdtemp(join(tmpdir(), "demo-"));
  await writeFile(join(dir, nombre), JSON.stringify(obj));
  return dir;
}

test("encuentra bloques _demo anidados", async () => {
  const dir = await fixture({ x: 1, contacto: { _demo: true, tel: "1" }, lista: [{ ok: 1 }, { _demo: true }] });
  const r = await listarDemo(dir);
  assert.deepEqual(r, ["a.json › contacto", "a.json › lista[1]"]);
});

test("sin demo devuelve lista vacía", async () => {
  const dir = await fixture({ a: { b: 1 } });
  assert.deepEqual(await listarDemo(dir), []);
});

test("un _demo en la raíz se reporta como (archivo completo)", async () => {
  const dir = await fixture({ _demo: true, a: 1 });
  assert.deepEqual(await listarDemo(dir), ["a.json › (archivo completo)"]);
});

test("--produccion sale con 1 si hay demo, 0 si no", async () => {
  const con = await fixture({ _demo: true });
  const sin = await fixture({ a: 1 });
  const script = new URL("../scripts/revisar-demo.mjs", import.meta.url).pathname;
  assert.throws(() => execFileSync("node", [script, "--produccion", con], { stdio: "pipe" }));
  execFileSync("node", [script, "--produccion", sin], { stdio: "pipe" });
});
```

- [ ] **Step 2: Ejecutar y ver que fallan**

Run: `node --test tests/wa.test.mjs tests/demo.test.mjs`
Expected: FAIL (`Cannot find module`).

- [ ] **Step 3: Implementar**

`src/lib/wa.js`:

```js
/** Enlace de WhatsApp con mensaje prellenado. El número se limpia a solo dígitos. */
export function enlaceWa(numero, mensaje = "") {
  const limpio = String(numero).replace(/\D/g, "");
  const base = `https://wa.me/${limpio}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
```

`src/lib/ruta.js`:

```js
/** Antepone la base del sitio (útil si se publica en una subcarpeta). */
export function ruta(p) {
  const base = (import.meta.env?.BASE_URL ?? "/").replace(/\/$/, "");
  return `${base}/${String(p).replace(/^\//, "")}`.replace(/\/{2,}/g, "/");
}
```

`scripts/revisar-demo.mjs`:

```js
#!/usr/bin/env node
// Lista los bloques con "_demo": true de src/datos/ y, con --produccion, falla si hay alguno.
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

function recorrer(valor, ruta, salida) {
  if (Array.isArray(valor)) {
    valor.forEach((v, i) => recorrer(v, `${ruta}[${i}]`, salida));
  } else if (valor && typeof valor === "object") {
    if (valor._demo === true) salida.push(ruta || "(archivo completo)");
    for (const [k, v] of Object.entries(valor)) {
      if (k === "_demo") continue;
      recorrer(v, ruta ? `${ruta}.${k}` : k, salida);
    }
  }
}

export async function listarDemo(dir) {
  const archivos = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  const todo = [];
  for (const f of archivos) {
    const datos = JSON.parse(await readFile(join(dir, f), "utf8"));
    const hallados = [];
    recorrer(datos, "", hallados);
    hallados.forEach((h) => todo.push(`${f} › ${h}`));
  }
  return todo;
}

const esCli = import.meta.url === new URL(process.argv[1], "file://").href;
if (esCli) {
  const args = process.argv.slice(2);
  const produccion = args.includes("--produccion");
  const dir = resolve(args.find((a) => !a.startsWith("--")) ?? join(import.meta.dirname, "../src/datos"));
  const lista = await listarDemo(dir);
  if (lista.length === 0) {
    console.log("Sin datos de demostración. Listo para publicar.");
  } else {
    console.log(`Datos de demostración (${lista.length}):`);
    lista.forEach((l) => console.log("  - " + l));
    if (produccion) {
      console.error("\nNo se puede publicar: reemplaza estos datos por los reales del cliente.");
      process.exit(1);
    }
  }
}
```

- [ ] **Step 4: Ejecutar y ver que pasan**

Run: `node --test tests/wa.test.mjs tests/demo.test.mjs`
Expected: PASS (7 pruebas).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Helpers de WhatsApp y ruta, y revisor de datos de demostración" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```

---

### Task 3: Fuentes y activos (fotos, logos, mockup, favicon, og)

**Files:**
- Create: `scripts/preparar-fuentes.sh`, `scripts/assets-config.mjs`, `scripts/preparar-assets.mjs`, `tests/fuentes.test.mjs`, `tests/assets.test.mjs`
- Generated (se commitean): `public/fonts/*.woff2`, `public/img/*.webp`, `public/brand/*.png`, `public/og.png`

**Interfaces:**
- Produces:
  - Fuentes: `public/fonts/{almarose-thin,almarose-semibold,technonue-thin,technonue-regular}.woff2`
  - Fotos: `public/img/<nombre>-{480,800,1200,1800}.webp` para `estudio-recepcion`, `estudio-pelotas`, `estudio-sala`, `estudio-nichos`, `estudio-toallas`, `estudio-cortinas` (proporción 3:4)
  - Mockup: `public/img/mockup-vip-{800,1400}.webp` (4:3)
  - Logos PNG transparentes en `public/brand/`: `logo-{espresso,marfil}.png` (solo "aira"), `logo-casa-{espresso,marfil}.png` ("The Pilates House"), `logo-eslogan-{espresso,marfil}.png` ("One breath at a time"), `isotipo-{espresso,marfil}.png`, `favicon.png`, y `public/og.png` (1200×630)

- [ ] **Step 1: Pruebas que fallan**

`tests/fuentes.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const raiz = new URL("../public/fonts/", import.meta.url).pathname;
const fuentes = ["almarose-thin", "almarose-semibold", "technonue-thin", "technonue-regular"];

for (const f of fuentes) {
  test(`${f}.woff2 es un woff2 válido y cubre el español`, async () => {
    const buf = await readFile(raiz + f + ".woff2");
    assert.equal(buf.subarray(0, 4).toString(), "wOF2");
    assert.ok(buf.length > 2000, "archivo sospechosamente pequeño");
    const salida = execFileSync("python3", ["-c", `
from fontTools.ttLib import TTFont
cmap = TTFont("${raiz}${f}.woff2").getBestCmap()
faltan = [c for c in "áéíóúüñÁÉÍÓÚÜÑ¿¡«»–—“”" if ord(c) not in cmap]
print(",".join(faltan))
`]).toString().trim();
    assert.equal(salida, "", `faltan glifos: ${salida}`);
  });
}
```

`tests/assets.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { stat } from "node:fs/promises";
import { FOTOS, ANCHOS, LOGOS, COLORES } from "../scripts/assets-config.mjs";

const pub = new URL("../public/", import.meta.url).pathname;

for (const nombre of Object.keys(FOTOS)) {
  test(`foto ${nombre}: cuatro anchos, proporción 3:4`, async () => {
    for (const w of ANCHOS) {
      const m = await sharp(`${pub}img/${nombre}-${w}.webp`).metadata();
      assert.equal(m.width, w);
      assert.ok(Math.abs(m.width / m.height - 0.75) < 0.01, `${nombre}-${w} no es 3:4`);
    }
  });
}

test("mockup VIP en 800 y 1400, proporción 4:3", async () => {
  for (const w of [800, 1400]) {
    const m = await sharp(`${pub}img/mockup-vip-${w}.webp`).metadata();
    assert.equal(m.width, w);
    assert.ok(Math.abs(m.width / m.height - 4 / 3) < 0.01);
  }
});

for (const [clave] of Object.entries(LOGOS)) {
  for (const color of ["espresso", "marfil"]) {
    test(`${clave}-${color}.png es transparente y del color de marca`, async () => {
      const { data, info } = await sharp(`${pub}brand/${clave}-${color}.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.equal(info.channels, 4);
      let opaco = null, transparente = false;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 255 && !opaco) opaco = [data[i], data[i + 1], data[i + 2]];
        if (data[i + 3] === 0) transparente = true;
      }
      assert.ok(transparente, "no tiene transparencia");
      assert.deepEqual(opaco, COLORES[color]);
    });
  }
}

test("favicon 128x128 y og 1200x630", async () => {
  const f = await sharp(pub + "brand/favicon.png").metadata();
  assert.deepEqual([f.width, f.height], [128, 128]);
  const o = await sharp(pub + "og.png").metadata();
  assert.deepEqual([o.width, o.height], [1200, 630]);
});

test("el peso de public/img queda bajo 12 MB", async () => {
  let total = 0;
  const { readdir } = await import("node:fs/promises");
  for (const f of await readdir(pub + "img")) total += (await stat(pub + "img/" + f)).size;
  assert.ok(total < 12 * 1024 * 1024, `public/img pesa ${(total / 1048576).toFixed(1)} MB`);
});
```

- [ ] **Step 2: Ejecutar y ver que fallan**

Run: `node --test tests/fuentes.test.mjs tests/assets.test.mjs`
Expected: FAIL (archivos y módulo `assets-config.mjs` inexistentes).

- [ ] **Step 3: Implementar la conversión de fuentes**

`scripts/preparar-fuentes.sh`:

```bash
#!/usr/bin/env bash
# Convierte las .otf del cliente a woff2 (subset latín + puntuación tipográfica).
# Uso: scripts/preparar-fuentes.sh "<carpeta TIPOGRAFÍAS>"
# Requiere pyftsubset (fonttools + brotli): pip install fonttools brotli
set -euo pipefail
ORIGEN="${1:?Uso: preparar-fuentes.sh \"<carpeta TIPOGRAFÍAS>\"}"
DESTINO="$(cd "$(dirname "$0")/.." && pwd)/public/fonts"
UNICODES="U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+20AC"

conv() {
  pyftsubset "$ORIGEN/$1" --unicodes="$UNICODES" --flavor=woff2 --layout-features='*' --output-file="$DESTINO/$2"
  echo "ok  $2"
}

conv "Almarose-Thin-iF664dbe5708d99.otf"     almarose-thin.woff2
conv "Almarose-Semibold-iF664dbe56f2afe.otf" almarose-semibold.woff2
conv "Techno_Nue-Thin-iF66cd8474a8764.otf"   technonue-thin.woff2
conv "Techno_Nue-Regular-iF66cd847495173.otf" technonue-regular.woff2
```

- [ ] **Step 4: Implementar el pipeline de imágenes**

`scripts/assets-config.mjs`:

```js
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
```

`scripts/preparar-assets.mjs`:

```js
#!/usr/bin/env node
// Uso: node scripts/preparar-assets.mjs "<carpeta insumos web>"
import sharp from "sharp";
import { join, resolve } from "node:path";
import { FOTOS, ANCHOS, LOGOS, COLORES, MOCKUP_VIP } from "./assets-config.mjs";

const origen = process.argv[2];
if (!origen) {
  console.error('Uso: node scripts/preparar-assets.mjs "<carpeta insumos web>"');
  process.exit(1);
}
const raiz = resolve(import.meta.dirname, "..");
const img = join(raiz, "public/img");
const marca = join(raiz, "public/brand");

/** Logo negro sobre transparente → mismo trazo en otro color, recortado al contenido. */
async function logoColor(archivo, [r, g, b], ancho) {
  const src = sharp(join(origen, "ENTREGABLES AIRA/LOGOS", archivo)).ensureAlpha();
  const { width, height } = await src.metadata();
  const alfa = await src.clone().extractChannel(3).raw().toBuffer();
  return sharp({ create: { width, height, channels: 3, background: { r, g, b } } })
    .joinChannel(alfa, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer()
    .then((buf) => sharp(buf).trim({ threshold: 1 }).resize({ width: ancho }).png({ compressionLevel: 9 }).toBuffer());
}

for (const [nombre, archivo] of Object.entries(FOTOS)) {
  for (const w of ANCHOS) {
    await sharp(join(origen, archivo)).rotate().resize({ width: w }).webp({ quality: 78, effort: 5 })
      .toFile(join(img, `${nombre}-${w}.webp`));
  }
  console.log("foto", nombre);
}

for (const w of MOCKUP_VIP.anchos) {
  await sharp(join(origen, MOCKUP_VIP.archivo)).resize({ width: w }).webp({ quality: 80, effort: 5 })
    .toFile(join(img, `mockup-vip-${w}.webp`));
}
console.log("mockup vip");

const buffers = {};
for (const [clave, { archivo, ancho }] of Object.entries(LOGOS)) {
  for (const [color, rgb] of Object.entries(COLORES)) {
    const buf = await logoColor(archivo, rgb, ancho);
    buffers[`${clave}-${color}`] = buf;
    await sharp(buf).toFile(join(marca, `${clave}-${color}.png`));
  }
  console.log("logo", clave);
}

// Favicon: isotipo espresso sobre marfil.
const iso = await sharp(buffers["isotipo-espresso"]).resize({ width: 96 }).toBuffer();
await sharp({ create: { width: 128, height: 128, channels: 3, background: { r: 246, g: 245, b: 227 } } })
  .composite([{ input: iso, gravity: "center" }]).png().toFile(join(marca, "favicon.png"));

// Imagen para redes: logo con "The Pilates House" centrado sobre marfil.
const logoOg = await sharp(buffers["logo-casa-espresso"]).resize({ width: 520 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: 246, g: 245, b: 227 } } })
  .composite([{ input: logoOg, gravity: "center" }]).png().toFile(join(raiz, "public/og.png"));
console.log("favicon y og");
```

- [ ] **Step 5: Generar y ver que pasan**

```bash
INS="/mnt/5ddaa367-d44e-4462-8632-c0f57f33031c/MEGA/CLIENTES POSIBLES/AIRA STUDIO PILATES/insumos web"
chmod +x scripts/preparar-fuentes.sh
PATH="$HOME/.local/bin:$PATH" scripts/preparar-fuentes.sh "$INS/ENTREGABLES AIRA/TIPOGRAFÍAS"
node scripts/preparar-assets.mjs "$INS"
node --test tests/fuentes.test.mjs tests/assets.test.mjs
```
Expected: PASS. Si `fuentes.test` informa glifos faltantes en alguna familia (p. ej. `«»`), quitar esos caracteres de la cadena de la prueba **solo si** no se usan en ningún texto, y dejar constancia en `PENDIENTES.md`.

- [ ] **Step 6: Verificar a ojo los logos y el favicon**

Abrir `public/brand/logo-espresso.png`, `logo-casa-marfil.png`, `isotipo-espresso.png`, `favicon.png` y `public/og.png` con la herramienta Read y confirmar: trazo fino reconocible, sin fondo, `logo-casa` dice "THE PILATES HOUSE", `logo-eslogan` dice "ONE BREATH AT A TIME". Abrir también `public/img/mockup-vip-1400.webp` para confirmar que es la tarjeta VIP. Si algún archivo de origen no es el esperado, corregir `assets-config.mjs` y regenerar.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "Fuentes woff2, fotos WebP, logos recoloreados y favicon/og" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```

---

### Task 4: Datos del sitio (con demo) y su validación

**Files:**
- Create: `src/datos/sitio.json`, `src/datos/inicio.json`, `src/datos/la-casa.json`, `src/datos/clases.json`, `src/datos/membresia.json`, `src/datos/contacto.json`, `tests/datos.test.mjs`

**Interfaces:**
- Produces (consumen todos los componentes y páginas):
  - `sitio.json`: `nombre, marca, eslogan, descripcion, indexar, empresa{_demo,razonSocial,nit}, contacto{_demo,whatsapp,whatsappVisible,correo,mensajeReserva,direccion{linea,ciudad,referencia},horario[{dias,horas}],redes[{nombre,usuario,href}]}, menu[{id,texto,href}], legales[{texto,href}], ui{…}, pie{explorar,visitanos,conecta}`
  - Cada página: `meta{titulo,descripcion}` + bloques descritos abajo. Las fotos se nombran por `imagen` (base sin ancho) y su `alt`.
  - Botones: `{ texto, tipo?: "reserva", href?, variante: "solido"|"contorno" }`; `tipo:"reserva"` usa el WhatsApp de `sitio.contacto`.

- [ ] **Step 1: Prueba que falla**

`tests/datos.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";

const dir = new URL("../src/datos/", import.meta.url).pathname;
const pub = new URL("../public/", import.meta.url).pathname;
const cargar = async (n) => JSON.parse(await readFile(dir + n, "utf8"));
const paginas = ["inicio", "la-casa", "clases", "membresia", "contacto"];

function recoger(valor, clave, salida) {
  if (Array.isArray(valor)) valor.forEach((v) => recoger(v, clave, salida));
  else if (valor && typeof valor === "object")
    for (const [k, v] of Object.entries(valor)) {
      if (k === clave && typeof v === "string") salida.push(v);
      else recoger(v, clave, salida);
    }
}

test("todos los JSON parsean", async () => {
  for (const f of (await readdir(dir)).filter((x) => x.endsWith(".json"))) await cargar(f);
});

test("sitio.json trae lo que los componentes necesitan", async () => {
  const s = await cargar("sitio.json");
  for (const k of ["nombre", "marca", "eslogan", "descripcion", "menu", "ui", "pie", "contacto"]) assert.ok(s[k], `falta ${k}`);
  assert.equal(s.menu.length, 5);
  assert.match(s.contacto.whatsapp, /^\d{10,15}$/);
  assert.ok(s.contacto.mensajeReserva.length > 10);
  for (const k of ["irAlContenido", "abrirMenu", "cerrarMenu", "menuPrincipal", "irInicio", "reservar", "reservarWa", "volverArriba", "menuMovil"]) assert.ok(s.ui[k], `ui.${k}`);
  assert.equal(s.indexar, false, "mientras haya demo, indexar debe ser false");
});

for (const p of paginas) {
  test(`${p}.json: meta con título y descripción de 120–160 caracteres`, async () => {
    const d = await cargar(p + ".json");
    assert.ok(d.meta.titulo.length >= 10 && d.meta.titulo.length <= 70, `título ${d.meta.titulo.length}`);
    const n = d.meta.descripcion.length;
    assert.ok(n >= 120 && n <= 160, `descripción de ${p}: ${n} caracteres`);
  });
}

test("toda foto referenciada existe y tiene alt", async () => {
  for (const p of ["sitio", ...paginas]) {
    const d = await cargar(p + ".json");
    const imgs = [];
    recoger(d, "imagen", imgs);
    for (const base of imgs) {
      const ancho = base.startsWith("mockup-") ? 800 : 800;
      await access(`${pub}img/${base}-${ancho}.webp`);
    }
  }
  // cada objeto con "imagen" debe tener "alt" no vacío
  const conImagen = [];
  (function buscar(v) {
    if (Array.isArray(v)) v.forEach(buscar);
    else if (v && typeof v === "object") {
      if (typeof v.imagen === "string") conImagen.push(v);
      Object.values(v).forEach(buscar);
    }
  })(await Promise.all(paginas.map((p) => cargar(p + ".json"))));
  for (const o of conImagen) assert.ok(o.alt && o.alt.length > 8, `sin alt: ${o.imagen}`);
});

test("precios de membresía son enteros positivos en COP", async () => {
  const m = await cargar("membresia.json");
  for (const plan of m.planes.items) {
    assert.ok(Number.isInteger(plan.precio) && plan.precio > 0);
  }
  assert.equal(m.planes.moneda, "COP");
});

test("las clases tienen mensaje de reserva y foto", async () => {
  const c = await cargar("clases.json");
  assert.ok(c.lista.items.length >= 4);
  for (const it of c.lista.items) {
    assert.ok(it.titulo && it.texto && it.duracion && it.nivel && it.mensaje && it.imagen);
  }
});

test("hay datos _demo marcados en los archivos con datos inventados", async () => {
  for (const [archivo, ruta] of [["sitio.json", ["contacto"]], ["sitio.json", ["empresa"]], ["clases.json", []], ["membresia.json", []], ["inicio.json", ["testimonios"]], ["contacto.json", ["faq"]]]) {
    let n = await cargar(archivo);
    for (const k of ruta) n = n[k];
    assert.equal(n._demo, true, `${archivo} › ${ruta.join(".") || "(raíz)"} sin _demo`);
  }
});
```

- [ ] **Step 2: Ejecutar y ver que falla**

Run: `node --test tests/datos.test.mjs`
Expected: FAIL (`ENOENT … sitio.json`).

- [ ] **Step 3: Crear `src/datos/sitio.json`**

```json
{
  "nombre": "Aira",
  "marca": "The Pilates House",
  "eslogan": "One breath at a time",
  "descripcion": "Aira, The Pilates House. Un refugio de calma donde la serenidad y el movimiento se encuentran. Reserva tu primera experiencia.",
  "indexar": false,

  "empresa": {
    "_demo": true,
    "razonSocial": "Aira Studio Pilates S.A.S.",
    "nit": "000.000.000-0"
  },

  "contacto": {
    "_demo": true,
    "whatsapp": "573000000000",
    "whatsappVisible": "+57 300 000 0000",
    "correo": "hola@aira.example",
    "mensajeReserva": "Hola Aira, me gustaría reservar mi primera experiencia.",
    "direccion": {
      "linea": "Calle 00 # 00-00, Local 000",
      "ciudad": "Bogotá, Colombia",
      "referencia": "Entrada por el lobby principal del edificio"
    },
    "horario": [
      { "dias": "Lunes a viernes", "horas": "6:00 a. m. – 8:00 p. m." },
      { "dias": "Sábados", "horas": "8:00 a. m. – 1:00 p. m." },
      { "dias": "Domingos y festivos", "horas": "Cerrado" }
    ],
    "redes": [
      { "nombre": "Instagram", "usuario": "@aira.thepilateshouse", "href": "https://www.instagram.com/" }
    ]
  },

  "menu": [
    { "id": "inicio", "texto": "Inicio", "href": "/" },
    { "id": "la-casa", "texto": "La casa", "href": "/la-casa" },
    { "id": "clases", "texto": "Clases", "href": "/clases" },
    { "id": "membresia", "texto": "Membresía", "href": "/membresia" },
    { "id": "contacto", "texto": "Contacto", "href": "/contacto" }
  ],

  "legales": [],

  "ui": {
    "irAlContenido": "Ir al contenido",
    "abrirMenu": "Abrir menú",
    "cerrarMenu": "Cerrar menú",
    "menuPrincipal": "Menú principal",
    "menuMovil": "Menú",
    "irInicio": "ir al inicio",
    "reservar": "Reservar",
    "reservarWa": "Reservar por WhatsApp",
    "escribirWa": "Escribir por WhatsApp",
    "volverArriba": "Volver arriba",
    "abreNuevaPestana": "se abre en una pestaña nueva"
  },

  "pie": {
    "explorar": "Explorar",
    "visitanos": "Visítanos",
    "conecta": "Conecta"
  }
}
```

- [ ] **Step 4: Crear `src/datos/inicio.json`**

```json
{
  "meta": {
    "titulo": "Aira · The Pilates House — Serenidad en movimiento",
    "descripcion": "Un refugio de calma donde el pilates reformer fusiona serenidad y movimiento. Descubre Aira, The Pilates House, y reserva tu primera experiencia."
  },

  "portada": {
    "etiqueta": "The Pilates House",
    "titulo": "Serenidad\nen movimiento",
    "texto": "Redefinimos el bienestar: fusionamos serenidad y movimiento en un refugio de calma que conecta mente, cuerpo y espíritu.",
    "botones": [
      { "texto": "Reservar mi primera experiencia", "tipo": "reserva", "variante": "solido" },
      { "texto": "Conocer la casa", "href": "/la-casa", "variante": "contorno" }
    ],
    "imagen": "estudio-recepcion",
    "alt": "Recepción de Aira: muro curvo blanco con el logo en relieve, mostrador color arena y una planta en maceta de cerámica"
  },

  "filosofia": {
    "etiqueta": "Nuestro propósito",
    "texto": "Propiciar la serenidad mental, el balance físico y espiritual mediante una experiencia sensorial consciente."
  },

  "pilares": {
    "etiqueta": "Descubre Aira",
    "titulo": "Una casa, tres formas de entrar",
    "items": [
      {
        "etiqueta": "/ la casa /",
        "titulo": "Un refugio de calma",
        "texto": "Un espacio minimalista, de luz cálida y líneas suaves, pensado para que el ruido se quede afuera.",
        "enlace": { "texto": "Descubrir la casa", "href": "/la-casa" },
        "imagen": "estudio-sala",
        "alt": "Sala principal con reformers alineados bajo una línea de luz cálida"
      },
      {
        "etiqueta": "/ clases /",
        "titulo": "Experiencia inmersiva",
        "texto": "Pilates reformer y mat con atención personalizada, guiado por la respiración y el control.",
        "enlace": { "texto": "Ver las clases", "href": "/clases" },
        "imagen": "estudio-pelotas",
        "alt": "Rincón del estudio con esferas de pilates color crema apiladas junto a un reformer"
      },
      {
        "etiqueta": "/ membresía /",
        "titulo": "Personalización y calidad",
        "texto": "Planes para sostener tu práctica, con beneficios exclusivos para quienes hacen de Aira su casa.",
        "enlace": { "texto": "Conocer la membresía", "href": "/membresia" },
        "imagen": "estudio-toallas",
        "alt": "Vestier con casilleros y estación de devolución de toallas"
      }
    ]
  },

  "cita": {
    "texto": "Creemos en la simplicidad que habla, en la experiencia sensorial que trasciende lo físico.",
    "firma": "One breath at a time"
  },

  "espacio": {
    "etiqueta": "El espacio",
    "titulo": "Diseñado para sentirse",
    "texto": "Luz que acompaña, materiales nobles y cada detalle en su lugar: del reformer a la toalla.",
    "imagenes": [
      {
        "imagen": "estudio-cortinas",
        "alt": "Hilera de reformers frente a cortinas translúcidas, con plantas a los lados"
      },
      {
        "imagen": "estudio-nichos",
        "alt": "Nichos en arco iluminados junto al mostrador de recepción"
      }
    ]
  },

  "testimonios": {
    "_demo": true,
    "etiqueta": "Voces de Aira",
    "titulo": "Lo que se siente",
    "items": [
      { "texto": "Entro y el ruido se queda afuera. Es la hora más tranquila de mi día.", "nombre": "Camila", "rol": "Miembro" },
      { "texto": "Cada detalle, de la luz a las toallas, está pensado para que te sientas cuidada.", "nombre": "Valentina", "rol": "Miembro" },
      { "texto": "Salgo con la mente en calma y el cuerpo despierto. Ya no imagino mi semana sin Aira.", "nombre": "Mariana", "rol": "Miembro" }
    ]
  },

  "cierre": {
    "etiqueta": "Tu primera vez",
    "titulo": "Respira.\nNosotros nos encargamos del resto.",
    "texto": "Escríbenos por WhatsApp y reserva tu primera experiencia en Aira.",
    "boton": { "texto": "Reservar por WhatsApp", "tipo": "reserva", "variante": "solido" },
    "imagen": "estudio-nichos",
    "alt": "Nichos en arco iluminados junto al mostrador de recepción"
  }
}
```

- [ ] **Step 5: Crear `src/datos/la-casa.json`**

```json
{
  "meta": {
    "titulo": "La casa · Aira, The Pilates House",
    "descripcion": "Conoce Aira: un espacio minimalista y exclusivo donde mente, cuerpo y espíritu se reencuentran a través del pilates reformer y la calma."
  },

  "encabezado": {
    "etiqueta": "La casa",
    "titulo": "Un refugio\nde calma",
    "texto": "Un espacio integral, minimalista y exclusivo, creado para respirar."
  },

  "historia": {
    "lineas": [
      "Redefinimos el bienestar, fusionamos serenidad y movimiento.",
      "Nuestro espacio, un refugio de calma que conecta mente, cuerpo y espíritu.",
      "Creemos en la simplicidad que habla, en la experiencia sensorial que trasciende lo físico.",
      "En Aira cultivamos la calma mental, potenciamos el equilibrio corporal y celebramos la conciencia plena."
    ]
  },

  "proposito": {
    "etiqueta": "Propósito",
    "texto": "Propiciar la serenidad mental, el balance físico y espiritual mediante una experiencia sensorial consciente."
  },

  "esencia": {
    "columnas": [
      { "etiqueta": "/ lo que tiene /", "titulo": "Atributos", "items": ["Integral", "Minimalista", "Exclusivo"] },
      { "etiqueta": "/ lo que piensa el cliente /", "titulo": "Beneficios", "items": ["Experiencia inmersiva", "Personalización", "Calidad"] },
      { "etiqueta": "/ lo que se genera /", "titulo": "Valores", "items": ["Serenidad", "Conexión mente cuerpo", "Bienestar"] }
    ]
  },

  "galeria": {
    "etiqueta": "Los espacios",
    "titulo": "Cada rincón, en calma",
    "items": [
      { "imagen": "estudio-recepcion", "alt": "Recepción de Aira: muro curvo blanco con el logo en relieve y mostrador color arena", "leyenda": "Recepción" },
      { "imagen": "estudio-sala", "alt": "Sala principal con reformers alineados bajo una línea de luz cálida", "leyenda": "La sala" },
      { "imagen": "estudio-pelotas", "alt": "Esferas de pilates color crema apiladas junto a un reformer", "leyenda": "Accesorios" },
      { "imagen": "estudio-cortinas", "alt": "Hilera de reformers frente a cortinas translúcidas", "leyenda": "Luz natural" },
      { "imagen": "estudio-nichos", "alt": "Nichos en arco iluminados junto a la recepción", "leyenda": "Los nichos" },
      { "imagen": "estudio-toallas", "alt": "Vestier con casilleros y estación de devolución de toallas", "leyenda": "El vestier" }
    ]
  },

  "cierre": {
    "etiqueta": "Te esperamos",
    "titulo": "Ven a conocer la casa",
    "texto": "Escríbenos y agenda tu visita o tu primera clase.",
    "boton": { "texto": "Reservar por WhatsApp", "tipo": "reserva", "variante": "solido" }
  }
}
```

- [ ] **Step 6: Crear `src/datos/clases.json`**

```json
{
  "_demo": true,
  "meta": {
    "titulo": "Clases · Aira, The Pilates House",
    "descripcion": "Clases de pilates reformer y mat de 50 minutos en Aira, para todos los niveles, con atención personalizada y grupos reducidos."
  },

  "encabezado": {
    "etiqueta": "Clases",
    "titulo": "Experiencia\ninmersiva",
    "texto": "Cada clase es una pausa: respiración, control y movimiento con atención personalizada."
  },

  "lista": {
    "items": [
      {
        "titulo": "Reformer Esencial",
        "texto": "Los fundamentos del método sobre el reformer: respiración, alineación y centro. El mejor punto de partida.",
        "duracion": "50 min",
        "nivel": "Todos los niveles",
        "imagen": "estudio-sala",
        "alt": "Sala principal con reformers alineados bajo una línea de luz cálida",
        "mensaje": "Hola Aira, quiero reservar una clase de Reformer Esencial."
      },
      {
        "titulo": "Reformer Flow",
        "texto": "Secuencias continuas y fluidas que enlazan movimiento y respiración. Calma activa, sin prisa.",
        "duracion": "50 min",
        "nivel": "Intermedio",
        "imagen": "estudio-cortinas",
        "alt": "Hilera de reformers frente a cortinas translúcidas",
        "mensaje": "Hola Aira, quiero reservar una clase de Reformer Flow."
      },
      {
        "titulo": "Reformer Sculpt",
        "texto": "Mayor resistencia y control para trabajar el cuerpo con precisión, siempre desde el centro.",
        "duracion": "50 min",
        "nivel": "Intermedio · Avanzado",
        "imagen": "estudio-pelotas",
        "alt": "Esferas de pilates color crema apiladas junto a un reformer",
        "mensaje": "Hola Aira, quiero reservar una clase de Reformer Sculpt."
      },
      {
        "titulo": "Mat Serenidad",
        "texto": "Trabajo de suelo con foco en la respiración, la movilidad y la conciencia del cuerpo.",
        "duracion": "50 min",
        "nivel": "Todos los niveles",
        "imagen": "estudio-nichos",
        "alt": "Nichos en arco iluminados junto a la recepción",
        "mensaje": "Hola Aira, quiero reservar una clase de Mat Serenidad."
      },
      {
        "titulo": "Sesión privada",
        "texto": "Una hora para ti y tu instructora, con una práctica diseñada a tu medida.",
        "duracion": "55 min",
        "nivel": "A tu medida",
        "imagen": "estudio-recepcion",
        "alt": "Recepción de Aira con el logo en relieve",
        "mensaje": "Hola Aira, quiero reservar una sesión privada."
      }
    ]
  },

  "pasos": {
    "etiqueta": "Cómo reservar",
    "titulo": "Tres respiros",
    "items": [
      { "numero": "01", "titulo": "Escríbenos", "texto": "Cuéntanos por WhatsApp qué clase te interesa." },
      { "numero": "02", "titulo": "Elige tu horario", "texto": "Te proponemos los espacios disponibles y confirmas tu cupo." },
      { "numero": "03", "titulo": "Llega y respira", "texto": "Ven diez minutos antes: nosotros nos encargamos del resto." }
    ]
  },

  "cierre": {
    "etiqueta": "Primera vez",
    "titulo": "Empieza con una clase",
    "texto": "Si es tu primera vez en Aira, te acompañamos desde el primer minuto.",
    "boton": { "texto": "Reservar por WhatsApp", "tipo": "reserva", "variante": "solido" }
  }
}
```

- [ ] **Step 7: Crear `src/datos/membresia.json`**

```json
{
  "_demo": true,
  "meta": {
    "titulo": "Membresía · Aira, The Pilates House",
    "descripcion": "Planes de membresía de Aira con clases mensuales y beneficios exclusivos. Descubre la tarjeta VIP y elige el plan que acompaña tu práctica."
  },

  "encabezado": {
    "etiqueta": "Membresía",
    "titulo": "Hacer de Aira\ntu casa",
    "texto": "Planes pensados para sostener tu práctica, con beneficios para quienes la hacen un hábito."
  },

  "vip": {
    "etiqueta": "Aira VIP",
    "titulo": "Una tarjeta, una forma de pertenecer",
    "texto": "Quienes eligen Aira VIP reciben su tarjeta de miembro y acceso a beneficios exclusivos dentro de la casa.",
    "imagen": "mockup-vip",
    "alt": "Dos tarjetas de miembro de Aira: una con el logo en relieve y otra con el isotipo y la palabra Member"
  },

  "planes": {
    "etiqueta": "Planes",
    "titulo": "Elige tu ritmo",
    "moneda": "COP",
    "periodo": "al mes",
    "nota": "Valores de referencia en pesos colombianos. Consulta por WhatsApp las condiciones vigentes.",
    "items": [
      {
        "nombre": "Esencial",
        "resumen": "Para empezar a sostener la práctica.",
        "precio": 620000,
        "destacado": false,
        "beneficios": ["8 clases al mes", "Reformer y mat", "Reserva desde el WhatsApp"],
        "mensaje": "Hola Aira, me interesa el plan Esencial."
      },
      {
        "nombre": "Equilibrio",
        "resumen": "El ritmo que mejor acompaña una vida activa.",
        "precio": 840000,
        "destacado": true,
        "beneficios": ["12 clases al mes", "Reformer y mat", "Reserva prioritaria", "Una sesión de valoración"],
        "mensaje": "Hola Aira, me interesa el plan Equilibrio."
      },
      {
        "nombre": "Aira VIP",
        "resumen": "La experiencia completa, sin límites de calma.",
        "precio": 1290000,
        "destacado": false,
        "beneficios": ["20 clases al mes", "Tarjeta VIP de miembro", "Reserva prioritaria", "Una sesión privada al mes", "Un invitado al mes"],
        "mensaje": "Hola Aira, me interesa el plan Aira VIP."
      }
    ]
  },

  "cierre": {
    "etiqueta": "Hablemos",
    "titulo": "¿Cuál es tu plan?",
    "texto": "Escríbenos y te ayudamos a elegir el ritmo que mejor te acompaña.",
    "boton": { "texto": "Hablar por WhatsApp", "tipo": "reserva", "variante": "solido" }
  }
}
```

- [ ] **Step 8: Crear `src/datos/contacto.json`**

```json
{
  "meta": {
    "titulo": "Contacto y reservas · Aira, The Pilates House",
    "descripcion": "Reserva tu clase en Aira por WhatsApp. Encuentra la dirección, los horarios y las respuestas a las dudas más frecuentes antes de tu primera visita."
  },

  "encabezado": {
    "etiqueta": "Contacto",
    "titulo": "Reserva\ntu primera clase",
    "texto": "La forma más simple de reservar es escribirnos por WhatsApp."
  },

  "reserva": {
    "titulo": "Reserva por WhatsApp",
    "texto": "Cuéntanos qué clase te interesa y te proponemos los horarios disponibles.",
    "boton": { "texto": "Escribir por WhatsApp", "tipo": "reserva", "variante": "solido" }
  },

  "visita": {
    "titulo": "Visítanos",
    "etiquetas": { "direccion": "Dirección", "horario": "Horario", "correo": "Correo", "redes": "Redes" }
  },

  "mapa": {
    "embedUrl": "",
    "titulo": "Cómo llegar"
  },

  "faq": {
    "_demo": true,
    "etiqueta": "Antes de venir",
    "titulo": "Preguntas frecuentes",
    "items": [
      { "pregunta": "¿Qué debo llevar a mi primera clase?", "respuesta": "Ropa cómoda y medias antideslizantes. Nosotros ponemos el resto: reformer, accesorios y toalla." },
      { "pregunta": "¿Necesito experiencia previa?", "respuesta": "No. Las clases Reformer Esencial y Mat Serenidad están pensadas para todos los niveles, y te acompañamos desde el primer minuto." },
      { "pregunta": "¿Con cuánta anticipación debo llegar?", "respuesta": "Te recomendamos llegar diez minutos antes para instalarte con calma y conocer el espacio." },
      { "pregunta": "¿Cómo cancelo o cambio una reserva?", "respuesta": "Escríbenos por WhatsApp con al menos doce horas de anticipación y reprogramamos tu clase." }
    ]
  },

  "cierre": {
    "etiqueta": "Te esperamos",
    "titulo": "Un respiro a la vez",
    "texto": "Escríbenos cuando quieras: te respondemos con calma.",
    "boton": { "texto": "Reservar por WhatsApp", "tipo": "reserva", "variante": "solido" }
  }
}
```

- [ ] **Step 9: Validar los largos de las descripciones**

Run: `node --test tests/datos.test.mjs`
Expected: PASS. Si una `descripcion` falla por largo (debe estar entre 120 y 160), ajustar el texto del JSON sin cambiar su sentido y repetir.

- [ ] **Step 10: Revisor de demo**

Run: `npm run revisar-demo`
Expected: lista con `sitio.json › empresa`, `sitio.json › contacto`, `inicio.json › testimonios`, `clases.json › (archivo completo)`, `membresia.json › (archivo completo)`, `contacto.json › faq`. Y `npm run revisar-demo -- --produccion; echo $?` imprime `1`.

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "Datos del sitio con contenido de demostración marcado y su validación" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```

---

### Task 5: Sistema de diseño y Layout (tokens, tipografía, cabecera, pie, movimiento)

> Invocar `frontend-design` e `impeccable` antes de empezar. El CSS de abajo es la base verificable; se afina viendo el resultado en el navegador.

**Files:**
- Create: `src/styles/global.css`, `src/layouts/Layout.astro`, `src/components/{Foto,Arco,Boton,Encabezado,Separador,Cabecera,Pie}.astro`, `public/robots.txt`, `src/pages/sitemap.xml.js`, `tests/build.test.mjs`
- Modify: `src/pages/index.astro` (página mínima de prueba que usa Layout)

**Interfaces:**
- Produces:
  - `Layout.astro` props: `{ titulo: string; descripcion: string; activa?: string; ogImagen?: string }`; slot por defecto. Provee `<main id="contenido">`, `html.js`, clases `.rev` (aparición; `--i` para escalonado) y `[data-parallax="<px>"]`.
  - `Foto.astro` props: `{ base: string; alt: string; anchos?: number[]; natural?: string /* "3 / 4" */; sizes?: string; prioridad?: boolean; parallax?: number; clase?: string }`
  - `Arco.astro` props: `{ ratio?: string /* "3 / 4" */; clase?: string }`, slot.
  - `Boton.astro` props: `{ texto: string; href: string; variante?: "solido"|"contorno"|"marfil"; externo?: boolean; clase?: string }`
  - `Encabezado.astro` props: `{ etiqueta?: string; titulo: string /* "\n" = salto */; texto?: string; nivel?: 1|2; alinear?: "izq"|"centro"; tono?: "claro"|"oscuro" }`
  - `Separador.astro` sin props (isotipo entre líneas).
  - Utilidades CSS globales: `.contenedor`, `.etiqueta`, `.titulo-xl`, `.titulo-lg`, `.lead`, `.seccion`, `.banda`, `.botones`.

- [ ] **Step 1: Escribir la prueba de build que falla**

`tests/build.test.mjs`:

```js
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const raiz = new URL("../", import.meta.url).pathname;
const dist = join(raiz, "dist");
const sitio = JSON.parse(await readFile(join(raiz, "src/datos/sitio.json"), "utf8"));

async function htmls(dir = dist) {
  const salida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await htmls(p)));
    else if (e.name.endsWith(".html")) salida.push(p);
  }
  return salida;
}

before(() => {
  execFileSync("npm", ["run", "build"], { cwd: raiz, stdio: "pipe" });
});

test("cada página cumple las reglas de calidad", async () => {
  const archivos = await htmls();
  assert.ok(archivos.length > 0, "no hay HTML en dist");
  for (const f of archivos) {
    const h = await readFile(f, "utf8");
    const nombre = f.replace(dist, "");
    assert.match(h, /<html lang="es"/, `${nombre}: sin lang="es"`);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, `${nombre}: debe haber exactamente un h1`);
    const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    assert.ok(t.length >= 10 && t.length <= 70, `${nombre}: título de ${t.length} caracteres`);
    if (!nombre.includes("404")) {
      const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
      assert.ok(d.length >= 120 && d.length <= 160, `${nombre}: descripción de ${d.length}`);
    }
    for (const img of h.match(/<img\b[^>]*>/g) || []) assert.match(img, /\balt=/, `${nombre}: img sin alt → ${img.slice(0, 80)}`);
    assert.ok(!/href=""/.test(h), `${nombre}: href vacío`);
    assert.ok(!/(googleapis|gstatic|placehold\.co|unpkg|jsdelivr|cdnjs)/.test(h), `${nombre}: recurso externo`);
    assert.ok(!h.includes("{{"), `${nombre}: marcador sin reemplazar`);
    if (sitio.indexar === false) assert.match(h, /<meta name="robots" content="noindex/, `${nombre}: falta noindex`);
  }
});

test("el contenido solo se oculta bajo html.js (sin JS todo se ve)", async () => {
  const css = (await readdir(join(dist, "_astro"))).filter((f) => f.endsWith(".css"));
  assert.ok(css.length > 0);
  for (const f of css) {
    const c = await readFile(join(dist, "_astro", f), "utf8");
    assert.ok(!/(^|[}\s,])\.rev(\.[\w-]+)*\s*\{[^}]*opacity:\s*0/.test(c), `${f}: .rev oculta sin el prefijo .js`);
  }
  const inicio = await readFile(join(dist, "index.html"), "utf8");
  assert.ok(!/style="[^"]*opacity:\s*0/.test(inicio), "opacity:0 en línea en el HTML");
});

test("hay sitemap y robots", async () => {
  const s = await readFile(join(dist, "sitemap.xml"), "utf8");
  assert.match(s, /<urlset/);
  const r = await readFile(join(dist, "robots.txt"), "utf8");
  assert.match(r, /Disallow: \//);
});
```

- [ ] **Step 2: Ejecutar y ver que falla**

Run: `node --test tests/build.test.mjs`
Expected: FAIL (el `index.astro` provisional no tiene descripción ni noindex; no hay sitemap).

- [ ] **Step 3: `src/styles/global.css`**

```css
@import "tailwindcss";

/* ---------- Tipografías de la marca (auto-hospedadas) ---------- */
@font-face { font-family: "Almarose"; font-weight: 100; font-style: normal; font-display: swap; src: url("/fonts/almarose-thin.woff2") format("woff2"); }
@font-face { font-family: "Almarose"; font-weight: 600; font-style: normal; font-display: swap; src: url("/fonts/almarose-semibold.woff2") format("woff2"); }
@font-face { font-family: "Techno Nue"; font-weight: 100; font-style: normal; font-display: swap; src: url("/fonts/technonue-thin.woff2") format("woff2"); }
@font-face { font-family: "Techno Nue"; font-weight: 400; font-style: normal; font-display: swap; src: url("/fonts/technonue-regular.woff2") format("woff2"); }

@theme {
  --font-display: "Almarose", "Helvetica Neue", Arial, sans-serif;
  --font-etiqueta: "Techno Nue", "Helvetica Neue", Arial, sans-serif;
  --color-marfil: #F6F5E3;
  --color-arena: #E7DEB5;
  --color-taupe: #B49F84;
  --color-espresso: #60554A;
}

:root {
  color-scheme: light;
  --marfil: #F6F5E3;
  --arena: #E7DEB5;
  --taupe: #B49F84;
  --espresso: #60554A;
  --texto: #60554A;
  --texto-suave: #6F6457;
  --linea: rgba(96, 85, 74, 0.28);
  --gutter: clamp(20px, 5vw, 64px);
  --max: 1280px;
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --nav-h: 72px;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; scroll-padding-top: var(--nav-h); }
body {
  margin: 0;
  background: var(--marfil);
  color: var(--texto);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1rem, 0.96rem + 0.2vw, 1.0625rem);
  line-height: 1.7;
  letter-spacing: 0.01em;
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;
}
img { display: block; max-width: 100%; height: auto; }
a { color: inherit; }
:focus-visible { outline: 2px solid var(--espresso); outline-offset: 4px; border-radius: 2px; }
.banda :focus-visible { outline-color: var(--marfil); }
::selection { background: var(--arena); color: var(--espresso); }

/* ---------- Utilidades de composición ---------- */
.contenedor { width: 100%; max-width: var(--max); margin-inline: auto; padding-inline: var(--gutter); }
.seccion { padding-block: clamp(72px, 11vw, 160px); }
.etiqueta {
  font-family: var(--font-etiqueta); font-weight: 400; font-size: 0.75rem;
  letter-spacing: 0.24em; text-transform: uppercase; color: var(--texto-suave); margin: 0;
}
.titulo-xl, .titulo-lg { font-weight: 100; margin: 0; line-height: 1.04; letter-spacing: -0.01em; overflow-wrap: break-word; }
.titulo-xl { font-size: clamp(2.5rem, 1.2rem + 6.2vw, 6.25rem); }
.titulo-lg { font-size: clamp(2.125rem, 1.2rem + 3.6vw, 4rem); }
.lead { font-size: clamp(1.0625rem, 1rem + 0.5vw, 1.3125rem); line-height: 1.65; max-width: 38ch; color: var(--texto-suave); margin: 0; }
.botones { display: flex; flex-wrap: wrap; gap: 14px; }

/* Banda espresso (cita, CTA, pie) */
.banda { background: var(--espresso); color: var(--marfil); }
.banda .etiqueta, .banda .lead { color: var(--marfil); }

/* ---------- Aparición al bajar: solo se oculta si hay JS ---------- */
.js .rev { opacity: 0; transform: translateY(26px); transition: opacity 1.1s var(--ease), transform 1.1s var(--ease); transition-delay: calc(var(--i, 0) * 120ms); }
.js .rev.seen { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .js .rev { opacity: 1; transform: none; transition: none; }
  [data-parallax] { transform: none !important; }
}
```

- [ ] **Step 4: Componentes base**

`src/components/Foto.astro`:

```astro
---
const {
  base, alt,
  anchos = [480, 800, 1200, 1800],
  natural = "3 / 4",
  sizes = "(min-width: 1024px) 40vw, 90vw",
  prioridad = false, parallax = 0, clase = "",
} = Astro.props;
import { ruta } from "../lib/ruta.js";
const mayor = anchos[anchos.length - 1];
const [rw, rh] = natural.split("/").map(Number);
const srcset = anchos.map((w) => `${ruta(`/img/${base}-${w}.webp`)} ${w}w`).join(", ");
const medio = anchos.includes(800) ? 800 : anchos[0];
---
<img
  src={ruta(`/img/${base}-${medio}.webp`)}
  srcset={srcset}
  sizes={sizes}
  alt={alt}
  width={mayor}
  height={Math.round((mayor * rh) / rw)}
  loading={prioridad ? "eager" : "lazy"}
  fetchpriority={prioridad ? "high" : "auto"}
  decoding="async"
  class={clase}
  data-parallax={parallax || undefined}
/>
```

`src/components/Arco.astro`:

```astro
---
const { ratio = "3 / 4", clase = "" } = Astro.props;
---
<div class:list={["arco", clase]} style={`--r:${ratio}`}><slot /></div>

<style>
  .arco {
    aspect-ratio: var(--r);
    border-radius: 999px 999px 0 0;
    overflow: hidden;
    background: var(--arena);
  }
  .arco :global(img) { width: 100%; height: 100%; object-fit: cover; }
</style>
```

`src/components/Boton.astro`:

```astro
---
import sitio from "../datos/sitio.json";
const { texto, href, variante = "contorno", externo = false, clase = "" } = Astro.props;
---
<a
  href={href}
  class:list={["boton", `boton--${variante}`, clase]}
  target={externo ? "_blank" : undefined}
  rel={externo ? "noopener" : undefined}
>
  {texto}
  {externo && <span class="sr-only"> ({sitio.ui.abreNuevaPestana})</span>}
</a>

<style>
  .boton {
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 48px; padding: 0.9rem 1.9rem; border-radius: 999px;
    border: 1px solid var(--espresso);
    font-family: var(--font-etiqueta); font-weight: 400; font-size: 0.78rem;
    letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; text-align: center;
    transition: background 0.5s var(--ease), color 0.5s var(--ease), border-color 0.5s var(--ease);
  }
  .boton--solido { background: var(--espresso); color: var(--marfil); }
  .boton--solido:hover { background: transparent; color: var(--espresso); }
  .boton--contorno { background: transparent; color: var(--espresso); }
  .boton--contorno:hover { background: var(--espresso); color: var(--marfil); }
  .boton--marfil { background: var(--marfil); color: var(--espresso); border-color: var(--marfil); }
  .boton--marfil:hover { background: transparent; color: var(--marfil); }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
```

`src/components/Encabezado.astro`:

```astro
---
const { etiqueta, titulo, texto, nivel = 2, alinear = "izq", tono = "claro" } = Astro.props;
const lineas = titulo.split("\n");
const Titulo = nivel === 1 ? "h1" : "h2";
---
<div class:list={["enc", `enc--${alinear}`]}>
  {etiqueta && <p class="etiqueta rev">{etiqueta}</p>}
  <Titulo class:list={[nivel === 1 ? "titulo-xl" : "titulo-lg", "rev"]} style="--i:1">
    {lineas.map((l, i) => <><span class="enc__linea">{l}</span>{i < lineas.length - 1 && <br />}</>)}
  </Titulo>
  {texto && <p class="lead rev" style="--i:2">{texto}</p>}
</div>

<style>
  .enc { display: grid; gap: 1.25rem; }
  .enc--centro { justify-items: center; text-align: center; }
  .enc--centro .lead { margin-inline: auto; }
</style>
```

`src/components/Separador.astro`:

```astro
---
import { ruta } from "../lib/ruta.js";
---
<div class="sep" aria-hidden="true">
  <span></span>
  <img src={ruta("/brand/isotipo-espresso.png")} alt="" width="48" height="12" loading="lazy" />
  <span></span>
</div>

<style>
  .sep { display: flex; align-items: center; justify-content: center; gap: 1.25rem; color: var(--espresso); }
  .sep span { height: 1px; width: min(18vw, 120px); background: var(--linea); }
  .sep img { width: 48px; height: auto; }
</style>
```

- [ ] **Step 5: `Cabecera.astro` y `Pie.astro`**

`src/components/Cabecera.astro`:

```astro
---
import sitio from "../datos/sitio.json";
import { ruta } from "../lib/ruta.js";
import { enlaceWa } from "../lib/wa.js";
const { activa = "" } = Astro.props;
const izquierda = sitio.menu.slice(0, 3);
const derecha = sitio.menu.slice(3);
const reservar = enlaceWa(sitio.contacto.whatsapp, sitio.contacto.mensajeReserva);
---
<header class="cab" id="cab">
  <div class="cab__in contenedor">
    <button class="cab__burger" id="burger" type="button" aria-expanded="false" aria-controls="menuMovil"
      data-abrir={sitio.ui.abrirMenu} data-cerrar={sitio.ui.cerrarMenu} aria-label={sitio.ui.abrirMenu}>
      <span></span><span></span>
    </button>

    <nav class="cab__nav cab__nav--izq" aria-label={sitio.ui.menuPrincipal}>
      {izquierda.map((i) => <a href={ruta(i.href)} aria-current={activa === i.id ? "page" : undefined}>{i.texto}</a>)}
    </nav>

    <a class="cab__logo" href={ruta("/")} aria-label={`${sitio.nombre}, ${sitio.ui.irInicio}`}>
      <img src={ruta("/brand/logo-espresso.png")} alt="" width="81" height="44" />
    </a>

    <div class="cab__nav cab__nav--der">
      <nav aria-label={sitio.ui.menuPrincipal}>
        {derecha.map((i) => <a href={ruta(i.href)} aria-current={activa === i.id ? "page" : undefined}>{i.texto}</a>)}
      </nav>
      <a class="cab__cta" href={reservar} target="_blank" rel="noopener">{sitio.ui.reservar}<span class="sr-only"> ({sitio.ui.abreNuevaPestana})</span></a>
    </div>
  </div>

  <div class="menu" id="menuMovil" hidden>
    <nav class="menu__nav" aria-label={sitio.ui.menuMovil}>
      {sitio.menu.map((i) => <a href={ruta(i.href)} aria-current={activa === i.id ? "page" : undefined}>{i.texto}</a>)}
    </nav>
    <a class="menu__cta" href={reservar} target="_blank" rel="noopener">{sitio.ui.reservarWa}<span class="sr-only"> ({sitio.ui.abreNuevaPestana})</span></a>
  </div>
</header>

<style>
  .cab { position: sticky; top: 0; z-index: 50; background: rgba(246, 245, 227, 0.92); backdrop-filter: blur(10px); border-bottom: 1px solid transparent; transition: border-color 0.4s var(--ease); }
  .cab.bajado { border-bottom-color: var(--linea); }
  .cab__in { height: var(--nav-h); display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
  .cab__logo img { height: 44px; width: auto; }
  .cab__nav { display: none; align-items: center; gap: 2rem; }
  .cab__nav--der { justify-content: flex-end; }
  .cab__nav nav { display: flex; gap: 2rem; }
  .cab a:not(.cab__logo):not(.cab__cta) { font-family: var(--font-etiqueta); font-weight: 400; font-size: 0.74rem; letter-spacing: 0.22em; text-transform: uppercase; text-decoration: none; padding-block: 0.5rem; background: linear-gradient(currentColor, currentColor) left bottom / 0 1px no-repeat; transition: background-size 0.5s var(--ease); }
  .cab a:not(.cab__logo):not(.cab__cta):hover, .cab a[aria-current="page"] { background-size: 100% 1px; }
  .cab__cta { font-family: var(--font-etiqueta); font-weight: 400; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; border: 1px solid var(--espresso); border-radius: 999px; padding: 0.7rem 1.4rem; transition: background 0.4s var(--ease), color 0.4s var(--ease); }
  .cab__cta:hover { background: var(--espresso); color: var(--marfil); }

  .cab__burger { justify-self: end; grid-column: 3; grid-row: 1; width: 48px; height: 48px; border: 0; background: none; cursor: pointer; position: relative; color: var(--espresso); }
  .cab__burger span { position: absolute; left: 12px; right: 12px; height: 1px; background: currentColor; transition: transform 0.4s var(--ease); }
  .cab__burger span:nth-child(1) { top: 20px; }
  .cab__burger span:nth-child(2) { top: 27px; }
  .cab__burger[aria-expanded="true"] span:nth-child(1) { transform: translateY(3.5px) rotate(45deg); }
  .cab__burger[aria-expanded="true"] span:nth-child(2) { transform: translateY(-3.5px) rotate(-45deg); }
  .cab__logo { grid-column: 1; grid-row: 1; justify-self: start; }

  .menu { position: fixed; inset: var(--nav-h) 0 0 0; background: var(--marfil); display: flex; flex-direction: column; justify-content: space-between; padding: 8vh var(--gutter) 6vh; overflow-y: auto; }
  .menu[hidden] { display: none; }
  .menu__nav { display: grid; gap: 0.4rem; }
  .menu__nav a { font-size: clamp(2.25rem, 11vw, 3.25rem); font-weight: 100; text-decoration: none; line-height: 1.2; padding-block: 0.25rem; }
  .menu__nav a[aria-current="page"] { text-decoration: underline; text-underline-offset: 8px; text-decoration-thickness: 1px; }
  .menu__cta { align-self: stretch; text-align: center; font-family: var(--font-etiqueta); font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; background: var(--espresso); color: var(--marfil); border-radius: 999px; padding: 1.1rem; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  @media (min-width: 1000px) {
    .cab__nav { display: flex; }
    .cab__nav--izq { grid-column: 1; }
    .cab__logo { grid-column: 2; justify-self: center; }
    .cab__nav--der { grid-column: 3; }
    .cab__burger, .menu { display: none !important; }
  }
</style>
```

`src/components/Pie.astro`:

```astro
---
import sitio from "../datos/sitio.json";
import { ruta } from "../lib/ruta.js";
import { enlaceWa } from "../lib/wa.js";
const c = sitio.contacto;
const wa = enlaceWa(c.whatsapp, c.mensajeReserva);
const redes = (c.redes ?? []).filter((r) => r.href);
const legales = (sitio.legales ?? []).filter((l) => l.href);
---
<footer class="pie banda">
  <div class="contenedor pie__in">
    <div class="pie__marca">
      <img src={ruta("/brand/logo-casa-marfil.png")} alt={`${sitio.nombre}, ${sitio.marca}`} width="260" height="95" loading="lazy" />
      <p class="etiqueta">{sitio.eslogan}</p>
    </div>

    <nav class="pie__col" aria-label={sitio.pie.explorar}>
      <h2 class="etiqueta">{sitio.pie.explorar}</h2>
      {sitio.menu.map((i) => <a href={ruta(i.href)}>{i.texto}</a>)}
    </nav>

    <div class="pie__col">
      <h2 class="etiqueta">{sitio.pie.visitanos}</h2>
      {c.direccion?.linea && <p>{c.direccion.linea}<br />{c.direccion.ciudad}</p>}
      {c.horario?.length > 0 && (
        <p>{c.horario.map((h) => <span class="pie__h">{h.dias}: {h.horas}</span>)}</p>
      )}
    </div>

    <div class="pie__col">
      <h2 class="etiqueta">{sitio.pie.conecta}</h2>
      {c.whatsappVisible && <a href={wa} target="_blank" rel="noopener">{c.whatsappVisible}<span class="sr-only"> ({sitio.ui.abreNuevaPestana})</span></a>}
      {c.correo && <a href={`mailto:${c.correo}`}>{c.correo}</a>}
      {redes.map((r) => <a href={r.href} target="_blank" rel="noopener">{r.nombre} {r.usuario}<span class="sr-only"> ({sitio.ui.abreNuevaPestana})</span></a>)}
    </div>
  </div>

  <div class="contenedor pie__base">
    <p>&copy; {new Date().getFullYear()} {sitio.empresa.razonSocial}</p>
    {legales.length > 0 && <nav aria-label="Legal">{legales.map((l) => <a href={ruta(l.href)}>{l.texto}</a>)}</nav>}
  </div>
</footer>

<style>
  .pie { padding-block: clamp(56px, 8vw, 104px) 28px; }
  .pie__in { display: grid; gap: 3rem; grid-template-columns: 1fr; }
  .pie__marca img { width: min(260px, 70%); height: auto; }
  .pie__marca .etiqueta { margin-top: 1rem; }
  .pie__col { display: grid; gap: 0.6rem; align-content: start; }
  .pie__col h2 { margin: 0 0 0.6rem; }
  .pie__col a { text-decoration: none; width: fit-content; background: linear-gradient(currentColor, currentColor) left bottom / 0 1px no-repeat; transition: background-size 0.5s var(--ease); }
  .pie__col a:hover { background-size: 100% 1px; }
  .pie__col p { margin: 0; }
  .pie__h { display: block; }
  .pie__base { margin-top: clamp(40px, 6vw, 80px); padding-top: 1.5rem; border-top: 1px solid rgba(246, 245, 227, 0.28); display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; font-size: 0.875rem; }
  .pie__base p { margin: 0; }
  .pie__base nav { display: flex; gap: 1.5rem; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  @media (min-width: 720px) { .pie__in { grid-template-columns: 1.3fr 1fr 1.3fr 1.3fr; } }
</style>
```

- [ ] **Step 6: `Layout.astro`**

```astro
---
import "../styles/global.css";
import sitio from "../datos/sitio.json";
import { ruta } from "../lib/ruta.js";
import { enlaceWa } from "../lib/wa.js";
import Cabecera from "../components/Cabecera.astro";
import Pie from "../components/Pie.astro";

const { titulo, descripcion, activa = "", ogImagen = "/og.png" } = Astro.props;
const canonica = new URL(Astro.url.pathname, Astro.site).href;
const og = new URL(ruta(ogImagen), Astro.site).href;
const wa = enlaceWa(sitio.contacto.whatsapp, sitio.contacto.mensajeReserva);
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{titulo}</title>
    <meta name="description" content={descripcion} />
    {sitio.indexar === false && <meta name="robots" content="noindex, nofollow" />}
    <link rel="canonical" href={canonica} />
    <link rel="icon" href={ruta("/brand/favicon.png")} />
    <link rel="preload" href={ruta("/fonts/almarose-thin.woff2")} as="font" type="font/woff2" crossorigin />
    <link rel="preload" href={ruta("/fonts/almarose-semibold.woff2")} as="font" type="font/woff2" crossorigin />
    <meta property="og:title" content={titulo} />
    <meta property="og:description" content={descripcion} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="es_CO" />
    <meta property="og:image" content={og} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#F6F5E3" />
    <script is:inline>document.documentElement.classList.add("js");</script>
  </head>
  <body>
    <a class="saltar" href="#contenido">{sitio.ui.irAlContenido}</a>
    <Cabecera activa={activa} />
    <main id="contenido"><slot /></main>
    <Pie />

    <a class="flota" href={wa} target="_blank" rel="noopener" aria-label={`${sitio.ui.escribirWa} (${sitio.ui.abreNuevaPestana})`}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" stroke-linejoin="round" /></svg>
    </a>

    <script is:inline define:vars={{ ui: sitio.ui }}>
      const $ = (s) => document.querySelector(s);
      const $$ = (s) => Array.from(document.querySelectorAll(s));
      const menosMov = matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* Menú móvil */
      const burger = $("#burger"), menu = $("#menuMovil");
      const alternar = (abrir) => {
        menu.hidden = !abrir;
        burger.setAttribute("aria-expanded", String(abrir));
        burger.setAttribute("aria-label", abrir ? burger.dataset.cerrar : burger.dataset.abrir);
        document.documentElement.style.overflow = abrir ? "hidden" : "";
      };
      burger?.addEventListener("click", () => alternar(menu.hidden));
      menu?.addEventListener("click", (e) => { if (e.target.closest("a")) alternar(false); });
      addEventListener("keydown", (e) => { if (e.key === "Escape" && menu && !menu.hidden) { alternar(false); burger.focus(); } });
      matchMedia("(min-width: 1000px)").addEventListener("change", (e) => { if (e.matches) alternar(false); });

      /* Borde de la cabecera al bajar */
      const cab = $("#cab");
      const alBajar = () => cab.classList.toggle("bajado", scrollY > 8);
      addEventListener("scroll", alBajar, { passive: true }); alBajar();

      /* Apariciones */
      const rev = $$(".rev");
      if (menosMov || !("IntersectionObserver" in window)) {
        rev.forEach((el) => el.classList.add("seen"));
      } else {
        $$("[data-stagger]").forEach((g) => Array.from(g.children).forEach((h, i) => h.style.setProperty("--i", i)));
        const io = new IntersectionObserver((es) => es.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("seen"); io.unobserve(e.target); }
        }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
        rev.forEach((el) => io.observe(el));
      }

      /* Parallax suave (±amplitud px) en una sola pieza por vista */
      const par = $$("[data-parallax]");
      if (par.length && !menosMov) {
        let esperando = false;
        const pintar = () => {
          esperando = false;
          const vh = innerHeight;
          par.forEach((el) => {
            const r = el.parentElement.getBoundingClientRect();
            if (r.bottom < 0 || r.top > vh) return;
            const prog = (r.top + r.height / 2 - vh / 2) / vh;
            el.style.transform = `translate3d(0, ${(-prog * parseFloat(el.dataset.parallax)).toFixed(1)}px, 0) scale(1.1)`;
          });
        };
        addEventListener("scroll", () => { if (!esperando) { esperando = true; requestAnimationFrame(pintar); } }, { passive: true });
        pintar();
      }
    </script>
  </body>
</html>

<style is:global>
  .saltar { position: absolute; left: 12px; top: -64px; z-index: 100; background: var(--espresso); color: var(--marfil); padding: 0.8rem 1.2rem; border-radius: 999px; text-decoration: none; transition: top 0.2s; }
  .saltar:focus { top: 12px; }
  .flota { position: fixed; right: max(16px, env(safe-area-inset-right)); bottom: max(16px, env(safe-area-inset-bottom)); z-index: 40; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; background: var(--espresso); color: var(--marfil); box-shadow: 0 6px 24px rgba(96, 85, 74, 0.25); transition: transform 0.4s var(--ease); }
  .flota:hover { transform: translateY(-3px); }
</style>
```

- [ ] **Step 7: `robots.txt`, sitemap y página mínima de prueba**

`public/robots.txt`:

```
User-agent: *
Disallow: /
```

> Se cambia a `Allow: /` y se agrega `Sitemap:` solo al publicar la versión definitiva (junto con `indexar: true`).

`src/pages/sitemap.xml.js`:

```js
import sitio from "../datos/sitio.json";

export const GET = ({ site }) => {
  const urls = sitio.menu.map((i) => new URL(i.href, site).href);
  const cuerpo = urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${cuerpo}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
```

`src/pages/index.astro` (provisional hasta la Tarea 6):

```astro
---
import Layout from "../layouts/Layout.astro";
import inicio from "../datos/inicio.json";
---
<Layout titulo={inicio.meta.titulo} descripcion={inicio.meta.descripcion} activa="inicio">
  <section class="seccion contenedor"><h1 class="titulo-xl">{inicio.portada.titulo}</h1></section>
</Layout>
```

- [ ] **Step 8: Ejecutar pruebas y ver que pasan**

Run: `node --test tests/build.test.mjs`
Expected: PASS (3 pruebas). Si falla "recurso externo" o "href vacío", revisar el componente indicado.

- [ ] **Step 9: Revisión visual de cabecera y pie**

Run: `npm run dev -- --port 4350` (en segundo plano). Abrir `http://localhost:4350/` en el navegador y verificar: cabecera con logo centrado y menú a los lados en escritorio; en ≤ 999 px, logo a la izquierda y hamburguesa; el menú móvil abre, cierra con Esc y al tocar un enlace; el pie en marfil sobre espresso con 4 columnas; foco visible con Tab; el enlace "Ir al contenido" aparece con Tab. Tomar captura a 1440 px y a 390 px (banco con iframes, `generador/conocimiento/verificacion-responsive.md`).

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "Sistema de diseño: tokens, tipografía, layout, cabecera, pie y movimiento" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```

---

### Task 6: Página de Inicio

> Invocar `frontend-design` e `impeccable`. Esta es la pieza que define la percepción de lujo: priorizar composición, ritmo y aire.

**Files:**
- Create: `src/components/Portada.astro`, `src/components/Cita.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Layout`, `Foto`, `Arco`, `Boton`, `Encabezado`, `Separador`, `enlaceWa`, `ruta`, `inicio.json`, `sitio.json`.
- Produces: `Portada.astro` props `{ datos: inicio.portada; reserva: string }`; `Cita.astro` props `{ texto: string; firma?: string }` (banda espresso).

- [ ] **Step 1: Escribir la prueba que falla (se amplía `build.test.mjs`)**

Agregar al final de `tests/build.test.mjs`:

```js
test("inicio: portada con h1 de datos, 3 pilares y banda de cita", async () => {
  const inicio = JSON.parse(await readFile(join(raiz, "src/datos/inicio.json"), "utf8"));
  const h = await readFile(join(dist, "index.html"), "utf8");
  for (const linea of inicio.portada.titulo.split("\n")) assert.ok(h.includes(linea), `falta "${linea}" en el h1`);
  assert.ok(h.includes(inicio.cita.texto));
  for (const p of inicio.pilares.items) assert.ok(h.includes(p.titulo));
  for (const t of inicio.testimonios.items) assert.ok(h.includes(t.texto));
  assert.equal((h.match(/fetchpriority="high"/g) || []).length, 1, "solo la foto de portada es prioritaria");
  assert.ok(h.includes("https://wa.me/573000000000?text="), "botón de reserva por WhatsApp");
});
```

- [ ] **Step 2: Ejecutar y ver que falla**

Run: `node --test tests/build.test.mjs`
Expected: FAIL (la página provisional no tiene pilares ni cita).

- [ ] **Step 3: `Portada.astro`**

```astro
---
import Foto from "./Foto.astro";
import Arco from "./Arco.astro";
import Boton from "./Boton.astro";
import { ruta } from "../lib/ruta.js";
const { datos, reserva } = Astro.props;
const lineas = datos.titulo.split("\n");
---
<section class="portada">
  <div class="portada__texto">
    <p class="etiqueta rev">{datos.etiqueta}</p>
    <h1 class="titulo-xl rev" style="--i:1">
      {lineas.map((l, i) => <><span>{l}</span>{i < lineas.length - 1 && <br />}</>)}
    </h1>
    <p class="lead rev" style="--i:2">{datos.texto}</p>
    <div class="botones rev" style="--i:3">
      {datos.botones.map((b) =>
        b.tipo === "reserva"
          ? <Boton texto={b.texto} href={reserva} variante={b.variante} externo />
          : <Boton texto={b.texto} href={ruta(b.href)} variante={b.variante} />)}
    </div>
  </div>
  <div class="portada__foto rev" style="--i:1">
    <Arco ratio="4 / 5"><Foto base={datos.imagen} alt={datos.alt} prioridad parallax={28} sizes="(min-width: 1000px) 44vw, 92vw" /></Arco>
  </div>
</section>

<style>
  .portada { display: grid; gap: 2.5rem; padding: clamp(28px, 5vw, 56px) var(--gutter) clamp(56px, 8vw, 110px); max-width: var(--max); margin-inline: auto; align-items: center; }
  .portada__texto { display: grid; gap: 1.5rem; align-content: center; }
  .portada__foto { max-width: 560px; width: 100%; justify-self: center; }
  .portada__foto :global(img) { will-change: transform; }
  @media (min-width: 1000px) {
    .portada { grid-template-columns: 1.05fr 0.95fr; gap: 5vw; min-height: calc(100svh - var(--nav-h)); padding-block: 32px 72px; }
    .portada__foto { justify-self: end; }
  }
</style>
```

- [ ] **Step 4: `Cita.astro`**

```astro
---
import { ruta } from "../lib/ruta.js";
const { texto, firma } = Astro.props;
---
<section class="cita banda">
  <div class="contenedor cita__in">
    <img class="rev" src={ruta("/brand/isotipo-marfil.png")} alt="" width="64" height="16" loading="lazy" />
    <blockquote class="rev" style="--i:1">{texto}</blockquote>
    {firma && <p class="etiqueta rev" style="--i:2">{firma}</p>}
  </div>
</section>

<style>
  .cita { padding-block: clamp(80px, 12vw, 180px); }
  .cita__in { display: grid; gap: 2rem; justify-items: center; text-align: center; }
  .cita img { width: 64px; height: auto; }
  blockquote { margin: 0; max-width: 24ch; font-weight: 100; font-size: clamp(1.9rem, 1rem + 4vw, 3.75rem); line-height: 1.15; overflow-wrap: break-word; }
</style>
```

- [ ] **Step 5: `index.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import Portada from "../components/Portada.astro";
import Cita from "../components/Cita.astro";
import Encabezado from "../components/Encabezado.astro";
import Separador from "../components/Separador.astro";
import Foto from "../components/Foto.astro";
import Arco from "../components/Arco.astro";
import Boton from "../components/Boton.astro";
import inicio from "../datos/inicio.json";
import sitio from "../datos/sitio.json";
import { enlaceWa } from "../lib/wa.js";
import { ruta } from "../lib/ruta.js";

const reserva = enlaceWa(sitio.contacto.whatsapp, sitio.contacto.mensajeReserva);
---
<Layout titulo={inicio.meta.titulo} descripcion={inicio.meta.descripcion} activa="inicio">
  <Portada datos={inicio.portada} reserva={reserva} />

  <section class="seccion filosofia">
    <div class="contenedor filosofia__in">
      <Separador />
      <p class="etiqueta rev">{inicio.filosofia.etiqueta}</p>
      <p class="filosofia__texto rev" style="--i:1">{inicio.filosofia.texto}</p>
    </div>
  </section>

  <section class="seccion pilares">
    <div class="contenedor">
      <Encabezado etiqueta={inicio.pilares.etiqueta} titulo={inicio.pilares.titulo} alinear="centro" />
      <div class="pilares__grid" data-stagger>
        {inicio.pilares.items.map((p) => (
          <article class="pilar rev">
            <a href={ruta(p.enlace.href)} class="pilar__foto" tabindex="-1" aria-hidden="true">
              <Arco ratio="3 / 4"><Foto base={p.imagen} alt="" sizes="(min-width: 900px) 30vw, 90vw" /></Arco>
            </a>
            <p class="etiqueta">{p.etiqueta}</p>
            <h3 class="pilar__titulo">{p.titulo}</h3>
            <p class="pilar__texto">{p.texto}</p>
            <a class="pilar__enlace" href={ruta(p.enlace.href)}>{p.enlace.texto}</a>
          </article>
        ))}
      </div>
    </div>
  </section>

  <Cita texto={inicio.cita.texto} firma={inicio.cita.firma} />

  <section class="seccion espacio">
    <div class="contenedor espacio__in">
      <div class="espacio__texto">
        <Encabezado etiqueta={inicio.espacio.etiqueta} titulo={inicio.espacio.titulo} texto={inicio.espacio.texto} />
      </div>
      <div class="espacio__fotos">
        {inicio.espacio.imagenes.map((f, i) => (
          <div class:list={["rev", i === 1 && "espacio__baja"]} style={`--i:${i}`}>
            <Arco ratio="3 / 4"><Foto base={f.imagen} alt={f.alt} sizes="(min-width: 900px) 24vw, 45vw" /></Arco>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section class="seccion testimonios">
    <div class="contenedor">
      <Encabezado etiqueta={inicio.testimonios.etiqueta} titulo={inicio.testimonios.titulo} alinear="centro" />
      <div class="testimonios__grid" data-stagger>
        {inicio.testimonios.items.map((t) => (
          <figure class="testimonio rev">
            <blockquote>{t.texto}</blockquote>
            <figcaption class="etiqueta">{t.nombre} · {t.rol}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>

  <section class="cierre banda">
    <div class="contenedor cierre__in">
      <div class="cierre__texto">
        <Encabezado etiqueta={inicio.cierre.etiqueta} titulo={inicio.cierre.titulo} texto={inicio.cierre.texto} />
        <div class="rev" style="--i:3"><Boton texto={inicio.cierre.boton.texto} href={reserva} variante="marfil" externo /></div>
      </div>
      <div class="cierre__foto rev">
        <Arco ratio="3 / 4"><Foto base={inicio.cierre.imagen} alt={inicio.cierre.alt} sizes="(min-width: 900px) 30vw, 70vw" /></Arco>
      </div>
    </div>
  </section>
</Layout>

<style>
  .filosofia__in { display: grid; gap: 1.5rem; justify-items: center; text-align: center; }
  .filosofia__texto { margin: 0; max-width: 26ch; font-weight: 100; font-size: clamp(1.9rem, 1rem + 3.6vw, 3.5rem); line-height: 1.18; overflow-wrap: break-word; }

  .pilares__grid { display: grid; gap: clamp(40px, 6vw, 56px); margin-top: clamp(48px, 7vw, 88px); }
  .pilar { display: grid; gap: 0.9rem; align-content: start; }
  .pilar__foto { display: block; margin-bottom: 0.6rem; }
  .pilar__foto :global(.arco) { transition: transform 1.2s var(--ease); }
  .pilar:hover .pilar__foto :global(.arco) { transform: translateY(-6px); }
  .pilar__titulo { margin: 0; font-weight: 100; font-size: clamp(1.9rem, 1.4rem + 1.4vw, 2.5rem); line-height: 1.1; }
  .pilar__texto { margin: 0; color: var(--texto-suave); max-width: 34ch; }
  .pilar__enlace { width: fit-content; font-family: var(--font-etiqueta); font-size: 0.74rem; letter-spacing: 0.22em; text-transform: uppercase; text-decoration: none; padding-bottom: 4px; border-bottom: 1px solid var(--espresso); }
  .pilar__enlace:hover { letter-spacing: 0.28em; }
  .pilar__enlace { transition: letter-spacing 0.5s var(--ease); }

  .espacio__in { display: grid; gap: 3rem; align-items: center; }
  .espacio__fotos { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(14px, 3vw, 32px); }
  .espacio__baja { margin-top: clamp(32px, 8vw, 96px); }

  .testimonios__grid { display: grid; gap: 2.5rem; margin-top: clamp(40px, 6vw, 72px); }
  .testimonio { margin: 0; display: grid; gap: 1.25rem; padding-top: 1.5rem; border-top: 1px solid var(--linea); align-content: start; }
  .testimonio blockquote { margin: 0; font-weight: 100; font-size: clamp(1.4rem, 1.1rem + 1vw, 1.75rem); line-height: 1.3; }

  .cierre { padding-block: clamp(72px, 10vw, 140px); }
  .cierre__in { display: grid; gap: 3rem; align-items: center; }
  .cierre__texto { display: grid; gap: 2.25rem; justify-items: start; }
  .cierre__foto { max-width: 400px; width: 100%; justify-self: center; }

  @media (min-width: 900px) {
    .pilares__grid { grid-template-columns: repeat(3, 1fr); align-items: start; }
    .pilares__grid .pilar:nth-child(2) { margin-top: clamp(40px, 6vw, 88px); }
    .espacio__in { grid-template-columns: 0.9fr 1.1fr; gap: 6vw; }
    .testimonios__grid { grid-template-columns: repeat(3, 1fr); gap: 3rem; }
    .cierre__in { grid-template-columns: 1.2fr 0.8fr; gap: 8vw; }
  }
</style>
```

- [ ] **Step 6: Ejecutar pruebas**

Run: `node --test tests/build.test.mjs`
Expected: PASS.

- [ ] **Step 7: Revisión visual con criterio de diseño**

Con `npm run dev -- --port 4350`, ver `/` en 1440, 1024, 768, 390 y 320 px. Revisar: (a) la portada cabe en el primer pantallazo con el titular legible y la foto en arco; (b) el ritmo entre secciones es pausado, con aire; (c) el parallax de la portada es casi imperceptible (±28 px) y no deja bordes; (d) ningún titular se corta a 320 px ("movimiento"); (e) nada se ve cortado ni queda invisible al recargar; (f) con "Reducir movimiento" del sistema todo aparece sin animar. Ajustar tamaños, espacios o proporciones donde se vea mal; documentar en el commit qué se ajustó.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "Página de inicio: portada en arco, pilares, cita, espacio, voces y cierre" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```

---

### Task 7: La casa

> Invocar `frontend-design` e `impeccable`.

**Files:**
- Create: `src/pages/la-casa.astro`
- Modify: `tests/build.test.mjs`

**Interfaces:**
- Consumes: `Layout`, `Encabezado`, `Separador`, `Foto`, `Arco`, `Boton`, `Cita`-style band (inline), `la-casa.json`.

- [ ] **Step 1: Prueba que falla**

Agregar a `tests/build.test.mjs`:

```js
test("la-casa: historia completa, esencia en 3 columnas y 6 fotos de galería", async () => {
  const d = JSON.parse(await readFile(join(raiz, "src/datos/la-casa.json"), "utf8"));
  const h = await readFile(join(dist, "la-casa/index.html"), "utf8");
  for (const l of d.historia.lineas) assert.ok(h.includes(l), `falta línea: ${l}`);
  assert.ok(h.includes(d.proposito.texto));
  for (const c of d.esencia.columnas) { assert.ok(h.includes(c.etiqueta)); for (const i of c.items) assert.ok(h.includes(i)); }
  for (const g of d.galeria.items) assert.ok(h.includes(g.alt), `falta foto: ${g.imagen}`);
  assert.match(h, /aria-current="page"[^>]*>La casa/);
});
```

- [ ] **Step 2: Ejecutar y ver que falla**

Run: `node --test tests/build.test.mjs`
Expected: FAIL (`ENOENT … la-casa/index.html`).

- [ ] **Step 3: `la-casa.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import Encabezado from "../components/Encabezado.astro";
import Separador from "../components/Separador.astro";
import Foto from "../components/Foto.astro";
import Arco from "../components/Arco.astro";
import Boton from "../components/Boton.astro";
import d from "../datos/la-casa.json";
import sitio from "../datos/sitio.json";
import { enlaceWa } from "../lib/wa.js";
import { ruta } from "../lib/ruta.js";

const reserva = enlaceWa(sitio.contacto.whatsapp, sitio.contacto.mensajeReserva);
---
<Layout titulo={d.meta.titulo} descripcion={d.meta.descripcion} activa="la-casa">
  <section class="seccion cabecera-pagina">
    <div class="contenedor"><Encabezado nivel={1} etiqueta={d.encabezado.etiqueta} titulo={d.encabezado.titulo} texto={d.encabezado.texto} alinear="centro" /></div>
  </section>

  <section class="historia">
    <div class="contenedor historia__in">
      <Separador />
      {d.historia.lineas.map((l, i) => <p class="historia__linea rev" style={`--i:${i % 2}`}>{l}</p>)}
    </div>
  </section>

  <section class="seccion proposito">
    <div class="contenedor proposito__in">
      <p class="etiqueta rev">{d.proposito.etiqueta}</p>
      <p class="proposito__texto rev" style="--i:1">{d.proposito.texto}</p>
    </div>
  </section>

  <section class="seccion esencia banda">
    <div class="contenedor esencia__grid" data-stagger>
      {d.esencia.columnas.map((c) => (
        <div class="col rev">
          <p class="etiqueta">{c.etiqueta}</p>
          <h2 class="col__titulo">{c.titulo}</h2>
          <ul>{c.items.map((i) => <li>{i}</li>)}</ul>
        </div>
      ))}
    </div>
  </section>

  <section class="seccion galeria">
    <div class="contenedor">
      <Encabezado etiqueta={d.galeria.etiqueta} titulo={d.galeria.titulo} alinear="centro" />
      <div class="galeria__grid">
        {d.galeria.items.map((f, i) => (
          <figure class={`gal gal--${i + 1} rev`}>
            <Arco ratio="3 / 4"><Foto base={f.imagen} alt={f.alt} sizes="(min-width: 900px) 30vw, 45vw" /></Arco>
            <figcaption class="etiqueta">{f.leyenda}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>

  <section class="seccion cierre">
    <div class="contenedor cierre__in">
      <img class="rev" src={ruta("/brand/logo-eslogan-espresso.png")} alt={sitio.eslogan} width="320" height="108" loading="lazy" />
      <Encabezado etiqueta={d.cierre.etiqueta} titulo={d.cierre.titulo} texto={d.cierre.texto} alinear="centro" />
      <div class="rev"><Boton texto={d.cierre.boton.texto} href={reserva} variante="solido" externo /></div>
    </div>
  </section>
</Layout>

<style>
  .cabecera-pagina { padding-bottom: clamp(32px, 5vw, 64px); }
  .historia__in { display: grid; gap: clamp(1.5rem, 3vw, 2.5rem); justify-items: center; text-align: center; padding-block: clamp(24px, 4vw, 48px) clamp(64px, 9vw, 120px); }
  .historia__linea { margin: 0; max-width: 30ch; font-weight: 100; font-size: clamp(1.7rem, 1rem + 2.6vw, 2.75rem); line-height: 1.22; overflow-wrap: break-word; }
  .proposito__in { display: grid; gap: 1.25rem; max-width: 880px; }
  .proposito__texto { margin: 0; font-size: clamp(1.15rem, 1rem + 0.9vw, 1.6rem); line-height: 1.55; }

  .esencia__grid { display: grid; gap: 3rem; }
  .col { display: grid; gap: 0.9rem; align-content: start; padding-top: 1.5rem; border-top: 1px solid rgba(246, 245, 227, 0.32); }
  .col__titulo { margin: 0; font-weight: 100; font-size: clamp(2.125rem, 1.6rem + 1.6vw, 2.75rem); line-height: 1.1; }
  .col ul { list-style: none; margin: 0.5rem 0 0; padding: 0; display: grid; gap: 0.6rem; font-size: 1.125rem; }

  .galeria__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(14px, 3vw, 36px); margin-top: clamp(40px, 6vw, 80px); align-items: start; }
  .gal { margin: 0; display: grid; gap: 0.8rem; }
  .gal:nth-child(even) { margin-top: clamp(24px, 7vw, 88px); }

  .cierre__in { display: grid; gap: 2rem; justify-items: center; text-align: center; }
  .cierre__in img { width: min(320px, 80%); height: auto; }

  @media (min-width: 900px) {
    .esencia__grid { grid-template-columns: repeat(3, 1fr); gap: 4rem; }
    .galeria__grid { grid-template-columns: repeat(3, 1fr); }
    .gal:nth-child(even) { margin-top: 0; }
    .gal:nth-child(3n + 2) { margin-top: clamp(40px, 6vw, 96px); }
  }
</style>
```

- [ ] **Step 4: Ejecutar pruebas**

Run: `node --test tests/build.test.mjs`
Expected: PASS.

- [ ] **Step 5: Revisión visual**

`/la-casa` a 1440, 768, 390 y 320 px: la historia se lee en cuatro frases grandes y centradas; la banda espresso de "esencia" tiene contraste claro (marfil sobre espresso); la galería asimétrica no deja huecos ni imágenes cortadas; el logo con eslogan se ve completo. Ajustar lo necesario.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Página La casa: historia, propósito, esencia y galería" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```

---

### Task 8: Clases

> Invocar `frontend-design` e `impeccable`.

**Files:**
- Create: `src/components/TarjetaClase.astro`, `src/pages/clases.astro`
- Modify: `tests/build.test.mjs`

**Interfaces:**
- Produces: `TarjetaClase.astro` props `{ clase: clases.lista.items[number]; whatsapp: string; invertida?: boolean }`; el enlace de reserva usa `enlaceWa(whatsapp, clase.mensaje)`.

- [ ] **Step 1: Prueba que falla**

Agregar a `tests/build.test.mjs`:

```js
test("clases: cada clase con su reserva por WhatsApp y pasos", async () => {
  const d = JSON.parse(await readFile(join(raiz, "src/datos/clases.json"), "utf8"));
  const h = await readFile(join(dist, "clases/index.html"), "utf8");
  for (const c of d.lista.items) {
    assert.ok(h.includes(c.titulo), c.titulo);
    assert.ok(h.includes(encodeURIComponent(c.mensaje)), `falta enlace de reserva de ${c.titulo}`);
  }
  for (const p of d.pasos.items) assert.ok(h.includes(p.titulo));
});
```

- [ ] **Step 2: Ejecutar y ver que falla**

Run: `node --test tests/build.test.mjs`
Expected: FAIL (`ENOENT … clases/index.html`).

- [ ] **Step 3: `TarjetaClase.astro`**

```astro
---
import Foto from "./Foto.astro";
import Arco from "./Arco.astro";
import Boton from "./Boton.astro";
import sitio from "../datos/sitio.json";
import { enlaceWa } from "../lib/wa.js";
const { clase, whatsapp, invertida = false } = Astro.props;
---
<article class:list={["clase", invertida && "clase--inv"]}>
  <div class="clase__foto rev">
    <Arco ratio="4 / 5"><Foto base={clase.imagen} alt={clase.alt} sizes="(min-width: 900px) 36vw, 88vw" /></Arco>
  </div>
  <div class="clase__texto">
    <p class="etiqueta rev">{clase.duracion} · {clase.nivel}</p>
    <h2 class="titulo-lg rev" style="--i:1">{clase.titulo}</h2>
    <p class="lead rev" style="--i:2">{clase.texto}</p>
    <div class="rev" style="--i:3">
      <Boton texto={sitio.ui.reservar} href={enlaceWa(whatsapp, clase.mensaje)} variante="contorno" externo />
    </div>
  </div>
</article>

<style>
  .clase { display: grid; gap: 2rem; align-items: center; }
  .clase__foto { max-width: 520px; width: 100%; justify-self: center; }
  .clase__texto { display: grid; gap: 1.25rem; justify-items: start; }
  @media (min-width: 900px) {
    .clase { grid-template-columns: 1fr 1fr; gap: 8vw; }
    .clase--inv .clase__foto { order: 2; }
    .clase__foto { justify-self: start; }
    .clase--inv .clase__foto { justify-self: end; }
  }
</style>
```

- [ ] **Step 4: `clases.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import Encabezado from "../components/Encabezado.astro";
import TarjetaClase from "../components/TarjetaClase.astro";
import Boton from "../components/Boton.astro";
import d from "../datos/clases.json";
import sitio from "../datos/sitio.json";
import { enlaceWa } from "../lib/wa.js";

const reserva = enlaceWa(sitio.contacto.whatsapp, sitio.contacto.mensajeReserva);
---
<Layout titulo={d.meta.titulo} descripcion={d.meta.descripcion} activa="clases">
  <section class="seccion cabecera-pagina">
    <div class="contenedor"><Encabezado nivel={1} etiqueta={d.encabezado.etiqueta} titulo={d.encabezado.titulo} texto={d.encabezado.texto} alinear="centro" /></div>
  </section>

  <section class="contenedor lista">
    {d.lista.items.map((c, i) => <TarjetaClase clase={c} whatsapp={sitio.contacto.whatsapp} invertida={i % 2 === 1} />)}
  </section>

  <section class="seccion pasos banda">
    <div class="contenedor">
      <Encabezado etiqueta={d.pasos.etiqueta} titulo={d.pasos.titulo} alinear="centro" />
      <ol class="pasos__lista" data-stagger>
        {d.pasos.items.map((p) => (
          <li class="paso rev">
            <span class="paso__n">{p.numero}</span>
            <h3 class="paso__t">{p.titulo}</h3>
            <p>{p.texto}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>

  <section class="seccion cierre">
    <div class="contenedor cierre__in">
      <Encabezado etiqueta={d.cierre.etiqueta} titulo={d.cierre.titulo} texto={d.cierre.texto} alinear="centro" />
      <div class="rev"><Boton texto={d.cierre.boton.texto} href={reserva} variante="solido" externo /></div>
    </div>
  </section>
</Layout>

<style>
  .cabecera-pagina { padding-bottom: clamp(32px, 5vw, 64px); }
  .lista { display: grid; gap: clamp(72px, 11vw, 150px); padding-bottom: clamp(72px, 11vw, 150px); }
  .pasos__lista { list-style: none; margin: clamp(40px, 6vw, 80px) 0 0; padding: 0; display: grid; gap: 2.5rem; }
  .paso { display: grid; gap: 0.7rem; padding-top: 1.5rem; border-top: 1px solid rgba(246, 245, 227, 0.32); }
  .paso__n { font-family: var(--font-etiqueta); font-size: 0.8rem; letter-spacing: 0.24em; }
  .paso__t { margin: 0; font-weight: 100; font-size: clamp(2rem, 1.5rem + 1.5vw, 2.5rem); line-height: 1.1; }
  .paso p { margin: 0; max-width: 30ch; }
  .cierre__in { display: grid; gap: 2.25rem; justify-items: center; text-align: center; }
  @media (min-width: 900px) { .pasos__lista { grid-template-columns: repeat(3, 1fr); gap: 4rem; } }
</style>
```

- [ ] **Step 5: Ejecutar pruebas y revisión visual**

Run: `node --test tests/build.test.mjs` → PASS. Luego `/clases` a 1440, 768, 390 y 320 px: alternancia izquierda/derecha limpia, cada botón abre `wa.me` con el mensaje de esa clase (verificar la URL al pasar el cursor), los pasos legibles sobre espresso.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Página Clases: lista editorial alternada y pasos de reserva" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```

---

### Task 9: Membresía y Contacto

> Invocar `frontend-design` e `impeccable`.

**Files:**
- Create: `src/components/PlanMembresia.astro`, `src/pages/membresia.astro`, `src/pages/contacto.astro`, `src/pages/404.astro`
- Modify: `tests/build.test.mjs`

**Interfaces:**
- Produces: `PlanMembresia.astro` props `{ plan: membresia.planes.items[number]; moneda: string; periodo: string; whatsapp: string }`. Precio formateado con `Intl.NumberFormat("es-CO")` → `$620.000`.

- [ ] **Step 1: Pruebas que fallan**

Agregar a `tests/build.test.mjs`:

```js
test("membresía: 3 planes con precio en pesos, uno destacado, y la tarjeta VIP", async () => {
  const d = JSON.parse(await readFile(join(raiz, "src/datos/membresia.json"), "utf8"));
  const h = await readFile(join(dist, "membresia/index.html"), "utf8");
  for (const p of d.planes.items) {
    assert.ok(h.includes(p.nombre));
    const precio = "$" + new Intl.NumberFormat("es-CO").format(p.precio);
    assert.ok(h.includes(precio), `falta el precio ${precio}`);
    assert.ok(h.includes(encodeURIComponent(p.mensaje)));
    for (const b of p.beneficios) assert.ok(h.includes(b));
  }
  assert.equal((h.match(/plan--destacado/g) || []).length >= 1, true);
  assert.ok(h.includes("mockup-vip-1400.webp"));
});

test("contacto: dirección, horarios, FAQ y sin mapa vacío", async () => {
  const s = JSON.parse(await readFile(join(raiz, "src/datos/sitio.json"), "utf8"));
  const d = JSON.parse(await readFile(join(raiz, "src/datos/contacto.json"), "utf8"));
  const h = await readFile(join(dist, "contacto/index.html"), "utf8");
  assert.ok(h.includes(s.contacto.direccion.linea));
  for (const x of s.contacto.horario) assert.ok(h.includes(x.horas));
  for (const q of d.faq.items) { assert.ok(h.includes(q.pregunta)); assert.ok(h.includes(q.respuesta)); }
  assert.ok(!/<iframe[^>]*src=""/.test(h), "iframe de mapa vacío");
});

test("404 existe y vuelve al inicio", async () => {
  const h = await readFile(join(dist, "404.html"), "utf8");
  assert.match(h, /<h1/);
});

test("el menú apunta solo a páginas que existen", async () => {
  for (const i of sitio.menu) {
    const f = i.href === "/" ? "index.html" : join(i.href.slice(1), "index.html");
    await readFile(join(dist, f), "utf8");
  }
});
```

- [ ] **Step 2: Ejecutar y ver que fallan**

Run: `node --test tests/build.test.mjs`
Expected: FAIL (faltan `membresia/index.html`, `contacto/index.html`, `404.html`).

- [ ] **Step 3: `PlanMembresia.astro`**

```astro
---
import Boton from "./Boton.astro";
import sitio from "../datos/sitio.json";
import { enlaceWa } from "../lib/wa.js";
const { plan, moneda, periodo, whatsapp } = Astro.props;
const precio = "$" + new Intl.NumberFormat("es-CO").format(plan.precio);
---
<article class:list={["plan", plan.destacado && "plan--destacado"]}>
  <h3 class="plan__nombre">{plan.nombre}</h3>
  <p class="plan__resumen">{plan.resumen}</p>
  <p class="plan__precio"><span>{precio}</span> <small>{moneda} {periodo}</small></p>
  <ul>{plan.beneficios.map((b) => <li>{b}</li>)}</ul>
  <Boton texto={sitio.ui.reservarWa} href={enlaceWa(whatsapp, plan.mensaje)} variante={plan.destacado ? "marfil" : "contorno"} externo />
</article>

<style>
  .plan { display: grid; gap: 1.1rem; align-content: start; padding: clamp(28px, 4vw, 44px); border: 1px solid var(--linea); border-radius: 999px 999px 24px 24px / 220px 220px 24px 24px; background: transparent; }
  .plan--destacado { background: var(--espresso); color: var(--marfil); border-color: var(--espresso); }
  .plan__nombre { margin: 0; padding-top: clamp(32px, 6vw, 72px); text-align: center; font-weight: 100; font-size: clamp(2.125rem, 1.6rem + 1.6vw, 2.75rem); line-height: 1.05; }
  .plan__resumen { margin: 0; text-align: center; color: var(--texto-suave); }
  .plan--destacado .plan__resumen { color: var(--marfil); }
  .plan__precio { margin: 0.5rem 0; text-align: center; }
  .plan__precio span { display: block; font-weight: 100; font-size: clamp(2.25rem, 1.6rem + 2vw, 3rem); line-height: 1.1; }
  .plan__precio small { font-family: var(--font-etiqueta); font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; }
  ul { list-style: none; margin: 0 0 0.75rem; padding: 1.25rem 0 0; border-top: 1px solid var(--linea); display: grid; gap: 0.6rem; }
  .plan--destacado ul { border-top-color: rgba(246, 245, 227, 0.32); }
  li::before { content: "— "; }
  .plan :global(.boton) { justify-self: stretch; }
</style>
```

- [ ] **Step 4: `membresia.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import Encabezado from "../components/Encabezado.astro";
import PlanMembresia from "../components/PlanMembresia.astro";
import Foto from "../components/Foto.astro";
import Boton from "../components/Boton.astro";
import d from "../datos/membresia.json";
import sitio from "../datos/sitio.json";
import { enlaceWa } from "../lib/wa.js";

const reserva = enlaceWa(sitio.contacto.whatsapp, sitio.contacto.mensajeReserva);
---
<Layout titulo={d.meta.titulo} descripcion={d.meta.descripcion} activa="membresia">
  <section class="seccion cabecera-pagina">
    <div class="contenedor"><Encabezado nivel={1} etiqueta={d.encabezado.etiqueta} titulo={d.encabezado.titulo} texto={d.encabezado.texto} alinear="centro" /></div>
  </section>

  <section class="contenedor vip">
    <div class="vip__foto rev">
      <Foto base={d.vip.imagen} alt={d.vip.alt} anchos={[800, 1400]} natural="4 / 3" sizes="(min-width: 900px) 55vw, 92vw" clase="vip__img" />
    </div>
    <div class="vip__texto">
      <Encabezado etiqueta={d.vip.etiqueta} titulo={d.vip.titulo} texto={d.vip.texto} />
    </div>
  </section>

  <section class="seccion planes">
    <div class="contenedor">
      <Encabezado etiqueta={d.planes.etiqueta} titulo={d.planes.titulo} alinear="centro" />
      <div class="planes__grid" data-stagger>
        {d.planes.items.map((p) => <div class="rev"><PlanMembresia plan={p} moneda={d.planes.moneda} periodo={d.planes.periodo} whatsapp={sitio.contacto.whatsapp} /></div>)}
      </div>
      <p class="nota rev">{d.planes.nota}</p>
    </div>
  </section>

  <section class="seccion cierre banda">
    <div class="contenedor cierre__in">
      <Encabezado etiqueta={d.cierre.etiqueta} titulo={d.cierre.titulo} texto={d.cierre.texto} alinear="centro" />
      <div class="rev"><Boton texto={d.cierre.boton.texto} href={reserva} variante="marfil" externo /></div>
    </div>
  </section>
</Layout>

<style>
  .cabecera-pagina { padding-bottom: clamp(32px, 5vw, 64px); }
  .vip { display: grid; gap: 2.5rem; align-items: center; padding-bottom: clamp(48px, 8vw, 110px); }
  .vip__img { width: 100%; height: auto; border-radius: 4px; }
  .planes__grid { display: grid; gap: 2rem; margin-top: clamp(40px, 6vw, 80px); align-items: stretch; }
  .planes__grid > div { display: grid; }
  .nota { margin: 2.5rem auto 0; max-width: 60ch; text-align: center; color: var(--texto-suave); font-size: 0.9rem; }
  .cierre__in { display: grid; gap: 2.25rem; justify-items: center; text-align: center; }
  @media (min-width: 900px) {
    .vip { grid-template-columns: 1.15fr 0.85fr; gap: 6vw; }
    .planes__grid { grid-template-columns: repeat(3, 1fr); gap: clamp(20px, 2.5vw, 40px); }
  }
</style>
```

- [ ] **Step 5: `contacto.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import Encabezado from "../components/Encabezado.astro";
import Boton from "../components/Boton.astro";
import Arco from "../components/Arco.astro";
import Foto from "../components/Foto.astro";
import d from "../datos/contacto.json";
import sitio from "../datos/sitio.json";
import { enlaceWa } from "../lib/wa.js";

const c = sitio.contacto;
const reserva = enlaceWa(c.whatsapp, c.mensajeReserva);
const redes = (c.redes ?? []).filter((r) => r.href);
const e = d.visita.etiquetas;
---
<Layout titulo={d.meta.titulo} descripcion={d.meta.descripcion} activa="contacto">
  <section class="seccion cabecera-pagina">
    <div class="contenedor"><Encabezado nivel={1} etiqueta={d.encabezado.etiqueta} titulo={d.encabezado.titulo} texto={d.encabezado.texto} alinear="centro" /></div>
  </section>

  <section class="contenedor reserva">
    <div class="reserva__wa rev">
      <h2 class="reserva__t">{d.reserva.titulo}</h2>
      <p class="lead">{d.reserva.texto}</p>
      <Boton texto={d.reserva.boton.texto} href={reserva} variante="solido" externo />
      {c.whatsappVisible && <p class="reserva__num etiqueta">{c.whatsappVisible}</p>}
    </div>

    <div class="reserva__datos rev" style="--i:1">
      <h2 class="reserva__t">{d.visita.titulo}</h2>
      <dl>
        {c.direccion?.linea && (<><dt class="etiqueta">{e.direccion}</dt><dd>{c.direccion.linea}<br />{c.direccion.ciudad}{c.direccion.referencia && <><br /><span class="suave">{c.direccion.referencia}</span></>}</dd></>)}
        {c.horario?.length > 0 && (<><dt class="etiqueta">{e.horario}</dt><dd>{c.horario.map((h) => <span class="hora"><span>{h.dias}</span><span>{h.horas}</span></span>)}</dd></>)}
        {c.correo && (<><dt class="etiqueta">{e.correo}</dt><dd><a href={`mailto:${c.correo}`}>{c.correo}</a></dd></>)}
        {redes.length > 0 && (<><dt class="etiqueta">{e.redes}</dt><dd>{redes.map((r) => <a href={r.href} target="_blank" rel="noopener">{r.nombre} {r.usuario}<span class="sr-only"> ({sitio.ui.abreNuevaPestana})</span></a>)}</dd></>)}
      </dl>
    </div>

    <div class="reserva__mapa rev" style="--i:2">
      {d.mapa.embedUrl
        ? <iframe src={d.mapa.embedUrl} title={d.mapa.titulo} loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        : <Arco ratio="4 / 5"><Foto base="estudio-recepcion" alt="Recepción de Aira con el logo en relieve sobre un muro curvo" sizes="(min-width: 900px) 30vw, 80vw" /></Arco>}
    </div>
  </section>

  <section class="seccion faq">
    <div class="contenedor faq__in">
      <Encabezado etiqueta={d.faq.etiqueta} titulo={d.faq.titulo} />
      <div class="faq__lista">
        {d.faq.items.map((q) => (
          <details class="rev">
            <summary>{q.pregunta}</summary>
            <p>{q.respuesta}</p>
          </details>
        ))}
      </div>
    </div>
  </section>

  <section class="seccion cierre banda">
    <div class="contenedor cierre__in">
      <Encabezado etiqueta={d.cierre.etiqueta} titulo={d.cierre.titulo} texto={d.cierre.texto} alinear="centro" />
      <div class="rev"><Boton texto={d.cierre.boton.texto} href={reserva} variante="marfil" externo /></div>
    </div>
  </section>
</Layout>

<style>
  .cabecera-pagina { padding-bottom: clamp(32px, 5vw, 64px); }
  .reserva { display: grid; gap: 3rem; padding-bottom: clamp(64px, 9vw, 130px); }
  .reserva__wa { display: grid; gap: 1.5rem; justify-items: start; align-content: start; }
  .reserva__t { margin: 0; font-weight: 100; font-size: clamp(2.125rem, 1.5rem + 2vw, 3rem); line-height: 1.08; }
  .reserva__num { margin: 0; }
  dl { margin: 1.5rem 0 0; display: grid; gap: 0.4rem; }
  dt { margin-top: 1.25rem; }
  dd { margin: 0; }
  dd a { display: block; width: fit-content; }
  .suave { color: var(--texto-suave); }
  .hora { display: flex; justify-content: space-between; gap: 1.5rem; max-width: 380px; border-bottom: 1px solid var(--linea); padding-block: 0.5rem; }
  .reserva__mapa { max-width: 420px; width: 100%; justify-self: center; }
  .reserva__mapa iframe { width: 100%; aspect-ratio: 4 / 5; border: 0; border-radius: 24px; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  .faq__in { display: grid; gap: 3rem; max-width: 900px; }
  details { border-top: 1px solid var(--linea); padding-block: 1.1rem; }
  details:last-child { border-bottom: 1px solid var(--linea); }
  summary { cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: 1rem; font-size: clamp(1.15rem, 1rem + 0.7vw, 1.4rem); }
  summary::-webkit-details-marker { display: none; }
  summary::after { content: "+"; font-weight: 100; font-size: 1.8rem; line-height: 1; transition: transform 0.4s var(--ease); }
  details[open] summary::after { transform: rotate(45deg); }
  details p { margin: 0.9rem 0 0; max-width: 60ch; color: var(--texto-suave); }

  .cierre__in { display: grid; gap: 2.25rem; justify-items: center; text-align: center; }
  @media (min-width: 900px) {
    .reserva { grid-template-columns: 1fr 1fr 0.8fr; gap: 5vw; }
    .faq__in { grid-template-columns: 0.8fr 1.2fr; max-width: var(--max); gap: 6vw; }
  }
</style>
```

- [ ] **Step 6: `404.astro`** (el texto vive en `sitio.json`, bloque nuevo `noEncontrada`)

Agregar a `src/datos/sitio.json` (después de `pie`), con la coma correspondiente:

```json
  "noEncontrada": {
    "titulo": "Esta página\nse fue a respirar",
    "texto": "No encontramos lo que buscas. Vuelve al inicio y sigue el recorrido.",
    "boton": "Volver al inicio"
  }
```

`src/pages/404.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
import Encabezado from "../components/Encabezado.astro";
import Boton from "../components/Boton.astro";
import sitio from "../datos/sitio.json";
import { ruta } from "../lib/ruta.js";
const n = sitio.noEncontrada;
---
<Layout titulo={`${n.titulo.replace("\n", " ")} · ${sitio.nombre}`} descripcion={sitio.descripcion}>
  <section class="seccion">
    <div class="contenedor nf">
      <Encabezado nivel={1} titulo={n.titulo} texto={n.texto} alinear="centro" />
      <Boton texto={n.boton} href={ruta("/")} variante="solido" />
    </div>
  </section>
</Layout>

<style>
  .nf { display: grid; gap: 2.5rem; justify-items: center; text-align: center; min-height: 55svh; align-content: center; }
</style>
```

- [ ] **Step 7: Ejecutar pruebas**

Run: `node --test tests/`
Expected: PASS todo. Si la prueba de título del 404 falla por largo (10–70), ajustar `noEncontrada.titulo`.

- [ ] **Step 8: Revisión visual**

`/membresia`: la tarjeta VIP se ve completa; los planes en arco quedan legibles y alineados, el destacado en espresso con contraste correcto; en 320 px los precios no se cortan. `/contacto`: los tres bloques se apilan sin desbordar; "Mapa": al no haber `embedUrl`, la foto en arco ocupa su lugar; el acordeón abre y cierra con teclado (Enter/Espacio). `/no-existe`: muestra el 404.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "Páginas Membresía, Contacto y 404" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```

---

### Task 10: Verificación completa (responsive, accesibilidad, movimiento, rendimiento)

**Files:**
- Create (temporal, fuera del repo): banco de pruebas `banco.html` en `/tmp/claude-1000/.../scratchpad/prueba/`
- Modify: lo que las revisiones obliguen a corregir

**Interfaces:**
- Consumes: sitio compilado (`dist/`).

- [ ] **Step 1: Build y pruebas**

Run: `npm run build && node --test tests/`
Expected: build sin errores ni avisos; todas las pruebas PASS.

- [ ] **Step 2: Responsive con iframes**

Seguir `generador/conocimiento/verificacion-responsive.md`: copiar `dist/` a una carpeta temporal, poner `banco.html` dentro, servir con `python3 -m http.server 4331 --bind 127.0.0.1`, y abrir los iframes de 320, 375, 768 y 1440 px. Para cada una de las 5 páginas, ejecutar en la consola del iframe `document.documentElement.scrollWidth <= window.innerWidth` y esperar `true`. Recorrer cada página completa en 320 y 375 revisando titulares cortados, imágenes deformadas y botones que se desbordan. Corregir y repetir.

- [ ] **Step 3: Contraste y teclado**

Con el navegador: tabular por cada página completa confirmando foco visible, orden lógico, menú móvil operable con teclado y Esc, `details` operable. Calcular contraste de: espresso/marfil, marfil/espresso, `#6F6457`/marfil, etiquetas pequeñas y botones. Todos ≥ 4.5:1 (texto normal). Documentar la lista en `conocimiento_generado/MARCA.md` (Tarea 11).

- [ ] **Step 4: Movimiento reducido y sin JavaScript**

Con el emulador de "prefers-reduced-motion: reduce" del navegador (o el ajuste del sistema): todo visible, sin transiciones, sin parallax. Para "sin JS": `curl -s http://127.0.0.1:4331/ | grep -c 'class="js'` debe dar `0` (la clase `js` solo se agrega por script) y por tanto `.js .rev` no aplica; abrir la página con JavaScript desactivado en las herramientas del navegador y confirmar que todo el contenido se ve.

- [ ] **Step 5: Lighthouse (si hay Chrome disponible)**

Run: `npx --yes lighthouse http://127.0.0.1:4331/ --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --chrome-flags="--headless" --output=json --output-path=/tmp/claude-1000/-mnt-5ddaa367-d44e-4462-8632-c0f57f33031c-DESARROLLO-PAGINAS-WEB-IA-base-web-ia/96d666b2-c9f6-495c-bae5-09d889645ef4/scratchpad/lh.json`
Expected: rendimiento ≥ 95 y accesibilidad ≥ 95 en `/`, `/clases` y `/membresia`. SEO puede quedar penalizado por `noindex` (esperado en demo). Si el entorno no puede ejecutar Lighthouse, informarlo y medir a mano: peso de la portada y que la foto prioritaria sea la única `fetchpriority="high"`.

- [ ] **Step 6: Corregir y repetir hasta cumplir; commit**

```bash
git add -A && git commit -m "Ajustes de verificación: responsive, contraste y accesibilidad" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
```
(Omitir el commit si no hubo cambios, y decirlo.)

---

### Task 11: Documentación y entrega

**Files:**
- Create: `AGENTS.md`, `CLAUDE.md`, `TUTORIAL.md`, `PENDIENTES.md`, `README.md`, `conocimiento_generado/{COMO-EDITAR,LIMITES,MARCA,PENDIENTES,PUBLICAR,SECCIONES,SITIO,STACK}.md`, scripts de entrega copiados (`instalar.sh`, `instalar.ps1`, `doctor.sh`, `doctor.ps1`)

**Interfaces:**
- Consumes: plantillas de `generador/entrega/` (`AGENTS.md.template`, `TUTORIAL.md.template`, `instalar.*`, `doctor.*`) y el ejemplo `generador/conocimiento/ejemplo-emp2web/` como modelo de estructura y nivel de detalle.

- [ ] **Step 1: Leer plantillas y ejemplo**

Leer completos `generador/entrega/AGENTS.md.template`, `TUTORIAL.md.template` y los 9 archivos de `generador/conocimiento/ejemplo-emp2web/`. **No copiar nada de `generador/conocimiento/` al sitio** (regla 2 del generador): solo se usa como modelo de estructura.

- [ ] **Step 2: `PENDIENTES.md` (raíz) con el registro de datos de demo**

Contenido obligatorio:
- Tabla de **cada** dato inventado, tal como lo lista `npm run revisar-demo`: archivo, bloque, qué se inventó, qué dato real lo reemplaza. Debe incluir: razón social y NIT, WhatsApp, WhatsApp visible, correo, dirección, referencia, horarios, redes, las 5 clases, los 3 planes con sus precios y beneficios, los pasos de reserva, las 4 preguntas frecuentes, los 3 testimonios y el mapa (`mapa.embedUrl` vacío).
- Pendientes de publicación: `indexar: true`, `robots.txt`, `site` en `astro.config.mjs`, dominio y hosting (decisión con el cliente), textos legales y razón social real, favicon revisado en el navegador, y `revisar-demo --produccion` en cero.
- Nota sobre las fotos: usar las 6 del estudio; `Marzo-7 (4)` es duplicado exacto de `(3)`.
- Si la Tarea 3 quitó glifos de la prueba de fuentes, anotarlo aquí.

- [ ] **Step 3: `AGENTS.md` y `CLAUDE.md` del sitio**

Generar desde `AGENTS.md.template` reemplazando `{{NEGOCIO}}` por `Aira, The Pilates House`, `{{NOMBRE_PROVEEDOR}}` y `{{WHATSAPP_PROVEEDOR}}` por los del proveedor (preguntar al usuario si no los conoce). Agregar al inicio, en un recuadro: **"Los datos de contacto, clases, precios, horarios, redes y testimonios son de demostración (`_demo: true`). No son reales ni deben tratarse como tales. Antes de publicar: `npm run revisar-demo -- --produccion` debe terminar sin pendientes."** `CLAUDE.md` replica `AGENTS.md` más las notas específicas de Claude Code (igual que en `generador/CLAUDE.md`, pero sin nada del generador).

- [ ] **Step 4: Los ocho archivos de `conocimiento_generado/`**

Escribir, con la estructura del ejemplo y **datos reales de este sitio**: `SITIO.md` (qué es, páginas, mapa de archivos), `MARCA.md` (paleta, tipografías, reglas de uso, tabla de contrastes medidos en la Tarea 10, motivo del arco, tono de voz con 3 frases reales), `SECCIONES.md` (cada sección por página y el JSON que la alimenta), `COMO-EDITAR.md` (cómo cambiar un texto, un precio, agregar una clase o un plan, cambiar el WhatsApp, reemplazar una foto con `npm run assets`), `LIMITES.md` (qué no se debe tocar o prometer: tipografías Thin ≥ 28 px, `taupe`/`arena` no son color de texto, una animación por vista, sin tema oscuro), `STACK.md` (versiones exactas de Astro, Tailwind, sharp, Node, de `npm ls --depth=0`), `PUBLICAR.md` (las 4 rutas soportadas, elección con el cliente, `revisar-demo --produccion`, `indexar`, `robots.txt`, `site`), `PENDIENTES.md` (puntero a `/PENDIENTES.md`).

- [ ] **Step 5: `TUTORIAL.md`, scripts de entrega y `README.md`**

`TUTORIAL.md` desde la plantilla con **ejemplos reales de Aira** (p. ej. "cambia el precio del plan Equilibrio" → editar `src/datos/membresia.json`, "agrega una clase"). Copiar `instalar.sh`, `instalar.ps1`, `doctor.sh`, `doctor.ps1` desde `generador/entrega/` a la raíz del sitio. `README.md` breve: qué es, `npm install`, `npm run dev`, `npm run build`, `npm test`.

- [ ] **Step 6: Verificaciones de cierre**

```bash
cd "/mnt/5ddaa367-d44e-4462-8632-c0f57f33031c/DESARROLLO/PAGINAS WEB IA/base_web_ia/web-spaaira"
grep -rn "{{" --include="*.md" --include="*.json" --include="*.astro" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=docs || echo "sin marcadores"
git remote get-url origin 2>&1 | head -1
python3 "../generador/herramientas/revisar-frontera.py" 2>&1 | tail -15
npm run build && node --test tests/ && npm run revisar-demo
```
Expected: "sin marcadores"; sin remoto aún (se configura con el cliente, **nunca** con alias de SSH del proveedor); `revisar-frontera` sin hallazgos (si reporta que algo del generador viajó al sitio o al revés, corregirlo); build y pruebas en verde; `revisar-demo` lista los datos de demostración.

- [ ] **Step 7: Registrar el sitio en el generador (solo un puntero)**

En `generador/paginas_en_proceso.md` agregar una línea para `web-spaaira` y crear `generador/pendientes/web-spaaira.md` con **solo un puntero** (ubicación, estado en una línea, y "ver `PENDIENTES.md` del sitio"), igual que `generador/pendientes/web-gestiona2.md`. No copiar allí ningún pendiente del negocio de Aira (regla 3 del generador). Si hay un patrón general que sirva a otros sitios (p. ej. `ruta()` + `.js .rev` para movimiento seguro, pipeline de logos recoloreados por alfa), agregarlo a `generador/conocimiento/lecciones.md` como lección **sin datos de Aira**, citando `web-spaaira` como atribución.

- [ ] **Step 8: Decisión sobre `docs/superpowers/`**

El spec y el plan son proceso deliberativo (el "por qué"), no descriptivo; la regla del generador dice que eso no viaja al cliente. Preguntar al usuario: ¿se quedan en este repo (útiles mientras se construye) o se mueven fuera de `web-spaaira/` antes de configurar el remoto del cliente? No tomar la decisión sin él.

- [ ] **Step 9: Commit final**

```bash
git add -A && git commit -m "Documentación del sitio, pendientes y paquete de entrega" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Bi2VPd5KaY44VTGFneLJpw"
git log --oneline
```

---

## Autorrevisión del plan

- **Cobertura del spec:** §3 marca → T3, T5 (tokens); §4 dirección visual → T5–T9; §5 páginas → T6–T9; §6 arquitectura → T1–T5 (cambios de GSAP/tema/mapa registrados en T1); §7 datos demo → T2, T4, T11; §8 verificación → T10; §9 documentación → T11; §10 fuera de alcance respetado.
- **Marcadores:** ninguno sin resolver; los pasos que dependen de decisiones del usuario (T11 pasos 3 y 8) están nombrados.
- **Consistencia de tipos:** `enlaceWa(numero, mensaje)`, `ruta(p)`, props de `Foto/Arco/Boton/Encabezado` y claves de JSON coinciden entre tareas (`inicio.pilares.items[].enlace`, `clases.lista.items[].mensaje`, `membresia.planes.items[].precio`).
- **Review Focus cubierto:** 1 → T5 prueba de CSS + T10; 2 → T5/T9 componentes y prueba `href=""`; 3 → T2; 4 → T10; 5 → T4; 6 → T2.
