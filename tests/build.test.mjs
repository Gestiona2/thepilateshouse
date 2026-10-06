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
    else if (e.name.endsWith(".html") && !e.name.startsWith("_")) salida.push(p);
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
    for (const img of h.match(/<img\b[^>]*>/g) || []) assert.match(img, /\balt(=|\s|\/?>)/, `${nombre}: img sin alt → ${img.slice(0, 80)}`);
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

test("la-casa: historia completa, esencia en 3 columnas y 6 fotos de galería", async () => {
  const d = JSON.parse(await readFile(join(raiz, "src/datos/la-casa.json"), "utf8"));
  const h = await readFile(join(dist, "la-casa/index.html"), "utf8");
  for (const l of d.historia.lineas) assert.ok(h.includes(l), `falta línea: ${l}`);
  assert.ok(h.includes(d.proposito.texto));
  for (const c of d.esencia.columnas) { assert.ok(h.includes(c.etiqueta)); for (const i of c.items) assert.ok(h.includes(i)); }
  for (const g of d.galeria.items) assert.ok(h.includes(g.alt), `falta foto: ${g.imagen}`);
  assert.match(h, /aria-current="page"[^>]*>La casa/);
});

test("clases: cada clase con su reserva por WhatsApp y pasos", async () => {
  const d = JSON.parse(await readFile(join(raiz, "src/datos/clases.json"), "utf8"));
  const h = await readFile(join(dist, "clases/index.html"), "utf8");
  for (const c of d.lista.items) {
    assert.ok(h.includes(c.titulo), c.titulo);
    assert.ok(h.includes(encodeURIComponent(c.mensaje)), `falta enlace de reserva de ${c.titulo}`);
  }
  for (const p of d.pasos.items) assert.ok(h.includes(p.titulo));
});

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

test("todo enlace y recurso interno respeta la base de publicación", async () => {
  const config = await readFile(join(raiz, "astro.config.mjs"), "utf8");
  const base = ((config.match(/base:\s*"([^"]*)"/) || [])[1] || "").replace(/\/$/, "");
  for (const f of await htmls()) {
    const h = await readFile(f, "utf8");
    const nombre = f.replace(dist, "");
    for (const m of h.matchAll(/\b(?:href|src|srcset)="(\/[^"]*)"/g)) {
      for (const u of m[1].split(",").map((x) => x.trim().split(" ")[0])) {
        assert.ok(u.startsWith(base + "/") || u === base, `${nombre}: "${u}" no empieza con ${base}/`);
      }
    }
  }
  const s = await readFile(join(dist, "sitemap.xml"), "utf8");
  for (const [, loc] of s.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    assert.ok(new URL(loc).pathname.startsWith(base + "/"), `sitemap: ${loc} sin la base ${base}`);
  }
  for (const f of (await readdir(join(dist, "_astro"))).filter((x) => x.endsWith(".css"))) {
    const c = await readFile(join(dist, "_astro", f), "utf8");
    for (const [, u] of c.matchAll(/url\(["']?(\/[^"')]+)/g)) assert.ok(u.startsWith(base + "/"), `${f}: url(${u}) sin base`);
  }
});
