import type { DatosTFI } from "./types";

/**
 * Contenido de la guía. Todos los fragmentos `codigo` son copias literales de
 * archivos .java del repositorio en el commit base indicado en `meta`.
 *
 * La `ponderacion` de cada lección es el peso del criterio de la rúbrica
 * oficial al que pertenece; NO se acumula entre lecciones porque varias
 * lecciones contribuyen al mismo criterio.
 */
export const datosTFI: DatosTFI = {
  meta: {
    titulo: "Concesionaria Multimarcas: cómo se construyó el TFI",
    subtitulo: "Guía teórico-práctica en 5 etapas, con el código real del repositorio",
    repositorio: "JoseDuarte99/ConcesionariaMultimarcas",
    commitBase: "293ba9c",
    versionJava: "JDK 21",
    fuentes: [
      "material_catedra/consignas_tfi/Trabajo_Final_Integrador_v4.pdf",
      "AGENTS.md y .opencode/commands/auditar-rubrica.md",
      "https://facundouferer.ar/cursos/java/",
    ],
  },

  etapas: [
    {
      id: "etapa-1",
      numero: 1,
      titulo: "Cimientos y modelado de datos",
      bajada:
        "Antes de escribir consola o archivos, el problema se traduce a tipos cerrados, un contrato mínimo y un JavaBean con estado privado.",
      prerrequisito: "Saber qué son un tipo primitivo, una clase y un método.",
      lecciones: [
        {
          id: "leccion-01",
          numero: 1,
          titulo: "El dominio se vuelve código: cuatro enums",
          commit: "8d9fcee",
          issue: 1,
          archivos: [
            "src/negocio/modelo/TipoVehiculo.java",
            "src/negocio/modelo/CondicionVehiculo.java",
            "src/negocio/modelo/Carroceria.java",
            "src/negocio/modelo/EstiloMotocicleta.java",
          ],
          conceptos: ["enum", "categoría cerrada", "constante UPPER_SNAKE_CASE"],
          problema: {
            necesidad:
              "La concesionaria trabaja con categorías que no cambian: tipo de unidad, condición comercial, carrocería y estilo de moto. Si se representaran como String, cualquier texto ('AUTO', 'auto', 'AUT0') sería válido y el stock se ensuciaría desde el primer alta.",
            contexto:
              "Primer commit del modelo (issue #1). Todavía no existía la jerarquía ni la consola: había que fijar el vocabulario del dominio antes de crear entidades.",
            consecuenciaSiNoExiste:
              "Aparecerían valores inválidos imposibles de enumerar, comparaciones por texto frágiles y mensajes de error ambiguos.",
          },
          fundamentoTeorico: {
            concepto: "Enum (tipo enumerativo)",
            explicacion: [
              "Un `enum` es un tipo por referencia con una lista fija de constantes, declaradas en mayúsculas con guion bajo. No se pueden crear valores nuevos en tiempo de ejecución.",
              "Cada constante es un objeto singleton de ese tipo: por eso se compara con `==`, no con `equals`. `Enum.valueOf(String)` es el puente entre el texto que viene del usuario o del archivo y el tipo seguro del dominio.",
              "La cátedra los ubica dentro de los contratos y tipos cerrados: sirven para modelar estados y categorías, no para guardar datos arbitrarios.",
            ],
            aplicacionAlCaso:
              "`CondicionVehiculo.NUEVO` y `USADO` son la semilla de la invariante 0 km/usado; `TipoVehiculo` será después el valor que devuelve el método polimórfico `getTipoVehiculo()` y la primera columna del archivo de persistencia.",
            errorFrecuente:
              "Usar `String` para la condición y escribir `if (condicion.equals(\"NUEVO\"))`: un typo compila y rompe la lógica en silencio.",
          },
          implementacionCodigo: {
            introduccion:
              "Se crean cuatro archivos pequeños, uno por categoría. Acá está el código literal de los dos primeros; los otros dos siguen el mismo patrón.",
            fragmentos: [
              {
                id: "lz1-tipo",
                archivo: "src/negocio/modelo/TipoVehiculo.java",
                lineas: "10-19",
                codigo: `public enum TipoVehiculo {

    /** Vehículo de pasajeros. */
    AUTO,

    /** Utilitario o vehículo de carga liviana. */
    CAMIONETA,

    /** Vehículo de dos ruedas. */
    MOTOCICLETA
}`,
                comentarios: [
                  {
                    linea: 10,
                    texto: "`public enum` declara un tipo cerrado: nadie puede agregar constantes fuera de este archivo.",
                  },
                  {
                    linea: 13,
                    texto: "Primera constante. Se escribe en UPPER_SNAKE_CASE según la convención del proyecto.",
                  },
                  {
                    linea: 19,
                    texto: "Última constante, sin punto y coma: la lista termina con `}`.",
                  },
                ],
                conexionAnterior:
                  "Es el primer archivo del modelo: no depende de nada más y fija el vocabulario que usarán las siguientes lecciones.",
              },
              {
                id: "lz1-condicion",
                archivo: "src/negocio/modelo/CondicionVehiculo.java",
                lineas: "9-15",
                codigo: `public enum CondicionVehiculo {

    /** Unidad nueva, sin kilometraje de uso. */
    NUEVO,

    /** Unidad usada, con kilometraje de uso mayor que cero. */
    USADO
}`,
                comentarios: [
                  {
                    linea: 9,
                    texto: "Segundo enum del dominio: representa el estado comercial de la unidad.",
                  },
                  {
                    linea: 12,
                    texto: "NUEVO implicará exactamente 0 km; la regla se implementará en `Vehiculo` (lección 4).",
                  },
                  {
                    linea: 15,
                    texto: "USADO implicará kilometraje mayor que cero. El enum solo nombra; la invariante vive en el modelo.",
                  },
                ],
                conexionAnterior:
                  "Completa el par de estados que el formulario de alta preguntará y que el codec escribirá en el archivo.",
              },
            ],
            recorrido: [
              "Identificar la categoría cerrada.",
              "Declarar `public enum` con constantes en mayúsculas.",
              "Documentar cada constante con JavaDoc breve.",
              "Usar el tipo en el modelo, nunca un String libre.",
            ],
          },
          decisionesYColoquio: {
            decision: "Modelar las categorías como enums y no como String ni como constantes `static final int`.",
            alternativas: [
              {
                opcion: "String con validación manual",
                porQueSeDescarto:
                  "Obliga a comparar ignorando mayúsculas y a mantener listas de valores válidos en varios lugares; los errores aparecen en ejecución.",
              },
              {
                opcion: "Enteros con constantes",
                porQueSeDescarto:
                  "Son menos legibles en el archivo de texto y permiten cualquier `int`; no documentan su propio significado.",
              },
            ],
            justificacion:
              "El enunciado exige enums para tipos/estados de dominio. `Enum.valueOf` además resuelve el parseo en dos capas distintas (consola y codec) con el mismo contrato.",
            ejeRubrica: 7,
            ejesRelacionados: [1, 5],
            criterioRubrica: "Interfaces y tipos enumerativos (Enums)",
            ponderacion: 10,
            preguntaDefensa:
              "¿Por qué se compara una constante de enum con `==` y por qué conviene `Enum.valueOf` antes que un `switch` sobre String?",
            escenariosLiveCoding: [
              {
                id: "lc-01-a",
                titulo: "Agregar una carrocería nueva",
                consigna:
                  "El vendedor pide la carrocería `HATCHBACK`. Agregala a `Carroceria` y mostrái que `Enum.valueOf` la acepta.",
                pistas: [
                  "Las constantes van separadas por coma dentro del enum.",
                  "El nombre debe coincidir exactamente (o pasar por `toUpperCase(Locale.ROOT)`).",
                ],
                solucion: `public enum Carroceria {
    SEDAN,
    HATCHBACK,
    SUV,
    COUPE,
    PICKUP,
    FURGON
}

// Verificación rápida:
Carroceria elegida = Enum.valueOf(Carroceria.class, "HATCHBACK");`,
                resultadoEsperado:
                  "Compila y `elegida` vale `HATCHBACK`. Si el texto viniera en minúsculas, antes hay que aplicar `toUpperCase(Locale.ROOT)` como hace `EntradaConsola`.",
                minutos: 3,
              },
              {
                id: "lc-01-b",
                titulo: "Renombrar un estado comercial",
                consigna:
                  "Cambiar `USADO` por `SEGUNDA_MANO` en todo el modelo y ajustar la invariante del kilometraje.",
                pistas: [
                  "El enum y todas las referencias deben cambiar juntos.",
                  "El mensaje de error también debe decir `SEGUNDA_MANO`.",
                ],
                solucion: `public enum CondicionVehiculo {
    NUEVO,
    SEGUNDA_MANO
}

// En Vehiculo.validarKilometraje:
if (condicion == CondicionVehiculo.SEGUNDA_MANO && kilometraje == 0) {
    throw new DatoVehiculoInvalidoException(
            "Una unidad SEGUNDA_MANO debe tener kilometraje mayor que cero.");
}`,
                resultadoEsperado:
                  "No queda ninguna referencia a `USADO` en `src/`. Es una demostración de por qué el enum concentra el vocabulario en un solo archivo.",
                minutos: 5,
              },
            ],
          },
        },
        {
          id: "leccion-02",
          numero: 2,
          titulo: "El primer contrato de comportamiento: Cotizable",
          commit: "8d9fcee",
          issue: 1,
          archivos: [
            "src/negocio/modelo/Cotizable.java",
            "src/negocio/modelo/Vehiculo.java",
            "src/negocio/modelo/package-info.java",
          ],
          conceptos: ["interfaz", "contrato", "implements"],
          problema: {
            necesidad:
              "El sistema necesita saber el valor comercial de cualquier unidad del stock, pero todavía no sabe cómo se calculará en cada categoría. Había que declarar esa obligación sin atar la implementación.",
            contexto:
              "Mismo commit #1: se define la interfaz antes que la clase abstracta, para que la jerarquía nazca cumpliendo un contrato.",
            consecuenciaSiNoExiste:
              "Cada subclase podría inventar un nombre distinto (`getPrecio`, `calcularPrecio`) y el servicio tendría que castear para cotizar.",
          },
          fundamentoTeorico: {
            concepto: "Interfaz como contrato de comportamiento",
            explicacion: [
              "Una interfaz declara qué debe saber hacer una clase, sin definir cómo. Es un conjunto de métodos abstractos que el implementador está obligado a escribir.",
              "Una clase puede implementar varias interfaces (Java tiene herencia simple de clases, pero múltiples contratos), y una variable declarada como la interfaz puede apuntar a cualquier implementación: eso es polimorfismo.",
              "Desde Java 8 una interfaz puede tener métodos `default`, pero acá se usa la forma clásica: un solo método abstracto, fácil de defender.",
            ],
            aplicacionAlCaso:
              "`Vehiculo implements Cotizable` y la clase base da la implementación por defecto devolviendo el campo `valorComercial`. Las subclases podrían sobrescribirla si aparece una regla específica; hoy ninguna lo hace.",
            errorFrecuente:
              "Crear una interfaz vacía 'para cumplir con el requisito'. Acá la interfaz tiene un método que el servicio podría usar para cotizar sin conocer la subclase.",
          },
          implementacionCodigo: {
            introduccion:
              "La interfaz es de tres líneas útiles; la magia está en que `Vehiculo` la implementa desde el principio.",
            fragmentos: [
              {
                id: "lz2-interfaz",
                archivo: "src/negocio/modelo/Cotizable.java",
                lineas: "10-17",
                codigo: `public interface Cotizable {

    /**
     * Calcula el valor comercial estimado del vehículo.
     *
     * @return valor comercial estimado, mayor o igual que cero
     */
    double calcularValorComercial();
}`,
                comentarios: [
                  {
                    linea: 10,
                    texto: "`interface`, no `class`: declara una capacidad, no estado.",
                  },
                  {
                    linea: 17,
                    texto: "Método abstracto implícito: no lleva cuerpo y termina en `;`.",
                  },
                ],
                conexionAnterior:
                  "Usa el tipo seguro del dominio definido en la lección 1 para el valor devuelto (un `double`, no un String).",
              },
              {
                id: "lz2-implementa",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "28,281-284",
                codigo: `public abstract class Vehiculo implements Cotizable {
...
    @Override
    public double calcularValorComercial() {
        return valorComercial;
    }`,
                comentarios: [
                  {
                    linea: 28,
                    texto: "`implements Cotizable` obliga a `Vehiculo` a tener el método; como es abstracta, puede dejarlo para las subclases, pero acá lo resuelve ella.",
                  },
                  {
                    linea: 281,
                    texto: "`@Override` verifica con el compilador que el método existe en la interfaz.",
                  },
                  {
                    linea: 283,
                    texto: "Implementación base: el valor almacenado. Es el punto de extensión para depreciaciones futuras.",
                  },
                ],
                conexionAnterior:
                  "La clase POJO de la lección 3 nace ya cumpliendo el contrato que recién declaramos.",
              },
            ],
            recorrido: [
              "Detectar una capacidad común a todas las entidades.",
              "Declarar el método en una interfaz del modelo.",
              "Implementarlo en la clase base con `@Override`.",
              "Dejar la puerta abierta a sobrescrituras en las subclases.",
            ],
          },
          decisionesYColoquio: {
            decision: "Poner el método en una interfaz y la implementación por defecto en la clase abstracta.",
            alternativas: [
              {
                opcion: "Método concreto directo en Vehiculo, sin interfaz",
                porQueSeDescarto:
                  "Funciona igual hoy, pero no expresa un contrato reutilizable ni permite que otra clase no vehículo sea cotizable.",
              },
              {
                opcion: "Método abstracto en Vehiculo y obligar a las tres subclases a escribirlo",
                porQueSeDescarto:
                  "Repetiría tres veces `return valorComercial;` sin ninguna diferencia de comportamiento.",
              },
            ],
            justificacion:
              "La interfaz modela el 'qué', la clase abstracta aprovecha el 'cómo' común. Es la combinación que la cátedra evalúa: contrato + reutilización.",
            ejeRubrica: 5,
            ejesRelacionados: [4, 7],
            criterioRubrica: "Interfaces y tipos enumerativos (Enums)",
            ponderacion: 10,
            preguntaDefensa:
              "Si agregás una clase `Servicio` que también es `Cotizable`, ¿tenés que tocar `Vehiculo`? ¿Por qué?",
            escenariosLiveCoding: [
              {
                id: "lc-02-a",
                titulo: "Cotizar con descuento en Camioneta",
                consigna:
                  "Sobrescribir `calcularValorComercial()` en `Camioneta` para aplicar un 5 % de descuento.",
                pistas: [
                  "Usá el getter `getValorComercial()` para no acceder al campo privado.",
                  "No hace falta cambiar la interfaz.",
                ],
                solucion: `@Override
public double calcularValorComercial() {
    return getValorComercial() * 0.95;
}`,
                resultadoEsperado:
                  "Una `Camioneta` con valor 100 devuelve 95; un `Auto` sigue devolviendo 100. El polimorfismo elige la versión según el objeto real.",
                minutos: 3,
              },
              {
                id: "lc-02-b",
                titulo: "Nuevo contrato Describible",
                consigna:
                  "Agregar `Describible` con `String getDescripcion()` e implementarla en `Vehiculo` delegando en `toString()`.",
                pistas: [
                  "La interfaz va en `negocio.modelo`.",
                  "`Vehiculo` puede implementar dos interfaces: `Cotizable, Describible`.",
                ],
                solucion: `public interface Describible {
    String getDescripcion();
}

// En Vehiculo:
public abstract class Vehiculo implements Cotizable, Describible {
    @Override
    public String getDescripcion() {
        return toString();
    }
}`,
                resultadoEsperado:
                  "Compila sin tocar las tres subclases: heredan la implementación de la base.",
                minutos: 5,
              },
            ],
          },
        },
        {
          id: "leccion-03",
          numero: 3,
          titulo: "El JavaBean del dominio: estado privado y accesores",
          commit: "5fc4c1a",
          issue: 2,
          archivos: ["src/negocio/modelo/Vehiculo.java"],
          conceptos: ["POJO/JavaBean", "encapsulamiento", "constructor validador"],
          problema: {
            necesidad:
              "Había que guardar ocho datos comunes de cada unidad sin exponerlos. El modelo debía ser el único responsable de que esos datos siempre fueran coherentes.",
            contexto:
              "Issue #2. Ya existían los enums y `Cotizable`; ahora se construye la clase base que concentra el estado compartido.",
            consecuenciaSiNoExiste:
              "Cualquier clase podría asignar `anio = -5` o dejar `marca` en null, y el error se descubriría recién al persistir o al mostrar.",
          },
          fundamentoTeorico: {
            concepto: "POJO/JavaBean y encapsulamiento",
            explicacion: [
              "Un POJO es una clase simple sin herencias ni dependencias de framework. Un JavaBean además expone su estado mediante getters y setters con nombres `getX`/`setX`.",
              "El encapsulamiento significa que los atributos son `private` y solo se acceden por métodos. Esos métodos son el lugar donde se valida la invariante antes de asignar.",
              "La identidad (`identificador`) se declara `final`: se fija en el constructor y nunca cambia. Eso permite usarla después como clave de `Map` sin riesgo de perder el objeto. La cátedra evalúa este patrón bajo 'modelado POJO/JavaBean'.",
            ],
            aplicacionAlCaso:
              "`Vehiculo` tiene ocho campos privados; el constructor llama a cinco validadores antes de asignar. No hay setters para `identificador` porque cambiarlo rompería la identidad de negocio.",
            errorFrecuente:
              "Generar getters y setters automáticamente para todos los campos, incluidos los inmutables. Acá `getIdentificador()` existe, `setIdentificador()` no.",
          },
          implementacionCodigo: {
            introduccion:
              "Primero el estado, después el constructor que valida, y un par de accesores representativo del patrón que se repite en los ocho campos.",
            fragmentos: [
              {
                id: "lz3-campos",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "30-39",
                codigo: `    /** Identificador único del vehículo (patente o código interno). Inmutable. */
    private final String identificador;

    private String marca;
    private String modelo;
    private int anio;
    private String color;
    private CondicionVehiculo condicion;
    private int kilometraje;
    private double valorComercial;`,
                comentarios: [
                  {
                    linea: 31,
                    texto: "`private final`: nadie desde fuera puede ver ni cambiar la clave de identidad.",
                  },
                  {
                    linea: 33,
                    texto: "Los campos mutables son `private`; su tipo natural (int, double, enum) se conserva.",
                  },
                  {
                    linea: 37,
                    texto: "La condición es un enum, no un String: acopla el estado a la lección 1.",
                  },
                ],
                conexionAnterior:
                  "Usa `CondicionVehiculo` (lección 1) como tipo del campo y prepara el estado que `Cotizable` consultará (lección 2).",
              },
              {
                id: "lz3-constructor",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "54-74",
                codigo: `    protected Vehiculo(String identificador, String marca, String modelo, int anio,
                       String color, CondicionVehiculo condicion, int kilometraje,
                       double valorComercial) throws DatoVehiculoInvalidoException {
        validarTextoNoVacio(identificador, "identificador");
        validarTextoNoVacio(marca, "marca");
        validarTextoNoVacio(modelo, "modelo");
        validarAnio(anio);
        validarTextoNoVacio(color, "color");
        validarCondicion(condicion);
        validarKilometraje(condicion, kilometraje);
        validarValorComercial(valorComercial);

        this.identificador = identificador;
        this.marca = marca;
        this.modelo = modelo;
        this.anio = anio;
        this.color = color;
        this.condicion = condicion;
        this.kilometraje = kilometraje;
        this.valorComercial = valorComercial;
    }`,
                comentarios: [
                  {
                    linea: 54,
                    texto: "`protected`: solo las subclases pueden invocarlo; nadie instancia `Vehiculo` directamente.",
                  },
                  {
                    linea: 57,
                    texto: "Validar ANTES de asignar evita construir un objeto inválido aunque sea un instante.",
                  },
                  {
                    linea: 63,
                    texto: "La coherencia condición/kilometraje se chequea en el constructor y también en los setters.",
                  },
                  {
                    linea: 66,
                    texto: "Recién después de las ocho validaciones se copian los parámetros a los campos.",
                  },
                ],
                conexionAnterior:
                  "Las validaciones que se invocarán acá se definen en la lección 12; el patrón 'validar y asignar' se repite allí.",
              },
              {
                id: "lz3-accesores",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "81-83,100-103",
                codigo: `    public String getIdentificador() {
        return identificador;
    }
...
    public void setMarca(String marca) throws DatoVehiculoInvalidoException {
        validarTextoNoVacio(marca, "marca");
        this.marca = marca;
    }`,
                comentarios: [
                  {
                    linea: 81,
                    texto: "Getter público del identificador; no existe setter porque es inmutable.",
                  },
                  {
                    linea: 101,
                    texto: "El setter valida antes de asignar: es la misma regla del constructor.",
                  },
                ],
                conexionAnterior:
                  "El identificador devuelto acá será la clave del `Map<String, Vehiculo>` de la lección 8 y del `Map` del repositorio.",
              },
            ],
            recorrido: [
              "Declarar los campos como `private` (y `final` el identificador).",
              "Escribir un constructor `protected` que valide antes de asignar.",
              "Exponer getters para todos los campos y setters solo para los mutables.",
              "Repetir la validación dentro de cada setter que pueda romper una invariante.",
            ],
          },
          decisionesYColoquio: {
            decision: "JavaBean clásico con campos privados y validación centralizada en el modelo.",
            alternativas: [
              {
                opcion: "Campos públicos",
                porQueSeDescarto:
                  "Cualquier llamador podría dejar el objeto en un estado inválido sin que el modelo pueda reaccionar.",
              },
              {
                opcion: "Usar `record` de Java 16+",
                porQueSeDescarto:
                  "El enunciado evalúa encapsulamiento clásico con getters/setters; además un `record` no permite los mutadores validados que exige el TFI.",
              },
            ],
            justificacion:
              "Es el patrón que la rúbrica pide explícitamente (POJO/JavaBean) y el que permite defender cada setter con una invariante concreta.",
            ejeRubrica: 3,
            ejesRelacionados: [6, 10],
            criterioRubrica: "Modelado POJO/JavaBean y Wrappers",
            ponderacion: 5,
            preguntaDefensa:
              "¿Por qué `identificador` es `final` y por qué no hay `setIdentificador()`? ¿Qué pasaría si estuviera en un `HashMap`?",
            escenariosLiveCoding: [
              {
                id: "lc-03-a",
                titulo: "Validar el año contra el presente",
                consigna:
                  "Agregar al validador `validarAnio` la regla de que el año no puede ser mayor al año actual usando `java.util.GregorianCalendar`.",
                pistas: [
                  "El proyecto solo usa APIs del JDK; `GregorianCalendar` está en `java.util`.",
                  "El mensaje de error debe seguir siendo una `DatoVehiculoInvalidoException`.",
                ],
                solucion: `private static void validarAnio(int anio) throws DatoVehiculoInvalidoException {
    int anioActual = new java.util.GregorianCalendar().get(java.util.Calendar.YEAR);
    if (anio <= 0 || anio > anioActual) {
        throw new DatoVehiculoInvalidoException(
                "El año de fabricación debe estar entre 1 y " + anioActual + ".");
    }
}`,
                resultadoEsperado:
                  "`new Auto(..., 2030, ...)` lanza la excepción propia; el constructor sigue sin asignar campos.",
                minutos: 4,
              },
              {
                id: "lc-03-b",
                titulo: "Nuevo campo con setter validado",
                consigna:
                  "Agregar el campo `nombreVendedor` a `Vehiculo`, con getter, setter y validación de texto no vacío.",
                pistas: [
                  "Seguí el patrón de `marca`: campo privado, getter, setter con `validarTextoNoVacio`.",
                  "No hace falta tocar las subclases: heredan el campo.",
                ],
                solucion: `private String nombreVendedor;

public String getNombreVendedor() {
    return nombreVendedor;
}

public void setNombreVendedor(String nombreVendedor)
        throws DatoVehiculoInvalidoException {
    validarTextoNoVacio(nombreVendedor, "nombreVendedor");
    this.nombreVendedor = nombreVendedor;
}`,
                resultadoEsperado:
                  "Las tres subclases heredan el accesor sin cambios. Recordá agregar la validación y asignación en el constructor si querés que sea obligatorio.",
                minutos: 5,
              },
            ],
          },
        },
        {
          id: "leccion-04",
          numero: 4,
          titulo: "Nuevo 0 km versus usado: la primera invariante",
          commit: "112c9a4",
          issue: 3,
          archivos: [
            "src/negocio/modelo/CondicionVehiculo.java",
            "src/negocio/modelo/Vehiculo.java",
            "src/diseno/FormulariosVehiculo.java",
          ],
          conceptos: ["invariante de dominio", "enum + validación", "0 km"],
          problema: {
            necesidad:
              "El enunciado exige distinguir un 0 km de un usado. Decir 'usado' con 0 km o 'nuevo' con 50.000 km son estados inválidos que el sistema no debe admitir.",
            contexto:
              "El enum ya existía (lección 1) pero no tenía reglas. En el issue #3 se convirtió en una invariante verificable en constructor y mutadores.",
            consecuenciaSiNoExiste:
              "El stock podría contradecirse a sí mismo y los filtros por condición darían resultados engañosos.",
          },
          fundamentoTeorico: {
            concepto: "Invariante de dominio",
            explicacion: [
              "Una invariante es una condición que debe cumplirse durante toda la vida del objeto. No es una preferencia del formulario: es una regla del negocio.",
              "Por eso se valida en dos lugares: al construir (para no crear estados inválidos) y en cada mutador que podría romperla (para no degradar un objeto válido).",
              "El error se informa lanzando una excepción propia, nunca devolviendo un valor centinela como -1 o `null`.",
            ],
            aplicacionAlCaso:
              "`validarKilometraje(condicion, kilometraje)` exige 0 para NUEVO y mayor que 0 para USADO. `setCondicion` revalida con el kilometraje actual; `setKilometraje` revalida con la condición actual.",
            errorFrecuente:
              "Validar solo en la consola. Si después el codec lee un archivo corrupto, un objeto inválido entraría igual al modelo.",
          },
          implementacionCodigo: {
            introduccion:
              "La regla es corta pero se llama desde cuatro puntos distintos: constructor, `setCondicion`, `setKilometraje` y el formulario de alta.",
            fragmentos: [
              {
                id: "lz4-regla",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "381-394",
                codigo: `    private static void validarKilometraje(CondicionVehiculo condicion, int kilometraje)
            throws DatoVehiculoInvalidoException {
        if (kilometraje < 0) {
            throw new DatoVehiculoInvalidoException("El kilometraje no puede ser negativo.");
        }
        if (condicion == CondicionVehiculo.NUEVO && kilometraje != 0) {
            throw new DatoVehiculoInvalidoException(
                    "Un vehículo NUEVO no puede tener kilometraje mayor que cero.");
        }
        if (condicion == CondicionVehiculo.USADO && kilometraje == 0) {
            throw new DatoVehiculoInvalidoException(
                    "Un vehículo USADO debe tener kilometraje mayor que cero.");
        }
    }`,
                comentarios: [
                  {
                    linea: 381,
                    texto: "`private static`: es lógica de validación, no estado del objeto.",
                  },
                  {
                    linea: 383,
                    texto: "Primero el rango: ningún kilometraje negativo es aceptable.",
                  },
                  {
                    linea: 386,
                    texto: "NUEVO exige exactamente cero, no 'menor que 100'.",
                  },
                  {
                    linea: 390,
                    texto: "USADO exige mayor que cero: cero queda reservado para 0 km.",
                  },
                ],
                conexionAnterior:
                  "Usa los dos valores del enum de la lección 1 y lanza la excepción propia que se estudiará en la lección 11.",
              },
              {
                id: "lz4-formulario",
                archivo: "src/diseno/FormulariosVehiculo.java",
                lineas: "100-106",
                codigo: `        int kilometraje;
        if (condicion == CondicionVehiculo.NUEVO) {
            kilometraje = 0;
            System.out.println("Unidad 0 km: kilometraje fijado en 0.");
        } else {
            kilometraje = entrada.leerEntero("Kilometraje: ");
        }`,
                comentarios: [
                  {
                    linea: 101,
                    texto: "La vista aplica una comodidad: no preguntar km cuando es 0 km.",
                  },
                  {
                    linea: 102,
                    texto: "Fija cero, que es justamente lo que el modelo exige para NUEVO.",
                  },
                  {
                    linea: 105,
                    texto: "Para USADO sí se pide; el constructor es quien valida que sea > 0.",
                  },
                ],
                conexionAnterior:
                  "Adelanta la separación Diseño/Negocio de la lección 14: la vista decide qué preguntar, el modelo decide qué es válido.",
              },
            ],
            recorrido: [
              "Leer la condición como enum, no como texto libre.",
              "Si es NUEVO, fijar kilometraje en 0 sin preguntar.",
              "Validar la coherencia en el constructor y en ambos setters.",
              "Informar el incumplimiento con `DatoVehiculoInvalidoException`.",
            ],
          },
          decisionesYColoquio: {
            decision: "Representar el estado con un enum y validar la coherencia en el modelo, no en la vista.",
            alternativas: [
              {
                opcion: "Inferir 'nuevo' de `kilometraje == 0` sin campo de condición",
                porQueSeDescarto:
                  "Un usado con 0 km (ej. demostración) sería indistinguible y no se podría filtrar por condición.",
              },
              {
                opcion: "Dejar que el usuario escriba libremente 'nuevo/usado' y convertirlo después",
                porQueSeDescarto:
                  "Traslada la invariante a la vista y permite entradas ambiguas; el enum ya resuelve el parseo con `valueOf`.",
              },
            ],
            justificacion:
              "Es el eje 7 del enunciado. Tener la regla en el modelo la hace cumplirse también cuando los datos vienen del archivo, no solo de la consola.",
            ejeRubrica: 7,
            ejesRelacionados: [3, 6],
            criterioRubrica: "Interfaces y tipos enumerativos (Enums)",
            ponderacion: 10,
            preguntaDefensa:
              "Si cambiás la condición de un vehículo de NUEVO a USADO con `setCondicion`, ¿qué evita que quede con 0 km?",
            escenariosLiveCoding: [
              {
                id: "lc-04-a",
                titulo: "Permitir usados de demostración con 0 km",
                consigna:
                  "Relajar la regla para que un USADO pueda tener 0 km, manteniendo la de NUEVO.",
                pistas: [
                  "Hay que tocar el bloque `if (condicion == USADO ...)`.",
                  "Actualizá también el JavaDoc del validador para no dejar documentación vieja.",
                ],
                solucion: `// Se elimina este bloque:
// if (condicion == CondicionVehiculo.USADO && kilometraje == 0) { ... }

// Queda solamente:
if (kilometraje < 0) {
    throw new DatoVehiculoInvalidoException("El kilometraje no puede ser negativo.");
}
if (condicion == CondicionVehiculo.NUEVO && kilometraje != 0) {
    throw new DatoVehiculoInvalidoException(
            "Un vehículo NUEVO no puede tener kilometraje mayor que cero.");
}`,
                resultadoEsperado:
                  "Un USADO con 0 km ahora se acepta; un NUEVO con km sigue rechazándose. Es una decisión de negocio, no un bug.",
                minutos: 4,
              },
              {
                id: "lc-04-b",
                titulo: "Consultar si es 0 km",
                consigna:
                  "Agregar `public boolean esNuevo()` a `Vehiculo` y usarla en un filtro del servicio.",
                pistas: [
                  "Delegá en el enum: `condicion == CondicionVehiculo.NUEVO`.",
                  "El servicio no necesita conocer el campo directamente.",
                ],
                solucion: `// En Vehiculo:
public boolean esNuevo() {
    return condicion == CondicionVehiculo.NUEVO;
}

// En ConcesionariaService:
public List<Vehiculo> filtrarCeroKm() {
    List<Vehiculo> resultado = new ArrayList<>();
    for (Vehiculo vehiculo : stock) {
        if (vehiculo.esNuevo()) {
            resultado.add(vehiculo);
        }
    }
    return resultado;
}`,
                resultadoEsperado:
                  "El filtro devuelve solo unidades NUEVO sin acceder a campos privados ni duplicar la comparación del enum.",
                minutos: 5,
              },
            ],
          },
        },
      ],
    },

    {
      id: "etapa-2",
      numero: 2,
      titulo: "Jerarquía y contratos de comportamiento",
      bajada:
        "El modelo escala de una clase a una familia: la base abstracta fija lo común, las tres concretas aportan lo propio y el contrato Cotizable las unifica.",
      prerrequisito: "Etapa 1: enums, interfaz Cotizable y el JavaBean `Vehiculo`.",
      lecciones: [
        {
          id: "leccion-05",
          numero: 5,
          titulo: "Vehiculo se vuelve abstracta",
          commit: "5fc4c1a",
          issue: 2,
          archivos: ["src/negocio/modelo/Vehiculo.java"],
          conceptos: ["clase abstracta", "método abstracto", "protected"],
          problema: {
            necesidad:
              "No tiene sentido instanciar un 'vehículo genérico': siempre es un auto, una camioneta o una moto. Pero tampoco conviene copiar ocho campos en tres clases.",
            contexto:
              "Issue #2. Ya estaba el JavaBean; ahora se lo declara abstracto y se le agrega un método que cada subclase debe responder.",
            consecuenciaSiNoExiste:
              "Se podría crear `new Vehiculo(...)` sin tipo concreto, y el sistema no tendría forma de saber qué ficha técnica mostrar.",
          },
          fundamentoTeorico: {
            concepto: "Clase abstracta versus interfaz",
            explicacion: [
              "Una clase abstracta no se instancia: puede tener campos, constructores, métodos concretos y métodos abstractos. Sirve para factorizar estado y comportamiento común de una familia 'es un'.",
              "Una interfaz, en cambio, no guarda estado (en su forma clásica) y define solo obligaciones. Una clase abstracta puede implementar interfaces: acá `Vehiculo` es la base de la familia y `Cotizable` es el contrato que cumple.",
              "El método abstracto `getTipoVehiculo()` obliga a cada subclase a devolver su constante del enum: es polimorfismo resuelto en tiempo de ejecución.",
            ],
            aplicacionAlCaso:
              "`Vehiculo` tiene el estado compartido y el constructor `protected`; `getTipoVehiculo()` es abstracto y `Auto`, `Camioneta` y `Motocicleta` lo Implementan devolviendo su constante. `toString()` lo llama, así que la ficha cambia según el objeto real.",
            errorFrecuente:
              "Escribir `new Vehiculo(...)` en una prueba: el compilador lo rechaza. Eso es una señal de que la abstracción está funcionando.",
          },
          implementacionCodigo: {
            introduccion:
              "Tres cambios mínimos: la palabra `abstract` en la clase, el método abstracto y el `toString()` que lo invoca.",
            fragmentos: [
              {
                id: "lz5-clase",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "28",
                codigo: `public abstract class Vehiculo implements Cotizable {`,
                comentarios: [
                  {
                    linea: 28,
                    texto: "`abstract` impide `new Vehiculo(...)`; `implements Cotizable` mantiene el contrato de la lección 2.",
                  },
                ],
                conexionAnterior:
                  "Conserva el JavaBean de la lección 3 y agrega una restricción: solo se instancian las subclases.",
              },
              {
                id: "lz5-abstracto",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "265-270",
                codigo: `    /**
     * Tipo de vehículo según la jerarquía concreta.
     *
     * @return constante de {@link TipoVehiculo} correspondiente a la subclase
     */
    public abstract TipoVehiculo getTipoVehiculo();`,
                comentarios: [
                  {
                    linea: 270,
                    texto: "Método abstracto: termina en `;` y obliga a las tres subclases a implementarlo.",
                  },
                  {
                    linea: 268,
                    texto: "El tipo de retorno es el enum de la lección 1: la jerarquía y los enums se acoplan aquí.",
                  },
                ],
                conexionAnterior:
                  "Es el puente entre el enum `TipoVehiculo` y el polimorfismo que aparece en la lección 7.",
              },
              {
                id: "lz5-tostring",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "311-314",
                codigo: `    @Override
    public String toString() {
        return getTipoVehiculo() + "{" + descripcionComun() + "}";
    }`,
                comentarios: [
                  {
                    linea: 313,
                    texto: "`getTipoVehiculo()` se resuelve dinámicamente: imprime AUTO, CAMIONETA o MOTOCICLETA según el objeto.",
                  },
                  {
                    linea: 313,
                    texto: "`descripcionComun()` es un método `protected` que evita repetir los ocho campos en cada subclase.",
                  },
                ],
                conexionAnterior:
                  "Este `toString()` será usado por la consola en la lección 14 para mostrar el listado.",
              },
            ],
            recorrido: [
              "Marcar la clase como `abstract`.",
              "Declarar `getTipoVehiculo()` sin cuerpo.",
              "Reutilizar `descripcionComun()` en `toString()`.",
              "Heredar el contrato `Cotizable` sin duplicarlo en cada subclase.",
            ],
          },
          decisionesYColoquio: {
            decision: "Clase abstracta para el estado común e interfaz para el contrato de cotización.",
            alternativas: [
              {
                opcion: "Interfaz con `default` methods y campos estáticos",
                porQueSeDescarto:
                  "Las interfaces no tienen estado de instancia; habría que repetir los ocho campos en las tres clases.",
              },
              {
                opcion: "Tres clases independientes sin base común",
                porQueSeDescarto:
                  "Duplicaría constructores, validadores y `toString()`; un cambio de regla obligaría a editar tres archivos.",
              },
            ],
            justificacion:
              "La prueba del 'es un' se cumple: un Auto ES UN Vehiculo. Y la base aprovecha que las tres comparten exactamente la misma inicialización.",
            ejeRubrica: 4,
            ejesRelacionados: [3, 5],
            criterioRubrica: "Herencia, clases abstractas y polimorfismo",
            ponderacion: 10,
            preguntaDefensa:
              "¿Cuándo elegirías una interfaz y cuándo una clase abstracta? Aplicá la respuesta a `Cotizable` y `Vehiculo`.",
            escenariosLiveCoding: [
              {
                id: "lc-05-a",
                titulo: "Nuevo método abstracto",
                consigna:
                  "Agregar `getDescripcionCorta()` abstracto en `Vehiculo` e implementarlo en las tres subclases devolviendo marca y modelo.",
                pistas: [
                  "El método se declara en la base con `public abstract String ...;`.",
                  "Las subclases usan los getters heredados.",
                ],
                solucion: `// En Vehiculo:
public abstract String getDescripcionCorta();

// En Auto, Camioneta y Motocicleta:
@Override
public String getDescripcionCorta() {
    return getMarca() + " " + getModelo();
}`,
                resultadoEsperado:
                  "Las tres clases concretas compilan; si falta una, el compilador lo señala. Es la garantía que da el método abstracto.",
                minutos: 5,
              },
              {
                id: "lc-05-b",
                titulo: "Hacer abstracta la cotización",
                consigna:
                  "Convertir `calcularValorComercial()` en abstracto y obligar a cada subclase a definir su regla.",
                pistas: [
                  "Hay que quitar el cuerpo de `Vehiculo`.",
                  "La implementación mínima es `return getValorComercial();` en cada subclase.",
                ],
                solucion: `// En Vehiculo:
@Override
public abstract double calcularValorComercial();

// En cada subclase:
@Override
public double calcularValorComercial() {
    return getValorComercial();
}`,
                resultadoEsperado:
                  "Compila y deja preparado el punto de extensión para depreciaciones distintas por categoría.",
                minutos: 5,
              },
            ],
          },
        },
        {
          id: "leccion-06",
          numero: 6,
          titulo: "Auto y Camioneta: extends, super y carrocería",
          commit: "5fc4c1a",
          issue: 2,
          archivos: [
            "src/negocio/modelo/Auto.java",
            "src/negocio/modelo/Camioneta.java",
            "src/negocio/modelo/Carroceria.java",
          ],
          conceptos: ["extends", "super", "herencia simple", "composición de enum"],
          problema: {
            necesidad:
              "Auto y Camioneta comparten casi todo, pero tienen un atributo propio: la carrocería. Había que heredar los ocho campos sin perder esa diferencia.",
            contexto:
              "Issue #2, inmediatamente después de declarar la base abstracta. Se crean las tres subclases concretas.",
            consecuenciaSiNoExiste:
              "La carrocería quedaría como un campo opcional en la base y un Auto podría no tenerla, rompiendo el modelo.",
          },
          fundamentoTeorico: {
            concepto: "Herencia simple y cadena de constructores",
            explicacion: [
              "Java permite una sola clase padre. `Auto extends Vehiculo` hereda sus campos y métodos; el constructor propio debe llamar a `super(...)` como primera sentencia para inicializar la parte heredada.",
              "La llamada sube por la cadena hasta `Object` y la ejecución de los cuerpos baja: cuando corre el cuerpo de `Auto`, la parte de `Vehiculo` ya está lista y validada.",
              "La prueba antes de usar `extends` es 'un X es un Y'. Un Auto ES UN Vehiculo; en cambio un Auto NO ES UN Motor (eso sería composición).",
            ],
            aplicacionAlCaso:
              "Ambas subclases llaman a `super(identificador, ... valorComercial)` y después validan su propio campo `carroceria` con el helper `protected` heredado. `getTipoVehiculo()` devuelve la constante correspondiente sin debate.",
            errorFrecuente:
              "Olvidar `super(...)` cuando la superclase no tiene constructor sin argumentos: el compilador lo avisa con un error poco intuitivo.",
          },
          implementacionCodigo: {
            introduccion:
              "El código de Auto y Camioneta es casi idéntico: esa repetición es intencional y pequeña (un campo propio distinto en cada una).",
            fragmentos: [
              {
                id: "lz6-auto",
                archivo: "src/negocio/modelo/Auto.java",
                lineas: "11-36",
                codigo: `public class Auto extends Vehiculo {

    private Carroceria carroceria;
...
    public Auto(String identificador, String marca, String modelo, int anio,
                String color, CondicionVehiculo condicion, int kilometraje,
                double valorComercial, Carroceria carroceria)
            throws DatoVehiculoInvalidoException {
        super(identificador, marca, modelo, anio, color, condicion, kilometraje, valorComercial);
        validarNoNulo(carroceria, "carroceria");
        this.carroceria = carroceria;
    }`,
                comentarios: [
                  {
                    linea: 11,
                    texto: "`extends Vehiculo`: hereda los ocho campos, los validadores y `Cotizable`.",
                  },
                  {
                    linea: 13,
                    texto: "Campo nuevo y privado: la carrocería es propia de esta categoría.",
                  },
                  {
                    linea: 33,
                    texto: "`super(...)` va primero y delega la validación de los datos comunes a la base.",
                  },
                  {
                    linea: 34,
                    texto: "El campo específico se valida con el helper `protected` de `Vehiculo`.",
                  },
                ],
                conexionAnterior:
                  "Usa el constructor validador de la lección 3 y el enum `Carroceria` de la lección 1.",
              },
              {
                id: "lz6-auto-toString",
                archivo: "src/negocio/modelo/Auto.java",
                lineas: "63-77",
                codigo: `    @Override
    public String toString() {
        return getTipoVehiculo() + "{" + descripcionComun()
                + ", carroceria=" + carroceria + "}";
    }
...
    @Override
    public TipoVehiculo getTipoVehiculo() {
        return TipoVehiculo.AUTO;
    }`,
                comentarios: [
                  {
                    linea: 64,
                    texto: "Sobrescribe `toString()` para agregar el único campo que la base no conoce.",
                  },
                  {
                    linea: 65,
                    texto: "Reutiliza `descripcionComun()` en vez de repetir los ocho atributos.",
                  },
                  {
                    linea: 75,
                    texto: "Implementación concreta del método abstracto de la lección 5.",
                  },
                ],
                conexionAnterior:
                  "Cierra el ciclo abierto en la lección 5: la base llama a este método sin saber qué subclase responde.",
              },
              {
                id: "lz6-camioneta",
                archivo: "src/negocio/modelo/Camioneta.java",
                lineas: "29-36",
                codigo: `    public Camioneta(String identificador, String marca, String modelo, int anio,
                     String color, CondicionVehiculo condicion, int kilometraje,
                     double valorComercial, Carroceria carroceria)
            throws DatoVehiculoInvalidoException {
        super(identificador, marca, modelo, anio, color, condicion, kilometraje, valorComercial);
        validarNoNulo(carroceria, "carroceria");
        this.carroceria = carroceria;
    }`,
                comentarios: [
                  {
                    linea: 33,
                    texto: "Misma cadena `super(...)`; el comportamiento compartido se hereda sin copiarlo.",
                  },
                  {
                    linea: 35,
                    texto: "Lo único propio es la carrocería y, más adelante, su constante `CAMIONETA`.",
                  },
                ],
                conexionAnterior:
                  "Muestra que la decisión de la lección 5 escala bien: agregar una subclase no obliga a tocar la base.",
              },
            ],
            recorrido: [
              "Declarar `extends Vehiculo`.",
              "Agregar solo el campo específico.",
              "Llamar a `super(...)` en la primera línea del constructor.",
              "Validar el campo propio y sobrescribir `getTipoVehiculo()`.",
            ],
          },
          decisionesYColoquio: {
            decision: "Heredar la base y mantener un campo `carroceria` en Auto y Camioneta, sin subirlo a `Vehiculo`.",
            alternativas: [
              {
                opcion: "Campo `carroceria` opcional en `Vehiculo`",
                porQueSeDescarto:
                  "Una moto no tiene carrocería: el campo quedaría en null y la clase base conocería un detalle de solo dos subclases.",
              },
              {
                opcion: "Interfaz `ConCarroceria` con getter por defecto",
                porQueSeDescarto:
                  "Una interfaz no puede guardar el campo; habría que declararlo igual en las dos clases. Hoy no aporta y complica la defensa.",
              },
            ],
            justificacion:
              "La duplicación es de pocas líneas y cada clase conserva un campo obligatorio y validado. Es preferible a un campo opcional en la base.",
            ejeRubrica: 4,
            ejesRelacionados: [3, 7],
            criterioRubrica: "Herencia, clases abstractas y polimorfismo",
            ponderacion: 10,
            preguntaDefensa:
              "¿Por qué la carrocería no está en `Vehiculo` si dos de tres subclases la usan? ¿Dónde pondrías el límite?",
            escenariosLiveCoding: [
              {
                id: "lc-06-a",
                titulo: "Capacidad de carga en Camioneta",
                consigna:
                  "Agregar `capacidadKg` a `Camioneta` con validación positiva y mostrarlo en `toString()`.",
                pistas: [
                  "El campo va después de `super(...)`.",
                  "Sumalo al final de `descripcionComun()` como hace `carroceria`.",
                ],
                solucion: `private int capacidadKg;

public Camioneta(..., Carroceria carroceria, int capacidadKg)
        throws DatoVehiculoInvalidoException {
    super(...);
    validarNoNulo(carroceria, "carroceria");
    if (capacidadKg <= 0) {
        throw new DatoVehiculoInvalidoException(
                "La capacidad debe ser positiva.");
    }
    this.carroceria = carroceria;
    this.capacidadKg = capacidadKg;
}`,
                resultadoEsperado:
                  "La base sigue intacta; solo cambia la subclase y su ficha técnica. Es la prueba de que la herencia está bien ubicada.",
                minutos: 5,
              },
              {
                id: "lc-06-b",
                titulo: "Restringir carrocería por categoría",
                consigna:
                  "Impedir que un `Auto` tenga carrocería `FURGON` sobrescribiendo el setter.",
                pistas: [
                  "El setter de la base no existe para `carroceria`; está en `Auto`.",
                  "Validá antes de asignar, como en el constructor.",
                ],
                solucion: `@Override
public void setCarroceria(Carroceria carroceria)
        throws DatoVehiculoInvalidoException {
    validarNoNulo(carroceria, "carroceria");
    if (carroceria == Carroceria.FURGON) {
        throw new DatoVehiculoInvalidoException(
                "Un auto no puede ser furgón.");
    }
    this.carroceria = carroceria;
}`,
                resultadoEsperado:
                  "El constructor sigue aceptando FURGON porque no llama al setter: para cerrar ese escape, el constructor debe usar `setCarroceria(...)`.",
                minutos: 5,
              },
            ],
          },
        },
        {
          id: "leccion-07",
          numero: 7,
          titulo: "Motocicleta y polimorfismo en acción",
          commit: "5fc4c1a",
          issue: 2,
          archivos: [
            "src/negocio/modelo/Motocicleta.java",
            "src/negocio/modelo/Cotizable.java",
            "src/diseno/FormulariosVehiculo.java",
          ],
          conceptos: ["polimorfismo", "despacho dinámico", "estilo"],
          problema: {
            necesidad:
              "Faltaba la tercera categoría, con un atributo que no es carrocería: el estilo. Y había que demostrar que el resto del sistema puede tratar a las tres igual.",
            contexto:
              "Cierre de la etapa de jerarquía. El formulario devuelve `Vehiculo` aunque construya objetos concretos.",
            consecuenciaSiNoExiste:
              "El servicio tendría que usar `instanceof` y casteos para cada categoría, y agregar una cuarta obligaría a tocar todos los `if`.",
          },
          fundamentoTeorico: {
            concepto: "Polimorfismo y despacho dinámico",
            explicacion: [
              "Una variable declarada `Vehiculo` puede apuntar a un `Auto`, una `Camioneta` o una `Motocicleta`. El compilador revisa qué métodos se pueden llamar mirando el tipo de la variable; la JVM elige qué código ejecutar mirando el tipo del objeto.",
              "Por eso `vehiculo.toString()` imprime una ficha distinta en cada caso sin un solo `if`. Es el premio de haber declarado `getTipoVehiculo()` como abstracto.",
              "Los casteos frecuentes son una señal de diseño: si necesitás `getEstilo()` desde una referencia `Vehiculo`, probablemente el método debería estar en la base o detrás de una interfaz.",
            ],
            aplicacionAlCaso:
              "`FormulariosVehiculo.solicitarAuto()` declara retorno `Vehiculo` y devuelve `new Auto(...)`. `Main` guarda ese objeto en `servicio.alta(vehiculo)` sin saber qué subclase es.",
            errorFrecuente:
              "Declarar el retorno del formulario como `Auto` y después castear en el menú: acopla la vista a una categoría concreta.",
          },
          implementacionCodigo: {
            introduccion:
              "La subclase es pequeña; lo interesante está en la firma del formulario, que devuelve el tipo abstracto.",
            fragmentos: [
              {
                id: "lz7-moto",
                archivo: "src/negocio/modelo/Motocicleta.java",
                lineas: "29-36,74-77",
                codigo: `    public Motocicleta(String identificador, String marca, String modelo, int anio,
                       String color, CondicionVehiculo condicion, int kilometraje,
                       double valorComercial, EstiloMotocicleta estilo)
            throws DatoVehiculoInvalidoException {
        super(identificador, marca, modelo, anio, color, condicion, kilometraje, valorComercial);
        validarNoNulo(estilo, "estilo");
        this.estilo = estilo;
    }
...
    @Override
    public TipoVehiculo getTipoVehiculo() {
        return TipoVehiculo.MOTOCICLETA;
    }`,
                comentarios: [
                  {
                    linea: 33,
                    texto: "La cadena de constructores es la misma que en Auto y Camioneta: la base valida lo común.",
                  },
                  {
                    linea: 34,
                    texto: "El dato propio es `EstiloMotocicleta`, el cuarto enum de la lección 1.",
                  },
                  {
                    linea: 75,
                    texto: "Devuelve su constante; `toString()` de la base la usará sin conocer esta clase.",
                  },
                ],
                conexionAnterior:
                  "Cierra la familia iniciada en la lección 5 y muestra que `Cotizable` se hereda sin reescribirse.",
              },
              {
                id: "lz7-formulario",
                archivo: "src/diseno/FormulariosVehiculo.java",
                lineas: "44-50",
                codigo: `    public Vehiculo solicitarAuto() throws DatoVehiculoInvalidoException {
        DatosComunes datos = solicitarDatosComunes();
        Carroceria carroceria = entrada.leerEnum(
                "Carrocería (SEDAN, HATCHBACK, SUV, COUPE, PICKUP, FURGON): ", Carroceria.class);
        return new Auto(datos.identificador, datos.marca, datos.modelo, datos.anio,
                datos.color, datos.condicion, datos.kilometraje, datos.valorComercial, carroceria);
    }`,
                comentarios: [
                  {
                    linea: 44,
                    texto: "El retorno es `Vehiculo`, no `Auto`: el llamador trabaja con la abstracción.",
                  },
                  {
                    linea: 48,
                    texto: "El objeto real es `Auto`; el tipo declarado de la variable es la clase base.",
                  },
                ],
                conexionAnterior:
                  "El helper `DatosComunes` (clase interna) evita repetir la captura de los ocho atributos tres veces.",
              },
            ],
            recorrido: [
              "Crear la tercera subclase con su campo propio.",
              "Implementar `getTipoVehiculo()` devolviendo `MOTOCICLETA`.",
              "Heredar `calcularValorComercial()` sin sobrescribirlo.",
              "Devolver `Vehiculo` desde los formularios para no acoplar la vista.",
            ],
          },
          decisionesYColoquio: {
            decision: "Programar contra la abstracción (`Vehiculo`) y dejar los `new Auto/Camioneta/Motocicleta` en un solo lugar.",
            alternativas: [
              {
                opcion: "Métodos `calcularPrecioAuto`, `calcularPrecioMoto` en el servicio",
                porQueSeDescarto:
                  "Crece una rama por categoría y obliga a modificar el servicio cada vez que aparece una nueva.",
              },
              {
                opcion: "Castear en el menú según la opción elegida",
                porQueSeDescarto:
                  "Mezcla presentación con tipos concretos y hace imposible la extensión sin tocar la vista.",
              },
            ],
            justificacion:
              "Es el beneficio concreto del polimorfismo: agregar una cuarta categoría no obliga a cambiar el servicio ni el menú (sí el codec, como se verá en la lección 16).",
            ejeRubrica: 4,
            ejesRelacionados: [5, 8],
            criterioRubrica: "Herencia, clases abstractas y polimorfismo",
            ponderacion: 10,
            preguntaDefensa:
              "¿Qué decide el compilador y qué decide la JVM cuando llamás `vehiculo.toString()`? ¿Dónde está el `instanceof` en esta llamada?",
            escenariosLiveCoding: [
              {
                id: "lc-07-a",
                titulo: "Agregar una cuarta categoría",
                consigna:
                  "Crear `Bicicleta extends Vehiculo` con un campo `tipoCuadro` y hacer que el listado la muestre sin tocar `Main`.",
                pistas: [
                  "Necesitás una constante nueva en `TipoVehiculo`.",
                  "Sobrescribí `getTipoVehiculo()` y `toString()` como en las otras tres.",
                ],
                solucion: `// En TipoVehiculo: BICICLETA

public class Bicicleta extends Vehiculo {
    private String tipoCuadro;

    public Bicicleta(..., String tipoCuadro)
            throws DatoVehiculoInvalidoException {
        super(...);
        validarNoNulo(tipoCuadro, "tipoCuadro");
        this.tipoCuadro = tipoCuadro;
    }

    @Override
    public TipoVehiculo getTipoVehiculo() {
        return TipoVehiculo.BICICLETA;
    }

    @Override
    public String toString() {
        return getTipoVehiculo() + "{" + descripcionComun()
                + ", tipoCuadro=" + tipoCuadro + "}";
    }
}`,
                resultadoEsperado:
                  "El listado de `Main` no se modifica: recorre `List<Vehiculo>` y llama a `toString()`. El codec sí necesitará una rama nueva (lección 16).",
                minutos: 5,
              },
              {
                id: "lc-07-b",
                titulo: "Depreciación según estilo",
                consigna:
                  "Hacer que `Motocicleta` calcule su valor con 10 % menos si el estilo es `SCOOTER`.",
                pistas: [
                  "Sobrescribí `calcularValorComercial()`; la interfaz ya lo declara.",
                  "Usá el getter `getEstilo()`.",
                ],
                solucion: `@Override
public double calcularValorComercial() {
    if (getEstilo() == EstiloMotocicleta.SCOOTER) {
        return getValorComercial() * 0.90;
    }
    return getValorComercial();
}`,
                resultadoEsperado:
                  "Una moto SCOOTER de 100 cotiza 90; las demás siguen en 100. Ningún `if` aparece en el servicio.",
                minutos: 3,
              },
            ],
          },
        },
      ],
    },

    {
      id: "etapa-3",
      numero: 3,
      titulo: "Gestión en memoria y tipado seguro",
      bajada:
        "Con el modelo cerrado, el sistema necesita guardar muchas unidades, buscarlas rápido y reconocer cuándo dos referencias representan la misma entidad.",
      prerrequisito: "Etapa 2: jerarquía completa y métodos polimórficos.",
      lecciones: [
        {
          id: "leccion-08",
          numero: 8,
          titulo: "El stock en memoria: List, Map y copia defensiva",
          commit: "ad96c05",
          issue: 8,
          archivos: ["src/negocio/servicio/ConcesionariaService.java"],
          conceptos: ["List", "Map", "copia defensiva", "inyección de dependencias"],
          problema: {
            necesidad:
              "El stock debe recorrerse en orden para listarlo y buscarse por identificador para dar de alta, modificar o bajar. Necesitamos dos estructuras con propósitos distintos.",
            contexto:
              "Issue #8. Hasta acá había entidades sueltas; aparece el servicio que coordina casos de uso.",
            consecuenciaSiNoExiste:
              "Buscar por id sería un recorrido lineal en cada operación y la vista tendría acceso directo a la colección mutable del servicio.",
          },
          fundamentoTeorico: {
            concepto: "Colecciones tipadas y encapsulamiento de colecciones",
            explicacion: [
              "Una `List<T>` mantiene orden y permite duplicados; un `Map<K,V>` asocia una clave única con un valor y da acceso rápido por clave. Declarar la variable por la interfaz (`List<Vehiculo>`) y crear la implementación (`new ArrayList<>()`) desacopla el código del tipo concreto.",
              "Exponer la lista interna sería romper el encapsulamiento: cualquier llamador podría hacer `clear()`. Por eso `listarTodos()` devuelve `new ArrayList<>(stock)`, una copia defensiva.",
              "El constructor con repositorio inyectado permite cambiar la persistencia sin modificar el servicio: es composición, no herencia.",
            ],
            aplicacionAlCaso:
              "`stock` guarda todas las unidades; `indice` mapea el `identificador` (String) a la misma instancia. `alta()` actualiza las dos; `baja()` quita de las dos.",
            errorFrecuente:
              "Devolver `stock` directamente desde `listarTodos()`. El compilador no avisa, pero el servicio pierde el control de su estado.",
          },
          implementacionCodigo: {
            introduccion:
              "El servicio declara las colecciones por interfaz, las crea en el constructor y mantiene ambas sincronizadas en cada caso de uso.",
            fragmentos: [
              {
                id: "lz8-colecciones",
                archivo: "src/negocio/servicio/ConcesionariaService.java",
                lineas: "28-35",
                codigo: `    /** Repositorio encargado de la persistencia del stock. */
    private final RepositorioGenerico<Vehiculo, String> repositorio;

    /** Colección de trabajo con todo el stock en memoria. */
    private final List<Vehiculo> stock;

    /** Índice por identificador para acceso rápido y detección de duplicados. */
    private final Map<String, Vehiculo> indice;`,
                comentarios: [
                  {
                    linea: 29,
                    texto: "El repositorio es un contrato genérico (lección 9), no una implementación de archivo.",
                  },
                  {
                    linea: 32,
                    texto: "`List<Vehiculo>`: declarado por interfaz, sin raw types.",
                  },
                  {
                    linea: 35,
                    texto: "`Map<String, Vehiculo>`: la clave es el identificador inmutable de la lección 3.",
                  },
                ],
                conexionAnterior:
                  "Las dos colecciones guardan referencias `Vehiculo`, el tipo abstracto de la etapa 2.",
              },
              {
                id: "lz8-constructor",
                archivo: "src/negocio/servicio/ConcesionariaService.java",
                lineas: "41-59",
                codigo: `    public ConcesionariaService() {
        this(new RepositorioVehiculos());
    }
...
    public ConcesionariaService(RepositorioGenerico<Vehiculo, String> repositorio) {
        if (repositorio == null) {
            throw new IllegalArgumentException("El repositorio es obligatorio.");
        }
        this.repositorio = repositorio;
        this.stock = new ArrayList<>();
        this.indice = new HashMap<>();
    }`,
                comentarios: [
                  {
                    linea: 41,
                    texto: "Constructor por defecto: usa el repositorio de archivo, pero no lo hardcodea en la vista.",
                  },
                  {
                    linea: 52,
                    texto: "Constructor con inyección: el llamador decide qué repositorio usar.",
                  },
                  {
                    linea: 57,
                    texto: "Se crean las implementaciones concretas; las referencias siguen siendo interfaz.",
                  },
                ],
                conexionAnterior:
                  "Prepara el terreno para la etapa 5: el repositorio se estudiará recién allí.",
              },
              {
                id: "lz8-alta",
                archivo: "src/negocio/servicio/ConcesionariaService.java",
                lineas: "93-105,144-146",
                codigo: `    public void alta(Vehiculo vehiculo)
            throws DatoVehiculoInvalidoException, VehiculoDuplicadoException, IOException {
        if (vehiculo == null) {
            throw new DatoVehiculoInvalidoException("El vehículo es obligatorio.");
        }
        if (indice.containsKey(vehiculo.getIdentificador())) {
            throw new VehiculoDuplicadoException(
                    "Ya existe un vehículo con el identificador " + vehiculo.getIdentificador() + ".");
        }
        repositorio.guardar(vehiculo);
        stock.add(vehiculo);
        indice.put(vehiculo.getIdentificador(), vehiculo);
    }
...
    public List<Vehiculo> listarTodos() {
        return new ArrayList<>(stock);
    }`,
                comentarios: [
                  {
                    linea: 98,
                    texto: "El `Map` resuelve el duplicado en acceso rápido, sin recorrer la lista.",
                  },
                  {
                    linea: 102,
                    texto: "Primero persiste; si falla la E/S, no se agrega nada en memoria.",
                  },
                  {
                    linea: 145,
                    texto: "Copia defensiva: el llamador puede modificar su copia sin afectar el stock.",
                  },
                ],
                conexionAnterior:
                  "Usa `getIdentificador()` (lección 3) y las excepciones propias que se detallan en la lección 11.",
              },
            ],
            recorrido: [
              "Declarar `List<Vehiculo>` y `Map<String,Vehiculo>` por interfaz.",
              "Crear `ArrayList` y `HashMap` en el constructor.",
              "Mantener ambas estructuras sincronizadas en alta, baja y carga.",
              "Devolver copias en los métodos de consulta.",
            ],
          },
          decisionesYColoquio: {
            decision: "Lista para recorrer + mapa para buscar, con el identificador como clave estable.",
            alternativas: [
              {
                opcion: "Solo `List` y búsqueda lineal",
                porQueSeDescarto:
                  "Cada alta o modificación recorrería todo el stock para detectar duplicados; simple pero innecesariamente costoso.",
              },
              {
                opcion: "Solo `Map` y ordenar al listar",
                porQueSeDescarto:
                  "El `HashMap` no garantiza orden y obligaría a ordenar en cada consulta; la lista conserva el orden de carga.",
              },
            ],
            justificacion:
              "Dos estructuras con responsabilidades claras, ambas tipadas y encapsuladas. Es el eje 10 de la rúbrica y una pregunta clásica de defensa.",
            ejeRubrica: 10,
            ejesRelacionados: [2, 3],
            criterioRubrica: "Colecciones y sobrescritura de métodos",
            ponderacion: 10,
            preguntaDefensa:
              "¿Por qué `listarTodos()` devuelve una copia? ¿Qué pasaría si devolviera `stock` y la vista hiciera `clear()`?",
            escenariosLiveCoding: [
              {
                id: "lc-08-a",
                titulo: "Conservar el orden de carga",
                consigna: "Cambiar el `HashMap` por `LinkedHashMap` para listar en orden de inserción.",
                pistas: [
                  "Agregá `import java.util.LinkedHashMap;`.",
                  "La referencia sigue siendo `Map<String,Vehiculo>`.",
                ],
                solucion: `import java.util.LinkedHashMap;

this.indice = new LinkedHashMap<>();`,
                resultadoEsperado:
                  "El tipo declarado no cambia: es la ventaja de programar contra la interfaz.El `stock` ya mantenía el orden, así que el cambio es cosmético pero defendible.",
                minutos: 3,
              },
              {
                id: "lc-08-b",
                titulo: "Duplicados con putIfAbsent",
                consigna:
                  "Simplificar la detección de duplicados en `cargar()` usando `putIfAbsent`.",
                pistas: [
                  "`putIfAbsent` devuelve el valor anterior, o `null` si no existía.",
                  "Recordá lanzar `VehiculoDuplicadoException` si ya estaba.",
                ],
                solucion: `for (Vehiculo vehiculo : repositorio.listarTodos()) {
    Vehiculo anterior = indice.putIfAbsent(vehiculo.getIdentificador(), vehiculo);
    if (anterior == null) {
        stock.add(vehiculo);
    } else {
        throw new VehiculoDuplicadoException(
                "Identificador repetido: " + vehiculo.getIdentificador() + ".");
    }
}`,
                resultadoEsperado:
                  "El `Map` hace de guardián de la unicidad y la lista solo crece cuando el id es nuevo. Hay que agregar `throws VehiculoDuplicadoException` a `cargar()`.",
                minutos: 5,
              },
            ],
          },
        },
        {
          id: "leccion-09",
          numero: 9,
          titulo: "Genéricos: un repositorio para cualquier entidad",
          commit: "9f2f037",
          issue: 7,
          archivos: [
            "src/negocio/persistencia/RepositorioGenerico.java",
            "src/diseno/EntradaConsola.java",
            "src/negocio/persistencia/VehiculoCodec.java",
          ],
          conceptos: ["genéricos", "parámetros de tipo", "bounds", "sin raw types"],
          problema: {
            necesidad:
              "El almacenamiento siempre hace las mismas cuatro cosas (guardar, buscar, listar, eliminar), pero el tipo de entidad y de clave puede cambiar. Había que escribir el contrato una sola vez.",
            contexto:
              "Issue #7. Aparece el paquete `negocio.persistencia` y su interfaz parametrizada.",
            consecuenciaSiNoExiste:
              "Habría un repositorio por tipo con casts inseguros y lógica duplicada; el compilador no podría ayudar a detectar errores de tipo.",
          },
          fundamentoTeorico: {
            concepto: "Genéricos y límites de tipo",
            explicacion: [
              "Un parámetro de tipo (`<T, ID>`) se resuelve en tiempo de compilación: `RepositorioGenerico<Vehiculo, String>` solo acepta `Vehiculo` y devuelve `Vehiculo`, sin casteos.",
              "`<E extends Enum<E>>` es un límite (bound): el tipo debe ser un enum. Permite llamar a `Enum.valueOf(tipo, campo)` con seguridad porque `E` hereda de `Enum<E>`.",
              "Los comodines y raw types se evitan: el proyecto declara siempre el tipo concreto en la referencia y en la implementación.",
            ],
            aplicacionAlCaso:
              "El servicio usa `RepositorioGenerico<Vehiculo, String>`; la consola y el codec usan el mismo patrón `<E extends Enum<E>>` para parsear `Carroceria`, `CondicionVehiculo` y `TipoVehiculo`.",
            errorFrecuente:
              "Escribir `RepositorioGenerico` sin parámetros (raw type). Compila con warning y abre la puerta a `ClassCastException`.",
          },
          implementacionCodigo: {
            introduccion:
              "Tres usos del mismo concepto en tres capas distintas: contrato de persistencia, entrada de consola y decodificación del archivo.",
            fragmentos: [
              {
                id: "lz9-repo",
                archivo: "src/negocio/persistencia/RepositorioGenerico.java",
                lineas: "12-24",
                codigo: ` * @param <T>  tipo de entidad gestionada
 * @param <ID> tipo de la clave de identidad
 */
public interface RepositorioGenerico<T, ID> {
...
    void guardar(T entidad) throws IOException, VehiculoDuplicadoException;`,
                comentarios: [
                  {
                    linea: 15,
                    texto: "Dos parámetros: la entidad y el tipo de su clave. JavaDoc documenta ambos.",
                  },
                  {
                    linea: 24,
                    texto: "`T entidad` tipado: no hace falta castear al recuperar del repositorio.",
                  },
                ],
                conexionAnterior:
                  "El servicio de la lección 8 ya lo usaba; ahora se muestra su definición.",
              },
              {
                id: "lz9-consola",
                archivo: "src/diseno/EntradaConsola.java",
                lineas: "89-98",
                codigo: `    public <E extends Enum<E>> E leerEnum(String mensaje, Class<E> tipo)
            throws DatoVehiculoInvalidoException {
        String texto = leerTexto(mensaje).toUpperCase(Locale.ROOT);
        try {
            return Enum.valueOf(tipo, texto);
        } catch (IllegalArgumentException causa) {
            throw new DatoVehiculoInvalidoException(
                    "Valor inválido. Opciones: " + listarConstantes(tipo), causa);
        }
    }`,
                comentarios: [
                  {
                    linea: 89,
                    texto: "Método genérico: el parámetro `tipo` decide el tipo de retorno `E`.",
                  },
                  {
                    linea: 91,
                    texto: "`Locale.ROOT` evita que un locale turco transforme la `i` de forma distinta.",
                  },
                  {
                    linea: 93,
                    texto: "`Enum.valueOf` devuelve `E` sin cast: el bound garantiza que es un enum.",
                  },
                ],
                conexionAnterior:
                  "Usa los enums de la lección 1 y lanza la excepción de la lección 11.",
              },
              {
                id: "lz9-codec",
                archivo: "src/negocio/persistencia/VehiculoCodec.java",
                lineas: "242-249",
                codigo: `    private static <E extends Enum<E>> E parsearEnum(Class<E> tipo, String campo, String nombre)
            throws IOException {
        try {
            return Enum.valueOf(tipo, campo);
        } catch (IllegalArgumentException causa) {
            throw new IOException("Valor inválido para " + nombre + ": " + campo, causa);
        }
    }`,
                comentarios: [
                  {
                    linea: 242,
                    texto: "Mismo bound que en la consola: un solo helper para los cuatro enums del archivo.",
                  },
                  {
                    linea: 247,
                    texto: "El fallo de parseo se traduce a `IOException` con el nombre del campo, no se traga.",
                  },
                ],
                conexionAnterior:
                  "Prepara el parseo del registro de texto que se verá en la lección 16.",
              },
            ],
            recorrido: [
              "Identificar operaciones repetidas independientes del tipo.",
              "Declarar `interface RepositorioGenerico<T, ID>`.",
              "Usar parámetros de tipo en la interfaz y en el servicio.",
              "Aplicar bounds donde se requiere un enum.",
            ],
          },
          decisionesYColoquio: {
            decision: "Un contrato parametrizado en vez de una interfaz específica por entidad.",
            alternativas: [
              {
                opcion: "Interfaz `RepositorioVehiculos` con métodos concretos",
                porQueSeDescarto:
                  "Si mañana aparece `Cliente`, habría que copiar el contrato; los genéricos resuelven eso sin cast.",
              },
              {
                opcion: "Usar `Object` y castear en el servicio",
                porQueSeDescarto:
                  "Traslada errores de tipo a ejecución y obliga a escribir casts en cada llamada.",
              },
            ],
            justificacion:
              "Es el eje 12 y uno de los puntos que más se pregunta en defensa: hay que poder explicar `<T, ID>` y `<E extends Enum<E>>` sin mirar el código.",
            ejeRubrica: 12,
            ejesRelacionados: [9, 11],
            criterioRubrica: "Uso de genéricos",
            ponderacion: 10,
            preguntaDefensa:
              "¿Qué significa `<E extends Enum<E>>` y por qué `Enum.valueOf` devuelve `E` sin necesidad de un cast?",
            escenariosLiveCoding: [
              {
                id: "lc-09-a",
                titulo: "Repositorio para otra entidad",
                consigna:
                  "Declarar un `RepositorioGenerico<Cliente, Long>` y mostrar que los métodos quedan tipados.",
                pistas: [
                  "La clase `Cliente` puede ser un esqueleto con un campo `Long id`.",
                  "No hace falta implementar el repositorio, solo la referencia.",
                ],
                solucion: `public class Cliente {
    private Long id;
    // getters y setters
}

RepositorioGenerico<Cliente, Long> repositorioClientes;
// repositorioClientes.guardar(cliente);
// Cliente c = repositorioClientes.buscarPorId(1L);`,
                resultadoEsperado:
                  "No aparece ningún cast. Si se pasara un `Vehiculo` a `guardar`, el compilador lo rechazaría.",
                minutos: 3,
              },
              {
                id: "lc-09-b",
                titulo: "Helper genérico para parsear",
                consigna:
                  "Agregar `parsearEnumSeguro(Class<E>, String)` que devuelva `null` si el texto no es una constante, y explicar por qué NO conviene acá.",
                pistas: [
                  "El proyecto prohíbe valores centinela ambiguos.",
                  "La versión real lanza `IOException` con el nombre del campo.",
                ],
                solucion: `private static <E extends Enum<E>> E parsearEnumSeguro(
        Class<E> tipo, String campo) {
    for (E constante : tipo.getEnumConstants()) {
        if (constante.name().equals(campo)) {
            return constante;
        }
    }
    return null; // NO usar: oculta el error
}

// Preferido:
return Enum.valueOf(tipo, campo); // lanza IllegalArgumentException`,
                resultadoEsperado:
                  "La discusión es el punto: devolver `null` ocultaría un registro corrupto; por eso el código real lanza excepción.",
                minutos: 5,
              },
            ],
          },
        },
        {
          id: "leccion-10",
          numero: 10,
          titulo: "equals, hashCode y toString: la identidad del vehículo",
          commit: "2ee78a0",
          issue: 4,
          archivos: [
            "src/negocio/modelo/Vehiculo.java",
            "src/negocio/modelo/Auto.java",
            "src/negocio/servicio/ConcesionariaService.java",
          ],
          conceptos: ["equals(Object)", "hashCode", "contrato", "toString"],
          problema: {
            necesidad:
              "Con dos estructuras guardando la misma instancia, había que definir cuándo dos objetos 'son el mismo'. Y hacía falta una ficha legible para depurar y para el listado de consola.",
            contexto:
              "Issue #4. La jerarquía ya estaba cerrada; faltaba el contrato de igualdad heredado de `Object`.",
            consecuenciaSiNoExiste:
              "`contains`, `remove` y las claves de `HashMap` usarían la identidad de memoria (la implementación por defecto de `Object`), y `System.out.println(vehiculo)` mostraría `Auto@1b6d3586`.",
          },
          fundamentoTeorico: {
            concepto: "Contrato equals/hashCode",
            explicacion: [
              "`equals` debe ser reflexivo, simétrico, transitivo, consistente y devolver `false` ante `null`. `hashCode` debe devolver el mismo valor para objetos iguales.",
              "Si dos objetos iguales tienen hashes distintos, un `HashMap` no los encuentra. Si `equals` cambia después de insertar la clave, el objeto queda 'perdido' dentro del mapa.",
              "Por eso la identidad se apoya en `identificador`, que es `final`. La comparación usa `getClass() != obj.getClass()` para exigir la misma clase concreta: un Auto y una Camioneta con la misma patente no se consideran iguales.",
              "`toString()` no es identidad: es una representación legible para diagnóstico y se sobrescribe en cada subclase para sumar su campo específico.",
            ],
            aplicacionAlCaso:
              "`equals` compara solo `identificador` con `Objects.equals`; `hashCode` usa `Objects.hashCode(identificador)`. El `Map` del servicio usa el String del identificador como clave, no el objeto `Vehiculo`, así que el riesgo de clave mutable es menor todavía.",
            errorFrecuente:
              "Incluir campos mutables como `valorComercial` en `equals`: modificar el precio cambiaría la igualdad y rompería colecciones.",
          },
          implementacionCodigo: {
            introduccion:
              "La base resuelve igualdad y hash; las subclases solo extienden la representación textual.",
            fragmentos: [
              {
                id: "lz10-equals",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "240-263",
                codigo: `    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Vehiculo otro = (Vehiculo) obj;
        return Objects.equals(identificador, otro.identificador);
    }
...
    @Override
    public int hashCode() {
        return Objects.hashCode(identificador);
    }`,
                comentarios: [
                  {
                    linea: 242,
                    texto: "Atajo de identidad de memoria: si son la misma referencia, son iguales.",
                  },
                  {
                    linea: 245,
                    texto: "Cubre `null` y exige la misma clase concreta; evita simetría rota entre subclases.",
                  },
                  {
                    linea: 249,
                    texto: "`Objects.equals` tolera `null`; acá el identificador ya se validó no vacío, pero es robusto.",
                  },
                  {
                    linea: 262,
                    texto: "Mismo campo que `equals`: cumple el contrato hash/equals.",
                  },
                ],
                conexionAnterior:
                  "Usa el `identificador final` de la lección 3: por eso es seguro como clave.",
              },
              {
                id: "lz10-toString",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "311-314",
                codigo: `    @Override
    public String toString() {
        return getTipoVehiculo() + "{" + descripcionComun() + "}";
    }`,
                comentarios: [
                  {
                    linea: 313,
                    texto: "Representación legible; no se usa como formato de persistencia (eso es el codec).",
                  },
                ],
                conexionAnterior:
                  "El `getTipoVehiculo()` polimórfico de la lección 5 decide el prefijo del texto.",
              },
              {
                id: "lz10-subclase",
                archivo: "src/negocio/modelo/Auto.java",
                lineas: "63-67",
                codigo: `    @Override
    public String toString() {
        return getTipoVehiculo() + "{" + descripcionComun()
                + ", carroceria=" + carroceria + "}";
    }`,
                comentarios: [
                  {
                    linea: 64,
                    texto: "Extiende la representación sin tocar `equals`: la identidad no depende de la carrocería.",
                  },
                ],
                conexionAnterior:
                  "Es el mismo patrón que usan Camioneta y Motocicleta con su campo propio.",
              },
            ],
            recorrido: [
              "Elegir un campo inmutable como identidad.",
              "Implementar `equals(Object)` con los cinco puntos del contrato.",
              "Usar exactamente el mismo campo en `hashCode()`.",
              "Sobrescribir `toString()` para diagnóstico, no para persistencia.",
            ],
          },
          decisionesYColoquio: {
            decision: "Identidad por identificador inmutable y comparación estricta por clase concreta.",
            alternativas: [
              {
                opcion: "Igualdad por todos los atributos",
                porQueSeDescarto:
                  "Cambiar el precio o el color cambiaría la igualdad y rompería `HashSet`/`HashMap`; además dos unidades con la misma patente deberían ser la misma aunque difiera el precio.",
              },
              {
                opcion: "Usar `instanceof Vehiculo` en vez de `getClass()`",
                porQueSeDescarto:
                  "Permitiría que un Auto y una Camioneta con igual patente sean iguales, y la simetría dependería de qué lado llame a `equals`.",
              },
            ],
            justificacion:
              "Es el contrato clásico de `Object` y responde al eje 10. El `Map` usa el String como clave, así que la identidad del objeto queda para listas y comparaciones.",
            ejeRubrica: 10,
            ejesRelacionados: [3, 8],
            criterioRubrica: "Colecciones y sobrescritura de métodos",
            ponderacion: 10,
            preguntaDefensa:
              "¿Por qué `equals` usa `getClass()` y el `Map` usa `String` como clave? ¿Qué pasaría si `identificador` no fuera `final`?",
            escenariosLiveCoding: [
              {
                id: "lc-10-a",
                titulo: "Clave mutable dentro de un HashSet",
                consigna:
                  "Explicar con código por qué un campo mutable rompe un `HashSet`, y comprobar que acá no pasa.",
                pistas: [
                  "El hash se calcula al insertar; cambiar el campo cambia el hash.",
                  "`identificador` no tiene setter.",
                ],
                solucion: `// Peligroso si el campo usado en hashCode cambiara:
Vehiculo v = nuevoAutoConId("AA123BB");
Set<Vehiculo> set = new HashSet<>();
set.add(v);
// v.setIdentificador("ZZ999ZZ"); // NO existe: field es final
System.out.println(set.contains(v)); // true

// Con un campo mutable sí fallaría: el objeto quedaría
// en un bucket viejo y contains devolvería false.`,
                resultadoEsperado:
                  "La respuesta oral es lo importante: el `final` protege el contrato. El `Map` del servicio usa el String inmutable como clave.",
                minutos: 4,
              },
              {
                id: "lc-10-b",
                titulo: "toString sin datos sensibles",
                consigna:
                  "Quitar `valorComercial` de `descripcionComun()` para no exponer precios en logs, dejando `equals` intacto.",
                pistas: [
                  "`descripcionComun()` devuelve un String concatenado.",
                  "No tocar `equals` ni `hashCode`.",
                ],
                solucion: `protected String descripcionComun() {
    return "identificador=" + identificador
            + ", marca=" + marca
            + ", modelo=" + modelo
            + ", anio=" + anio
            + ", color=" + color
            + ", condicion=" + condicion
            + ", kilometraje=" + kilometraje;
}`,
                resultadoEsperado:
                  "Las tres fichas ya no muestran precio; la igualdad sigue dependiendo solo del identificador.",
                minutos: 3,
              },
            ],
          },
        },
      ],
    },

    {
      id: "etapa-4",
      numero: 4,
      titulo: "Arquitectura en capas y robustez",
      bajada:
        "El modelo ya es seguro; ahora se separa quién decide del quién muestra, y se blindan los puntos donde el usuario puede equivocarse.",
      prerrequisito: "Etapas 1 a 3: modelo, jerarquía y servicios con colecciones.",
      lecciones: [
        {
          id: "leccion-11",
          numero: 11,
          titulo: "Excepciones propias: fallos recuperables del dominio",
          commit: "112c9a4",
          issue: 3,
          archivos: [
            "src/negocio/excepciones/DatoVehiculoInvalidoException.java",
            "src/negocio/excepciones/VehiculoDuplicadoException.java",
            "src/negocio/excepciones/VehiculoNoEncontradoException.java",
            "src/negocio/excepciones/package-info.java",
          ],
          conceptos: ["excepción checked", "extends Exception", "causa", "traducción en la vista"],
          problema: {
            necesidad:
              "Había errores esperables —dato inválido, patente repetida, id inexistente— que no deberían terminar el programa ni disfrazarse de `null`. El sistema necesitaba un vocabulario de errores propio.",
            contexto:
              "Issue #3. Se crea el paquete `negocio.excepciones` antes de que exista la consola, para que modelo y servicio puedan lanzarlas.",
            consecuenciaSiNoExiste:
              "El servicio devolvería `null` o un booleano ambiguo y la vista no podría distinguir 'no encontrado' de 'falló el archivo'.",
          },
          fundamentoTeorico: {
            concepto: "Excepciones checked y excepciones propias",
            explicacion: [
              "Una excepción checked hereda de `Exception` (no de `RuntimeException`) y obliga al llamador a declarar `throws` o atraparla. Eso hace explícito en la firma qué puede fallar.",
              "Cada excepción propia tiene dos constructores: uno con mensaje y otro con mensaje más `Throwable causa`, para conservar el error original al traducir un `NumberFormatException` en un error de dominio.",
              "La separación de capas se respeta: el modelo y el servicio lanzan; la capa Diseño decide el mensaje para el usuario. Nunca se usa `catch (Exception e) {}` ni un mensaje de éxito falso.",
            ],
            aplicacionAlCaso:
              "`DatoVehiculoInvalidoException` sale de los validadores; `VehiculoDuplicadoException` de `alta()` y del repositorio; `VehiculoNoEncontradoException` de búsquedas y bajas. `Main` las atrapa por tipo y muestra `No se pudo...`.",
            errorFrecuente:
              "Atrapar `Exception` genérico en la vista: mezcla errores de negocio con fallos de E/S y pierde el mensaje específico.",
          },
          implementacionCodigo: {
            introduccion:
              "Las tres clases tienen la misma forma: heredan de `Exception`, declaran `serialVersionUID` y ofrecen dos constructores.",
            fragmentos: [
              {
                id: "lz11-dato",
                archivo: "src/negocio/excepciones/DatoVehiculoInvalidoException.java",
                lineas: "10-33",
                codigo: `public class DatoVehiculoInvalidoException extends Exception {

    /** Versión de la clase para serialización. */
    private static final long serialVersionUID = 1L;
...
    public DatoVehiculoInvalidoException(String mensaje) {
        super(mensaje);
    }
...
    public DatoVehiculoInvalidoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}`,
                comentarios: [
                  {
                    linea: 10,
                    texto: "`extends Exception` la hace checked: la firma del método que la lanza debe declararla.",
                  },
                  {
                    linea: 13,
                    texto: "`serialVersionUID` estabiliza la versión si la excepción atraviesa serialización.",
                  },
                  {
                    linea: 30,
                    texto: "El segundo constructor conserva la causa: clave para traducir parseos sin perder el origen.",
                  },
                ],
                conexionAnterior:
                  "Es la excepción que ya lanzaban los validadores de las lecciones 3 y 4.",
              },
              {
                id: "lz11-duplicado",
                archivo: "src/negocio/excepciones/VehiculoDuplicadoException.java",
                lineas: "10-33",
                codigo: `public class VehiculoDuplicadoException extends Exception {

    /** Versión de la clase para serialización. */
    private static final long serialVersionUID = 1L;
...
    public VehiculoDuplicadoException(String mensaje) {
        super(mensaje);
    }
...
    public VehiculoDuplicadoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}`,
                comentarios: [
                  {
                    linea: 10,
                    texto: "Error de negocio distinto al dato inválido: la identidad ya existe.",
                  },
                  {
                    linea: 20,
                    texto: "Mensaje descriptivo; el servicio agrega el identificador repetido.",
                  },
                ],
                conexionAnterior:
                  "Aparece en `alta()` (lección 8) y en `guardar()` del repositorio (lección 15).",
              },
              {
                id: "lz11-paquete",
                archivo: "src/negocio/excepciones/package-info.java",
                lineas: "1-7",
                codigo: `/**
 * Excepciones propias del dominio de la concesionaria.
 *
 * <p>Pertenece a la capa Negocio. Los errores recuperables se lanzan desde el
 * modelo o el servicio y se traducen a mensajes claros en la capa Diseño.</p>
 */
package negocio.excepciones;`,
                comentarios: [
                  {
                    linea: 4,
                    texto: "El JavaDoc de paquete deja explícita la regla de dependencia entre capas.",
                  },
                ],
                conexionAnterior:
                  "Documenta la decisión que la consola aplicará en la lección 14.",
              },
            ],
            recorrido: [
              "Enumerar los errores recuperables del negocio.",
              "Crear una clase por error, heredando de `Exception`.",
              "Agregar constructor con causa para traducir errores técnicos.",
              "Lanzar en modelo/servicio y atrapar solo en Diseño.",
            ],
          },
          decisionesYColoquio: {
            decision: "Excepciones checked propias, una por situación de error, con preservación de causa.",
            alternativas: [
              {
                opcion: "Devolver `null` cuando no se encuentra",
                porQueSeDescarto:
                  "Obliga a cada llamador a acordarse de chequear y confunde 'no existe' con 'hubo un fallo'.",
              },
              {
                opcion: `Lanzar RuntimeException genérica`,
                porQueSeDescarto:
                  "No aparece en la firma, sorprende al llamador y pierde el significado de dominio.",
              },
            ],
            justificacion:
              "Es el eje 6. Además obliga a la vista a traducir cada error con un mensaje distinto, que es lo que se evalúa en 'interfaz de consola y data-entry'.",
            ejeRubrica: 6,
            ejesRelacionados: [2, 8],
            criterioRubrica: "Tratamiento de excepciones propias",
            ponderacion: 10,
            preguntaDefensa:
              "¿Para qué sirve el constructor con `Throwable causa`? Mostrá dónde se usa al traducir un `NumberFormatException`.",
            escenariosLiveCoding: [
              {
                id: "lc-11-a",
                titulo: "Nueva excepción de stock vacío",
                consigna:
                  "Crear `StockVacioException` y lanzarla desde un método `listarTodos()` que no debe devolver una lista vacía sin avisar.",
                pistas: [
                  "Misma forma que las otras: `extends Exception`, `serialVersionUID`, dos constructores.",
                  "El servicio debe declarar `throws StockVacioException`.",
                ],
                solucion: `public class StockVacioException extends Exception {
    private static final long serialVersionUID = 1L;

    public StockVacioException(String mensaje) {
        super(mensaje);
    }
}

// En ConcesionariaService:
public List<Vehiculo> listarTodos() throws StockVacioException {
    if (stock.isEmpty()) {
        throw new StockVacioException("No hay unidades cargadas.");
    }
    return new ArrayList<>(stock);
}`,
                resultadoEsperado:
                  "Hay que actualizar `Main.mostrarListado` y todos los llamadores: las excepciones checked fuerzan a decidir qué hacer.",
                minutos: 5,
              },
              {
                id: "lc-11-b",
                titulo: "Traducir el duplicado en la vista",
                consigna:
                  "Mostrar un mensaje distinto para `VehiculoDuplicadoException` y para `IOException` en `darDeAlta()`.",
                pistas: [
                  "Ya existe un `catch` múltiple para las excepciones de dominio.",
                  "`IOException` se escribe en `System.err` en el código actual.",
                ],
                solucion: `} catch (VehiculoDuplicadoException causa) {
    System.out.println("Patente repetida. Revisá el identificador: "
            + causa.getMessage());
} catch (DatoVehiculoInvalidoException causa) {
    System.out.println("Dato inválido: " + causa.getMessage());
} catch (IOException causa) {
    System.err.println("No se pudo guardar: " + causa.getMessage());
}`,
                resultadoEsperado:
                  "El usuario entiende qué pasó sin ver detalles técnicos, y no se imprime un éxito falso.",
                minutos: 3,
              },
            ],
          },
        },
        {
          id: "leccion-12",
          numero: 12,
          titulo: "Blindar el modelo: validadores privados e invariantes",
          commit: "112c9a4",
          issue: 3,
          archivos: [
            "src/negocio/modelo/Vehiculo.java",
            "src/negocio/modelo/Auto.java",
          ],
          conceptos: ["invariante", "método private static", "validación centralizada"],
          problema: {
            necesidad:
              "Los setters permiten cambiar el estado después de construido el objeto. Si cada setter asignara sin chequear, un objeto válido podría degradarse.",
            contexto:
              "Mismo issue #3: se extraen cinco validadores de los constructores y se llaman desde todos los mutadores.",
            consecuenciaSiNoExiste:
              "`setKilometraje(0)` convertiría un usado en un estado prohibido sin que nadie lo notara hasta el próximo filtro.",
          },
          fundamentoTeorico: {
            concepto: "Validación centralizada y métodos privados estáticos",
            explicacion: [
              "Extraer la validación a métodos `private static` evita copiar el mismo `if` en el constructor y en cada setter. Si cambia la regla, se edita un solo lugar.",
              "El modelo no necesita estado para validar, por eso los métodos son `static`. Son `private` porque nadie fuera de la clase debe invocarlos.",
              "`validarNoNulo` es `protected static` porque lo usan las subclases para su campo específico: es la excepción deliberada a la regla de privacidad.",
            ],
            aplicacionAlCaso:
              "Constructor, `setMarca`, `setModelo`, `setAnio`, `setColor`, `setCondicion`, `setKilometraje` y `setValorComercial` pasan por los validadores. Las subclases validan `carroceria`/`estilo` con el helper protegido.",
            errorFrecuente:
              "Validar en el setter pero no en el constructor (o al revés): dejaría un camino para crear estados inválidos.",
          },
          implementacionCodigo: {
            introduccion:
              "El patrón es siempre el mismo: chequear, lanzar excepción propia, y solo después asignar.",
            fragmentos: [
              {
                id: "lz12-llamadas",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "57-64",
                codigo: `        validarTextoNoVacio(identificador, "identificador");
        validarTextoNoVacio(marca, "marca");
        validarTextoNoVacio(modelo, "modelo");
        validarAnio(anio);
        validarTextoNoVacio(color, "color");
        validarCondicion(condicion);
        validarKilometraje(condicion, kilometraje);
        validarValorComercial(valorComercial);`,
                comentarios: [
                  {
                    linea: 57,
                    texto: "Cada validador recibe el valor y el nombre del campo para el mensaje.",
                  },
                  {
                    linea: 63,
                    texto: "La coherencia condición/kilometraje se calcula con ambos parámetros juntos.",
                  },
                ],
                conexionAnterior:
                  "Son las mismas reglas de la lección 4, ahora invocadas desde el constructor de la lección 3.",
              },
              {
                id: "lz12-texto",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "338-344",
                codigo: `    private static void validarTextoNoVacio(String valor, String nombreCampo)
            throws DatoVehiculoInvalidoException {
        if (valor == null || valor.trim().isEmpty()) {
            throw new DatoVehiculoInvalidoException(
                    "El campo " + nombreCampo + " no puede estar vacío.");
        }
    }`,
                comentarios: [
                  {
                    linea: 340,
                    texto: "`trim().isEmpty()` rechaza también los strings que solo tienen espacios.",
                  },
                  {
                    linea: 341,
                    texto: "Mensaje claro y con nombre de campo: se muestra tal cual en la consola.",
                  },
                ],
                conexionAnterior:
                  "Complementa la validación sintáctica de `leerTexto()` (lección 13): una no reemplaza a la otra.",
              },
              {
                id: "lz12-valor",
                archivo: "src/negocio/modelo/Vehiculo.java",
                lineas: "402-409",
                codigo: `    private static void validarValorComercial(double valorComercial)
            throws DatoVehiculoInvalidoException {
        if (Double.isNaN(valorComercial) || Double.isInfinite(valorComercial)
                || valorComercial < 0) {
            throw new DatoVehiculoInvalidoException(
                    "El valor comercial debe ser un número finito mayor o igual que cero.");
        }
    }`,
                comentarios: [
                  {
                    linea: 404,
                    texto: "Con `double` hay que descartar NaN e infinito: `0` es válido, NaN no.",
                  },
                  {
                    linea: 408,
                    texto: "El mensaje explica el rango; no se usa un valor centinela.",
                  },
                ],
                conexionAnterior:
                  "Cuidado con el decimal que viene de `Double.parseDouble`: 'NaN' es parseable pero este validador lo rechaza.",
              },
              {
                id: "lz12-subclase",
                archivo: "src/negocio/modelo/Auto.java",
                lineas: "33-35",
                codigo: `        super(identificador, marca, modelo, anio, color, condicion, kilometraje, valorComercial);
        validarNoNulo(carroceria, "carroceria");
        this.carroceria = carroceria;`,
                comentarios: [
                  {
                    linea: 34,
                    texto: "`validarNoNulo` es `protected static` en la base: las subclases lo reutilizan.",
                  },
                ],
                conexionAnterior:
                  "Cierra la cadena de validación abierta en `super(...)` (lección 6).",
              },
            ],
            recorrido: [
              "Extraer cada regla a un método `private static`.",
              "Llamarlo desde el constructor y desde todos los setters relacionados.",
              "Usar `protected` solo para el helper que necesitan las subclases.",
              "Lanzar siempre la excepción propia con mensaje descriptivo.",
            ],
          },
          decisionesYColoquio: {
            decision: "Un validador por invariante, reutilizado en constructor y mutadores.",
            alternativas: [
              {
                opcion: "Validar en la capa Diseño antes de llamar al modelo",
                porQueSeDescarto:
                  "El archivo de texto también crea objetos y no pasa por la consola: la regla se saltaría.",
              },
              {
                opcion: "Un único método `validarTodo()` con muchos `if`",
                porQueSeDescarto:
                  "No permite reutilizar una sola regla desde un setter puntual y genera una función difícil de explicar.",
              },
            ],
            justificacion:
              "Cada validador es una frase que se puede defender en voz alta. Es la base del eje 6 y del requisito 'invariantes validadas en constructores y mutadores'.",
            ejeRubrica: 6,
            ejesRelacionados: [3, 7],
            criterioRubrica: "Tratamiento de excepciones propias",
            ponderacion: 10,
            preguntaDefensa:
              "¿Qué diferencia hay entre la validación de `EntradaConsola.leerEntero()` y la de `Vehiculo.validarAnio()`?",
            escenariosLiveCoding: [
              {
                id: "lc-12-a",
                titulo: "Colores permitidos",
                consigna:
                  "Agregar `validarColor` usando un `Set<String>` de colores permitidos y llamarlo desde `setColor`.",
                pistas: [
                  "`Set.of(...)` está en `java.util` y es inmutable.",
                  "Comparar en mayúsculas con `toUpperCase(Locale.ROOT)`.",
                ],
                solucion: `private static void validarColor(String color)
        throws DatoVehiculoInvalidoException {
    Set<String> permitidos = Set.of("BLANCO", "NEGRO", "GRIS", "ROJO", "AZUL");
    if (!permitidos.contains(color.toUpperCase(java.util.Locale.ROOT))) {
        throw new DatoVehiculoInvalidoException(
                "Color no permitido: " + color + ".");
    }
}`,
                resultadoEsperado:
                  "El setter queda `validarColor(color); this.color = color;`. La lista es cerrada y el error es del dominio.",
                minutos: 5,
              },
              {
                id: "lc-12-b",
                titulo: "¿Qué pasa si se quita la revalidación?",
                consigna:
                  "Quitar temporalmente la llamada a `validarKilometraje` dentro de `setCondicion` y explicar el estado inválido resultante.",
                pistas: [
                  "Un USADO con 0 km nace válido y se transforma en inválido.",
                  "La solución es restaurar la línea.",
                ],
                solucion: `public void setCondicion(CondicionVehiculo condicion)
        throws DatoVehiculoInvalidoException {
    validarCondicion(condicion);
    validarKilometraje(condicion, this.kilometraje); // <- no quitar
    this.condicion = condicion;
}`,
                resultadoEsperado:
                  "Sin esa línea, `usado.setCondicion(NUEVO)` dejaría un NUEVO con kilómetros. Es la definición de invariante rota por un mutador.",
                minutos: 4,
              },
            ],
          },
        },
        {
          id: "leccion-13",
          numero: 13,
          titulo: "Data-entry: Wrapper, parseo y mensajes claros",
          commit: "bca075b",
          issue: 9,
          archivos: ["src/diseno/EntradaConsola.java"],
          conceptos: ["Wrapper", "parseo", "AutoCloseable", "validación sintáctica"],
          problema: {
            necesidad:
              "Todo llega a la consola como `String`, pero el dominio necesita `int`, `double` y enums. Había que convertir sin perder caracteres entre lecturas y sin dejar que un typo rompa el menú.",
            contexto:
              "Issue #9. Se crea la capa `diseno` y dentro de ella un único lector compartido.",
            consecuenciaSiNoExiste:
              "Habría `Scanner` duplicados leyendo líneas distintas, `NumberFormatException` sin traducir y el menú se cortaría ante el primer error.",
          },
          fundamentoTeorico: {
            concepto: "Clases Wrapper y conversión controlada",
            explicacion: [
              "`Integer.parseInt` y `Double.parseDouble` son métodos de las clases Wrapper que convierten texto a tipos primitivos. Si el texto no es válido lanzan `NumberFormatException`: hay que atraparla y traducirla.",
              "`Enum.valueOf` hace lo mismo para los enums. El `Locale.ROOT` en `toUpperCase` evita comportamientos dependientes del idioma del sistema.",
              "Un solo `Scanner` evita perder caracteres: varios `Scanner` sobre `System.in` compiten por el buffer. `implements AutoCloseable` permite el try-with-resources en `Main`.",
            ],
            aplicacionAlCaso:
              "`leerTexto` recorta y valida no vacío; `leerEntero`, `leerDecimal`, `leerEnum` y `leerOpcion` se apoyan en él y traducen cada fallo a `DatoVehiculoInvalidoException`. No contiene reglas de negocio.",
            errorFrecuente:
              "Usar `nextInt()` y después `nextLine()`: el saldo de línea queda en el buffer y la siguiente lectura sale vacía. Acá siempre se lee la línea y se parsea.",
          },
          implementacionCodigo: {
            introduccion:
              "La clase concentra la lectura; cada método público hace una sola conversión y devuelve un tipo natural del dominio.",
            fragmentos: [
              {
                id: "lz13-scanner",
                archivo: "src/diseno/EntradaConsola.java",
                lineas: "20-30",
                codigo: `public class EntradaConsola implements AutoCloseable {

    /** Lector compartido de la entrada estándar. */
    private final Scanner lector;
...
    public EntradaConsola() {
        this.lector = new Scanner(System.in);
    }`,
                comentarios: [
                  {
                    linea: 20,
                    texto: "`AutoCloseable` habilita `try (...)` en `Main`; ninguna otra clase crea un `Scanner`.",
                  },
                  {
                    linea: 29,
                    texto: "Un único lector para todo el menú y todos los formularios.",
                  },
                ],
                conexionAnterior:
                  "Es la primera clase de `diseno`, el paquete que se estudia en la lección 14.",
              },
              {
                id: "lz13-texto",
                archivo: "src/diseno/EntradaConsola.java",
                lineas: "39-46",
                codigo: `    public String leerTexto(String mensaje) throws DatoVehiculoInvalidoException {
        System.out.print(mensaje);
        String valor = lector.nextLine();
        if (valor.trim().isEmpty()) {
            throw new DatoVehiculoInvalidoException("El campo no puede estar vacío.");
        }
        return valor.trim();
    }`,
                comentarios: [
                  {
                    linea: 41,
                    texto: "`nextLine()` consume la línea completa: evita el problema del saldo de `nextInt()`.",
                  },
                  {
                    linea: 42,
                    texto: "Validación sintáctica (formato), no de negocio: el modelo decidirá las invariantes.",
                  },
                ],
                conexionAnterior:
                  "Es la base de todos los demás métodos de lectura.",
              },
              {
                id: "lz13-enteros",
                archivo: "src/diseno/EntradaConsola.java",
                lineas: "55-62",
                codigo: `    public int leerEntero(String mensaje) throws DatoVehiculoInvalidoException {
        String texto = leerTexto(mensaje);
        try {
            return Integer.parseInt(texto);
        } catch (NumberFormatException causa) {
            throw new DatoVehiculoInvalidoException("Se esperaba un número entero.", causa);
        }
    }`,
                comentarios: [
                  {
                    linea: 58,
                    texto: "Wrapper `Integer.parseInt`: convierte a `int`, que es el tipo natural del dominio.",
                  },
                  {
                    linea: 60,
                    texto: "Traducción con causa: el error técnico se conserva pero el usuario ve un mensaje claro.",
                  },
                ],
                conexionAnterior:
                  "Mismo patrón que `parsearEntero` del codec (lección 16), pero con mensaje de consola.",
              },
              {
                id: "lz13-opcion",
                archivo: "src/diseno/EntradaConsola.java",
                lineas: "109-117",
                codigo: `    public int leerOpcion(String mensaje, int minimo, int maximo)
            throws DatoVehiculoInvalidoException {
        int opcion = leerEntero(mensaje);
        if (opcion < minimo || opcion > maximo) {
            throw new DatoVehiculoInvalidoException(
                    "La opción debe estar entre " + minimo + " y " + maximo + ".");
        }
        return opcion;
    }`,
                comentarios: [
                  {
                    linea: 111,
                    texto: "Reutiliza `leerEntero`: no parsea dos veces.",
                  },
                  {
                    linea: 112,
                    texto: "El rango es una validación de entrada; el menú decide los límites que corresponden.",
                  },
                ],
                conexionAnterior:
                  "`Main` usa este método con rangos 1-5 y 1-6 en los menús (lección 14).",
              },
            ],
            recorrido: [
              "Crear un único `Scanner` y hacer la clase `AutoCloseable`.",
              "Leer siempre una línea completa con `leerTexto()`.",
              "Parsear con Wrappers y atrapar `NumberFormatException`.",
              "Traducir todo fallo a `DatoVehiculoInvalidoException`.",
            ],
          },
          decisionesYColoquio: {
            decision: "Leer texto y parsear por separado, con un solo Scanner y excepción traducida.",
            alternativas: [
              {
                opcion: `Usar nextInt()/nextDouble() directamente`,
                porQueSeDescarto:
                  "Deja residuos en el buffer y lanza excepciones sin mensaje adaptado al usuario.",
              },
              {
                opcion: "Un `Scanner` por método",
                porQueSeDescarto:
                  "Cada uno consume de `System.in` y se pierden caracteres entre lecturas.",
              },
            ],
            justificacion:
              "Cubre Wrappers (eje 9) y data-entry (eje 8) con una clase pequeña y defendible; además respeta la regla de que `Scanner` solo existe en `diseno`.",
            ejeRubrica: 9,
            ejesRelacionados: [6, 8],
            criterioRubrica: "Modelado POJO/JavaBean y Wrappers",
            ponderacion: 5,
            preguntaDefensa:
              "¿Por qué no usar `lector.nextInt()`? ¿Qué pasa con el salto de línea y con un `NumberFormatException`?",
            escenariosLiveCoding: [
              {
                id: "lc-13-a",
                titulo: "Aceptar decimales con coma",
                consigna:
                  "Hacer que `leerDecimal` acepte '12,5' además de '12.5' sin cambiar el tipo de retorno.",
                pistas: [
                  "`String.replace(',', '.')` devuelve un String nuevo.",
                  "Después se usa `Double.parseDouble` como siempre.",
                ],
                solucion: `public double leerDecimal(String mensaje)
        throws DatoVehiculoInvalidoException {
    String texto = leerTexto(mensaje).replace(',', '.');
    try {
        return Double.parseDouble(texto);
    } catch (NumberFormatException causa) {
        throw new DatoVehiculoInvalidoException(
                "Se esperaba un número decimal.", causa);
    }
}`,
                resultadoEsperado:
                  "'12,5' y '12.5' devuelven 12.5; el dominio sigue recibiendo un `double`.",
                minutos: 3,
              },
              {
                id: "lc-13-b",
                titulo: "Lectura sí/no",
                consigna:
                  "Agregar `leerSiNo(String)` que devuelva `boolean` usando `Boolean.parseBoolean` y rechace cualquier otro texto.",
                pistas: [
                  "`Boolean.parseBoolean` devuelve false para cualquier cosa que no sea 'true'.",
                  "Por eso hay que validar el texto antes de parsear.",
                ],
                solucion: `public boolean leerSiNo(String mensaje)
        throws DatoVehiculoInvalidoException {
    String texto = leerTexto(mensaje).toLowerCase(java.util.Locale.ROOT);
    if (!texto.equals("s") && !texto.equals("si")
            && !texto.equals("n") && !texto.equals("no")) {
        throw new DatoVehiculoInvalidoException(
                "Respondé s/n o si/no.");
    }
    return Boolean.parseBoolean(
            texto.equals("s") || texto.equals("si") ? "true" : "false");
}`,
                resultadoEsperado:
                  "Se usa en la confirmación de baja de `Main`, reemplazando el `equalsIgnoreCase` repetido.",
                minutos: 4,
              },
            ],
          },
        },
        {
          id: "leccion-14",
          numero: 14,
          titulo: "Diseño contra Negocio: menú, formularios y servicios",
          commit: "bca075b",
          issue: 9,
          archivos: [
            "src/diseno/package-info.java",
            "src/diseno/Main.java",
            "src/diseno/FormulariosVehiculo.java",
            "src/negocio/servicio/package-info.java",
          ],
          conceptos: ["arquitectura en capas", "separación de responsabilidades", "inyección"],
          problema: {
            necesidad:
              "El usuario necesita un menú, pero las reglas del negocio ya vivían en el servicio. Había que definir un límite claro: la vista pregunta, traduce y muestra; el servicio decide.",
            contexto:
              "Issue #9 y #10. Aparece `diseno` con `Main`, `EntradaConsola` y `FormulariosVehiculo`; después se suman consultas y bajas.",
            consecuenciaSiNoExiste:
              "La lógica se mezclaría: SQL o rutas en la vista, `System.out` en el servicio y reglas duplicadas en los formularios.",
          },
          fundamentoTeorico: {
            concepto: "Separación Diseño vs. Negocio",
            explicacion: [
              "La capa Diseño depende de Negocio, nunca al revés. Puede importar servicios y excepciones; el modelo no sabe que existe una consola.",
              "Los servicios reciben parámetros y devuelven resultados o lanzan excepciones: no leen ni imprimen. La persistencia tampoco pregunta ni muestra.",
              "El único lugar con `Scanner`, `System.out` y `System.err` es `diseno`. Esa regla se verifica con una búsqueda en el código y es una de las preguntas clásicas de defensa.",
            ],
            aplicacionAlCaso:
              "`Main` construye el servicio y el lector, carga el stock, aborta si falla la carga para no sobrescribir datos, y traduce cada excepción. `FormulariosVehiculo` construye entidades y devuelve `Vehiculo`; no guarda nada.",
            errorFrecuente:
              "Poner `if (vehiculo.getMarca() == null)` en `Main`: eso es regla de negocio y debe vivir en el modelo o en el servicio.",
          },
          implementacionCodigo: {
            introduccion:
              "Los paquetes declaran su frontera en JavaDoc; el código la respeta con dependencias de un solo sentido.",
            fragmentos: [
              {
                id: "lz14-paquetes",
                archivo: "src/diseno/package-info.java",
                lineas: "1-12",
                codigo: `/**
 * Capa de presentación por consola del sistema.
 *
 * <p>Es el único paquete autorizado en el proyecto para usar {@code Scanner},
 * {@code System.out} y {@code System.err}. No contiene reglas de negocio ni
 * detalles de persistencia.</p>
 *
 * <p>{@link Main} gestiona el menú, {@link EntradaConsola} concentra la lectura
 * y el parseo, y {@link FormulariosVehiculo} construye las entidades. Todas las
 * decisiones de negocio se delegan en el paquete {@code negocio.servicio}.</p>
 */
package diseno;`,
                comentarios: [
                  {
                    linea: 4,
                    texto: "La regla de dependencia queda documentada en el código, no solo en el enunciado.",
                  },
                  {
                    linea: 10,
                    texto: "Delegación explícita: la vista no decide altas, bajas ni filtros.",
                  },
                ],
                conexionAnterior:
                  "Cierra el arco abierto en la lección 13, donde se creó el único lector.",
              },
              {
                id: "lz14-main",
                archivo: "src/diseno/Main.java",
                lineas: "52-56,61-81",
                codigo: `    public static void main(String[] args) {
        try (EntradaConsola entrada = new EntradaConsola()) {
            new Main(new ConcesionariaService(), entrada).ejecutar();
        }
    }
...
    private void ejecutar() {
        try {
            servicio.cargar();
        } catch (IOException causa) {
            System.err.println("No se pudo cargar el stock: " + causa.getMessage());
            System.err.println("La aplicación se detiene para no sobrescribir datos existentes.");
            return;
        }

        boolean continuar = true;
        while (continuar) {
            mostrarMenu();
            try {
                int opcion = entrada.leerOpcion("Opción: ", 1, 5);
                continuar = procesarOpcion(opcion);
            } catch (DatoVehiculoInvalidoException causa) {
                System.out.println("Error: " + causa.getMessage());
            }
        }
        System.out.println("Hasta luego.");
    }`,
                comentarios: [
                  {
                    linea: 53,
                    texto: "try-with-resources: el `Scanner` se cierra aunque falle el programa.",
                  },
                  {
                    linea: 63,
                    texto: "Cargar primero y abortar ante error evita sobrescribir un archivo existente.",
                  },
                  {
                    linea: 76,
                    texto: "Traducción de excepción de dominio: el menú sigue vivo después del error.",
                  },
                ],
                conexionAnterior:
                  "Usa `ConcesionariaService.cargar()` (lección 8) y la excepción de la lección 11.",
              },
              {
                id: "lz14-alta",
                archivo: "src/diseno/Main.java",
                lineas: "127-139",
                codigo: `    private void darDeAlta() {
        try {
            int tipo = entrada.leerOpcion(
                    "Tipo (1=Auto, 2=Camioneta, 3=Motocicleta): ", 1, 3);
            Vehiculo vehiculo = solicitarVehiculo(tipo);
            servicio.alta(vehiculo);
            System.out.println("Vehículo dado de alta: " + vehiculo.getIdentificador());
        } catch (DatoVehiculoInvalidoException | VehiculoDuplicadoException causa) {
            System.out.println("No se pudo dar de alta: " + causa.getMessage());
        } catch (IOException causa) {
            System.err.println("Error de persistencia: " + causa.getMessage());
        }
    }`,
                comentarios: [
                  {
                    linea: 131,
                    texto: "El formulario devuelve la abstracción `Vehiculo` (lección 7).",
                  },
                  {
                    linea: 132,
                    texto: "La decisión de dar de alta se delega al servicio: acá solo se muestra el resultado.",
                  },
                  {
                    linea: 136,
                    texto: "Mensajes distintos para error de negocio y error técnico.",
                  },
                ],
                conexionAnterior:
                  "Aplica la interfaz de la lección 2 y el polimorfismo de la lección 7 en un caso de uso real.",
              },
              {
                id: "lz14-formularios",
                archivo: "src/diseno/FormulariosVehiculo.java",
                lineas: "91-111",
                codigo: `    private DatosComunes solicitarDatosComunes() throws DatoVehiculoInvalidoException {
        String identificador = entrada.leerTexto("Identificador (patente o código): ");
        String marca = entrada.leerTexto("Marca: ");
        String modelo = entrada.leerTexto("Modelo: ");
        int anio = entrada.leerEntero("Año de fabricación: ");
        String color = entrada.leerTexto("Color: ");
        CondicionVehiculo condicion = entrada.leerEnum("Condición (NUEVO/USADO): ",
                CondicionVehiculo.class);

        int kilometraje;
        if (condicion == CondicionVehiculo.NUEVO) {
            kilometraje = 0;
            System.out.println("Unidad 0 km: kilometraje fijado en 0.");
        } else {
            kilometraje = entrada.leerEntero("Kilometraje: ");
        }

        double valorComercial = entrada.leerDecimal("Valor comercial: ");
        return new DatosComunes(identificador, marca, modelo, anio, color,
                condicion, kilometraje, valorComercial);
    }`,
                comentarios: [
                  {
                    linea: 91,
                    texto: "Clase interna `DatosComunes`: transporta los ocho valores sin repetir el formulario tres veces.",
                  },
                  {
                    linea: 101,
                    texto: "La vista fija 0 km por comodidad; la validación sigue siendo del modelo.",
                  },
                  {
                    linea: 109,
                    texto: "Devuelve un portador de datos; los constructores de las subclases hacen el resto.",
                  },
                ],
                conexionAnterior:
                  "Reutiliza `EntradaConsola` (lección 13) y alimenta los constructores de la etapa 2.",
              },
            ],
            recorrido: [
              "Declarar en JavaDoc qué puede usar cada paquete.",
              "Hacer que el servicio devuelva resultados y lance excepciones.",
              "Concentrar `Scanner` y mensajes en `diseno`.",
              "Verificar con una búsqueda que `negocio.*` no imprima.",
            ],
          },
          decisionesYColoquio: {
            decision: "Vista delgada, servicio con reglas, modelo con invariantes y persistencia encapsulada.",
            alternativas: [
              {
                opcion: "Menú que llame directamente al repositorio",
                porQueSeDescarto:
                  "Acopla la vista al formato de archivo y salta las reglas de duplicados y búsqueda del servicio.",
              },
              {
                opcion: "Servicio con `System.out` para informar resultados",
                porQueSeDescarto:
                  "Rompe la separación: el mismo servicio no se podría usar desde otra interfaz distinta de la consola.",
              },
            ],
            justificacion:
              "Es el eje 2 (10 % de la rúbrica) y la regla más visible del AGENTS.md: se demuestra buscando `Scanner` fuera de `diseno` y encontrando cero coincidencias.",
            ejeRubrica: 2,
            ejesRelacionados: [8, 11],
            criterioRubrica: "Arquitectura Diseño vs. Negocio",
            ponderacion: 10,
            preguntaDefensa:
              "Si mañana hacés una API REST, ¿qué capas podés reutilizar y cuál tenés que reemplazar? ¿Por qué?",
            escenariosLiveCoding: [
              {
                id: "lc-14-a",
                titulo: "Subir una regla al servicio",
                consigna:
                  "Hay una validación de marca en `Main`. Pasarla a `ConcesionariaService.alta()` y dejar la vista sin esa regla.",
                pistas: [
                  "El servicio ya lanza `DatoVehiculoInvalidoException`.",
                  "La vista sigue traduciendo el mensaje.",
                ],
                solucion: `// En ConcesionariaService.alta:
if (vehiculo.getMarca() == null || vehiculo.getMarca().trim().isEmpty()) {
    throw new DatoVehiculoInvalidoException("La marca es obligatoria.");
}

// En Main: borrar el if y dejar solo:
servicio.alta(vehiculo);`,
                resultadoEsperado:
                  "La regla ahora se aplica también si el alta viniera de otro origen que no sea la consola.",
                minutos: 4,
              },
              {
                id: "lc-14-b",
                titulo: "Nueva opción del menú",
                consigna:
                  "Agregar la opción 6 'Contar stock' al menú, con un método `contarStock()` en el servicio.",
                pistas: [
                  "Hay que cambiar `leerOpcion(..., 1, 5)` por `1, 6`.",
                  "`procesarOpcion` necesita un `case 6`.",
                ],
                solucion: `// En ConcesionariaService:
public int contarStock() {
    return stock.size();
}

// En Main.mostrarMenu:
System.out.println("6. Contar stock");

// En Main.procesarOpcion:
case 6:
    System.out.println("Unidades: " + servicio.contarStock());
    return true;`,
                resultadoEsperado:
                  "El menú sigue sin conocer el repositorio ni el archivo: solo habla con el servicio.",
                minutos: 5,
              },
            ],
          },
        },
      ],
    },

    {
      id: "etapa-5",
      numero: 5,
      titulo: "Persistencia y defensa técnica",
      bajada:
        "Los datos sobreviven entre ejecuciones: contrato genérico, archivo de texto, codec con formato documentado y una guía para explicar cada decisión en el coloquio.",
      prerrequisito: "Etapas 1 a 4 completas; especialmente el repositorio inyectado en el servicio.",
      lecciones: [
        {
          id: "leccion-15",
          numero: 15,
          titulo: "Repositorio de archivos: guardar, buscar, listar, eliminar",
          commit: "9f2f037",
          issue: 7,
          archivos: [
            "src/negocio/persistencia/RepositorioVehiculos.java",
            "src/negocio/persistencia/package-info.java",
          ],
          conceptos: ["Files/Path", "try-with-resources", "IOException", "ruta inyectable"],
          problema: {
            necesidad:
              "Al cerrar la consola, el stock se perdía. Había que persistirlo sin SQL (la alternativa prioritaria del TFI es archivos) y sin que la vista supiera la ruta ni el formato.",
            contexto:
              "Issue #7. Se implementa `RepositorioGenerico<Vehiculo, String>` con un archivo de texto en `data/stock.txt`.",
            consecuenciaSiNoExiste:
              "Cada ejecución empezaría con el stock vacío y no se podría demostrar la persistencia entre ejecuciones.",
          },
          fundamentoTeorico: {
            concepto: "Persistencia con archivos y cierre garantizado de recursos",
            explicacion: [
              "`Path` representa la ruta y `Files.newBufferedReader/newBufferedWriter` abren flujos con charset UTF-8 explícito. Los recursos se cierran con try-with-resources aunque ocurra una excepción.",
              "La ruta por defecto es relativa al directorio de ejecución (`data/stock.txt`); un constructor con `Path` permite inyectar otra ruta para pruebas. No hay rutas absolutas personales en el repositorio.",
              "Un archivo inexistente no es error: `listarTodos()` devuelve lista vacía. Un registro corrupto sí es error y se informa con el número de línea.",
            ],
            aplicacionAlCaso:
              "Cada operación lee el archivo completo y, cuando modifica, lo reescribe. Así se detectan duplicados y se eliminan registros sin mantener estado entre llamadas. Todo fallo se traduce a `IOException` o a una excepción propia.",
            errorFrecuente:
              "Abrir un `FileWriter` sin cerrarlo o usar el charset por defecto del sistema: el archivo queda inconsistente entre máquinas.",
          },
          implementacionCodigo: {
            introduccion:
              "Primero la configuración de ruta, después el ciclo completo de lectura y escritura.",
            fragmentos: [
              {
                id: "lz15-ruta",
                archivo: "src/negocio/persistencia/RepositorioVehiculos.java",
                lineas: "30-52",
                codigo: `public class RepositorioVehiculos implements RepositorioGenerico<Vehiculo, String> {

    /** Ruta del archivo de stock, relativa al directorio de ejecución. */
    private static final Path RUTA_POR_DEFECTO = Path.of("data", "stock.txt");

    /** Archivo donde se guarda el stock. */
    private final Path archivo;
...
    public RepositorioVehiculos() {
        this(RUTA_POR_DEFECTO);
    }
...
    public RepositorioVehiculos(Path archivo) {
        this.archivo = Objects.requireNonNull(archivo, "La ruta del archivo es obligatoria.");
    }`,
                comentarios: [
                  {
                    linea: 30,
                    texto: "Implementa la interfaz genérica de la lección 9 con `<Vehiculo, String>`.",
                  },
                  {
                    linea: 33,
                    texto: "Ruta relativa: configurable y portable, no depende de la máquina.",
                  },
                  {
                    linea: 50,
                    texto: "Constructor con inyección: permite probar con otro archivo sin tocar el servicio.",
                  },
                ],
                conexionAnterior:
                  "Es la implementación concreta que el servicio de la lección 8 recibe por constructor.",
              },
              {
                id: "lz15-guardar",
                archivo: "src/negocio/persistencia/RepositorioVehiculos.java",
                lineas: "71-86",
                codigo: `    @Override
    public void guardar(Vehiculo entidad) throws IOException, VehiculoDuplicadoException {
        if (entidad == null) {
            throw new IOException("No se puede guardar un vehículo nulo.");
        }

        List<Vehiculo> vehiculos = leerTodos();
        for (Vehiculo existente : vehiculos) {
            if (Objects.equals(existente.getIdentificador(), entidad.getIdentificador())) {
                throw new VehiculoDuplicadoException(
                        "Ya existe un vehículo con el identificador " + entidad.getIdentificador() + ".");
            }
        }
        vehiculos.add(entidad);
        escribirTodos(vehiculos);
    }`,
                comentarios: [
                  {
                    linea: 71,
                    texto: "`@Override`: los cuatro métodos del contrato están documentados en la interfaz.",
                  },
                  {
                    linea: 77,
                    texto: "Lee todo antes de decidir: la colisión se detecta contra el contenido real del archivo.",
                  },
                  {
                    linea: 85,
                    texto: "Reescribe la lista completa: simple y consistente para un stock chico.",
                  },
                ],
                conexionAnterior:
                  "Usa `getIdentificador()` (lección 3) y la excepción de la lección 11.",
              },
              {
                id: "lz15-leer",
                archivo: "src/negocio/persistencia/RepositorioVehiculos.java",
                lineas: "147-170",
                codigo: `    private List<Vehiculo> leerTodos() throws IOException {
        List<Vehiculo> resultado = new ArrayList<>();
        if (!Files.exists(archivo)) {
            return resultado;
        }

        try (BufferedReader lector = Files.newBufferedReader(archivo, StandardCharsets.UTF_8)) {
            String linea;
            int numeroLinea = 0;
            while ((linea = lector.readLine()) != null) {
                numeroLinea++;
                if (linea.trim().isEmpty()) {
                    continue;
                }
                try {
                    resultado.add(VehiculoCodec.decodificar(linea));
                } catch (IOException causa) {
                    throw new IOException("Registro inválido en la línea " + numeroLinea
                            + " de " + archivo + ": " + causa.getMessage(), causa);
                }
            }
        }
        return resultado;
    }`,
                comentarios: [
                  {
                    linea: 149,
                    texto: "Archivo inexistente ⇒ lista vacía: es el arranque normal de la aplicación.",
                  },
                  {
                    linea: 153,
                    texto: "try-with-resources: el lector se cierra automáticamente.",
                  },
                  {
                    linea: 164,
                    texto: "El número de línea hace diagnosticable un registro corrupto sin imprimir por consola.",
                  },
                ],
                conexionAnterior:
                  "Delega el formato al `VehiculoCodec` de la lección 16: acá solo se manejan líneas y E/S.",
              },
              {
                id: "lz15-escribir",
                archivo: "src/negocio/persistencia/RepositorioVehiculos.java",
                lineas: "178-190",
                codigo: `    private void escribirTodos(List<Vehiculo> vehiculos) throws IOException {
        Path carpeta = archivo.getParent();
        if (carpeta != null) {
            Files.createDirectories(carpeta);
        }

        try (BufferedWriter escritor = Files.newBufferedWriter(archivo, StandardCharsets.UTF_8)) {
            for (Vehiculo vehiculo : vehiculos) {
                escritor.write(VehiculoCodec.codificar(vehiculo));
                escritor.newLine();
            }
        }
    }`,
                comentarios: [
                  {
                    linea: 181,
                    texto: "Crear el directorio evita fallar en la primera ejecución, cuando `data/` no existe.",
                  },
                  {
                    linea: 184,
                    texto: "Escritura con buffer y charset explícito; se cierra sola al terminar.",
                  },
                ],
                conexionAnterior:
                  "Cierra el ciclo guardar → cerrar → reabrir → cargar que exige la verificación del TFI.",
              },
            ],
            recorrido: [
              "Definir la ruta relativa y permitir inyectar otra.",
              "Implementar los cuatro métodos del contrato.",
              "Leer con try-with-resources y número de línea en errores.",
              "Escribir creando el directorio y usando UTF-8.",
            ],
          },
          decisionesYColoquio: {
            decision: "Archivos de texto con ruta relativa e inyectable, en vez de JDBC.",
            alternativas: [
              {
                opcion: "JDBC con PreparedStatement",
                porQueSeDescarto:
                  "El enunciado admite SQL pero la alternativa prioritaria del proyecto es archivos; agregar driver y transacciones complicaría la defensa sin resolver un requisito nuevo.",
              },
              {
                opcion: "Serialización binaria de objetos",
                porQueSeDescarto:
                  "Es menos legible, acopla el formato a la versión de las clases y dificulta explicar un registro corrupto en el coloquio.",
              },
            ],
            justificacion:
              "Es el mayor peso de la rúbrica (15 %). La decisión se defiende diciendo que el formato es documentado, auditable y no necesita dependencias externas.",
            ejeRubrica: 11,
            ejesRelacionados: [2, 12],
            criterioRubrica: "Persistencia de datos (archivos / BD SQL)",
            ponderacion: 15,
            preguntaDefensa:
              "¿Qué pasa si el archivo no existe? ¿Y si la línea 7 está corrupta? ¿Dónde se decide cada respuesta?",
            escenariosLiveCoding: [
              {
                id: "lc-15-a",
                titulo: "Probar con otro archivo",
                consigna:
                  "Inyectar `Path.of(\"data\", \"stock-test.txt\")` en el servicio y explicar por qué no se toca `Main`.",
                pistas: [
                  "El servicio tiene constructor con repositorio.",
                  "`Main` usa el constructor por defecto.",
                ],
                solucion: `RepositorioGenerico<Vehiculo, String> repo =
        new RepositorioVehiculos(Path.of("data", "stock-test.txt"));
ConcesionariaService servicio = new ConcesionariaService(repo);
servicio.cargar();`,
                resultadoEsperado:
                  "La ruta vive en persistencia. La vista no conoce archivos: sigue llamando a `servicio.alta(...)`.",
                minutos: 3,
              },
              {
                id: "lc-15-b",
                titulo: "Escritura atómica",
                consigna:
                  "Evitar dejar un archivo a medias: escribir en un temporal y luego moverlo con `Files.move` y `REPLACE_EXISTING`.",
                pistas: [
                  "El temporal puede ser `archivo.resolveSibling(\"stock.tmp\")`.",
                  "Hay que importar `java.nio.file.StandardCopyOption`.",
                ],
                solucion: `Path temporal = archivo.resolveSibling("stock.tmp");
try (BufferedWriter escritor =
        Files.newBufferedWriter(temporal, StandardCharsets.UTF_8)) {
    for (Vehiculo vehiculo : vehiculos) {
        escritor.write(VehiculoCodec.codificar(vehiculo));
        escritor.newLine();
    }
}
Files.move(temporal, archivo, StandardCopyOption.REPLACE_EXISTING);`,
                resultadoEsperado:
                  "Si falla la escritura del temporal, el archivo original queda intacto. Es una mejora defendible sobre el código actual.",
                minutos: 5,
              },
            ],
          },
        },
        {
          id: "leccion-16",
          numero: 16,
          titulo: "VehiculoCodec: el formato del archivo y sus parseos",
          commit: "9f2f037",
          issue: 7,
          archivos: ["src/negocio/persistencia/VehiculoCodec.java"],
          conceptos: ["formato documentado", "escape", "Wrapper", "switch polimórfico"],
          problema: {
            necesidad:
              "El repositorio sabe leer líneas, pero no sabe qué significa cada línea. Había que traducir objetos a texto y texto a objetos sin mezclar esa responsabilidad con la E/S.",
            contexto:
              "Mismo issue #7. Se crea una clase `final` de paquete, de uso interno de persistencia.",
            consecuenciaSiNoExiste:
              "El repositorio tendría `instanceof`, `parseInt` y concatenaciones mezclados con `BufferedReader`, imposible de defender línea por línea.",
          },
          fundamentoTeorico: {
            concepto: "Codec y formato con escape",
            explicacion: [
              "Un codec es una clase que codifica y decodifica un formato. Acá cada registro tiene diez campos separados por `|`, con escape para que un texto pueda contener el separador.",
              "`dividirCampos` recorre carácter por carácter con un estado `escapado`; `desescapar` valida que no aparezca un separador sin escapar. Un error de formato se informa con `IOException`, nunca se ignora.",
              "Los Wrappers aparecen otra vez: `Integer.parseInt`, `Double.parseDouble` y `Enum.valueOf`, ahora con mensajes que nombran el campo. El `switch` sobre `TipoVehiculo` decide qué subclase construir.",
            ],
            aplicacionAlCaso:
              "`codificar` usa `instanceof` para sacar el dato extra de cada subclase; `decodificar` usa el primer campo para elegir el constructor. Es el lado más acoplado del sistema y un buen tema de coloquio.",
            errorFrecuente:
              "Usar `String.split(\"\\\\|\")`: no respeta el escape y rompe registros con `|` dentro de la marca o el color.",
          },
          implementacionCodigo: {
            introduccion:
              "El formato se documenta en el JavaDoc de la clase; acá se muestran las constantes y los dos métodos principales.",
            fragmentos: [
              {
                id: "lz16-constantes",
                archivo: "src/negocio/persistencia/VehiculoCodec.java",
                lineas: "29-42",
                codigo: `final class VehiculoCodec {
...
    /** Separador de campos del formato. */
    private static final char SEPARADOR = '|';
...
    /** Carácter de escape para el separador y para sí mismo. */
    private static final char ESCAPE = '\\\\';
...
    /** Cantidad de campos que debe tener un registro completo. */
    private static final int CANTIDAD_CAMPOS = 10;
...
    /** Evita la instanciación de una clase utilitaria. */
    private VehiculoCodec() {
    }`,
                comentarios: [
                  {
                    linea: 29,
                    texto: "`final` y constructor `private`: es utilitaria, no se instancia.",
                  },
                  {
                    linea: 35,
                    texto: "Escape del separador y de sí mismo, para que los textos puedan contener ambos.",
                  },
                  {
                    linea: 38,
                    texto: "Diez campos: tipo, identidad, seis atributos comunes, valor y extra.",
                  },
                ],
                conexionAnterior:
                  "El repositorio de la lección 15 llama a `codificar`/`decodificar`; acá está el detalle del formato.",
              },
              {
                id: "lz16-codificar",
                archivo: "src/negocio/persistencia/VehiculoCodec.java",
                lineas: "51-78",
                codigo: `    static String codificar(Vehiculo vehiculo) throws IOException {
        if (vehiculo == null) {
            throw new IOException("No se puede codificar un vehículo nulo.");
        }

        String extra;
        if (vehiculo instanceof Auto) {
            extra = String.valueOf(((Auto) vehiculo).getCarroceria());
        } else if (vehiculo instanceof Camioneta) {
            extra = String.valueOf(((Camioneta) vehiculo).getCarroceria());
        } else if (vehiculo instanceof Motocicleta) {
            extra = String.valueOf(((Motocicleta) vehiculo).getEstilo());
        } else {
            throw new IOException("Tipo de vehículo no soportado: "
                    + vehiculo.getClass().getSimpleName());
        }

        return vehiculo.getTipoVehiculo() + String.valueOf(SEPARADOR)
                + escapar(vehiculo.getIdentificador()) + SEPARADOR
                + escapar(vehiculo.getMarca()) + SEPARADOR
                + escapar(vehiculo.getModelo()) + SEPARADOR
                + vehiculo.getAnio() + SEPARADOR
                + escapar(vehiculo.getColor()) + SEPARADOR
                + vehiculo.getCondicion() + SEPARADOR
                + vehiculo.getKilometraje() + SEPARADOR
                + vehiculo.getValorComercial() + SEPARADOR
                + extra;
    }`,
                comentarios: [
                  {
                    linea: 57,
                    texto: "`instanceof` + cast: el codec conoce las tres subclases concretas (punto defendible).",
                  },
                  {
                    linea: 68,
                    texto: "Primer campo: `getTipoVehiculo()`, el método polimórfico de la lección 5.",
                  },
                  {
                    linea: 69,
                    texto: "Los textos pasan por `escapar`; los números y enums no necesitan escape.",
                  },
                  {
                    linea: 77,
                    texto: "Último campo: el dato propio de la categoría.",
                  },
                ],
                conexionAnterior:
                  "Usa `toString()` de los enums (lección 1) para escribir el valor del campo extra.",
              },
              {
                id: "lz16-decodificar",
                archivo: "src/negocio/persistencia/VehiculoCodec.java",
                lineas: "87-124",
                codigo: `    static Vehiculo decodificar(String registro) throws IOException {
        String[] campos = dividirCampos(registro);
        if (campos.length != CANTIDAD_CAMPOS) {
            throw new IOException("El registro debe tener " + CANTIDAD_CAMPOS
                    + " campos y tiene " + campos.length + ".");
        }

        TipoVehiculo tipo = parsearEnum(TipoVehiculo.class, campos[0], "tipo");
        String identificador = desescapar(campos[1]);
        String marca = desescapar(campos[2]);
        String modelo = desescapar(campos[3]);
        int anio = parsearEntero(campos[4], "anio");
        String color = desescapar(campos[5]);
        CondicionVehiculo condicion = parsearEnum(CondicionVehiculo.class, campos[6], "condicion");
        int kilometraje = parsearEntero(campos[7], "kilometraje");
        double valorComercial = parsearDecimal(campos[8], "valorComercial");

        try {
            switch (tipo) {
                case AUTO:
                    return new Auto(identificador, marca, modelo, anio, color, condicion,
                            kilometraje, valorComercial,
                            parsearEnum(Carroceria.class, campos[9], "carroceria"));
                case CAMIONETA:
                    return new Camioneta(identificador, marca, modelo, anio, color, condicion,
                            kilometraje, valorComercial,
                            parsearEnum(Carroceria.class, campos[9], "carroceria"));
                case MOTOCICLETA:
                    return new Motocicleta(identificador, marca, modelo, anio, color, condicion,
                            kilometraje, valorComercial,
                            parsearEnum(EstiloMotocicleta.class, campos[9], "estilo"));
                default:
                    throw new IOException("Tipo de vehículo no soportado: " + tipo);
            }
        } catch (DatoVehiculoInvalidoException causa) {
            throw new IOException("Los datos del registro violan una invariante del dominio.", causa);
        }
    }`,
                comentarios: [
                  {
                    linea: 89,
                    texto: "Cantidad fija de campos: un registro corto se rechaza antes de parsear.",
                  },
                  {
                    linea: 105,
                    texto: "El `switch` elige la subclase; reconstruir los mismos objetos que se guardaron.",
                  },
                  {
                    linea: 121,
                    texto: "Una invariante rota en el archivo se traduce a `IOException`, no se oculta.",
                  },
                ],
                conexionAnterior:
                  "Cierra el ciclo: el objeto reconstruido pasa otra vez por los validadores de la lección 12.",
              },
              {
                id: "lz16-parseaenteros",
                archivo: "src/negocio/persistencia/VehiculoCodec.java",
                lineas: "208-214",
                codigo: `    private static int parsearEntero(String campo, String nombre) throws IOException {
        try {
            return Integer.parseInt(campo);
        } catch (NumberFormatException causa) {
            throw new IOException("El campo " + nombre + " no es un entero válido: " + campo, causa);
        }
    }`,
                comentarios: [
                  {
                    linea: 210,
                    texto: "Wrapper `Integer.parseInt`: el mismo concepto de la lección 13, pero en persistencia.",
                  },
                  {
                    linea: 212,
                    texto: "El mensaje incluye el nombre del campo y el valor leído, clave para diagnosticar.",
                  },
                ],
                conexionAnterior:
                  "Demuestra que los Wrappers no son un tema de la vista: aparecen en dos capas distintas.",
              },
            ],
            recorrido: [
              "Documentar el formato de diez campos.",
              "Codificar con escape y dato extra según subclase.",
              "Decodificar con `switch` y Wrappers validados.",
              "Traducir cualquier fallo a `IOException` con contexto.",
            ],
          },
          decisionesYColoquio: {
            decision: "Formato propio de texto separado por `|`, con escape y codec separado del repositorio.",
            alternativas: [
              {
                opcion: "Usar `toString()` como formato de archivo",
                porQueSeDescarto:
                  "`toString()` es para diagnóstico y cambiaría al editar la ficha; rompería los datos guardados.",
              },
              {
                opcion: "Serialización Java",
                porQueSeDescarto:
                  "Binario, frágil ante cambios de clase y no se puede inspeccionar con un editor de texto.",
              },
            ],
            justificacion:
              "Cubre persistencia, Wrappers y genéricos a la vez. El acoplamiento del codec a las tres subclases es un riesgo conocido: la alternativa polimórfica (`getDatoExtra()` en `Vehiculo`) se propone como ejercicio.",
            ejeRubrica: 11,
            ejesRelacionados: [9, 12],
            criterioRubrica: "Persistencia de datos (archivos / BD SQL)",
            ponderacion: 15,
            preguntaDefensa:
              "¿Por qué el codec conoce `Auto`, `Camioneta` y `Motocicleta`? ¿Cómo lo evitarías con polimorfismo?",
            escenariosLiveCoding: [
              {
                id: "lc-16-a",
                titulo: "Agregar un campo al registro",
                consigna:
                  "Incluir `nombreVendedor` como campo once, actualizando `CANTIDAD_CAMPOS`, `codificar` y `decodificar`.",
                pistas: [
                  "El campo nuevo va al final para no reordenar los existentes.",
                  "Si el archivo viejo tiene diez campos, habrá que migrarlo o aceptar el rechazo.",
                ],
                solucion: `private static final int CANTIDAD_CAMPOS = 11;

// En codificar, después de 'extra':
+ SEPARADOR + escapar(vehiculo.getNombreVendedor());

// En decodificar:
String nombreVendedor = desescapar(campos[10]);`,
                resultadoEsperado:
                  "Los registros nuevos tienen once campos; los viejos se rechazan con el mensaje de cantidad. Es una decisión de compatibilidad que hay que saber explicar.",
                minutos: 5,
              },
              {
                id: "lc-16-b",
                titulo: "Quitar el instanceof",
                consigna:
                  "Proponer un `getDatoExtra()` polimórfico en `Vehiculo` para que el codec no conozca subclases.",
                pistas: [
                  "La base devuelve cadena vacía o lanza para tipos sin extra.",
                  "Cada subclase sobrescribe devolviendo su carrocería o estilo.",
                ],
                solucion: `// En Vehiculo:
protected String getDatoExtra() throws DatoVehiculoInvalidoException {
    throw new DatoVehiculoInvalidoException(
            "Tipo sin dato extra: " + getTipoVehiculo() + ".");
}

// En Auto:
@Override
protected String getDatoExtra() {
    return String.valueOf(carroceria);
}

// En codificar:
String extra = vehiculo.getDatoExtra();`,
                resultadoEsperado:
                  "El codec deja de importar `Auto`, `Camioneta` y `Motocicleta`. Agregar una subclase ya no obliga a tocar el formato (salvo el `switch` de decodificación).",
                minutos: 5,
              },
            ],
          },
        },
        {
          id: "leccion-17",
          numero: 17,
          titulo: "JavaDoc, UML y defensa: cerrar el TFI",
          commit: "95fae3d",
          issue: 11,
          archivos: [
            "src/negocio/persistencia/package-info.java",
            "src/negocio/persistencia/RepositorioGenerico.java",
            "docs/diagrama_clases.puml",
            "bitacora_de_uso_de_iag_tfi.md",
          ],
          conceptos: ["JavaDoc", "UML", "documentación técnica", "defensa oral"],
          problema: {
            necesidad:
              "El código ya funcionaba, pero para la entrega había que poder explicarlo: documentación generada con `javadoc`, diagrama coherente y una bitácora que registre el uso de IAG con un error real.",
            contexto:
              "Issue #11, última de la secuencia. Se cierra JavaDoc de persistencia y se reescribe el UML por paquetes.",
            consecuenciaSiNoExiste:
              "El coloquio quedaría expuesto: el estudiante no podría defender métodos sin documentar ni mostrar un diagrama que coincida con las clases.",
          },
          fundamentoTeorico: {
            concepto: "Documentación técnica y diagrama de clases",
            explicacion: [
              "JavaDoc convierte comentarios en documentación consultable: `@param`, `@return` y `@throws` explican el contrato sin repetir el código. Se verifica con `javadoc --release 21 -Xdoclint:all`.",
              "El diagrama PlantUML muestra los cinco paquetes, la herencia de `Vehiculo`, la interfaz `Cotizable`, los enums y la clase interna `DatosComunes`. Debe actualizarse cuando cambia una clase.",
              "La bitácora de IAG es obligatoria en la guía de cátedra: justificar la herramienta, registrar al menos un error real y reflexionar. No se inventan registros: se documenta lo que efectivamente pasó.",
            ],
            aplicacionAlCaso:
              "Los cinco `package-info.java` declaran la responsabilidad de cada paquete; el JavaDoc de `RepositorioVehiculos` detalla duplicados, cierre de recursos y errores. El UML se renderiza desde `docs/diagrama_clases.puml`.",
            errorFrecuente:
              "Dejar JavaDoc heredado de una etapa anterior (por ejemplo mencionar una issue ya cerrada) o un diagrama sin el último método agregado.",
          },
          implementacionCodigo: {
            introduccion:
              "La documentación también es código: acá están los `package-info` y la firma documentada del contrato.",
            fragmentos: [
              {
                id: "lz17-paquete",
                archivo: "src/negocio/persistencia/package-info.java",
                lineas: "1-11",
                codigo: `/**
 * Acceso a datos del sistema de concesionaria.
 *
 * <p>Pertenece a la capa Negocio. Encapsula el contrato genérico
 * {@link negocio.persistencia.RepositorioGenerico}, la implementación en
 * archivos de texto y el formato de registro. No solicita datos al usuario ni
 * presenta resultados por consola: informa fallos de E/S con
 * {@link java.io.IOException} y colisiones de identidad con excepciones de
 * dominio.</p>
 */
package negocio.persistencia;`,
                comentarios: [
                  {
                    linea: 4,
                    texto: "Declara qué se encapsula y qué NO hace el paquete: no pide datos ni imprime.",
                  },
                  {
                    linea: 8,
                    texto: "Los enlaces `{@link ...}` permiten navegar desde la documentación generada.",
                  },
                ],
                conexionAnterior:
                  "Resumen de las decisiones de las lecciones 9, 15 y 16 en un solo lugar.",
              },
              {
                id: "lz17-contrato",
                archivo: "src/negocio/persistencia/RepositorioGenerico.java",
                lineas: "17-34",
                codigo: `    /**
     * Incorpora una entidad al almacenamiento.
     *
     * @param entidad entidad a guardar
     * @throws IOException                   si falla la lectura o escritura del archivo
     * @throws VehiculoDuplicadoException    si ya existe una entidad con la misma identidad
     */
    void guardar(T entidad) throws IOException, VehiculoDuplicadoException;

    /**
     * Busca una entidad por su identificador.
     *
     * @param id identificador buscado
     * @return la entidad encontrada
     * @throws IOException                    si falla la lectura del archivo
     * @throws VehiculoNoEncontradoException  si no existe una entidad con ese identificador
     */
    T buscarPorId(ID id) throws IOException, VehiculoNoEncontradoException;`,
                comentarios: [
                  {
                    linea: 20,
                    texto: "`@throws` documenta exactamente las dos salidas fallidas del método.",
                  },
                  {
                    linea: 24,
                    texto: "La firma y la documentación coinciden: `javadoc -Xdoclint:all` lo verifica.",
                  },
                ],
                conexionAnterior:
                  "Es el contrato que el servicio usa desde la lección 8 y que la lección 9 parametrizó.",
              },
            ],
            recorrido: [
              "Completar JavaDoc de clases, interfaces, enums y métodos públicos.",
              "Documentar los paquetes con `package-info.java`.",
              "Actualizar el UML con herencia, interfaces, enums y clases internas.",
              "Registrar en la bitácora el uso real de IAG, incluido un error.",
            ],
          },
          decisionesYColoquio: {
            decision: "Mantener documentación, UML y código sincronizados como parte de la entrega.",
            alternativas: [
              {
                opcion: "Documentar al final, después de compilar",
                porQueSeDescarto:
                  "Genera JavaDoc desactualizado (por ejemplo referencias a issues cerradas) y un UML que no coincide con las firmas reales.",
              },
              {
                opcion: "Diagrama dibujado a mano sin fuente",
                porQueSeDescarto:
                  "No se puede regenerar ni versionar como texto; PlantUML sí se renderiza desde el repositorio.",
              },
            ],
            justificacion:
              "Cierra los ejes 13 y 14. La defensa se prepara explicando decisiones, no memorizando líneas: por eso cada lección termina con escenarios de modificación en vivo.",
            ejeRubrica: 14,
            ejesRelacionados: [13],
            criterioRubrica: "Documentación y calidad de código (incluye JavaDoc)",
            ponderacion: 5,
            preguntaDefensa:
              "¿Qué cometés si agregás un método público al repositorio y no actualizás el UML ni el JavaDoc? ¿Cómo lo detectarías?",
            escenariosLiveCoding: [
              {
                id: "lc-17-a",
                titulo: "Actualizar el UML",
                consigna:
                  "Agregar `Bicicleta` al diagrama PlantUML dentro del paquete `negocio.modelo`, con su herencia y su constante.",
                pistas: [
                  "El bloque `package negocio.modelo` ya contiene a las otras tres subclases.",
                  "La flecha de herencia apunta de la subclase hacia `Vehiculo`.",
                ],
                solucion: `package negocio.modelo {
    class Bicicleta {
        - String tipoCuadro
        + getTipoVehiculo() : TipoVehiculo
        + toString() : String
    }
    Vehiculo <|-- Bicicleta
}

package negocio.modelo {
    enum TipoVehiculo {
        AUTO
        CAMIONETA
        MOTOCICLETA
        BICICLETA
    }
}`,
                resultadoEsperado:
                  "El diagrama renderiza sin error de sintaxis y coincide con el código. Si se agregó `getDatoExtra()`, también debe aparecer en `Vehiculo`.",
                minutos: 4,
              },
              {
                id: "lc-17-b",
                titulo: "JavaDoc que Compile con doclint",
                consigna:
                  "Agregar un método público `contarStock()` al servicio con JavaDoc completo y verificarlo con `javadoc -Xdoclint:all`.",
                pistas: [
                  "`@return` es obligatorio para un método que devuelve valor.",
                  "No hace falta `@throws` si el método no lanza nada.",
                ],
                solucion: `/**
 * Devuelve la cantidad de unidades cargadas en memoria.
 *
 * @return número de vehículos del stock
 */
public int contarStock() {
    return stock.size();
}`,
                resultadoEsperado:
                  "`javadoc --release 21 -Xdoclint:all` termina sin errores. Es la comprobación que se usa antes de entregar.",
                minutos: 3,
              },
            ],
          },
        },
      ],
    },
  ],

  ejes: [
    {
      numero: 1,
      titulo: "Dominio y abstracción del escenario de concesionaria",
      estado: "cumple",
      evidencias: [
        { archivo: "src/negocio/modelo/Vehiculo.java", lineas: "28-39", cargo: "Entidad base con los atributos del negocio" },
        { archivo: "src/diseno/Main.java", lineas: "86-94", cargo: "Menú con altas, consultas, bajas y salida" },
      ],
    },
    {
      numero: 2,
      titulo: "Arquitectura en capas: Diseño vs. Negocio",
      estado: "cumple",
      evidencias: [
        { archivo: "src/diseno/package-info.java", lineas: "4-10", cargo: "Declara ser el único paquete con Scanner y System.out" },
        { archivo: "src/negocio/servicio/package-info.java", lineas: "4-5", cargo: "Los servicios no leen ni escriben por consola" },
      ],
      accionRecomendada: "Verificar con una búsqueda que no haya `Scanner` en `negocio.*`.",
    },
    {
      numero: 3,
      titulo: "Modelado POJO/JavaBean y encapsulamiento",
      estado: "cumple",
      evidencias: [
        { archivo: "src/negocio/modelo/Vehiculo.java", lineas: "31-39,81-227", cargo: "Campos privados, identificador final, getters y setters validados" },
      ],
    },
    {
      numero: 4,
      titulo: "Herencia y polimorfismo: Vehiculo abstracta y tres subclases",
      estado: "cumple",
      evidencias: [
        { archivo: "src/negocio/modelo/Vehiculo.java", lineas: "28,270", cargo: "Clase abstracta con método abstracto" },
        { archivo: "src/negocio/modelo/Auto.java", lineas: "11,74-77", cargo: "Subclase concreta con @Override" },
      ],
    },
    {
      numero: 5,
      titulo: "Interfaces de comportamiento realmente implementadas",
      estado: "cumple",
      evidencias: [
        { archivo: "src/negocio/modelo/Cotizable.java", lineas: "10-17", cargo: "Contrato con método real" },
        { archivo: "src/negocio/persistencia/RepositorioGenerico.java", lineas: "15-51", cargo: "Contrato de persistencia" },
      ],
      accionRecomendada: "Actualizar el JavaDoc de `Cotizable`: hoy dice que las subclases implementarán el cálculo y lo hace la base.",
    },
    {
      numero: 6,
      titulo: "Excepciones estándar y excepciones propias del dominio",
      estado: "cumple",
      evidencias: [
        { archivo: "src/negocio/excepciones/DatoVehiculoInvalidoException.java", lineas: "10-32", cargo: "Excepción checked con causa" },
        { archivo: "src/negocio/modelo/Vehiculo.java", lineas: "323-409", cargo: "Cinco validadores que lanzan la excepción propia" },
      ],
    },
    {
      numero: 7,
      titulo: "Enums y distinción nuevo 0 km / usado con kilometraje",
      estado: "cumple",
      evidencias: [
        { archivo: "src/negocio/modelo/CondicionVehiculo.java", lineas: "9-15", cargo: "NUEVO y USADO" },
        { archivo: "src/negocio/modelo/Vehiculo.java", lineas: "381-394", cargo: "Invariante de kilometraje" },
      ],
    },
    {
      numero: 8,
      titulo: "Interfaz de consola, controles de ingreso y mensajes",
      estado: "cumple",
      evidencias: [
        { archivo: "src/diseno/Main.java", lineas: "86-94,192-242,247-269", cargo: "Menú, submenú de consultas y baja con confirmación" },
        { archivo: "src/diseno/EntradaConsola.java", lineas: "39-117", cargo: "Lectura y validación sintáctica" },
      ],
      accionRecomendada: "Quitar el import sin usar de `java.util.ArrayList` en `Main.java:4` (heredado del merge de la issue #10).",
    },
    {
      numero: 9,
      titulo: "Wrappers y conversiones/parseo de entradas",
      estado: "cumple",
      evidencias: [
        { archivo: "src/diseno/EntradaConsola.java", lineas: "55-98", cargo: "parseInt, parseDouble y valueOf" },
        { archivo: "src/negocio/persistencia/VehiculoCodec.java", lineas: "208-249", cargo: "Parseo de campos del archivo" },
      ],
    },
    {
      numero: 10,
      titulo: "List/Map y equals, hashCode y toString coherentes",
      estado: "cumple",
      evidencias: [
        { archivo: "src/negocio/servicio/ConcesionariaService.java", lineas: "32,35,144-146", cargo: "List, Map y copia defensiva" },
        { archivo: "src/negocio/modelo/Vehiculo.java", lineas: "240-263,311-314", cargo: "Igualdad por identificador y ficha legible" },
      ],
      accionRecomendada: "No hay prueba automatizada versionada del contrato equals/hashCode.",
    },
    {
      numero: 11,
      titulo: "Persistencia duradera del stock mediante archivos o BD SQL",
      estado: "cumple",
      evidencias: [
        { archivo: "src/negocio/persistencia/RepositorioVehiculos.java", lineas: "33,147-190", cargo: "Archivo relativo, lectura y escritura con try-with-resources" },
        { archivo: "src/negocio/persistencia/VehiculoCodec.java", lineas: "20-27", cargo: "Formato documentado de diez campos" },
      ],
      accionRecomendada: "Falta versionar la prueba guardar → cerrar → reabrir → cargar; la escritura no es atómica.",
    },
    {
      numero: 12,
      titulo: "Clases, métodos o repositorios genéricos parametrizados",
      estado: "cumple",
      evidencias: [
        { archivo: "src/negocio/persistencia/RepositorioGenerico.java", lineas: "15-51", cargo: "Repositorio parametrizado por entidad e id" },
        { archivo: "src/diseno/EntradaConsola.java", lineas: "89", cargo: "Método genérico con bound de enum" },
      ],
    },
    {
      numero: 13,
      titulo: "Diagrama UML coherente con clases, herencia e interfaces",
      estado: "parcial",
      evidencias: [
        { archivo: "docs/diagrama_clases.puml", lineas: "1-288", cargo: "Cinco paquetes, herencia, interfaz y enums" },
      ],
      accionRecomendada: "Agregar `escapar()`, `equals/hashCode/toString` y los métodos protegidos; corregir la nota que dice que `Main` es el único punto con `System.out`.",
    },
    {
      numero: 14,
      titulo: "JavaDoc y documentación técnica estructurada",
      estado: "parcial",
      evidencias: [
        { archivo: "src/negocio/persistencia/package-info.java", lineas: "1-11", cargo: "Documentación de paquete" },
        { archivo: "bitacora_de_uso_de_iag_tfi.md", lineas: "38-59", cargo: "Sección de casos todavía con placeholders" },
      ],
      accionRecomendada: "Completar la bitácora con un error real de la IAG y agregar un README con compilación y ejecución.",
    },
  ],

  glosario: [
    {
      termino: "Invariante",
      definicion: "Condición que debe cumplirse durante toda la vida del objeto; se valida en el constructor y en los mutadores.",
      archivo: "src/negocio/modelo/Vehiculo.java",
    },
    {
      termino: "Copia defensiva",
      definicion: "Devolver una lista nueva para que el llamador no pueda modificar el estado interno del servicio.",
      archivo: "src/negocio/servicio/ConcesionariaService.java",
    },
    {
      termino: "Despacho dinámico",
      definicion: "El compilador elige el método por el tipo de la variable y la JVM elige la implementación por el tipo del objeto.",
      archivo: "src/negocio/modelo/Vehiculo.java",
    },
    {
      termino: "Codec",
      definicion: "Clase que convierte objetos a un formato de texto y viceversa, separada de la E/S.",
      archivo: "src/negocio/persistencia/VehiculoCodec.java",
    },
    {
      termino: "Inyección de dependencias",
      definicion: "Recibir el colaborador por constructor en vez de crearlo dentro de la clase; acopla el servicio a un contrato, no a un archivo.",
      archivo: "src/negocio/servicio/ConcesionariaService.java",
    },
  ],
};
