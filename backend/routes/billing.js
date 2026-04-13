const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { getNextId } = require('../models/Counter');
const { getNextInvoiceNumber, syncInvoiceCounterFromNumber, resetInvoiceCounter } = require('../utils/getNextInvoice');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const bills = await Bill.find(filter).sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/next-invoice-number', protect, async (req, res) => {
  try {
    const invoiceNumber = await getNextInvoiceNumber();
    res.json({ invoiceNumber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sync-invoice-counter', protect, async (req, res) => {
  try {
    const { invoiceNumber } = req.body;

    if (!invoiceNumber || typeof invoiceNumber !== 'string') {
      return res.status(400).json({ message: 'Invalid invoice number' });
    }

    const success = await syncInvoiceCounterFromNumber(invoiceNumber);

    if (success) {
      res.json({ message: 'Invoice counter synced', invoiceNumber });
    } else {
      res.status(400).json({ message: 'Could not sync counter from this invoice number' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reset-invoice-counter', protect, async (req, res) => {
  try {
    const success = await resetInvoiceCounter();

    if (success) {
      res.json({ message: 'Invoice counter reset to 0' });
    } else {
      res.status(400).json({ message: 'Failed to reset counter' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', protect, async (req, res) => {
  try {
    const billId = await getNextId('bill', 'BIL');
    const bill = await Bill.create({ ...req.body, billId });
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const bill = await Bill.findOneAndDelete({ billId: req.params.id });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
