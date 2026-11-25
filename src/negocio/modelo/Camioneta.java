package negocio.modelo;

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
     */
    public Camioneta(String identificador, String marca, String modelo, int anio,
                     String color, CondicionVehiculo condicion, int kilometraje,
                     double valorComercial, Carroceria carroceria) {
        super(identificador, marca, modelo, anio, color, condicion, kilometraje, valorComercial);
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
     */
    public void setCarroceria(Carroceria carroceria) {
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
