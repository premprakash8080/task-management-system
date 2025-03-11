import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getTasks,
  addComment,
  batchUpdateTasks,
} from '../controllers/task.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

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

export { router }; 