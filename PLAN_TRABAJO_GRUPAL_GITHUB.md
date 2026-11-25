# Plan de trabajo grupal y flujo GitHub

## Objetivo

Organizar el TFI de Concesionaria Multimarcas entre tres integrantes, dejando evidencia verificable de la participación individual mediante ramas y Pull Requests (PRs), y apuntar al cumplimiento de todos los requisitos técnicos y de la rúbrica.

> La rúbrica suma 100 puntos porcentuales. Este plan distribuye el trabajo en tercios iguales (33⅓ puntos ponderados por integrante) como mecanismo de organización y evidencia; no garantiza una calificación oficial. La evaluación final corresponde a la cátedra.

## 1. Preparación del grupo y repositorio

1. Acordar quiénes son **Integrante A**, **Integrante B** e **Integrante C**, registrar sus usuarios de GitHub y trabajar cada uno desde su propia cuenta.
2. Elegir el modo de colaboración:
   - **Repositorio compartido (recomendado):** el dueño agrega a los otros dos como colaboradores. Cada integrante crea su propia rama desde `main` y abre un PR hacia `main`. No hace falta crear tres forks.
   - **Forks (solo si lo exige la consigna o no tienen permisos):** cada integrante crea un fork del repositorio original. Su rama parte de la rama `main` del fork y el PR se abre contra `main` del repositorio original. Configurar el repositorio original como remoto `upstream`.
3. En GitHub, proteger `main`: deshabilitar pushes directos, exigir PR para integrar, al menos una aprobación de otro integrante y resolución de comentarios. No permitir que el autor apruebe su propio PR.
4. Crear un GitHub Project o tablero con las tareas de este plan. Cada tarea debe tener responsable, entregable, criterios de aceptación y su parte de rúbrica.
5. Configurar el proyecto con **JDK 21**. Es una elección para este proyecto; el TFI no especifica una versión oficial de JDK.
6. Usar únicamente APIs del JDK y contenidos pertinentes al TFI. Preferir persistencia con archivos de texto/binarios; JDBC es la alternativa prevista por el enunciado, pero no agregar drivers ni librerías de terceros sin autorización expresa.

## 2. Reparto equilibrado de la rúbrica

Los 11 criterios ponderados se dividen en tres partes con valor equivalente. Cada integrante entrega evidencia propia correspondiente a aproximadamente un tercio de cada criterio; la suma planificada por PR es **100/3 = 33⅓ puntos ponderados**. No se mide por líneas de código, cantidad de commits ni tamaño de archivos.

| Criterio oficial | Peso | Integrante A: diseño/contratos | Integrante B: implementación | Integrante C: integración/verificación |
|---|---:|---|---|---|
| Persistencia de datos (archivos / BD SQL) | 15% | 5 puntos: formato, ruta y contrato de lectura/escritura | 5 puntos: guardar y cargar el stock | 5 puntos: pruebas de persistencia entre ejecuciones y casos de error |
| Arquitectura “Diseño vs. Negocio” | 10% | 3⅓: paquetes, límites y contratos entre capas | 3⅓: servicio y persistencia sin lógica de vista | 3⅓: integración de consola y revisión de acoplamientos |
| Herencia, clases abstractas y polimorfismo | 10% | 3⅓: `Vehiculo` abstracta y estado común | 3⅓: `Auto`, `Camioneta`, `Motocicleta` y sobrescrituras | 3⅓: uso polimórfico en casos de uso y pruebas |
| Interfaces y tipos enumerativos (Enums) | 10% | 3⅓: contratos de interfaz y enums de dominio | 3⅓: implementación en entidades/servicios | 3⅓: integración, validación y evidencia de uso |
| Tratamiento de excepciones propias | 10% | 3⅓: diseñar excepciones específicas e invariantes | 3⅓: lanzarlas desde el modelo/servicio/persistencia | 3⅓: manejarlas en Diseño y probar casos inválidos |
| Colecciones y sobrescritura de métodos | 10% | 3⅓: decidir identidad y estructura `List`/`Map` | 3⅓: operaciones tipadas de stock | 3⅓: contrato `equals`/`hashCode`/`toString` y pruebas de colecciones |
| Uso de genéricos | 10% | 3⅓: contrato genérico y tipos requeridos | 3⅓: implementación parametrizada | 3⅓: integración sin raw types ni casts inseguros |
| Interfaz de consola y data-entry | 10% | 3⅓: flujo de menú y validaciones requeridas | 3⅓: captura/conversión en la capa Diseño | 3⅓: navegación, mensajes y pruebas de entradas inválidas |
| Diagrama de clases UML | 5% | 1⅔: diagrama inicial de dominio y relaciones | 1⅔: actualización según clases implementadas | 1⅔: revisión final de correspondencia código-UML |
| Modelado POJO/JavaBean y Wrappers | 5% | 1⅔: campos privados y contrato JavaBean | 1⅔: constructores/accesores y parseo con Wrappers | 1⅔: validaciones e invariantes comprobados |
| Documentación y calidad de código (incluye JavaDoc) | 5% | 1⅔: JavaDoc de contratos/modelo | 1⅔: JavaDoc de servicios/persistencia | 1⅔: revisión de formato, documentación y consistencia |
| **Total planificado por integrante** | **100%** | **33⅓ puntos** | **33⅓ puntos** | **33⅓ puntos** |

