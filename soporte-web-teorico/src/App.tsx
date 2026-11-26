import Header from "./components/Header";
import IndiceLecciones from "./components/IndiceLecciones";
import LeccionVista from "./components/LeccionVista";
import MapaArquitectura from "./components/MapaArquitectura";
import Roadmap from "./components/Roadmap";
import { datosTFI } from "./data/tfiData";
import { useRuta } from "./hooks/useRuta";

const lecciones = datosTFI.etapas.flatMap((etapa) => etapa.lecciones);

export default function App() {
  const { ruta, navegar } = useRuta();

  if (ruta.vista === "arquitectura") {
    return (
      <div className="min-h-screen">
        <Header navegar={navegar} enInicio={false} />
        <MapaArquitectura volver={() => navegar("/")} />
      </div>
    );
  }

  if (ruta.vista === "leccion") {
    const indice = lecciones.findIndex((leccion) => leccion.id === ruta.id);
    if (indice === -1) {
      return (
        <div className="min-h-screen">
          <Header navegar={navegar} enInicio={false} />
          <main className="mx-auto max-w-3xl px-6 py-20 text-center">
            <p className="etiqueta">404 · Lección no encontrada</p>
            <h1 className="mt-3 text-3xl font-semibold">Ese paso no existe en el roadmap</h1>
            <p className="mt-3 text-sm text-tenue">
              Revisá el índice: hay {lecciones.length} lecciones numeradas.
            </p>
            <button
              type="button"
              onClick={() => navegar("/")}
              className="boton boton-primario mt-6"
            >
              Volver al inicio
            </button>
          </main>
        </div>
      );
    }

    const leccion = lecciones[indice];
    const etapa = datosTFI.etapas.find((item) =>
      item.lecciones.some((itemLeccion) => itemLeccion.id === leccion.id),
    );

    return (
      <div className="min-h-screen">
        <Header navegar={navegar} enInicio={false} />
        <LeccionVista
          leccion={leccion}
          etapa={etapa}
          anterior={indice > 0 ? lecciones[indice - 1] : null}
          siguiente={indice < lecciones.length - 1 ? lecciones[indice + 1] : null}
          navegar={navegar}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header navegar={navegar} enInicio />
      <main className="mx-auto max-w-6xl space-y-16 px-6 py-12">
        <section className="tarjeta relative overflow-hidden p-7 md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-acento/10 blur-3xl" />
          <p className="etiqueta">Guía teórico-práctica · commit base {datosTFI.meta.commitBase}</p>
          <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight md:text-4xl">
            De una clase abstracta a un stock persistido, paso a paso.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-tenue md:text-base">
            {datosTFI.meta.subtitulo}. Cada lección muestra el problema que motivó el
            cambio, el concepto de cátedra aplicado, el código real del repositorio y
            cómo defenderlo en el coloquio.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#roadmap" className="boton boton-primario">
              Empezar el roadmap →
            </a>
            <button
              type="button"
              onClick={() => navegar("/arquitectura")}
              className="boton boton-tenue"
            >
              Ver mapa de capas
            </button>
          </div>
        </section>

        <Roadmap etapas={datosTFI.etapas} navegar={navegar} />
        <IndiceLecciones lecciones={lecciones} navegar={navegar} />
      </main>
    </div>
  );
}
