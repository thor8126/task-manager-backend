require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Task = require('./models/Task');
const CORS = require('cors');

const app = express();
app.use(CORS());
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Routes

app.get('/', (req, res) => {
  res.send('Api by Lakhvinder Singh!')
})
    
app.get('/ping', (req, res) => {
  res.send('Pong')
})

app.get('/api/tasks', (req, res) => {
  Task.find()
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, status } = req.body;

  const task = new Task({
    title,
    status,
  });

  task
    .save()
    .then((savedTask) => res.json(savedTask))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  Task.findByIdAndUpdate(
    id,
    { title, status },
    { new: true, runValidators: true }
  )
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(updatedTask);
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;

  Task.findByIdAndDelete(id)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(deletedTask);
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})