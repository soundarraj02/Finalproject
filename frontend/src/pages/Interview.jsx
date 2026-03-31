import { useNavigate } from 'react-router-dom';
import { getInterviews } from '../utils/interviewData';
import './Interview.css';

const Interview = () => {
  const navigate = useNavigate();
  const interviews = getInterviews();

  const cards = [
    {
      label: 'Total Interviews',
      value: interviews.length,
      icon: '📋',
      color: '#667eea',
    },
    {
      label: 'Interviewed',
      value: interviews.filter((i) => i.followUp === 'Interviewed').length,
      icon: '✅',
      color: '#10b981',
    },
    {
      label: 'Not Interviewed',
      value: interviews.filter((i) => i.followUp === 'Not interviewed').length,
      icon: '⏳',
      color: '#f59e0b',
    },
    {
      label: 'No Response',
      value: interviews.filter((i) => i.followUp === 'No response').length,
      icon: '📵',
      color: '#ef4444',
    },
  ];

  const actions = [
    { label: '📅 Schedule', path: '/interview/schedule', desc: 'Schedule a new interview' },
    { label: '📋 Manage', path: '/interview/manage', desc: 'View & manage interviews' },
  ];

  return (
    <div className="interview-landing">
      <div className="interview-landing-header">
        <button className="interview-back-btn" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
        <h1>Interview Management</h1>
      </div>

      <div className="interview-stat-cards">
        {cards.map((c) => (
          <div key={c.label} className="interview-stat-card" style={{ borderLeft: `5px solid ${c.color}` }}>
            <span className="interview-stat-icon">{c.icon}</span>
            <div>
              <div className="interview-stat-value">{c.value}</div>
              <div className="interview-stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="interview-action-cards">
        {actions.map((a) => (
          <div key={a.label} className="interview-action-card" onClick={() => navigate(a.path)}>
            <div className="interview-action-icon">{a.label.split(' ')[0]}</div>
            <div>
              <div className="interview-action-title">{a.label.slice(3)}</div>
              <div className="interview-action-desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interview;
