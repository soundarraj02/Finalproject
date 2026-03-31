const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { getNextId } = require('../models/Counter');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    const filter = {};
    if (employeeId) filter.employeeId = employeeId;
    if (date) {
      filter.$or = [{ date }, { inDate: date }, { outDate: date }];
    }
    const records = await Attendance.find(filter).sort({ date: -1, inDate: -1, createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const attendanceId = await getNextId('attendance', 'ATT');
    const payload = req.body || {};
    const record = await Attendance.create({
      ...payload,
      attendanceId,
      date: payload.date || payload.inDate,
      status: payload.status || payload.workStatus,
      checkIn: payload.checkIn || payload.inTime,
      checkOut: payload.checkOut || payload.outTime,
      notes: payload.notes || payload.comments,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const payload = req.body || {};
    const record = await Attendance.findOneAndUpdate(
      { attendanceId: req.params.id },
      {
        ...payload,
        date: payload.date || payload.inDate,
        status: payload.status || payload.workStatus,
        checkIn: payload.checkIn || payload.inTime,
        checkOut: payload.checkOut || payload.outTime,
        notes: payload.notes || payload.comments,
      },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await Attendance.findOneAndDelete({ attendanceId: req.params.id });
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });
    res.json({ message: 'Attendance deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
