import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBills as getStoredBills } from '../utils/billingData';
import { getBills } from '../services/billingService';
import './Billing.css';

const Billing = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const serverBills = await getBills();
        setBills(serverBills);
      } catch (error) {
        // Fallback to localStorage if API unavailable
        setBills(getStoredBills());
        setError(`Unable to reach server; using local cache (${error.message}).`);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const cards = [
    {
      label: 'Total Bills',
      value: bills.length,
      icon: '🧾',
      color: '#667eea',
    },
    {
      label: 'GST Bills',
      value: bills.filter((b) => b.type === 'gst').length,
      icon: '📋',
      color: '#10b981',
    },
    {
      label: 'Non-GST Bills',
      value: bills.filter((b) => b.type === 'non-gst').length,
      icon: '📄',
      color: '#f59e0b',
    },
  ];

  const actions = [
    {
      label: '📋 GST Bill',
      path: '/billing/gst',
      desc: 'Create a GST Tax Invoice',
      color: '#667eea',
    },
    {
      label: '📄 Non-GST Bill',
      path: '/billing/non-gst',
      desc: 'Create an Estimated Bill (Non-GST)',
      color: '#10b981',
    },
  ];

  return (
    <div className="billing-landing">
      <div className="billing-header">
        <button className="billing-back-btn" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
        <h1>Billing Management</h1>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>Loading bills...</div>
      ) : (
        <div className="billing-stat-cards">
          {cards.map((c) => (
            <div key={c.label} className="billing-stat-card" style={{ borderLeft: `5px solid ${c.color}` }}>
              <span className="billing-stat-icon">{c.icon}</span>
              <div>
                <div className="billing-stat-value">{c.value}</div>
                <div className="billing-stat-label">{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="billing-action-cards">
        {actions.map((a) => (
          <div
            key={a.label}
            className="billing-action-card"
            style={{ borderTop: `4px solid ${a.color}` }}
            onClick={() => navigate(a.path)}
          >
            <div className="billing-action-icon">{a.label.split(' ')[0]}</div>
            <div>
              <div className="billing-action-title">{a.label.slice(3)}</div>
              <div className="billing-action-desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Billing;
