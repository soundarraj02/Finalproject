const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const { getNextId } = require('../models/Counter');
const { protect } = require('../middleware/auth');

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeVendorPayload = (body = {}) => {
  const mobileNumber = body.mobileNumber ?? body.phone ?? '';
  const emailId = body.emailId ?? body.email ?? '';
  const currentBalance = toNumber(body.currentBalance ?? body.balance ?? 0, 0);
  const paidAmount = toNumber(body.paidAmount ?? 0, 0);
  const remainingAmount = toNumber(body.remainingAmount ?? body.balance ?? 0, 0);
  const comments = body.comments ?? body.notes ?? '';

  return {
    ...body,
    mobileNumber,
    emailId,
    currentBalance,
    paidAmount,
    remainingAmount,
    comments,

    // Keep alias fields in sync for old pages/services.
    phone: mobileNumber,
    email: emailId,
    balance: remainingAmount,
    notes: comments,
  };
};

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
    const vendor = await Vendor.create({ ...normalizeVendorPayload(req.body), vendorId });
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId: req.params.id },
      normalizeVendorPayload(req.body),
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
