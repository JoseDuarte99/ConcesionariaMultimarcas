# Bitácora de Uso de Inteligencia Artificial Generativa (IAG)

* **Institución:** Universidad Tecnológica Nacional – Facultad Regional Resistencia (UTN FRRe)
* **Carrera y Cátedra:** Tecnicatura Universitaria en Programación – Programación II (Año 2026)
* **Comisión:** [ ] Comisión 2 / [ ] Comisión 3
* **Alumno/a:** *(Completar con tu nombre y apellido)*
* **Legajo N°:** *(Completar con tu número de legajo)*
* **Proyecto:** Trabajo Final Integrador – Sistema de Gestión de Concesionaria Multimarcas en Java
* **IAG Seleccionada:** GitHub Copilot

---

## 1. Introducción y Metodología de Trabajo

La presente bitácora documenta el uso crítico, ético y planificado de herramientas de Inteligencia Artificial Generativa (IAG) durante el desarrollo del Trabajo Final Integrador (TFI). Siguiendo los lineamientos establecidos por la cátedra, la herramienta se incorpora bajo el rol de «copiloto socrático» y asistente de verificación, funcionando como un apoyo a la productividad y al estudio sin sustituir el criterio de diseño ni el dominio técnico del código fuente exigido para la defensa en el coloquio individual.

Para garantizar un aprendizaje progresivo y evitar la generación automática de código que exceda los contenidos de la asignatura, el flujo de trabajo se estructuró en etapas incrementales (**Plan TFI**), auditando cada sugerencia de la herramienta frente a las reglas de arquitectura en capas y principios de Programación Orientada a Objetos.

---

## 2. Justificación Técnica de la Elección (GitHub Copilot)

Para la resolución del proyecto se seleccionó **GitHub Copilot** (en su modalidad de acceso gratuito contemplada por la guía de la cátedra) por sobre otras alternativas basadas exclusivamente en interfaz web, fundamentando la decisión en los siguientes criterios técnicos:

* **Integración nativa en el entorno de desarrollo (IDE):** Al operar directamente dentro de Visual Studio Code, elimina la fricción de alternar constantemente entre el editor y ventanas externas, permitiendo analizar fragmentos de código, errores de compilación y estructuras de paquetes en el mismo espacio de trabajo.
* **Control de contexto y alineación con el temario de la cátedra:** Mediante la configuración de archivos de instrucciones propios del ecosistema (`.github/copilot-instructions.md` y `AGENTS.md`) y la indexación del material de estudio de la materia, es posible restringir el comportamiento del modelo para que utilice exclusivamente las herramientas, librerías y patrones vistos en clase, evitando soluciones fuera de alcance o acoplamientos indebidos entre Diseño y Negocio.
* **Familiaridad operativa con el flujo del editor:** El conocimiento previo de las funciones y atajos de Visual Studio Code agiliza la revisión línea por línea de las propuestas del asistente, priorizando la comprensión de la lógica y la auditoría temprana de posibles fallos.
* *(Espacio reservado para sumar otros motivos técnicos que surjan durante el desarrollo, como el contraste entre modos de chat/agente o el soporte específico para JavaDoc y refactorización).*

---

## 3. Documentación de Errores u Inexactitudes (Casos Reales)

*(Completar durante las Fases 1 a 5 con al menos un fallo real detectado en las respuestas de Copilot: alucinaciones de código, violación de la separación Diseño vs. Negocio, errores en `equals()`/`hashCode()` o sesgos conceptuales).*

### Caso 1: *(Título breve del fallo detectado)*
* **Fase del Plan TFI:** *(Ej. Fase 1 - Configuración de contexto / Fase 2 - Dominio)*
* **Prompt / Contexto utilizado:** *(Transcribir brevemente qué se le pidió a Copilot)*
* **Inexactitud o error propuesto por la IAG:** *(Describir o pegar el fragmento erróneo)*
* **Auditoría y resolución aplicada:** *(Explicar cómo lo detectaste y cómo lo corregiste según lo visto en clase)*

---

## 4. Valoración Crítica de la Experiencia de Codificación Asistida

*(Completar al finalizar la Fase 5 evaluando el impacto real de GitHub Copilot en tu proceso de aprendizaje y desarrollo: ventajas, limitaciones encontradas y recomendaciones de uso).*