### Regla de trazabilidad

- Antes de empezar, registrar en el tablero subtareas concretas para cada tercio. No se adjudica el tercio solo por diseñar o revisar: el PR debe incluir cambios comprobables y su evidencia (código, pruebas, documentación o diagrama, según la subtarea).
- En la descripción del PR, cada integrante lista sus subtareas y puntos ponderados. Los tres integrantes confirman que los entregables están repartidos sin duplicar ni dejar criterios sin responsable.
- Cada PR debe recibir una revisión técnica de uno de los otros integrantes. Las revisiones no reemplazan el trabajo propio ni se cuentan como código ajeno.

## 3. Secuencia incremental de desarrollo

Los PRs se integran de manera secuencial para que cada rama nazca del `main` actualizado y reduzca conflictos. Las subtareas de los tres integrantes pueden planificarse en paralelo, pero los cambios dependientes se integran en este orden:

### PR 1 — Integrante A: modelo y contratos iniciales

- Acordar invariantes de vehículos, atributos comunes y valores comerciales que indica el enunciado.
- Implementar incrementalmente `Vehiculo` abstracta, subclases, enums, interfaces y excepciones propias.
- Definir paquetes/capas, contratos necesarios, identidad para colecciones y UML inicial.
- Incluir las subtareas asignadas a A en los criterios de persistencia, servicio/consola, Wrapper, documentación y calidad, aunque algunas sean contratos y no la integración final.
- **Aceptación:** compila con JDK 21; no hay `Scanner` ni `System.out` en modelo/servicio/persistencia; los constructores y mutadores preservan invariantes.

### PR 2 — Integrante B: genéricos, persistencia y servicios

- Crear la rama desde el `main` que ya contiene el PR 1.
- Implementar los contratos genéricos y la persistencia elegida. Para archivos, cubrir guardar/cargar, recursos cerrados y errores informados; comprobar datos tras reiniciar la aplicación.
- Implementar servicios/casos de uso y colecciones tipadas `List`/`Map`.
- Completar los tercios asignados a B de POO, interfaces/enums, excepciones, consola, POJO/Wrappers, UML y JavaDoc.
- **Aceptación:** servicio separado de consola y acceso a datos; errores no se silencian; persistencia y tipos genéricos comprobables.

### PR 3 — Integrante C: consola, integración y verificación

- Crear la rama desde el `main` actualizado luego del PR 2.
- Completar el menú y data-entry en Diseño, usar Wrappers para parseo y presentar errores de negocio con mensajes claros.
- Completar los tercios de C de todos los criterios, integrar pruebas de casos normales/límite/errores, verificar UML contra código y revisar JavaDoc.
- **Aceptación:** navegación de consola robusta, código y documentos integrados, persistencia probada entre ejecuciones y reporte de auditoría sin faltantes no explicados.

> El reparto anterior indica el orden de integración, no habilita a generar clases enteras sin explicación. Cada entrega debe desarrollarse por bloques y explicar qué concepto de la cátedra aplica.

## 4. Procedimiento de ramas y Pull Requests

### Repositorio compartido

