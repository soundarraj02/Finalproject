const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, sparse: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff'], default: 'admin' },
    staffName: { type: String },
    dateOfJoining: { type: String },
    comments: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
