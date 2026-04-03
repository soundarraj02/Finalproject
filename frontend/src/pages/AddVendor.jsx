import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { addVendor, VENDOR_TYPES } from '../utils/vendorData';

const AddVendor = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorType: '',
    mobileNumber: '',
    emailId: '',
    address: '',
    currentBalance: '',
    paidAmount: '',
    remainingAmount: '',
    comments: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.vendorName.trim()) return 'Vendor name is required.';
    if (!formData.vendorType) return 'Vendor type is required.';
    if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) return 'Mobile number must be 10 digits.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) return 'Please enter a valid email ID.';
    if (!formData.address.trim()) return 'Address is required.';
    if (formData.currentBalance === '') return 'Current balance is required.';
    if (formData.paidAmount === '') return 'Paid amount is required.';
    if (formData.remainingAmount === '') return 'Remaining amount is required.';
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
      addVendor(formData);
      setSuccess('Vendor registered successfully. Redirecting...');
      setTimeout(() => navigate('/vendor/vendor-list'), 900);
    } catch {
      setError('Failed to save vendor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Button variant="outline-primary" onClick={() => navigate('/vendor/vendor-list')}>Vendor</Button>
          <h4 className="mb-0">Register Vendor</h4>
          <Button variant="outline-secondary" onClick={() => navigate('/vendor')}>Vendor {'>'} Add Vendor</Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vendor Name *</Form.Label>
                  <Form.Control name="vendorName" value={formData.vendorName} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vendor Type *</Form.Label>
                  <Form.Select name="vendorType" value={formData.vendorType} onChange={handleInputChange}>
                    <option value="">Select Vendor Type</option>
                    {VENDOR_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mobile Number *</Form.Label>
                  <Form.Control name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email ID *</Form.Label>
                  <Form.Control name="emailId" value={formData.emailId} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Address *</Form.Label>
                  <Form.Control as="textarea" rows={3} name="address" value={formData.address} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Current Balance *</Form.Label>
                  <Form.Control type="number" name="currentBalance" value={formData.currentBalance} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Paid Amount *</Form.Label>
                  <Form.Control type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Remaining Amount *</Form.Label>
                  <Form.Control type="number" name="remainingAmount" value={formData.remainingAmount} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Comments</Form.Label>
                  <Form.Control name="comments" value={formData.comments} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button type="button" variant="outline-secondary" onClick={() => navigate('/vendor/vendor-list')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Register Vendor'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddVendor;
