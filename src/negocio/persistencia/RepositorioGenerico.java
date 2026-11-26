package negocio.persistencia;

import java.io.IOException;
import java.util.List;

import negocio.excepciones.VehiculoDuplicadoException;
import negocio.excepciones.VehiculoNoEncontradoException;

/**
 * Contrato genérico de almacenamiento parametrizado por entidad e identificador.
 *
 * @param <T>  tipo de entidad gestionada
 * @param <ID> tipo de la clave de identidad
 */
public interface RepositorioGenerico<T, ID> {

    /**
     * Incorpora una entidad al almacenamiento.
     *
     * @param entidad entidad a guardar
     * @throws IOException                   si falla la lectura o escritura del archivo
     * @throws VehiculoDuplicadoException    si ya existe una entidad con la misma identidad
     */
    void guardar(T entidad) throws IOException, VehiculoDuplicadoException;

    /**
     * Busca una entidad por su identificador.
     *
     * @param id identificador buscado
     * @return la entidad encontrada
     * @throws IOException                    si falla la lectura del archivo
     * @throws VehiculoNoEncontradoException  si no existe una entidad con ese identificador
     */
    T buscarPorId(ID id) throws IOException, VehiculoNoEncontradoException;

    /**
     * Devuelve todas las entidades almacenadas.
     *
     * @return lista nueva con las entidades; nunca null
     * @throws IOException si falla la lectura del archivo
     */
    List<T> listarTodos() throws IOException;

    /**
     * Elimina una entidad por su identificador.
     *
     * @param id identificador de la entidad a eliminar
     * @throws IOException                    si falla la lectura o escritura del archivo
     * @throws VehiculoNoEncontradoException  si no existe una entidad con ese identificador
     */
    void eliminar(ID id) throws IOException, VehiculoNoEncontradoException;
}
