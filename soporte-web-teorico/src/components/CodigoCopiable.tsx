import { useEffect, useRef, useState } from "react";
import { resaltarJava } from "../utils/resaltarJava.tsx";

interface Propiedades {
  codigo: string;
  archivo?: string;
  lineas?: string;
  compacto?: boolean;
}

/** Bloque de código Java resaltado, con copia al portapapeles. */
export default function CodigoCopiable({
  codigo,
  archivo,
  lineas,
  compacto = false,
}: Propiedades) {
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (temporizador.current !== undefined) {
        window.clearTimeout(temporizador.current);
      }
    },
    [],
  );

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
    } catch {
      const area = document.createElement("textarea");
      area.value = codigo;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopiado(true);
    if (temporizador.current !== undefined) {
      window.clearTimeout(temporizador.current);
    }
    temporizador.current = window.setTimeout(() => setCopiado(false), 1600);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-borde bg-[#080f1c]">
      {(archivo || lineas) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borde bg-superficie-2/60 px-4 py-2">
          <p className="font-mono text-[11px] text-tenue">
            {archivo} {lineas && <span className="text-acento">· líneas {lineas}</span>}
          </p>
          <button
            type="button"
            onClick={copiar}
            className="rounded-md border border-borde px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-tenue transition-colors hover:border-acento/50 hover:text-acento"
            aria-label="Copiar código al portapapeles"
          >
            {copiado ? "Copiado ✓" : "Copiar"}
          </button>
        </div>
      )}
      <pre
        className={`codigo overflow-x-auto px-4 py-4 text-slate-100 ${
          compacto ? "max-h-72" : ""
        }`}
      >
        <code>{resaltarJava(codigo)}</code>
      </pre>
    </div>
  );
}
