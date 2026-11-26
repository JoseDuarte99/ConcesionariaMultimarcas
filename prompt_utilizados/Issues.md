Creá los siguientes 4 Issues en este repositorio para organizar las Fases 1 y 2 de nuestro Trabajo Final Integrador (Sistema de Gestión de Concesionaria Multimarcas en Java 21), respetando la arquitectura en capas (Diseño vs. Negocio):

1. **Título:** `[Fase 1] Estructura de paquetes, Enums de dominio e Interfaz de comportamiento`
   - **Asignado a:** `@antonelladluque`
   - **Descripción:**
     Definir la arquitectura base del proyecto y los contratos iniciales del dominio.
     **Criterios de aceptación:**
     - [ ] Crear paquetes `modelo`, `excepciones`, `persistencia`, `servicio` y `vista` dentro de `src/`.
     - [ ] Implementar los enumerativos `TipoVehiculo` (`AUTO`, `CAMIONETA`, `MOTOCICLETA`) y `CondicionVehiculo` (`NUEVO`, `USADO`).
     - [ ] Definir la interfaz de comportamiento (`Cotizable` / `Vendible`) con métodos para cálculo de valor comercial.
     - [ ] Agregar documentación JavaDoc inicial.

2. **Título:** `[Fase 1] Clase abstracta Vehiculo, subclases y boceto de Diagrama UML`
   - **Asignado a:** `@joseduarte99`
   - **Descripción:**
     Modelar la jerarquía principal de entidades aplicando encapsulamiento POJO/JavaBean, herencia y polimorfismo.
     **Criterios de aceptación:**
     - [ ] Crear clase abstracta `Vehiculo` con atributos privados (`id`/patente, marca, modelo, año, color, condicion, kilometraje, valorComercial), constructores y getters/setters.
     - [ ] Implementar subclases `Auto`, `Camioneta` (con tipo de carrocería) y `Motocicleta` (con estilo de motocicleta), sobrescribiendo métodos polimórficos e implementando la interfaz del dominio.
     - [ ] Subir un boceto inicial del Diagrama de Clases UML coherente con esta jerarquía.

3. **Título:** `[Fase 2] Excepciones personalizadas y validaciones de estado del dominio`
   - **Asignado a:** `@antonelladluque`
   - **Descripción:**
     Implementar el manejo de errores propios del negocio para evitar estados inválidos en las entidades.
     **Criterios de aceptación:**
     - [ ] Crear `VehiculoNoEncontradoException`, `DatoVehiculoInvalidoException` y `VehiculoDuplicadoException` en el paquete `excepciones`.
     - [ ] Validar reglas básicas en constructores/setters (ej. impedir kilometraje > 0 en unidades `NUEVO` o valores comerciales negativos).
     - [ ] Documentar con `@throws` en JavaDoc.

4. **Título:** `[Fase 2] Sobrescritura de equals, hashCode y toString + pruebas de Colecciones`
   - **Asignado a:** `@joseduarte99`
   - **Descripción:**
     Garantizar la identidad única de los vehículos dentro de estructuras `List` y `Map`.
     **Criterios de aceptación:**
     - [ ] Sobrescribir `equals()` y `hashCode()` en `Vehiculo` basados en su identificador único (patente/código).
     - [ ] Sobrescribir `toString()` en `Vehiculo` y sus subclases para mostrar la ficha técnica completa.
     - [ ] Verificar mediante una clase de prueba temporal que `List` y `Map` detecten duplicados correctamente y disparen las excepciones creadas.




# ---------------------------------------------------------------------------------------------------------------------



Creá los siguientes 8 Issues en este repositorio para completar la planificación de las Fases 3, 4, 5 y 6 de nuestro Trabajo Final Integrador (Sistema de Gestión de Concesionaria Multimarcas en Java 21), respetando la arquitectura en capas (Diseño vs. Negocio) y la rúbrica oficial:

1. **Título:** `[Fase 3] Repositorio Genérico y Capa de Persistencia de Datos`
   - **Asignado a:** `@antonelladluque`
   - **Descripción:**
     Implementar el almacenamiento permanente del stock de vehículos utilizando tipos genéricos parametrizados.
     **Criterios de aceptación:**
     - [ ] Crear la interfaz y/o clase `RepositorioGenerico<T, ID>` en el paquete `persistencia` con operaciones CRUD básicas (`guardar`, `buscarPorId`, `listarTodos`, `eliminar`).
     - [ ] Implementar la persistencia real en Archivos I/O (usando rutas relativas dentro del proyecto, ej. `data/stock.dat`) o BD SQL con JDBC (incluyendo script `.sql`).
     - [ ] Verificar que los datos persistan correctamente al cerrar y volver a ejecutar la aplicación, sin mezclar lógica de consola (`System.out` / `Scanner`).

2. **Título:** `[Fase 3] Capa de Servicio y Reglas de Negocio (ConcesionariaService)`
   - **Asignado a:** `@joseduarte99`
   - **Descripción:**
     Centralizar toda la lógica de negocio y gestión de colecciones en la capa `servicio`, totalmente desacoplada de la interfaz de usuario.
     **Criterios de aceptación:**
     - [ ] Implementar `ConcesionariaService` operando sobre `List` y `Map` junto con el repositorio genérico.
     - [ ] Programar altas, bajas, modificaciones de valor comercial/kilometraje y consultas filtradas (por marca, condición `NUEVO`/`USADO`, tipo de vehículo y rango de precios).
     - [ ] Validar reglas de dominio lanzando las excepciones personalizadas (`VehiculoDuplicadoException`, `VehiculoNoEncontradoException`, `DatoVehiculoInvalidoException`).
     - [ ] Garantizar cero uso de `Scanner` o `System.out` dentro del paquete `servicio`.

