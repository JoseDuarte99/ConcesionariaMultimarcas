Revisá todo el contenido de la carpeta `material_catedra/` (apuntes de clase y ejemplos de código), la subcarpeta `material_catedra/consignas_tfi/` (la guía de uso de IAG y el enunciado del Trabajo Final Integrador) y el curso completo disponible en `https://facundouferer.ar/cursos/java/`.

Para el sitio web, primero accedé a la URL principal `https://facundouferer.ar/cursos/java/` para obtener el índice completo de lecciones/unidades y luego recorré cada enlace del temario de Java.

Necesito que identifiques con precisión:
- Qué versión de Java/JDK se utiliza en la cátedra. Preferiblemente utilizar la version 21.
- Qué estructuras de datos, colecciones, manejo de excepciones y conceptos de POO se enseñaron.
- Qué mecanismo de persistencia se utiliza (Archivos I/O binarios/texto o JDBC con SQL) y qué librerías están permitidas (prohibiendo cualquier librería externa como Lombok, Jackson o Gson que no esté explícitamente en el material).

Con base en ese relevamiento y en los 14 ejes técnicos y la rúbrica del TFI, generá los siguientes archivos en el proyecto:

1. `.github/copilot-instructions.md`:
   - Inventario estricto de herramientas, sintaxis de Java y temas permitidos vs. prohibidos según lo visto en clase.
   - Arquitectura obligatoria en capas con separación estricta entre `Diseño` (consola/vista) y `Negocio` (servicio/modelo/persistencia).
   - Reglas del dominio Concesionaria Multimarcas: jerarquía con clase abstracta `Vehiculo` y subclases `Auto`, `Camioneta` y `Motocicleta`; atributos obligatorios (Marca, Modelo, Año, Color, Tipo de Carrocería / Estilo de Motocicleta y valores comerciales); distinción entre unidades Nuevas (0 Km) y Usadas (con kilometraje); uso obligatorio de `Enums`, `Interfaces`, `Excepciones Propias`, `Generics`, `Wrappers`, `Colecciones` (`List`/`Map`), persistencia y `JavaDoc`.

2. `AGENTS.md`:
   - Configurá tu rol como copiloto socrático de estudio.
   - Regla obligatoria: nunca generes clases completas de una sola vez sin explicar antes el diseño y qué concepto de la cátedra se aplica en cada bloque.
   - Respetá un desarrollo incremental (primero modelo y excepciones, luego genéricos, persistencia y servicio, y por último interfaz de consola).
   - Prohibición absoluta de incluir `Scanner` o `System.out` dentro de las capas de `modelo`, `servicio` o `persistencia`.

3. `.github/instructions/java-tfi.instructions.md`:
   - Con cabecera YAML `applyTo: "**/*.java"`.
   - Reglas de estilo y calidad: convenciones de nombrado en español, encapsulamiento POJO/JavaBean (atributos privados, getters/setters), sobrescritura correcta de `equals()`, `hashCode()` y `toString()`, uso de clases Wrapper para parseo y validaciones de negocio con excepciones personalizadas.

4. `.github/prompts/simular-coloquio.prompt.md`:
   - Prompt reutilizable que analice mis clases actuales en `src/` y me haga 3 preguntas de defensa oral sobre decisiones de diseño y arquitectura, más 1 consigna práctica de modificación en vivo (*live coding*) para resolver en menos de 5 minutos.

5. `.github/prompts/auditar-rubrica.prompt.md`:
   - Prompt reutilizable que audite el proyecto completo contra los 14 ejes técnicos y las ponderaciones de la rúbrica oficial del TFI (Persistencia 15%, Arquitectura 10%, POO/Polimorfismo 10%, Interfaces/Enums 10%, Excepciones 10%, Colecciones 10%, Genéricos 10%, Consola 10%, UML 5%, POJO/Wrappers 5%, JavaDoc 5%), señalando cualquier faltante o acoplamiento indebido.