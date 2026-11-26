import type { Leccion } from "../data/types";

interface Propiedades {
  lecciones: Leccion[];
  navegar: (destino: string) => void;
}

function resumen(leccion: Leccion): string {
  const texto = leccion.problema.necesidad;
  return texto.length > 150 ? `${texto.slice(0, 147).trimEnd()}…` : texto;
}

/** Grilla de tarjetas: una por lección, con peso de rúbrica y archivos Java. */
export default function IndiceLecciones({ lecciones, navegar }: Propiedades) {
  return (
    <section id="lecciones" className="scroll-mt-32">
      <div className="mb-6">
        <p className="etiqueta">02 · Catálogo</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Índice de Lecciones
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-tenue">
          Cada tarjeta resume el problema que resuelve, los archivos reales que se
          analizan y el criterio de la rúbrica oficial que demuestra.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lecciones.map((leccion) => (
          <article
            key={leccion.id}
            className="tarjeta flex flex-col p-5 transition-colors duration-200 hover:border-acento/40"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-3xl font-semibold text-acento/80">
                {String(leccion.numero).padStart(2, "0")}
              </span>
              <span className="chip border-advertencia/30 text-advertencia">
                {leccion.decisionesYColoquio.ponderacion}% rúbrica
              </span>
            </div>

            <h3 className="mt-3 font-semibold leading-snug">{leccion.titulo}</h3>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed text-tenue">
              {resumen(leccion)}
            </p>

            <div className="mt-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-tenue/70">
                Archivos .java
              </p>
              <div className="flex flex-wrap gap-1.5">
                {leccion.archivos.map((archivo) => (
                  <span key={archivo} className="chip" title={archivo}>
                    {archivo.split("/").pop() ?? archivo}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navegar(`/leccion/${leccion.id}`)}
              className="boton boton-primario mt-5 w-full"
            >
              Estudiar paso →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
