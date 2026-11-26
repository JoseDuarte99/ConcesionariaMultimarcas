interface Propiedades {
  navegar: (destino: string) => void;
  enInicio: boolean;
}

const BADGES = ["Java", "POO", "Generics", "Persistencia"];

export default function Header({ navegar, enInicio }: Propiedades) {
  return (
    <header className="sticky top-0 z-30 border-b border-borde bg-fondo/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <button
          type="button"
          onClick={() => navegar("/")}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-acento/60"
        >
          <p className="etiqueta">TFI · Programación II · UTN FRRe</p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight md:text-xl">
            Concesionaria Multimarcas — Guía Teórica Paso a Paso
          </h1>
          <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-tenue">
            La consola delega en servicios, los servicios coordinan el modelo y la
            persistencia encapsula el archivo de stock: así se construyó la
            arquitectura en capas de este proyecto.
          </p>
        </button>

        <nav aria-label="Navegación principal" className="flex flex-wrap items-center gap-2">
          {enInicio ? (
            <>
              <a href="#roadmap" className="boton boton-tenue">
                Roadmap
              </a>
              <a href="#lecciones" className="boton boton-tenue">
                Lecciones
              </a>
            </>
          ) : (
            <button type="button" onClick={() => navegar("/")} className="boton boton-tenue">
              Inicio
            </button>
          )}
          <button
            type="button"
            onClick={() => navegar("/arquitectura")}
            className="boton boton-primario"
          >
            Mapa de capas
          </button>
        </nav>
      </div>

      <div className="border-t border-borde/70 bg-superficie/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tenue/70">
            Stack del TFI
          </span>
          {BADGES.map((badge) => (
            <span key={badge} className="chip border-acento/25 text-acento/90">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
