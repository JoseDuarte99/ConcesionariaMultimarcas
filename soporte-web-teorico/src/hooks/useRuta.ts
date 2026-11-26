import { useCallback, useEffect, useState } from "react";

/** Vistas posibles de la aplicación, resueltas sin librerías de enrutamiento. */
export type Ruta =
  | { vista: "inicio" }
  | { vista: "leccion"; id: string }
  | { vista: "arquitectura" };

function parsear(ruta: string): Ruta {
  const limpia = ruta.replace(/\/+$/, "") || "/";
  const coincide = limpia.match(/^\/leccion\/([^/]+)$/);
  if (coincide) {
    return { vista: "leccion", id: decodeURIComponent(coincide[1]) };
  }
  if (limpia === "/arquitectura") {
    return { vista: "arquitectura" };
  }
  return { vista: "inicio" };
}

/**
 * Router mínimo basado en la History API.
 *
 * Permite URLs reales como `/leccion/leccion-03` y reacciona al botón
 * "atrás" del navegador. Vite sirve `index.html` para esas rutas en
 * desarrollo y en `preview`.
 */
export function useRuta() {
  const [ruta, setRuta] = useState<Ruta>(() => parsear(window.location.pathname));

  useEffect(() => {
    const alCambiar = () => setRuta(parsear(window.location.pathname));
    window.addEventListener("popstate", alCambiar);
    return () => window.removeEventListener("popstate", alCambiar);
  }, []);

  const navegar = useCallback((destino: string) => {
    if (window.location.pathname !== destino) {
      window.history.pushState({}, "", destino);
      setRuta(parsear(destino));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { ruta, navegar };
}
