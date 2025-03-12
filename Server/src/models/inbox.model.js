import mongoose from 'mongoose';

const inboxSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    notifications: [{
      type: {
        type: String,
        enum: ['task_assignment', 'task_update', 'bug_report', 'mention', 'due_date_reminder', 'system_update'],
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: String,
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
      isRead: {
        type: Boolean,
        default: false,
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
      dueDate: Date,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
    }],
    taskGroups: [{
      groupType: {
        type: String,
        enum: ['today', 'tomorrow', 'upcoming', 'overdue', 'no_due_date'],
        required: true,
      },
      tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      }],
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    }],
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      notificationTypes: {
        task_assignment: { type: Boolean, default: true },
        task_update: { type: Boolean, default: true },
        bug_report: { type: Boolean, default: true },
        mention: { type: Boolean, default: true },
        due_date_reminder: { type: Boolean, default: true },
        system_update: { type: Boolean, default: true },
      },
      reminderTiming: {
        type: Number, // hours before due date
        default: 24,
      },
    },
    stats: {
      unreadCount: {
        type: Number,
        default: 0,
      },
      totalNotifications: {
        type: Number,
        default: 0,
      },
      lastChecked: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
inboxSchema.index({ 'notifications.isRead': 1 });
inboxSchema.index({ 'notifications.createdAt': -1 });
inboxSchema.index({ 'notifications.type': 1 });
inboxSchema.index({ 'taskGroups.groupType': 1 });
inboxSchema.index({ 'stats.unreadCount': 1 });

// Update stats when notifications are added or modified
inboxSchema.pre('save', function(next) {
  if (this.isModified('notifications')) {
    this.stats.unreadCount = this.notifications.filter(n => !n.isRead).length;
    this.stats.totalNotifications = this.notifications.length;
    this.stats.lastChecked = new Date();
  }
  next();
});

export const Inbox = mongoose.model('Inbox', inboxSchema); 