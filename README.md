# Soporte web teórico del TFI

Aplicación educativa de **un solo archivo** que narra cómo se construyó el TFI *Concesionaria Multimarcas* en 5 etapas progresivas, usando fragmentos literales del código Java del repositorio.

## Cómo abrirla

No hay dependencias, build ni instalación. Abrí `index.html` con doble clic en cualquier navegador moderno.

Si preferís servirla por HTTP:

```bash
cd soporte-web-teorico
python -m http.server 8765
```

Después entrá a `http://localhost:8765/`.

## Qué contiene `index.html`

- Tema oscuro, tipografía monoespaciada para etiquetas y código.
- **Roadmap de Construcción**: acordeón con las 5 etapas y sus lecciones en orden.
- **Índice de Lecciones**: 17 tarjetas con resumen, archivos `.java`, peso de rúbrica y botón «Estudiar paso →».
- **Vista de lección**: los 4 bloques (`problema`, `fundamentoTeorico`, `implementacionCodigo`, `decisionesYColoquio`), visor de código con resaltado propio, botón de copia y panel desplegable de live coding.
- **Mapa Visual de Capas**: SVG interactivo con Diseño → Servicio → Modelo ↔ Persistencia.
- Navegación por `hash` (`#/leccion/leccion-01`, `#/arquitectura`), sin enrutador ni librerías.

## Origen de los datos

El objeto `datosTFI` está incrustado al principio del archivo. Es una copia del contenido que estaba en `src/data/tfiData.ts` sobre el commit base `293ba9c`. Los 51 fragmentos Java son literales; las elipsis (`...`) marcan saltos de JavaDoc.

Si cambiara el código Java del TFI, actualizá el objeto `datosTFI` dentro de este mismo HTML.

## Límites

Este archivo es material de apoyo: **no modifica ni mueve ningún `.java`** del repositorio. Las ponderaciones son las de la rúbrica oficial y **no se suman entre lecciones**: varias lecciones cubren el mismo criterio.
