const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    leadId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    course: { type: String },
    source: { type: String },
    assignedTo: { type: String },
    followUp: { type: String },
    detailsSent: { type: String },
    nextFollowUpDate: { type: String },
    notes: { type: String },
    status: { type: String, default: 'New' },
    isRescheduled: { type: Boolean, default: false },
    rescheduledToDate: { type: String },
    rescheduleReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
