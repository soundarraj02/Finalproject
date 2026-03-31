import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers } from '../utils/customerData';
import { addCashInRecord, PAYMENT_TYPES } from '../utils/cashInData';
import { getStudents } from '../utils/studentData';
import './ReceiptCashInCreate.css';

const ReceiptCashInCreate = () => {
  const navigate = useNavigate();
  const [partyType, setPartyType] = useState('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customers = useMemo(() => getCustomers(), []);
  const students = useMemo(() => getStudents(), []);

  const [formData, setFormData] = useState({
    name: '',
    currentBalance: '',
    paidAmount: '',
    remainingAmount: '',
    paymentType: '',
    comments: '',
  });

  const options = partyType === 'customer'
    ? customers.map((customer) => customer.clientName)
    : students.map((student) => student.studentName || `${student.firstName || ''} ${student.lastName || ''}`.trim()).filter(Boolean);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name) return `${partyType === 'customer' ? 'Customer' : 'Student'} name is required.`;
    if (formData.currentBalance === '') return 'Current balance is required.';
    if (formData.paidAmount === '') return 'Paid amount is required.';
    if (formData.remainingAmount === '') return 'Remaining amount is required.';
    if (!formData.paymentType) return 'Payment type is required.';
    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    addCashInRecord({ ...formData, partyType });
    setSuccess(`${partyType === 'customer' ? 'Customer' : 'Student'} cash-in recorded. Redirecting...`);
    setTimeout(() => navigate('/receipt/cash-in/list'), 900);
    setIsSubmitting(false);
  };

  return (
    <div className="cash-in-create-page">
      <div className="cash-in-create-container">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/receipt/cash-in/list')}>
            💰 Cash In
          </button>
          <h1>{partyType === 'customer' ? 'Create Customer Cash-In' : 'Create Student Cash-In'}</h1>
          <div className="radio-switch" role="radiogroup" aria-label="Party Type">
            <label>
              <input type="radio" checked={partyType === 'student'} onChange={() => setPartyType('student')} />
              Student
            </label>
            <label>
              <input type="radio" checked={partyType === 'customer'} onChange={() => setPartyType('customer')} />
              Customer
            </label>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form className="cash-in-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{partyType === 'customer' ? 'Customer Name' : 'Student Name'} <span className="required">*</span></label>
              <select value={formData.name} onChange={(event) => handleInputChange('name', event.target.value)}>
                <option value="">Select {partyType === 'customer' ? 'Customer' : 'Student'}</option>
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Current Balance <span className="required">*</span></label>
              <input type="number" value={formData.currentBalance} onChange={(event) => handleInputChange('currentBalance', event.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Paid Amount <span className="required">*</span></label>
              <input type="number" value={formData.paidAmount} onChange={(event) => handleInputChange('paidAmount', event.target.value)} />
            </div>
            <div className="form-group">
              <label>Remaining Amount <span className="required">*</span></label>
              <input type="number" value={formData.remainingAmount} onChange={(event) => handleInputChange('remainingAmount', event.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Payment Type <span className="required">*</span></label>
              <div className="checkbox-group">
                {PAYMENT_TYPES.map((type) => (
                  <label key={type} className="checkbox-label">
                    <input type="checkbox" checked={formData.paymentType === type} onChange={() => handleInputChange('paymentType', type)} />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Comments</label>
              <textarea rows="3" value={formData.comments} onChange={(event) => handleInputChange('comments', event.target.value)} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/receipt/cash-in/list')}>💰 Cash In</button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : '✅ Save Cash-In'}</button>
            <button type="button" className="nav-submit-btn" onClick={() => navigate('/receipt/cash-in/list')}>Manage {partyType === 'customer' ? 'Customer' : 'Student'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiptCashInCreate;
