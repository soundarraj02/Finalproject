const mongoose = require('mongoose');

const billRowSchema = new mongoose.Schema({
  desc: String,
  qty: Number,
  unitPrice: Number,
  price: Number,
});

const billSchema = new mongoose.Schema(
  {
    billId: { type: String, unique: true },
    type: { type: String, enum: ['gst', 'non-gst'], required: true },
    date: { type: String },
    invoiceNo: { type: String },
    gstin: { type: String },
    clientName: { type: String },
    clientGstin: { type: String },
    rows: [billRowSchema],
    subtotal: { type: Number, default: 0 },
    igstRate: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bill', billSchema);
