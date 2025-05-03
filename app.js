const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./models/post');
require('dotenv').config();

const app = express();

// Configuración
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar a MongoDB", err));

// Rutas

// Página principal - mostrar todos los posts
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render('index', { posts });
  } catch (err) {
    res.status(500).send("Error cargando publicaciones");
  }
});

// Ver un post por su ID
app.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.render('post', { post });
    } else {
      res.status(404).send("Post no encontrado");
    }
  } catch (err) {
    res.status(400).send("ID inválido");
  }
});

// Formulario para nueva publicación
app.get('/new', (req, res) => {
  res.render('new');
});

// Crear nueva publicación
app.post('/new', async (req, res) => {
  try {
    const { title, content } = req.body;
    await Post.create({ title, content });
    res.redirect('/');
  } catch (err) {
    res.status(400).send("Error al crear publicación");
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
