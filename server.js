/* Vidya Sutra Campus — Lightweight Express Backend Server */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory store for multi-user API requests
const store = {
  posts: [],
  requests: []
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Vidya Sutra Campus API', timestamp: new Date().toISOString() });
});

app.get('/api/community', (req, res) => {
  res.json({ posts: store.posts });
});

app.post('/api/community', (req, res) => {
  const { name, title, body, topic } = req.body || {};
  if (!body || String(body).trim().length < 10) {
    return res.status(400).json({ error: 'Post body must be at least 10 characters.' });
  }
  const newPost = {
    id: 'p' + Date.now(),
    name: name || 'Campus Student',
    title: title || String(body).slice(0, 80),
    body,
    topic: topic || 'Code help',
    likes: 0,
    replies: 0,
    solved: false,
    time: 'Just now'
  };
  store.posts.unshift(newPost);
  res.status(201).json(newPost);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✨ Vidya Sutra Campus running at http://localhost:${PORT}`);
});