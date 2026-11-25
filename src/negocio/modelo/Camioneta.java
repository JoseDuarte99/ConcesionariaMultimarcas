package negocio.modelo;

import negocio.excepciones.DatoVehiculoInvalidoException;

/**
 * Camioneta (utilitario o vehículo de carga liviana).
 *
 * <p>Hereda los atributos comunes de {@link Vehiculo} y agrega el tipo de
 * carrocería, compartido con {@link Auto}.</p>
 */
public class Camioneta extends Vehiculo {

    private Carroceria carroceria;

    /**
     * Construye una camioneta con todos sus atributos.
     *
     * @param identificador   clave de identidad única (patente o código interno)
     * @param marca           marca comercial
     * @param modelo          modelo comercial
     * @param anio            año de fabricación
     * @param color           color de la unidad
     * @param condicion       condición comercial (nuevo/usado)
     * @param kilometraje     kilómetros recorridos
     * @param valorComercial  valor comercial estimado
     * @param carroceria      tipo de carrocería de la camioneta
     * @throws DatoVehiculoInvalidoException si algún dato común o la carrocería son inválidos
     */
    public Camioneta(String identificador, String marca, String modelo, int anio,
                     String color, CondicionVehiculo condicion, int kilometraje,
                     double valorComercial, Carroceria carroceria)
            throws DatoVehiculoInvalidoException {
        super(identificador, marca, modelo, anio, color, condicion, kilometraje, valorComercial);
        validarNoNulo(carroceria, "carroceria");
        this.carroceria = carroceria;
    }

    /**
     * Devuelve el tipo de carrocería.
     *
     * @return carrocería
     */
    public Carroceria getCarroceria() {
        return carroceria;
    }

    /**
     * Asigna el tipo de carrocería.
     *
     * @param carroceria nueva carrocería
     * @throws DatoVehiculoInvalidoException si la carrocería es nula
     */
    public void setCarroceria(Carroceria carroceria) throws DatoVehiculoInvalidoException {
        validarNoNulo(carroceria, "carroceria");
        this.carroceria = carroceria;
    }

    /**
     * Devuelve el tipo de vehículo correspondiente a esta subclase.
     *
     * @return {@link TipoVehiculo#CAMIONETA}
     */
    @Override
    public TipoVehiculo getTipoVehiculo() {
        return TipoVehiculo.CAMIONETA;
    }
}
