# Recetas: los cambios más comunes

Todas terminan igual: mostrar el resultado al dueño, y publicar solo cuando lo apruebe
(ver `PUBLICAR.md`). Después de editar un JSON, `npm test` valida la estructura.

## Textos
**"Cambia el titular de la portada"** → `src/datos/inicio.json › portada.titulo`. Dos
líneas separadas por `\n`. Un titular mucho más largo se parte en tres en el celular.

**"Cambia un texto de tal página"** → buscar la sección en `SECCIONES.md`.

## Contacto
**"Cambia el WhatsApp"** → `src/datos/sitio.json › contacto.whatsapp` (solo dígitos con
indicativo de país, p. ej. `573001234567`) y `whatsappVisible` (cómo se ve escrito). Todos
los botones salen de ese campo; no hay que buscarlo en otro lado.

**"Cambia la dirección o los horarios"** → `sitio.json › contacto.direccion` y `horario`.
Para ocultar un bloque, déjalo vacío (`"redes": []`).

**"Cambia lo que dice el mensaje de reserva"** → `sitio.json › contacto.mensajeReserva`.

## Clases y planes
**"Agrega una clase"** → `clases.json › lista.items`: copiar una existente y cambiar
`titulo`, `texto`, `duracion`, `nivel`, `imagen`, `alt` y `mensaje`. La imagen es el nombre
de una foto que ya exista en `public/img/` (sin el ancho).

**"Cambia un precio"** → `membresia.json › planes.items[n].precio`, número entero.
⚠️ Antes de cambiar un precio, decir si sube o baja y confirmar.

**"Cambia cuál plan es el destacado"** → poner `"destacado": true` en uno y `false` en los
otros.

## Imágenes
**"Cambia una foto"** → poner la nueva en la carpeta de insumos y correr
`npm run assets "<carpeta de insumos>"`: genera los cuatro anchos en WebP. Las fotos se
recortan en arco, así que sirven mejor las **verticales (proporción 3:4)**. Cada foto
necesita un `alt` que diga qué se ve.

**"Agrega una foto a la galería"** → agregarla a `FOTOS` en `scripts/assets-config.mjs`,
correr `npm run assets` y sumar la entrada en `la-casa.json › galeria.items`.

## Preguntas frecuentes y voces
**"Agrega una pregunta frecuente"** → `contacto.json › faq.items`, `{ pregunta, respuesta }`.
**"Agrega un testimonio"** → `inicio.json › testimonios.items`. Solo con textos reales de
clientas y con su permiso. Nada sobre resultados físicos o de salud.

## Colores y tipografías
No se cambian sin que el cliente lo pida: vienen del manual de marca. Los colores están en
`src/styles/global.css` (bloque `:root`). Ver `MARCA.md`.

## Antes de publicar
`npm run revisar-demo -- --produccion` debe terminar sin pendientes.
