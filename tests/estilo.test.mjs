import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../src/", import.meta.url));
async function archivos(dir) {
  const s = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) s.push(...(await archivos(p)));
    else if (/\.(astro|css)$/.test(e.name)) s.push(p);
  }
  return s;
}

test("las fotos no llevan marco: sin arcos ni esquinas redondeadas (pedido del cliente)", async () => {
  const fallos = [];
  for (const f of await archivos(src)) {
    const t = await readFile(f, "utf8");
    if (/\.arco\b|class="arco|<Arco|999px 999px/.test(t)) fallos.push(f.replace(src, "src/") + ": arco");
    // img o contenedor de foto con border-radius
    for (const m of t.matchAll(/(img|\.recuadro|\.foto)[^{}]*\{[^}]*border-radius\s*:\s*(?=\S)(?!0(?:px)?\s*[;}])[^;}]+/g)) fallos.push(f.replace(src, "src/") + ": " + m[0].slice(0, 60));
  }
  assert.deepEqual(fallos, []);
});

test("las fotos de una misma cuadrícula comparten tamaño: el recuadro cuadrado es el estándar", async () => {
  const t = await readFile(join(src, "components/Recuadro.astro"), "utf8");
  assert.match(t, /aspect-ratio/);
  assert.match(t, /object-fit:\s*cover/);
  assert.ok(!/border-radius/.test(t.replace(/border-radius:\s*0\b/g, "")), "Recuadro no redondea");
});

test("los titulares pueden partir palabras largas (móvil de 320 px: «semipersonalizadas»)", async () => {
  const css = await readFile(join(src, "styles/global.css"), "utf8");
  const regla = css.match(/\.titulo-xl,\s*\.titulo-lg\s*\{[^}]*\}/)?.[0] ?? "";
  assert.match(regla, /overflow-wrap:\s*anywhere/);
  assert.match(regla, /hyphens:\s*auto/);
});
