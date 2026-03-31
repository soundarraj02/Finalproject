const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const { getNextId } = require('../models/Counter');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const vendorId = await getNextId('vendor', 'VEN');
    const vendor = await Vendor.create({ ...req.body, vendorId });
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId: req.params.id },
      req.body,
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({ vendorId: req.params.id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
