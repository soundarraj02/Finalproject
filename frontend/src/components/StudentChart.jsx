import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import './StudentChart.css';

const StudentChart = () => {
  // Sample data - year wise students per course
  const chartData = [
    { name: 'Web Development', value: 450, year: 2024 },
    { name: 'Mobile App Dev', value: 380, year: 2024 },
    { name: 'Data Science', value: 320, year: 2024 },
    { name: 'Cloud Computing', value: 290, year: 2024 },
    { name: 'AI & Machine Learning', value: 350, year: 2024 },
  ];

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].name}</p>
          <p className="value">{payload[0].value} students</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <h2>Students Per Course (Year 2024)</h2>
        <div className="chart-info">
          <p>Distribution across different courses</p>
        </div>
      </div>

      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => value}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">Total Students:</span>
          <span className="stat-value">1,790</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Courses:</span>
          <span className="stat-value">5</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average per Course:</span>
          <span className="stat-value">358</span>
        </div>
      </div>
    </div>
  );
};

export default StudentChart;
