# Aira, The Pilates House: qué es este sitio

## El negocio

**Aira, The Pilates House** es un estudio de pilates reformer en **Envigado, Antioquia**
(Av. Las Palmas Km 15 990, Vda. El Peñasco). Su propósito de marca: *propiciar la serenidad
mental, el balance físico y espiritual mediante una experiencia sensorial consciente.*
Atributos: integral, minimalista, exclusivo. Valores: serenidad, conexión mente-cuerpo,
bienestar. Eslóganes: **The Pilates House**, **One breath at a time**, **Serenity in motion**.

Lo que el cliente confirmó (es real, no de demostración):
- Clases **semipersonalizadas**, de **hasta 6 personas**, con **profesores fisioterapeutas** y
  **técnica guiada**.
- Se agenda **siempre desde su app**; las dudas, por WhatsApp.
- La primera clase es **gratis**.
- Para ir: **un termo con agua**. Los accesorios y lo demás los pone Aira.
- Eventos: cumpleaños, despedidas de soltera, grados y eventos empresariales.
- Espacios: recepción, salas con lockers, reformers y zonas verdes.

El sitio no cobra ni tiene carrito: lleva a **reservar en la app** y a **escribir por WhatsApp**.

> ⚠️ Son de demostración (`"_demo": true`): WhatsApp, correo, redes, horarios de clase y del
> estudio, planes y precios, testimonios, la razón social, el enlace de la app y los textos
> legales. Ver `PENDIENTES.md`.

## Mapa de páginas

| Menú | Ruta | Para qué sirve | Datos |
|---|---|---|---|
| Inicio | `/` | Portada, experiencias, el estudio, voces, manifiesto y clase de prueba | `inicio.json` |
| El estudio | `/la-casa` | Historia de marca, propósito, esencia y los cuatro espacios | `la-casa.json` |
| Experiencias | `/clases` | La clase (4 atributos), el reformer y los eventos | `clases.json` |
| Planes y horarios | `/membresia` | Horarios de clase, planes con precio y tarjeta VIP | `membresia.json` |
| Contacto | `/contacto` | Reservas en la app, formulario, ubicación, horario y preguntas | `contacto.json` |
| (pie) | `/politica-privacidad`, `/tratamiento-datos`, `/politica-cookies` | Borradores a la espera del texto legal | `legales.json` |
| | `/404` | Página de error | `sitio.json` |

Las rutas no cambiaron aunque cambiaran las etiquetas del menú (`/la-casa` es "El estudio").
Lo que se repite (menú, pie, contacto, ubicación, bloque de reservas, clase de prueba y
ventana emergente) vive en `src/datos/sitio.json`.

## Cómo hablar en este sitio

- Tono pausado, sensorial y simple. Frases cortas. Se tutea.
- **Nunca prometer resultados físicos ni de salud.** Que los profesores sean fisioterapeutas
  es un dato, no una promesa de resultado.
- Sin urgencia, sin descuentos agresivos. "Primera clase gratis" es la única oferta.
- Sin guiones largos ni separadores `·` en el copy.
- Nunca inventar cifras, casos ni testimonios reales. Si falta un dato, se le pide al dueño.
