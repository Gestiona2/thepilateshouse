# Publicar y deshacer

> Instrucciones para el agente. El dueño del negocio no necesita conocer ningún comando.

## ⚠️ Antes de publicar por primera vez

1. `npm run revisar-demo -- --produccion` debe terminar **sin pendientes**. Mientras queden
   datos de demostración, no se publica. Ver `PENDIENTES.md`.
2. En `src/datos/sitio.json` poner `"indexar": true`. Hoy el sitio se publica como demo en `demos.emp2web.com/thepilateshouse` (`base` en `astro.config.mjs`).
3. En `public/robots.txt` reemplazar `Disallow: /` por `Allow: /` y agregar la línea
   `Sitemap: https://<dominio>/sitemap.xml`.
4. En `astro.config.mjs` poner el dominio real en `site` (y `base` si va en subcarpeta).
5. Elegir el hosting **con el cliente** (su propio hosting, Cloudflare Pages, Netlify o
   GitHub Pages). El compilado corre en la nube; el cliente nunca compila.
6. Guardar el compilado (`dist/`) junto con la entrega.

## El flujo, siempre en este orden

1. **Cambiar.**
2. **Mostrar:** levantar la vista previa (`npm run dev`) y decirle qué mirar. Revisar celular.
3. **Esperar aprobación explícita.** "Se ve bien" es aprobación; el silencio no.
4. **Publicar:** guardar el cambio y enviarlo (`git commit` + `git push`). Se publica solo.
5. **Avisar:** tarda **2 a 4 minutos**. Si no lo ve, que recargue con Ctrl+F5.

Antes de publicar un cambio: `npm test` debe pasar.

**No usar las palabras `commit`, `push`, `repositorio` ni `rama` con el cliente.**

## Deshacer

| El cliente dice | Qué hacer |
|---|---|
| "no me gustó" (sin publicar) | `git checkout -- <archivo>` |
| "devuélvelo como estaba" | `git revert HEAD` y publicar |
| "vuelve a como estaba ayer" | Ver el historial, elegir el punto y revertir hasta ahí |
| "borré algo sin querer" | Está en el historial; nada se pierde |

**Nunca borrar historial** (`reset --hard`, `push --force`). Siempre revertir hacia adelante.

## Si algo falla
Si la publicación falla, el sitio sigue mostrando la versión anterior. Avisarle al cliente,
no tocar la configuración de publicación y avisar al proveedor.
