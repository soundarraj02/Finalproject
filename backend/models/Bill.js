const mongoose = require('mongoose');

const HOME_STATE = 'Tamil Nadu';

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
    clientState: { type: String, trim: true },
    rows: {
      type: [billRowSchema],
      default: [],
      validate: {
        validator: (value) => Array.isArray(value) && value.some((row) => row.desc && row.qty > 0),
        message: 'At least one bill row with description and quantity is required.',
      },
    },
    subtotal: { type: Number, default: 0 },
    gstRate: { type: Number, default: 0 },
    cgstRate: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstRate: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstRate: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  },
  { timestamps: true }
);

const toTwoDecimals = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const normalizeState = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

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
  const normalizedClientState = normalizeState(this.clientState);
  const isTamilNaduCustomer = normalizedClientState === normalizeState(HOME_STATE);
  const normalizedRate = this.type === 'gst'
    ? Math.max(0, Number(this.gstRate ?? this.igstRate) || 0)
    : 0;

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;

  if (normalizedRate > 0) {
    if (isTamilNaduCustomer) {
      cgstRate = toTwoDecimals(normalizedRate / 2);
      sgstRate = toTwoDecimals(normalizedRate / 2);
      cgstAmount = toTwoDecimals((subtotal * cgstRate) / 100);
      sgstAmount = toTwoDecimals((subtotal * sgstRate) / 100);
    } else {
      igstRate = normalizedRate;
      igstAmount = toTwoDecimals((subtotal * igstRate) / 100);
    }
  }

  const taxAmount = toTwoDecimals(cgstAmount + sgstAmount + igstAmount);
  const total = toTwoDecimals(subtotal + taxAmount);

  this.subtotal = subtotal;
  this.clientState = typeof this.clientState === 'string' ? this.clientState.trim() : '';
  this.gstRate = normalizedRate;
  this.cgstRate = cgstRate;
  this.cgstAmount = cgstAmount;
  this.sgstRate = sgstRate;
  this.sgstAmount = sgstAmount;
  this.igstRate = igstRate;
  this.igstAmount = igstAmount;
  this.taxAmount = taxAmount;
  this.total = total;

  next();
});

module.exports = mongoose.model('Bill', billSchema);
