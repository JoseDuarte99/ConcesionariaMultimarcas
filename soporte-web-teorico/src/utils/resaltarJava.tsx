import type { ReactNode } from "react";

const PALABRAS_CLAVE = new Set([
  "abstract", "boolean", "break", "byte", "case", "catch", "char", "class",
  "continue", "default", "double", "else", "enum", "extends", "false", "final",
  "finally", "float", "for", "if", "implements", "import", "instanceof", "int",
  "interface", "long", "new", "null", "package", "private", "protected",
  "public", "return", "short", "static", "super", "switch", "this", "throw",
  "throws", "true", "try", "void", "while",
]);

const TIPOS = new Set([
  "Auto", "BufferedReader", "BufferedWriter", "Camioneta", "Carroceria",
  "Class", "CondicionVehiculo", "ConcesionariaService", "DatoVehiculoInvalidoException",
  "Double", "Enum", "EstiloMotocicleta", "Exception", "Files", "HashMap",
  "IOException", "Integer", "List", "Map", "Motocicleta", "Objects", "Path",
  "RepositorioGenerico", "RepositorioVehiculos", "Scanner", "String",
  "TipoVehiculo", "Vehiculo", "VehiculoCodec", "VehiculoDuplicadoException",
  "VehiculoNoEncontradoException", "ArrayList", "String[]",
]);

const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[A-Za-z_$][\w$]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b|\s+|[^\s])/g;

/**
 * Resalta un fragmento Java con tokens simples del JDK, sin dependencias.
 * Los espacios y saltos de línea se conservan como texto plano.
 */
export function resaltarJava(codigo: string): ReactNode[] {
  const salida: ReactNode[] = [];
  let cursor = 0;

  for (const coincidencia of codigo.matchAll(TOKEN)) {
    const texto = coincidencia[0];
    const inicio = coincidencia.index ?? 0;
    if (inicio > cursor) {
      salida.push(codigo.slice(cursor, inicio));
    }

    let clase = "";
    if (texto.startsWith("//") || texto.startsWith("/*")) {
      clase = "tok-comentario";
    } else if (texto.startsWith('"') || texto.startsWith("'")) {
      clase = "tok-cadena";
    } else if (texto.startsWith("@")) {
      clase = "tok-anotacion";
    } else if (/^\d/.test(texto)) {
      clase = "tok-numero";
    } else if (PALABRAS_CLAVE.has(texto)) {
      clase = "tok-clave";
    } else if (TIPOS.has(texto)) {
      clase = "tok-tipo";
    } else if (/^[A-Z][A-Z0-9_]*$/.test(texto)) {
      clase = "tok-constante";
    } else if (/^[A-Z]/.test(texto)) {
      clase = "tok-tipo";
    } else if (/^[A-Za-z_$]/.test(texto)) {
      clase = "tok-identificador";
    }

    salida.push(
      clase ? (
        <span className={clase} key={inicio}>
          {texto}
        </span>
      ) : (
        texto
      ),
    );
    cursor = inicio + texto.length;
  }

  if (cursor < codigo.length) {
    salida.push(codigo.slice(cursor));
  }
  return salida;
}
