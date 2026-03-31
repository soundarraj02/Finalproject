const express = require('express');
const router = express.Router();
const CashIn = require('../models/CashIn');
const { getNextId } = require('../models/Counter');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { partyType } = req.query;
    const filter = partyType ? { partyType } : {};
    const records = await CashIn.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const cashInId = await getNextId('cashin', 'CSI');
    const record = await CashIn.create({ ...req.body, cashInId });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await CashIn.findOneAndDelete({ cashInId: req.params.id });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
