# Inventario de secciones: Aira

Qué hay en cada página y dónde vive su contenido. **Todo el texto está en
`src/datos/<página>.json`**; los archivos `.astro` solo componen y no llevan texto.

Las fotos se nombran por su base, sin el ancho: `"imagen": "estudio-sala"` usa
`public/img/estudio-sala-480|800|1200|1800.webp`. Toda foto lleva su `alt` (descripción
para quien no puede verla).

---

## Inicio (`inicio.json`, página `src/pages/index.astro`)

| Sección | Clave | Notas |
|---|---|---|
| Portada | `portada` | Titular en dos líneas (`\n` separa). Dos botones: el de `"tipo": "reserva"` abre WhatsApp. Foto en arco. |
| Propósito | `filosofia` | Una frase grande centrada. |
| Tres puertas | `pilares.items` | **Exactamente 3.** La del medio baja en el diseño. Cada una enlaza a una página. |
| Cita | `cita` | Banda espresso con una frase y una firma. Frase corta: hasta ~90 caracteres. |
| El espacio | `espacio` | Dos fotos verticales. |
| Voces | `testimonios.items` | 3 recomendados; frase de hasta ~110 caracteres. ⚠️ Demo. |
| Cierre | `cierre` | Banda espresso con botón de reserva. |

## La casa (`la-casa.json`, `src/pages/la-casa.astro`)
`encabezado`, `historia.lineas` (4 frases, casi textuales del manual de marca), `proposito`,
`esencia.columnas` (**3**: atributos, beneficios, valores), `galeria.items` (6 fotos, con
`leyenda`) y `cierre`.

## Clases (`clases.json`, `src/pages/clases.astro`) ⚠️ Demo
`lista.items`: cada clase tiene `titulo`, `texto`, `duracion`, `nivel`, `imagen`, `alt` y
`mensaje` (el texto que llega prellenado a WhatsApp). 4 a 6 caben bien; se alternan
izquierda y derecha solas. `pasos.items` (3) explica cómo reservar.

## Membresía (`membresia.json`, `src/pages/membresia.astro`) ⚠️ Demo
`vip` (tarjeta de miembro), `planes.items` (**3**; el que tenga `"destacado": true` se pinta
en espresso, solo uno), `planes.moneda`, `planes.periodo` y `planes.nota`. El precio es un
**número entero** en pesos (`840000`), el sitio lo muestra como `$840.000`.

## Contacto (`contacto.json` + `sitio.json`, `src/pages/contacto.astro`)
Reserva, dirección, horarios, correo y redes salen de `sitio.json › contacto`. `faq.items`
(preguntas frecuentes, 4 a 8) es demo. `mapa.embedUrl`: si está vacío se muestra una foto en
arco; si se pega una URL de incrustación de mapa, aparece el mapa.

## En todas las páginas
| Elemento | Dónde |
|---|---|
| Menú superior | `src/components/Cabecera.astro` (lee `sitio.json › menu`; las 3 primeras a la izquierda, el resto a la derecha) |
| Pie de página | `src/components/Pie.astro` (oculta solo lo que esté vacío: redes, legales) |
| Botón flotante de WhatsApp | `src/layouts/Layout.astro` |
| Apariciones al bajar y parallax | `Layout.astro` (clase `.rev`, atributo `data-parallax`) |
