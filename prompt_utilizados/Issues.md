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