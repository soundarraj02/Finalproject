const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { getNextId } = require('../models/Counter');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const customerId = await getNextId('customer', 'CUS');
    const customer = await Customer.create({ ...req.body, customerId });
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { customerId: req.params.id },
      req.body,
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ customerId: req.params.id });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
