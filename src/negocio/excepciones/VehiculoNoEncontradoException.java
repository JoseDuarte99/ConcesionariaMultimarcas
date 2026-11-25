package negocio.excepciones;

/**
 * Se lanza cuando una búsqueda o modificación no encuentra al vehículo pedido.
 *
 * <p>La capa de servicio será responsable de lanzarla al consultar por un
 * identificador inexistente en el stock.</p>
 */
public class VehiculoNoEncontradoException extends Exception {

    /** Versión de la clase para serialización. */
    private static final long serialVersionUID = 1L;

    /**
     * Construye la excepción con un mensaje descriptivo.
     *
     * @param mensaje explicación de la búsqueda fallida
     */
    public VehiculoNoEncontradoException(String mensaje) {
        super(mensaje);
    }

    /**
     * Construye la excepción con un mensaje y la causa original.
     *
     * @param mensaje explicación de la búsqueda fallida
     * @param causa   excepción que originó el error
     */
    public VehiculoNoEncontradoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
