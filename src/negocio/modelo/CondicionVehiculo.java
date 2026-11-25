package negocio.modelo;

/**
 * Condición comercial de un vehículo dentro del stock.
 *
 * <p>Permite expresar de forma explícita si la unidad es nueva o usada, sin
 * depender de convenciones implícitas sobre el kilometraje.</p>
 */
public enum CondicionVehiculo {

    /** Unidad nueva, sin kilometraje de uso. */
    NUEVO,

    /** Unidad usada, con kilometraje de uso mayor que cero. */
    USADO
}
