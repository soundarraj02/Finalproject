const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    vendorId: { type: String, unique: true },
    vendorName: { type: String, required: true },
    vendorType: { type: String },
    mobileNumber: { type: String },
    emailId: { type: String },
    currentBalance: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    comments: { type: String },

    // Legacy aliases kept for backward compatibility with existing UI/API usage.
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    gstin: { type: String },
    balance: { type: Number, default: 0 },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
