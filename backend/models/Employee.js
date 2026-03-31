const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true },
    name: { type: String },
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
    designation: { type: String },
    salary: { type: Number },
    annualSalary: { type: Number },
    address: { type: String },
    dateOfJoining: { type: String },
    dateOfRelieving: { type: String },
    isStaff: { type: String },
    staffDateOfJoining: { type: String },
    aadhaarNumber: { type: String },
    panNumber: { type: String },
    accountNumber: { type: String },
    employeeType: { type: String },
    gender: { type: String },
    qualification: { type: String },
    employeePhoto: { type: String },
    remarks: { type: String },

    // Backward compatibility fields
    phone: { type: String },
    department: { type: String },
    city: { type: String },
    state: { type: String },
    dateOfBirth: { type: String },
    status: { type: String, default: 'Active' },
    photo: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
