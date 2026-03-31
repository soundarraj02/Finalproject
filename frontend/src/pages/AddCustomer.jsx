import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addCustomer, getNextInvoiceNumber, INDIAN_STATES } from '../utils/customerData';
import './AddCustomer.css';

const AddCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    address: '',
    contactNumber: '',
    date: '',
    state: '',
    invoiceNumber: location.state?.invoiceNumber || '',
    gstIn: '',
  });

  useEffect(() => {
    if (!formData.invoiceNumber) {
      setFormData((prev) => ({ ...prev, invoiceNumber: getNextInvoiceNumber() }));
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.clientName.trim()) return 'Client name is required.';
    if (!formData.address.trim()) return 'Address is required.';
    if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) return 'Contact number must be 10 digits.';
    if (!formData.date) return 'Date is required.';
    if (!formData.state) return 'State is required.';
    if (!formData.invoiceNumber) return 'Invoice number is required.';
    if (!formData.gstIn.trim()) return 'GST IN is required.';
    return '';
  };

  const handleSubmit = async (event) => {
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

    try {
      addCustomer(formData);
      setSuccess('Customer registered successfully. Redirecting...');
      setTimeout(() => navigate('/customer/customer-list'), 900);
    } catch {
      setError('Failed to register customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-customer-page">
      <div className="add-customer-container">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/customer')}>
            🧾 GST Invoice
          </button>
          <h1>Register Customer</h1>
          <button className="nav-btn" onClick={() => navigate('/customer')}>
            Customer › Add Customer
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form className="customer-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Customer Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Client Name <span className="required">*</span></label>
                <input name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Enter client name" />
              </div>
              <div className="form-group">
                <label>Contact Number <span className="required">*</span></label>
                <input name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="Enter 10-digit contact number" />
              </div>
            </div>
            <div className="form-row full-width">
              <div className="form-group">
                <label>Address <span className="required">*</span></label>
                <textarea name="address" rows="4" value={formData.address} onChange={handleInputChange} placeholder="Enter address" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date <span className="required">*</span></label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>State <span className="required">*</span></label>
                <select name="state" value={formData.state} onChange={handleInputChange}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Invoice Number <span className="required">*</span></label>
                <input className="readonly-input" name="invoiceNumber" value={formData.invoiceNumber} readOnly />
              </div>
              <div className="form-group">
                <label>GST IN <span className="required">*</span></label>
                <input name="gstIn" value={formData.gstIn} onChange={handleInputChange} placeholder="Enter GST IN" />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/customer')}>🧾 GST Invoice</button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : '✅ Register Customer'}</button>
            <button type="button" className="nav-submit-btn" onClick={() => navigate('/customer')}>Customer › Add Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
