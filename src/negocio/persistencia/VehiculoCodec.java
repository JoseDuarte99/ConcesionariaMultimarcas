package negocio.persistencia;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import negocio.excepciones.DatoVehiculoInvalidoException;
import negocio.modelo.Auto;
import negocio.modelo.Camioneta;
import negocio.modelo.Carroceria;
import negocio.modelo.CondicionVehiculo;
import negocio.modelo.EstiloMotocicleta;
import negocio.modelo.Motocicleta;
import negocio.modelo.TipoVehiculo;
import negocio.modelo.Vehiculo;

/**
 * Traduce vehículos a registros de texto y viceversa.
 *
 * <p>Formato de cada línea, con campos separados por {@code |}:</p>
 * <pre>
 * tipo|identificador|marca|modelo|anio|color|condicion|kilometraje|valorComercial|extra
 * </pre>
 * <p>{@code extra} es la carrocería para {@code Auto} y {@code Camioneta}, o el
 * estilo para {@code Motocicleta}. Los caracteres {@code |} y {@code \}
 * dentro de textos se escapen con {@code \}. Esta clase es de uso interno de
 * persistencia: no interactúa con la consola.</p>
 */
final class VehiculoCodec {

    /** Separador de campos del formato. */
    private static final char SEPARADOR = '|';

    /** Carácter de escape para el separador y para sí mismo. */
    private static final char ESCAPE = '\\';

    /** Cantidad de campos que debe tener un registro completo. */
    private static final int CANTIDAD_CAMPOS = 10;

    /** Evita la instanciación de una clase utilitaria. */
    private VehiculoCodec() {
    }

    /**
     * Convierte un vehículo en una línea de texto.
     *
     * @param vehiculo vehículo a codificar
     * @return registro listo para escribir en el archivo
     * @throws IOException si el vehículo es nulo o no es una subclase conocida
     */
    static String codificar(Vehiculo vehiculo) throws IOException {
        if (vehiculo == null) {
            throw new IOException("No se puede codificar un vehículo nulo.");
        }

        String extra;
        if (vehiculo instanceof Auto) {
            extra = String.valueOf(((Auto) vehiculo).getCarroceria());
        } else if (vehiculo instanceof Camioneta) {
            extra = String.valueOf(((Camioneta) vehiculo).getCarroceria());
        } else if (vehiculo instanceof Motocicleta) {
            extra = String.valueOf(((Motocicleta) vehiculo).getEstilo());
        } else {
            throw new IOException("Tipo de vehículo no soportado: "
                    + vehiculo.getClass().getSimpleName());
        }

        return vehiculo.getTipoVehiculo() + String.valueOf(SEPARADOR)
                + escapar(vehiculo.getIdentificador()) + SEPARADOR
                + escapar(vehiculo.getMarca()) + SEPARADOR
                + escapar(vehiculo.getModelo()) + SEPARADOR
                + vehiculo.getAnio() + SEPARADOR
                + escapar(vehiculo.getColor()) + SEPARADOR
                + vehiculo.getCondicion() + SEPARADOR
                + vehiculo.getKilometraje() + SEPARADOR
                + vehiculo.getValorComercial() + SEPARADOR
                + extra;
    }

    /**
     * Reconstruye un vehículo a partir de una línea de texto.
     *
     * @param registro línea leída del archivo
     * @return vehículo reconstruido
     * @throws IOException si el registro está mal formado o sus datos son inválidos
     */
    static Vehiculo decodificar(String registro) throws IOException {
        String[] campos = dividirCampos(registro);
        if (campos.length != CANTIDAD_CAMPOS) {
            throw new IOException("El registro debe tener " + CANTIDAD_CAMPOS
                    + " campos y tiene " + campos.length + ".");
        }

        TipoVehiculo tipo = parsearEnum(TipoVehiculo.class, campos[0], "tipo");
        String identificador = desescapar(campos[1]);
        String marca = desescapar(campos[2]);
        String modelo = desescapar(campos[3]);
        int anio = parsearEntero(campos[4], "anio");
        String color = desescapar(campos[5]);
        CondicionVehiculo condicion = parsearEnum(CondicionVehiculo.class, campos[6], "condicion");
        int kilometraje = parsearEntero(campos[7], "kilometraje");
        double valorComercial = parsearDecimal(campos[8], "valorComercial");

        try {
            switch (tipo) {
                case AUTO:
                    return new Auto(identificador, marca, modelo, anio, color, condicion,
                            kilometraje, valorComercial,
                            parsearEnum(Carroceria.class, campos[9], "carroceria"));
                case CAMIONETA:
                    return new Camioneta(identificador, marca, modelo, anio, color, condicion,
                            kilometraje, valorComercial,
                            parsearEnum(Carroceria.class, campos[9], "carroceria"));
                case MOTOCICLETA:
                    return new Motocicleta(identificador, marca, modelo, anio, color, condicion,
                            kilometraje, valorComercial,
                            parsearEnum(EstiloMotocicleta.class, campos[9], "estilo"));
                default:
                    throw new IOException("Tipo de vehículo no soportado: " + tipo);
            }
        } catch (DatoVehiculoInvalidoException causa) {
            throw new IOException("Los datos del registro violan una invariante del dominio.", causa);
        }
    }

