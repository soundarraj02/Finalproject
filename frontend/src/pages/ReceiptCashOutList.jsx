import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCashOutRecord, getCashOutRecords } from '../utils/cashOutData';
import './ReceiptCashOutList.css';

const PAGE_SIZE = 8;

const ReceiptCashOutList = () => {
  const navigate = useNavigate();
  const [partyType, setPartyType] = useState('customer');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(() => getCashOutRecords());
  const [viewRecord, setViewRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.partyType === partyType &&
        (!q ||
          r.name?.toLowerCase().includes(q) ||
          r.paymentType?.toLowerCase().includes(q) ||
          r.comments?.toLowerCase().includes(q))
    );
  }, [records, partyType, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = () => {
    deleteCashOutRecord(deleteId);
    setRecords(getCashOutRecords());
    setDeleteId(null);
    if (page > Math.ceil((filtered.length - 1) / PAGE_SIZE)) setPage(1);
  };

  return (
    <div className="cashout-list-page">
      {/* Top Nav */}
      <div className="cashout-list-topbar">
        <button
          className="cashout-list-nav-btn"
          onClick={() => navigate('/receipt/cash-out/create')}
        >
          ➕ Create
        </button>
        <div className="cashout-list-right">
          <div className="cashout-list-radio-group">
            <label className={partyType === 'student' ? 'active' : ''}>
              <input
                type="radio"
                value="student"
                checked={partyType === 'student'}
                onChange={() => { setPartyType('student'); setPage(1); }}
              />
              Student
            </label>
            <label className={partyType === 'customer' ? 'active' : ''}>
              <input
                type="radio"
                value="customer"
                checked={partyType === 'customer'}
                onChange={() => { setPartyType('customer'); setPage(1); }}
              />
              Customer
            </label>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="cashout-list-card">
        <div className="cashout-list-header">
          <div className="cashout-list-header-left">
            <h2>💸 Manage Cash-Out Receipts</h2>
            <span className="cashout-list-breadcrumb">
              <button className="breadcrumb-link" onClick={() => navigate('/receipt/cash-in/list')}>
                Receipt
              </button>
              {' › Cash Out'}
            </span>
          </div>
          <input
            className="cashout-list-search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Table */}
        <div className="cashout-list-table-wrapper">
          <table className="cashout-list-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>{partyType === 'customer' ? 'Customer' : 'Student'}</th>
                <th>Current Balance</th>
                <th>Paid Amount</th>
                <th>Remaining</th>
                <th>Payment Type</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="cashout-list-empty">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginated.map((r, idx) => (
                  <tr key={r.cashOutId}>
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>{r.cashOutId}</td>
                    <td>{r.name}</td>
                    <td>₹{r.currentBalance}</td>
                    <td>₹{r.paidAmount}</td>
                    <td>₹{r.remainingAmount}</td>
                    <td>{r.paymentType}</td>
                    <td>{r.comments || '-'}</td>
                    <td>
                      <button
                        className="cashout-action-btn view"
                        onClick={() => setViewRecord(r)}
                        title="View"
                      >
                        👁️
                      </button>
                      <button
                        className="cashout-action-btn delete"
                        onClick={() => setDeleteId(r.cashOutId)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="cashout-list-pagination">
          <span className="cashout-list-page-info">
            Page {page} of {totalPages} ({filtered.length} record{filtered.length !== 1 ? 's' : ''})
          </span>
          <div className="cashout-list-page-btns">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="cashout-page-btn"
            >
              ← Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="cashout-page-btn"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewRecord && (
        <div className="cashout-modal-overlay" onClick={() => setViewRecord(null)}>
          <div className="cashout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cashout-modal-header">
              <h3>Cash-Out Details</h3>
              <button onClick={() => setViewRecord(null)}>✕</button>
            </div>
            <div className="cashout-modal-body">
              {[
                ['ID', viewRecord.cashOutId],
                ['Type', viewRecord.partyType],
                ['Name', viewRecord.name],
                ['Current Balance', `₹${viewRecord.currentBalance}`],
                ['Paid Amount', `₹${viewRecord.paidAmount}`],
                ['Remaining Amount', `₹${viewRecord.remainingAmount}`],
                ['Payment Type', viewRecord.paymentType],
                ['Comments', viewRecord.comments || '-'],
              ].map(([label, val]) => (
                <div key={label} className="cashout-modal-row">
                  <span className="cashout-modal-label">{label}</span>
                  <span className="cashout-modal-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="cashout-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="cashout-modal small" onClick={(e) => e.stopPropagation()}>
            <div className="cashout-modal-header">
              <h3>Confirm Delete</h3>
              <button onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="cashout-modal-body">
              <p>Are you sure you want to delete this record?</p>
              <div className="cashout-modal-actions">
                <button className="cashout-btn-cancel" onClick={() => setDeleteId(null)}>
                  Cancel
                </button>
                <button className="cashout-btn-confirm-delete" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptCashOutList;
