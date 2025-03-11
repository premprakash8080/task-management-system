const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getTasks,
  addComment,
  batchUpdateTasks,
} = require('../controllers/task.controller');

// Apply auth middleware to all routes
router.use(auth);

// Task CRUD operations
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:taskId', getTaskById);
router.patch('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

// Task comments
router.post('/:taskId/comments', addComment);

// Batch operations
router.post('/batch-update', batchUpdateTasks);

module.exports = router; 