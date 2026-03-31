import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAttendance, getAttendances, WORK_STATUS_OPTIONS } from '../utils/attendanceData';
import './AttendanceList.css';

const AttendanceList = () => {
  const navigate = useNavigate();
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPermission, setFilterPermission] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    setLoading(true);
    setError('');
    try {
      const records = await getAttendances();
      setAttendances(Array.isArray(records) ? records : []);
    } catch {
      setAttendances([]);
      setError('Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendances = useMemo(() => {
    return attendances.filter((attendance) => {
      const normalizedSearch = searchTerm.toLowerCase();
      const employeeName = (attendance.employeeName || '').toLowerCase();
      const employeeId = (attendance.employeeId || '').toLowerCase();
      const attendanceId = (attendance.attendanceId || '').toLowerCase();
      const comments = (attendance.comments || attendance.notes || '').toLowerCase();
      const matchesSearch =
        employeeName.includes(normalizedSearch) ||
        employeeId.includes(normalizedSearch) ||
        attendanceId.includes(normalizedSearch) ||
        comments.includes(normalizedSearch);

      const matchesStatus = !filterStatus || (attendance.workStatus || attendance.status) === filterStatus;
      const matchesPermission = !filterPermission || attendance.permission === filterPermission;

      return matchesSearch && matchesStatus && matchesPermission;
    });
  }, [attendances, filterPermission, filterStatus, searchTerm]);

  const totalPages = Math.ceil(filteredAttendances.length / itemsPerPage);
  const paginatedAttendances = filteredAttendances.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (attendanceId) => {
    try {
      await deleteAttendance(attendanceId);
      setShowDeleteConfirm(false);
      setSelectedAttendance(null);
      await loadAttendances();
      if (paginatedAttendances.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch {
      setError('Failed to delete attendance record.');
    }
  };

  return (
    <div className="attendance-list-page">
      <div className="attendance-list-container">
        <div className="list-header">
          <button className="back-btn" onClick={() => navigate('/attendance/add-attendance')}>
            ➕ Add Attendance
          </button>
          <h1>📋 Manage Employee Attendance</h1>
          <button className="nav-btn" onClick={() => navigate('/attendance')}>
            Attendance › View Attendance
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h2>Loading Attendance Records</h2>
            <p>Please wait while attendance data is loaded.</p>
          </div>
        ) : attendances.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🕒</div>
            <h2>No Attendance Records Found</h2>
            <p>Register employee attendance to see records here.</p>
            <button className="add-btn" onClick={() => navigate('/attendance/add-attendance')}>
              ➕ Add Attendance
            </button>
          </div>
        ) : (
          <>
            <div className="filters-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by employee, ID, attendance ID, or comments..."
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
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Work Status</option>
                  {WORK_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <select
                  value={filterPermission}
                  onChange={(e) => {
                    setFilterPermission(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Permission</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <span className="results-count">
                {paginatedAttendances.length} of {filteredAttendances.length}
              </span>
            </div>

            <div className="attendance-grid">
              {paginatedAttendances.map((attendance) => (
                <div key={attendance.attendanceId} className="attendance-card">
                  <div className="attendance-card-top">
                    <div>
                      <h3>{attendance.employeeName || 'Unknown Employee'}</h3>
                      <p>{attendance.employeeId}</p>
                    </div>
                    <span className={`status-badge status-${(attendance.workStatus || attendance.status || 'present').toLowerCase().replace(/\s+/g, '-')}`}>
                      {attendance.workStatus || attendance.status || 'Present'}
                    </span>
                  </div>

                  <div className="attendance-detail-grid">
                    <div className="detail-item">
                      <span className="label">Attendance ID</span>
                      <span className="value">{attendance.attendanceId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Permission</span>
                      <span className="value">{attendance.permission}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Leave</span>
                      <span className="value">{attendance.leave}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">In</span>
                      <span className="value">{attendance.inDate || attendance.date || '-'} {attendance.inTime || attendance.checkIn || ''}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Out</span>
                      <span className="value">{attendance.outDate || attendance.date || '-'} {attendance.outTime || attendance.checkOut || ''}</span>
                    </div>
                  </div>

                  {(attendance.comments || attendance.notes) && <p className="attendance-comments">{attendance.comments || attendance.notes}</p>}

                  <div className="card-actions">
                    <button className="view-btn" onClick={() => setSelectedAttendance(attendance)}>
                      👁️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedAttendance(attendance);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <button className="pagination-btn" onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
                  ← Previous
                </button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button className="pagination-btn" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedAttendance && !showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setSelectedAttendance(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Attendance Details</h2>
              <button className="close-btn" onClick={() => setSelectedAttendance(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid modal-detail-grid">
                <div className="detail-item">
                  <span className="label">Attendance ID</span>
                  <span className="value">{selectedAttendance.attendanceId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Employee</span>
                  <span className="value">{selectedAttendance.employeeName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Employee ID</span>
                  <span className="value">{selectedAttendance.employeeId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status Work</span>
                  <span className="value">{selectedAttendance.workStatus || selectedAttendance.status || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Permission</span>
                  <span className="value">{selectedAttendance.permission}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Leave</span>
                  <span className="value">{selectedAttendance.leave}</span>
                </div>
                <div className="detail-item">
                  <span className="label">In Date & Time</span>
                  <span className="value">{selectedAttendance.inDate || selectedAttendance.date || '-'} {selectedAttendance.inTime || selectedAttendance.checkIn || ''}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Out Date & Time</span>
                  <span className="value">{selectedAttendance.outDate || selectedAttendance.date || '-'} {selectedAttendance.outTime || selectedAttendance.checkOut || ''}</span>
                </div>
              </div>
              {(selectedAttendance.comments || selectedAttendance.notes) && <p className="modal-comments">{selectedAttendance.comments || selectedAttendance.notes}</p>}
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedAttendance && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2>Delete Attendance Record?</h2>
            <p>Are you sure you want to delete attendance for <strong>{selectedAttendance.employeeName}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="delete-confirm-btn" onClick={() => handleDelete(selectedAttendance.attendanceId)}>
                Delete
              </button>
              <button className="cancel-confirm-btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
