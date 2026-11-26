import { useState } from "react";
import type { Etapa } from "../data/types";

interface Propiedades {
  etapas: Etapa[];
  navegar: (destino: string) => void;
}

/** Acordeón con las 5 etapas y sus lecciones en orden cronológico. */
export default function Roadmap({ etapas, navegar }: Propiedades) {
  const [abierta, setAbierta] = useState<string | null>(etapas[0]?.id ?? null);

  return (
    <section id="roadmap" className="scroll-mt-32">
      <div className="mb-6">
        <p className="etiqueta">01 · Recorrido</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Roadmap de Construcción
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-tenue">
          Cada etapa abre una decisión nueva. Las lecciones siguen el orden real en que
          aparecieron los archivos y los commits del repositorio.
        </p>
      </div>

      <div className="space-y-3">
        {etapas.map((etapa) => {
          const expandida = abierta === etapa.id;
          return (
            <article key={etapa.id} className="tarjeta overflow-hidden">
              <button
                type="button"
                onClick={() => setAbierta(expandida ? null : etapa.id)}
                aria-expanded={expandida}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-superficie-2/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-acento/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-acento/30 bg-acento/10 font-mono text-sm font-semibold text-acento">
                  {String(etapa.numero).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{etapa.titulo}</span>
                  <span className="mt-0.5 block truncate text-[13px] text-tenue">
                    {etapa.bajada}
                  </span>
                </span>
                <span className="chip shrink-0">{etapa.lecciones.length} lecciones</span>
                <span
                  className={`font-mono text-lg text-acento transition-transform duration-300 ${
                    expandida ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  ⌄
                </span>
              </button>

              {expandida && (
                <div className="border-t border-borde bg-fondo/40 px-5 py-5">
                  <p className="mb-4 text-[13px] text-tenue">
                    <span className="font-mono text-acento">Prerrequisito:</span>{" "}
                    {etapa.prerrequisito}
                  </p>
                  <ol className="relative ml-3 space-y-4 border-l border-borde pl-6">
                    {etapa.lecciones.map((leccion) => (
                      <li key={leccion.id} className="relative">
                        <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border border-acento bg-fondo" />
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-borde bg-superficie/70 px-4 py-3">
                          <div>
                            <p className="font-mono text-[11px] text-acento">
                              Paso {String(leccion.numero).padStart(2, "0")} · {leccion.commit}
                            </p>
                            <p className="mt-1 font-medium">{leccion.titulo}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => navegar(`/leccion/${leccion.id}`)}
                            className="boton boton-primario px-3 py-1.5 text-xs"
                          >
                            Abrir lección →
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
