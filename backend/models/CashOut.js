const mongoose = require('mongoose');

const cashOutSchema = new mongoose.Schema(
  {
    cashOutId: { type: String, unique: true },
    partyType: { type: String, enum: ['student', 'customer'], required: true },
    name: { type: String, required: true },
    currentBalance: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    paymentType: { type: String },
    comments: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CashOut', cashOutSchema);
