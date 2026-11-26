import type { ReactNode } from "react";
import PanelColoquio from "./PanelColoquio";
import VisorCodigo from "./VisorCodigo";
import type { Etapa, Leccion } from "../data/types";

interface Propiedades {
  leccion: Leccion;
  etapa: Etapa | undefined;
  anterior: Leccion | null;
  siguiente: Leccion | null;
  navegar: (destino: string) => void;
}

function Bloque({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="bloque-narrativo">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-acento/30 bg-acento/10 font-mono text-xs text-acento">
          {numero}
        </span>
        <h2 className="text-lg font-semibold tracking-tight md:text-xl">{titulo}</h2>
      </div>
      {children}
    </section>
  );
}

export default function LeccionVista({
  leccion,
  etapa,
  anterior,
  siguiente,
  navegar,
}: Propiedades) {
  const decisiones = leccion.decisionesYColoquio;

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-10">
      <div>
        <button
          type="button"
          onClick={() => navegar("/")}
          className="font-mono text-[11px] uppercase tracking-widest text-tenue hover:text-acento"
        >
          ← Volver al roadmap
        </button>
        <p className="etiqueta mt-4">
          Etapa {etapa?.numero} · Paso {String(leccion.numero).padStart(2, "0")} · commit{" "}
          {leccion.commit} · issue #{leccion.issue}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          {leccion.titulo}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {leccion.conceptos.map((concepto) => (
            <span key={concepto} className="chip">
              {concepto}
            </span>
          ))}
        </div>
      </div>

      <Bloque numero={1} titulo="Problema">
        <p className="text-[15px] leading-relaxed">{leccion.problema.necesidad}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <p className="rounded-lg border border-borde bg-superficie-2/50 p-3 text-[13px] text-tenue">
            <span className="font-mono text-[11px] text-acento">Contexto: </span>
            {leccion.problema.contexto}
          </p>
          <p className="rounded-lg border border-advertencia/25 bg-advertencia/5 p-3 text-[13px] text-advertencia/90">
            <span className="font-mono text-[11px] uppercase tracking-widest">
              Sin esto:{" "}
            </span>
            {leccion.problema.consecuenciaSiNoExiste}
          </p>
        </div>
      </Bloque>

      <Bloque numero={2} titulo="Fundamento Teórico">
        <p className="font-mono text-sm text-acento">{leccion.fundamentoTeorico.concepto}</p>
        <div className="mt-3 space-y-2 text-[14px] leading-relaxed text-tenue">
          {leccion.fundamentoTeorico.explicacion.map((parrafo, indice) => (
            <p key={indice}>{parrafo}</p>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <p className="rounded-lg border border-exito/25 bg-exito/5 p-3 text-[13px] text-exito">
            <span className="font-mono text-[11px] uppercase tracking-widest">
              Aplicación al caso:{" "}
            </span>
            {leccion.fundamentoTeorico.aplicacionAlCaso}
          </p>
          <p className="rounded-lg border border-advertencia/25 bg-advertencia/5 p-3 text-[13px] text-advertencia/90">
            <span className="font-mono text-[11px] uppercase tracking-widest">
              Error frecuente:{" "}
            </span>
            {leccion.fundamentoTeorico.errorFrecuente}
          </p>
        </div>
      </Bloque>

      <Bloque numero={3} titulo="Implementación en el Repo">
        <p className="text-[14px] leading-relaxed text-tenue">
          {leccion.implementacionCodigo.introduccion}
        </p>
        {leccion.implementacionCodigo.fragmentos.map((fragmento) => (
          <VisorCodigo key={fragmento.id} fragmento={fragmento} />
        ))}
        <div className="mt-6 rounded-xl border border-borde bg-superficie-2/40 p-4">
          <p className="etiqueta">Recorrido</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13px] text-tenue">
            {leccion.implementacionCodigo.recorrido.map((paso, indice) => (
              <li key={indice}>{paso}</li>
            ))}
          </ol>
        </div>
      </Bloque>

      <Bloque numero={4} titulo="Decisiones de Diseño">
        <p className="text-[15px] leading-relaxed">{decisiones.decision}</p>
        <div className="mt-4 space-y-2">
          {decisiones.alternativas.map((alternativa, indice) => (
            <p
              key={indice}
              className="rounded-lg border border-borde bg-superficie-2/40 px-3 py-2 text-[13px] text-tenue"
            >
              <span className="font-semibold text-texto">{alternativa.opcion}: </span>
              {alternativa.porQueSeDescarto}
            </p>
          ))}
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-tenue">{decisiones.justificacion}</p>
        <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-lg border border-acento/30 bg-acento/10 px-3 py-2 font-mono text-[11px] text-acento">
          <span>Eje {decisiones.ejeRubrica}</span>
          <span className="text-tenue">·</span>
          <span>{decisiones.criterioRubrica}</span>
          <span className="text-tenue">·</span>
          <strong>{decisiones.ponderacion} %</strong>
        </p>
        <PanelColoquio leccion={leccion} />
      </Bloque>

      <nav aria-label="Navegación entre lecciones" className="flex flex-wrap justify-between gap-3 pt-2">
        {anterior ? (
          <button
            type="button"
            onClick={() => navegar(`/leccion/${anterior.id}`)}
            className="boton boton-tenue"
          >
            ← Paso anterior
            <span className="hidden text-[11px] text-tenue/70 sm:inline">{anterior.titulo}</span>
          </button>
        ) : (
          <span />
        )}
        {siguiente && (
          <button
            type="button"
            onClick={() => navegar(`/leccion/${siguiente.id}`)}
            className="boton boton-primario"
          >
            <span className="hidden text-[11px] text-acento/70 sm:inline">{siguiente.titulo}</span>
            Siguiente paso →
          </button>
        )}
      </nav>
    </main>
  );
}
