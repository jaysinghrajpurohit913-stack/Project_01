const express = require('express');
const taskRoutes = express.Router();

const UserModel = require('../models/user.models');
const auth = require('../middleware/auth.middleware'); 
const taskModel = require('../models/task.model');
 
// Define your task routes here
// For example:
// Get all tasks
taskRoutes.get('/', auth,async (req, res) => {
  // Logic to get all tasks (omitted for brevity)
  const allTasks = await taskModel.find({ userId: req.user.userId }); // The empty object {} means "find all"
  res.status(200).json(allTasks);
});


// Create a new task
taskRoutes.post('/', auth, async (req, res) => {
  // Logic to create a new task (omitted for brevity)
  const { title, description } = req.body;
  await taskModel.create({ userId: req.user.userId, title, description })
    .then(updatedUser => {
      res.status(201).json(updatedUser);
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to create task' });
    });
});

// Delete a task by ID
taskRoutes.delete('/:id', auth, async (req, res) => {
  // Logic to delete a task by ID (omitted for brevity)
  const taskId = req.params.id;
  await taskModel.findOneAndDelete({ _id: taskId, userId: req.user.userId })
    .then(deletedTask => {
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json({ message: 'Task deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to delete task' });
    });
}); 

// Update a task by ID
taskRoutes.put('/:id', auth, async (req, res) => {
  // Logic to update a task by ID (omitted for brevity)
  const taskId = req.params.id;
  const { title, description } = req.body;
  await taskModel.findOneAndUpdate(
    { _id: taskId, userId: req.user.userId },
    { title, description },
    { new: true }
  )
    .then(updatedTask => {
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json(updatedTask);
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to update task' });
    });
});

module.exports = taskRoutes;
