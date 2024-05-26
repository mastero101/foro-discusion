const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Modelo de Mensaje
const messageSchema = new mongoose.Schema({
  username: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

// Rutas
app.get('/', (req, res) => {
  res.send('Bienvenido al foro de discusión');
});

// Ruta para manejar la solicitud POST para agregar un nuevo mensaje
app.post('/new-message', (req, res) => {
  const { username, content } = req.body;
  const newMessage = new Message({ username, content });
  newMessage.save()
    .then(() => {
      io.emit('newMessage', { username, content }); // Emitir el mensaje a todos los clientes
      res.status(201).json({ message: 'Mensaje guardado exitosamente' });
    })
    .catch(err => {
      console.error('Error al guardar el mensaje:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

// Ruta para manejar la solicitud GET para obtener todos los mensajes
app.get('/messages', (req, res) => {
  Message.find()
    .then(messages => {
      res.json(messages);
    })
    .catch(err => {
      console.error('Error al obtener los mensajes:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

// Ruta para manejar la solicitud DELETE para eliminar un mensaje por su ID
app.delete('/messages/:id', (req, res) => {
  const messageId = req.params.id;
  Message.findByIdAndDelete(messageId)
    .then(() => {
      io.emit('messageDeleted', messageId); // Emitir el ID del mensaje eliminado a todos los clientes
      res.status(200).json({ message: 'Mensaje eliminado exitosamente' });
    })
    .catch(err => {
      console.error('Error al eliminar el mensaje:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

// Socket.IO conexión
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  // Enviar todos los mensajes al cliente cuando se conecta
  Message.find().then(messages => {
    socket.emit('initialMessages', messages);
  });

  // Manejar el evento de nuevo mensaje
  socket.on('newMessage', (msg) => {
    const message = new Message(msg);
    message.save().then(() => {
      io.emit('newMessage', msg); // Emitir el mensaje a todos los clientes
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

