import { useState } from "react";
import type { ReactNode } from "react";
import { datosTFI } from "./data/tfiData";
import type { EscenarioLiveCoding, FragmentoCodigo, Leccion } from "./data/types";

const lecciones: Leccion[] = datosTFI.etapas.flatMap((etapa) => etapa.lecciones);

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="bloque">
      <h3 className="mb-3 text-lg font-semibold">{titulo}</h3>
      {children}
    </section>
  );
}

function Fragmento({ fragmento }: { fragmento: FragmentoCodigo }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium">
        {fragmento.archivo} <span className="text-slate-500">· líneas {fragmento.lineas}</span>
      </p>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-tinta p-4 text-xs leading-relaxed text-slate-100">
        <code>{fragmento.codigo}</code>
      </pre>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">
        {fragmento.comentarios.map((comentario) => (
          <li key={comentario.linea}>
            <span className="font-mono font-semibold text-acento">L{comentario.linea}</span>{" "}
            {comentario.texto}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm italic text-slate-500">
        Conexión: {fragmento.conexionAnterior}
      </p>
    </div>
  );
}

function Escenario({ escenario }: { escenario: EscenarioLiveCoding }) {
  return (
    <article className="mt-4 rounded-lg border border-slate-200 p-4">
      <h4 className="font-semibold">
        {escenario.titulo} <span className="text-sm font-normal text-slate-500">· {escenario.minutos} min</span>
      </h4>
      <p className="mt-1 text-sm">{escenario.consigna}</p>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-tinta p-3 text-xs text-slate-100">
        <code>{escenario.solucion}</code>
      </pre>
      <p className="mt-2 text-sm text-slate-600">{escenario.resultadoEsperado}</p>
    </article>
  );
}

export default function App() {
  const [leccionId, setLeccionId] = useState(lecciones[0].id);
  const leccion = lecciones.find((item) => item.id === leccionId) ?? lecciones[0];
  const etapa = datosTFI.etapas.find((item) =>
    item.lecciones.some((itemLeccion) => itemLeccion.id === leccion.id),
  );

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="etiqueta">{datosTFI.meta.versionJava} · {datosTFI.meta.repositorio}</p>
          <h1 className="mt-1 text-2xl font-bold">{datosTFI.meta.titulo}</h1>
          <p className="mt-1 text-slate-600">{datosTFI.meta.subtitulo}</p>
          <p className="mt-2 text-xs text-slate-500">Commit base: {datosTFI.meta.commitBase}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[18rem_1fr]">
        <nav aria-label="Lecciones" className="space-y-5">
          {datosTFI.etapas.map((itemEtapa) => (
            <div key={itemEtapa.id}>
              <h2 className="etiqueta mb-2">
                Etapa {itemEtapa.numero} · {itemEtapa.titulo}
              </h2>
              <div className="space-y-1">
                {itemEtapa.lecciones.map((itemLeccion) => (
                  <button
                    key={itemLeccion.id}
                    type="button"
                    onClick={() => setLeccionId(itemLeccion.id)}
                    className={`boton-leccion w-full ${
                      itemLeccion.id === leccion.id
                        ? "bg-acento font-semibold text-white"
                        : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {itemLeccion.numero}. {itemLeccion.titulo}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <main className="space-y-5">
          <div>
            <p className="etiqueta">
              Etapa {etapa?.numero} · Lección {leccion.numero} · commit {leccion.commit} · issue #{leccion.issue}
            </p>
            <h2 className="mt-1 text-2xl font-bold">{leccion.titulo}</h2>
            <p className="mt-2 text-sm text-slate-600">{leccion.conceptos.join(" · ")}</p>
          </div>

          <Bloque titulo="1. Problema">
            <p>{leccion.problema.necesidad}</p>
            <p className="mt-2 text-sm text-slate-600">{leccion.problema.contexto}</p>
            <p className="mt-2 text-sm text-slate-600">
              Sin esto: {leccion.problema.consecuenciaSiNoExiste}
            </p>
          </Bloque>

          <Bloque titulo="2. Fundamento teórico">
            <p className="font-semibold">{leccion.fundamentoTeorico.concepto}</p>
            {leccion.fundamentoTeorico.explicacion.map((parrafo, indice) => (
              <p key={indice} className="mt-2 text-sm">
                {parrafo}
              </p>
            ))}
            <p className="mt-3 text-sm">
              <span className="font-semibold">Aplicación: </span>
              {leccion.fundamentoTeorico.aplicacionAlCaso}
            </p>
            <p className="mt-2 text-sm text-amber-700">
              Error frecuente: {leccion.fundamentoTeorico.errorFrecuente}
            </p>
          </Bloque>

          <Bloque titulo="3. Implementación con código real">
            <p className="text-sm">{leccion.implementacionCodigo.introduccion}</p>
            {leccion.implementacionCodigo.fragmentos.map((fragmento) => (
              <Fragmento key={fragmento.id} fragmento={fragmento} />
            ))}
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-slate-600">
              {leccion.implementacionCodigo.recorrido.map((paso, indice) => (
                <li key={indice}>{paso}</li>
              ))}
            </ol>
          </Bloque>

          <Bloque titulo="4. Decisiones y coloquio">
            <p>{leccion.decisionesYColoquio.decision}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {leccion.decisionesYColoquio.alternativas.map((alternativa, indice) => (
                <li key={indice}>
                  <span className="font-semibold">{alternativa.opcion}: </span>
                  {alternativa.porQueSeDescarto}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">{leccion.decisionesYColoquio.justificacion}</p>
            <p className="mt-3 rounded-md bg-slate-100 p-3 text-sm">
              Eje {leccion.decisionesYColoquio.ejeRubrica} ·{" "}
              {leccion.decisionesYColoquio.criterioRubrica} ·{" "}
              <strong>{leccion.decisionesYColoquio.ponderacion} %</strong> de la rúbrica
            </p>
            <p className="mt-3 text-sm font-semibold">
              Pregunta de defensa: {leccion.decisionesYColoquio.preguntaDefensa}
            </p>
            <h4 className="mt-4 font-semibold">Live coding (2 escenarios)</h4>
            {leccion.decisionesYColoquio.escenariosLiveCoding.map((escenario) => (
              <Escenario key={escenario.id} escenario={escenario} />
            ))}
          </Bloque>
        </main>
      </div>
    </div>
  );
}
