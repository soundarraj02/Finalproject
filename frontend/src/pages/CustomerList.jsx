import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCustomer, getCustomers } from '../utils/customerData';
import './CustomerList.css';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const loadCustomers = () => {
    setCustomers(getCustomers());
  };

  const filteredCustomers = useMemo(() => customers.filter((customer) => {
    const normalizedSearch = searchTerm.toLowerCase();
    return customer.clientName.toLowerCase().includes(normalizedSearch)
      || customer.invoiceNumber.toLowerCase().includes(normalizedSearch)
      || customer.gstIn.toLowerCase().includes(normalizedSearch)
      || customer.contactNumber.toLowerCase().includes(normalizedSearch);
  }), [customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (invoiceNumber) => {
    deleteCustomer(invoiceNumber);
    setShowDeleteConfirm(false);
    setSelectedCustomer(null);
    loadCustomers();
    if (paginatedCustomers.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="customer-list-page">
      <div className="customer-list-container">
        <div className="list-header">
          <button className="back-btn" onClick={() => navigate('/customer/add-customer')}>
            ➕ Add Customer
          </button>
          <h1>Manage Customer</h1>
          <button className="nav-btn" onClick={() => navigate('/customer')}>
            Customer › Customer List
          </button>
        </div>

        {customers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🧾</div>
            <h2>No Customers Found</h2>
            <p>Register customers to manage them here.</p>
            <button className="add-btn" onClick={() => navigate('/customer/add-customer')}>➕ Add Customer</button>
          </div>
        ) : (
          <>
            <div className="filters-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by client, invoice number, GST IN, or contact..."
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                />
                <span className="search-icon">🔍</span>
              </div>
              <span className="results-count">{paginatedCustomers.length} of {filteredCustomers.length}</span>
            </div>

            <div className="customer-grid">
              {paginatedCustomers.map((customer) => (
                <div key={customer.invoiceNumber} className="customer-card">
                  <div className="customer-card-top">
                    <div>
                      <h3>{customer.clientName}</h3>
                      <p>{customer.invoiceNumber}</p>
                    </div>
                    <span className="customer-chip">{customer.state}</span>
                  </div>
                  <div className="customer-detail-grid">
                    <div className="detail-item"><span className="label">Contact</span><span className="value">{customer.contactNumber}</span></div>
                    <div className="detail-item"><span className="label">Date</span><span className="value">{customer.date}</span></div>
                    <div className="detail-item"><span className="label">GST IN</span><span className="value">{customer.gstIn}</span></div>
                    <div className="detail-item"><span className="label">Address</span><span className="value">{customer.address}</span></div>
                  </div>
                  <div className="card-actions">
                    <button className="view-btn" onClick={() => setSelectedCustomer(customer)}>👁️</button>
                    <button className="delete-btn" onClick={() => { setSelectedCustomer(customer); setShowDeleteConfirm(true); }}>🗑️</button>
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

      {selectedCustomer && !showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Customer Details</h2>
              <button className="close-btn" onClick={() => setSelectedCustomer(null)}>✕</button>
            </div>
            <div className="modal-detail-grid">
              <div className="detail-item"><span className="label">Client Name</span><span className="value">{selectedCustomer.clientName}</span></div>
              <div className="detail-item"><span className="label">Invoice Number</span><span className="value">{selectedCustomer.invoiceNumber}</span></div>
              <div className="detail-item"><span className="label">Contact</span><span className="value">{selectedCustomer.contactNumber}</span></div>
              <div className="detail-item"><span className="label">Date</span><span className="value">{selectedCustomer.date}</span></div>
              <div className="detail-item"><span className="label">State</span><span className="value">{selectedCustomer.state}</span></div>
              <div className="detail-item"><span className="label">GST IN</span><span className="value">{selectedCustomer.gstIn}</span></div>
              <div className="detail-item full-width"><span className="label">Address</span><span className="value">{selectedCustomer.address}</span></div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2>Delete Customer?</h2>
            <p>Are you sure you want to delete <strong>{selectedCustomer.clientName}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="delete-confirm-btn" onClick={() => handleDelete(selectedCustomer.invoiceNumber)}>Delete</button>
              <button className="cancel-confirm-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
