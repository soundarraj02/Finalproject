const mongoose = require('mongoose');

const billRowSchema = new mongoose.Schema({
  desc: { type: String, trim: true },
  qty: { type: Number, default: 0 },
  unitPrice: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
});

const billSchema = new mongoose.Schema(
  {
    billId: { type: String, unique: true },
    type: { type: String, enum: ['gst', 'non-gst'], required: true },
    date: { type: String },
    invoiceNo: { type: String, required: true, trim: true },
    gstin: { type: String },
    clientName: { type: String, required: true, trim: true },
    clientGstin: { type: String },
    rows: {
      type: [billRowSchema],
      default: [],
      validate: {
        validator: (value) => Array.isArray(value) && value.some((row) => row.desc && row.qty > 0),
        message: 'At least one bill row with description and quantity is required.',
      },
    },
    subtotal: { type: Number, default: 0 },
    igstRate: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const toTwoDecimals = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

billSchema.pre('validate', function preValidate(next) {
  const rows = Array.isArray(this.rows) ? this.rows : [];

  this.rows = rows.map((row) => {
    const qty = Number(row.qty) || 0;
    const unitPrice = Number(row.unitPrice) || 0;
    const price = toTwoDecimals(qty * unitPrice);

    return {
      ...row,
      desc: (row.desc || '').trim(),
      qty,
      unitPrice,
      price,
    };
  });

  const subtotal = toTwoDecimals(this.rows.reduce((sum, row) => sum + (Number(row.price) || 0), 0));
  const normalizedRate = this.type === 'gst' ? Math.max(0, Number(this.igstRate) || 0) : 0;
  const igstAmount = toTwoDecimals((subtotal * normalizedRate) / 100);
  const total = toTwoDecimals(subtotal + igstAmount);

  this.subtotal = subtotal;
  this.igstRate = normalizedRate;
  this.igstAmount = igstAmount;
  this.total = total;

  next();
});

module.exports = mongoose.model('Bill', billSchema);
