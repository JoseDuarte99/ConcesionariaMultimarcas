/**
 * Capa de presentación por consola del sistema.
 *
 * <p>Es el único paquete autorizado en el proyecto para usar {@code Scanner},
 * {@code System.out} y {@code System.err}. No contiene reglas de negocio ni
 * detalles de persistencia.</p>
 *
 * <p>{@link Main} gestiona el menú, {@link EntradaConsola} concentra la lectura
 * y el parseo, y {@link FormulariosVehiculo} construye las entidades. Todas las
 * decisiones de negocio se delegan en el paquete {@code negocio.servicio}.</p>
 */
package diseno;
