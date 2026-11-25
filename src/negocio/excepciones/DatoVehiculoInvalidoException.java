package negocio.excepciones;

/**
 * Se lanza cuando un dato de un vehículo no respeta una invariante del dominio.
 *
 * <p>Ejemplos: identificador vacío, año inválido, kilometraje incompatible con
 * la condición o valor comercial negativo. Se lanza desde el modelo o el
 * servicio y se traduce a un mensaje claro en la capa Diseño.</p>
 */
public class DatoVehiculoInvalidoException extends Exception {

    /** Versión de la clase para serialización. */
    private static final long serialVersionUID = 1L;

    /**
     * Construye la excepción con un mensaje descriptivo.
     *
     * @param mensaje explicación del dato inválido
     */
    public DatoVehiculoInvalidoException(String mensaje) {
        super(mensaje);
    }

    /**
     * Construye la excepción con un mensaje y la causa original.
     *
     * @param mensaje explicación del dato inválido
     * @param causa   excepción que originó el error, por ejemplo un fallo de parseo
     */
    public DatoVehiculoInvalidoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
