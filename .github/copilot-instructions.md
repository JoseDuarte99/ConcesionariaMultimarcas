# Instrucciones del proyecto: TFI Concesionaria Multimarcas

## Contexto y versión de Java

- El TFI 2026 no fija una versión de JDK. Las presentaciones de cátedra son material de distintas épocas (por ejemplo, explican Generics desde Java 5) y no demuestran que la cátedra use hoy una versión concreta.
- Para este proyecto, usar **JDK 21** como versión objetivo, de acuerdo con la preferencia del estudiante y con la referencia del curso web a Java 21+. No afirmar que esa sea la versión oficialmente adoptada por la cátedra.
- Escribir Java estándar, portable y compatible con el nivel del TFI. No usar funciones de versiones posteriores a 21 ni funciones experimentales o preview.

## Herramientas, APIs y dependencias

- Herramientas de desarrollo y entrega cubiertas: IDE, `javac`, `java`, `javadoc` y empaquetado JAR. Mantener el proyecto compilable con el JDK 21.
- Usar exclusivamente APIs incluidas en el JDK: en particular `java.lang`, `java.util`, `java.io` y `java.nio.file`. La API `java.sql` solo corresponde si se elige la alternativa JDBC autorizada por el enunciado.
- La persistencia preferida para este TFI es **archivos**: I/O de texto o binario visto en las presentaciones (lectores/escritores con buffer y streams de objetos/`Serializable`). `Files`/`Path` también aparece en el curso web.
- El enunciado admite archivos o BD SQL y la guía menciona JDBC. JDBC es una alternativa, no una exigencia de la cátedra; usar `PreparedStatement`, cerrar recursos y separar el DAO si se elige. No agregar un driver, pool u otra dependencia externa sin autorización expresa del estudiante/docente.
- No agregar bibliotecas, frameworks, plugins de generación de código ni dependencias de terceros por iniciativa propia. En particular, no usar Lombok, Jackson, Gson, Spring, Hibernate, HikariCP ni bibliotecas equivalentes como dependencias del TFI. Que una tecnología aparezca nombrada como contexto en el curso web no significa que esté autorizada como dependencia del proyecto.
- No introducir Maven/Gradle, pruebas o herramientas adicionales si no están configuradas o no se solicitan. No descargar dependencias automáticamente.

## Temario aplicable

### Permitido y requerido

- Sintaxis estructurada: tipos primitivos y referencias, operadores, `if`/`switch`, `for`/`while`, métodos, arrays cuando sean pertinentes, paquetes e imports.
- POO: clases y objetos, constructores, `this`/`super`, encapsulamiento, abstracción, composición, herencia simple, clases abstractas, polimorfismo, sobrecarga y sobrescritura con `@Override`.
- Interfaces, `enum`, excepciones estándar y excepciones propias; `try`/`catch`/`finally` y cierre correcto de recursos.
- Clases Wrapper (`Integer`, `Double`, etc.) para conversión y parseo, con validación de errores como `NumberFormatException`.
- Java Collections Framework con tipos parametrizados: como mínimo `List`/`ArrayList` y `Map`/`HashMap`. Implementar y usar clases o métodos genéricos propios cuando corresponda.
- `equals(Object)`, `hashCode()` y `toString()` correctos; iteración y ordenamiento solo cuando los requiera una función del sistema.
- Persistencia con las alternativas admitidas arriba, y documentación JavaDoc del código público y de las decisiones no obvias.
- El curso web recorre además arrays, Strings, `Set`, `Queue`/`Deque`, `Iterator`, `Comparable`/`Comparator`, TAD de listas/pilas/colas/árboles/grafos, algoritmia, concurrencia y JDBC. Son contenidos de estudio, no requisitos automáticos del TFI: incorporarlos solo si resuelven un requisito concreto y se pueden defender en el coloquio.

### Fuera de alcance por defecto

- Features no enseñadas o innecesarias para el TFI: reflexión, anotaciones de generación automática, módulos, APIs externas, frameworks, ORM, serializadores JSON de terceros, concurrencia/hilos, streams funcionales o estructuras de datos propias complejas.
- No sustituir el modelo POJO/JavaBean requerido por `record`, ni omitir getters/setters o encapsulamiento por usar sintaxis abreviada.
- No añadir capas, patrones, funcionalidades o dependencias que no estén justificadas por un requisito del TFI. Si una petición requiere algo de esta lista, explicar el desvío y pedir autorización antes de introducirlo.

