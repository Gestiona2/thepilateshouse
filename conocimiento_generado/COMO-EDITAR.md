# Recetas: los cambios más comunes

Todas terminan igual: mostrar el resultado al dueño del negocio y publicar solo cuando lo
apruebe (ver `PUBLICAR.md`). Después de editar un JSON, `npm test` valida la estructura.

## Textos
**"Cambia el titular de la portada"** → `src/datos/inicio.json › portada.titulo`. Dos líneas
separadas por `\n`.
**"Cambia un texto de tal página"** → buscar la sección en `SECCIONES.md`.

## Reservas y la app
**"Ya tengo el enlace de la app"** → `src/datos/sitio.json › app.url` (y quitar `"_demo": true`
de ese bloque). Ese único campo alimenta el botón fijo del menú, la portada, el bloque
"Reserva tu clase", la clase de prueba y la ventana emergente.
**"Cambia el texto del bloque de reservas / de la clase de prueba / de la ventana"** →
`sitio.json › reservas`, `pruebaGratis` o `popup`. `popup.segundos` cambia cuándo aparece.

## Contacto
**"Cambia el WhatsApp"** → `sitio.json › contacto.whatsapp` (solo dígitos con indicativo, p. ej.
`573001234567`) y `whatsappVisible`. Todos los botones salen de ahí.
**"Cambia la dirección"** → `sitio.json › ubicacion` (`linea`, `zona`, `ciudad`, `completa` y el
enlace `mapaEnlace`). La respuesta de "¿Dónde están ubicados?" la toma sola de `completa`.
**"Cambia horarios del estudio, correo o redes"** → `sitio.json › contacto`. Un campo vacío
(`"redes": []`) oculta su bloque.
**"Cambia las opciones del formulario"** → `contacto.json › formulario.motivos`. El mensaje que
llega a WhatsApp se arma con `formulario.plantilla` (`{nombre}`, `{telefono}`, `{correo}`,
`{motivo}`, `{mensaje}`; la línea cuyo dato esté vacío se omite).

## Experiencias y eventos
**"Agrega un tipo de evento"** → `clases.json › eventos.items`: copiar uno y cambiar `titulo`,
`texto`, `imagen`, `alt` y `mensaje`.
**"Cambia un atributo (grupos de 6, fisioterapeutas...)"** → `clases.json › atributos` y
`inicio.json › experiencias.items`, y revisar el texto de `popup` y de la portada.

## Planes y horarios
**"Cambia un precio"** → `membresia.json › planes.items[n].precio`, número entero.
⚠️ Antes de cambiarlo, decir si sube o baja y confirmar.
**"Cambia el plan destacado"** → `"destacado": true` en uno y `false` en los demás.
**"Cambia un horario de clase"** → `membresia.json › horarios.dias[n].horas`.

## Preguntas frecuentes y voces
**"Agrega una pregunta"** → `contacto.json › faq.items`, `{ pregunta, respuesta }`. Para poner la
dirección en una respuesta, escribir `{direccion}`.
**"Agrega un testimonio"** → `inicio.json › testimonios.items`, solo con textos reales y con
permiso. Nada sobre resultados físicos o de salud.

## Textos legales
Cuando exista el texto oficial, reemplazar el contenido de `src/datos/legales.json` (una entrada
por documento) y quitar `"_demo": true` y el `aviso`.

## Imágenes
**"Cambia una foto"** → ponerla en la carpeta de insumos y correr
`npm run assets "<carpeta de insumos>"`. Se recortan **cuadradas y rectas**: sirven mejor las
verticales o las que tengan el motivo al centro. Cada foto lleva un `alt` que diga qué se ve.
**"Fotos de eventos o de zonas verdes"** hoy usan fotos del estudio como reemplazo; ver
`PENDIENTES.md`.

## Colores y tipografías
No se cambian sin pedido expreso: vienen del manual de marca. Ver `MARCA.md`.

## Antes de publicar
`npm run revisar-demo -- --produccion` debe terminar sin pendientes.
