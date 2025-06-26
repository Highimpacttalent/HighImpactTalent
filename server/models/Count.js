// models/countTracker.js

import mongoose from 'mongoose';

const countTrackerSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  limit: {
    type: Number,
    required: true,
    default: 100,
  },
  userIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users', // Make sure this matches your user model name
    }
  ],
}, {
  timestamps: true,
});

const CountTracker = mongoose.model('CountTracker', countTrackerSchema);

export default CountTracker;
