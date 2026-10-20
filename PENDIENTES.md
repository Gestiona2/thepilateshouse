# Pendientes: Aira, The Pilates House

## 1. Datos de demostración por reemplazar

Ya son reales (ronda del 19 de octubre de 2026, tomados del Instagram y la app del cliente): WhatsApp
`+57 312 741 0343`, Instagram `@aira_thepilateshouse`, enlace de reservas y de precios en
`aira.kalmiapp.com`, horarios de clase, planes y precios, dirección con "#Km" y enlace de Maps.

Siguen provisionales (`"_demo": true`; `npm run revisar-demo -- --produccion` falla mientras queden):

| Dónde | Qué es provisional | Dato real que lo reemplaza |
|---|---|---|
| `sitio.json › empresa` | Razón social "Aira Studio Pilates S.A.S." y NIT `000.000.000-0` | Razón social y NIT reales |
| `inicio.json › testimonios` | 3 testimonios con nombre de pila ficticio | Testimonios reales con permiso, o quitar la sección |
| `legales.json` | Esqueleto de privacidad, tratamiento de datos y cookies | Texto oficial revisado |

Sin correo público (se quitó el inventado). Sin inventar nunca: cifras de resultados, premios, nombres
de profesores ni promesas de salud.

## 2. Confirmar con el cliente
- [x] **Dirección:** confirmada por el cliente: Mall Le Mont, Sótano 2, oficina 9855, Av. Las Palmas #Km 15 990.
- [ ] **Domingos y festivos:** la historia de Instagram no los menciona; se quitó la fila.
- [ ] **Gift card:** hoy es un bloque de texto con botón a WhatsApp, sin montos ni imagen.
- [ ] Los precios del sitio se copiaron de la app (19/10/2026) y pueden cambiar.
- [ ] Las "reglas" de las historias de Instagram (cancelar con 12 h, vigencia, silencio, etc.) podrían ir
      en una sección o en las FAQ si el cliente quiere.

## 3. Imágenes
Fotos nuevas (19/10/2026) del Drive del cliente, en `public/img/` (script `npm run assets:drive -- <carpeta>`,
config en `scripts/assets-config.mjs › FOTOS_DRIVE`): celebraciones (globos, despedida, empresarial),
galería "Momentos en Aira" (despedidas y Día de la mujer) y tres fotos del estudio (zonas verdes,
casilleros, arco de luz). Los JPG originales no se guardan en el repo.
- [ ] **Grados:** sin foto propia; usa la recepción. Pedir foto de un grado.
- [ ] **Cumpleaños:** usa la sala con globos; pedir foto de un cumpleaños.
- [ ] **Eventos empresariales:** usa la foto de la inauguración; confirmar que sirve.
- [ ] Las fotos muestran personas reconocibles (despedidas, inauguración): confirmar con el cliente que
      tiene su permiso para publicarlas.
- [ ] Quedan más fotos en el Drive (Inauguración 50, Despedida 2 37, Despedida de soltera 36, Febrero, Mayo).

## 4. Para publicar
- [ ] **Cookies:** el pie incrusta Google Maps (iframe de terceros, carga diferida). Al redactar la política de
      cookies oficial hay que mencionarlo; el aviso de cookies/consentimiento queda por decidir con el cliente.
- [ ] Reemplazar los datos de la sección 1 y correr `npm run revisar-demo -- --produccion`.
- [ ] `sitio.json`: `"indexar": true`; `public/robots.txt`: permitir buscadores y agregar el sitemap.
- [ ] `astro.config.mjs`: `site` con el dominio real y `base: "/"` (hoy `/thepilateshouse`).
- [ ] Hosting, dominio, GitHub y remoto **a nombre del cliente**, creados con él presente.
- [ ] Textos legales oficiales (sección 1) y, si se agrega analítica o mapas incrustados,
      actualizar la política de cookies.
- [ ] El formulario hoy abre WhatsApp con el mensaje armado. Si el cliente quiere recibirlo por
      correo o en un CRM, hace falta un servicio aparte (no se guardan datos en este sitio).
- [ ] El proveedor indicado en `AGENTS.md` y `TUTORIAL.md` es Emp2Web (302 552 6058). Confirmar.
