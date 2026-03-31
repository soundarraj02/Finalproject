import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DESIGNATIONS,
  EMPLOYEE_TYPES,
  getEmployeeById,
  QUALIFICATIONS,
  updateEmployee,
} from '../utils/employeeData';
import './AddEmployee.css';

const EditEmployee = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    email: '',
    address: '',
    contactNumber: '',
    alternateNumber: '',
    gender: '',
    maritalStatus: '',
    qualification: '',
    workExperience: '',
    designation: '',
    salary: '',
    annualSalary: '',
    dateOfJoining: '',
    dateOfRelieving: '',
    isStaff: '',
    staffDateOfJoining: '',
    aadhaarNumber: '',
    panNumber: '',
    accountNumber: '',
    employeeType: '',
    employeePhoto: null,
    remarks: '',
  });

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const employee = await getEmployeeById(employeeId);
        if (!employee) {
          setError('Employee not found');
          return;
        }
        setFormData((prev) => ({ ...prev, ...employee }));
        if (employee.employeePhoto) setImagePreview(employee.employeePhoto);
        setLoaded(true);
      } catch {
        setError('Employee not found');
      }
    };
    loadEmployee();
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, employeePhoto: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const requiredFields = [
      'employeeId', 'firstName', 'lastName', 'fatherName', 'motherName', 'dob', 'email', 'address',
      'contactNumber', 'gender', 'maritalStatus', 'qualification', 'designation', 'salary', 'annualSalary',
      'dateOfJoining', 'isStaff', 'aadhaarNumber', 'panNumber', 'accountNumber', 'employeeType',
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`${field.replace(/([A-Z])/g, ' $1').trim()} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      await updateEmployee(employeeId, { ...formData, panNumber: formData.panNumber.toUpperCase() });
      setSuccess('Employee information updated successfully! Redirecting...');
      setTimeout(() => navigate('/student-info/employee-list'), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!loaded && !error) {
    return <div className="add-employee-page"><div className="add-employee-container"><div className="employee-form">Loading...</div></div></div>;
  }

  return (
    <div className="add-employee-page">
      <div className="add-employee-container">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/student-info/employee-list')}>👥 Employee List</button>
          <h1>📝 Edit Employee</h1>
          <button className="nav-btn" onClick={() => navigate('/employee-info')}>Employee info › Employee List</button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="employeeId">Employee ID <span className="required">*</span></label>
                <input id="employeeId" name="employeeId" value={formData.employeeId} disabled className="readonly-input" />
              </div>
              <div className="form-group">
                <label htmlFor="firstName">First Name <span className="required">*</span></label>
                <input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                <input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={isSubmitting} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="fatherName">Father Name <span className="required">*</span></label><input id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleInputChange} disabled={isSubmitting} /></div>
              <div className="form-group"><label htmlFor="motherName">Mother Name <span className="required">*</span></label><input id="motherName" name="motherName" value={formData.motherName} onChange={handleInputChange} disabled={isSubmitting} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="dob">Date of Birth <span className="required">*</span></label><input id="dob" type="date" name="dob" value={formData.dob} onChange={handleInputChange} disabled={isSubmitting} /></div>
              <div className="form-group"><label htmlFor="email">Email <span className="required">*</span></label><input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={isSubmitting} /></div>
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Information</h2>
            <div className="form-row full-width"><div className="form-group"><label htmlFor="address">Address <span className="required">*</span></label><textarea id="address" name="address" rows="3" value={formData.address} onChange={handleInputChange} disabled={isSubmitting} /></div></div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="contactNumber">Contact Number <span className="required">*</span></label><input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} disabled={isSubmitting} /></div>
              <div className="form-group"><label htmlFor="alternateNumber">Alternate Number</label><input id="alternateNumber" name="alternateNumber" value={formData.alternateNumber} onChange={handleInputChange} disabled={isSubmitting} /></div>
            </div>
          </div>

          <div className="form-section">
            <h2>Personal Details</h2>
            <div className="form-row">
              <div className="form-group"><label>Gender <span className="required">*</span></label><div className="radio-group">{['Male','Female','Others'].map((option)=><label key={option} className="radio-label"><input type="radio" name="gender" value={option} checked={formData.gender===option} onChange={handleInputChange} disabled={isSubmitting} />{option}</label>)}</div></div>
              <div className="form-group"><label>Marital Status <span className="required">*</span></label><div className="radio-group">{['Married','Unmarried'].map((option)=><label key={option} className="radio-label"><input type="radio" name="maritalStatus" value={option} checked={formData.maritalStatus===option} onChange={handleInputChange} disabled={isSubmitting} />{option}</label>)}</div></div>
            </div>
          </div>

          <div className="form-section">
            <h2>Professional Details</h2>
            <div className="form-row">
              <div className="form-group"><label htmlFor="qualification">Qualification <span className="required">*</span></label><select id="qualification" name="qualification" value={formData.qualification} onChange={handleInputChange} disabled={isSubmitting}><option value="">Select Qualification</option>{QUALIFICATIONS.map((item)=><option key={item} value={item}>{item}</option>)}</select></div>
              <div className="form-group"><label htmlFor="workExperience">Work Experience (Years)</label><input id="workExperience" type="number" name="workExperience" value={formData.workExperience} onChange={handleInputChange} disabled={isSubmitting} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="designation">Designation <span className="required">*</span></label><select id="designation" name="designation" value={formData.designation} onChange={handleInputChange} disabled={isSubmitting}><option value="">Select Designation</option>{DESIGNATIONS.map((item)=><option key={item} value={item}>{item}</option>)}</select></div>
              <div className="form-group"><label htmlFor="employeeType">Employee Type <span className="required">*</span></label><select id="employeeType" name="employeeType" value={formData.employeeType} onChange={handleInputChange} disabled={isSubmitting}><option value="">Select Employee Type</option>{EMPLOYEE_TYPES.map((item)=><option key={item} value={item}>{item}</option>)}</select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="salary">Salary <span className="required">*</span></label><input id="salary" type="number" name="salary" value={formData.salary} onChange={handleInputChange} disabled={isSubmitting} /></div>
              <div className="form-group"><label htmlFor="annualSalary">Annual Salary <span className="required">*</span></label><input id="annualSalary" type="number" name="annualSalary" value={formData.annualSalary} onChange={handleInputChange} disabled={isSubmitting} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="dateOfJoining">Date of Joining <span className="required">*</span></label><input id="dateOfJoining" type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleInputChange} disabled={isSubmitting} /></div>
              <div className="form-group"><label htmlFor="dateOfRelieving">Date of Relieving</label><input id="dateOfRelieving" type="date" name="dateOfRelieving" value={formData.dateOfRelieving} onChange={handleInputChange} disabled={isSubmitting} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Is Staff <span className="required">*</span></label><div className="radio-group">{['Yes','No'].map((option)=><label key={option} className="radio-label"><input type="radio" name="isStaff" value={option} checked={formData.isStaff===option} onChange={handleInputChange} disabled={isSubmitting} />{option}</label>)}</div></div>
              <div className="form-group"><label htmlFor="staffDateOfJoining">Staff Date of Joining</label><input id="staffDateOfJoining" type="date" name="staffDateOfJoining" value={formData.staffDateOfJoining} onChange={handleInputChange} disabled={isSubmitting} /></div>
            </div>
          </div>

          <div className="form-section">
            <h2>Documents & Account</h2>
            <div className="form-row">
              <div className="form-group"><label htmlFor="aadhaarNumber">Aadhaar Number <span className="required">*</span></label><input id="aadhaarNumber" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} disabled={isSubmitting} /></div>
              <div className="form-group"><label htmlFor="panNumber">PAN Number <span className="required">*</span></label><input id="panNumber" name="panNumber" value={formData.panNumber} onChange={handleInputChange} disabled={isSubmitting} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="accountNumber">Account Number <span className="required">*</span></label><input id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} disabled={isSubmitting} /></div>
              <div className="form-group"><label htmlFor="employeePhoto">Employee Photo</label><input id="employeePhoto" type="file" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} />{imagePreview && <div className="image-preview"><img src={imagePreview} alt="Preview" /></div>}</div>
            </div>
            <div className="form-row full-width"><div className="form-group"><label htmlFor="remarks">Remarks</label><textarea id="remarks" name="remarks" rows="3" value={formData.remarks} onChange={handleInputChange} disabled={isSubmitting} /></div></div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/student-info/employee-list')} className="cancel-btn" disabled={isSubmitting}>👥 Employee List</button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : '✅ Update Employee'}</button>
            <button type="button" onClick={() => navigate('/employee-info')} className="nav-submit-btn" disabled={isSubmitting}>Employee info › Employee List</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
