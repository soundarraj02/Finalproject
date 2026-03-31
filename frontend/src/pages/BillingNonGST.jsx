import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers } from '../utils/customerData';
import { OUR_DETAILS, addBill as addBillLocal, amountToWords } from '../utils/billingData';
import { addBill } from '../services/billingService';
import './BillingNonGST.css';

const today = () => new Date().toISOString().split('T')[0];
const emptyRow = () => ({ desc: '', qty: '', unitPrice: '', price: '' });

const BillingNonGST = () => {
  const navigate = useNavigate();
  const customers = useMemo(() => getCustomers(), []);

  const [date, setDate] = useState(today());
  const [invoiceNo, setInvoiceNo] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [clientGstin, setClientGstin] = useState('');
  const [rows, setRows] = useState([emptyRow()]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

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
  // Non-GST bill: IGST displayed as 0, total = subtotal
  const igstAmount = 0;
  const total = subtotal;

  const clientObj = customers.find((c) => c.clientName === selectedClient);
  const clientAddress = clientObj
    ? `${clientObj.address || ''}, ${clientObj.city || ''}, ${clientObj.state || ''}`.replace(/^,\s*|,\s*,/g, '')
    : '';

  const handleSave = async () => {
    const billData = {
      type: 'non-gst',
      date,
      invoiceNo,
      clientName: selectedClient,
      clientGstin,
      rows,
      subtotal,
      igstRate: 0,
      igstAmount,
      total,
    };
    try {
      await addBill(billData);
      addBillLocal(billData);
      setSaved(true);
      setError(null);
    } catch (error) {
      addBillLocal(billData);
      setSaved(true);
      setError(`Could not save to server; data stored locally (${error.message}).`);
    } finally {
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="nongst-page">
      <div className="nongst-topbar no-print">
        <button className="nongst-nav-btn" onClick={() => navigate('/billing')}>
          ← Billing
        </button>
        <span className="nongst-breadcrumb">Non-GST Bill</span>
      </div>

      {saved && <div className="nongst-saved-banner no-print">✅ Bill saved successfully!</div>}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <div className="nongst-bill-wrapper" id="nongst-print-area">
        <div className="nongst-bill-title">ESTIMATED BILL</div>

        {/* Top Section */}
        <div className="nongst-top-section">
          <div className="nongst-our-details">
            <div className="nongst-company-name">{OUR_DETAILS.name}</div>
            <div className="nongst-company-addr">{OUR_DETAILS.address}</div>
            <div className="nongst-company-phone">📞 {OUR_DETAILS.phone}</div>
          </div>
          <div className="nongst-invoice-meta">
            <div className="nongst-meta-row">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="nongst-input" />
            </div>
            <div className="nongst-meta-row">
              <label>Invoice No</label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="EST-001"
                className="nongst-input"
              />
            </div>
          </div>
        </div>

        {/* Invoice To */}
        <div className="nongst-invoice-to">
          <div className="nongst-section-title">Invoice To</div>
          <div className="nongst-to-row">
            <div className="nongst-to-group">
              <label>Select Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="nongst-select"
              >
                <option value="">-- Select Client --</option>
                {customers.map((c) => (
                  <option key={c.customerId} value={c.clientName}>{c.clientName}</option>
                ))}
              </select>
            </div>
            {clientAddress && <div className="nongst-client-address">{clientAddress}</div>}
          </div>
          <div className="nongst-to-group" style={{ marginTop: 10 }}>
            <label>GSTIN / UIN</label>
            <input
              type="text"
              value={clientGstin}
              onChange={(e) => setClientGstin(e.target.value)}
              placeholder="Client GSTIN/UIN (if applicable)"
              className="nongst-input"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="nongst-table-wrapper">
          <table className="nongst-table">
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
                      className="nongst-table-input"
                      value={row.desc}
                      onChange={(e) => handleRowChange(idx, 'desc', e.target.value)}
                      placeholder="Item description"
                    />
                  </td>
                  <td>
                    <input
                      className="nongst-table-input number"
                      type="number"
                      value={row.qty}
                      onChange={(e) => handleRowChange(idx, 'qty', e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <input
                      className="nongst-table-input number"
                      type="number"
                      value={row.unitPrice}
                      onChange={(e) => handleRowChange(idx, 'unitPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </td>
                  <td className="nongst-price-cell">₹{parseFloat(row.price || 0).toFixed(2)}</td>
                  <td className="no-print">
                    <button className="nongst-add-row-btn" onClick={addRow} title="Add row below">+</button>
                    {rows.length > 1 && (
                      <button className="nongst-del-row-btn" onClick={() => deleteRow(idx)} title="Delete row">🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="nongst-total-row">
                <td colSpan={4} className="nongst-total-label">Subtotal</td>
                <td>₹{subtotal.toFixed(2)}</td>
                <td className="no-print" />
              </tr>
              <tr className="nongst-total-row">
                <td colSpan={4} className="nongst-total-label">IGST</td>
                <td>₹0.00</td>
                <td className="no-print" />
              </tr>
              <tr className="nongst-grand-total-row">
                <td colSpan={4} className="nongst-total-label">Total</td>
                <td>₹{total.toFixed(2)}</td>
                <td className="no-print" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Section */}
        <div className="nongst-bottom-section">
          <div className="nongst-bottom-left">
            <div className="nongst-words">
              <strong>Total in Words:</strong> <span>{amountToWords(total)}</span>
            </div>
            <div className="nongst-bank-details">
              <div className="nongst-bank-title">Bank Account Details</div>
              <div className="nongst-bank-row"><span>Name:</span> {OUR_DETAILS.bank.name}</div>
              <div className="nongst-bank-row"><span>Bank:</span> {OUR_DETAILS.bank.bankName}</div>
              <div className="nongst-bank-row"><span>Account No:</span> {OUR_DETAILS.bank.accountNumber}</div>
              <div className="nongst-bank-row"><span>IFSC Code:</span> {OUR_DETAILS.bank.ifscCode}</div>
              <div className="nongst-bank-row"><span>Branch:</span> {OUR_DETAILS.bank.branch}</div>
            </div>
          </div>
          <div className="nongst-bottom-right no-print">
            <button className="nongst-print-btn" onClick={handlePrint}>🖨️ Print</button>
            <button className="nongst-save-btn" onClick={handleSave}>💾 Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingNonGST;
