import { useState } from "react";

type IdCapa = "diseno" | "servicio" | "modelo" | "persistencia";

interface Capa {
  id: IdCapa;
  nombre: string;
  subtitulo: string;
  archivos: string[];
  descripcion: string;
  reglas: string[];
  caja: { x: number; y: number };
}

const CAPAS: Capa[] = [
  {
    id: "diseno",
    nombre: "Diseño · Consola",
    subtitulo: "Main / EntradaConsola / FormulariosVehiculo",
    archivos: ["Main.java", "EntradaConsola.java", "FormulariosVehiculo.java"],
    descripcion:
      "Captura los datos, parsea con Wrappers y traduce las excepciones de negocio a mensajes claros. Es el único paquete autorizado para usar Scanner, System.out y System.err.",
    reglas: [
      "Puede importar servicios y excepciones.",
      "No contiene reglas de negocio ni rutas de archivos.",
      "Devuelve el alta al servicio; no persiste por su cuenta.",
    ],
    caja: { x: 70, y: 80 },
  },
  {
    id: "servicio",
    nombre: "Negocio · Servicio",
    subtitulo: "ConcesionariaService",
    archivos: ["ConcesionariaService.java"],
    descripcion:
      "Coordina los casos de uso: alta, baja, modificación, consultas y filtros. Mantiene List<Vehiculo> y Map<String, Vehiculo> sincronizados y delega el almacenamiento al repositorio inyectado.",
    reglas: [
      "No lee ni imprime por consola.",
      "Recibe parámetros y devuelve resultados o lanza excepciones.",
      "Devuelve copias defensivas en las consultas.",
    ],
    caja: { x: 600, y: 80 },
  },
  {
    id: "modelo",
    nombre: "Modelo · Jerarquía",
    subtitulo: "Vehiculo / Auto / Camioneta / Motocicleta",
    archivos: [
      "Vehiculo.java",
      "Auto.java",
      "Camioneta.java",
      "Motocicleta.java",
      "Cotizable.java",
      "TipoVehiculo.java",
      "CondicionVehiculo.java",
    ],
    descripcion:
      "POJO abstracto con estado privado, constructores validadores e invariantes. Tres subclases concretas aportan carrocería o estilo; los enums cierran las categorías y Cotizable define el contrato de cotización.",
    reglas: [
      "No depende de la consola ni de la persistencia.",
      "equals/hashCode se apoyan en el identificador final.",
      "La coherencia NUEVO = 0 km se valida en modelo.",
    ],
    caja: { x: 70, y: 340 },
  },
  {
    id: "persistencia",
    nombre: "Persistencia · Archivos",
    subtitulo: "RepositorioGenerico / RepositorioVehiculos / VehiculoCodec",
    archivos: [
      "RepositorioGenerico.java",
      "RepositorioVehiculos.java",
      "VehiculoCodec.java",
    ],
    descripcion:
      "Contrato genérico parametrizado por entidad e id, implementación en data/stock.txt y codec que convierte objetos a diez campos separados por '|' con escape. Los recursos se cierran con try-with-resources.",
    reglas: [
      "No pide datos al usuario ni imprime resultados.",
      "La ruta es relativa e inyectable por constructor.",
      "Archivo inexistente equivale a stock vacío.",
    ],
    caja: { x: 600, y: 340 },
  },
];

const ANCHO = 250;
const ALTO = 120;

const FLUJOS = [
  { d: "M320 140 H600", etiqueta: "alta(vehiculo)", x: 460, y: 128 },
  { d: "M725 200 V340", etiqueta: "guardar() / cargar()", x: 735, y: 275 },
  { d: "M600 400 H320", etiqueta: "decodificar → entidades", x: 460, y: 388 },
  { d: "M195 340 V200", etiqueta: "toString()", x: 205, y: 275 },
  { d: "M600 165 L320 375", etiqueta: "List / Map + reglas", x: 470, y: 252 },
];