3. **Título:** `[Fase 4] Menú Principal de Consola y Alta/Modificación de Vehículos (Data-Entry)`
   - **Asignado a:** `@antonelladluque`
   - **Descripción:**
     Construir el punto de entrada de la aplicación (`Main`) y los flujos interactivos de carga y edición en el paquete `vista`.
     **Criterios de aceptación:**
     - [ ] Implementar el menú principal interactivo con navegación continua y mensajes claros al usuario.
     - [ ] Programar los formularios por consola para registrar y editar `Auto`, `Camioneta` y `Motocicleta` (solicitando marca, modelo, año, color, condición `0 Km`/`Usado`, kilometraje, tipo de carrocería/estilo y valor comercial).
     - [ ] Parsear las entradas numéricas utilizando clases Wrapper (`Integer.parseInt()`, `Double.parseDouble()`) y capturar tanto `NumberFormatException` como excepciones propias sin que el programa colapse.

4. **Título:** `[Fase 4] Submenús de Consultas, Filtros, Bajas y Listados Formateados`
   - **Asignado a:** `@joseduarte99`
   - **Descripción:**
     Completar la capa de presentación con las opciones de visualización, búsqueda y eliminación de unidades del stock.
     **Criterios de aceptación:**
     - [ ] Implementar en `vista` las opciones para listar el stock completo y filtrar unidades por marca, condición (`NUEVO`/`USADO`), tipo de vehículo o rango de valores comerciales.
     - [ ] Programar el flujo de baja de vehículos por identificador único con confirmación y captura limpia de `VehiculoNoEncontradoException`.
     - [ ] Formatear la salida por consola aprovechando el polimorfismo y `toString()` de las entidades, delegando toda operación lógica a `ConcesionariaService`.

5. **Título:** `[Fase 5] Documentación JavaDoc (Modelo, Excepciones, Persistencia) y Diagrama UML Final`
   - **Asignado a:** `@antonelladluque`
   - **Descripción:**
     Documentar el núcleo del sistema y alinear la representación gráfica con el código fuente definitivo.
     **Criterios de aceptación:**
     - [ ] Agregar comentarios `JavaDoc` estructurados (`@param`, `@return`, `@throws`) en todas las clases, interfaces y métodos clave de `modelo`, `excepciones` y `persistencia`.
     - [ ] Actualizar el Diagrama de Clases UML para que coincida al 100% con los nombres de paquetes, clases, atributos, herencia, interfaces y relaciones implementadas.

6. **Título:** `[Fase 5] Documentación JavaDoc (Servicio, Vista), Consolidación de Bitácora IAG y Armado de Entrega`
   - **Asignado a:** `@joseduarte99`
   - **Descripción:**
     Completar la documentación técnica restante, cerrar el informe obligatorio de IAG y preparar el paquete de entrega para CV FRRe.
     **Criterios de aceptación:**
     - [ ] Agregar comentarios `JavaDoc` completos en `servicio` y `vista`.
     - [ ] Consolidar `bitacora_de_uso_de_iag_tfi.md` verificando que estén completos los datos de ambos integrantes, al menos un caso real de error/alucinación documentado por cada uno y la valoración crítica final.
     - [ ] Verificar compilación limpia, excluir archivos temporales/de configuración innecesarios y armar el archivo comprimido (`.zip` / `.rar`) listo para subir al Campus Virtual.

7. **Título:** `[Fase 6] Auditoría Integral contra Rúbrica y Revisión Cruzada (@antonelladluque)`
   - **Asignado a:** `@antonelladluque`
   - **Descripción:**
     Validar el cumplimiento técnico del proyecto completo y preparar la defensa individual del coloquio.
     **Criterios de aceptación:**
     - [ ] Ejecutar `/auditar-rubrica` en OpenCode Desktop y corregir cualquier observación pendiente en los 14 ejes técnicos.
     - [ ] Revisar en detalle las clases implementadas por `@joseduarte99` y resolver un simulacro de modificación en vivo (*live coding*) en menos de 5 minutos (ej. agregar atributo o filtro nuevo).

8. **Título:** `[Fase 6] Simulacro de Coloquio Oral y Práctica de Live Coding (@joseduarte99)`
   - **Asignado a:** `@joseduarte99`
   - **Descripción:**
     Entrenar la defensa oral del código fuente y la capacidad de adaptación en tiempo real exigidas para aprobar el coloquio.
     **Criterios de aceptación:**
     - [ ] Ejecutar `/simular-coloquio` en OpenCode Desktop sobre todo el directorio `src/` y responder las preguntas de arquitectura y POO.
     - [ ] Revisar en detalle las clases implementadas por `@antonelladluque` y resolver un simulacro de modificación en vivo (*live coding*) en menos de 5 minutos (ej. agregar validación personalizada o ajustar persistencia).