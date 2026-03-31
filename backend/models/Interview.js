const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    interviewId: { type: String, unique: true },
    interviewDate: { type: String, required: true },
    interviewName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    qualification: { type: String },
    yearOfPassing: { type: String },
    followUp: {
      type: String,
      enum: ['Interviewed', 'Not interviewed', 'Call back', 'No response'],
    },
    scheduledDate: { type: String },
    jobRole: { type: String },
    source: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
