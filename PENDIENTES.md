# Pendientes: Aira, The Pilates House

## 1. Datos de demostración por reemplazar

Se inventaron para poder mostrar el sitio completo al cliente. Cada uno lleva
`"_demo": true` en su bloque. `npm run revisar-demo` los lista; con `--produccion` falla
mientras quede alguno.

| Dónde | Qué se inventó | Dato real que lo reemplaza |
|---|---|---|
| `sitio.json › empresa` | Razón social "Aira Studio Pilates S.A.S." y NIT `000.000.000-0` | Razón social y NIT reales |
| `sitio.json › contacto.whatsapp` / `whatsappVisible` | `573000000000` / `+57 300 000 0000` | WhatsApp real de Aira |
| `sitio.json › contacto.correo` | `hola@aira.example` | Correo real |
| `sitio.json › contacto.direccion` | `Calle 00 # 00-00, Local 000` y la referencia de entrada (la ciudad, **Medellín, Colombia**, ya está confirmada por el usuario) | Dirección real en Medellín (barrio y número) |
| `sitio.json › contacto.horario` | Lunes a viernes 6:00 a 20:00, sábados 8:00 a 13:00, domingos cerrado | Horarios reales |
| `sitio.json › contacto.redes` | Instagram `@aira.thepilateshouse` apuntando a instagram.com | Redes reales |
| `sitio.json › contacto.mensajeReserva` | Texto del mensaje que llega a WhatsApp | Revisar con Aira |
| `clases.json` (archivo completo) | Las 5 clases (Reformer Esencial, Flow, Sculpt, Mat Serenidad, Sesión privada), duración, nivel, textos y los 3 pasos de reserva | Catálogo real de clases |
| `membresia.json` (archivo completo) | Planes Esencial, Equilibrio y Aira VIP, con precios `620000`, `840000`, `1290000` COP y sus beneficios | Planes y precios reales |
| `inicio.json › testimonios` | 3 testimonios con nombre de pila ficticio | Testimonios reales con permiso, o quitar la sección |
| `contacto.json › faq` | 4 preguntas frecuentes (qué llevar, experiencia, llegada, cancelación con 12 h) | Políticas reales de Aira |

Sin inventar nunca: cifras de resultados, premios, nombres de instructoras ni promesas de salud.

## 2. Para publicar
- [ ] Reemplazar todos los datos de la sección 1 y correr `npm run revisar-demo -- --produccion`.
- [ ] `sitio.json`: `"indexar": true`.
- [ ] `public/robots.txt`: permitir buscadores y agregar el sitemap.
- [ ] `astro.config.mjs`: `site` con el dominio real (y `base` si va en subcarpeta).
- [ ] Elegir hosting **con el cliente** y crear dominio, GitHub y hosting a su nombre.
- [ ] Páginas legales (privacidad, tratamiento de datos) con la razón social real; luego
      llenar `sitio.json › legales` para que aparezcan en el pie.
- [ ] Mapa: pegar la URL de incrustación en `contacto.json › mapa.embedUrl` cuando haya
      dirección real (hoy se muestra una foto en arco).
- [ ] Configurar el remoto del cliente (sin alias de SSH del proveedor) y archivar `dist/`.

## 3. Notas de contenido
- Las fotos son las 6 del estudio. `Marzo-7 (4)` es un duplicado exacto de `Marzo-7 (3)` y no
  se usó.
- Si Aira entrega más fotos verticales (3:4) o una foto con personas practicando, la
  portada y las clases ganan mucho. Se agregan con `npm run assets`.
- El mockup de la tarjeta VIP tiene fondo gris verdoso propio; se muestra tal cual con borde
  suave.
- El proveedor indicado en `AGENTS.md` y `TUTORIAL.md` es Emp2Web (302 552 6058). Confirmar
  antes de entregar.
