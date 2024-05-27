const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// Modelos
const Message = require('./models/message');
const User = require('./models/user');

// Middleware para verificar el token de JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Rutas
app.get('/', (req, res) => {
  res.send('Bienvenido al foro de discusión');
});

// Ruta para manejar la solicitud POST para agregar un nuevo mensaje
app.post('/new-message', authMiddleware, (req, res) => {
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
app.delete('/messages/:id', authMiddleware, (req, res) => {
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

// Ruta de registro de usuario
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta de login de usuario
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
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
