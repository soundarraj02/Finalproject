const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true },
    clientName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    gstin: { type: String },
    invoiceNumber: { type: String },
    balance: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
