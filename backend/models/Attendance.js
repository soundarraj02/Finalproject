const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    attendanceId: { type: String, unique: true },
    employeeId: { type: String, required: true },
    employeeName: { type: String },
    workStatus: {
      type: String,
      enum: ['Present', 'Absent', 'Half Day', 'Remote', 'On Duty', 'Late', 'Leave'],
      default: 'Present',
    },
    permission: { type: String, enum: ['Yes', 'No'], default: 'No' },
    leave: { type: String, enum: ['Yes', 'No'], default: 'No' },
    inDate: { type: String },
    inTime: { type: String },
    outDate: { type: String },
    outTime: { type: String },
    comments: { type: String },
    date: { type: String },
    checkIn: { type: String },
    checkOut: { type: String },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half Day', 'Remote', 'On Duty', 'Late', 'Leave'],
      default: 'Present',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
