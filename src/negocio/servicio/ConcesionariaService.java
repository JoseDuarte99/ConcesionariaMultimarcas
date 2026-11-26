package negocio.servicio;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import negocio.excepciones.DatoVehiculoInvalidoException;
import negocio.excepciones.VehiculoDuplicadoException;
import negocio.excepciones.VehiculoNoEncontradoException;
import negocio.modelo.CondicionVehiculo;
import negocio.modelo.TipoVehiculo;
import negocio.modelo.Vehiculo;
import negocio.persistencia.RepositorioGenerico;
import negocio.persistencia.RepositorioVehiculos;

/**
 * Centraliza la lógica de negocio y la gestión del stock de la concesionaria.
 *
 * <p>Opera sobre colecciones tipadas en memoria ({@link List} y {@link Map}) y
 * delega la persistencia en un {@link RepositorioGenerico}. No lee ni escribe
 * por consola: recibe parámetros, devuelve resultados o lanza excepciones.</p>
 */
public class ConcesionariaService {

    /** Repositorio encargado de la persistencia del stock. */
    private final RepositorioGenerico<Vehiculo, String> repositorio;

    /** Colección de trabajo con todo el stock en memoria. */
    private final List<Vehiculo> stock;

    /** Índice por identificador para acceso rápido y detección de duplicados. */
    private final Map<String, Vehiculo> indice;

    /**
     * Crea el servicio usando el repositorio por defecto (archivo
     * {@code data/stock.txt}).
     */
    public ConcesionariaService() {
        this(new RepositorioVehiculos());
    }

    /**
     * Crea el servicio con un repositorio inyectado, útil para pruebas o para
     * configurar una ruta de archivo distinta.
     *
     * @param repositorio repositorio de persistencia; no puede ser nulo
     * @throws IllegalArgumentException si el repositorio es nulo
     */
    public ConcesionariaService(RepositorioGenerico<Vehiculo, String> repositorio) {
        if (repositorio == null) {
            throw new IllegalArgumentException("El repositorio es obligatorio.");
        }
        this.repositorio = repositorio;
        this.stock = new ArrayList<>();
        this.indice = new HashMap<>();
    }

    /**
     * Carga el stock desde el repositorio, reconstruyendo las colecciones en
     * memoria.
     *
     * @throws IOException si falla la lectura del archivo
     */
    public void cargar() throws IOException {
        stock.clear();
        indice.clear();
        for (Vehiculo vehiculo : repositorio.listarTodos()) {
            stock.add(vehiculo);
            indice.put(vehiculo.getIdentificador(), vehiculo);
        }
    }

    /**
     * Recarga el stock desde el repositorio. Equivalente a {@link #cargar()}.
     *
     * @throws IOException si falla la lectura del archivo
     */
    public void recargar() throws IOException {
        cargar();
    }

    /**
     * Da de alta un vehículo en el stock.
     *
     * @param vehiculo vehículo a incorporar
     * @throws DatoVehiculoInvalidoException si el vehículo es nulo
     * @throws VehiculoDuplicadoException    si ya existe un vehículo con el mismo identificador
     * @throws IOException                   si falla la persistencia
     */
    public void alta(Vehiculo vehiculo)
            throws DatoVehiculoInvalidoException, VehiculoDuplicadoException, IOException {
        if (vehiculo == null) {
            throw new DatoVehiculoInvalidoException("El vehículo es obligatorio.");
        }
        if (indice.containsKey(vehiculo.getIdentificador())) {
            throw new VehiculoDuplicadoException(
                    "Ya existe un vehículo con el identificador " + vehiculo.getIdentificador() + ".");
        }
        repositorio.guardar(vehiculo);
        stock.add(vehiculo);
        indice.put(vehiculo.getIdentificador(), vehiculo);
    }

    /**
     * Da de baja un vehículo por su identificador.
     *
     * @param id identificador del vehículo a eliminar
     * @throws VehiculoNoEncontradoException si no existe un vehículo con ese identificador
     * @throws IOException                  si falla la persistencia
     */
    public void baja(String id) throws VehiculoNoEncontradoException, IOException {
        repositorio.eliminar(id);
        indice.remove(id);
        stock.removeIf(vehiculo -> Objects.equals(vehiculo.getIdentificador(), id));
    }

    /**
     * Busca un vehículo por su identificador.
     *
     * @param id identificador buscado
     * @return el vehículo encontrado
     * @throws VehiculoNoEncontradoException si no existe un vehículo con ese identificador
     * @throws IOException                  si falla la lectura del repositorio
     */
    public Vehiculo buscarPorId(String id) throws VehiculoNoEncontradoException, IOException {
        Vehiculo enMemoria = indice.get(id);
        if (enMemoria != null) {
            return enMemoria;
        }
        Vehiculo encontrado = repositorio.buscarPorId(id);
        stock.add(encontrado);
        indice.put(encontrado.getIdentificador(), encontrado);
        return encontrado;
    }

