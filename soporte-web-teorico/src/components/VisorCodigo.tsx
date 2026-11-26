import CodigoCopiable from "./CodigoCopiable";
import type { FragmentoCodigo } from "../data/types";

/** Fragmento real del repositorio con notas línea por línea y conexión previa. */
export default function VisorCodigo({ fragmento }: { fragmento: FragmentoCodigo }) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="etiqueta">Fragmento {fragmento.id}</span>
        <span className="chip">{fragmento.archivo}</span>
      </div>

      <CodigoCopiable
        codigo={fragmento.codigo}
        archivo={fragmento.archivo}
        lineas={fragmento.lineas}
      />

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {fragmento.comentarios.map((comentario) => (
          <p
            key={comentario.linea}
            className="rounded-lg border border-borde bg-superficie-2/50 px-3 py-2 text-[13px] text-tenue"
          >
            <span className="mr-2 font-mono text-[11px] font-semibold text-acento">
              L{comentario.linea}
            </span>
            {comentario.texto}
          </p>
        ))}
      </div>

      <p className="mt-3 border-l-2 border-acento/50 pl-3 text-[13px] italic text-tenue">
        Conexión con la etapa anterior: {fragmento.conexionAnterior}
      </p>
    </div>
  );
}
