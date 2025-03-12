import { Inbox } from '../models/inbox.model.js';
import { Task } from '../models/task.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getInbox = asyncHandler(async (req, res) => {
  let inbox = await Inbox.findOne({ userId: req.user._id });

  if (!inbox) {
    // Create new inbox for user if it doesn't exist
    inbox = await Inbox.create({
      userId: req.user._id,
      notifications: [],
      taskGroups: [],
    });
  }

  // Get recent notifications
  const recentNotifications = inbox.notifications
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  // Get task groups with populated tasks
  const populatedTaskGroups = await Promise.all(
    inbox.taskGroups.map(async (group) => ({
      ...group.toObject(),
      tasks: await Task.find({
        _id: { $in: group.tasks },
        isArchived: false,
      })
        .populate('projectId', 'title color icon')
        .populate('assigneeId', 'name email avatar')
        .sort('order'),
    }))
  );

  return res.json(
    new ApiResponse(
      200,
      {
        notifications: recentNotifications,
        taskGroups: populatedTaskGroups,
        stats: inbox.stats,
        preferences: inbox.preferences,
      },
      'Inbox fetched successfully'
    )
  );
});

const getNotifications = asyncHandler(async (req, res) => {
  const { type, isRead, limit = 20 } = req.query;
  const inbox = await Inbox.findOne({ userId: req.user._id });

  if (!inbox) {
    throw new ApiError(404, 'Inbox not found');
  }

  let notifications = inbox.notifications;

  // Apply filters
  if (type) {
    notifications = notifications.filter((n) => n.type === type);
  }
  if (typeof isRead === 'boolean') {
    notifications = notifications.filter((n) => n.isRead === isRead);
  }

  // Sort by date and limit
  notifications = notifications
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, parseInt(limit));

  return res.json(
    new ApiResponse(200, notifications, 'Notifications fetched successfully')
  );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  
  const inbox = await Inbox.findOneAndUpdate(
    {
      userId: req.user._id,
      'notifications._id': notificationId,
    },
    {
      $set: {
        'notifications.$.isRead': true,
      },
    },
    { new: true }
  );

  if (!inbox) {
    throw new ApiError(404, 'Notification not found');
  }

  return res.json(
    new ApiResponse(200, {}, 'Notification marked as read')
  );
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const inbox = await Inbox.findOneAndUpdate(
    { userId: req.user._id },
    {
      $set: {
        'notifications.$[].isRead': true,
      },
    },
    { new: true }
  );

  if (!inbox) {
    throw new ApiError(404, 'Inbox not found');
  }

  return res.json(
    new ApiResponse(200, {}, 'All notifications marked as read')
  );
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const inbox = await Inbox.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        notifications: { _id: notificationId },
      },
    },
    { new: true }
  );

  if (!inbox) {
    throw new ApiError(404, 'Notification not found');
  }

  return res.json(
    new ApiResponse(200, {}, 'Notification deleted successfully')
  );
});

const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const updates = req.body;

  const inbox = await Inbox.findOneAndUpdate(
    { userId: req.user._id },
    {
      $set: {
        preferences: {
          ...updates,
        },
      },
    },
    { new: true }
  );

  if (!inbox) {
    throw new ApiError(404, 'Inbox not found');
  }

  return res.json(
    new ApiResponse(200, inbox.preferences, 'Preferences updated successfully')
  );
});

const getTaskGroups = asyncHandler(async (req, res) => {
  const inbox = await Inbox.findOne({ userId: req.user._id });

  if (!inbox) {
    throw new ApiError(404, 'Inbox not found');
  }

  // Populate task groups with task details
  const populatedTaskGroups = await Promise.all(
    inbox.taskGroups.map(async (group) => ({
      ...group.toObject(),
      tasks: await Task.find({
        _id: { $in: group.tasks },
        isArchived: false,
      })
        .populate('projectId', 'title color icon')
        .populate('assigneeId', 'name email avatar')
        .sort('order'),
    }))
  );

  return res.json(
    new ApiResponse(200, populatedTaskGroups, 'Task groups fetched successfully')
  );
});

const refreshTaskGroups = asyncHandler(async (req, res) => {
  const inbox = await Inbox.findOne({ userId: req.user._id });
  if (!inbox) {
    throw new ApiError(404, 'Inbox not found');
  }

  // Get all active tasks assigned to the user
  const tasks = await Task.find({
    assigneeId: req.user._id,
    isArchived: false,
  });

  // Helper function to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Helper function to check if a date is tomorrow
  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  // Group tasks
  const taskGroups = [
    {
      groupType: 'today',
      tasks: tasks
        .filter((task) => task.dueDate && isToday(new Date(task.dueDate)))
        .map((task) => task._id),
    },
    {
      groupType: 'tomorrow',
      tasks: tasks
        .filter((task) => task.dueDate && isTomorrow(new Date(task.dueDate)))
        .map((task) => task._id),
    },
    {
      groupType: 'upcoming',
      tasks: tasks
        .filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate > new Date(new Date().setDate(new Date().getDate() + 1));
        })
        .map((task) => task._id),
    },
    {
      groupType: 'overdue',
      tasks: tasks
        .filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate < new Date() && !isToday(dueDate);
        })
        .map((task) => task._id),
    },
    {
      groupType: 'no_due_date',
      tasks: tasks
        .filter((task) => !task.dueDate)
        .map((task) => task._id),
    },
  ];

  // Update inbox with new task groups
  inbox.taskGroups = taskGroups;
  await inbox.save();

  // Return populated task groups
  const populatedTaskGroups = await Promise.all(
    taskGroups.map(async (group) => ({
      ...group,
      tasks: await Task.find({
        _id: { $in: group.tasks },
        isArchived: false,
      })
        .populate('projectId', 'title color icon')
        .populate('assigneeId', 'name email avatar')
        .sort('order'),
    }))
  );

  return res.json(
    new ApiResponse(200, populatedTaskGroups, 'Task groups refreshed successfully')
  );
});

export {
  getInbox,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  updateNotificationPreferences,
  getTaskGroups,
  refreshTaskGroups,
}; 