package negocio.excepciones;

/**
 * Se lanza cuando se intenta incorporar un vehículo cuya identidad ya existe.
 *
 * <p>La identidad está dada por el identificador inmutable del vehículo. La
 * capa de servicio será responsable de detectar la colisión antes de agregar
 * la unidad al stock.</p>
 */
public class VehiculoDuplicadoException extends Exception {

    /** Versión de la clase para serialización. */
    private static final long serialVersionUID = 1L;

    /**
     * Construye la excepción con un mensaje descriptivo.
     *
     * @param mensaje explicación del identificador repetido
     */
    public VehiculoDuplicadoException(String mensaje) {
        super(mensaje);
    }

    /**
     * Construye la excepción con un mensaje y la causa original.
     *
     * @param mensaje explicación del identificador repetido
     * @param causa   excepción que originó el error
     */
    public VehiculoDuplicadoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
