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
          <div className="customer-title-block">
            <p className="customer-eyebrow">Customer</p>
            <h1>GST Customer Menu</h1>
            <p>Use the menu below to move between Dashboard, Master Dashboard, customer registration, and customer records.</p>
          </div>
        </div>

        <div className="customer-nav-grid">
          <button className="customer-link-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <button className="customer-link-btn customer-link-btn-secondary" onClick={() => navigate('/student-info/master')}>
            Master Dashboard
          </button>
          <button className="customer-link-btn customer-link-btn-secondary" onClick={() => navigate('/customer/customer-list')}>
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
          <button className="customer-action-card" onClick={() => navigate('/customer/add-customer')}>
            <span className="action-icon">🧾</span>
            <h2>Add Customer</h2>
            <p>Register a new customer with invoice and GST details.</p>
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
