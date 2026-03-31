import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../utils/employeeData';
import './EmployeeList.css';

const getEmployeeName = (employee) => {
  const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
  return fullName || employee.name || 'Unnamed Employee';
};

const getEmployeeContact = (employee) => employee.contactNumber || employee.phone || '-';

const getCurrencyValue = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString();
};

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const allEmployees = await getEmployees();
      setEmployees(Array.isArray(allEmployees) ? allEmployees : []);
    } catch {
      setEmployees([]);
      setError('Failed to load employees. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const employeeName = getEmployeeName(employee).toLowerCase();
    const employeeId = (employee.employeeId || '').toLowerCase();
    const employeeEmail = (employee.email || '').toLowerCase();
    const matchesSearch =
      employeeName.includes(searchTerm.toLowerCase()) ||
      employeeId.includes(searchTerm.toLowerCase()) ||
      employeeEmail.includes(searchTerm.toLowerCase());

    const matchesDesignation = !filterDesignation || employee.designation === filterDesignation;
    const matchesType = !filterType || employee.employeeType === filterType;

    return matchesSearch && matchesDesignation && matchesType;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      await loadEmployees();
      setShowDeleteConfirm(false);
      setSelectedEmployee(null);
      if (paginatedEmployees.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
    } catch {
      setError('Failed to delete employee. Please try again.');
    }
  };

  const designations = [...new Set(employees.map((e) => e.designation))].filter(Boolean).sort();
  const types = [...new Set(employees.map((e) => e.employeeType))].filter(Boolean).sort();

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="employee-list-page">
      <div className="employee-list-container">
        <div className="list-header">
          <button className="back-btn" onClick={() => navigate('/student-info/add-employee')}>
            ➕ Add Employee
          </button>
          <h1>👥 Manage Employee Data</h1>
          <button className="nav-btn" onClick={() => navigate('/student-info')}>
            Student info › Employee List
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h2>Loading Employees</h2>
            <p>Please wait while employee data is loaded.</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h2>No Employees Found</h2>
            <p>Start by adding your first employee</p>
            <button
              className="add-btn"
              onClick={() => navigate('/student-info/add-employee')}
            >
              ➕ Add Employee
            </button>
          </div>
        ) : (
          <>
            <div className="filters-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <span className="search-icon">🔍</span>
              </div>

              <div className="filter-group">
                <select
                  value={filterDesignation}
                  onChange={(e) => {
                    setFilterDesignation(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Designations</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <span className="results-count">
                {paginatedEmployees.length} of {filteredEmployees.length}
              </span>
            </div>

            <div className="employees-grid">
              {paginatedEmployees.map((employee) => (
                <div key={employee.employeeId} className="employee-card">
                  <div className="card-header">
                    {employee.employeePhoto ? (
                      <img src={employee.employeePhoto} alt={getEmployeeName(employee)} className="employee-image" />
                    ) : (
                      <div className="placeholder-image">👤</div>
                    )}
                    <span className="employee-badge">{employee.employeeType || 'Employee'}</span>
                  </div>

                  <div className="card-content">
                    <h3>{getEmployeeName(employee)}</h3>
                    <p className="employee-id">{employee.employeeId}</p>

                    <div className="info-grid">
                      <div className="info-item">
                        <div className="label">Designation</div>
                        <div className="value">{employee.designation || '-'}</div>
                      </div>
                      <div className="info-item">
                        <div className="label">Salary</div>
                        <div className="value">₹{getCurrencyValue(employee.salary)}</div>
                      </div>
                      <div className="info-item">
                        <div className="label">Email</div>
                        <div className="value">{employee.email || '-'}</div>
                      </div>
                      <div className="info-item">
                        <div className="label">Contact</div>
                        <div className="value">{getEmployeeContact(employee)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="view-btn"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      👁️
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/student-info/edit-employee/${employee.employeeId}`)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Employee Modal */}
      {selectedEmployee && !showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setSelectedEmployee(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Employee Details</h2>
              <button className="close-btn" onClick={() => setSelectedEmployee(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {selectedEmployee.employeePhoto && (
                <img src={selectedEmployee.employeePhoto} alt={getEmployeeName(selectedEmployee)} className="detail-image" />
              )}

              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="label">Name</div>
                    <div className="value">{getEmployeeName(selectedEmployee)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Employee ID</div>
                    <div className="value">{selectedEmployee.employeeId}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Email</div>
                    <div className="value">{selectedEmployee.email || '-'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Contact</div>
                    <div className="value">{getEmployeeContact(selectedEmployee)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Gender</div>
                    <div className="value">{selectedEmployee.gender || '-'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Marital Status</div>
                    <div className="value">{selectedEmployee.maritalStatus || '-'}</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Professional Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="label">Designation</div>
                    <div className="value">{selectedEmployee.designation || '-'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Employee Type</div>
                    <div className="value">{selectedEmployee.employeeType || '-'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Qualification</div>
                    <div className="value">{selectedEmployee.qualification || '-'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Work Experience</div>
                    <div className="value">{selectedEmployee.workExperience ? `${selectedEmployee.workExperience} years` : '-'}</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Salary Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="label">Monthly Salary</div>
                    <div className="value">₹{getCurrencyValue(selectedEmployee.salary)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Annual Salary</div>
                    <div className="value">₹{getCurrencyValue(selectedEmployee.annualSalary)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="close-modal-btn" onClick={() => setSelectedEmployee(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2>Delete Employee?</h2>
            <p>Are you sure you want to delete <strong>{getEmployeeName(selectedEmployee)}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>

            <div className="confirm-actions">
              <button
                className="delete-confirm-btn"
                onClick={() => handleDelete(selectedEmployee.employeeId)}
              >
                Delete
              </button>
              <button
                className="cancel-confirm-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
