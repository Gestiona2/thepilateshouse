import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("../public/fonts/", import.meta.url));
const fuentes = ["almarose-thin", "almarose-semibold", "technonue-thin", "technonue-regular"];

for (const f of fuentes) {
  test(`${f}.woff2 es un woff2 válido y cubre el español`, async () => {
    const ruta = raiz + f + ".woff2";
    const buf = await readFile(ruta);
    assert.equal(buf.subarray(0, 4).toString(), "wOF2");
    assert.ok(buf.length > 2000, "archivo sospechosamente pequeño");
    const salida = execFileSync("python3", ["-c", `
import sys
from fontTools.ttLib import TTFont
cmap = TTFont(sys.argv[1]).getBestCmap()
faltan = [c for c in "áéíóúüñÁÉÍÓÚÜÑ¿¡«»–—“”" if ord(c) not in cmap]
print(",".join(faltan))
`, ruta]).toString().trim();
    assert.equal(salida, "", `faltan glifos: ${salida}`);
  });
}
