import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads, getRescheduledLeads } from '../utils/leadData';
import './Lead.css';

const Lead = () => {
  const navigate = useNavigate();
  const leads = useMemo(() => getLeads(), []);
  const rescheduledLeads = useMemo(() => getRescheduledLeads(), []);

  return (
    <div className="lead-page">
      <div className="lead-container">
        <div className="lead-header">
          <button className="lead-link-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <div className="lead-title-block">
            <h1>Leads</h1>
            <p>Add and manage leads with follow-up tracking and source insights.</p>
          </div>
          <button className="lead-link-btn" onClick={() => navigate('/lead/lead-list')}>
            Manage Leads
          </button>
        </div>

        <div className="lead-summary-grid">
          <div className="summary-card">
            <span className="summary-label">Total Leads</span>
            <strong>{leads.length}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Rescheduled Leads</span>
            <strong>{rescheduledLeads.length}</strong>
          </div>
        </div>

        <div className="lead-actions-grid">
          <button className="lead-action-card" onClick={() => navigate('/lead/add-lead')}>
            <span className="action-icon">➕</span>
            <h2>Add Lead</h2>
            <p>Register a lead with follow-up status, assigned owner, course, and source.</p>
          </button>
          <button className="lead-action-card" onClick={() => navigate('/lead/lead-list')}>
            <span className="action-icon">📋</span>
            <h2>Manage Lead</h2>
            <p>Search, filter, export, print, and manage all lead records.</p>
          </button>
          <button className="lead-action-card" onClick={() => navigate('/lead/rescheduled-list')}>
            <span className="action-icon">📅</span>
            <h2>Rescheduled List</h2>
            <p>View all lead entries that were rescheduled and updated from manage lead.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lead;
