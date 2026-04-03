require('dotenv').config();
const connectDB = require('./config/db');

const Student = require('./models/Student');
const Employee = require('./models/Employee');
const Customer = require('./models/Customer');
const Vendor = require('./models/Vendor');
const Lead = require('./models/Lead');
const CashIn = require('./models/CashIn');
const CashOut = require('./models/CashOut');
const Interview = require('./models/Interview');
const Bill = require('./models/Bill');
const User = require('./models/User');
const { Counter } = require('./models/Counter');

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      Student.deleteMany(),
      Employee.deleteMany(),
      Customer.deleteMany(),
      Vendor.deleteMany(),
      Lead.deleteMany(),
      CashIn.deleteMany(),
      CashOut.deleteMany(),
      Interview.deleteMany(),
      Bill.deleteMany(),
      User.deleteMany(),
      Counter.deleteMany(),
    ]);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      role: 'admin',
    });

    const students = await Student.insertMany([
      {
        studentId: 'STU00001',
        studentName: 'Akhil Kumar',
        email: 'akhil@example.com',
        phone: '9876543210',
        course: 'Full Stack Development',
        city: 'Chennai',
        state: 'Tamil Nadu',
        totalFees: 50000,
        feesPaid: 15000,
      },
      {
        studentId: 'STU00002',
        studentName: 'Meera N',
        email: 'meera@example.com',
        phone: '9876500011',
        course: 'Data Science',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        totalFees: 65000,
        feesPaid: 22000,
      },
    ]);

    const employees = await Employee.insertMany([
      {
        employeeId: 'EMP00001',
        name: 'Ravi HR',
        email: 'ravi@example.com',
        phone: '9000000001',
        designation: 'Counselor',
        department: 'Admissions',
      },
      {
        employeeId: 'EMP00002',
        name: 'Divya Ops',
        email: 'divya@example.com',
        phone: '9000000002',
        designation: 'Manager',
        department: 'Operations',
      },
    ]);

    const customers = await Customer.insertMany([
      {
        customerId: 'CUS00001',
        clientName: 'Bright Corp',
        email: 'accounts@brightcorp.com',
        phone: '9888877766',
        city: 'Bengaluru',
        state: 'Karnataka',
        gstin: '29ABCDE1234F1Z5',
        balance: 20000,
      },
    ]);

    await Vendor.insertMany([
      {
        vendorId: 'VEN00001',
        vendorName: 'Office Needs Pvt Ltd',
        vendorType: 'Supplies',
        phone: '9777711111',
        city: 'Chennai',
        state: 'Tamil Nadu',
        balance: 5000,
      },
    ]);

    await Lead.insertMany([
      {
        leadId: 'LEA00001',
        name: 'Naren',
        phone: '9111100000',
        email: 'naren@example.com',
        course: 'Data Science',
        source: 'Instagram',
        assignedTo: employees[0].name,
        followUp: 'Call back',
        detailsSent: 'Yes',
      },
    ]);

    await CashIn.create({
      cashInId: 'CSI00001',
      partyType: 'student',
      name: students[0].studentName,
      currentBalance: 35000,
      paidAmount: 5000,
      remainingAmount: 30000,
      paymentType: 'Cash',
      comments: 'First installment',
    });

    await CashOut.create({
      cashOutId: 'CSO00001',
      partyType: 'customer',
      name: customers[0].clientName,
      currentBalance: 20000,
      paidAmount: 2500,
      remainingAmount: 17500,
      paymentType: 'Bank',
      comments: 'Refund adjustment',
    });

    await Interview.create({
      interviewId: 'INT00001',
      interviewDate: '2026-03-20',
      interviewName: 'Sanjay R',
      email: 'sanjay@example.com',
      phone: '9000090000',
      qualification: 'B.E',
      yearOfPassing: '2024',
      followUp: 'Call back',
      scheduledDate: '2026-03-28',
      jobRole: 'Frontend Developer',
      source: 'Referral',
    });

    await Bill.create({
      billId: 'BIL00001',
      type: 'gst',
      date: '2026-03-25',
      invoiceNo: 'INV-001',
      gstin: '22AAAAA0000A1Z5',
      clientName: customers[0].clientName,
      clientGstin: customers[0].gstin,
      rows: [{ desc: 'Training Services', qty: 1, unitPrice: 10000, price: 10000 }],
      subtotal: 10000,
      igstRate: 18,
      igstAmount: 1800,
      total: 11800,
    });

    await Counter.insertMany([
      { _id: 'student', seq: 2 },
      { _id: 'employee', seq: 2 },
      { _id: 'customer', seq: 1 },
      { _id: 'vendor', seq: 1 },
      { _id: 'lead', seq: 1 },
      { _id: 'cashin', seq: 1 },
      { _id: 'cashout', seq: 1 },
      { _id: 'interview', seq: 1 },
      { _id: 'bill', seq: 1 },
    ]);

    console.log('Seed completed');
    console.log('Admin login: admin@gmail.com / Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
