const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Base de datos temporal en memoria
let posts = [];

app.get('/', (req, res) => {
  res.render('index', { posts });
});

app.get('/post/:id', (req, res) => {
  const post = posts[req.params.id];
  if (post) {
    res.render('post', { post });
  } else {
    res.status(404).send('Post no encontrado');
  }
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', (req, res) => {
  const { title, content } = req.body;
  posts.push({ title, content });
  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Blog corriendo en http://localhost:${PORT}`));
