import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBulkLeads, deleteLead, getLeads, rescheduleLead } from '../utils/leadData';
import './LeadList.css';

const QUICK_FILTERS = [
  'Today',
  'This week',
  'Last week',
  'This month',
  'Last month',
  'This year',
  'Last year',
  'Clear',
];

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStartOfWeek = (date) => {
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  current.setDate(diff);
  current.setHours(0, 0, 0, 0);
  return current;
};

const getEndOfWeek = (date) => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
};

const getRangeByPreset = (preset) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'Today':
      return { startDate: formatDate(today), endDate: formatDate(today) };
    case 'This week': {
      const start = getStartOfWeek(today);
      const end = getEndOfWeek(today);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    }
    case 'Last week': {
      const start = getStartOfWeek(today);
      start.setDate(start.getDate() - 7);
      const end = getEndOfWeek(start);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    }
    case 'This month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    }
    case 'Last month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    }
    case 'This year': {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    }
    case 'Last year': {
      const start = new Date(now.getFullYear() - 1, 0, 1);
      const end = new Date(now.getFullYear() - 1, 11, 31);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    }
    case 'Clear':
    default:
      return { startDate: '', endDate: '' };
  }
};

const parseCsv = (csvText) => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    return {
      date: row.date || '',
      name: row.name || '',
      qualification: row.qualification || '',
      yearOfPassing: row.yearOfPassing || '',
      phoneNumber: row.phoneNumber || '',
      location: row.location || '',
      followUpStatus: row.followUpStatus || '',
      detailsSent: row.detailsSent || '',
      assignedTo: row.assignedTo || '',
      course: row.course || '',
      source: row.source || '',
    };
  });
};

const toCsv = (rows) => {
  const headers = [
    'date',
    'name',
    'qualification',
    'yearOfPassing',
    'phoneNumber',
    'location',
    'followUpStatus',
    'detailsSent',
    'assignedTo',
    'course',
    'source',
  ];

  const data = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header] ?? '';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',')
  );

  return [headers.join(','), ...data].join('\n');
};

