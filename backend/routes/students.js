const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { getNextId, getNextPreviewId } = require('../models/Counter');
const { protect } = require('../middleware/auth');

// GET /api/students
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students/next-id
router.get('/next-id', protect, async (req, res) => {
  try {
    const studentId = await getNextPreviewId('student', 'STU');
    res.json({ studentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students
router.post('/', protect, async (req, res) => {
  try {
    const payload = { ...req.body };
    const studentId = await getNextId('student', 'STU');

    if (!payload.studentName) {
      payload.studentName = `${payload.firstName || ''} ${payload.lastName || ''}`.trim();
    }

    if (!payload.contactNumber && payload.phone) payload.contactNumber = payload.phone;
    if (!payload.phone && payload.contactNumber) payload.phone = payload.contactNumber;

    const student = await Student.create({ ...payload, studentId });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/students/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
