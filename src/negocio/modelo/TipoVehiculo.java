package negocio.modelo;

/**
 * Tipos de vehículos comercializados por la concesionaria.
 *
 * <p>Se trata de una categoría cerrada: no admite valores nuevos en tiempo de
 * ejecución. Las subclases concretas de {@code Vehiculo} se corresponden con
 * estas constantes.</p>
 */
public enum TipoVehiculo {

    /** Vehículo de pasajeros. */
    AUTO,

    /** Utilitario o vehículo de carga liviana. */
    CAMIONETA,

    /** Vehículo de dos ruedas. */
    MOTOCICLETA
}