    /**
     * Separa un registro en campos, respetando el separador escapado.
     *
     * @param registro registro completo
     * @return arreglo con los campos tal como aparecen en el archivo
     * @throws IOException si el registro termina con un escape incompleto
     */
    private static String[] dividirCampos(String registro) throws IOException {
        List<String> campos = new ArrayList<>();
        StringBuilder campoActual = new StringBuilder();
        boolean escapado = false;

        for (int i = 0; i < registro.length(); i++) {
            char caracter = registro.charAt(i);
            if (escapado) {
                campoActual.append(ESCAPE).append(caracter);
                escapado = false;
            } else if (caracter == ESCAPE) {
                escapado = true;
            } else if (caracter == SEPARADOR) {
                campos.add(campoActual.toString());
                campoActual.setLength(0);
            } else {
                campoActual.append(caracter);
            }
        }

        if (escapado) {
            throw new IOException("El registro termina con un escape incompleto.");
        }
        campos.add(campoActual.toString());
        return campos.toArray(new String[0]);
    }

    /**
     * Escapa los caracteres reservados dentro de un texto.
     *
     * @param valor texto original
     * @return texto con {@code |} y {@code \} escapados
     */
    private static String escapar(String valor) {
        return valor.replace(String.valueOf(ESCAPE), String.valueOf(ESCAPE) + ESCAPE)
                .replace(String.valueOf(SEPARADOR), ESCAPE + String.valueOf(SEPARADOR));
    }

    /**
     * Restaura los caracteres reservados de un campo.
     *
     * @param campo campo leído del archivo
     * @return texto original
     * @throws IOException si aparece un separador sin escapar o un escape inválido
     */
    private static String desescapar(String campo) throws IOException {
        StringBuilder resultado = new StringBuilder();
        for (int i = 0; i < campo.length(); i++) {
            char caracter = campo.charAt(i);
            if (caracter == ESCAPE) {
                if (i + 1 >= campo.length()) {
                    throw new IOException("Escape incompleto dentro de un campo.");
                }
                char siguiente = campo.charAt(++i);
                if (siguiente != ESCAPE && siguiente != SEPARADOR) {
                    throw new IOException("Secuencia de escape inválida: " + ESCAPE + siguiente);
                }
                resultado.append(siguiente);
            } else if (caracter == SEPARADOR) {
                throw new IOException("Separador sin escapar dentro de un campo.");
            } else {
                resultado.append(caracter);
            }
        }
        return resultado.toString();
    }

    /**
     * Parsea un campo entero.
     *
     * @param campo texto a parsear
     * @param nombre nombre del campo, usado en el mensaje de error
     * @return valor entero
     * @throws IOException si el texto no representa un entero válido
     */
    private static int parsearEntero(String campo, String nombre) throws IOException {
        try {
            return Integer.parseInt(campo);
        } catch (NumberFormatException causa) {
            throw new IOException("El campo " + nombre + " no es un entero válido: " + campo, causa);
        }
    }

    /**
     * Parsea un campo decimal.
     *
     * @param campo texto a parsear
     * @param nombre nombre del campo, usado en el mensaje de error
     * @return valor decimal
     * @throws IOException si el texto no representa un decimal válido
     */
    private static double parsearDecimal(String campo, String nombre) throws IOException {
        try {
            return Double.parseDouble(campo);
        } catch (NumberFormatException causa) {
            throw new IOException("El campo " + nombre + " no es un decimal válido: " + campo, causa);
        }
    }

    /**
     * Parsea un campo que representa una constante de enum.
     *
     * @param <E>   tipo del enum
     * @param tipo  clase del enum
     * @param campo texto a parsear
     * @param nombre nombre del campo, usado en el mensaje de error
     * @return constante del enum
     * @throws IOException si el texto no coincide con ninguna constante
     */
    private static <E extends Enum<E>> E parsearEnum(Class<E> tipo, String campo, String nombre)
            throws IOException {
        try {
            return Enum.valueOf(tipo, campo);
        } catch (IllegalArgumentException causa) {
            throw new IOException("Valor inválido para " + nombre + ": " + campo, causa);
        }
    }
}
