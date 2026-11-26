package negocio.modelo;

import java.util.Objects;

import negocio.excepciones.DatoVehiculoInvalidoException;

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
 * valores no negativos, identificador no vacío, etc.) se validan en el
 * constructor y en los mutadores. Un estado inválido se informa lanzando
 * {@link DatoVehiculoInvalidoException}, nunca con un valor centinela.</p>
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
     * @throws DatoVehiculoInvalidoException si alguno de los datos viola una invariante del dominio
     */
    protected Vehiculo(String identificador, String marca, String modelo, int anio,
                       String color, CondicionVehiculo condicion, int kilometraje,
                       double valorComercial) throws DatoVehiculoInvalidoException {
        validarTextoNoVacio(identificador, "identificador");
        validarTextoNoVacio(marca, "marca");
        validarTextoNoVacio(modelo, "modelo");
        validarAnio(anio);
        validarTextoNoVacio(color, "color");
        validarCondicion(condicion);
        validarKilometraje(condicion, kilometraje);
        validarValorComercial(valorComercial);

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
     * @throws DatoVehiculoInvalidoException si la marca es nula o está vacía
     */
    public void setMarca(String marca) throws DatoVehiculoInvalidoException {
        validarTextoNoVacio(marca, "marca");
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
     * @throws DatoVehiculoInvalidoException si el modelo es nulo o está vacío
     */
    public void setModelo(String modelo) throws DatoVehiculoInvalidoException {
        validarTextoNoVacio(modelo, "modelo");
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
     * @throws DatoVehiculoInvalidoException si el año no es positivo
     */
    public void setAnio(int anio) throws DatoVehiculoInvalidoException {
        validarAnio(anio);
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
     * @throws DatoVehiculoInvalidoException si el color es nulo o está vacío
     */
    public void setColor(String color) throws DatoVehiculoInvalidoException {
        validarTextoNoVacio(color, "color");
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
     * <p>Si la condición cambia, se revalida el kilometraje actual para no
     * dejar una unidad NUEVO con kilómetros o una USADO sin ellos.</p>
     *
     * @param condicion nueva condición
     * @throws DatoVehiculoInvalidoException si la condición es nula o el kilometraje actual es incompatible
     */
    public void setCondicion(CondicionVehiculo condicion) throws DatoVehiculoInvalidoException {
        validarCondicion(condicion);
        validarKilometraje(condicion, this.kilometraje);
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
     * @throws DatoVehiculoInvalidoException si es negativo o incompatible con la condición actual
     */
    public void setKilometraje(int kilometraje) throws DatoVehiculoInvalidoException {
        validarKilometraje(this.condicion, kilometraje);
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
     * @throws DatoVehiculoInvalidoException si es negativo, NaN o infinito
     */
    public void setValorComercial(double valorComercial) throws DatoVehiculoInvalidoException {
        validarValorComercial(valorComercial);
        this.valorComercial = valorComercial;
    }

    /**
     * Compara dos vehículos por su identidad de negocio.
     *
     * <p>Dos vehículos son iguales si y solo si son del mismo tipo concreto y
     * comparten el mismo {@code identificador} (patente o código interno). La
     * comparación es estricta por clase: un {@code Auto} y una
     * {@code Camioneta} con la misma patente no se consideran iguales.</p>
     *
     * @param obj objeto a comparar
     * @return {@code true} si ambos vehículos tienen la misma identidad
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Vehiculo otro = (Vehiculo) obj;
        return Objects.equals(identificador, otro.identificador);
    }

    /**
     * Código hash coherente con {@link #equals(Object)}.
     *
     * <p>Se basa únicamente en el {@code identificador}, que es la clave de
     * igualdad.</p>
     *
     * @return código hash del vehículo
     */
    @Override
    public int hashCode() {
        return Objects.hashCode(identificador);
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

    /**
     * Arma la descripción común de los atributos compartidos por todas las
     * subclases, para reutilizarla en {@link #toString()} sin duplicar código.
     *
     * @return texto con los campos comunes del vehículo
     */
    protected String descripcionComun() {
        return "identificador=" + identificador
                + ", marca=" + marca
                + ", modelo=" + modelo
                + ", anio=" + anio
                + ", color=" + color
                + ", condicion=" + condicion
                + ", kilometraje=" + kilometraje
                + ", valorComercial=" + valorComercial;
    }

    /**
     * Devuelve la ficha técnica completa del vehículo.
     *
     * <p>Incluye todos los atributos comunes y se sobrescribe en cada subclase
     * para agregar el campo específico (carrocería o estilo).</p>
     *
     * @return representación legible del vehículo
     */
    @Override
    public String toString() {
        return getTipoVehiculo() + "{" + descripcionComun() + "}";
    }

    /**
     * Verifica que un dato obligatorio no sea nulo.
     *
     * @param valor       dato a validar
     * @param nombreCampo nombre del campo, usado en el mensaje de error
     * @throws DatoVehiculoInvalidoException si el dato es nulo
     */
    protected static void validarNoNulo(Object valor, String nombreCampo)
            throws DatoVehiculoInvalidoException {
        if (valor == null) {
            throw new DatoVehiculoInvalidoException(
                    "El campo " + nombreCampo + " es obligatorio.");
        }
    }

    /**
     * Verifica que un campo de texto tenga contenido significativo.
     *
     * @param valor       texto a validar
     * @param nombreCampo nombre del campo, usado en el mensaje de error
     * @throws DatoVehiculoInvalidoException si el texto es nulo o solo contiene espacios
     */
    private static void validarTextoNoVacio(String valor, String nombreCampo)
            throws DatoVehiculoInvalidoException {
        if (valor == null || valor.trim().isEmpty()) {
            throw new DatoVehiculoInvalidoException(
                    "El campo " + nombreCampo + " no puede estar vacío.");
        }
    }

    /**
     * Verifica que el año de fabricación sea positivo.
     *
     * @param anio año a validar
     * @throws DatoVehiculoInvalidoException si el año no es positivo
     */
    private static void validarAnio(int anio) throws DatoVehiculoInvalidoException {
        if (anio <= 0) {
            throw new DatoVehiculoInvalidoException("El año de fabricación debe ser positivo.");
        }
    }

    /**
     * Verifica que la condición comercial esté presente.
     *
     * @param condicion condición a validar
     * @throws DatoVehiculoInvalidoException si la condición es nula
     */
    private static void validarCondicion(CondicionVehiculo condicion)
            throws DatoVehiculoInvalidoException {
        if (condicion == null) {
            throw new DatoVehiculoInvalidoException("La condición del vehículo es obligatoria.");
        }
    }

    /**
     * Verifica la coherencia entre condición y kilometraje.
     *
     * <p>Una unidad NUEVO debe tener exactamente 0 km; una USADO debe tener
     * kilometraje mayor que cero.</p>
     *
     * @param condicion   condición comercial vigente
     * @param kilometraje kilómetros a validar
     * @throws DatoVehiculoInvalidoException si el kilometraje es negativo o no coincide con la condición
     */
    private static void validarKilometraje(CondicionVehiculo condicion, int kilometraje)
            throws DatoVehiculoInvalidoException {
        if (kilometraje < 0) {
            throw new DatoVehiculoInvalidoException("El kilometraje no puede ser negativo.");
        }
        if (condicion == CondicionVehiculo.NUEVO && kilometraje != 0) {
            throw new DatoVehiculoInvalidoException(
                    "Un vehículo NUEVO no puede tener kilometraje mayor que cero.");
        }
        if (condicion == CondicionVehiculo.USADO && kilometraje == 0) {
            throw new DatoVehiculoInvalidoException(
                    "Un vehículo USADO debe tener kilometraje mayor que cero.");
        }
    }

    /**
     * Verifica que el valor comercial sea un número finito y no negativo.
     *
     * @param valorComercial valor a validar
     * @throws DatoVehiculoInvalidoException si es negativo, NaN o infinito
     */
    private static void validarValorComercial(double valorComercial)
            throws DatoVehiculoInvalidoException {
        if (Double.isNaN(valorComercial) || Double.isInfinite(valorComercial)
                || valorComercial < 0) {
            throw new DatoVehiculoInvalidoException(
                    "El valor comercial debe ser un número finito mayor o igual que cero.");
        }
    }
}