const downloadCsv = (filename, content) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const LeadList = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduledToDate, setRescheduledToDate] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    setLeads(getLeads());
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const normalizedSearch = searchTerm.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(normalizedSearch)
        || lead.phoneNumber.toLowerCase().includes(normalizedSearch)
        || lead.location.toLowerCase().includes(normalizedSearch)
        || lead.course.toLowerCase().includes(normalizedSearch)
        || lead.assignedTo.toLowerCase().includes(normalizedSearch)
        || lead.source.toLowerCase().includes(normalizedSearch)
        || lead.followUpStatus.toLowerCase().includes(normalizedSearch)
        || lead.leadId.toLowerCase().includes(normalizedSearch);

      const matchesStartDate = !startDate || lead.date >= startDate;
      const matchesEndDate = !endDate || lead.date <= endDate;

      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  }, [endDate, leads, searchTerm, startDate]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteLead = (leadId) => {
    deleteLead(leadId);
    setShowDeleteConfirm(false);
    setSelectedLead(null);
    loadLeads();
    if (paginatedLeads.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleOpenRescheduleModal = (lead) => {
    setSelectedLead(lead);
    setRescheduledToDate(lead.rescheduledToDate || '');
    setRescheduleReason(lead.rescheduleReason || '');
    setShowRescheduleModal(true);
  };

  const handleSaveReschedule = () => {
    if (!selectedLead || !rescheduledToDate) {
      alert('Please select a rescheduled date.');
      return;
    }

    rescheduleLead(selectedLead.leadId, rescheduledToDate, rescheduleReason);
    setShowRescheduleModal(false);
    setSelectedLead(null);
    setRescheduledToDate('');
    setRescheduleReason('');
    loadLeads();
  };

  const handleDownloadSample = () => {
    const sampleRows = [
      {
        date: formatDate(new Date()),
        name: 'Sample Lead',
        qualification: 'Bachelor Degree',
        yearOfPassing: '2023',
        phoneNumber: '9876543210',
        location: 'Chennai',
        followUpStatus: 'Interest',
        detailsSent: 'Yes',
        assignedTo: 'Counsellor 1',
        course: 'Web Development',
        source: 'Instagram',
      },
    ];

    downloadCsv('lead-sample.csv', toCsv(sampleRows));
  };

  const handleExportExcel = () => {
    const rows = filteredLeads.map((lead) => ({
      date: lead.date,
      name: lead.name,
      qualification: lead.qualification,
      yearOfPassing: lead.yearOfPassing,
      phoneNumber: lead.phoneNumber,
      location: lead.location,
      followUpStatus: lead.followUpStatus,
      detailsSent: lead.detailsSent,
      assignedTo: lead.assignedTo,
      course: lead.course,
      source: lead.source,
    }));

    downloadCsv('lead-report.csv', toCsv(rows));
  };

  const handleBulkUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBulkFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    const rows = parseCsv(text).filter((lead) => lead.name && lead.phoneNumber);

    if (rows.length === 0) {
      alert('No valid rows found in uploaded file.');
      return;
    }

    const count = addBulkLeads(rows);
    loadLeads();
    setCurrentPage(1);
    alert(`${count} leads imported successfully.`);
    event.target.value = '';
  };

  const handleQuickFilter = (preset) => {
    const range = getRangeByPreset(preset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setCurrentPage(1);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="lead-list-page">
      <div className="lead-list-container">
        <div className="list-topbar">
          <h1>Manage Lead</h1>
          <div className="topbar-actions">
            <button onClick={() => navigate('/lead/add-lead')}>Add Leads</button>
            <button onClick={() => navigate('/lead/rescheduled-list')}>Rescheduled List</button>
            <button onClick={handleBulkUploadClick}>Bulk Data</button>
            <button onClick={handleDownloadSample}>Sample</button>
            <button onClick={() => setShowFilterPanel((prev) => !prev)}>Filter</button>
            <button onClick={handleExportExcel}>Excel</button>
            <button onClick={handlePrint}>Print</button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleBulkFileChange}
            />
          </div>
        </div>

        {showFilterPanel && (
          <div className="filter-panel">
            <div className="date-filters">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="quick-filter-buttons">
              {QUICK_FILTERS.map((preset) => (
                <button key={preset} onClick={() => handleQuickFilter(preset)}>{preset}</button>
              ))}
            </div>
          </div>
        )}

        <div className="search-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search lead by name, phone, location, course, assignee, source..."
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

        <div className="leads-table-wrapper">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Qualification</th>
                <th>Year</th>
                <th>Location</th>
                <th>Follow Up</th>
                <th>Details Sent</th>
                <th>Assigned To</th>
                <th>Course</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan="12" className="empty-cell">No leads found</td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead.leadId}>
                    <td>{lead.date}</td>
                    <td>{lead.name}</td>
                    <td>{lead.phoneNumber}</td>
                    <td>{lead.qualification}</td>
                    <td>{lead.yearOfPassing}</td>
                    <td>{lead.location}</td>
                    <td>{lead.followUpStatus}</td>
                    <td>{lead.detailsSent}</td>
                    <td>{lead.assignedTo}</td>
                    <td>{lead.course}</td>
                    <td>{lead.source}</td>
                    <td>
                      <div className="row-actions">
                        <button className="view-btn" onClick={() => setSelectedLead(lead)}>👁️</button>
                        <button className="reschedule-btn" onClick={() => handleOpenRescheduleModal(lead)}>📅</button>
                        <button
                          className="delete-btn"
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          🗑️
                        </button>
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

      {selectedLead && !showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Lead Details</h2>
              <button className="close-btn" onClick={() => setSelectedLead(null)}>✕</button>
            </div>
            <div className="modal-detail-grid">
              <div className="detail-item"><span className="label">Lead ID</span><span className="value">{selectedLead.leadId}</span></div>
              <div className="detail-item"><span className="label">Date</span><span className="value">{selectedLead.date}</span></div>
              <div className="detail-item"><span className="label">Name</span><span className="value">{selectedLead.name}</span></div>
              <div className="detail-item"><span className="label">Phone</span><span className="value">{selectedLead.phoneNumber}</span></div>
              <div className="detail-item"><span className="label">Qualification</span><span className="value">{selectedLead.qualification}</span></div>
              <div className="detail-item"><span className="label">Year of Passing</span><span className="value">{selectedLead.yearOfPassing}</span></div>
              <div className="detail-item"><span className="label">Location</span><span className="value">{selectedLead.location}</span></div>
              <div className="detail-item"><span className="label">Following Updates</span><span className="value">{selectedLead.followUpStatus}</span></div>
              <div className="detail-item"><span className="label">Details Sent</span><span className="value">{selectedLead.detailsSent}</span></div>
              <div className="detail-item"><span className="label">Assigned To</span><span className="value">{selectedLead.assignedTo}</span></div>
              <div className="detail-item"><span className="label">Course</span><span className="value">{selectedLead.course}</span></div>
              <div className="detail-item"><span className="label">Source</span><span className="value">{selectedLead.source}</span></div>
            </div>
          </div>
        </div>
      )}

      {showRescheduleModal && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowRescheduleModal(false)}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <div className="confirm-icon">📅</div>
            <h2>Reschedule Lead</h2>
            <div className="form-group">
              <label>Rescheduled Date</label>
              <input type="date" value={rescheduledToDate} onChange={(event) => setRescheduledToDate(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Reason</label>
              <input value={rescheduleReason} onChange={(event) => setRescheduleReason(event.target.value)} placeholder="Reason for reschedule" />
            </div>
            <div className="confirm-actions">
              <button className="delete-confirm-btn" onClick={handleSaveReschedule}>Save</button>
              <button className="cancel-confirm-btn" onClick={() => setShowRescheduleModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2>Delete Lead?</h2>
            <p>Are you sure you want to delete lead <strong>{selectedLead.name}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="delete-confirm-btn" onClick={() => handleDeleteLead(selectedLead.leadId)}>Delete</button>
              <button className="cancel-confirm-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;
