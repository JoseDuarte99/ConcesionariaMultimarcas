---
applyTo: "**/*.java"
---

# Estilo Java para el TFI

- Escribí identificadores en español, descriptivos y consistentes con el dominio. Usá `PascalCase` para clases/interfaces/enums, `camelCase` para métodos y variables, paquetes en minúsculas y constantes en `UPPER_SNAKE_CASE`. Conservá los nombres exigidos por el enunciado y los nombres estándar de la API de Java.
- Usá Java 21 como versión objetivo del proyecto, sin features posteriores ni dependencias externas no autorizadas.
- Aplicá encapsulamiento POJO/JavaBean: atributos `private`, constructores coherentes, getters y setters cuando correspondan. Los setters deben validar y preservar invariantes; no expongas el estado mutable interno sin protección. No agregues setters a valores inmutables solo por automatismo.
- Convierte entradas usando clases Wrapper (`Integer`, `Double`, etc.) y sus métodos de parseo/conversión. Valida formato y rango; traduce fallos relevantes a mensajes de Diseño o excepciones de dominio, sin valores predeterminados silenciosos.
- Implementá validaciones de negocio con excepciones personalizadas específicas. No imprimas ni solicites datos desde modelo, servicio o persistencia; no uses `Scanner` o `System.out` fuera de Diseño.
- Sobrescribí `equals(Object)` con la firma correcta y `@Override`. Mantené su contrato (reflexividad, simetría, transitividad, consistencia y comparación con `null`) y hacé que `hashCode()` use los mismos campos de igualdad. Evitá campos mutables en igualdad si los objetos se usan como claves de `Map` o miembros de `Set`.
- Sobrescribí `toString()` con una representación útil para diagnóstico; no lo uses como formato de persistencia ni incluyas información sensible.
- Tipá colecciones y contratos genéricos explícitamente; preferí declarar variables mediante interfaces como `List<T>` y `Map<K, V>`. Evitá raw types y casts no comprobados.
- Documentá clases, interfaces, enums y métodos públicos con JavaDoc que describa propósito, parámetros, retorno y excepciones cuando aplique. Comentá decisiones o invariantes no evidentes, no cada línea.
- Conservá responsabilidades de capa: consola en Diseño; reglas en modelo/servicio; acceso a archivos o JDBC en persistencia. Mantené el UML y la documentación alineados con el código.
