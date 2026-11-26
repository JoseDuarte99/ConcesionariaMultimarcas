/**
 * Tipos del material teórico-práctico del TFI.
 *
 * La unidad narrativa es la `Leccion`: cada una responde cuatro bloques
 * obligatorios (problema, fundamento, implementación y defensa) y apunta a
 * archivos reales del repositorio Java.
 */

export type EstadoEje = "cumple" | "parcial" | "falta" | "no-verificable";

/** Evidencia verificable en el repositorio. */
export interface Evidencia {
  archivo: string;
  lineas?: string;
  cargo: string;
}

/** Uno de los 14 ejes técnicos del enunciado. */
export interface EjeRubrica {
  numero: number;
  titulo: string;
  estado: EstadoEje;
  evidencias: Evidencia[];
  accionRecomendada?: string;
}

/** Explicación de una línea concreta de un fragmento. */
export interface ComentarioLinea {
  linea: number;
  texto: string;
}

/** Fragmento literal extraído de un archivo .java del repositorio. */
export interface FragmentoCodigo {
  id: string;
  archivo: string;
  lineas: string;
  codigo: string;
  comentarios: ComentarioLinea[];
  conexionAnterior: string;
}

/** Escenario de modificación en vivo para practicar la defensa oral. */
export interface EscenarioLiveCoding {
  id: string;
  titulo: string;
  consigna: string;
  pistas: string[];
  solucion: string;
  resultadoEsperado: string;
  minutos: number;
}

/** Bloque 1: por qué apareció esta clase/interfaz/capa en ese momento. */
export interface BloqueProblema {
  necesidad: string;
  contexto: string;
  consecuenciaSiNoExiste: string;
}

/** Bloque 2: concepto de cátedra aplicado al caso concreto. */
export interface BloqueFundamento {
  concepto: string;
  explicacion: string[];
  aplicacionAlCaso: string;
  errorFrecuente: string;
}

/** Bloque 3: código real anotado línea por línea. */
export interface BloqueImplementacion {
  introduccion: string;
  fragmentos: FragmentoCodigo[];
  recorrido: string[];
}

/** Bloque 4: diseño, rúbrica y práctica de coloquio. */
export interface BloqueDecisiones {
  decision: string;
  alternativas: { opcion: string; porQueSeDescarto: string }[];
  justificacion: string;
  ejeRubrica: number;
  ejesRelacionados: number[];
  criterioRubrica: string;
  /** Peso del criterio en la rúbrica oficial (no se suma entre lecciones). */
  ponderacion: number;
  preguntaDefensa: string;
  escenariosLiveCoding: EscenarioLiveCoding[];
}

/** Lección numerada de forma global dentro del TFI. */
export interface Leccion {
  id: string;
  numero: number;
  titulo: string;
  commit: string;
  issue: number;
  archivos: string[];
  conceptos: string[];
  problema: BloqueProblema;
  fundamentoTeorico: BloqueFundamento;
  implementacionCodigo: BloqueImplementacion;
  decisionesYColoquio: BloqueDecisiones;
}

/** Etapa progresiva de construcción. */
export interface Etapa {
  id: string;
  numero: number;
  titulo: string;
  bajada: string;
  prerrequisito: string;
  lecciones: Leccion[];
}

/** Contenido completo consumido por la interfaz. */
export interface DatosTFI {
  meta: {
    titulo: string;
    subtitulo: string;
    repositorio: string;
    commitBase: string;
    versionJava: string;
    fuentes: string[];
  };
  etapas: Etapa[];
  ejes: EjeRubrica[];
  glosario: { termino: string; definicion: string; archivo: string }[];
}
