import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRescheduledLeads } from '../utils/leadData';
import './RescheduledLeadList.css';

const RescheduledLeadList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLeads(getRescheduledLeads());
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const normalizedSearch = searchTerm.toLowerCase();
      return (
        lead.name.toLowerCase().includes(normalizedSearch)
        || lead.phoneNumber.toLowerCase().includes(normalizedSearch)
        || (lead.rescheduleReason || '').toLowerCase().includes(normalizedSearch)
        || (lead.rescheduledToDate || '').toLowerCase().includes(normalizedSearch)
      );
    });
  }, [leads, searchTerm]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="rescheduled-lead-page">
      <div className="rescheduled-lead-container">
        <div className="list-header">
          <button className="back-btn" onClick={() => navigate('/lead/lead-list')}>
            📋 Leads
          </button>
          <h1>Rescheduled Leads</h1>
          <button className="nav-btn" onClick={() => navigate('/lead')}>
            Leads › Rescheduled List
          </button>
        </div>

        <div className="search-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, phone, reschedule reason, date..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="search-icon">🔍</span>
          </div>
          <span className="results-count">{paginatedLeads.length} of {filteredLeads.length}</span>
        </div>

        <div className="table-wrapper">
          <table className="rescheduled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Assigned To</th>
                <th>Rescheduled Date</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">No rescheduled leads found</td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead.leadId}>
                    <td>{lead.name}</td>
                    <td>{lead.phoneNumber}</td>
                    <td>{lead.course}</td>
                    <td>{lead.assignedTo}</td>
                    <td>{lead.rescheduledToDate || '-'}</td>
                    <td>{lead.rescheduleReason || '-'}</td>
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
    </div>
  );
};

export default RescheduledLeadList;