export default function MapaArquitectura({ volver }: { volver: () => void }) {
  const [activa, setActiva] = useState<IdCapa>("servicio");
  const capa = CAPAS.find((item) => item.id === activa) ?? CAPAS[1];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <button
        type="button"
        onClick={volver}
        className="font-mono text-[11px] uppercase tracking-widest text-tenue hover:text-acento"
      >
        ← Volver al roadmap
      </button>

      <div className="mt-4 mb-7">
        <p className="etiqueta">03 · Arquitectura</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Mapa Visual de Capas
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-tenue">
          Los datos bajan de la consola al servicio, el servicio coordina el modelo y
          delega el archivo a persistencia; el modelo devuelve la ficha legible para
          mostrarse. Cliqueá una capa para ver sus responsabilidades.
        </p>
      </div>

      <section className="tarjeta overflow-hidden p-3 md:p-5">
        <svg
          viewBox="0 0 920 540"
          className="h-auto w-full"
          role="img"
          aria-label="Diagrama de flujo entre las capas Diseño, Servicio, Modelo y Persistencia"
        >
          <defs>
            <marker
              id="punta-flujo"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#38bdf8" />
            </marker>
          </defs>

          {FLUJOS.map((flujo) => (
            <g key={flujo.d}>
              <path
                d={flujo.d}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.6"
                strokeOpacity="0.5"
                markerEnd="url(#punta-flujo)"
                className="flujo-activo"
              />
              <text
                x={flujo.x}
                y={flujo.y}
                textAnchor="middle"
                className="font-mono text-[11px]"
                fill="#92a3ba"
              >
                {flujo.etiqueta}
              </text>
            </g>
          ))}

          {CAPAS.map((item) => {
            const seleccionada = item.id === activa;
            return (
              <g
                key={item.id}
                onClick={() => setActiva(item.id)}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    setActiva(item.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles de ${item.nombre}`}
                className="cursor-pointer focus:outline-none"
              >
                <rect
                  x={item.caja.x}
                  y={item.caja.y}
                  width={ANCHO}
                  height={ALTO}
                  rx="16"
                  fill={seleccionada ? "#12253a" : "#0d1523"}
                  stroke={seleccionada ? "#38bdf8" : "#1e2c42"}
                  strokeWidth={seleccionada ? 2 : 1}
                />
                <text
                  x={item.caja.x + 18}
                  y={item.caja.y + 34}
                  className="font-mono text-[10px] uppercase tracking-widest"
                  fill={seleccionada ? "#38bdf8" : "#92a3ba"}
                >
                  {item.id}
                </text>
                <text
                  x={item.caja.x + 18}
                  y={item.caja.y + 64}
                  className="text-[17px] font-semibold"
                  fill="#e6edf6"
                >
                  {item.nombre}
                </text>
                <text
                  x={item.caja.x + 18}
                  y={item.caja.y + 94}
                  className="font-mono text-[10px]"
                  fill="#92a3ba"
                >
                  {item.subtitulo.length > 42
                    ? `${item.subtitulo.slice(0, 40)}…`
                    : item.subtitulo}
                </text>
              </g>
            );
          })}
        </svg>
      </section>

      <section className="tarjeta mt-5 grid gap-5 p-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="etiqueta">Capa seleccionada · {capa.id}</p>
          <h2 className="mt-2 text-xl font-semibold">{capa.nombre}</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-tenue">{capa.descripcion}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {capa.archivos.map((archivo) => (
              <span key={archivo} className="chip font-mono">
                {archivo}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="etiqueta">Reglas de dependencia</p>
          <ul className="mt-3 space-y-2">
            {capa.reglas.map((regla, indice) => (
              <li
                key={indice}
                className="rounded-lg border border-borde bg-superficie-2/50 px-3 py-2 text-[13px] text-tenue"
              >
                <span className="mr-2 font-mono text-acento">{String(indice + 1).padStart(2, "0")}</span>
                {regla}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