    /**
     * Devuelve una copia defensiva de todo el stock.
     *
     * @return lista nueva con todos los vehículos
     */
    public List<Vehiculo> listarTodos() {
        return new ArrayList<>(stock);
    }

    /**
     * Modifica el valor comercial de un vehículo existente.
     *
     * @param id             identificador del vehículo
     * @param nuevoValor     nuevo valor comercial
     * @throws VehiculoNoEncontradoException  si no existe un vehículo con ese identificador
     * @throws DatoVehiculoInvalidoException  si el nuevo valor es inválido
     * @throws VehiculoDuplicadoException     si falla la persistencia por colisión de identidad
     * @throws IOException                   si falla la persistencia
     */
    public void modificarValorComercial(String id, double nuevoValor)
            throws VehiculoNoEncontradoException, DatoVehiculoInvalidoException,
            VehiculoDuplicadoException, IOException {
        Vehiculo vehiculo = buscarPorId(id);
        vehiculo.setValorComercial(nuevoValor);
        repositorio.eliminar(id);
        repositorio.guardar(vehiculo);
    }

    /**
     * Modifica el kilometraje de un vehículo existente.
     *
     * @param id           identificador del vehículo
     * @param nuevoKm      nuevo kilometraje
     * @throws VehiculoNoEncontradoException  si no existe un vehículo con ese identificador
     * @throws DatoVehiculoInvalidoException  si el nuevo kilometraje es inválido
     * @throws VehiculoDuplicadoException     si falla la persistencia por colisión de identidad
     * @throws IOException                   si falla la persistencia
     */
    public void modificarKilometraje(String id, int nuevoKm)
            throws VehiculoNoEncontradoException, DatoVehiculoInvalidoException,
            VehiculoDuplicadoException, IOException {
        Vehiculo vehiculo = buscarPorId(id);
        vehiculo.setKilometraje(nuevoKm);
        repositorio.eliminar(id);
        repositorio.guardar(vehiculo);
    }

    /**
     * Filtra el stock por marca (coincidencia exacta, ignorando mayúsculas).
     *
     * @param marca marca buscada
     * @return lista nueva con los vehículos de esa marca
     */
    public List<Vehiculo> filtrarPorMarca(String marca) {
        List<Vehiculo> resultado = new ArrayList<>();
        if (marca == null || marca.trim().isEmpty()) {
            return resultado;
        }
        String buscada = marca.trim();
        for (Vehiculo vehiculo : stock) {
            if (vehiculo.getMarca() != null && vehiculo.getMarca().equalsIgnoreCase(buscada)) {
                resultado.add(vehiculo);
            }
        }
        return resultado;
    }

    /**
     * Filtra el stock por condición comercial.
     *
     * @param condicion condición buscada
     * @return lista nueva con los vehículos de esa condición
     */
    public List<Vehiculo> filtrarPorCondicion(CondicionVehiculo condicion) {
        List<Vehiculo> resultado = new ArrayList<>();
        if (condicion == null) {
            return resultado;
        }
        for (Vehiculo vehiculo : stock) {
            if (vehiculo.getCondicion() == condicion) {
                resultado.add(vehiculo);
            }
        }
        return resultado;
    }

    /**
     * Filtra el stock por tipo de vehículo.
     *
     * @param tipo tipo buscado
     * @return lista nueva con los vehículos de ese tipo
     */
    public List<Vehiculo> filtrarPorTipo(TipoVehiculo tipo) {
        List<Vehiculo> resultado = new ArrayList<>();
        if (tipo == null) {
            return resultado;
        }
        for (Vehiculo vehiculo : stock) {
            if (vehiculo.getTipoVehiculo() == tipo) {
                resultado.add(vehiculo);
            }
        }
        return resultado;
    }

    /**
     * Filtra el stock por rango de valor comercial (inclusivo en ambos extremos).
     *
     * @param minimo valor mínimo
     * @param maximo valor máximo
     * @return lista nueva con los vehículos dentro del rango
     */
    public List<Vehiculo> filtrarPorRangoPrecio(double minimo, double maximo) {
        List<Vehiculo> resultado = new ArrayList<>();
        double menor = Math.min(minimo, maximo);
        double mayor = Math.max(minimo, maximo);
        for (Vehiculo vehiculo : stock) {
            double valor = vehiculo.getValorComercial();
            if (valor >= menor && valor <= mayor) {
                resultado.add(vehiculo);
            }
        }
        return resultado;
    }
}
