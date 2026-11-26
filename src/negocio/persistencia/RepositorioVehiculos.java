package negocio.persistencia;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import negocio.excepciones.VehiculoDuplicadoException;
import negocio.excepciones.VehiculoNoEncontradoException;
import negocio.modelo.Vehiculo;

/**
 * Repositorio de vehículos persistido en un archivo de texto.
 *
 * <p>La clave de identidad es el {@code identificador} inmutable de
 * {@link Vehiculo}. Cada operación lee el archivo completo y, cuando hace falta,
 * lo reescribe; así se detectan duplicados y se pueden eliminar registros sin
 * mantener estado en memoria entre llamadas.</p>
 *
 * <p>Los recursos se cierran con try-with-resources. Los errores de E/S y los
 * registros corruptos se informan con {@link IOException}; no se usan valores
 * centinela ni se imprime por consola.</p>
 */
public class RepositorioVehiculos implements RepositorioGenerico<Vehiculo, String> {

    /** Ruta del archivo de stock, relativa al directorio de ejecución. */
    private static final Path RUTA_POR_DEFECTO = Path.of("data", "stock.txt");

    /** Archivo donde se guarda el stock. */
    private final Path archivo;

    /**
     * Crea el repositorio usando la ruta relativa por defecto.
     */
    public RepositorioVehiculos() {
        this(RUTA_POR_DEFECTO);
    }

    /**
     * Crea el repositorio con una ruta configurable.
     *
     * @param archivo ruta del archivo de texto; no puede ser nula
     */
    public RepositorioVehiculos(Path archivo) {
        this.archivo = Objects.requireNonNull(archivo, "La ruta del archivo es obligatoria.");
    }

    /**
     * Devuelve la ruta configurada, útil para diagnóstico.
     *
     * @return ruta del archivo de stock
     */
    public Path getArchivo() {
        return archivo;
    }

    /**
     * Incorpora un vehículo al archivo, verificando antes que su identificador
     * no esté repetido.
     *
     * @param entidad vehículo a guardar; no puede ser nulo
     * @throws IOException                  si falla la lectura o escritura del archivo
     * @throws VehiculoDuplicadoException   si ya existe una unidad con el mismo identificador
     */
    @Override
    public void guardar(Vehiculo entidad) throws IOException, VehiculoDuplicadoException {
        if (entidad == null) {
            throw new IOException("No se puede guardar un vehículo nulo.");
        }

        List<Vehiculo> vehiculos = leerTodos();
        for (Vehiculo existente : vehiculos) {
            if (Objects.equals(existente.getIdentificador(), entidad.getIdentificador())) {
                throw new VehiculoDuplicadoException(
                        "Ya existe un vehículo con el identificador " + entidad.getIdentificador() + ".");
            }
        }
        vehiculos.add(entidad);
        escribirTodos(vehiculos);
    }

    /**
     * Busca un vehículo recorriendo los registros del archivo.
     *
     * @param id identificador buscado
     * @return vehículo encontrado
     * @throws IOException                   si falla la lectura o algún registro está corrupto
     * @throws VehiculoNoEncontradoException si no existe una unidad con ese identificador
     */
    @Override
    public Vehiculo buscarPorId(String id) throws IOException, VehiculoNoEncontradoException {
        for (Vehiculo vehiculo : leerTodos()) {
            if (Objects.equals(vehiculo.getIdentificador(), id)) {
                return vehiculo;
            }
        }
        throw new VehiculoNoEncontradoException(
                "No se encontró un vehículo con el identificador " + id + ".");
    }

    /**
     * Devuelve todas las unidades persistidas, reconstruidas desde el archivo.
     *
     * @return lista nueva con los vehículos; vacía si el archivo no existe
     * @throws IOException si falla la lectura o algún registro está corrupto
     */
    @Override
    public List<Vehiculo> listarTodos() throws IOException {
        return leerTodos();
    }

    /**
     * Elimina del archivo la unidad identificada y reescribe el resto.
     *
     * @param id identificador de la unidad a eliminar
     * @throws IOException                   si falla la lectura o escritura del archivo
     * @throws VehiculoNoEncontradoException si no existe una unidad con ese identificador
     */
    @Override
    public void eliminar(String id) throws IOException, VehiculoNoEncontradoException {
        List<Vehiculo> vehiculos = leerTodos();
        Iterator<Vehiculo> iterador = vehiculos.iterator();
        while (iterador.hasNext()) {
            Vehiculo vehiculo = iterador.next();
            if (Objects.equals(vehiculo.getIdentificador(), id)) {
                iterador.remove();
                escribirTodos(vehiculos);
                return;
            }
        }
        throw new VehiculoNoEncontradoException(
                "No se encontró un vehículo con el identificador " + id + ".");
    }

    /**
     * Lee y decodifica todos los registros del archivo.
     *
     * @return lista nueva con los vehículos; vacía si el archivo no existe
     * @throws IOException si falla la lectura o algún registro está corrupto
     */
    private List<Vehiculo> leerTodos() throws IOException {
        List<Vehiculo> resultado = new ArrayList<>();
        if (!Files.exists(archivo)) {
            return resultado;
        }

        try (BufferedReader lector = Files.newBufferedReader(archivo, StandardCharsets.UTF_8)) {
            String linea;
            int numeroLinea = 0;
            while ((linea = lector.readLine()) != null) {
                numeroLinea++;
                if (linea.trim().isEmpty()) {
                    continue;
                }
                try {
                    resultado.add(VehiculoCodec.decodificar(linea));
                } catch (IOException causa) {
                    throw new IOException("Registro inválido en la línea " + numeroLinea
                            + " de " + archivo + ": " + causa.getMessage(), causa);
                }
            }
        }
        return resultado;
    }

    /**
     * Sobrescribe el archivo con los vehículos recibidos.
     *
     * @param vehiculos lista completa a persistir
     * @throws IOException si falla la creación del directorio o la escritura
     */
    private void escribirTodos(List<Vehiculo> vehiculos) throws IOException {
        Path carpeta = archivo.getParent();
        if (carpeta != null) {
            Files.createDirectories(carpeta);
        }

        try (BufferedWriter escritor = Files.newBufferedWriter(archivo, StandardCharsets.UTF_8)) {
            for (Vehiculo vehiculo : vehiculos) {
                escritor.write(VehiculoCodec.codificar(vehiculo));
                escritor.newLine();
            }
        }
    }
}
