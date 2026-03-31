import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import StudentInfo from './pages/StudentInfo';
import EmployeeInfo from './pages/EmployeeInfo';
import Master from './pages/Master';
import MasterSetInvoiceNo from './pages/MasterSetInvoiceNo';
import MasterSetStudentId from './pages/MasterSetStudentId';
import MasterSetEmployeeId from './pages/MasterSetEmployeeId';
import MasterCreateStaff from './pages/MasterCreateStaff';
import MasterAdmins from './pages/MasterAdmins';
import CourseFees from './pages/CourseFees';
import CourseFeeForm from './pages/CourseFeeForm';
import AddStudent from './pages/AddStudent';
import StudentList from './pages/StudentList';
import EditStudent from './pages/EditStudent';
import AddEmployee from './pages/AddEmployee';
import EmployeeList from './pages/EmployeeList';
import EditEmployee from './pages/EditEmployee';
import Attendance from './pages/Attendance';
import AddAttendance from './pages/AddAttendance';
import AttendanceList from './pages/AttendanceList';
import Customer from './pages/Customer';
import AddCustomer from './pages/AddCustomer';
import CustomerList from './pages/CustomerList';
import Vendor from './pages/Vendor';
import AddVendor from './pages/AddVendor';
import VendorList from './pages/VendorList';
import Lead from './pages/Lead';
import AddLead from './pages/AddLead';
import LeadList from './pages/LeadList';
import RescheduledLeadList from './pages/RescheduledLeadList';
import ReceiptCashInCreate from './pages/ReceiptCashInCreate';
import ReceiptCashInList from './pages/ReceiptCashInList';
import ReceiptCashOutCreate from './pages/ReceiptCashOutCreate';
import ReceiptCashOutList from './pages/ReceiptCashOutList';
import Interview from './pages/Interview';
import InterviewSchedule from './pages/InterviewSchedule';
import InterviewManage from './pages/InterviewManage';
import Reports from './pages/Reports';
import Billing from './pages/Billing';
import BillingGST from './pages/BillingGST';
import BillingNonGST from './pages/BillingNonGST';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Information Routes */}
        <Route
          path="/student-info"
          element={
            <ProtectedRoute>
              <StudentInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-info"
          element={
            <ProtectedRoute>
              <EmployeeInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/master"
          element={
            <ProtectedRoute>
              <Master />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/master/invoice-no"
          element={
            <ProtectedRoute>
              <MasterSetInvoiceNo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/master/student-id"
          element={
            <ProtectedRoute>
              <MasterSetStudentId />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/master/employee-id"
          element={
            <ProtectedRoute>
              <MasterSetEmployeeId />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/master/create-staff"
          element={
            <ProtectedRoute>
              <MasterCreateStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/master/course-fees"
          element={
            <ProtectedRoute>
              <CourseFees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/master/course-fees/add"
          element={
            <ProtectedRoute>
              <CourseFeeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/master/course-fees/edit/:courseFeeId"
          element={
            <ProtectedRoute>
              <CourseFeeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/master/admins"
          element={
            <ProtectedRoute>
              <MasterAdmins />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/add-student"
          element={
            <ProtectedRoute>
              <AddStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/student-list"
          element={
            <ProtectedRoute>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/edit-student/:studentId"
          element={
            <ProtectedRoute>
              <EditStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/add-employee"
          element={
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/employee-list"
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-info/edit-employee/:employeeId"
          element={
            <ProtectedRoute>
              <EditEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/add-attendance"
          element={
            <ProtectedRoute>
              <AddAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/attendance-list"
          element={
            <ProtectedRoute>
              <AttendanceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <Customer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/add-customer"
          element={
            <ProtectedRoute>
              <AddCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/customer-list"
          element={
            <ProtectedRoute>
              <CustomerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor"
          element={
            <ProtectedRoute>
              <Vendor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/add-vendor"
          element={
            <ProtectedRoute>
              <AddVendor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/vendor-list"
          element={
            <ProtectedRoute>
              <VendorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lead"
          element={
            <ProtectedRoute>
              <Lead />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lead/add-lead"
          element={
            <ProtectedRoute>
              <AddLead />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lead/lead-list"
          element={
            <ProtectedRoute>
              <LeadList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lead/rescheduled-list"
          element={
            <ProtectedRoute>
              <RescheduledLeadList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipt/cash-in/create"
          element={
            <ProtectedRoute>
              <ReceiptCashInCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipt/cash-in/list"
          element={
            <ProtectedRoute>
              <ReceiptCashInList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipt/cash-out/create"
          element={
            <ProtectedRoute>
              <ReceiptCashOutCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipt/cash-out/list"
          element={
            <ProtectedRoute>
              <ReceiptCashOutList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/schedule"
          element={
            <ProtectedRoute>
              <InterviewSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/manage"
          element={
            <ProtectedRoute>
              <InterviewManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/gst"
          element={
            <ProtectedRoute>
              <BillingGST />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/non-gst"
          element={
            <ProtectedRoute>
              <BillingNonGST />
            </ProtectedRoute>
          }
        />

        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
