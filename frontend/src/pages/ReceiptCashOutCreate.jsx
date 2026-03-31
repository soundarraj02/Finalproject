import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers } from '../utils/customerData';
import { addCashOutRecord, PAYMENT_TYPES } from '../utils/cashOutData';
import { getStudents } from '../utils/studentData';
import './ReceiptCashOutCreate.css';

const ReceiptCashOutCreate = () => {
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

  const options =
    partyType === 'customer'
      ? customers.map((c) => c.clientName)
      : students
          .map((s) =>
            s.studentName ||
            `${s.firstName || ''} ${s.lastName || ''}`.trim()
          )
          .filter(Boolean);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name)
      return `${partyType === 'customer' ? 'Customer' : 'Student'} name is required.`;
    if (formData.currentBalance === '') return 'Current balance is required.';
    if (formData.paidAmount === '') return 'Paid amount is required.';
    if (formData.remainingAmount === '') return 'Remaining amount is required.';
    if (!formData.paymentType) return 'Payment type is required.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }
    addCashOutRecord({ ...formData, partyType });
    setSuccess(
      `${partyType === 'customer' ? 'Customer' : 'Student'} cash-out recorded. Redirecting...`
    );
    setTimeout(() => navigate('/receipt/cash-out/list'), 900);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      currentBalance: '',
      paidAmount: '',
      remainingAmount: '',
      paymentType: '',
      comments: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="cashout-create-page">
      {/* Top Nav */}
      <div className="cashout-create-topbar">
        <button
          className="cashout-nav-btn left"
          onClick={() => navigate('/receipt/cash-out/list')}
        >
          💸 Cash Out
        </button>
        <div className="cashout-radio-group">
          <label className={partyType === 'student' ? 'active' : ''}>
            <input
              type="radio"
              value="student"
              checked={partyType === 'student'}
              onChange={() => {
                setPartyType('student');
                handleReset();
              }}
            />
            Student
          </label>
          <label className={partyType === 'customer' ? 'active' : ''}>
            <input
              type="radio"
              value="customer"
              checked={partyType === 'customer'}
              onChange={() => {
                setPartyType('customer');
                handleReset();
              }}
            />
            Customer
          </label>
        </div>
      </div>

      {/* Form Card */}
      <div className="cashout-create-card">
        <div className="cashout-create-header">
          <h2>
            Create {partyType === 'customer' ? 'Customer' : 'Student'} Cash Out
          </h2>
        </div>

        {error && <div className="cashout-alert error">{error}</div>}
        {success && <div className="cashout-alert success">{success}</div>}

        <form onSubmit={handleSubmit} className="cashout-form">
          {/* Name */}
          <div className="cashout-form-group">
            <label>
              {partyType === 'customer' ? 'Customer' : 'Student'} Name *
            </label>
            <select
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            >
              <option value="">
                -- Select {partyType === 'customer' ? 'Customer' : 'Student'} --
              </option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Balance row */}
          <div className="cashout-form-row">
            <div className="cashout-form-group">
              <label>Current Balance *</label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.currentBalance}
                onChange={(e) =>
                  handleInputChange('currentBalance', e.target.value)
                }
              />
            </div>
            <div className="cashout-form-group">
              <label>Paid Amount *</label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.paidAmount}
                onChange={(e) =>
                  handleInputChange('paidAmount', e.target.value)
                }
              />
            </div>
            <div className="cashout-form-group">
              <label>Remaining Amount *</label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.remainingAmount}
                onChange={(e) =>
                  handleInputChange('remainingAmount', e.target.value)
                }
              />
            </div>
          </div>

          {/* Payment Type */}
          <div className="cashout-form-group">
            <label>Payment Type *</label>
            <div className="cashout-payment-types">
              {PAYMENT_TYPES.map((pt) => (
                <label
                  key={pt}
                  className={`cashout-payment-option ${formData.paymentType === pt ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.paymentType === pt}
                    onChange={() =>
                      handleInputChange(
                        'paymentType',
                        formData.paymentType === pt ? '' : pt
                      )
                    }
                  />
                  {pt}
                </label>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="cashout-form-group">
            <label>Comments</label>
            <textarea
              rows={3}
              placeholder="Enter comments..."
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="cashout-form-actions">
            <button type="button" className="cashout-btn-reset" onClick={handleReset}>
              Reset
            </button>
            <button
              type="submit"
              className="cashout-btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiptCashOutCreate;