Cada integrante usa una rama individual con nombre identificable, por ejemplo `feature/<usuario>-modelo`, `feature/<usuario>-persistencia` y `feature/<usuario>-consola`. Antes de crearla y antes de abrir el PR:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/<usuario>-<tarea>
```

Realizar commits propios, pequeños y descriptivos. Publicar la rama y abrir el PR:

```bash
git add <archivos-de-la-tarea>
git commit -m "Implementa <tarea concreta>"
git push -u origin feature/<usuario>-<tarea>
```

En GitHub: base `main`, compare la rama individual. El PR debe incluir:

- objetivo y alcance;
- lista de tareas y porcentaje/puntos ponderados asignados;
- archivos y responsabilidades de capa modificados;
- pruebas ejecutadas y resultado real;
- capturas/salida solo si aportan evidencia de consola;
- criterios de aceptación completados y pendientes;
- posibles riesgos o cambios de UML/documentación.

Solicitar revisión a otro integrante. Corregir observaciones en la misma rama y esperar aprobación antes de integrar. Usar **Squash and merge** o **Merge commit** según acuerde el grupo; preservar el autor real del PR y los commits. No reescribir autores ni crear commits artificiales para aparentar participación.

### Si se trabaja con forks

Usar remotos separados (`origin` para el fork personal, `upstream` para el repositorio del grupo/docente). Actualizar la rama desde el `main` del repositorio original antes de crear cada rama:

```bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
git switch -c feature/<usuario>-<tarea>
```

El PR se abre desde `origin:feature/<usuario>-<tarea>` hacia `upstream:main`. No abrir PRs entre forks de integrantes si el destino de entrega es el repositorio original.

### Acuerdos de integración

- Integrar un PR aprobado antes de crear la siguiente rama dependiente.
- Si dos ramas necesitan cambios simultáneos, coordinar archivos y contratos; actualizar la rama posterior desde `main` y resolver conflictos con su autor.
- No subir archivos de compilación (`.class`), datos personales, claves, contraseñas ni archivos generados innecesarios.
- No hacer pushes directos a `main`, no aprobar el propio PR y no integrar código que nadie del grupo pueda explicar.

## 5. Checklist final de cobertura del TFI

Antes de declarar el trabajo listo, revisar los 14 ejes del enunciado:

1. [ ] Dominio y abstracción de la concesionaria.
2. [ ] Arquitectura en capas, con separación Diseño vs. Negocio.
3. [ ] POJO/JavaBean y atributos privados.
4. [ ] `Vehiculo` abstracta, `Auto`, `Camioneta`, `Motocicleta` y polimorfismo.
5. [ ] Interfaces de comportamiento implementadas con propósito.
6. [ ] Excepciones estándar y propias del dominio.
7. [ ] Enums, incluido estado nuevo/0 km y usado/con kilometraje.
8. [ ] Consola interactiva con validaciones y mensajes.
9. [ ] Wrappers para conversiones y parseo controlado.
10. [ ] `List`/`Map` y `equals()`, `hashCode()`, `toString()` coherentes.
11. [ ] Persistencia duradera, con lectura y escritura verificadas.
12. [ ] Genéricos propios y tipado seguro.
13. [ ] UML que coincida con clases, interfaces y relaciones implementadas.
14. [ ] JavaDoc y documentación técnica.

Comprobar además:

- [ ] No hay `Scanner` ni `System.out` en modelo, servicio o persistencia.
- [ ] No hay dependencias externas no aprobadas. Si se usa JDBC, confirmar driver y autorización antes de incorporarlos.
- [ ] Un caso válido, límites, entradas inválidas, carga de archivo inexistente/corrupto según el mecanismo y persistencia entre ejecuciones se probaron y registraron.
- [ ] El proyecto compila con JDK 21 y la consola puede demostrar sus operaciones principales.
- [ ] UML, JavaDoc y bitácora de IAG están incluidos y actualizados. La guía exige usar una IAG gratuita, justificar técnicamente la elección, registrar al menos un error real de la herramienta y escribir una reflexión crítica; no inventar experiencias.
- [ ] Cada integrante puede explicar el código completo y resolver una modificación básica en vivo en menos de cinco minutos.
- [ ] Los tres PRs están integrados, aprobados por otra persona y enlazados desde el tablero o el informe.

La auditoría final debe marcar cada eje como **Cumple**, **Parcial**, **Falta** o **No verificable**, adjuntar evidencia y resolver los faltantes antes de la entrega. El objetivo es 100% de cobertura documentada; una lista sin implementación o pruebas no cuenta como cumplimiento.
