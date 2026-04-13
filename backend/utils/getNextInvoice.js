const Counter = require('../models/Counter');

async function getNextInvoiceNumber() {
  try {
    const counter = await Counter.findByIdAndUpdate(
      'invoice',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const year = String(new Date().getFullYear()).slice(-2);
    const invoiceNumber = `KIT/${year}/${String(counter.seq).padStart(3, '0')}`;

    return invoiceNumber;
  } catch (err) {
    throw new Error(`Failed to generate invoice number: ${err.message}`);
  }
}

async function syncInvoiceCounterFromNumber(invoiceNumber) {
  try {
    const match = invoiceNumber.match(/(\d+)\s*$/);

    if (!match) {
      return false;
    }

    const sequence = parseInt(match[1], 10);

    if (!Number.isInteger(sequence) || sequence < 0) {
      return false;
    }

    const counter = await Counter.findByIdAndUpdate(
      'invoice',
      { seq: sequence },
      { new: true, upsert: true }
    );

    return Boolean(counter);
  } catch {
    return false;
  }
}

async function resetInvoiceCounter() {
  try {
    await Counter.findByIdAndUpdate(
      'invoice',
      { seq: 0 },
      { new: true, upsert: true }
    );
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  getNextInvoiceNumber,
  syncInvoiceCounterFromNumber,
  resetInvoiceCounter,
};
