# Soporte web teórico del TFI

Aplicación educativa que narra **cómo se construyó** el TFI *Concesionaria Multimarcas* en 5 etapas progresivas, usando fragmentos literales del código Java del repositorio.

## Qué contiene

- `src/data/tfiData.ts`: contenido completo. 5 etapas, 17 lecciones numeradas y los 14 ejes de la rúbrica.
- Cada lección tiene cuatro bloques: `problema`, `fundamentoTeorico`, `implementacionCodigo` y `decisionesYColoquio` (con eje, ponderación y dos escenarios de live coding).
- `src/data/types.ts`: contratos TypeScript del contenido.
- `src/App.tsx`: interfaz mínima de navegación; no hay enrutador ni dependencias extra.

## Requisitos

Node.js 18 o superior y npm. El proyecto usa Vite + React + TypeScript + Tailwind CSS v3, sin otras dependencias.

```bash
cd soporte-web-teorico
npm install
npm run dev
```

Para generar la versión de producción:

```bash
npm run build
npm run preview
```

## Límites

Esta carpeta es material de apoyo: **no modifica ni mueve ningún archivo `.java`** del repositorio. Los fragmentos son copias del commit base `293ba9c`; si el Java cambia, hay que actualizar `tfiData.ts` y el UML.

Las ponderaciones son las de la rúbrica oficial y **no se suman entre lecciones**: varias lecciones cubren el mismo criterio.
