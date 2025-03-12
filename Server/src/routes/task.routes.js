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

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [todo, in_progress, completed]
 *         description: Filter tasks by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [low, medium, high]
 *         description: Filter tasks by priority
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter tasks by project ID
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks by due date (YYYY-MM-DD)
 *       - in: query
 *         name: isArchived
 *         schema:
 *           type: boolean
 *         description: Filter archived/active tasks
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in task title and description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: "-updatedAt"
 *         description: Sort tasks (prefix with - for descending order)
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [todo, in_progress, completed]
 *                       priority:
 *                         type: string
 *                         enum: [low, medium, high]
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                       projectId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           color:
 *                             type: string
 *                           icon:
 *                             type: string
 *                       assigneeId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       order:
 *                         type: number
 *                       isArchived:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 message:
 *                   type: string
 *                   example: Tasks fetched successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/', getTasks);
router.get('/:taskId', getTaskById);
router.patch('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

// Task comments
router.post('/:taskId/comments', addComment);

// Batch operations
router.post('/batch-update', batchUpdateTasks);

export { router }; 