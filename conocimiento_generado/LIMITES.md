# Qué no tocar y cuándo llamar al proveedor

Información para saber cuándo **detenerse y avisar** en vez de intentarlo y dejar el sitio
roto.

## Archivos que no se tocan

| Qué | Por qué |
|---|---|
| `package.json`, `package-lock.json`, `astro.config.mjs` | Configuración base y versiones. |
| `src/layouts/Layout.astro` | Contiene el menú móvil, las apariciones al bajar y el parallax. Un error aquí afecta a todas las páginas. |
| `src/styles/global.css` (bloques `@font-face` y `:root`) | Tipografías y colores de la marca. |
| `public/fonts/` y `public/brand/` | Tipografías y logos autorizados. No reemplazar por enlaces externos. |
| `scripts/`, `tests/` | Herramientas de preparación y verificación. |
| `public/robots.txt` | Hoy bloquea a los buscadores a propósito (sitio de demostración). Lo cambia el proveedor al publicar. |

## Reglas de diseño que no se rompen

- **Almarose Thin solo desde 28 px.** Más pequeño es ilegible.
- **Arena (`#E7DEB5`) y taupe (`#B49F84`) no son colores de texto:** no pasan el contraste.
- **El sitio es solo de tema claro.** No se agrega modo oscuro.
- **Una sola pieza con parallax por pantalla.** Más marea, sobre todo en celular.
- **Sin dorados, gradientes decorativos ni sombras pesadas.** No son de la marca.
- **Nunca ocultar contenido sin la clase `js` previa.** Si algo se oculta para animarlo, tiene
  que seguir visible cuando no hay JavaScript o cuando se pide "reducir movimiento".

## Pedidos que exceden a este agente

Respuesta: **"Eso lo hace tu proveedor, te paso el contacto."**

- Rediseñar el sitio o cambiar su estructura general
- Cambiar la identidad de marca (colores, tipografías, logo)
- Agregar tienda en línea, pagos o reservas con calendario propio
- Agregar un área de miembros con usuario y contraseña
- Conectar el sitio con otro sistema (CRM, facturación)
- Cambiar el dominio o mudar el hosting
- Actualizar Astro u otras librerías, o instalar algo nuevo
- Publicar las páginas legales (privacidad, tratamiento de datos): necesitan la razón social
  real y revisión del proveedor

## Lo que sí puede hacer

Cambiar textos, precios, clases, planes, preguntas frecuentes, fotos, horarios y datos de
contacto, siempre desde `src/datos/`. Para agregar una página nueva: copiar la estructura de
una parecida, sumar su archivo de datos y su entrada en `sitio.json › menu`.

## Señales de alarma: detenerse y avisar

- La vista previa deja de abrir o muestra un error
- `npm test` o `npm run build` fallan y no se entiende por qué
- La publicación falla dos veces seguidas
- Aparece un aviso de seguridad o de certificado
- Hay que escribir una contraseña o una clave para continuar

En todos estos casos: **no seguir intentando.** Explicar qué pasó, con qué palabras
contárselo al proveedor, y detenerse ahí.
