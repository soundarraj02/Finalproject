import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNextInvoiceNumber, INDIAN_STATES } from '../utils/customerData';
import { saveInvoiceDraft } from '../utils/billingData';
import './MasterSetId.css';

const MasterSetInvoiceNo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    address: '',
    contactNumber: '',
    date: new Date().toISOString().split('T')[0],
    state: '',
    invoice: '',
    gstin: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSetId = () => {
    const newInvoice = getNextInvoiceNumber();
    const draft = { ...formData, invoice: newInvoice };
    setFormData(draft);
    saveInvoiceDraft(draft);
    setMessage(`Invoice number ${newInvoice} is ready for the GST bill.`);
  };

  const openGstInvoice = () => {
    saveInvoiceDraft(formData);
    navigate('/billing/gst', { state: { invoiceDraft: formData } });
  };

  return (
    <div className="master-set-page">
      <div className="master-invoice-topline">
        <button className="master-left-btn" onClick={openGstInvoice}>
          🧾 GST Invoice
        </button>
      </div>

      <div className="master-set-topbar">
        <button className="master-left-btn" onClick={() => navigate('/student-info/add-student')}>
          📝 Add Student
        </button>
        <button className="master-right-btn" onClick={() => navigate('/student-info/master')}>
          Master {'>'} Invoice No
        </button>
      </div>

      <div className="master-set-card">
        <h2>Set Invoice ID</h2>
        <p>Create invoice details and generate invoice number.</p>
        {message && <div className="master-success-banner">{message}</div>}

        <div className="master-form-grid">
          <div className="master-form-group">
            <label>Client Name</label>
            <input
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              placeholder="Enter client name"
            />
          </div>

          <div className="master-form-group">
            <label>Contact Number</label>
            <input
              value={formData.contactNumber}
              onChange={(e) => handleChange('contactNumber', e.target.value)}
              placeholder="Enter contact number"
            />
          </div>

          <div className="master-form-group full">
            <label>Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter address"
            />
          </div>

          <div className="master-form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>

          <div className="master-form-group">
            <label>State</label>
            <select value={formData.state} onChange={(e) => handleChange('state', e.target.value)}>
              <option value="">-- Select State --</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="master-form-group">
            <label>Invoice</label>
            <input value={formData.invoice} readOnly placeholder="Auto-generated on Set ID" />
          </div>

          <div className="master-form-group">
            <label>GSTIN</label>
            <input
              value={formData.gstin}
              onChange={(e) => handleChange('gstin', e.target.value)}
              placeholder="Enter GSTIN"
            />
          </div>
        </div>

        <div className="master-set-actions">
          <button className="master-primary-btn" onClick={handleSetId}>
            Set ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterSetInvoiceNo;
