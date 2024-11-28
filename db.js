const { MongoClient, ObjectId } = require('mongodb');
const redis = require('redis');
const express = require('express');
const { fork } = require('child_process');

// Inicializar Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Conexión a Redis
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.on('error', (err) => {
  console.log('Error de conexión a Redis:', err);
});
redisClient.connect(); // Conectar al servidor Redis

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connect() {
  if (!db) {
    try {
      await client.connect();
      console.log("Conectado a MongoDB");
      db = client.db("gestion_tareas");
    } catch (err) {
      console.error("Error al conectar a MongoDB:", err);
    }
  }
  return db;
}

// Rutas de Express
app.get('/tareas-urgentes', async (req, res) => {
  try {
    const keys = await redisClient.keys('task_*');

    if (keys.length === 0) {
      return res.status(404).json({ message: 'No hay tareas urgentes almacenadas en Redis.' });
    }

    const tareasUrgentes = [];
    for (const key of keys) {
      const tarea = await redisClient.get(key);
      tareasUrgentes.push(JSON.parse(tarea));
    }

    res.json(tareasUrgentes);
  } catch (err) {
    console.error('Error al obtener tareas urgentes:', err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Iniciar servidor Express
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/tareas-urgentes`);
});

// Ejecutar el menú en un proceso separado
const menuProcess = fork('./menu.js');
menuProcess.on('exit', () => {
  console.log("El proceso del menú ha finalizado.");
});


//docker exec -it redis-container redis-cli

