import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { addCustomer, getNextInvoiceNumber, INDIAN_STATES } from '../utils/customerData';

const AddCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    address: '',
    contactNumber: '',
    date: '',
    state: '',
    invoiceNumber: location.state?.invoiceNumber || '',
    gstIn: '',
  });

  useEffect(() => {
    if (!formData.invoiceNumber) {
      setFormData((prev) => ({ ...prev, invoiceNumber: getNextInvoiceNumber() }));
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.clientName.trim()) return 'Client name is required.';
    if (!formData.address.trim()) return 'Address is required.';
    if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) return 'Contact number must be 10 digits.';
    if (!formData.date) return 'Date is required.';
    if (!formData.state) return 'State is required.';
    if (!formData.invoiceNumber) return 'Invoice number is required.';
    if (!formData.gstIn.trim()) return 'GST IN is required.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      addCustomer(formData);
      setSuccess('Customer registered successfully. Redirecting...');
      setTimeout(() => navigate('/customer/customer-list'), 900);
    } catch {
      setError('Failed to register customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Button variant="outline-primary" onClick={() => navigate('/customer')}>
            GST Invoice
          </Button>
          <h4 className="mb-0">Register Customer</h4>
          <Button variant="outline-secondary" onClick={() => navigate('/customer')}>
            Customer {'>'} Add Customer
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Client Name *</Form.Label>
                  <Form.Control
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="Enter client name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Contact Number *</Form.Label>
                  <Form.Control
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit contact number"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date *</Form.Label>
                  <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>State *</Form.Label>
                  <Form.Select name="state" value={formData.state} onChange={handleInputChange}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Invoice Number *</Form.Label>
                  <Form.Control name="invoiceNumber" value={formData.invoiceNumber} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>GST IN *</Form.Label>
                  <Form.Control
                    name="gstIn"
                    value={formData.gstIn}
                    onChange={handleInputChange}
                    placeholder="Enter GST IN"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" type="button" onClick={() => navigate('/customer')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Register Customer'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddCustomer;
