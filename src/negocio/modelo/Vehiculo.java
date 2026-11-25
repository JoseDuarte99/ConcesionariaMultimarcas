package negocio.modelo;

/**
 * Representación abstracta de un vehículo del stock de la concesionaria.
 *
 * <p>Concentra los atributos comunes a todas las unidades (identificador,
 * marca, modelo, año, color, condición, kilometraje y valor comercial) y
 * define el contrato polimórfico que deben cumplir las subclases concretas.</p>
 *
 * <p>Implementa {@link Cotizable}: el valor comercial base es el almacenado
 * en {@code valorComercial}; las subclases pueden sobrescribir
 * {@link #calcularValorComercial()} si aplican reglas específicas (por ejemplo,
 * depreciación según la condición).</p>
 *
 * <p>La identidad del vehículo está dada por su {@code identificador}
 * (patente o código interno), que es inmutable una vez creado el objeto y
 * servirá de clave de igualdad en la Issue #4.</p>
 *
 * <p>Las invariantes de dominio (kilometraje coherente con la condición,
 * valores no negativos, identificador no vacío, etc.) se validan en los
 * mutadores y se implementan en la Issue #3 mediante excepciones propias del
 * dominio.</p>
 */
public abstract class Vehiculo implements Cotizable {

    /** Identificador único del vehículo (patente o código interno). Inmutable. */
    private final String identificador;

    private String marca;
    private String modelo;
    private int anio;
    private String color;
    private CondicionVehiculo condicion;
    private int kilometraje;
    private double valorComercial;

    /**
     * Construye un vehículo con todos sus atributos comunes.
     *
     * @param identificador   clave de identidad única (patente o código interno)
     * @param marca           marca comercial
     * @param modelo          modelo comercial
     * @param anio            año de fabricación
     * @param color           color de la unidad
     * @param condicion       condición comercial (nuevo/usado)
     * @param kilometraje     kilómetros recorridos
     * @param valorComercial  valor comercial estimado
     */
    protected Vehiculo(String identificador, String marca, String modelo, int anio,
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

    /**
     * Devuelve el identificador único del vehículo.
     *
     * @return patente o código interno
     */
    public String getIdentificador() {
        return identificador;
    }

    /**
     * Devuelve la marca comercial.
     *
     * @return marca
     */
    public String getMarca() {
        return marca;
    }

    /**
     * Asigna la marca comercial.
     *
     * @param marca nueva marca
     */
    public void setMarca(String marca) {
        this.marca = marca;
    }

    /**
     * Devuelve el modelo comercial.
     *
     * @return modelo
     */
    public String getModelo() {
        return modelo;
    }

    /**
     * Asigna el modelo comercial.
     *
     * @param modelo nuevo modelo
     */
    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    /**
     * Devuelve el año de fabricación.
     *
     * @return año
     */
    public int getAnio() {
        return anio;
    }

    /**
     * Asigna el año de fabricación.
     *
     * @param anio nuevo año
     */
    public void setAnio(int anio) {
        this.anio = anio;
    }

    /**
     * Devuelve el color de la unidad.
     *
     * @return color
     */
    public String getColor() {
        return color;
    }

    /**
     * Asigna el color de la unidad.
     *
     * @param color nuevo color
     */
    public void setColor(String color) {
        this.color = color;
    }

    /**
     * Devuelve la condición comercial.
     *
     * @return condición (nuevo/usado)
     */
    public CondicionVehiculo getCondicion() {
        return condicion;
    }

    /**
     * Asigna la condición comercial.
     *
     * @param condicion nueva condición
     */
    public void setCondicion(CondicionVehiculo condicion) {
        this.condicion = condicion;
    }

    /**
     * Devuelve los kilómetros recorridos.
     *
     * @return kilometraje
     */
    public int getKilometraje() {
        return kilometraje;
    }

    /**
     * Asigna los kilómetros recorridos.
     *
     * @param kilometraje nuevo kilometraje
     */
    public void setKilometraje(int kilometraje) {
        this.kilometraje = kilometraje;
    }

    /**
     * Devuelve el valor comercial estimado.
     *
     * @return valor comercial
     */
    public double getValorComercial() {
        return valorComercial;
    }

    /**
     * Asigna el valor comercial estimado.
     *
     * @param valorComercial nuevo valor comercial
     */
    public void setValorComercial(double valorComercial) {
        this.valorComercial = valorComercial;
    }

    /**
     * Tipo de vehículo según la jerarquía concreta.
     *
     * @return constante de {@link TipoVehiculo} correspondiente a la subclase
     */
    public abstract TipoVehiculo getTipoVehiculo();

    /**
     * Calcula el valor comercial estimado del vehículo.
     *
     * <p>Implementación base: devuelve el {@code valorComercial} almacenado.
     * Las subclases pueden sobrescribir este método para aplicar reglas
     * específicas (por ejemplo, depreciación por condición).</p>
     *
     * @return valor comercial estimado, mayor o igual que cero
     */
    @Override
    public double calcularValorComercial() {
        return valorComercial;
    }
}
