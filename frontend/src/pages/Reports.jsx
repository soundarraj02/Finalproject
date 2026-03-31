import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCashInRecords } from '../utils/cashInData';
import { getCashOutRecords } from '../utils/cashOutData';
import { getStudents } from '../utils/studentData';
import { getCustomers } from '../utils/customerData';
import './Reports.css';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => currentYear - i);

const sumField = (arr, field) =>
  arr.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0);

const Reports = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const cashInRecords = useMemo(() => getCashInRecords(), []);
  const cashOutRecords = useMemo(() => getCashOutRecords(), []);
  const students = useMemo(() => getStudents(), []);
  const customers = useMemo(() => getCustomers(), []);

  const filterByYear = (records) =>
    records.filter((r) => new Date(r.createdAt).getFullYear() === selectedYear);

  const yearCashIn = useMemo(() => filterByYear(cashInRecords), [cashInRecords, selectedYear]);
  const yearCashOut = useMemo(() => filterByYear(cashOutRecords), [cashOutRecords, selectedYear]);

  const studentCashIn = yearCashIn.filter((r) => r.partyType === 'student');
  const customerCashIn = yearCashIn.filter((r) => r.partyType === 'customer');
  const studentCashOut = yearCashOut.filter((r) => r.partyType === 'student');
  const customerCashOut = yearCashOut.filter((r) => r.partyType === 'customer');

  const totalStudentCashIn = sumField(studentCashIn, 'paidAmount');
  const totalCustomerCashIn = sumField(customerCashIn, 'paidAmount');
  const totalCashIn = sumField(yearCashIn, 'paidAmount');
  const totalCashOut = sumField(yearCashOut, 'paidAmount');

  const stats = [
    {
      label: 'Total Amount by Students',
      value: totalStudentCashIn,
      icon: '🎓',
      color: '#667eea',
      sub: `${studentCashIn.length} transaction(s)`,
    },
    {
      label: 'Total Amount by Customers',
      value: totalCustomerCashIn,
      icon: '🧾',
      color: '#10b981',
      sub: `${customerCashIn.length} transaction(s)`,
    },
    {
      label: 'Total Cash In',
      value: totalCashIn,
      icon: '💰',
      color: '#f59e0b',
      sub: `${yearCashIn.length} transaction(s)`,
    },
    {
      label: 'Total Cash Out',
      value: totalCashOut,
      icon: '💸',
      color: '#ef4444',
      sub: `${yearCashOut.length} transaction(s)`,
    },
  ];

  // Monthly breakdown (cash in vs cash out)
  const months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec',
  ];
  const monthlyData = months.map((m, i) => {
    const inAmt = yearCashIn
      .filter((r) => new Date(r.createdAt).getMonth() === i)
      .reduce((s, r) => s + (parseFloat(r.paidAmount) || 0), 0);
    const outAmt = yearCashOut
      .filter((r) => new Date(r.createdAt).getMonth() === i)
      .reduce((s, r) => s + (parseFloat(r.paidAmount) || 0), 0);
    return { m, inAmt, outAmt };
  });

  const maxAmt = Math.max(...monthlyData.map((d) => Math.max(d.inAmt, d.outAmt)), 1);

  return (
    <div className="reports-page">
      {/* Topbar */}
      <div className="reports-topbar">
        <button className="reports-btn" onClick={() => navigate('/receipt/cash-in/create')}>
          ➕ Create
        </button>
        <div className="reports-year-select">
          <label>Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Header */}
      <div className="reports-card">
        <div className="reports-header">
          <h2>📊 Manage Reports — {selectedYear}</h2>
          <span className="reports-entity-count">
            {students.length} Students · {customers.length} Customers
          </span>
        </div>

        {/* Stat Cards */}
        <div className="reports-stat-grid">
          {stats.map((s) => (
            <div key={s.label} className="reports-stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
              <div className="reports-stat-icon">{s.icon}</div>
              <div className="reports-stat-info">
                <div className="reports-stat-value">₹{s.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <div className="reports-stat-label">{s.label}</div>
                <div className="reports-stat-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Bar Chart */}
        <div className="reports-chart-section">
          <h3>Monthly Overview — {selectedYear}</h3>
          <div className="reports-chart">
            {monthlyData.map(({ m, inAmt, outAmt }) => (
              <div key={m} className="reports-bar-group">
                <div className="reports-bars">
                  <div
                    className="reports-bar in"
                    style={{ height: `${(inAmt / maxAmt) * 120}px` }}
                    title={`Cash In: ₹${inAmt.toFixed(2)}`}
                  />
                  <div
                    className="reports-bar out"
                    style={{ height: `${(outAmt / maxAmt) * 120}px` }}
                    title={`Cash Out: ₹${outAmt.toFixed(2)}`}
                  />
                </div>
                <div className="reports-bar-label">{m}</div>
              </div>
            ))}
          </div>
          <div className="reports-chart-legend">
            <span className="legend-in">■ Cash In</span>
            <span className="legend-out">■ Cash Out</span>
          </div>
        </div>

        {/* Table: Student breakdown */}
        <div className="reports-table-section">
          <h3>Student Transactions ({selectedYear})</h3>
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Cash In (₹)</th>
                  <th>Cash Out (₹)</th>
                  <th>Net (₹)</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const names = [
                    ...new Set([
                      ...studentCashIn.map((r) => r.name),
                      ...studentCashOut.map((r) => r.name),
                    ]),
                  ];
                  if (names.length === 0)
                    return (
                      <tr>
                        <td colSpan={5} className="reports-empty">No student transactions for {selectedYear}.</td>
                      </tr>
                    );
                  return names.map((name, i) => {
                    const inAmt = sumField(studentCashIn.filter((r) => r.name === name), 'paidAmount');
                    const outAmt = sumField(studentCashOut.filter((r) => r.name === name), 'paidAmount');
                    return (
                      <tr key={name}>
                        <td>{i + 1}</td>
                        <td>{name}</td>
                        <td className="amount-in">₹{inAmt.toFixed(2)}</td>
                        <td className="amount-out">₹{outAmt.toFixed(2)}</td>
                        <td className={inAmt - outAmt >= 0 ? 'amount-in' : 'amount-out'}>
                          ₹{(inAmt - outAmt).toFixed(2)}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table: Customer breakdown */}
        <div className="reports-table-section">
          <h3>Customer Transactions ({selectedYear})</h3>
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Cash In (₹)</th>
                  <th>Cash Out (₹)</th>
                  <th>Net (₹)</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const names = [
                    ...new Set([
                      ...customerCashIn.map((r) => r.name),
                      ...customerCashOut.map((r) => r.name),
                    ]),
                  ];
                  if (names.length === 0)
                    return (
                      <tr>
                        <td colSpan={5} className="reports-empty">No customer transactions for {selectedYear}.</td>
                      </tr>
                    );
                  return names.map((name, i) => {
                    const inAmt = sumField(customerCashIn.filter((r) => r.name === name), 'paidAmount');
                    const outAmt = sumField(customerCashOut.filter((r) => r.name === name), 'paidAmount');
                    return (
                      <tr key={name}>
                        <td>{i + 1}</td>
                        <td>{name}</td>
                        <td className="amount-in">₹{inAmt.toFixed(2)}</td>
                        <td className="amount-out">₹{outAmt.toFixed(2)}</td>
                        <td className={inAmt - outAmt >= 0 ? 'amount-in' : 'amount-out'}>
                          ₹{(inAmt - outAmt).toFixed(2)}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
