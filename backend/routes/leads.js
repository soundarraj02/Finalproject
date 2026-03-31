const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { getNextId } = require('../models/Counter');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { rescheduled } = req.query;
    const filter = rescheduled === 'true' ? { isRescheduled: true } : {};
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const leadId = await getNextId('lead', 'LEA');
    const lead = await Lead.create({ ...req.body, leadId });
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/leads/bulk  — array of leads
router.post('/bulk', protect, async (req, res) => {
  try {
    const leadsData = req.body;
    const created = [];
    for (const data of leadsData) {
      const leadId = await getNextId('lead', 'LEA');
      const lead = await Lead.create({ ...data, leadId });
      created.push(lead);
    }
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { leadId: req.params.id },
      req.body,
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ leadId: req.params.id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
