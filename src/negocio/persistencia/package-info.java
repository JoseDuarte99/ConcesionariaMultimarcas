/**
 * Acceso a datos del sistema de concesionaria.
 *
 * <p>Pertenece a la capa Negocio. Encapsula el contrato genérico
 * {@link negocio.persistencia.RepositorioGenerico}, la implementación en
 * archivos de texto y el formato de registro. No solicita datos al usuario ni
 * presenta resultados por consola: informa fallos de E/S con
 * {@link java.io.IOException} y colisiones de identidad con excepciones de
 * dominio.</p>
 */
package negocio.persistencia;
