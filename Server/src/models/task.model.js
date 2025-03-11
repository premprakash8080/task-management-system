import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    attachments: [{
      name: String,
      url: String,
      type: String,
    }],
    comments: [{
      content: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ isArchived: 1 });

export const Task = mongoose.model('Task', taskSchema); 