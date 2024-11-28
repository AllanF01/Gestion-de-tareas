# Gestión de Tareas - Aplicación de Consola en Node.js

Este proyecto es una aplicación de consola que permite gestionar tareas asignadas a usuarios. Utiliza **MongoDB** para almacenar los datos y **readline-sync** para interactuar con el usuario. Además, permite realizar operaciones básicas como crear usuarios, crear tareas, marcar tareas como completadas, editar tareas, eliminar tareas y ver las tareas completadas por usuario.

## Funcionalidades

1. **Crear un nuevo usuario**: Permite ingresar un nombre, email, rol y crear un nuevo usuario en la base de datos.
2. **Crear una tarea**: Se puede crear una tarea con título, descripción, prioridad, fecha de vencimiento y asignarla a un usuario.
3. **Ver tareas de un usuario**: Permite obtener todas las tareas asignadas a un usuario específico.
4. **Eliminar tarea**: Se puede eliminar una tarea proporcionando su ID.
5. **Ver tareas completadas por usuario**: Muestra las tareas completadas por un usuario específico.
6. **Marcar tarea como completada**: Permite marcar una tarea como completada.
7. **Editar tarea**: Permite editar los campos de una tarea existente (título, descripción, prioridad, fecha de vencimiento, estado).

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript en el servidor.
- **MongoDB**: Base de datos NoSQL utilizada para almacenar los datos de usuarios y tareas.
- **readline-sync**: Librería utilizada para interactuar con el usuario a través de la consola.

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes programas en tu máquina:

1. **Node.js**: Si no lo tienes, descárgalo e instálalo desde [nodejs.org](https://nodejs.org/).
2. **MongoDB**: Asegúrate de tener MongoDB corriendo localmente en el puerto `27017`, o usa un servicio en la nube como [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para configurar tu base de datos.

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto:

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone <URL_DEL_REPOSITORIO>

2. Navega a la carpeta del proyecto:

**bash** cd DB.gestion-tarea

3. Instala dependencias del proyecto
**bash** npm install

4. Para ejecutar la aplicación, simplemente corre el siguiente comando: node db.js

## Menú de Opciones
Al ejecutar la aplicación, el usuario verá un menú con las siguientes opciones:

Selecciona una opción:
1. Crear un nuevo usuario
2. Crear una tarea
3. Ver tareas de un usuario
4. Eliminar tarea
5. Ver tareas completadas por usuario
6. Marcar tarea como completada
7. Editar tarea
8. Salir

## Ejemplo de Ejecución

**Crear una tarea:**

Selecciona una opción:

2. Crear una tarea
Título de la tarea: Revisión de clase
Descripción de la tarea: Revisar todo el material para la clase final
ID del usuario asignado: 1234567890
Tarea insertada: 63d0fe9d04f1e2b08c74c1b8
------------------------
**Marcar tarea como completada:**

Selecciona una opción:
6. Marcar tarea como completada
ID de la tarea a marcar como completada: 63d0fe9d04f1e2b08c74c1b8
Tarea marcada como completada
------------------------

## Notas
1. Si no tienes MongoDB corriendo localmente, puedes utilizar servicios en la nube como MongoDB Atlas y cambiar la URI de conexión a MongoDB en el archivo app.js.
2. Asegúrate de que la base de datos MongoDB esté activa antes de ejecutar la aplicación.
Contribuciones
3. Si deseas contribuir a este proyecto, puedes hacer un fork de este repositorio, realizar tus cambios y enviar un pull request. Asegúrate de probar tus cambios antes de enviarlos.

## Licencia
Este proyecto está licenciado bajo la MIT License - consulta el archivo LICENSE para más detalles.

### Explicación del `README.md`:

1. **Descripción del Proyecto**: Explica brevemente de qué trata la aplicación y sus funcionalidades principales.
2. **Tecnologías Utilizadas**: Enumera las herramientas y tecnologías que se usan en el proyecto.
3. **Requisitos**: Menciona los requisitos previos, como tener Node.js y MongoDB instalados.
4. **Instalación**: Guía al usuario sobre cómo instalar y configurar el proyecto.
5. **Ejecución**: Indica cómo ejecutar la aplicación en su máquina local.
6. **Menú de Opciones**: Describe el menú interactivo que el usuario verá al ejecutar el proyecto.
7. **Ejemplo de Ejecución**: Proporciona ejemplos de la salida esperada en consola.
8. **Notas**: Incluye algunas consideraciones adicionales para la configuración y el uso de la aplicación.
9. **Contribuciones**: Anima a otros a contribuir si lo desean.
10. **Licencia**: Menciona la licencia bajo la que se distribuye el proyecto.

Este archivo `README.md` proporcionará una guía clara sobre cómo usar tu aplicación y cómo otros pueden contribuir al proyecto.