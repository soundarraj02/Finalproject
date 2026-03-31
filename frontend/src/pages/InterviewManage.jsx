import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteInterview, getInterviews } from '../utils/interviewData';
import './InterviewManage.css';

const PAGE_SIZE = 8;

const InterviewManage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState(() => getInterviews());
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewRecord, setViewRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.interviewName?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.jobRole?.toLowerCase().includes(q) ||
        r.followUp?.toLowerCase().includes(q)
    );
  }, [records, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = () => {
    deleteInterview(deleteId);
    setRecords(getInterviews());
    setDeleteId(null);
  };

  return (
    <div className="imanage-page">
      {/* Top Nav */}
      <div className="imanage-topbar">
        <button className="imanage-nav-btn" onClick={() => navigate('/interview/schedule')}>
          📅 Schedule
        </button>
        <span className="imanage-breadcrumb">
          <button className="breadcrumb-link" onClick={() => navigate('/interview')}>
            Interview
          </button>
          {' › Manage Interview'}
        </span>
      </div>

      {/* Card */}
      <div className="imanage-card">
        <div className="imanage-header">
          <div>
            <h2>📋 Manage Interview</h2>
          </div>
          <input
            className="imanage-search"
            type="text"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Table */}
        <div className="imanage-table-wrapper">
          <table className="imanage-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Job Role</th>
                <th>Interview Date</th>
                <th>Scheduled Date</th>
                <th>Follow Up</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="imanage-empty">No records found.</td>
                </tr>
              ) : (
                paginated.map((r, idx) => (
                  <tr key={r.interviewId}>
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>{r.interviewId}</td>
                    <td>{r.interviewName}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>{r.jobRole}</td>
                    <td>{r.interviewDate}</td>
                    <td>{r.scheduledDate}</td>
                    <td>
                      <span className={`imanage-status ${r.followUp?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {r.followUp}
                      </span>
                    </td>
                    <td>
                      <button className="imanage-action-btn view" onClick={() => setViewRecord(r)} title="View">👁️</button>
                      <button className="imanage-action-btn delete" onClick={() => setDeleteId(r.interviewId)} title="Delete">🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="imanage-pagination">
          <span className="imanage-page-info">
            Page {page} of {totalPages} ({filtered.length} record{filtered.length !== 1 ? 's' : ''})
          </span>
          <div className="imanage-page-btns">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="imanage-page-btn">
              ← Previous
            </button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="imanage-page-btn">
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewRecord && (
        <div className="imanage-overlay" onClick={() => setViewRecord(null)}>
          <div className="imanage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="imanage-modal-header">
              <h3>Interview Details</h3>
              <button onClick={() => setViewRecord(null)}>✕</button>
            </div>
            <div className="imanage-modal-body">
              {viewRecord.image && (
                <img src={viewRecord.image} alt="candidate" className="imanage-modal-img" />
              )}
              {[
                ['ID', viewRecord.interviewId],
                ['Name', viewRecord.interviewName],
                ['Email', viewRecord.email],
                ['Phone', viewRecord.phone],
                ['Qualification', viewRecord.qualification],
                ['Year of Passing', viewRecord.yearOfPassing],
                ['Job Role', viewRecord.jobRole],
                ['Source', viewRecord.source || '-'],
                ['Interview Date', viewRecord.interviewDate],
                ['Scheduled Date', viewRecord.scheduledDate],
                ['Follow Up', viewRecord.followUp],
              ].map(([label, val]) => (
                <div key={label} className="imanage-modal-row">
                  <span className="imanage-modal-label">{label}</span>
                  <span className="imanage-modal-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="imanage-overlay" onClick={() => setDeleteId(null)}>
          <div className="imanage-modal small" onClick={(e) => e.stopPropagation()}>
            <div className="imanage-modal-header">
              <h3>Confirm Delete</h3>
              <button onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="imanage-modal-body">
              <p>Delete this interview record?</p>
              <div className="imanage-modal-actions">
                <button className="imanage-btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="imanage-btn-delete" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewManage;
