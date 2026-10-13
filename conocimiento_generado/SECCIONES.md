# Inventario de secciones: Aira

Todo el texto está en `src/datos/<página>.json`; los `.astro` solo componen. Las fotos se
nombran por su base sin el ancho: `"imagen": "estudio-sala"` usa
`public/img/estudio-sala-480|800|1200|1800.webp`. Toda foto lleva su `alt`.

**Las fotos van rectas, sin marco ni esquinas redondeadas, y las de una cuadrícula miden lo
mismo** (`src/components/Recuadro.astro`, cuadradas por defecto).

## Inicio (`inicio.json`)
| Sección | Clave | Notas |
|---|---|---|
| Portada | `portada` | Titular en dos líneas (`\n`). Botón `"tipo": "app"` va a la app. |
| Propósito | `filosofia` | Frase grande centrada. |
| Experiencias | `experiencias` | 4 atributos (`items`) en columnas, sin tarjetas. |
| El estudio | `estudio` | Banda espresso: texto, 3 `puntos` y una foto cuadrada. |
| Voces | `testimonios.items` | 3 recomendados. ⚠️ Demo. |
| Manifiesto | `cita.texto` | Solo el mensaje, **sin título ni firma**. |
| Clase de prueba | `sitio.json › pruebaGratis` | Botón grande a la app. |

## El estudio (`la-casa.json`)
`encabezado`, `historia.lineas` (4), `proposito`, `esencia.columnas` (**3**) y
`espacios.items` (**4, en este orden**: Recepción, Salas con lockers, Reformers, Zonas verdes).

## Experiencias (`clases.json`)
`atributos.items` (4: pilates reformer, hasta 6 personas, profesores fisioterapeutas, técnica
guiada), `detalle` (el reformer) y `eventos.items` (**cumpleaños, despedidas de soltera, grados
y eventos empresariales**; cada uno trae el `mensaje` que llega a WhatsApp).

## Planes y horarios (`membresia.json`) ⚠️ Demo
`horarios.dias` (cada día con su lista de `horas`; una lista vacía muestra "Cerrado"),
`planes.items` (**3**; `"destacado": true` pinta uno en espresso; precio entero en COP) y `vip`
(tarjeta de miembro).

## Contacto (`contacto.json` + `sitio.json`)
`sitio.json › reservas` (bloque de reserva en la app + botón de dudas por WhatsApp),
`formulario` (campos, motivos, plantilla del mensaje y consentimiento), la ubicación
(`sitio.json › ubicacion`, real) con enlace **Cómo llegar** (Google Maps, sin incrustar), el
horario y los datos de contacto (`sitio.json › contacto`, demo) y `faq.items` (**4 preguntas
acordadas con el cliente**; el token `{direccion}` se reemplaza por la dirección real).

## Páginas legales (`legales.json`) ⚠️ Borradores
Tres documentos con esqueleto de secciones y un aviso de "pendiente de revisión legal".

## En todas las páginas
| Elemento | Dónde |
|---|---|
| Menú y botón **Primera clase gratis** | `Cabecera.astro` (en celular el botón se acorta a `cta.corto`) |
| Pie con ubicación, horario, contacto y enlaces legales | `Pie.astro` |
| Ventana de **primera clase gratis** a los 30 s | `Popup.astro`, textos en `sitio.json › popup` |
| Botón flotante de WhatsApp | `Layout.astro` |

## Ventana emergente
Aparece a los `popup.segundos` (30) de estar en la página, **una vez por visita** (se recuerda
con el almacenamiento temporal del navegador), no interrumpe si la persona está escribiendo en
un formulario y no aparece en las páginas legales ni en la 404. Se cierra con Esc, con el fondo
o con "Ahora no".
