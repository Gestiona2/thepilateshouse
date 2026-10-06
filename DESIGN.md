# Diseño: Aira

## Color (paleta oficial, Brand Guide 1.6)
- Marfil `#F6F5E3`: fondo base.
- Arena `#E7DEB5`: superficies suaves y fondos de foto (nunca texto).
- Taupe `#B49F84`: líneas y acentos decorativos (nunca texto).
- Espresso `#60554A`: texto y bandas invertidas (marfil sobre espresso 6.6:1).
- Texto secundario `#6F6457` (5.3:1 sobre marfil).
Estrategia: restringida con bandas espresso comprometidas (cita, esencia, pasos, cierres, pie). Tema solo claro.

## Tipografía
- Almarose Thin (100): titulares, siempre desde 28 px.
- Almarose Semibold (600): texto corrido y UI pequeña.
- Techno Nue Regular (400): navegación, botones y etiquetas cortas, en versalitas con tracking amplio. Techno Nue Thin solo si hace falta un display.
Escala fluida con `clamp()`, pasos de razón mayor a 1.25.

## Forma
- Motivo: arco (radio total arriba, base recta). Fotos y planes se recortan en arco.
- Isotipo `. ‿ .` como separador.
- Botones en pastilla, contorno o sólido.

## Movimiento
Una secuencia de entrada en la portada y apariciones sutiles (14 a 26 px, ease-out) en piezas mayores. Parallax de ±28 px en una sola foto. Todo se apaga con `prefers-reduced-motion`. Contenido visible sin JS.

## Prohibido en este sitio
Dorados, gradientes decorativos, sombras pesadas, cortina `clip-path`, tarjetas idénticas anidadas, rayas laterales de color, guiones largos en el copy, etiquetas en mayúsculas sobre cada título.
