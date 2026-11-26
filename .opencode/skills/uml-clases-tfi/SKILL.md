---
name: uml-clases-tfi
description: Analiza todas las clases, interfaces, enums y excepciones en src/ y actualiza diagrama_clases.puml con notación UML 2.5 y estilo clásico Java.
---

# Skill: uml-clases-tfi

## Reglas obligatorias

### 1. Sincronización 1:1 con `src/`

- Leé todos los archivos `.java` dentro de `src/` (`modelo`, `excepciones`, `persistencia`, `servicio`, `vista`) antes de editar el diagrama.
- Reflejá únicamente las clases, interfaces, enums, excepciones, atributos, constructores y métodos que existan realmente en el código fuente.

### 2. Estilo Visual Clásico Java (PlantUML / ObjectAid)

- Iniciá `diagrama_clases.puml` con esta configuración exacta para mantener la estética clásica de cajas amarillo claro, bordes bordó, íconos circulares de tipo (`C`, `I`, `A`, `E`) y líneas ortogonales:

```plantuml
@startuml
top to bottom direction
skinparam linetype ortho
skinparam packageStyle rectangle
skinparam class {
  BackgroundColor #FEFECE
  BorderColor #A80036
  ArrowColor #A80036
  HeaderBackgroundColor #FEFECE
  FontName SansSerif
  FontSize 12
}
skinparam stereotypeCBackgroundColor #ADD1B2
skinparam stereotypeABackgroundColor #A9DCDF
skinparam stereotypeIBackgroundColor #B4A7E5
skinparam stereotypeEBbackgroundColor #EB937F
```

- Agrupá las entidades dentro de sus paquetes reales (`package modelo`, `package excepciones`, `package persistencia`, `package servicio`, `package vista`) para que se visualice claramente la separación entre **Diseño** y **Negocio**.

### 3. Notación UML Rigurosa por Elemento

- **Clases abstractas:** Declarar con `abstract class NombreClase` y sus métodos abstractos con `{abstract}` (se muestran en *cursiva*).
- **Interfaces y Enums:** Declarar con `interface NombreInterfaz` y `enum NombreEnum` (listando sus constantes en mayúsculas).
- **Genéricos:** Incluir parámetros de tipo exactos (ej. `interface RepositorioGenerico<T, ID>`).
- **Atributos, Constructores y Métodos:**
  - Visibilidad explícita: `-` (`private`), `+` (`public`), `#` (`protected`).
  - Atributos: `- nombreAtributo : TipoDato`
  - Constructores y métodos: `+ NombreClase(param : Tipo)` y `+ nombreMetodo(param : Tipo) : TipoRetorno`
  - Métodos estáticos marcados con `{static}` (se renderizan subrayados, como `+ {static} main(args : String[]) : void`).

### 4. Relaciones y Flechas UML Exactas

- **Herencia (`extends`):** `--|>` (ej. `Vehiculo <|-- Auto`, `Vehiculo <|-- Camioneta`, `Vehiculo <|-- Motocicleta`, `Exception <|-- VehiculoNoEncontradoException`).
- **Implementación (`implements`):** `..|>` (ej. `Cotizable <|.. Vehiculo`).
- **Composición / Agregación:** `*--` o `o--` con multiplicidad (`"1"` a `"0..*"`) para atributos de colección (`List`, `Map`) o referencias entre capas.
- **Dependencia (`import` / `throws` / parámetros):** `..>` (ej. `ConsolaVista ..> ConcesionariaService`).

### 5. Exportación de imagen (si está disponible)

- Tras guardar `diagrama_clases.puml`, verificá si `plantuml` está instalado en Ubuntu; si existe, ejecutá `plantuml -tpng diagrama_clases.puml` para dejar actualizada también la imagen `.png`.
