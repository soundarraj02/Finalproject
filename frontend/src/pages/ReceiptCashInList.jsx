import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCashInRecord, getCashInRecords } from '../utils/cashInData';
import './ReceiptCashInList.css';

const ReceiptCashInList = () => {
  const navigate = useNavigate();
  const [partyType, setPartyType] = useState('customer');
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    setRecords(getCashInRecords());
  }, []);

  const loadRecords = () => {
    setRecords(getCashInRecords());
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (record.partyType !== partyType) {
        return false;
      }

      const normalizedSearch = searchTerm.toLowerCase();
      return (
        record.name.toLowerCase().includes(normalizedSearch)
        || record.paymentType.toLowerCase().includes(normalizedSearch)
        || (record.comments || '').toLowerCase().includes(normalizedSearch)
        || record.cashInId.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [partyType, records, searchTerm]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (cashInId) => {
    deleteCashInRecord(cashInId);
    setShowDeleteConfirm(false);
    setSelectedRecord(null);
    loadRecords();
    if (paginatedRecords.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="cash-in-list-page">
      <div className="cash-in-list-container">
        <div className="list-header">
          <button className="back-btn" onClick={() => navigate('/receipt/cash-in/create')}>➕ Create</button>
          <h1>{partyType === 'customer' ? 'Manage Customer' : 'Manage Student'}</h1>
          <div className="radio-switch" role="radiogroup" aria-label="Party Type">
            <label>
              <input
                type="radio"
                checked={partyType === 'student'}
                onChange={() => {
                  setPartyType('student');
                  setCurrentPage(1);
                }}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                checked={partyType === 'customer'}
                onChange={() => {
                  setPartyType('customer');
                  setCurrentPage(1);
                }}
              />
              Customer
            </label>
          </div>
        </div>

        <div className="search-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, payment type, comments, cash-in ID..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="search-icon">🔍</span>
          </div>
          <span className="results-count">{paginatedRecords.length} of {filteredRecords.length}</span>
        </div>

        <div className="table-wrapper">
          <table className="cash-in-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{partyType === 'customer' ? 'Customer Name' : 'Student Name'}</th>
                <th>Current Balance</th>
                <th>Paid Amount</th>
                <th>Remaining Amount</th>
                <th>Payment Type</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-cell">No records found</td>
                </tr>
              ) : (
                paginatedRecords.map((record) => (
                  <tr key={record.cashInId}>
                    <td>{record.cashInId}</td>
                    <td>{record.name}</td>
                    <td>{record.currentBalance}</td>
                    <td>{record.paidAmount}</td>
                    <td>{record.remainingAmount}</td>
                    <td>{record.paymentType}</td>
                    <td>{record.comments || '-'}</td>
                    <td>
                      <div className="row-actions">
                        <button className="view-btn" onClick={() => setSelectedRecord(record)}>👁️</button>
                        <button className="delete-btn" onClick={() => { setSelectedRecord(record); setShowDeleteConfirm(true); }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button className="pagination-btn" onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>← Previous</button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button className="pagination-btn" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages}>Next →</button>
          </div>
        )}
      </div>

      {selectedRecord && !showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Cash-In Details</h2>
              <button className="close-btn" onClick={() => setSelectedRecord(null)}>✕</button>
            </div>
            <div className="modal-detail-grid">
              <div className="detail-item"><span className="label">ID</span><span className="value">{selectedRecord.cashInId}</span></div>
              <div className="detail-item"><span className="label">Type</span><span className="value">{selectedRecord.partyType}</span></div>
              <div className="detail-item"><span className="label">Name</span><span className="value">{selectedRecord.name}</span></div>
              <div className="detail-item"><span className="label">Current Balance</span><span className="value">{selectedRecord.currentBalance}</span></div>
              <div className="detail-item"><span className="label">Paid Amount</span><span className="value">{selectedRecord.paidAmount}</span></div>
              <div className="detail-item"><span className="label">Remaining Amount</span><span className="value">{selectedRecord.remainingAmount}</span></div>
              <div className="detail-item"><span className="label">Payment Type</span><span className="value">{selectedRecord.paymentType}</span></div>
              <div className="detail-item"><span className="label">Comments</span><span className="value">{selectedRecord.comments || '-'}</span></div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2>Delete Record?</h2>
            <p>Are you sure you want to delete this cash-in record?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="delete-confirm-btn" onClick={() => handleDelete(selectedRecord.cashInId)}>Delete</button>
              <button className="cancel-confirm-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptCashInList;
