const { MongoClient, ObjectId } = require('mongodb');
const readlineSync = require('readline-sync');
const redis = require('redis');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.on('error', (err) => {
  console.log('Error de conexión a Redis:', err);
});

let db;

async function connect() {
  if (!db) {
    try {
      await client.connect();
      console.log("Conectado a MongoDB desde el menú");
      db = client.db("gestion_tareas");
    } catch (err) {
      console.error("Error al conectar a MongoDB:", err);
    }
  }
  return db;
}

async function ensureRedisConnected() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log("Reconectado a Redis.");
    } catch (err) {
      console.error("Error al reconectar a Redis:", err);
    }
  }
}

async function crearUsuario(usuario) {
  try {
    const db = await connect();
    const resultado = await db.collection('usuariosTarea').insertOne(usuario);
    console.log('Usuario insertado:', resultado.insertedId);
  } catch (err) {
    console.error('Error al crear usuario:', err);
  }
}

async function crearTarea(tarea) {
  try {
    const db = await connect();

    if (!ObjectId.isValid(tarea.usuarioAsignado)) {
      console.error('El userId no es un ObjectId válido');
      return;
    }

    const resultado = await db.collection('tareas').insertOne({
      ...tarea,
      fechaCreacion: new Date(),
      completada: false
    });

    console.log('Tarea creada:', resultado.insertedId);

    if (tarea.prioridad === 'alta' || (tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) - new Date() <= 24 * 60 * 60 * 1000)) {
      const key = `task_${resultado.insertedId}`;
      await ensureRedisConnected();
      await redisClient.setEx(key, 3600, JSON.stringify({ ...tarea, id: resultado.insertedId }));
      console.log(`Tarea urgente almacenada en Redis con ID: ${resultado.insertedId}`);
    }
  } catch (err) {
    console.error('Error al crear tarea:', err);
  }
}

async function obtenerTareasDeUsuario(userId) {
  try {
    const db = await connect();

    if (!ObjectId.isValid(userId)) {
      console.error('El userId no es un ObjectId válido');
      return;
    }

    const tareas = await db.collection('tareas').find({ usuarioAsignado: new ObjectId(userId) }).toArray();
    console.log("Tareas del usuario:", tareas);
  } catch (err) {
    console.error('Error al obtener tareas del usuario:', err);
  }
}

async function eliminarTarea(taskId) {
  try {
    const db = await connect();

    if (!ObjectId.isValid(taskId)) {
      console.error('El taskId no es un ObjectId válido');
      return;
    }

    const resultado = await db.collection('tareas').deleteOne({ _id: new ObjectId(taskId) });

    if (resultado.deletedCount === 1) {
      console.log('Tarea eliminada correctamente');
      await ensureRedisConnected(); 
      await redisClient.del(`task_${taskId}`);
      console.log('Tarea eliminada de Redis');
    } else {
      console.log('No se encontró la tarea');
    }
  } catch (err) {
    console.error('Error al eliminar tarea:', err);
  }
}

async function marcarTareaCompletada(taskId) {
  try {
    const db = await connect();

    if (!ObjectId.isValid(taskId)) {
      console.error('El taskId no es un ObjectId válido');
      return;
    }

    const resultado = await db.collection('tareas').updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { completada: true } }
    );

    if (resultado.modifiedCount === 1) {
      console.log('Tarea marcada como completada');
      await ensureRedisConnected();
      const tareaActualizada = await db.collection('tareas').findOne({ _id: new ObjectId(taskId) });
      await redisClient.setEx(`task_${taskId}`, 3600, JSON.stringify(tareaActualizada));
      console.log('Tarea actualizada en Redis');
    } else {
      console.log('No se encontró la tarea para actualizar');
    }
  } catch (err) {
    console.error('Error al marcar tarea como completada:', err);
  }
}

async function verTareasUrgentes() {
  try {
    await ensureRedisConnected();

    const keys = await redisClient.keys('task_*');
    if (keys.length === 0) {
      console.log('No hay tareas urgentes almacenadas en Redis.');
      return;
    }

    const tareasUrgentes = [];
    for (const key of keys) {
      const tarea = await redisClient.get(key);
      tareasUrgentes.push(JSON.parse(tarea));
    }

    console.log("Tareas urgentes desde Redis:", tareasUrgentes);
  } catch (err) {
    console.error('Error al obtener tareas urgentes:', err);
  }
}

async function menu() {
  while (true) {
    console.log("\nSelecciona una opcion:");
    console.log("1. Crear usuario");
    console.log("2. Crear tarea");
    console.log("3. Ver tareas de un usuario");
    console.log("4. Eliminar tarea");
    console.log("5. Marcar tarea como completada");
    console.log("6. Ver tareas urgentes desde Redis");
    console.log("7. Salir");

    const opcion = readlineSync.questionInt("Ingresa el numero de la opcion: ");

    switch (opcion) {
      case 1:
        const nombre = readlineSync.question("Nombre del usuario: ");
        const email = readlineSync.question("Email del usuario: ");
        const rol = readlineSync.question("Rol del usuario: ");
        await crearUsuario({ nombre, email, rol, password: "1234", fechaCreacion: new Date() });
        break;
      case 2:
        const titulo = readlineSync.question("Titulo de la tarea: ");
        const descripcion = readlineSync.question("Descripcion de la tarea: ");
        const usuarioId = readlineSync.question("ID del usuario asignado: ");
        const prioridad = readlineSync.question("Prioridad (alta/media/baja): ");
        const fechaVencimiento = readlineSync.question("Fecha de vencimiento (YYYY-MM-DD): ");
        await crearTarea({ titulo, descripcion, prioridad, fechaVencimiento, usuarioAsignado: usuarioId });
        break;
      case 3:
        const idUsuario = readlineSync.question("ID del usuario para ver sus tareas: ");
        await obtenerTareasDeUsuario(idUsuario);
        break;
      case 4:
        const idTarea = readlineSync.question("ID de la tarea a eliminar: ");
        await eliminarTarea(idTarea);
        break;
      case 5:
        const tareaId = readlineSync.question("ID de la tarea a marcar como completada: ");
        await marcarTareaCompletada(tareaId);
        break;
      case 6:
        await verTareasUrgentes();
        break;
      case 7:
        console.log("¡Hasta luego!");
        await client.close();
        await redisClient.quit(); // Cierra Redis y MongoDB al salir
        process.exit(0);
        break;
      default:
        console.log("Opcion no valida.");
    }
  }
}

menu();
