const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const ngrok = require('ngrok'); // Comentado para referencia futura
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
  .catch(err => {
    console.error('Error al conectar con MongoDB:', err);
    process.exit(1);
  });

// Modelos
const Message = require('./models/message');
const User = require('./models/user');

// Middleware para verificar el token de JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;

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

app.post('/new-message', authMiddleware, (req, res) => {
  const { username, content } = req.body;

  if (!username || !content) {
    return res.status(400).json({ error: 'Nombre de usuario y contenido del mensaje son obligatorios' });
  }

  const newMessage = new Message({ username, content });
  newMessage.save()
    .then(() => {
      io.emit('newMessage', { username, content });
      res.status(201).json({ message: 'Mensaje guardado exitosamente' });
    })
    .catch(err => {
      console.error('Error al guardar el mensaje:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

app.get('/messages', (req, res) => {
  Message.find()
    .then(messages => {
      res.json(messages);
    })
    .catch(err => {
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

app.delete('/messages/:id', authMiddleware, async (req, res) => {
  const messageId = req.params.id;
  const userId = req.userId;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    const user = await User.findById(userId);
    if (!user.admin) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este mensaje' });
    }

    await Message.findByIdAndDelete(messageId);
    io.emit('messageDeleted', messageId);
    res.status(200).json({ message: 'Mensaje eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ 
      userId: user._id,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, admin: user.admin });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

io.on('connection', (socket) => {
  Message.find().then(messages => {
    socket.emit('initialMessages', messages);
  });

  socket.on('newMessage', (msg) => {
    const message = new Message(msg);
    message.save().then(() => {
      io.emit('newMessage', msg);
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  // Conectar a Ngrok
  /*
  ngrok.connect({ addr: PORT, authtoken: process.env.NGROK_AUTHTOKEN })
    .then(url => {
      console.log(`Ngrok URL: ${url}`);
    })
    .catch(error => {
      console.error('Error connecting to ngrok:', error);
    });
  */
});
