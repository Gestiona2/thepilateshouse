import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../src/datos/", import.meta.url));
const pub = fileURLToPath(new URL("../public/", import.meta.url));
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
      await access(`${pub}img/${base}-800.webp`);
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

test("contacto.mapa trae el alt de la foto de respaldo y sitio.pie el rótulo legal", async () => {
  const c = await cargar("contacto.json");
  assert.ok(c.mapa.alt && c.mapa.alt.length > 8, "falta mapa.alt");
  assert.ok((await cargar("sitio.json")).pie.legal, "falta pie.legal");
});
