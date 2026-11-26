package diseno;

import java.util.Locale;
import java.util.Scanner;

import negocio.excepciones.DatoVehiculoInvalidoException;

/**
 * Lectura y validación sintáctica de los datos ingresados por consola.
 *
 * <p>Concentra el único {@link Scanner} del proyecto para no perder caracteres
 * entre lecturas. Convierte los fallos de parseo en
 * {@link DatoVehiculoInvalidoException}, de modo que el menú pueda informarlos
 * y seguir ejecutándose.</p>
 *
 * <p>No contiene reglas de negocio: solo verifica formato (texto no vacío,
 * entero, decimal, opción dentro de un rango y constante de enum válida). Las
 * invariantes del dominio se validan en el modelo.</p>
 */
public class EntradaConsola implements AutoCloseable {

    /** Lector compartido de la entrada estándar. */
    private final Scanner lector;

    /**
     * Crea el lector asociado a la entrada estándar.
     */
    public EntradaConsola() {
        this.lector = new Scanner(System.in);
    }

    /**
     * Lee una línea no vacía y la devuelve sin espacios periféricos.
     *
     * @param mensaje texto a mostrar antes de la lectura
     * @return texto ingresado, recortado
     * @throws DatoVehiculoInvalidoException si la entrada está vacía
     */
    public String leerTexto(String mensaje) throws DatoVehiculoInvalidoException {
        System.out.print(mensaje);
        String valor = lector.nextLine();
        if (valor.trim().isEmpty()) {
            throw new DatoVehiculoInvalidoException("El campo no puede estar vacío.");
        }
        return valor.trim();
    }

    /**
     * Lee un número entero mediante {@link Integer#parseInt(String)}.
     *
     * @param mensaje texto a mostrar antes de la lectura
     * @return entero parseado
     * @throws DatoVehiculoInvalidoException si el texto no es un entero válido
     */
    public int leerEntero(String mensaje) throws DatoVehiculoInvalidoException {
        String texto = leerTexto(mensaje);
        try {
            return Integer.parseInt(texto);
        } catch (NumberFormatException causa) {
            throw new DatoVehiculoInvalidoException("Se esperaba un número entero.", causa);
        }
    }

    /**
     * Lee un número decimal mediante {@link Double#parseDouble(String)}.
     *
     * @param mensaje texto a mostrar antes de la lectura
     * @return decimal parseado
     * @throws DatoVehiculoInvalidoException si el texto no es un decimal válido
     */
    public double leerDecimal(String mensaje) throws DatoVehiculoInvalidoException {
        String texto = leerTexto(mensaje);
        try {
            return Double.parseDouble(texto);
        } catch (NumberFormatException causa) {
            throw new DatoVehiculoInvalidoException("Se esperaba un número decimal.", causa);
        }
    }

    /**
     * Lee una constante de un enum, aceptando mayúsculas y minúsculas.
     *
     * @param <E>     tipo de enum
     * @param mensaje texto a mostrar antes de la lectura
     * @param tipo    clase del enum, utilizada por {@link Enum#valueOf}
     * @return constante seleccionada
     * @throws DatoVehiculoInvalidoException si el texto no es una constante del enum
     */
    public <E extends Enum<E>> E leerEnum(String mensaje, Class<E> tipo)
            throws DatoVehiculoInvalidoException {
        String texto = leerTexto(mensaje).toUpperCase(Locale.ROOT);
        try {
            return Enum.valueOf(tipo, texto);
        } catch (IllegalArgumentException causa) {
            throw new DatoVehiculoInvalidoException(
                    "Valor inválido. Opciones: " + listarConstantes(tipo), causa);
        }
    }

    /**
     * Lee una opción numérica dentro de un rango cerrado.
     *
     * @param mensaje texto a mostrar antes de la lectura
     * @param minimo  valor mínimo aceptado
     * @param maximo  valor máximo aceptado
     * @return opción válida
     * @throws DatoVehiculoInvalidoException si el número queda fuera del rango
     */
    public int leerOpcion(String mensaje, int minimo, int maximo)
            throws DatoVehiculoInvalidoException {
        int opcion = leerEntero(mensaje);
        if (opcion < minimo || opcion > maximo) {
            throw new DatoVehiculoInvalidoException(
                    "La opción debe estar entre " + minimo + " y " + maximo + ".");
        }
        return opcion;
    }

    /**
     * Enumera las constantes de un enum para mostrarlas en el mensaje de error.
     *
     * @param <E>  tipo de enum
     * @param tipo clase del enum
     * @return nombres separados por coma
     */
    private static <E extends Enum<E>> String listarConstantes(Class<E> tipo) {
        StringBuilder texto = new StringBuilder();
        E[] constantes = tipo.getEnumConstants();
        for (int i = 0; i < constantes.length; i++) {
            if (i > 0) {
                texto.append(", ");
            }
            texto.append(constantes[i].name());
        }
        return texto.toString();
    }

    /**
     * Cierra el lector y la entrada estándar al finalizar la aplicación.
     */
    @Override
    public void close() {
        lector.close();
    }
}
