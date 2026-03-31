import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVendors } from '../utils/vendorData';
import './Vendor.css';

const Vendor = () => {
  const navigate = useNavigate();
  const vendors = useMemo(() => getVendors(), []);

  return (
    <div className="vendor-page">
      <div className="vendor-container">
        <div className="vendor-header">
          <button className="vendor-link-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <div className="vendor-title-block">
            <h1>Vendor</h1>
            <p>Add and manage vendors with contact, payment, and balance details.</p>
          </div>
          <button className="vendor-link-btn" onClick={() => navigate('/vendor/vendor-list')}>
            Manage Vendor
          </button>
        </div>

        <div className="vendor-summary-grid">
          <div className="summary-card">
            <span className="summary-label">Total Vendors</span>
            <strong>{vendors.length}</strong>
          </div>
        </div>

        <div className="vendor-actions-grid">
          <button className="vendor-action-card" onClick={() => navigate('/vendor/add-vendor')}>
            <span className="action-icon">🏷️</span>
            <h2>Add Vendor</h2>
            <p>Create a vendor record with balances, payment amount, and comments.</p>
          </button>
          <button className="vendor-action-card" onClick={() => navigate('/vendor/vendor-list')}>
            <span className="action-icon">📋</span>
            <h2>Manage Vendor</h2>
            <p>Review vendor entries and search through saved vendor data.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vendor;
