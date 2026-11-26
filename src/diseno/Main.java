package diseno;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import negocio.excepciones.DatoVehiculoInvalidoException;
import negocio.excepciones.VehiculoDuplicadoException;
import negocio.excepciones.VehiculoNoEncontradoException;
import negocio.modelo.CondicionVehiculo;
import negocio.modelo.TipoVehiculo;
import negocio.modelo.Vehiculo;
import negocio.servicio.ConcesionariaService;

/**
 * Punto de entrada de la aplicación de consola.
 *
 * <p>Expone un menú con las operaciones: dar de alta un vehículo, modificarlo,
 * consultar/listar el stock con filtros y dar de baja, hasta que el usuario
 * elige salir. Toda decisión de negocio se delega en {@link ConcesionariaService};
 * esta clase solo muestra opciones, traduce excepciones a mensajes y mantiene
 * la navegación continua.</p>
 */
public final class Main {

    /** Servicio que coordina el stock y la persistencia. */
    private final ConcesionariaService servicio;

    /** Entrada de consola compartida por el menú y los formularios. */
    private final EntradaConsola entrada;

    /** Formularios de alta de los tres tipos de vehículo. */
    private final FormulariosVehiculo formularios;

    /**
     * Crea la aplicación con sus dependencias ya construidas.
     *
     * @param servicio servicio de negocio
     * @param entrada  lector de consola
     */
    private Main(ConcesionariaService servicio, EntradaConsola entrada) {
        this.servicio = servicio;
        this.entrada = entrada;
        this.formularios = new FormulariosVehiculo(entrada);
    }

    /**
     * Inicia la aplicación y cierra el lector al finalizar.
     *
     * @param args argumentos de línea de comandos; no se utilizan
     */
    public static void main(String[] args) {
        try (EntradaConsola entrada = new EntradaConsola()) {
            new Main(new ConcesionariaService(), entrada).ejecutar();
        }
    }

    /**
     * Carga el stock y atiende el menú hasta que el usuario elige salir.
     */
    private void ejecutar() {
        try {
            servicio.cargar();
        } catch (IOException causa) {
            System.err.println("No se pudo cargar el stock: " + causa.getMessage());
            System.err.println("La aplicación se detiene para no sobrescribir datos existentes.");
            return;
        }

        boolean continuar = true;
        while (continuar) {
            mostrarMenu();
            try {
                int opcion = entrada.leerOpcion("Opción: ", 1, 5);
                continuar = procesarOpcion(opcion);
            } catch (DatoVehiculoInvalidoException causa) {
                System.out.println("Error: " + causa.getMessage());
            }
        }
        System.out.println("Hasta luego.");
    }

    /**
     * Muestra las opciones disponibles.
     */
    private void mostrarMenu() {
        System.out.println();
        System.out.println("=== Concesionaria Multimarcas ===");
        System.out.println("1. Dar de alta un vehículo");
        System.out.println("2. Modificar un vehículo");
        System.out.println("3. Consultar / listar stock");
        System.out.println("4. Dar de baja un vehículo");
        System.out.println("5. Salir");
    }

    /**
     * Ejecuta la opción seleccionada.
     *
     * @param opcion opción válida del menú
     * @return {@code true} para seguir en el menú, {@code false} para salir
     */
    private boolean procesarOpcion(int opcion) {
        switch (opcion) {
            case 1:
                darDeAlta();
                return true;
            case 2:
                modificar();
                return true;
            case 3:
                consultar();
                return true;
            case 4:
                bajar();
                return true;
            case 5:
                return false;
            default:
                throw new IllegalStateException("Opción no contemplada: " + opcion);
        }
    }

    /**
     * Solicita el tipo de vehículo, completa el formulario correspondiente y
     * da de alta la unidad a través del servicio.
     */
    private void darDeAlta() {
        try {
            int tipo = entrada.leerOpcion(
                    "Tipo (1=Auto, 2=Camioneta, 3=Motocicleta): ", 1, 3);
            Vehiculo vehiculo = solicitarVehiculo(tipo);
            servicio.alta(vehiculo);
            System.out.println("Vehículo dado de alta: " + vehiculo.getIdentificador());
        } catch (DatoVehiculoInvalidoException | VehiculoDuplicadoException causa) {
            System.out.println("No se pudo dar de alta: " + causa.getMessage());
        } catch (IOException causa) {
            System.err.println("Error de persistencia: " + causa.getMessage());
        }
    }

    /**
     * Delega la captura al formulario del tipo elegido.
     *
     * @param tipo opción de tipo: 1 auto, 2 camioneta, 3 motocicleta
     * @return vehículo construido
     * @throws DatoVehiculoInvalidoException si una entrada es inválida
     */
    private Vehiculo solicitarVehiculo(int tipo) throws DatoVehiculoInvalidoException {
        switch (tipo) {
            case 1:
                return formularios.solicitarAuto();
            case 2:
                return formularios.solicitarCamioneta();
            case 3:
                return formularios.solicitarMotocicleta();
            default:
                throw new IllegalStateException("Tipo no contemplado: " + tipo);
        }
    }

