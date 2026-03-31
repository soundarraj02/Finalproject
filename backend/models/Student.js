const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true },
    studentName: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String },
    motherName: { type: String },
    dob: { type: String },
    email: { type: String },
    contactNumber: { type: String },
    alternateNumber: { type: String },
    maritalStatus: { type: String },
    workExperience: { type: String },
    course: { type: String },
    mentor: { type: String },
    dateOfJoining: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    gender: { type: String },
    qualification: { type: String },
    totalAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    studentStatus: { type: String, default: 'Ongoing' },
    studentImage: { type: String },
    remarks: { type: String },

    // Backward compatibility fields
    phone: { type: String },
    batch: { type: String },
    dateOfBirth: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    feesPaid: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
    photo: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
