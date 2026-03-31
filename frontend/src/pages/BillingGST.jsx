import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers } from '../utils/customerData';
import { OUR_DETAILS, addBill as addBillLocal, amountToWords } from '../utils/billingData';
import { addBill } from '../services/billingService';
import './BillingGST.css';

const today = () => new Date().toISOString().split('T')[0];

const emptyRow = () => ({ desc: '', qty: '', unitPrice: '', price: '' });

const BillingGST = () => {
  const navigate = useNavigate();
  const customers = useMemo(() => getCustomers(), []);

  const [date, setDate] = useState(today());
  const [invoiceNo, setInvoiceNo] = useState('');
  const [gstin, setGstin] = useState('');
  const [clientGstin, setClientGstin] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [rows, setRows] = useState([emptyRow()]);
  const [igstRate, setIgstRate] = useState(18);
  const [saved, setSaved] = useState(false);

  const handleRowChange = (idx, field, value) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      if (field === 'qty' || field === 'unitPrice') {
        const qty = parseFloat(updated[idx].qty) || 0;
        const up = parseFloat(updated[idx].unitPrice) || 0;
        updated[idx].price = (qty * up).toFixed(2);
      }
      return updated;
    });
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const deleteRow = (idx) => setRows((prev) => prev.filter((_, i) => i !== idx));

  const subtotal = rows.reduce((s, r) => s + (parseFloat(r.price) || 0), 0);
  const igstAmount = (subtotal * igstRate) / 100;
  const total = subtotal + igstAmount;

  const clientObj = customers.find((c) => c.clientName === selectedClient);
  const clientAddress = clientObj
    ? `${clientObj.address || ''}, ${clientObj.city || ''}, ${clientObj.state || ''}`.replace(/^,\s*|,\s*,/g, '')
    : '';

  const [error, setError] = useState(null);

  const handleSave = async () => {
    const billData = {
      type: 'gst',
      date,
      invoiceNo,
      gstin,
      clientName: selectedClient,
      clientGstin,
      rows,
      subtotal,
      igstRate,
      igstAmount,
      total,
    };

    try {
      await addBill(billData);
      addBillLocal(billData);
      setSaved(true);
      setError(null);
    } catch (error) {
      // Fallback to local cache if server is not available
      addBillLocal(billData);
      setSaved(true);
      setError(`Could not save to server; data stored locally (${error.message}).`);
    } finally {
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="gst-page">
      <div className="gst-topbar no-print">
        <button className="gst-nav-btn" onClick={() => navigate('/billing')}>
          ← Billing
        </button>
        <span className="gst-breadcrumb">GST Bill</span>
      </div>

      {saved && <div className="gst-saved-banner no-print">✅ Bill saved successfully!</div>}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <div className="gst-bill-wrapper" id="gst-print-area">
        {/* Bill Title */}
        <div className="gst-bill-title">TAX INVOICE</div>

        {/* Top Section */}
        <div className="gst-top-section">
          {/* Left: Our Details */}
          <div className="gst-our-details">
            <div className="gst-company-name">{OUR_DETAILS.name}</div>
            <div className="gst-company-addr">{OUR_DETAILS.address}</div>
            <div className="gst-company-phone">📞 {OUR_DETAILS.phone}</div>
            <div className="gst-company-gstin">GSTIN: <strong>{OUR_DETAILS.gstin}</strong></div>
          </div>

          {/* Right: Invoice Details */}
          <div className="gst-invoice-meta">
            <div className="gst-meta-row">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="gst-input" />
            </div>
            <div className="gst-meta-row">
              <label>Invoice No</label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="INV-001"
                className="gst-input"
              />
            </div>
            <div className="gst-meta-row">
              <label>GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="Your GSTIN"
                className="gst-input"
              />
            </div>
          </div>
        </div>

        {/* Invoice To */}
        <div className="gst-invoice-to">
          <div className="gst-section-title">Invoice To</div>
          <div className="gst-to-row">
            <div className="gst-to-group">
              <label>Select Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="gst-select"
              >
                <option value="">-- Select Client --</option>
                {customers.map((c) => (
                  <option key={c.customerId} value={c.clientName}>
                    {c.clientName}
                  </option>
                ))}
              </select>
            </div>
            {clientAddress && (
              <div className="gst-client-address">{clientAddress}</div>
            )}
          </div>
          <div className="gst-to-group" style={{ marginTop: 10 }}>
            <label>GSTIN / UIN</label>
            <input
              type="text"
              value={clientGstin}
              onChange={(e) => setClientGstin(e.target.value)}
              placeholder="Client GSTIN/UIN"
              className="gst-input"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="gst-table-wrapper">
          <table className="gst-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price (₹)</th>
                <th>Price (₹)</th>
                <th className="no-print">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <input
                      className="gst-table-input"
                      value={row.desc}
                      onChange={(e) => handleRowChange(idx, 'desc', e.target.value)}
                      placeholder="Item description"
                    />
                  </td>
                  <td>
                    <input
                      className="gst-table-input number"
                      type="number"
                      value={row.qty}
                      onChange={(e) => handleRowChange(idx, 'qty', e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <input
                      className="gst-table-input number"
                      type="number"
                      value={row.unitPrice}
                      onChange={(e) => handleRowChange(idx, 'unitPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </td>
                  <td className="gst-price-cell">₹{parseFloat(row.price || 0).toFixed(2)}</td>
                  <td className="no-print">
                    <button className="gst-add-row-btn" onClick={addRow} title="Add row below">+</button>
                    {rows.length > 1 && (
                      <button className="gst-del-row-btn" onClick={() => deleteRow(idx)} title="Delete row">🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="gst-total-row">
                <td colSpan={4} className="gst-total-label">Subtotal</td>
                <td>₹{subtotal.toFixed(2)}</td>
                <td className="no-print" />
              </tr>
              <tr className="gst-total-row">
                <td colSpan={3} className="gst-total-label">IGST Rate (%)</td>
                <td>
                  <input
                    className="gst-table-input number no-print"
                    type="number"
                    value={igstRate}
                    onChange={(e) => setIgstRate(Number(e.target.value))}
                    style={{ width: 60 }}
                  />
                  <span className="print-only">{igstRate}%</span>
                </td>
                <td>₹{igstAmount.toFixed(2)}</td>
                <td className="no-print" />
              </tr>
              <tr className="gst-grand-total-row">
                <td colSpan={4} className="gst-total-label">Total</td>
                <td>₹{total.toFixed(2)}</td>
                <td className="no-print" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Section */}
        <div className="gst-bottom-section">
          {/* Left: Total in words + bank */}
          <div className="gst-bottom-left">
            <div className="gst-words">
              <strong>Total in Words:</strong>{' '}
              <span>{amountToWords(total)}</span>
            </div>
            <div className="gst-bank-details">
              <div className="gst-bank-title">Bank Account Details</div>
              <div className="gst-bank-row"><span>Name:</span> {OUR_DETAILS.bank.name}</div>
              <div className="gst-bank-row"><span>Bank:</span> {OUR_DETAILS.bank.bankName}</div>
              <div className="gst-bank-row"><span>Account No:</span> {OUR_DETAILS.bank.accountNumber}</div>
              <div className="gst-bank-row"><span>IFSC Code:</span> {OUR_DETAILS.bank.ifscCode}</div>
              <div className="gst-bank-row"><span>Branch:</span> {OUR_DETAILS.bank.branch}</div>
            </div>
          </div>
          {/* Right: Print & Save */}
          <div className="gst-bottom-right no-print">
            <button className="gst-print-btn" onClick={handlePrint}>🖨️ Print</button>
            <button className="gst-save-btn" onClick={handleSave}>💾 Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingGST;
