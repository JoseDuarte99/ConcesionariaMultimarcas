package negocio.modelo;

/**
 * Motocicleta.
 *
 * <p>Hereda los atributos comunes de {@link Vehiculo} y agrega el estilo de
 * motocicleta, que es propio de esta categoría.</p>
 */
public class Motocicleta extends Vehiculo {

    private EstiloMotocicleta estilo;

    /**
     * Construye una motocicleta con todos sus atributos.
     *
     * @param identificador   clave de identidad única (patente o código interno)
     * @param marca           marca comercial
     * @param modelo          modelo comercial
     * @param anio            año de fabricación
     * @param color           color de la unidad
     * @param condicion       condición comercial (nuevo/usado)
     * @param kilometraje     kilómetros recorridos
     * @param valorComercial  valor comercial estimado
     * @param estilo          estilo de la motocicleta
     */
    public Motocicleta(String identificador, String marca, String modelo, int anio,
                       String color, CondicionVehiculo condicion, int kilometraje,
                       double valorComercial, EstiloMotocicleta estilo) {
        super(identificador, marca, modelo, anio, color, condicion, kilometraje, valorComercial);
        this.estilo = estilo;
    }

    /**
     * Devuelve el estilo de la motocicleta.
     *
     * @return estilo
     */
    public EstiloMotocicleta getEstilo() {
        return estilo;
    }

    /**
     * Asigna el estilo de la motocicleta.
     *
     * @param estilo nuevo estilo
     */
    public void setEstilo(EstiloMotocicleta estilo) {
        this.estilo = estilo;
    }

    /**
     * Devuelve el tipo de vehículo correspondiente a esta subclase.
     *
     * @return {@link TipoVehiculo#MOTOCICLETA}
     */
    @Override
    public TipoVehiculo getTipoVehiculo() {
        return TipoVehiculo.MOTOCICLETA;
    }
}
