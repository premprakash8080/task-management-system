const mongoose = require('mongoose');

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

module.exports = mongoose.model('RateLimit', rateLimitSchema); 