import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    index: true,
  },
  expireAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
  requests: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const RateLimit = mongoose.model('RateLimit', rateLimitSchema); 