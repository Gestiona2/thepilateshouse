# Pendientes: Aira, The Pilates House

## 1. Datos de demostración por reemplazar

Se inventaron o son provisionales para poder mostrar el sitio completo. Cada uno lleva
`"_demo": true`. `npm run revisar-demo` los lista; con `--produccion` falla mientras quede alguno.

| Dónde | Qué es provisional | Dato real que lo reemplaza |
|---|---|---|
| `sitio.json › app.url` | `https://emp2web.com` (página de Emp2Web, provisional) | **Enlace de la app de Aira** (el cliente lo entregará) |
| `sitio.json › contacto.whatsapp` / `whatsappVisible` | `573000000000` / `+57 300 000 0000` | WhatsApp real |
| `sitio.json › contacto.correo` | `hola@aira.example` | Correo real |
| `sitio.json › contacto.horario` | Lunes a viernes 6:00 a 20:00, sábados 8:00 a 13:00, domingos cerrado | Horario real del estudio |
| `sitio.json › contacto.redes` | Instagram `@aira.thepilateshouse` (apunta a instagram.com) | Redes reales |
| `sitio.json › empresa` | Razón social "Aira Studio Pilates S.A.S." y NIT `000.000.000-0` | Razón social y NIT reales |
| `membresia.json` (horarios) | Horas de clase de lunes a sábado | Horario real de clases |
| `membresia.json` (planes) | Esencial, Equilibrio y Aira VIP, con precios `620000`, `840000`, `1290000` COP y beneficios | Planes y precios reales |
| `inicio.json › testimonios` | 3 testimonios con nombre de pila ficticio | Testimonios reales con permiso, o quitar la sección |
| `legales.json` | Esqueleto de privacidad, tratamiento de datos y cookies, sin texto legal | Texto oficial revisado |

Sin inventar nunca: cifras de resultados, premios, nombres de profesores ni promesas de salud.

## 2. Contenido confirmado por el cliente (13 de octubre de 2026)
Ya es real y está en el sitio: dirección (Av. Las Palmas Km 15 990, Vda. El Peñasco, Envigado,
Antioquia), clases semipersonalizadas de hasta 6 personas, profesores fisioterapeutas, técnica
guiada, reservas siempre por la app, primera clase gratis, termo con agua y eventos.
- [ ] **Confirmar la dirección tal cual**: el cliente escribió "Av. Las Palmas #Km 15 990"; se
      publicó sin el "#" ("Av. Las Palmas Km 15 990").
- [ ] **Ciudad:** el cliente había dicho Medellín y la dirección es Envigado. El sitio dice
      **Envigado, Antioquia**. Confirmar si quieren mencionar también Medellín.

## 3. Imágenes por reemplazar
- [ ] **Eventos** (cumpleaños, despedidas, grados, empresariales): hoy usan fotos del estudio.
      Conviene fotos propias de cada tipo de evento.
- [ ] **Zonas verdes:** no hay una foto dedicada; se usa la de la sala con plantas
      (`estudio-cortinas`). Pedir una foto de las zonas verdes.
- [ ] Las 6 fotos del estudio son las únicas disponibles. `Marzo-7 (4)` es duplicado exacto de
      `Marzo-7 (3)`.

## 4. Para publicar
- [ ] Reemplazar los datos de la sección 1 y correr `npm run revisar-demo -- --produccion`.
- [ ] `sitio.json`: `"indexar": true`; `public/robots.txt`: permitir buscadores y agregar el sitemap.
- [ ] `astro.config.mjs`: `site` con el dominio real y `base: "/"` (hoy `/thepilateshouse`).
- [ ] Hosting, dominio, GitHub y remoto **a nombre del cliente**, creados con él presente.
- [ ] Textos legales oficiales (sección 1) y, si se agrega analítica o mapas incrustados,
      actualizar la política de cookies.
- [ ] El formulario hoy abre WhatsApp con el mensaje armado. Si el cliente quiere recibirlo por
      correo o en un CRM, hace falta un servicio aparte (no se guardan datos en este sitio).
- [ ] El proveedor indicado en `AGENTS.md` y `TUTORIAL.md` es Emp2Web (302 552 6058). Confirmar.
