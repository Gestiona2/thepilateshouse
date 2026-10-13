# Marca: Aira, The Pilates House

Fuente: Brand Guide de AM Studio (2024). Los colores y tipografías **no se cambian** sin
pedido expreso del cliente.

## Paleta oficial

| Nombre | Hex | Uso |
|---|---|---|
| Marfil | `#F6F5E3` | Fondo base |
| Arena | `#E7DEB5` | Superficies suaves, fondo de fotos. **Nunca texto** |
| Taupe | `#B49F84` | Líneas y acentos decorativos. **Nunca texto** |
| Espresso | `#60554A` | Texto y bandas invertidas |
| Texto suave | `#6F6457` | Texto secundario (derivado del espresso) |

### Contrastes medidos (WCAG)
| Par | Razón | Resultado |
|---|---|---|
| Espresso sobre marfil | 6.59:1 | AA y AAA |
| Marfil sobre espresso | 6.59:1 | AA y AAA |
| Texto suave sobre marfil | 5.25:1 | AA |
| Espresso sobre arena | 5.36:1 | AA |
| Taupe sobre marfil | 2.32:1 | **No usar para texto** |
| Arena sobre marfil | 1.23:1 | **No usar para texto** |

Además se midió el contraste real de todo el texto renderizado en las 6 páginas a 390 y
1440 px: sin incumplimientos. **El sitio es solo de tema claro.**

## Tipografías
- **Almarose Thin (100):** titulares. **Solo desde 28 px**; por debajo no se lee.
- **Almarose Semibold (600):** texto corrido, etiquetas con minúsculas y UI pequeña.
- **Techno Nue Regular (400):** navegación y botones, en mayúsculas con tracking amplio.
  No usarla en frases con tildes a tamaño pequeño: sus acentos son diminutos.
- **Techno Nue Thin (100):** disponible, hoy sin uso.
Archivos en `public/fonts/` (woff2, subset latino). Nunca enlazar a servidores externos.

## Forma y logo
- **Fotos rectas, sin marco ni esquinas redondeadas.** Las de una cuadrícula miden lo mismo
  (cuadradas por defecto). Pedido del cliente el 13 de octubre de 2026; la versión con arcos
  quedó en la etiqueta `demo-v1-editorial` de Git.
- **Isotipo `. ‿ .`** como separador y favicon.
- Logos en `public/brand/`, recoloreados a espresso y marfil: `logo` (solo "aira"),
  `logo-casa` (con The Pilates House), `logo-eslogan` (con One breath at a time), `isotipo`.
  Tamaño mínimo del logo: 139 px de ancho (isotipo: 58 px).

## Tono de voz
1. "Redefinimos el bienestar: fusionamos serenidad y movimiento en un refugio de calma."
2. "Escríbenos cuando quieras: te respondemos con calma."
3. "Respira. Nosotros nos encargamos del resto."

## Estilo de imagen
Fotografía real del estudio: luz cálida, líneas curvas, tonos arena y crema. Sin filtros ni
superposiciones. Se recortan cuadradas (1:1) en cuadrículas y a 4:5 en la portada.
