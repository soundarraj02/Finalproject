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

  const invoiceTypes = [
    {
      title: 'GST Bill',
      path: '/billing/gst',
      description: 'Create a tax invoice with Date, Invoice No, GSTIN, client details, item table, subtotal, IGST, total, total in words, and bank details.',
      note: 'Use this when the invoice must include GST details.',
      color: '#667eea',
    },
    {
      title: 'Non-GST Bill',
      path: '/billing/non-gst',
      description: 'Create an estimated bill with Date, Invoice No, client details, item table, subtotal, IGST, total, total in words, and bank details.',
      note: 'Use this when the invoice should be issued without GST.',
      color: '#10b981',
    },
  ];

  const totals = {
    total: bills.length,
    gst: bills.filter((bill) => bill.type === 'gst').length,
    nonGst: bills.filter((bill) => bill.type === 'non-gst').length,
  };

  return (
    <div className="billing-landing">
      <div className="billing-header">
        <button className="billing-back-btn" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
        <div className="billing-header-copy">
          <p className="billing-eyebrow">Billing</p>
          <h1>Choose the bill type</h1>
        </div>
        <button className="billing-master-btn" onClick={() => navigate('/student-info/master/invoice-no')}>
          Master &gt; Invoice No
        </button>
      </div>

      {error && <div className="billing-error-banner">{error}</div>}

      <div className="billing-content-grid">
        <section className="billing-note-panel">
          <h2>Billing notes</h2>
          <p>The invoice page should provide client selection, row-based item entry, subtotal, IGST, total, print, save, total in words, and bank account details.</p>
          {loading ? (
            <div className="billing-summary loading">Loading bill summary...</div>
          ) : (
            <div className="billing-summary">
              <div className="billing-summary-item">
                <span>Total bills</span>
                <strong>{totals.total}</strong>
              </div>
              <div className="billing-summary-item">
                <span>GST bills</span>
                <strong>{totals.gst}</strong>
              </div>
              <div className="billing-summary-item">
                <span>Non-GST bills</span>
                <strong>{totals.nonGst}</strong>
              </div>
            </div>
          )}
        </section>

        <div className="billing-action-cards">
          {invoiceTypes.map((invoiceType) => (
            <article
              key={invoiceType.title}
              className="billing-action-card"
              style={{ '--billing-accent': invoiceType.color }}
            >
              <div className="billing-action-head">
                <div>
                  <p className="billing-card-tag">Invoice</p>
                  <h2 className="billing-action-title">{invoiceType.title}</h2>
                </div>
                <span className="billing-action-accent" />
              </div>
              <p className="billing-action-desc">{invoiceType.description}</p>
              <p className="billing-action-note">{invoiceType.note}</p>
              <button className="billing-open-btn" onClick={() => navigate(invoiceType.path)}>
                Open {invoiceType.title}
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Billing;
