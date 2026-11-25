package negocio.modelo;

/**
 * Contrato de comportamiento para vehículos susceptibles de cotización.
 *
 * <p>La interfaz define qué debe saber hacer una entidad del dominio, sin
 * indicar cómo lo hace. Las subclases concretas de {@code Vehiculo} serán
 * las responsables de implementar el cálculo.</p>
 */
public interface Cotizable {

    /**
     * Calcula el valor comercial estimado del vehículo.
     *
     * @return valor comercial estimado, mayor o igual que cero
     */
    double calcularValorComercial();
}
