const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
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
    color: {
      type: String,
      default: 'gray.500',
    },
    icon: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['owner', 'admin', 'member'],
        default: 'member',
      },
    }],
    status: {
      type: String,
      enum: ['active', 'archived', 'completed'],
      default: 'active',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    settings: {
      defaultView: {
        type: String,
        enum: ['list', 'board', 'calendar', 'files'],
        default: 'list',
      },
      taskStatuses: [{
        name: String,
        color: String,
        order: Number,
      }],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
projectSchema.index({ ownerId: 1 });
projectSchema.index({ 'members.userId': 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema); 