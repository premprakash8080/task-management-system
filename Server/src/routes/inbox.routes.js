import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  getInbox,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  updateNotificationPreferences,
  getTaskGroups,
  refreshTaskGroups,
} from '../controllers/inbox.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

/**
 * @swagger
 * /api/inbox:
 *   get:
 *     summary: Get user's inbox overview
 *     tags: [Inbox]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inbox data including notifications and task groups
 */
router.get('/', getInbox);

/**
 * @swagger
 * /api/inbox/notifications:
 *   get:
 *     summary: Get user's notifications
 *     tags: [Inbox]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by notification type
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of notifications to return
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/notifications', getNotifications);

/**
 * @swagger
 * /api/inbox/notifications/{notificationId}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Inbox]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.patch('/notifications/:notificationId/read', markNotificationAsRead);

/**
 * @swagger
 * /api/inbox/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Inbox]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.patch('/notifications/read-all', markAllNotificationsAsRead);

/**
 * @swagger
 * /api/inbox/notifications/{notificationId}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Inbox]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete('/notifications/:notificationId', deleteNotification);

/**
 * @swagger
 * /api/inbox/preferences:
 *   patch:
 *     summary: Update notification preferences
 *     tags: [Inbox]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications:
 *                 type: boolean
 *               pushNotifications:
 *                 type: boolean
 *               notificationTypes:
 *                 type: object
 *               reminderTiming:
 *                 type: number
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 */
router.patch('/preferences', updateNotificationPreferences);

/**
 * @swagger
 * /api/inbox/task-groups:
 *   get:
 *     summary: Get task groups (Today, Upcoming, etc.)
 *     tags: [Inbox]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of task groups with their tasks
 */
router.get('/task-groups', getTaskGroups);

/**
 * @swagger
 * /api/inbox/task-groups/refresh:
 *   post:
 *     summary: Refresh task groups (recategorize tasks)
 *     tags: [Inbox]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task groups refreshed successfully
 */
router.post('/task-groups/refresh', refreshTaskGroups);

export { router }; 