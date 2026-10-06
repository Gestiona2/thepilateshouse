import { test, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("../", import.meta.url));
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
  let ocultas = 0;
  for (const f of css) {
    const c = await readFile(join(dist, "_astro", f), "utf8");
    for (const [, selectores, cuerpo] of c.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
      if (!/opacity:\s*0(?![.\d])/.test(cuerpo)) continue;
      for (const sel of selectores.split(",").map((x) => x.trim()).filter((x) => /\.rev\b/.test(x))) {
        ocultas++;
        assert.match(sel, /\.js\s/, `${f}: "${sel}" oculta sin el prefijo .js`);
      }
    }
  }
  assert.ok(ocultas > 0, "no se encontró la regla que oculta .rev bajo .js");
  const inicio = await readFile(join(dist, "index.html"), "utf8");
  assert.ok(!/style="[^"]*opacity:\s*0/.test(inicio), "opacity:0 en línea en el HTML");
});

test("hay sitemap y robots", async () => {
  const s = await readFile(join(dist, "sitemap.xml"), "utf8");
  assert.match(s, /<urlset/);
  const r = await readFile(join(dist, "robots.txt"), "utf8");
  assert.match(r, /Disallow: \//);
});
