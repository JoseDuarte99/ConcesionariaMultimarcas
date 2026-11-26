import { useState } from "react";
import CodigoCopiable from "./CodigoCopiable";
import type { Leccion } from "../data/types";

export default function PanelColoquio({ leccion }: { leccion: Leccion }) {
  const [abiertas, setAbertas] = useState<Record<string, boolean>>({});
  const decisiones = leccion.decisionesYColoquio;

  const alternar = (clave: string) => {
    setAbertas((estado) => ({ ...estado, [clave]: !estado[clave] }));
  };

  return (
    <section className="mt-8 rounded-2xl border border-acento/30 bg-gradient-to-br from-acento/10 via-superficie to-superficie p-6 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="etiqueta">Práctica guiada</p>
          <h3 className="mt-1 text-xl font-semibold">
            Práctica de Coloquio &amp; Live Coding
          </h3>
        </div>
        <span className="chip border-acento/40 text-acento">
          {decisiones.escenariosLiveCoding.length} ejercicios · ≤ 5 min cada uno
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-borde bg-fondo/50 p-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-tenue">
          Pregunta de defensa
        </p>
        <p className="mt-2 font-medium">{decisiones.preguntaDefensa}</p>
        <button
          type="button"
          onClick={() => alternar("respuesta")}
          aria-expanded={Boolean(abiertas["respuesta"])}
          className="boton boton-tenue mt-3 px-3 py-1.5 text-xs"
        >
          {abiertas["respuesta"] ? "Ocultar respuesta" : "Ver respuesta orientativa"}
        </button>
        {abiertas["respuesta"] && (
          <div className="mt-3 space-y-2 border-l-2 border-acento/60 pl-4 text-[13px] leading-relaxed text-tenue">
            <p>{decisiones.justificacion}</p>
            <p>
              <span className="text-acento">Criterio:</span>{" "}
              {decisiones.criterioRubrica} ({decisiones.ponderacion} %)
            </p>
            <p>
              <span className="text-acento">Decisión adoptada:</span>{" "}
              {decisiones.decision}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {decisiones.escenariosLiveCoding.map((escenario, indice) => {
          const abierto = Boolean(abiertas[escenario.id]);
          return (
            <article key={escenario.id} className="rounded-xl border border-borde bg-superficie/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-acento">
                    Escenario {indice + 1} · {escenario.minutos} min
                  </p>
                  <h4 className="mt-1 font-semibold">{escenario.titulo}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => alternar(escenario.id)}
                  aria-expanded={abierto}
                  className="boton boton-primario px-3 py-1.5 text-xs"
                >
                  {abierto ? "Ocultar solución" : "Desplegar respuesta"}
                </button>
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-tenue">{escenario.consigna}</p>

              {abierto && (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-tenue/70">
                      Pistas graduales
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-[13px] text-tenue">
                      {escenario.pistas.map((pista, posicion) => (
                        <li key={posicion}>{pista}</li>
                      ))}
                    </ul>
                  </div>

                  <CodigoCopiable
                    codigo={escenario.solucion}
                    archivo={`Solución · ${escenario.titulo}`}
                    compacto
                  />

                  <p className="rounded-lg border border-exito/25 bg-exito/5 px-3 py-2 text-[13px] text-exito">
                    <span className="font-mono text-[11px] uppercase tracking-widest">
                      Resultado esperado:{" "}
                    </span>
                    {escenario.resultadoEsperado}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