## Arquitectura obligatoria: Diseño vs. Negocio

Separar el código en paquetes/capas con responsabilidades claras:

- **Diseño (presentación/consola):** punto de entrada, menú, captura y validación sintáctica de datos, conversión inicial de entradas y mensajes. Aquí se permite `Scanner` y `System.out`/`System.err`.
- **Negocio:** servicios que coordinan casos de uso y reglas del dominio; modelo con entidades, estado e invariantes; persistencia/repositorios/DAO que leen y escriben datos.
- El flujo de dependencias va desde Diseño hacia servicios y contratos de persistencia. El modelo no depende de la consola. Los servicios no leen ni muestran datos por consola. La persistencia no solicita datos al usuario ni imprime resultados.
- Prohibido incluir `Scanner`, `System.out` o interacción de consola en `modelo`, `servicio` o `persistencia`. Informar fallos mediante excepciones/valores de retorno acordados; la capa Diseño decide cómo comunicarlos.
- Mantener SQL o detalles de archivos en persistencia, no en la vista ni mezclados con reglas de negocio. El servicio depende de interfaces/contratos cuando corresponda, no de detalles de presentación.

## Dominio obligatorio

- Modelar una clase abstracta `Vehiculo` y las subclases concretas `Auto`, `Camioneta` y `Motocicleta`. Compartir en la base los atributos comunes y sobrescribir comportamiento polimórfico cuando aporte al dominio.
- Atributos comunes exigidos: marca, modelo, año, color y valor(es) comercial(es) indicados por el enunciado. No inventar campos comerciales adicionales sin necesidad o confirmación.
- `Auto` y `Camioneta` deben registrar el tipo de carrocería; `Motocicleta`, su estilo. Representar categorías cerradas con `enum` donde corresponda.
- Distinguir unidades **nuevas (0 km)** de **usadas (con kilometraje)** con un estado de dominio explícito, por ejemplo `EstadoVehiculo`. Validar que el kilometraje sea coherente con el estado: nuevo = 0; usado = valor recorrido válido. No guardar datos contradictorios.
- Aplicar `enum` para estados, tipos y categorías finitas del dominio; no sustituirlos por números mágicos ni cadenas libres.
- Definir al menos una interfaz de comportamiento con una responsabilidad real y aplicarla desde las clases apropiadas. No crear interfaces vacías solo para cumplir una lista.
- Crear excepciones propias para errores recuperables del dominio, validarlas en el modelo/servicio y propagarlas hasta Diseño para su presentación.
- Usar genéricos de manera segura, por ejemplo un contrato/repositorio genérico parametrizado cuando el diseño lo justifique. Administrar el stock con colecciones tipadas `List<Vehiculo>` y `Map<K, V>` donde la clave tenga identidad estable y documentada.
- Incluir Wrapper y conversión de texto en la entrada de consola; no usar conversiones sin validar. Los campos del dominio deben conservar el tipo más adecuado, sin envolver todos los primitivos artificialmente.
- Mantener el diagrama UML actualizado con las clases, herencias, interfaces y relaciones implementadas.
- Documentar las clases, interfaces, enums, excepciones y operaciones públicas con JavaDoc útil. No generar comentarios que repitan literalmente el código.

## Calidad y verificación

- Usar nombres en español y convenciones Java: tipos en `PascalCase`, métodos/variables en `camelCase`, paquetes en minúsculas y constantes en `UPPER_SNAKE_CASE`.
- Encapsular atributos (`private`) y validar invariantes en constructores y operaciones de negocio. No aceptar estados inválidos silenciosamente.
- Al sobrescribir `equals`, usar la firma `equals(Object)` y `@Override`; mantener coherencia con `hashCode` usando los mismos campos de igualdad. Implementar `toString()` legible, sin datos sensibles.
- Probar casos válidos, límites, entradas inválidas y persistencia entre ejecuciones. No ocultar fallos con `catch` vacío, valores centinela ambiguos ni mensajes de éxito falsos.
- Toda propuesta debe ser explicable por el estudiante y mantenerse dentro de los 14 ejes del TFI y de su rúbrica. Antes de cambios extensos, explicar el diseño y los conceptos de cátedra aplicados.
