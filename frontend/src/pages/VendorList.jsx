import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteVendor, getVendors } from '../utils/vendorData';
import './VendorList.css';

const VendorList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setVendors(getVendors());
  }, []);

  const loadVendors = () => {
    setVendors(getVendors());
  };

  const filteredVendors = useMemo(() => vendors.filter((vendor) => {
    const normalizedSearch = searchTerm.toLowerCase();
    return vendor.vendorName.toLowerCase().includes(normalizedSearch)
      || vendor.vendorType.toLowerCase().includes(normalizedSearch)
      || vendor.mobileNumber.toLowerCase().includes(normalizedSearch)
      || vendor.emailId.toLowerCase().includes(normalizedSearch)
      || vendor.vendorId.toLowerCase().includes(normalizedSearch);
  }), [vendors, searchTerm]);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (vendorId) => {
    deleteVendor(vendorId);
    setShowDeleteConfirm(false);
    setSelectedVendor(null);
    loadVendors();
    if (paginatedVendors.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="vendor-list-page">
      <div className="vendor-list-container">
        <div className="list-header">
          <button className="back-btn" onClick={() => navigate('/vendor/add-vendor')}>➕ Create</button>
          <h1>Manage Vendor</h1>
          <button className="nav-btn" onClick={() => navigate('/vendor')}>Vendors › Manage Vendor</button>
        </div>

        {vendors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏷️</div>
            <h2>No Vendors Found</h2>
            <p>Add vendor records to manage them here.</p>
            <button className="add-btn" onClick={() => navigate('/vendor/add-vendor')}>➕ Add Vendor</button>
          </div>
        ) : (
          <>
            <div className="filters-section">
              <div className="search-box">
                <input type="text" placeholder="Search by vendor, type, mobile, email, or ID..." value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }} />
                <span className="search-icon">🔍</span>
              </div>
              <span className="results-count">{paginatedVendors.length} of {filteredVendors.length}</span>
            </div>

            <div className="vendor-grid">
              {paginatedVendors.map((vendor) => (
                <div key={vendor.vendorId} className="vendor-card">
                  <div className="vendor-card-top">
                    <div>
                      <h3>{vendor.vendorName}</h3>
                      <p>{vendor.vendorId}</p>
                    </div>
                    <span className="vendor-chip">{vendor.vendorType}</span>
                  </div>
                  <div className="vendor-detail-grid">
                    <div className="detail-item"><span className="label">Mobile</span><span className="value">{vendor.mobileNumber}</span></div>
                    <div className="detail-item"><span className="label">Email</span><span className="value">{vendor.emailId}</span></div>
                    <div className="detail-item"><span className="label">Current Balance</span><span className="value">₹{Number(vendor.currentBalance).toLocaleString()}</span></div>
                    <div className="detail-item"><span className="label">Paid Amount</span><span className="value">₹{Number(vendor.paidAmount).toLocaleString()}</span></div>
                    <div className="detail-item"><span className="label">Remaining Amount</span><span className="value">₹{Number(vendor.remainingAmount).toLocaleString()}</span></div>
                  </div>
                  {vendor.comments && <p className="vendor-comments">{vendor.comments}</p>}
                  <div className="card-actions">
                    <button className="view-btn" onClick={() => setSelectedVendor(vendor)}>👁️</button>
                    <button className="delete-btn" onClick={() => { setSelectedVendor(vendor); setShowDeleteConfirm(true); }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <button className="pagination-btn" onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>← Previous</button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button className="pagination-btn" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedVendor && !showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setSelectedVendor(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Vendor Details</h2>
              <button className="close-btn" onClick={() => setSelectedVendor(null)}>✕</button>
            </div>
            <div className="modal-detail-grid">
              <div className="detail-item"><span className="label">Vendor Name</span><span className="value">{selectedVendor.vendorName}</span></div>
              <div className="detail-item"><span className="label">Vendor Type</span><span className="value">{selectedVendor.vendorType}</span></div>
              <div className="detail-item"><span className="label">Mobile</span><span className="value">{selectedVendor.mobileNumber}</span></div>
              <div className="detail-item"><span className="label">Email</span><span className="value">{selectedVendor.emailId}</span></div>
              <div className="detail-item full-width"><span className="label">Address</span><span className="value">{selectedVendor.address}</span></div>
              <div className="detail-item"><span className="label">Current Balance</span><span className="value">₹{Number(selectedVendor.currentBalance).toLocaleString()}</span></div>
              <div className="detail-item"><span className="label">Paid Amount</span><span className="value">₹{Number(selectedVendor.paidAmount).toLocaleString()}</span></div>
              <div className="detail-item"><span className="label">Remaining Amount</span><span className="value">₹{Number(selectedVendor.remainingAmount).toLocaleString()}</span></div>
            </div>
            {selectedVendor.comments && <p className="vendor-comments">{selectedVendor.comments}</p>}
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedVendor && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2>Delete Vendor?</h2>
            <p>Are you sure you want to delete <strong>{selectedVendor.vendorName}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="delete-confirm-btn" onClick={() => handleDelete(selectedVendor.vendorId)}>Delete</button>
              <button className="cancel-confirm-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;
