import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addVendor, VENDOR_TYPES } from '../utils/vendorData';
import './AddVendor.css';

const AddVendor = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorType: '',
    mobileNumber: '',
    emailId: '',
    address: '',
    currentBalance: '',
    paidAmount: '',
    remainingAmount: '',
    comments: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.vendorName.trim()) return 'Vendor name is required.';
    if (!formData.vendorType) return 'Vendor type is required.';
    if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) return 'Mobile number must be 10 digits.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) return 'Please enter a valid email ID.';
    if (!formData.address.trim()) return 'Address is required.';
    if (formData.currentBalance === '') return 'Current balance is required.';
    if (formData.paidAmount === '') return 'Paid amount is required.';
    if (formData.remainingAmount === '') return 'Remaining amount is required.';
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
      addVendor(formData);
      setSuccess('Vendor registered successfully. Redirecting...');
      setTimeout(() => navigate('/vendor/vendor-list'), 900);
    } catch {
      setError('Failed to save vendor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-vendor-page">
      <div className="add-vendor-container">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/vendor/vendor-list')}>🏷️ Vendor</button>
          <h1>Register Vendor</h1>
          <button className="nav-btn" onClick={() => navigate('/vendor')}>Vendor › Add Vendor</button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form className="vendor-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Vendor Details</h2>
            <div className="form-row">
              <div className="form-group"><label>Vendor Name <span className="required">*</span></label><input name="vendorName" value={formData.vendorName} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Vendor Type <span className="required">*</span></label><select name="vendorType" value={formData.vendorType} onChange={handleInputChange}><option value="">Select Vendor Type</option>{VENDOR_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Mobile Number <span className="required">*</span></label><input name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Email ID <span className="required">*</span></label><input name="emailId" value={formData.emailId} onChange={handleInputChange} /></div>
            </div>
            <div className="form-row full-width">
              <div className="form-group"><label>Address <span className="required">*</span></label><textarea rows="4" name="address" value={formData.address} onChange={handleInputChange} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Current Balance <span className="required">*</span></label><input type="number" name="currentBalance" value={formData.currentBalance} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Paid Amount <span className="required">*</span></label><input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Remaining Amount <span className="required">*</span></label><input type="number" name="remainingAmount" value={formData.remainingAmount} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Comments</label><input name="comments" value={formData.comments} onChange={handleInputChange} /></div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/vendor/vendor-list')}>🏷️ Vendor</button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : '✅ Register Vendor'}</button>
            <button type="button" className="nav-submit-btn" onClick={() => navigate('/vendor')}>Vendor › Add Vendor</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
