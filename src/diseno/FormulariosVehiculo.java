package diseno;

import java.util.Objects;

import negocio.excepciones.DatoVehiculoInvalidoException;
import negocio.modelo.Auto;
import negocio.modelo.Camioneta;
import negocio.modelo.Carroceria;
import negocio.modelo.CondicionVehiculo;
import negocio.modelo.EstiloMotocicleta;
import negocio.modelo.Motocicleta;
import negocio.modelo.Vehiculo;

/**
 * Formularios por consola para construir vehículos del stock.
 *
 * <p>Cada método solicita los datos de una categoría y devuelve una instancia
 * concreta como {@link Vehiculo}, aplicando polimorfismo: el servicio no necesita
 * conocer la subclase. Esta clase no guarda ni persiste nada; solo concentra la
 * captura y delega la validación de invariantes en el constructor de cada
 * entidad del modelo.</p>
 */
public class FormulariosVehiculo {

    /** Entrada compartida con el menú principal. */
    private final EntradaConsola entrada;

    /**
     * Crea los formularios usando una entrada de consola ya existente.
     *
     * @param entrada lector de consola; no puede ser nulo
     * @throws NullPointerException si la entrada es nula
     */
    public FormulariosVehiculo(EntradaConsola entrada) {
        this.entrada = Objects.requireNonNull(entrada, "La entrada de consola es obligatoria.");
    }

    /**
     * Solicita los datos y construye un {@link Auto}.
     *
     * @return automóvil listo para dar de alta
     * @throws DatoVehiculoInvalidoException si un dato no respeta una invariante del dominio
     */
    public Vehiculo solicitarAuto() throws DatoVehiculoInvalidoException {
        DatosComunes datos = solicitarDatosComunes();
        Carroceria carroceria = entrada.leerEnum(
                "Carrocería (SEDAN, HATCHBACK, SUV, COUPE, PICKUP, FURGON): ", Carroceria.class);
        return new Auto(datos.identificador, datos.marca, datos.modelo, datos.anio,
                datos.color, datos.condicion, datos.kilometraje, datos.valorComercial, carroceria);
    }

    /**
     * Solicita los datos y construye una {@link Camioneta}.
     *
     * @return camioneta lista para dar de alta
     * @throws DatoVehiculoInvalidoException si un dato no respeta una invariante del dominio
     */
    public Vehiculo solicitarCamioneta() throws DatoVehiculoInvalidoException {
        DatosComunes datos = solicitarDatosComunes();
        Carroceria carroceria = entrada.leerEnum(
                "Carrocería (SEDAN, HATCHBACK, SUV, COUPE, PICKUP, FURGON): ", Carroceria.class);
        return new Camioneta(datos.identificador, datos.marca, datos.modelo, datos.anio,
                datos.color, datos.condicion, datos.kilometraje, datos.valorComercial, carroceria);
    }

    /**
     * Solicita los datos y construye una {@link Motocicleta}.
     *
     * @return motocicleta lista para dar de alta
     * @throws DatoVehiculoInvalidoException si un dato no respeta una invariante del dominio
     */
    public Vehiculo solicitarMotocicleta() throws DatoVehiculoInvalidoException {
        DatosComunes datos = solicitarDatosComunes();
        EstiloMotocicleta estilo = entrada.leerEnum(
                "Estilo (DEPORTIVA, CRUISER, SCOOTER, ENDURO, NAKED, TOURING): ",
                EstiloMotocicleta.class);
        return new Motocicleta(datos.identificador, datos.marca, datos.modelo, datos.anio,
                datos.color, datos.condicion, datos.kilometraje, datos.valorComercial, estilo);
    }

    /**
     * Lee los atributos comunes a las tres subclases.
     *
     * <p>Si la condición es {@link CondicionVehiculo#NUEVO}, el kilometraje se
     * fija en cero y no se pide; para {@link CondicionVehiculo#USADO} se solicita
     * y el modelo valida que sea mayor que cero.</p>
     *
     * @return datos comunes ya validados sintácticamente
     * @throws DatoVehiculoInvalidoException si una entrada es inválida
     */
    private DatosComunes solicitarDatosComunes() throws DatoVehiculoInvalidoException {
        String identificador = entrada.leerTexto("Identificador (patente o código): ");
        String marca = entrada.leerTexto("Marca: ");
        String modelo = entrada.leerTexto("Modelo: ");
        int anio = entrada.leerEntero("Año de fabricación: ");
        String color = entrada.leerTexto("Color: ");
        CondicionVehiculo condicion = entrada.leerEnum("Condición (NUEVO/USADO): ",
                CondicionVehiculo.class);

        int kilometraje;
        if (condicion == CondicionVehiculo.NUEVO) {
            kilometraje = 0;
            System.out.println("Unidad 0 km: kilometraje fijado en 0.");
        } else {
            kilometraje = entrada.leerEntero("Kilometraje: ");
        }

        double valorComercial = entrada.leerDecimal("Valor comercial: ");
        return new DatosComunes(identificador, marca, modelo, anio, color,
                condicion, kilometraje, valorComercial);
    }

    /**
     * Transporte interno de los atributos compartidos por las tres subclases.
     */
    private static final class DatosComunes {

        private final String identificador;
        private final String marca;
        private final String modelo;
        private final int anio;
        private final String color;
        private final CondicionVehiculo condicion;
        private final int kilometraje;
        private final double valorComercial;

        private DatosComunes(String identificador, String marca, String modelo, int anio,
                             String color, CondicionVehiculo condicion, int kilometraje,
                             double valorComercial) {
            this.identificador = identificador;
            this.marca = marca;
            this.modelo = modelo;
            this.anio = anio;
            this.color = color;
            this.condicion = condicion;
            this.kilometraje = kilometraje;
            this.valorComercial = valorComercial;
        }
    }
}
