# Aira, The Pilates House: qué es este sitio

## El negocio

**Aira, The Pilates House** es un estudio de pilates reformer y mat ubicado en **Medellín, Colombia**. Su propósito de marca:
*propiciar la serenidad mental, el balance físico y espiritual mediante una experiencia
sensorial consciente.* Atributos: integral, minimalista, exclusivo. Valores: serenidad,
conexión mente cuerpo, bienestar. Eslóganes de marca: **The Pilates House**, **One breath
at a time** y **Serenity in motion**.

El sitio no vende: **lleva a reservar por WhatsApp.** No hay carrito ni pagos.

> ⚠️ Los datos de contacto, clases, precios, horarios, redes, preguntas frecuentes y
> testimonios son de demostración (`"_demo": true`). Ver `PENDIENTES.md`.

## Mapa de páginas

| Ruta | Para qué sirve | Datos |
|---|---|---|
| `/` | Portada, propósito, tres puertas (casa, clases, membresía), cita, espacio, voces, cierre | `src/datos/inicio.json` |
| `/la-casa` | Historia de marca, propósito, esencia (atributos, beneficios, valores) y galería | `la-casa.json` |
| `/clases` | Las clases, una por una, y cómo reservar | `clases.json` |
| `/membresia` | La tarjeta VIP y los planes con precio | `membresia.json` |
| `/contacto` | Reserva por WhatsApp, dirección, horarios y preguntas frecuentes | `contacto.json` |
| `/404` | Página de error | `sitio.json` (`noEncontrada`) |

Lo que se repite en todas las páginas (menú, pie, datos de contacto, textos de interfaz)
vive en `src/datos/sitio.json`.

## Cómo hablar en este sitio

- Tono pausado, sensorial y simple. Frases cortas. Se tutea.
- **Nunca prometer resultados físicos ni de salud.** Los testimonios hablan de calma y
  atención, no de cuerpos ni de efectos.
- Sin urgencia, sin descuentos agresivos, sin signos de exclamación.
- Sin guiones largos ni separadores `·` en el copy.
- Nunca inventar cifras, casos, clientes ni testimonios reales. Si falta un dato, se le
  pide al dueño del negocio.
