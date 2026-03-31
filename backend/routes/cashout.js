const express = require('express');
const router = express.Router();
const CashOut = require('../models/CashOut');
const { getNextId } = require('../models/Counter');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { partyType } = req.query;
    const filter = partyType ? { partyType } : {};
    const records = await CashOut.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const cashOutId = await getNextId('cashout', 'CSO');
    const record = await CashOut.create({ ...req.body, cashOutId });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await CashOut.findOneAndDelete({ cashOutId: req.params.id });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
