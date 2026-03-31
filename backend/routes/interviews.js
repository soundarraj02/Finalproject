const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { getNextId } = require('../models/Counter');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const interviewId = await getNextId('interview', 'INT');
    const interview = await Interview.create({ ...req.body, interviewId });
    res.status(201).json(interview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { interviewId: req.params.id },
      req.body,
      { new: true }
    );
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({ interviewId: req.params.id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json({ message: 'Interview deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
