import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers } from '../utils/customerData';
import './Customer.css';

const Customer = () => {
  const navigate = useNavigate();
  const customers = useMemo(() => getCustomers(), []);

  return (
    <div className="customer-page">
      <div className="customer-container">
        <div className="customer-header">
          <button className="customer-link-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <div className="customer-title-block">
            <h1>GST Invoice</h1>
            <p>Register customers and manage invoice-linked client records.</p>
          </div>
          <button className="customer-link-btn" onClick={() => navigate('/customer/customer-list')}>
            Customer List
          </button>
        </div>

        <div className="customer-summary-grid">
          <div className="summary-card">
            <span className="summary-label">Total Customers</span>
            <strong>{customers.length}</strong>
          </div>
        </div>

        <div className="customer-actions-grid">
          <button className="customer-action-card" onClick={() => navigate('/student-info/master')}>
            <span className="action-icon">🧾</span>
            <h2>Add Customer</h2>
            <p>Generate invoice number in Master and move to the customer registration page.</p>
          </button>
          <button className="customer-action-card" onClick={() => navigate('/customer/customer-list')}>
            <span className="action-icon">📋</span>
            <h2>View Customer</h2>
            <p>Search and manage customer records with invoice and GST details.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customer;
