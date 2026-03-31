import './DataCards.css';

const DataCards = () => {
  // Sample data - in production, this would come from an API
  const cardData = [
    {
      id: 1,
      title: 'Employees',
      count: 45,
      icon: '👥',
      color: '#667eea',
    },
    {
      id: 2,
      title: 'Students',
      count: 128,
      icon: '📚',
      color: '#764ba2',
    },
    {
      id: 3,
      title: 'Clients',
      count: 32,
      icon: '🤝',
      color: '#f093fb',
    },
    {
      id: 4,
      title: 'Invoices',
      count: 156,
      icon: '📄',
      color: '#4facfe',
    },
  ];

  return (
    <div className="data-cards-container">
      {cardData.map((card) => (
        <div key={card.id} className="data-card">
          <div className="card-header">
            <span className="card-icon">{card.icon}</span>
            <h3 className="card-title">{card.title}</h3>
          </div>
          <div className="card-count">{card.count}</div>
          <div className="card-footer">
            <span className="card-label">Total</span>
            <span className="card-trend">↑ 5%</span>
          </div>
          <div className="card-bar" style={{ background: card.color }}></div>
        </div>
      ))}
    </div>
  );
};

export default DataCards;
