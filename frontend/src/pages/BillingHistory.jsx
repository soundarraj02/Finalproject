import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { getBills as getStoredBills } from '../utils/billingData';
import { getBills, updateBill, deleteBill } from '../services/billingService';
import './BillingHistory.css';

const BillingHistory = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        console.log('📥 Fetching bills from API...');
        const serverBills = await getBills();
        console.log('✅ Received bills from server:');
        console.log('Count:', serverBills?.length || 0);
        console.log('First few bills:', serverBills?.slice(0, 3).map(b => ({ billId: b.billId, invoiceNo: b.invoiceNo, status: b.status })));
        setBills(serverBills || []);
      } catch (err) {
        // Fallback to localStorage if API fails
        console.error('❌ Error fetching from API:', err.message);
        setBills(getStoredBills() || []);
        setError(`Using local data (Server unavailable: ${err.message})`);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleMarkAsPaid = async (billId) => {
    try {
      console.log('\n=== MARK AS PAID ===');
      console.log('Bill ID:', billId);
      console.log('Type of billId:', typeof billId);
      
      // Optimistically update local state first
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.billId === billId ? { ...bill, status: 'paid' } : bill
        )
      );
      console.log('✅ Optimistic UI update done');
      
      // Then update on backend
      console.log('🔄 Sending PUT request to /api/billing/' + billId);
      const updatedBill = await updateBill(billId, { status: 'paid' });
      console.log('✅ Response received:');
      console.log('Status:', updatedBill?.status);
      console.log('Full bill:', updatedBill);
      
      // Replace with backend response to ensure sync
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.billId === billId ? { ...updatedBill } : bill
        )
      );
      setError('');
      console.log('=== SUCCESS ===\n');
    } catch (err) {
      console.error('\n=== ERROR MARKING AS PAID ===');
      console.error('Bill ID attempted:', billId);
      console.error('Error message:', err.message);
      console.error('Status code:', err.response?.status);
      console.error('Error response:', err.response?.data);
      console.error('================\n');
      // Revert on error and show message
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.billId === billId ? { ...bill, status: 'unpaid' } : bill
        )
      );
      setError(`Failed to mark bill as paid: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        console.log('Deleting bill:', billId);
        // Optimistically remove from UI
        setBills((prevBills) => prevBills.filter((bill) => bill.billId !== billId));
        
        // Then delete on backend
        await deleteBill(billId);
        console.log('Bill deleted from backend');
        setError('');
      } catch (err) {
        console.error('Error deleting bill:', err);
        // Reload bills on error
        const serverBills = await getBills();
        setBills(serverBills || []);
        setError(`Failed to delete bill: ${err.message}`);
      }
    }
  };

  // Filter bills
  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.clientName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || bill.type === filterType;
    const matchesStatus = filterStatus === 'all' || (bill.status || 'unpaid') === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate totals
  const totals = {
    total: filteredBills.length,
    amount: filteredBills.reduce((sum, bill) => sum + (parseFloat(bill.total) || 0), 0),
    unpaid: filteredBills.filter((bill) => bill.status !== 'paid').length,
    outstanding: filteredBills
      .filter((bill) => bill.status !== 'paid')
      .reduce((sum, bill) => sum + (parseFloat(bill.total) || 0), 0),
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Billing History</h2>
        <Button variant="outline-primary" onClick={() => navigate('/billing')}>
          ← Back to Billing
        </Button>
      </div>

      {error && <Alert variant="warning">{error}</Alert>}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <div className="summary-card">
            <p className="summary-label">Total Invoices</p>
            <h3>{totals.total}</h3>
          </div>
        </Col>
        <Col md={3}>
          <div className="summary-card">
            <p className="summary-label">Total Amount</p>
            <h3>₹{totals.amount.toFixed(2)}</h3>
          </div>
        </Col>
        <Col md={3}>
          <div className="summary-card unpaid">
            <p className="summary-label">Unpaid Invoices</p>
            <h3>{totals.unpaid}</h3>
          </div>
        </Col>
        <Col md={3}>
          <div className="summary-card">
            <p className="summary-label">Outstanding Amount</p>
            <h3>₹{totals.outstanding.toFixed(2)}</h3>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Search Invoice/Client</Form.Label>
            <Form.Control
              placeholder="Invoice number or client name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Bill Type</Form.Label>
            <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="gst">GST Bills</option>
              <option value="non-gst">Non-GST Bills</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>&nbsp;</Form.Label>
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
            >
              Clear Filters
            </Button>
          </Form.Group>
        </Col>
      </Row>

      {/* Bills Table */}
      {loading ? (
        <Alert variant="info">Loading billing history...</Alert>
      ) : filteredBills.length === 0 ? (
        <Alert variant="secondary">No bills found matching your filters.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Client Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.billId}>
                  <td>
                    <strong>{bill.invoiceNo}</strong>
                  </td>
                  <td>{bill.clientName}</td>
                  <td>{new Date(bill.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge bg-${bill.type === 'gst' ? 'primary' : 'success'}`}>
                      {bill.type === 'gst' ? 'GST' : 'Non-GST'}
                    </span>
                  </td>
                  <td className="text-end">{parseFloat(bill.total || 0).toFixed(2)}</td>
                  <td>
                    <span className={`badge bg-${(bill.status || 'unpaid') === 'paid' ? 'success' : 'danger'}`}>
                      {(bill.status || 'unpaid').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {(bill.status || 'unpaid') === 'unpaid' && (
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => handleMarkAsPaid(bill.billId)}
                        className="me-2"
                      >
                        Mark Paid
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteBill(bill.billId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default BillingHistory;
