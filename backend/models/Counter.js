const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

const getNextId = async (name, prefix, padLen = 5) => {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `${prefix}${String(counter.seq).padStart(padLen, '0')}`;
};

const getNextPreviewId = async (name, prefix, padLen = 5) => {
  const counter = await Counter.findById(name);
  const nextSeq = (counter?.seq || 0) + 1;
  return `${prefix}${String(nextSeq).padStart(padLen, '0')}`;
};

module.exports = { Counter, getNextId, getNextPreviewId };
