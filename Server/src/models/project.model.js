import mongoose from 'mongoose';

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
      default: '#4A90E2',
    },
    icon: {
      type: String,
      default: '📁',
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
        required: true,
      },
      role: {
        type: String,
        enum: ['owner', 'admin', 'member'],
        default: 'member',
      },
    }],
    sections: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      order: {
        type: Number,
        required: true,
      },
      isArchived: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
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
        default: 'board',
      },
      taskStatuses: [{
        name: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
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
projectSchema.index({ 'sections._id': 1 });

export const Project = mongoose.model('Project', projectSchema); 