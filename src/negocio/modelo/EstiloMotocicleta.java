package negocio.modelo;

/**
 * Estilos comerciales de motocicletas.
 *
 * <p>Es una categoría cerrada del dominio: sus valores se fijan en tiempo de
 * compilación y no admiten extensiones en tiempo de ejecución.</p>
 */
public enum EstiloMotocicleta {

    /** Motocicleta de uso deportivo. */
    DEPORTIVA,

    /** Motocicleta de estilo crucero. */
    CRUISER,

    /** Motocicleta urbana de transmisión automática. */
    SCOOTER,

    /** Motocicleta apta para terrenos irregulares. */
    ENDURO,

    /** Motocicleta sin carenado frontal. */
    NAKED,

    /** Motocicleta pensada para viajes largos. */
    TOURING
}