    /**
     * Busca un vehículo por identificador y modifica uno de sus campos
     * editables mediante los métodos existentes del servicio.
     */
    private void modificar() {
        try {
            String id = entrada.leerTexto("Identificador del vehículo a modificar: ");
            Vehiculo vehiculo = servicio.buscarPorId(id);
            System.out.println("Vehículo seleccionado: " + vehiculo);

            int campo = entrada.leerOpcion(
                    "Campo a modificar (1=Valor comercial, 2=Kilometraje): ", 1, 2);
            if (campo == 1) {
                double valor = entrada.leerDecimal("Nuevo valor comercial: ");
                servicio.modificarValorComercial(id, valor);
            } else {
                int kilometraje = entrada.leerEntero("Nuevo kilometraje: ");
                servicio.modificarKilometraje(id, kilometraje);
            }
            System.out.println("Vehículo modificado correctamente.");
        } catch (DatoVehiculoInvalidoException | VehiculoNoEncontradoException
                | VehiculoDuplicadoException causa) {
            System.out.println("No se pudo modificar: " + causa.getMessage());
        } catch (IOException causa) {
            System.err.println("Error de persistencia: " + causa.getMessage());
        }
    }

    /**
     * Submenú de consultas y listados del stock.
     */
    private void consultar() {
        boolean volver = false;
        while (!volver) {
            System.out.println();
            System.out.println("--- Consultas ---");
            System.out.println("1. Listar todo el stock");
            System.out.println("2. Filtrar por marca");
            System.out.println("3. Filtrar por condición (NUEVO/USADO)");
            System.out.println("4. Filtrar por tipo de vehículo");
            System.out.println("5. Filtrar por rango de precios");
            System.out.println("6. Volver");
            try {
                int opcion = entrada.leerOpcion("Opción: ", 1, 6);
                switch (opcion) {
                    case 1:
                        mostrarListado(servicio.listarTodos());
                        break;
                    case 2: {
                        String marca = entrada.leerTexto("Marca: ");
                        mostrarListado(servicio.filtrarPorMarca(marca));
                        break;
                    }
                    case 3: {
                        CondicionVehiculo condicion = entrada.leerEnum(
                                "Condición (NUEVO/USADO): ", CondicionVehiculo.class);
                        mostrarListado(servicio.filtrarPorCondicion(condicion));
                        break;
                    }
                    case 4: {
                        TipoVehiculo tipo = entrada.leerEnum(
                                "Tipo (AUTO/CAMIONETA/MOTOCICLETA): ", TipoVehiculo.class);
                        mostrarListado(servicio.filtrarPorTipo(tipo));
                        break;
                    }
                    case 5: {
                        double minimo = entrada.leerDecimal("Precio mínimo: ");
                        double maximo = entrada.leerDecimal("Precio máximo: ");
                        mostrarListado(servicio.filtrarPorRangoPrecio(minimo, maximo));
                        break;
                    }
                    case 6:
                        volver = true;
                        break;
                    default:
                        throw new IllegalStateException("Opción no contemplada: " + opcion);
                }
            } catch (DatoVehiculoInvalidoException causa) {
                System.out.println("Entrada inválida: " + causa.getMessage());
            }
        }
    }

    /**
     * Da de baja un vehículo por identificador, con confirmación previa.
     */
    private void bajar() {
        try {
            String id = entrada.leerTexto("Identificador del vehículo a dar de baja: ");
            String confirmacion;
            try {
                confirmacion = entrada.leerTexto("¿Confirmar baja? (s/n): ");
            } catch (DatoVehiculoInvalidoException causa) {
                confirmacion = "n";
            }
            if (!confirmacion.equalsIgnoreCase("s") && !confirmacion.equalsIgnoreCase("si")) {
                System.out.println("Baja cancelada.");
                return;
            }
            servicio.baja(id);
            System.out.println("Vehículo dado de baja: " + id);
        } catch (VehiculoNoEncontradoException causa) {
            System.out.println("No se pudo dar de baja: " + causa.getMessage());
        } catch (DatoVehiculoInvalidoException causa) {
            System.out.println("Entrada inválida: " + causa.getMessage());
        } catch (IOException causa) {
            System.err.println("Error de persistencia: " + causa.getMessage());
        }
    }

    /**
     * Imprime un listado formateado de vehículos usando su {@code toString()}.
     *
     * @param vehiculos lista a mostrar
     */
    private void mostrarListado(List<Vehiculo> vehiculos) {
        if (vehiculos == null || vehiculos.isEmpty()) {
            System.out.println("Sin resultados.");
            return;
        }
        System.out.println("--- Listado (" + vehiculos.size() + " unidad/es) ---");
        for (Vehiculo vehiculo : vehiculos) {
            System.out.println(vehiculo);
        }
    }
}
