package negocio.modelo;

/**
 * Tipos de carrocería aplicables a automóviles y camionetas.
 *
 * <p>Es una categoría cerrada del dominio: sus valores se fijan en tiempo de
 * compilación y no admiten extensiones en tiempo de ejecución.</p>
 */
public enum Carroceria {

    /** Carrocería de tres volúmenes (sedán). */
    SEDAN,

    /** Carrocería de dos volúmenes (hatchback). */
    HATCHBACK,

    /** Vehículo utilitario deportivo. */
    SUV,

    /** Carrocería deportiva de dos puertas. */
    COUPE,

    /** Camioneta de caja abierta. */
    PICKUP,

    /** Vehículo de carga cerrado. */
    FURGON
}
